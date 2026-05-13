import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@pedireito/db/client";
import { getOrigem } from "@/lib/origem";
import type { PortaId } from "@/lib/portas";

export type LeadStatus = "idle" | "submitting" | "submitted" | "error";

export interface LeadSubmitState {
  status: LeadStatus;
  error: string | null;
}

export interface UseLeadSubmitResult<TData> {
  state: LeadSubmitState;
  submit: (data: TData) => Promise<boolean>;
  reset: () => void;
}

interface UseLeadSubmitOptions {
  /** Tipo da porta. Vai junto no payload pra segmentar. */
  tipo: PortaId;
}

/** Heurística pra extrair os campos-chave (nome, email, whatsapp) de um payload genérico. */
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

/**
 * Submissão de lead direto pro Supabase via anon key.
 *
 * - Funciona em dev e prod sem precisar de function (Vercel/CF Pages).
 * - RLS garante que anon só consegue INSERT (não consegue listar leads alheios).
 * - O e-mail é a chave de contato; nome/whatsapp são opcionais e serão coletados
 *   no follow-up manual.
 */
export function useLeadSubmit<TData extends object>({
  tipo,
}: UseLeadSubmitOptions): UseLeadSubmitResult<TData> {
  const [state, setState] = useState<LeadSubmitState>({ status: "idle", error: null });

  async function submit(data: TData): Promise<boolean> {
    setState({ status: "submitting", error: null });

    if (!isSupabaseConfigured || !supabase) {
      console.error(
        "[useLeadSubmit] Supabase não configurado. " +
        "Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.",
      );
      setState({
        status: "error",
        error: "Configuração ausente. Tente novamente em instantes.",
      });
      return false;
    }

    const dados = data as unknown as Record<string, unknown>;
    const contact = extractContact(dados);
    const origem = getOrigem();

    try {
      const { error } = await supabase.from("leads").insert({
        tipo,
        nome_completo: contact.nome || null,
        email: contact.email || null,
        telefone_whatsapp: contact.whatsapp || null,
        dados,
        origem,
        submitted_at: new Date().toISOString(),
      });

      if (error) {
        console.error("[useLeadSubmit] Supabase insert error:", error);
        setState({
          status: "error",
          error: friendlyMessage(error.message),
        });
        return false;
      }

      setState({ status: "submitted", error: null });
      return true;
    } catch (err) {
      console.error("[useLeadSubmit] Exception:", err);
      setState({
        status: "error",
        error: "Erro de conexão. Tente novamente.",
      });
      return false;
    }
  }

  function reset() {
    setState({ status: "idle", error: null });
  }

  return { state, submit, reset };
}

/** Converte erros técnicos do Postgres em mensagens humanas. */
function friendlyMessage(raw: string): string {
  if (/leads_has_contact_check/i.test(raw)) {
    return "Informe ao menos um e-mail ou WhatsApp.";
  }
  if (/duplicate key|already exists/i.test(raw)) {
    return "Esse lead já foi recebido. Obrigado!";
  }
  if (/permission denied|RLS|row-level security/i.test(raw)) {
    return "Bloqueio de permissão. Avise o time.";
  }
  return "Falha ao enviar. Tente novamente em instantes.";
}
