// Meta Pixel helpers — wrapper defensivo sobre window.fbq.
// O snippet base do Pixel é injetado em index.html no <head>; aqui só
// expomos atalhos pra eventos custom disparados a partir do React.
//
// Usa optional chaining em tudo: se Pixel falhar (adblock, bloqueio
// regional, falha de rede), o site continua funcionando normalmente.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
}

export interface LeadEventPayload {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}

export function trackLead(payload: LeadEventPayload = {}): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", payload);
}
