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
 *
 * Fallback de dev: o handler `/api/submit-lead` é uma function Vercel/CF Pages e
 * não roda no Vite dev server (404). Em modo DEV, tratamos 404 como sucesso
 * simulado, logando o payload no console — assim a UX dos forms é testável
 * localmente sem subir backend. Em produção isso nunca acontece.
 */
export function useLeadSubmit<TData extends object>({
  endpoint = "/api/submit-lead",
  tipo,
}: UseLeadSubmitOptions): UseLeadSubmitResult<TData> {
  const [state, setState] = useState<LeadSubmitState>({ status: "idle", error: null });

  async function submit(data: TData): Promise<boolean> {
    setState({ status: "submitting", error: null });
    const origem = getOrigem();
    const payload = {
      tipo,
      dados: data,
      origem,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Aceitamos sucesso mesmo sem JSON estruturado, desde que 2xx
      let body: { error?: string } | null = null;
      try {
        body = (await res.json()) as { error?: string };
      } catch {
        body = null;
      }

      if (res.status === 404 && import.meta.env.DEV) {
        console.warn(
          `[useLeadSubmit] ${endpoint} retornou 404 em dev. ` +
          `Tratando como sucesso simulado (Vite dev server não executa functions Vercel/CF Pages).`,
        );
        console.info(`[useLeadSubmit] Payload enviado:`, payload);
        await new Promise((r) => setTimeout(r, 350));
        setState({ status: "submitted", error: null });
        return true;
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
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(
          `[useLeadSubmit] Falha de rede em dev. Tratando como sucesso simulado.`,
          err,
        );
        console.info(`[useLeadSubmit] Payload enviado:`, payload);
        setState({ status: "submitted", error: null });
        return true;
      }
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
