import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSection } from "./FormSection";
import { FormSuccess } from "./FormSuccess";
import { FilterQuestion } from "./FilterQuestion";
import { RadioCardField } from "./RadioCardGroup";
import { FormErrorBanner } from "./FormErrorBanner";
import { TextField, TextareaField } from "./Field";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { getPorta } from "@/lib/portas";

const ORCAMENTO_OPTIONS = [
  { value: "500k+", label: "Acima de R$ 500 mil" },
  { value: "100-500k", label: "Entre R$ 100 mil e R$ 500 mil" },
  { value: "30-100k", label: "Entre R$ 30 mil e R$ 100 mil" },
  { value: "<30k", label: "Abaixo de R$ 30 mil" },
] as const;

type OrcamentoValue = (typeof ORCAMENTO_OPTIONS)[number]["value"];

const schema = z.object({
  orcamento: z.enum(["500k+", "100-500k", "30-100k", "<30k"]),

  razaoSocial: z.string().min(1, "Campo obrigatório"),
  cnpj: z.string().min(1, "CNPJ obrigatório"),
  setor: z.string().min(1, "Campo obrigatório"),
  tamanho: z.string().min(1, "Campo obrigatório"),
  site: z.string().min(1, "Campo obrigatório"),
  cidadeSede: z.string().min(1, "Campo obrigatório"),

  contatoNome: z.string().min(1, "Campo obrigatório"),
  contatoCargo: z.string().min(1, "Campo obrigatório"),
  contatoEmail: z.string().email("E-mail inválido"),
  contatoWhatsapp: z.string().min(8, "WhatsApp obrigatório"),

  oQuePatrocinar: z.string().min(1, "Campo obrigatório"),
  tipoAtivacao: z.string().min(1, "Campo obrigatório"),
  orcamentoAnual: z.enum(["500k+", "100-500k", "30-100k", "<30k"]),
  duracao: z.enum(["pontual", "6m", "12m", "multianual"], {
    errorMap: () => ({ message: "Selecione uma duração" }),
  }),

  sinergia: z.string().min(200, "Mínimo de 200 caracteres"),
  porQuePD: z.string().min(1, "Campo obrigatório"),
  patrocinosAnteriores: z.string().min(1, "Cite ao menos um exemplo"),
  exclusividadeSetorial: z.string().optional(),

  apresentacao: z.enum(["sim", "nao"], { errorMap: () => ({ message: "Selecione uma opção" }) }),
});

type FormValues = z.infer<typeof schema>;

export function PatrocinadorForm() {
  const porta = getPorta("patrocinador");
  const [orcamento, setOrcamento] = useState<OrcamentoValue | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });

  const { state, submit } = useLeadSubmit<FormValues>({ tipo: "patrocinador" });
  const onInvalid = useScrollToFirstError<FormValues>();

  function handleOrcamentoChange(value: OrcamentoValue) {
    setOrcamento(value);
    form.setValue("orcamento", value as FormValues["orcamento"], { shouldValidate: true });
    form.setValue("orcamentoAnual", value as FormValues["orcamentoAnual"], { shouldValidate: false });
  }

  async function onSubmit(values: FormValues) {
    await submit(values);
  }

  if (state.status === "submitted") {
    return (
      <FormSuccess
        porta={porta}
        proximoPasso="Vamos enviar o deck institucional com os planos de patrocínio disponíveis no Período Fundador e agendar uma apresentação formal."
        prazoContato="Retorno em até 7 dias úteis."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 sm:space-y-8">
        <FilterQuestion
          eyebrow="Filtro de entrada"
          question="Qual a faixa anual de orçamento de patrocínio que sua empresa considera para esta parceria?"
          options={ORCAMENTO_OPTIONS as unknown as { value: OrcamentoValue; label: string }[]}
          value={orcamento}
          onChange={handleOrcamentoChange}
        />

        {orcamento && (
          <>
            <FormSection number={1} title="Empresa">
              <TextField control={form.control} name="razaoSocial" label="Razão social" placeholder="Nome legal da empresa" />
              <TextField control={form.control} name="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" inputMode="numeric" />
              <TextField control={form.control} name="setor" label="Setor de atuação" placeholder="Ex: bebidas, fintech, varejo..." />
              <TextField
                control={form.control}
                name="tamanho"
                label="Tamanho da empresa"
                placeholder="Faturamento anual ou nº de funcionários"
              />
              <TextField control={form.control} name="site" label="Site" type="url" placeholder="https://..." />
              <TextField control={form.control} name="cidadeSede" label="Cidade-sede" placeholder="Ex: São Paulo" />
            </FormSection>

            <FormSection number={2} title="Responsável pelo contato">
              <TextField control={form.control} name="contatoNome" label="Nome" placeholder="Nome completo" />
              <TextField control={form.control} name="contatoCargo" label="Cargo" placeholder="Ex: Gerente de Marketing" />
              <TextField
                control={form.control}
                name="contatoEmail"
                label="E-mail corporativo"
                type="email"
                placeholder="nome@empresa.com"
              />
              <TextField
                control={form.control}
                name="contatoWhatsapp"
                label="WhatsApp"
                placeholder="(00) 00000-0000"
                inputMode="tel"
              />
            </FormSection>

            <FormSection number={3} title="Patrocínio">
              <TextField
                control={form.control}
                name="oQuePatrocinar"
                label="O que sua empresa quer patrocinar?"
                placeholder="Produto, evento, campanha, conteúdo, embaixador, ainda definindo..."
              />
              <TextField
                control={form.control}
                name="tipoAtivacao"
                label="Tipo de ativação desejada"
                placeholder="Logo em produto, presença em campanha, co-branding, evento físico..."
              />
              <RadioCardField
                control={form.control}
                name="orcamentoAnual"
                question="Faixa de orçamento anual"
                options={[
                  { value: "500k+", label: "Acima de R$ 500 mil" },
                  { value: "100-500k", label: "Entre R$ 100 mil e R$ 500 mil" },
                  { value: "30-100k", label: "Entre R$ 30 mil e R$ 100 mil" },
                  { value: "<30k", label: "Abaixo de R$ 30 mil" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="duracao"
                question="Duração desejada"
                layout="grid"
                options={[
                  { value: "pontual", label: "Campanha pontual" },
                  { value: "6m", label: "6 meses" },
                  { value: "12m", label: "12 meses" },
                  { value: "multianual", label: "Multianual" },
                ]}
              />
            </FormSection>

            <FormSection number={4} title="Sinergia">
              <TextareaField
                control={form.control}
                name="sinergia"
                label="Que sinergia sua empresa enxerga com a Pé Direito?"
                placeholder="Conte com calma. Mínimo de 200 caracteres."
                minLength={200}
                showCounter
              />
              <TextField
                control={form.control}
                name="porQuePD"
                label="Por que Pé Direito é estratégica pra vocês neste momento?"
                placeholder="Resposta curta e direta."
              />
              <TextareaField
                control={form.control}
                name="patrocinosAnteriores"
                label="Sua empresa já patrocinou outras marcas ou movimentos? Cite 1 ou 2 exemplos."
                placeholder="Ex: Campanha X em 2024, parceria com Y em 2023..."
              />
              <TextField
                control={form.control}
                name="exclusividadeSetorial"
                label="Tem alguma cláusula de exclusividade setorial em mente?"
                placeholder="Se não, deixe em branco."
                optional
              />
            </FormSection>

            <FormSection number={5} title="Próximo passo">
              <RadioCardField
                control={form.control}
                name="apresentacao"
                question="Disponibilidade para apresentação formal nas próximas 3 semanas?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim, tenho agenda" },
                  { value: "nao", label: "Prefiro mais tempo" },
                ]}
              />
            </FormSection>

            <FormErrorBanner errors={form.formState.errors} submitError={state.error} />

            <div className="pt-2 flex justify-center">
              <Button
                type="submit"
                disabled={state.status === "submitting"}
                className="rounded-full px-10 py-6 bg-[#2B9402] hover:bg-[#2B9402]/90 text-[#FEBF00] font-semibold disabled:opacity-70"
              >
                {state.status === "submitting" ? "Enviando..." : "Quero caminhar junto"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
