# Runbook — Cloudflare Pages: linha-de-frente

> Subdomínio: `lancamento.usepedireito.com.br`
> Lançamento oficial: **2026-05-12 00:00 BRT**
> Deploy ativo no CF Pages desde 2026-05-06. Vercel mantido como fallback.

---

## Pré-requisitos pra qualquer comando neste runbook

```bash
source ~/.cloudflare/ids.env       # CF_ACCOUNT_ID, CF_ZONE_ID, CF_DOMAIN, CF_SUBDOMAIN
export TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')
```

IDs de referência (já dentro de `~/.cloudflare/ids.env`):
- `CF_ACCOUNT_ID=ecb2efe2bb765511e9a2a35e8ea69b82`
- `CF_ZONE_ID=7b395436dafbd5aa2a00250936d5c69d`
- DNS record id do subdomínio: `55e11497c3f162ed65f4f1496262018f`
- CF Pages project: `linha-de-frente` (subdomain: `linha-de-frente.pages.dev`)

---

## 🔴 Emergência 1 — Site sob ataque DDoS L7 ativo

**Sintomas**: spike de Security Events, latência alta, site lento ou inacessível, alerta de email da CF.

### Ação imediata: ligar Under Attack Mode SÓ no subdomínio

**Via dashboard CF (mais rápido, ~10s):**

1. https://dash.cloudflare.com → conta → zone `usepedireito.com.br`
2. Menu lateral: **Rules** → **Configuration Rules**
3. Localizar: `linha-de-frente | PANIC: Under Attack Mode`
4. Toggle **Status** → **ON** → **Save**

Efeito: todo visitante de `lancamento.usepedireito.com.br` vê interstitial JS challenge da CF por ~5s antes de acessar. Mata DDoS L7. UX degrada (esperado).

**Pra desligar depois** (mesmo caminho, toggle OFF, Save).

---

## 🔴 Emergência 2 — Deploy ruim, voltar versão anterior

**Via Wrangler (terminal):**

```bash
cd ~/Projetos/PéDireito/pd-lancamento/hubpedireito
export CLOUDFLARE_API_TOKEN=$TOKEN
export CLOUDFLARE_ACCOUNT_ID=$CF_ACCOUNT_ID

# Lista deployments mais recentes
npx wrangler pages deployment list --project-name=linha-de-frente | head -10

# Promote (rollback) pra um deployment anterior
npx wrangler pages deployment tail --project-name=linha-de-frente   # opcional, ver logs ao vivo
# Ou via dashboard: Pages → linha-de-frente → Deployments → ⋯ no anterior → "Rollback to this deployment"
```

**Via dashboard (mais simples):**
https://dash.cloudflare.com/$CF_ACCOUNT_ID/pages/view/linha-de-frente/deployments → ⋯ no deploy anterior bom → **Rollback to this deployment**.

---

## 🔴 Emergência 3 — Cloudflare Pages totalmente fora, fallback pra Vercel

**Pré-condição**: o deploy Vercel original ainda está vivo em `https://linha-de-frente-<hash>.vercel.app` (intacto desde 2026-05-06).

### Reverter CNAME pra Vercel via API

```bash
source ~/.cloudflare/ids.env
TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')

curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/55e11497c3f162ed65f4f1496262018f" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type":"CNAME",
    "name":"lancamento",
    "content":"14508ef53a855c38.vercel-dns-016.com",
    "proxied":false,
    "ttl":1
  }'
```

Propagação: ~5 min (TTL=300s no estado atual). Em 5 min o público volta a bater na Vercel.

**Validação**:
```bash
dig +short lancamento.usepedireito.com.br
# Esperado: 14508ef53a855c38.vercel-dns-016.com → IPs Vercel (76.76.x.x)
```

> Cópia exata desses dados em `~/.cloudflare/rollback-dns.txt`.

---

## 🟡 Operações de rotina

### Ver status do deploy mais recente
```bash
npx wrangler pages deployment list --project-name=linha-de-frente | head -5
```

### Logs de Security Events em tempo real
Dashboard: https://dash.cloudflare.com/$CF_ACCOUNT_ID/usepedireito.com.br/security/events

Filtros úteis:
- **Hostname**: `lancamento.usepedireito.com.br`
- **Action**: `block`, `managed_challenge`, `challenge`
- **Source**: `Custom WAF`, `Rate Limiting`, `DDoS Mitigation`

### Forçar novo deploy manual (sem push)
```bash
cd ~/Projetos/PéDireito/pd-lancamento/hubpedireito/web
npm install --no-audit --no-fund
npx turbo run build --filter=@pedireito/linha-de-frente

cd ~/Projetos/PéDireito/pd-lancamento/hubpedireito
export CLOUDFLARE_API_TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')
export CLOUDFLARE_ACCOUNT_ID=ecb2efe2bb765511e9a2a35e8ea69b82
npx wrangler pages deploy web/apps/linha-de-frente/dist \
  --project-name=linha-de-frente \
  --branch=deploy/cf-pages-linha-de-frente \
  --commit-dirty=true
```

### Verificar headers/WAF no ar
```bash
# Headers
curl -sI https://lancamento.usepedireito.com.br/ -H "User-Agent: Mozilla/5.0" | grep -iE "^(strict|content-sec|x-frame|cross-orig|permissions|server|cf-ray)"

# WAF rule 1 (POST deve dar 403)
curl -s -o /dev/null -w "POST → %{http_code}\n" -X POST https://lancamento.usepedireito.com.br/ -H "User-Agent: Mozilla/5.0"

# WAF rule 2 (UA vazio deve dar 403)
curl -s -o /dev/null -w "UA vazio → %{http_code}\n" https://lancamento.usepedireito.com.br/ -H "User-Agent: "

# WAF rule 3 (path malicioso deve dar 403)
curl -s -o /dev/null -w "/wp-admin → %{http_code}\n" https://lancamento.usepedireito.com.br/wp-admin -H "User-Agent: Mozilla/5.0"
```

---

## 📋 Checklist D-Day (12.05.2026)

### D-3 (09.05) — preparação
- [ ] Confirmar TTL do CNAME `lancamento` em 300s
- [ ] Smoke test completo (todos os curls da seção anterior retornando o esperado)
- [ ] Confirmar email alert ativo (ver inbox de `ecio.edmundo@gmail.com`)
- [ ] Confirmar Configuration Rule UAM existe e está **disabled**
- [ ] Backup operador humano com acesso ao dashboard CF

### D-1 (11.05) — staging
- [ ] Smoke test final às 18h BRT
- [ ] Dashboard CF aberto: Security Events em tempo real
- [ ] Terminal aberto com `~/.cloudflare/ids.env` carregado e `TOKEN` exportado
- [ ] Comando de rollback DNS pronto pra colar (ver Emergência 3)

### D-Day (12.05) — lançamento 00:00 BRT
- [ ] Monitoramento ativo nas primeiras 4 horas
- [ ] Validar primeiro acesso real após meia-noite (curl + Lighthouse mobile)
- [ ] Logs Security Events: olho em spikes de `block` ou `managed_challenge`
- [ ] Se rate limit dispara muito → considerar subir threshold (regra editável via API, ver "Ajuste fino")

### D+1 a D+7 — janela de fallback
- [ ] Vercel `linha-de-frente` continua deployado mas sem tráfego
- [ ] Após 7 dias sem incidente: subir TTL DNS pra 3600s, desligar deploy Vercel

---

## 🔧 Ajuste fino (durante o lançamento, se precisar)

### Subir threshold do Rate Limit (se humanos estão sendo desafiados)

Atual: 80 req/10s/IP → block 10s. Pra subir pra 150:

```bash
source ~/.cloudflare/ids.env
TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')

curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/rulesets/phases/http_ratelimit/entrypoint" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "rules": [{
      "description": "linha-de-frente | rate limit per IP (150 req/10s)",
      "expression": "(http.host eq \"lancamento.usepedireito.com.br\")",
      "action": "block",
      "ratelimit": {
        "characteristics": ["ip.src", "cf.colo.id"],
        "period": 10,
        "requests_per_period": 150,
        "mitigation_timeout": 10
      }
    }]
  }'
```

### Adicionar IP problemático ao block
Dashboard CF → zone → **Security → WAF → Tools** → **IP Access Rules** → Add IP → Block.

### Whitelist um IP (parceiro de imprensa, etc)
Mesmo lugar → Add IP → **Allow** (ou **Whitelist**).

---

## 📞 Quem chamar / quando escalar

| Sintoma | Severidade | Ação primeira | Quem |
|---|---|---|---|
| Spike Security Events sem afetar UX | Baixa | Monitorar via dashboard | Operador único |
| Site lento mas no ar | Média | Ligar UAM (Emergência 1) | Operador único |
| Site inacessível ou erros 5xx | Alta | Rollback Wrangler (Emergência 2) | Operador + 1 backup |
| CF Pages totalmente fora | Crítica | Rollback DNS pra Vercel (Emergência 3) | Operador + 1 backup |
| DNS apontando errado, ninguém consegue acessar | Crítica | Verificar `dig` + reverter via API | Operador + 1 backup |

---

## 📨 Form de captura de leads

Pipeline: **CTA → Modal (Nome/Email/Telefone) → POST `/api/lead` (Pages Function) → Turnstile verify + repasse → webhook n8n → Zenhub abre em nova aba.**

### Env vars no projeto CF Pages (production)

| Var | Tipo | Descrição |
|---|---|---|
| `N8N_WEBHOOK_URL` | plain | URL do webhook n8n (`https://webhook.destra.work/webhook/pd-captacao`) |
| `N8N_AUTH_SECRET` | secret | Valor do header `auth` que o n8n exige |
| `TURNSTILE_SECRET` | secret | Secret Key do Turnstile (verificação server-side) |
| `VITE_TURNSTILE_SITEKEY` | plain | Site Key do Turnstile (injetado no bundle do front) |

Ajustar via dashboard: https://dash.cloudflare.com/$CF_ACCOUNT_ID/pages/view/linha-de-frente/settings/environment-variables

> **Atenção:** mudar `VITE_TURNSTILE_SITEKEY` exige **rebuild** (env injetada em build-time). Re-rodar GH Actions ou push qualquer commit no branch.

### GitHub secrets exigidos
- `CF_API_TOKEN`, `CF_ACCOUNT_ID` (deploy)
- `VITE_TURNSTILE_SITEKEY` (build-time pro Vite)

### Smoke test do endpoint
```bash
# 405 esperado (GET não permitido)
curl -sI https://lancamento.usepedireito.com.br/api/lead -H "User-Agent: Mozilla/5.0"

# CORS preflight de origin válida → 204 + ACL headers
curl -sI -X OPTIONS https://lancamento.usepedireito.com.br/api/lead \
  -H "Origin: https://lancamento.usepedireito.com.br" -H "User-Agent: Mozilla/5.0"

# 400 esperado (corpo vazio)
curl -X POST https://lancamento.usepedireito.com.br/api/lead \
  -H "Origin: https://lancamento.usepedireito.com.br" -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" -d '{}'

# 403 esperado (origin malicioso)
curl -X POST https://lancamento.usepedireito.com.br/api/lead \
  -H "Origin: https://malicious.example" -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" -d '{}'
```

### Códigos de erro do `/api/lead`
- `400 nome inválido / email inválido / telefone inválido / captcha ausente` — validação
- `403 origin not allowed / captcha rejeitado` — bot ou CORS bypass
- `502 captcha verify failed / upstream unreachable / upstream error` — Turnstile ou n8n fora do ar
- `200 {ok: true}` — lead persistido

### Falha no n8n não perde lead
O cliente faz **2 retries** com backoff exponencial. Se ainda assim falhar, salva o payload em `localStorage["pd_lead_buffer_v1"]` e abre o Zenhub. No próximo submit bem-sucedido (`flushBufferedLeads()`) os pendentes são reenviados.

### Ajustar URL do webhook n8n em emergência
```bash
source ~/.cloudflare/ids.env
TOKEN=$(cat ~/.cloudflare/api-token | tr -d '\n\r ')

curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects/linha-de-frente" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "deployment_configs": {
      "production": {
        "env_vars": {
          "N8N_WEBHOOK_URL": {"type":"plain_text","value":"https://NOVA-URL/webhook"}
        }
      }
    }
  }'
```
> Mudança de env var no CF Pages **só aplica em deploys novos**. Faça um redeploy manual via dashboard ou um push no branch.

---

## 🗂️ Referências

- Plan original: `~/.claude/plans/preciso-hospedar-uma-c-pia-luminous-waterfall.md`
- Rollback DNS: `~/.cloudflare/rollback-dns.txt`
- Workflow CI: `.github/workflows/deploy-cf-pages-linha-de-frente.yml`
- Branch deploy: `deploy/cf-pages-linha-de-frente`
- Dashboard Pages: https://dash.cloudflare.com/ecb2efe2bb765511e9a2a35e8ea69b82/pages/view/linha-de-frente
- Dashboard Security: https://dash.cloudflare.com/ecb2efe2bb765511e9a2a35e8ea69b82/usepedireito.com.br/security/events
- Dashboard DNS: https://dash.cloudflare.com/ecb2efe2bb765511e9a2a35e8ea69b82/usepedireito.com.br/dns/records
