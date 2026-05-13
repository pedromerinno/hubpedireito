# Runbook — Cloudflare Pages: revendedores

> Subdomínio: `familia.usepedireito.com.br`
> CF Pages project: `revendedores`
> Branch de deploy: `deploy/cf-pages-revendedores`
> Deploy automático via GitHub Actions: `.github/workflows/deploy-cf-pages-revendedores.yml`

---

## Pré-requisitos pra qualquer comando

```bash
source ~/.cloudflare/ids.env       # CF_ACCOUNT_ID, CF_ZONE_ID, CF_DOMAIN
export TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')
```

IDs de referência:
- `CF_ACCOUNT_ID=ecb2efe2bb765511e9a2a35e8ea69b82`
- `CF_ZONE_ID=7b395436dafbd5aa2a00250936d5c69d`
- CF Pages project: `revendedores` (subdomain: `revendedores.pages.dev`)

---

## Setup inicial (executar uma vez)

### 1. Secrets do GitHub repo

Em `Settings → Secrets and variables → Actions`, garantir que existam:

- `CF_API_TOKEN` — token com permissão `Cloudflare Pages: Edit`
- `CF_ACCOUNT_ID` — `ecb2efe2bb765511e9a2a35e8ea69b82`
- `VITE_SUPABASE_URL` — URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` — anon key (pública, vai no bundle)

`CF_API_TOKEN` e `CF_ACCOUNT_ID` já existem pro `linha-de-frente` — o workflow reusa.

### 2. Custom domain no CF Pages

Dashboard → Pages → `revendedores` → **Custom domains** → **Set up a custom domain** → `familia.usepedireito.com.br`.

A CF cria automaticamente o CNAME na zone `usepedireito.com.br` apontando pro projeto.

Validar:
```bash
dig +short familia.usepedireito.com.br
# Esperado: CNAME → revendedores.pages.dev → IPs da CF (104.x / 172.x)
```

---

## 🟡 Operações de rotina

### Trigger deploy manual (sem push)

GitHub: Actions → **Deploy revendedores → Cloudflare Pages** → **Run workflow** → branch `deploy/cf-pages-revendedores`.

Ou via CLI:
```bash
cd ~/Projetos/PéDireito/pd-lancamento/hubpedireito/web
npm install --no-audit --no-fund
npx turbo run build --filter=@pedireito/revendedores

cd ..
export CLOUDFLARE_API_TOKEN=$TOKEN
export CLOUDFLARE_ACCOUNT_ID=$CF_ACCOUNT_ID
npx wrangler pages deploy web/apps/revendedores/dist \
  --project-name=revendedores \
  --branch=production
```

### Ver últimos deploys
```bash
npx wrangler pages deployment list --project-name=revendedores | head -10
```

### Tail de logs ao vivo
```bash
npx wrangler pages deployment tail --project-name=revendedores
```

---

## 🔴 Emergência 1 — Deploy ruim, voltar versão anterior

**Via dashboard (mais simples):**
https://dash.cloudflare.com/$CF_ACCOUNT_ID/pages/view/revendedores/deployments → ⋯ no deploy anterior bom → **Rollback to this deployment**.

**Via CLI:**
```bash
npx wrangler pages deployment list --project-name=revendedores | head -10
# Copiar o ID do deploy bom e promover via dashboard (Wrangler ainda não tem comando direto pra rollback).
```

---

## 🔴 Emergência 2 — Cloudflare Pages fora, fallback pra Vercel

**Pré-condição**: o deploy Vercel original (subdomínio `revenda.usepedireito.com.br` ou similar) precisa estar vivo. Os handlers em `web/apps/revendedores/api/submit-*.ts` foram marcados como `@deprecated` mas mantidos justamente pra esse rollback.

Se for cutover de DNS: voltar o CNAME `familia.usepedireito.com.br` pra Vercel via API ou dashboard CF. A submissão de lead continua funcionando independente do host (vai direto pro Supabase).

---

## 🟢 Validação pós-deploy

Smoke test mínimo:

```bash
# 1. Página principal carrega
curl -sI https://familia.usepedireito.com.br/ | head -5

# 2. SPA fallback funciona (rota inexistente → 200 + index.html)
curl -sI https://familia.usepedireito.com.br/qualquer-coisa | head -5

# 3. Headers de segurança aplicados
curl -sI https://familia.usepedireito.com.br/ | grep -iE "strict-transport|content-security|x-frame"
```

Manual:
- Abrir `/`, `/franquia`, `/representante`, `/revendedor`, `/investidor`, `/patrocinador`, `/casamento`, `/faq` — cada rota tem que renderizar (não 404).
- Submeter um lead de teste em qualquer porta → verificar `leads` table no Supabase.
- Inspecionar console: zero erros de CSP.

---

## Notas

- `vercel.json` e `api/*.ts` são **dead code no CF Pages** — só rodam na Vercel. Manter até o cutover de DNS ser confirmado estável, depois remover.
- Submissão de lead é **client-side direto pro Supabase** via anon key. Segurança vem das RLS policies + grants (ver `supabase/migrations/`).
- CSP atual bloqueia scripts externos. Se adicionar Meta Pixel / GA / Turnstile no futuro, atualizar `web/apps/revendedores/public/_headers` (exemplo no app `linha-de-frente`).
