import { useState } from "react";
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
  /** Endpoint pra POST. Default: /api/submit-lead */
  endpoint?: string;
  /** Tipo da porta. Vai junto no payload pra segmentar no backend. */
  tipo: PortaId;
}

/**
 * Hook genérico de submissão de lead. Anexa metadados de origem (UTM, referrer)
 * automaticamente e centraliza estado de loading/erro.
 */
export function useLeadSubmit<TData extends object>({
  endpoint = "/api/submit-lead",
  tipo,
}: UseLeadSubmitOptions): UseLeadSubmitResult<TData> {
  const [state, setState] = useState<LeadSubmitState>({ status: "idle", error: null });

  async function submit(data: TData): Promise<boolean> {
    setState({ status: "submitting", error: null });
    try {
      const origem = getOrigem();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          dados: data,
          origem,
          submittedAt: new Date().toISOString(),
        }),
      });

      // Aceitamos sucesso mesmo sem JSON estruturado, desde que 2xx
      let body: { error?: string } | null = null;
      try {
        body = (await res.json()) as { error?: string };
      } catch {
        body = null;
      }

      if (!res.ok) {
        setState({
          status: "error",
          error: body?.error || "Falha ao enviar. Tente novamente.",
        });
        return false;
      }

      setState({ status: "submitted", error: null });
      return true;
    } catch {
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
