# @pedireito/db

Pacote interno: acesso compartilhado ao Supabase do Pé Direito.

## Subpaths

- `@pedireito/db` — tipos + helpers server-side (via barrel).
- `@pedireito/db/client` — Supabase client para browser (lê `VITE_SUPABASE_*`).
- `@pedireito/db/server` — factories `getSupabaseServer()` e `getSupabaseAdmin()` para Vercel Functions.
- `@pedireito/db/types` — tipos TypeScript (`Revendedor`, `RevendedorFormPayload`, ...).
- `@pedireito/db/hooks` — hooks React Query (`useRevendedores`, `useRevendedorStats`, ...).
- `@pedireito/db/api/submit-revendedor` — handler canônico. Default export já pronto; use `createSubmitRevendedorHandler({ ... })` pra ajustar campos obrigatórios.
- `@pedireito/db/api/revendedores/list` — handler de listagem (exige JWT).
- `@pedireito/db/api/revendedores/update` — handler de update (exige JWT).

## Uso típico em um app

```ts
// apps/lp-lancamento/api/submit-revendedor.ts
import { createSubmitRevendedorHandler } from "@pedireito/db/api/submit-revendedor";

export default createSubmitRevendedorHandler({
  requireEmail: true,
  requireSite: true,
  requireInstagram: true,
});
```

```tsx
// apps/painel-admin/src/hooks/useRevendedores.ts
export { useRevendedores, useRevendedorStats } from "@pedireito/db/hooks";
```

## Variáveis de ambiente

Ver `/.env.example` na raiz do monorepo.
