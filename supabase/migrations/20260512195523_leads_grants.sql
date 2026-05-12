-- Pé Direito · GRANTs para tabela `leads`
-- Tabelas criadas via CLI não recebem grants automáticos pros roles do Supabase.
-- Sem isso, o role `anon` é bloqueado ANTES da policy RLS avaliar (erro 42501).

grant select, insert on table public.leads to anon, authenticated;
grant usage, select on sequence public.leads_id_seq to anon, authenticated;

-- Policy de select adicional pra permitir return=representation no insert.
drop policy if exists "leads select anon" on public.leads;
create policy "leads select anon"
  on public.leads
  for select
  to anon, authenticated
  using (true);
