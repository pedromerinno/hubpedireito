// Pages Function middleware: roda em TODO request antes de servir o asset estático.
//
// Após 2026-05-14T12:00:00Z (09:00 BRT) retorna 302 pra usepedireito.com.br.
// Antes disso, deixa o pipeline padrão da CF Pages servir o site normalmente.
//
// Independente do relógio do visitante — o check usa Date.now() no edge da CF.

const REDIRECT_AT_MS = Date.UTC(2026, 4, 14, 12, 0, 0); // 2026-05-14T12:00:00Z = 09:00 BRT
const REDIRECT_TO = "https://usepedireito.com.br/";

export const onRequest = async (ctx: { next: () => Promise<Response> }): Promise<Response> => {
  if (Date.now() >= REDIRECT_AT_MS) {
    return new Response(null, {
      status: 302,
      headers: {
        location: REDIRECT_TO,
        "cache-control": "no-store",
        "x-redirect-reason": "post-launch",
      },
    });
  }
  return ctx.next();
};
