/**
 * @deprecated 2026-05-13 — handler legado do deploy Vercel.
 *
 * O app hoje submete leads direto no Supabase via `@pedireito/db/client`
 * (ver `src/hooks/useLeadSubmit.ts`). Esta function só roda no runtime Node
 * da Vercel; **não funciona** no Cloudflare Pages (deploy ativo desde 2026-05-13).
 *
 * Mantido temporariamente como rollback caso seja necessário voltar pra Vercel.
 * Remover após o cutover de DNS pra `familia.usepedireito.com.br` ser confirmado.
 */
import { createSubmitRevendedorHandler } from "@pedireito/db/api/submit-revendedor";

export default createSubmitRevendedorHandler({
  requireEmail: true,
  requireSite: true,
  requireInstagram: true,
});
