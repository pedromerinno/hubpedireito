// Pages Function: proxy seguro do form de captura.
//
// 1. Recebe POST do front em /api/lead (mesma origem do site)
// 2. Valida Turnstile token contra a CF
// 3. Re-valida payload (defesa em profundidade vs front comprometido)
// 4. Repassa pro webhook n8n com o header `auth` secreto
//
// Env vars necessárias (CF Pages → Settings → Environment Variables):
//   N8N_WEBHOOK_URL        URL completa do webhook n8n
//   N8N_AUTH_SECRET        valor do header `auth` esperado pelo n8n
//   TURNSTILE_SECRET       Secret Key do Turnstile site

interface Env {
  N8N_WEBHOOK_URL: string;
  N8N_AUTH_SECRET: string;
  TURNSTILE_SECRET: string;
}

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

  let n8nResp: Response;
  try {
    n8nResp = await fetch(env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        auth: env.N8N_AUTH_SECRET,
        "user-agent": "pd-cf-pages-fn/1.0",
      },
      body: JSON.stringify(payload),
      // CF Workers: timeout total da subrequest é ~30s; nada a configurar
    });
  } catch (err) {
    return json(
      { error: "upstream unreachable", detail: err instanceof Error ? err.message : "?" },
      502,
      cors,
    );
  }

  if (!n8nResp.ok) {
    const text = await n8nResp.text().catch(() => "");
    return json(
      { error: "upstream error", status: n8nResp.status, body: text.slice(0, 200) },
      502,
      cors,
    );
  }

  return json({ ok: true }, 200, cors);
};
