-- Função temporária pra auditoria (será dropada na próxima migration).
create or replace function public._pd_audit_security()
returns jsonb language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'policies', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'table', tablename,
        'policy', policyname,
        'cmd', cmd,
        'roles', roles,
        'qual', qual,
        'with_check', with_check
      )), '[]'::jsonb)
      from pg_policies
      where schemaname = 'public' and tablename in ('leads','revendedores')
    ),
    'grants', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'table', table_name,
        'grantee', grantee,
        'privilege', privilege_type
      )), '[]'::jsonb)
      from information_schema.table_privileges
      where table_schema = 'public'
        and table_name in ('leads','revendedores')
        and grantee in ('anon','authenticated','service_role','public')
    ),
    'rls_enabled', (
      select coalesce(jsonb_object_agg(c.relname, c.relrowsecurity), '{}'::jsonb)
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname='public' and c.relname in ('leads','revendedores')
    )
  );
$$;
grant execute on function public._pd_audit_security() to service_role;
