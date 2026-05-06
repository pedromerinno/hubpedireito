import { z } from "zod";

export const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome muito curto")
    .max(80, "Nome muito longo")
    .regex(/^[\p{L}\s'-]+$/u, "Use apenas letras"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido")
    .max(120),
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20)
    .regex(/^[\d\s()+\-]+$/, "Formato inválido"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Você precisa concordar pra continuar" }),
  }),
  hp_url: z.string().max(0, "spam").optional(),
});

export type LeadFormInput = z.infer<typeof leadSchema>;

export type LeadPayload = {
  nome: string;
  email: string;
  telefone: string;
  source: string;
  url: string;
  referrer: string;
  utm: Record<string, string>;
  ts: string;
  turnstile_token: string;
};

const BUFFER_KEY = "pd_lead_buffer_v1";
const ENDPOINT = "/api/lead";
const MAX_RETRIES = 2;

function readUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "ref",
    "src",
  ]) {
    const v = params.get(k);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}

export function buildPayload(
  form: Omit<LeadFormInput, "consent" | "hp_url">,
  turnstileToken: string,
  source = "lp-linha-de-frente",
): LeadPayload {
  return {
    nome: form.nome,
    email: form.email,
    telefone: form.telefone.replace(/\s+/g, " ").trim(),
    source,
    url: typeof window !== "undefined" ? window.location.href : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    utm: readUtms(),
    ts: new Date().toISOString(),
    turnstile_token: turnstileToken,
  };
}

async function postOnce(payload: LeadPayload, signal: AbortSignal) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json().catch(() => ({}));
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: true } | { ok: false; reason: "buffered" | "fatal"; message: string }> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    try {
      await postOnce(payload, ctrl.signal);
      clearTimeout(timeout);
      return { ok: true };
    } catch (err) {
      clearTimeout(timeout);
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
      }
    }
  }
  bufferLead(payload);
  return {
    ok: false,
    reason: "buffered",
    message: lastErr instanceof Error ? lastErr.message : "unknown error",
  };
}

function bufferLead(payload: LeadPayload) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(BUFFER_KEY);
    const arr: LeadPayload[] = raw ? JSON.parse(raw) : [];
    arr.push(payload);
    window.localStorage.setItem(BUFFER_KEY, JSON.stringify(arr.slice(-20)));
  } catch {
    // localStorage cheio / privacy mode — desiste silenciosamente
  }
}

export async function flushBufferedLeads(): Promise<number> {
  if (typeof window === "undefined") return 0;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(BUFFER_KEY);
  } catch {
    return 0;
  }
  if (!raw) return 0;
  let arr: LeadPayload[] = [];
  try {
    arr = JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(BUFFER_KEY);
    return 0;
  }
  if (arr.length === 0) return 0;

  const remaining: LeadPayload[] = [];
  let sent = 0;
  for (const lead of arr) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 8000);
      await postOnce(lead, ctrl.signal);
      clearTimeout(timeout);
      sent++;
    } catch {
      remaining.push(lead);
    }
  }
  try {
    if (remaining.length === 0) {
      window.localStorage.removeItem(BUFFER_KEY);
    } else {
      window.localStorage.setItem(BUFFER_KEY, JSON.stringify(remaining));
    }
  } catch {
    // ignora
  }
  return sent;
}

export function formatPhoneBR(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
