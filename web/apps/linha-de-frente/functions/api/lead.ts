// Pages Function: proxy seguro do form de captura.
//
// 1. Recebe POST do front em /api/lead (mesma origem do site)
// 2. Valida Turnstile token contra a CF
// 3. Re-valida payload (defesa em profundidade vs front comprometido)
// 4. Encaminha pra capt-api (VPS Hetzner) como destino primário
// 5. Se capt-api falhar, encaminha direto pro n8n com `fallback_reason`
//    pra disparar re-sync no n8n (POST /v1/leads/import com external_id).
//
// Env vars necessárias (CF Pages → Settings → Environment Variables):
//   CAPT_API_URL           https://capt-api.usepedireito.com.br/v1/leads
//   CAPT_API_SECRET        valor do header `X-Captacao-Secret` esperado pela capt-api
//   N8N_WEBHOOK_URL        URL completa do webhook n8n (fallback/paralelo)
//   N8N_AUTH_SECRET        valor do header `auth` esperado pelo n8n
//   TURNSTILE_SECRET       Secret Key do Turnstile site

interface Env {
  N8N_WEBHOOK_URL: string;
  N8N_AUTH_SECRET: string;
  TURNSTILE_SECRET: string;
  // Captação primária (VPS Hetzner via Cloudflare proxy)
  CAPT_API_URL: string;
  CAPT_API_SECRET: string;
}

// Estratégia: capt-api é o destino primário. Se ela falhar (timeout/5xx),
// chamamos o n8n diretamente como fallback, marcando o payload com
// `fallback_reason` pra o n8n disparar re-sync de volta pra capt-api
// (via /v1/leads/import com external_id idempotente).
//
// Quando capt-api responde OK, o relay pro n8n é feito ASSÍNCRONAMENTE
// pelo worker `src/n8n-relay.ts` da própria capt-api — não re-postamos
// daqui pra evitar duplicar entradas no n8n.

const ALLOWED_ORIGINS = new Set([
  "https://lancamento.usepedireito.com.br",
  "https://linha-de-frente.pages.dev",
]);

const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      ...extraHeaders,
    },
  });

const corsHeaders = (origin: string | null): Record<string, string> => {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
      vary: "origin",
    };
  }
  return {};
};

export const onRequestOptions: PagesFunction<Env> = ({ request }) => {
  const origin = request.headers.get("origin");
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};

export const onRequestGet: PagesFunction = () =>
  json({ error: "method not allowed" }, 405);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get("origin");
  const cors = corsHeaders(origin);

  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: "origin not allowed" }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400, cors);
  }

  const nome = String(body.nome ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const telefone = String(body.telefone ?? "").trim();
  const turnstileToken = String(body.turnstile_token ?? "").trim();
  const source = String(body.source ?? "lp-linha-de-frente").slice(0, 60);
  const url = String(body.url ?? "").slice(0, 500);
  const referrer = String(body.referrer ?? "").slice(0, 500);
  const ts = String(body.ts ?? new Date().toISOString());
  const utm = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<
    string,
    unknown
  >;

  if (nome.length < 2 || nome.length > 80) {
    return json({ error: "nome inválido" }, 400, cors);
  }
  if (!/^[\p{L}\s'-]+$/u.test(nome)) {
    return json({ error: "nome inválido" }, 400, cors);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
    return json({ error: "email inválido" }, 400, cors);
  }
  const phoneDigits = telefone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    return json({ error: "telefone inválido" }, 400, cors);
  }
  if (!turnstileToken || turnstileToken.length < 10) {
    return json({ error: "captcha ausente" }, 400, cors);
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for") ??
    "";

  const tsForm = new FormData();
  tsForm.append("secret", env.TURNSTILE_SECRET);
  tsForm.append("response", turnstileToken);
  if (ip) tsForm.append("remoteip", ip);
  let tsResp: { success: boolean; "error-codes"?: string[] };
  try {
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: tsForm },
    );
    tsResp = await r.json();
  } catch {
    return json({ error: "captcha verify failed" }, 502, cors);
  }
  if (!tsResp.success) {
    return json(
      { error: "captcha rejeitado", codes: tsResp["error-codes"] ?? [] },
      403,
      cors,
    );
  }

  const sanitizedUtm: Record<string, string> = {};
  for (const [k, v] of Object.entries(utm)) {
    if (typeof v === "string" && /^[a-z_][a-z0-9_]{0,40}$/i.test(k)) {
      sanitizedUtm[k] = v.slice(0, 120);
    }
  }

  const payload = {
    nome,
    email,
    telefone: phoneDigits,
    telefone_formatado: telefone,
    source,
    url,
    referrer,
    utm: sanitizedUtm,
    ip,
    user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? "",
    cf_country: request.headers.get("cf-ipcountry") ?? "",
    ts,
  };

  // ── Destino primário: capt-api (VPS Hetzner) ─────────────────────────────
  let captOk = false;
  let captError: string | undefined;
  try {
    const captResp = await fetch(env.CAPT_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Captacao-Secret": env.CAPT_API_SECRET,
        "user-agent": "pd-cf-pages-fn/2.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (captResp.ok) {
      captOk = true;
    } else {
      const body = await captResp.text().catch(() => "");
      captError = `status ${captResp.status} ${body.slice(0, 200)}`;
      console.log(JSON.stringify({ msg: "capt_api_non_ok", status: captResp.status }));
    }
  } catch (err) {
    captError = err instanceof Error ? err.message : String(err);
    console.log(JSON.stringify({ msg: "capt_api_failed", error: captError }));
  }

  // ── Fallback n8n: SÓ chama se capt-api falhou ────────────────────────────
  // Marca o payload com `fallback_reason` pra o IF do n8n distinguir e
  // disparar re-sync via POST /v1/leads/import (idempotente por external_id).
  const shouldHitN8n = !captOk;
  let n8nOk = false;
  if (shouldHitN8n) {
    try {
      const n8nResp = await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          auth: env.N8N_AUTH_SECRET,
          "user-agent": "pd-cf-pages-fn/2.1",
        },
        body: JSON.stringify({
          ...payload,
          fallback_reason: "capt_api_unreachable",
          capt_api_attempted_at: new Date().toISOString(),
          capt_api_error: captError ?? "unknown",
        }),
        signal: AbortSignal.timeout(5000),
      });
      n8nOk = n8nResp.ok;
      if (!n8nOk) {
        const body = await n8nResp.text().catch(() => "");
        console.log(JSON.stringify({ msg: "n8n_non_ok", status: n8nResp.status, body: body.slice(0, 200) }));
      }
    } catch (err) {
      console.log(JSON.stringify({
        msg: "n8n_failed",
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }

  // Se ambos falharam, retorna 502 — buffer offline do client absorve.
  // Se pelo menos 1 deu OK, retorna 200 (lead persistido em algum lugar).
  if (!captOk && !n8nOk) {
    return json(
      { error: "all upstreams failed", detail: captError ?? "unknown" },
      502,
      cors,
    );
  }

  return json({ ok: true, capt: captOk, n8n: n8nOk }, 200, cors);
};
