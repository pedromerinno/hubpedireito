-- Pé Direito · `leads.nome_completo` e `leads.telefone_whatsapp` viram NULLABLE
--
-- Política nova de captura: apenas o e-mail é obrigatório no formulário público.
-- O time qualifica o lead via follow-up (WhatsApp/e-mail) coletando os campos
-- restantes manualmente.
--
-- Mantém o índice por e-mail (já existente) como chave primária de contato.

alter table public.leads
  alter column nome_completo drop not null,
  alter column telefone_whatsapp drop not null;

-- Garante que pelo menos um canal de contato esteja presente.
-- (e-mail é obrigatório no schema do form, mas defesa em profundidade no DB)
alter table public.leads
  add constraint leads_has_contact_check
  check (
    coalesce(nullif(trim(email), ''), nullif(trim(telefone_whatsapp), '')) is not null
  );
