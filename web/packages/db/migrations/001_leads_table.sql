-- Pé Direito · Tabela `leads`
-- Migração da estrutura usada por /api/submit-lead (Hub de cadastros).
-- Cobre as 4 portas que não usam a tabela legacy `revendedores`:
--   franquia · representante · investidor · patrocinador
-- (A porta "revendedor" continua gravando em `revendedores` via /api/submit-revendedor.)
--
-- Aplicar via Supabase Studio (SQL editor) ou supabase CLI.

create type lead_tipo as enum (
  'franquia',
  'representante',
  'revendedor',
  'investidor',
  'patrocinador'
);

create type lead_status as enum (
  'pendente',
  'em_analise',
  'qualificado',
  'desqualificado',
  'convertido'
);

create table if not exists public.leads (
  id            bigserial primary key,
  tipo          lead_tipo not null,
  status        lead_status not null default 'pendente',

  nome_completo     text not null,
  email             text,
  telefone_whatsapp text not null,

  -- payload completo do formulário (varia por porta)
  dados   jsonb not null default '{}'::jsonb,
  -- metadados de origem: UTM, referrer, landing path
  origem  jsonb,

  submitted_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz
);

create index if not exists leads_tipo_idx        on public.leads (tipo);
create index if not exists leads_status_idx      on public.leads (status);
create index if not exists leads_created_at_idx  on public.leads (created_at desc);
create index if not exists leads_email_idx       on public.leads (email);

-- RLS: insert anônimo permitido (formulário público), leitura só com service role.
alter table public.leads enable row level security;

create policy "leads insert anon"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Trigger pra manter updated_at em sincronia
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();
