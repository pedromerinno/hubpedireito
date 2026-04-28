# Pé Direito — Web (monorepo)

Monorepo com os 5 apps web do Pé Direito + pacotes compartilhados.

```
web/
├── apps/
│   ├── countdown/        # LP de contagem regressiva
│   ├── lp-lancamento/    # LP pública de lançamento
│   ├── painel-admin/     # Painel administrativo
│   ├── revendedores/     # LP pública de revendedores
│   └── portal/           # Portal de notícias
├── packages/
│   └── db/               # Supabase client, tipos, hooks e handlers (@pedireito/db)
├── .env                  # (local, gitignored) vars compartilhadas
├── .env.example          # template
├── package.json          # workspaces + scripts
├── turbo.json            # pipeline Turborepo
└── tsconfig.base.json    # TS config base
```

## Requisitos

- Node.js ≥ 20
- npm ≥ 9 (vem no Node 20+)

## Setup inicial

```bash
npm install           # instala deps de todos os workspaces
cp .env.example .env  # preencha as chaves do Supabase
```

## Rodando em dev

Cada app tem sua própria porta:

| App             | Porta |
| --------------- | ----- |
| countdown       | 8080  |
| lp-lancamento   | 8081  |
| painel-admin    | 8082  |
| revendedores    | 8083  |
| portal          | 8084  |

```bash
npm run dev:countdown       # porta 8080
npm run dev:lp              # porta 8081
npm run dev:painel          # porta 8082
npm run dev:revendedores    # porta 8083
npm run dev:portal          # porta 8084
```

Ou tudo em paralelo:

```bash
npm run dev                 # roda os 5 ao mesmo tempo via turbo
```

## Build

```bash
npm run build               # builda todos os apps (com cache turbo)
npm run build --workspace=@pedireito/painel-admin   # só um
```

## Typecheck / Lint / Test

```bash
npm run typecheck
npm run lint
npm run test
```

## Variáveis de ambiente

Tudo vive em `/.env` na raiz — Vite dos apps lê daí via `envDir`.

| Var                          | Usada por                 | Nota                                          |
| ---------------------------- | ------------------------- | --------------------------------------------- |
| `SUPABASE_URL`               | Vercel Functions (api/*)  | URL do projeto Supabase                       |
| `SUPABASE_ANON_KEY`          | Vercel Functions          | Public anon key (respeita RLS)                |
| `SUPABASE_SERVICE_ROLE_KEY`  | `api/revendedores/*.ts`   | Service role (bypass RLS, só rotas autenticadas) |
| `VITE_SUPABASE_URL`          | Frontend                  | Exposta ao browser                            |
| `VITE_SUPABASE_ANON_KEY`     | Frontend                  | Exposta ao browser                            |
| `AC_API_URL`                 | Handler submit-revendedor | ActiveCampaign (opcional)                     |
| `AC_API_KEY`                 | "                         |                                               |
| `AC_LIST_ID`                 | "                         |                                               |
| `AC_CUSTOM_FIELD_ID`         | "                         |                                               |

## Deploy na Vercel

**Cada app é um projeto Vercel separado**, apontando pra uma subpasta:

1. Na Vercel, New Project → Import do repositório do monorepo.
2. Em **Root Directory** configure a pasta do app:
   - `apps/countdown`
   - `apps/lp-lancamento`
   - `apps/painel-admin`
   - `apps/revendedores`
   - `apps/portal`
3. Em **Framework Preset**, selecione "Vite".
4. Em **Environment Variables**, adicione as vars relevantes (Supabase + AC).
5. A Vercel detecta o workspace npm automaticamente e resolve o `@pedireito/db`.

### Build command (sobrescrever se necessário)

A Vercel roda `npm run build` no Root Directory por padrão. Se precisar forçar a ordem de build do workspace:

```
cd ../.. && npx turbo run build --filter=@pedireito/<nome-do-app>
```

## Pacote `@pedireito/db`

Source-only, sem build. Cada app importa direto os `.ts` do workspace (Vite e o bundler da Vercel lidam com TS). Veja `packages/db/README.md` pros subpaths disponíveis.

### Exemplo: substituir um handler de API

```ts
// apps/<app>/api/submit-revendedor.ts
import { createSubmitRevendedorHandler } from "@pedireito/db/api/submit-revendedor";

export default createSubmitRevendedorHandler({
  requireEmail: true,
  requireSite: true,
  requireInstagram: true,
});
```

### Exemplo: usar hook no frontend

```tsx
import { useRevendedores } from "@pedireito/db/hooks";

const { data } = useRevendedores({ status: "pendente", page: 1 });
```

## Backup

Repos originais pré-monorepo arquivados em:

```
/Users/pedromerino/Documents/PeDireito/_archive/HUB_backup_20260421/
/Users/pedromerino/Documents/PeDireito/_archive/countdown-standalone-pre-monorepo/
```

Se tudo funcionar em produção, pode deletar.
