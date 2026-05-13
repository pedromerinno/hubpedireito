import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseServer } from "../server";

export type LeadTipo =
  | "franquia"
  | "representante"
  | "revendedor"
  | "investidor"
  | "patrocinador"
  | "casamento";

export interface LeadOrigem {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPath?: string;
}

export interface LeadPayload {
  tipo: LeadTipo;
  dados: Record<string, unknown>;
  origem?: LeadOrigem;
  submittedAt?: string;
}

export interface SubmitLeadOptions {
  integrateActiveCampaign?: boolean;
}

const VALID_TIPOS: LeadTipo[] = [
  "franquia",
  "representante",
  "revendedor",
  "investidor",
  "patrocinador",
  "casamento",
];

/** Heurística pra extrair os campos-chave (nome, email, whatsapp) do payload genérico. */
function extractContact(dados: Record<string, unknown>) {
  const get = (key: string) => {
    const v = dados[key];
    return typeof v === "string" ? v.trim() : "";
  };

  return {
    nome:
      get("nomeCompleto") ||
      get("contatoNome") ||
      get("razaoSocial") ||
      "",
    email:
      get("email") ||
      get("contatoEmail") ||
      "",
    whatsapp:
      get("whatsapp") ||
      get("telefoneWhatsapp") ||
      get("contatoWhatsapp") ||
      "",
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function createSubmitLeadHandler(options: SubmitLeadOptions = {}) {
  const { integrateActiveCampaign = true } = options;

  return async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Método não permitido" });
    }

    let payload: LeadPayload;
    try {
      payload = req.body as LeadPayload;
    } catch {
      return res.status(400).json({ error: "Corpo da requisição inválido" });
    }

    if (!payload?.tipo || !VALID_TIPOS.includes(payload.tipo)) {
      return res.status(400).json({ error: "Tipo de lead inválido" });
    }
    if (!payload?.dados || typeof payload.dados !== "object") {
      return res.status(400).json({ error: "Dados ausentes" });
    }

    const contact = extractContact(payload.dados);
    if (!contact.nome || !contact.whatsapp) {
      return res.status(400).json({ error: "Nome e WhatsApp são obrigatórios" });
    }

    let savedToSupabase = false;
    let supabaseError: string | null = null;
    let acSuccess = false;

    // 1) Supabase — tenta inserir na tabela `leads`
    const supabase = getSupabaseServer();
    if (supabase) {
      try {
        const { error } = await supabase.from("leads").insert({
          tipo: payload.tipo,
          nome_completo: contact.nome,
          email: contact.email || null,
          telefone_whatsapp: contact.whatsapp,
          dados: payload.dados,
          origem: payload.origem ?? null,
          submitted_at: payload.submittedAt ?? new Date().toISOString(),
        });

        if (error) {
          supabaseError = error.message;
          console.error("[submit-lead] Supabase insert error:", error);
        } else {
          savedToSupabase = true;
        }
      } catch (e) {
        supabaseError = e instanceof Error ? e.message : String(e);
        console.error("[submit-lead] Supabase exception:", e);
      }
    }

    // 2) ActiveCampaign — push do contato com tag "Lead: <tipo>"
    const { AC_API_URL, AC_API_KEY, AC_LIST_ID, AC_CUSTOM_FIELD_ID } = process.env;
    if (integrateActiveCampaign && AC_API_URL && AC_API_KEY && AC_LIST_ID) {
      try {
        const apiUrl = AC_API_URL.replace(/\/$/, "");
        const email = isValidEmail(contact.email)
          ? contact.email
          : `lead-${payload.tipo}-${contact.whatsapp.replace(/\D/g, "").slice(-8) || "anon"}-${Date.now()}@placeholder.pedireito`;
        const [firstName, ...rest] = contact.nome.split(/\s+/);
        const lastName = rest.join(" ");

        const contactPayload = {
          contact: {
            email,
            firstName,
            lastName,
            phone: contact.whatsapp,
            fieldValues: [] as { field: string; value: string }[],
          },
        };

        if (AC_CUSTOM_FIELD_ID) {
          contactPayload.contact.fieldValues.push({
            field: AC_CUSTOM_FIELD_ID,
            value: JSON.stringify({
              tipo: payload.tipo,
              dados: payload.dados,
              origem: payload.origem,
            }),
          });
        }

        const createRes = await fetch(`${apiUrl}/api/3/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Token": AC_API_KEY,
          },
          body: JSON.stringify(contactPayload),
        });

        if (createRes.ok) {
          const contactData = (await createRes.json()) as { contact?: { id?: number } };
          const contactId = contactData.contact?.id;
          if (contactId) {
            await fetch(`${apiUrl}/api/3/contactLists`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Api-Token": AC_API_KEY,
              },
              body: JSON.stringify({
                contactList: {
                  list: Number(AC_LIST_ID),
                  contact: contactId,
                  status: 1,
                },
              }),
            });

            // Tag: Lead: <tipo>
            await fetch(`${apiUrl}/api/3/contactTags`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Api-Token": AC_API_KEY,
              },
              body: JSON.stringify({
                contactTag: { contact: contactId, tag: `lead-${payload.tipo}` },
              }),
            }).catch(() => {});

            acSuccess = true;
          }
        } else {
          console.error("[submit-lead] AC create failed:", createRes.status, await createRes.text());
        }
      } catch (e) {
        console.error("[submit-lead] ActiveCampaign exception:", e);
      }
    }

    if (savedToSupabase || acSuccess) {
      return res.status(200).json({
        success: true,
        tipo: payload.tipo,
        supabase: savedToSupabase,
        activeCampaign: acSuccess,
      });
    }

    if (!supabase) {
      // Sem Supabase configurado: ack mesmo assim para não quebrar UX em dev,
      // mas alerta no log que o lead foi perdido.
      console.warn("[submit-lead] Lead não persistido (Supabase ausente):", {
        tipo: payload.tipo,
        contact,
      });
      return res.status(200).json({
        success: true,
        tipo: payload.tipo,
        supabase: false,
        activeCampaign: false,
        warning: "Lead recebido mas não persistido — configure SUPABASE_URL e SUPABASE_ANON_KEY.",
      });
    }

    return res.status(502).json({
      error: "Falha ao salvar o lead. Tente novamente.",
      details: supabaseError ?? undefined,
    });
  };
}

export default createSubmitLeadHandler();
