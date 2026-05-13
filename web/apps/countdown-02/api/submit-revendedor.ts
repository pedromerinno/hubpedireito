/**
 * @deprecated 2026-05-13 — handler legado do deploy Vercel.
 *
 * O form hoje submete leads direto no Supabase via `@pedireito/db/client`
 * (ver `src/components/RevendedoresForm.tsx`). Esta function só roda no
 * runtime Node da Vercel; **não funciona** no Cloudflare Pages (deploy ativo
 * desde 2026-05-13).
 *
 * Mantido temporariamente como rollback caso seja necessário voltar pra Vercel.
 * Remover após o cutover de DNS pra `contador.usepedireito.com.br` ser confirmado.
 */
import { createSubmitRevendedorHandler } from "@pedireito/db/api/submit-revendedor";

export default createSubmitRevendedorHandler({
  requireEmail: true,
  requireSite: true,
  requireInstagram: true,
});
