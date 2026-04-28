import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { RevendedorFormPayload } from "../types";
import { getSupabaseServer } from "../server";

export interface SubmitRevendedorOptions {
  /** Exige email no payload. Default: false (permite forms sem email). */
  requireEmail?: boolean;
  /** Exige site no payload. Default: false. */
  requireSite?: boolean;
  /** Exige instagram/redes no payload. Default: false. */
  requireInstagram?: boolean;
  /** Envia contato para o ActiveCampaign se AC_* estiverem configuradas. Default: true. */
  integrateActiveCampaign?: boolean;
}

function buildContactEmail(payload: RevendedorFormPayload): string {
  if (payload.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return payload.email;
  }
  const safe = payload.telefoneWhatsapp.replace(/\D/g, "").slice(-8) || "revendedor";
  return `revendedor-${safe}-${Date.now()}@placeholder.pedireito`;
}

function missingFieldsMessage(opts: SubmitRevendedorOptions): string {
  const base = ["nome", "cidade", "telefone"];
  if (opts.requireEmail) base.push("e-mail");
  if (opts.requireSite) base.push("site");
  if (opts.requireInstagram) base.push("Instagram");
  return `Campos obrigatórios: ${base.join(", ")}`;
}

export function createSubmitRevendedorHandler(options: SubmitRevendedorOptions = {}) {
  const opts: Required<SubmitRevendedorOptions> = {
    requireEmail: false,
    requireSite: false,
    requireInstagram: false,
    integrateActiveCampaign: true,
    ...options,
  };

  return async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Método não permitido" });
    }

    let payload: RevendedorFormPayload;
    try {
      const body = req.body as RevendedorFormPayload;
      const missing =
        !body?.nomeCompleto?.trim() ||
        !body?.cidadeEstado?.trim() ||
        !body?.telefoneWhatsapp?.trim() ||
        (opts.requireEmail && !body?.email?.trim()) ||
        (opts.requireSite && !body?.site?.trim()) ||
        (opts.requireInstagram && !body?.instagramRedes?.trim());

      if (missing) {
        return res.status(400).json({ error: missingFieldsMessage(opts) });
      }
      payload = body;
    } catch {
      return res.status(400).json({ error: "Corpo da requisição inválido" });
    }

    let savedToSupabase = false;
    let acSuccess = false;

    const supabase = getSupabaseServer();
    if (supabase) {
      try {
        const { error } = await supabase.from("revendedores").insert({
          nome_completo: payload.nomeCompleto.trim(),
          empresa_loja: payload.empresaLoja?.trim() || null,
          cnpj: payload.cnpj?.trim() || null,
          cidade_estado: payload.cidadeEstado.trim(),
          telefone_whatsapp: payload.telefoneWhatsapp.trim(),
          email: payload.email?.trim() || null,
          site: payload.site?.trim() || null,
          instagram_redes: payload.instagramRedes?.trim() || null,
          tempo_mercado: payload.tempoMercado?.trim() || null,
          entende_proposito: payload.entendeProposito || null,
          vende_calcados_vestuario: payload.vendeCalcadosVestuario || null,
          forma_venda: payload.formaVenda || null,
          o_que_chamou_atencao: payload.oQueChamouAtencao?.trim() || null,
          segue_padroes_marca: payload.seguePadroesMarca || null,
          pares_por_mes: payload.paresPorMes?.trim() || null,
        });
        if (error) {
          console.error("Supabase insert error:", error);
        } else {
          savedToSupabase = true;
        }
      } catch (e) {
        console.error("Supabase error:", e);
      }
    }

    const { AC_API_URL, AC_API_KEY, AC_LIST_ID, AC_CUSTOM_FIELD_ID } = process.env;
    if (opts.integrateActiveCampaign && AC_API_URL && AC_API_KEY && AC_LIST_ID) {
      try {
        const apiUrl = AC_API_URL.replace(/\/$/, "");
        const email = buildContactEmail(payload);
        const firstName =
          payload.nomeCompleto.trim().split(/\s+/)[0] ?? payload.nomeCompleto.trim();
        const lastName = payload.nomeCompleto.trim().split(/\s+/).slice(1).join(" ") || "";

        const contactPayload = {
          contact: {
            email,
            firstName,
            lastName,
            phone: payload.telefoneWhatsapp.trim(),
            fieldValues: [] as { field: string; value: string }[],
          },
        };

        if (AC_CUSTOM_FIELD_ID) {
          contactPayload.contact.fieldValues.push({
            field: AC_CUSTOM_FIELD_ID,
            value: JSON.stringify({
              empresaLoja: payload.empresaLoja,
              cnpj: payload.cnpj,
              cidadeEstado: payload.cidadeEstado,
              instagramRedes: payload.instagramRedes,
              tempoMercado: payload.tempoMercado,
              entendeProposito: payload.entendeProposito,
              vendeCalcadosVestuario: payload.vendeCalcadosVestuario,
              formaVenda: payload.formaVenda,
              oQueChamouAtencao: payload.oQueChamouAtencao,
              seguePadroesMarca: payload.seguePadroesMarca,
              paresPorMes: payload.paresPorMes,
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
            const listRes = await fetch(`${apiUrl}/api/3/contactLists`, {
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
            if (listRes.ok) acSuccess = true;
          }
        }
      } catch (e) {
        console.error("ActiveCampaign error:", e);
      }
    }

    if (savedToSupabase || acSuccess) {
      return res.status(200).json({
        success: true,
        supabase: savedToSupabase,
        activeCampaign: acSuccess,
      });
    }

    if (!supabase) {
      return res
        .status(500)
        .json({ error: "Configure SUPABASE_URL e SUPABASE_ANON_KEY na Vercel" });
    }

    return res.status(502).json({ error: "Falha ao salvar o questionário. Tente novamente." });
  };
}

export default createSubmitRevendedorHandler();
