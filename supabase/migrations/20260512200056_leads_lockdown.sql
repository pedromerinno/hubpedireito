-- Pé Direito · HOTFIX de segurança em `leads`
-- Remove a policy de SELECT pra anon — handler de submissão usa só insert (return=minimal),
-- não precisa ler. Sem essa policy, nenhum cliente com a anon key (que é pública,
-- vai no bundle do frontend) consegue listar leads alheios.
--
-- Quem precisa ler leads (CRM/admin): usa SUPABASE_SERVICE_ROLE_KEY, que contorna RLS.

drop policy if exists "leads select anon" on public.leads;

-- Revoga SELECT do anon — defesa em profundidade caso alguém recrie a policy.
revoke select on table public.leads from anon;
