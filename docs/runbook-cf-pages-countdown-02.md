# Runbook — Cloudflare Pages: countdown-02

> Subdomínio: `contador.usepedireito.com.br`
> CF Pages project: `countdown-02`
> Branch de deploy: `deploy/cf-pages-countdown-02`
> Deploy automático via GitHub Actions: `.github/workflows/deploy-cf-pages-countdown-02.yml`

---

## Pré-requisitos pra qualquer comando

```bash
source ~/.cloudflare/ids.env       # CF_ACCOUNT_ID, CF_ZONE_ID, CF_DOMAIN
export TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')
```

IDs de referência:
- `CF_ACCOUNT_ID=ecb2efe2bb765511e9a2a35e8ea69b82`
- `CF_ZONE_ID=7b395436dafbd5aa2a00250936d5c69d`
- CF Pages project: `countdown-02` (subdomain: `countdown-02.pages.dev`)

---

## Setup inicial (executar uma vez)

### 1. Secrets do GitHub repo

Em `Settings → Secrets and variables → Actions`, garantir que existam:

- `CF_API_TOKEN` — token com permissão `Cloudflare Pages: Edit`
- `CF_ACCOUNT_ID` — `ecb2efe2bb765511e9a2a35e8ea69b82`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Todos já existem (compartilhados com `linha-de-frente` e `revendedores`).

### 2. Custom domain no CF Pages

Já configurado via API: `contador.usepedireito.com.br` apontando pro projeto `countdown-02`.

Validar:
```bash
dig +short contador.usepedireito.com.br
# Esperado: CNAME → countdown-02.pages.dev → IPs CF
```

---

## 🟡 Operações de rotina

### Trigger deploy manual (sem push)

GitHub: Actions → **Deploy countdown-02 → Cloudflare Pages** → **Run workflow** → branch `deploy/cf-pages-countdown-02`.

Ou via CLI:
```bash
cd ~/Projetos/PéDireito/pd-lancamento/hubpedireito/web
npm install --no-audit --no-fund
npx turbo run build --filter=@pedireito/countdown-02

cd ..
export CLOUDFLARE_API_TOKEN=$TOKEN
export CLOUDFLARE_ACCOUNT_ID=$CF_ACCOUNT_ID
npx wrangler pages deploy web/apps/countdown-02/dist \
  --project-name=countdown-02 \
  --branch=production
```

### Ver últimos deploys
```bash
npx wrangler pages deployment list --project-name=countdown-02 | head -10
```

---

## 🔴 Emergência — Deploy ruim, rollback

**Via dashboard (mais simples):**
https://dash.cloudflare.com/$CF_ACCOUNT_ID/pages/view/countdown-02/deployments → ⋯ no deploy anterior bom → **Rollback to this deployment**.

---

## Notas técnicas

- **Submissão de lead é client-side direto pro Supabase** via anon key. O form em `src/components/RevendedoresForm.tsx` insere em `public.leads` com `tipo: "revendedor"`. Segurança vem das RLS policies da tabela.
- `vercel.json` e `api/submit-revendedor.ts` são **dead code no CF Pages** — só rodavam na Vercel. Mantidos como rollback até o cutover de DNS ser confirmado estável; depois remover.
- A integração com ActiveCampaign feita pelo handler antigo (`createSubmitRevendedorHandler`) **não roda mais nesse deploy**. Se for crítica, portar pra CF Pages Function (modelo: `web/apps/linha-de-frente/functions/api/lead.ts`).
- CSP atual bloqueia scripts externos. Se adicionar Meta Pixel / GA / Turnstile, atualizar `web/apps/countdown-02/public/_headers`.

---

## 🟢 Validação pós-deploy

```bash
curl -sI https://contador.usepedireito.com.br/ | head -5
curl -sI https://contador.usepedireito.com.br/qualquer-rota | head -5   # SPA fallback
curl -sI https://contador.usepedireito.com.br/ | grep -i "content-security-policy"
```

Manual:
- Abrir `/` e `/faq`, confirmar render sem erros de console.
- Submeter um lead de teste → conferir tabela `leads` no Supabase com `tipo = 'revendedor'`.
