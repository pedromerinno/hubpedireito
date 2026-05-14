// Reforço client-side do redirect pós-lançamento.
//
// Camada principal: Pages Function `functions/_middleware.ts` faz 302 no edge.
// Esta camada cobre o caso de aba já aberta antes do horário: a cada 10s
// verifica se já passou e dispara redirect via window.location.replace.

const REDIRECT_AT_MS = Date.UTC(2026, 4, 14, 12, 0, 0); // 2026-05-14T12:00:00Z = 09:00 BRT
const REDIRECT_TO = "https://usepedireito.com.br/";

let intervalId: number | null = null;

export function startLaunchRedirectGuard(): void {
  if (typeof window === "undefined") return;
  if (intervalId !== null) return;

  const check = () => {
    if (Date.now() >= REDIRECT_AT_MS) {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      window.location.replace(REDIRECT_TO);
    }
  };

  check();
  intervalId = window.setInterval(check, 10_000);
}
