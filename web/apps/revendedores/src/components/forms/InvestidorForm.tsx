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

const TICKET_OPTIONS = [
  { value: "1mm+", label: "Acima de R$ 1 milhão" },
  { value: "500k-1mm", label: "Entre R$ 500 mil e R$ 1 milhão" },
  { value: "100-500k", label: "Entre R$ 100 mil e R$ 500 mil" },
  {
    value: "<100k",
    label: "Abaixo de R$ 100 mil",
    warning:
      "No momento, nossa estrutura de captação atende tickets a partir de R$ 100 mil. Continue o cadastro. Vamos te avisar quando abrirmos rodada para tickets menores.",
  },
] as const;

type TicketValue = (typeof TICKET_OPTIONS)[number]["value"];

// Apenas o e-mail é obrigatório.
const schema = z.object({
  ticket: z.enum(["1mm+", "500k-1mm", "100-500k", "<100k"]).optional(),
  nomeCompleto: z.string().optional(),
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  whatsapp: z.string().optional(),
  pfPj: z.enum(["pf", "pj"]).optional(),
  cidadePais: z.string().optional(),

  qualificado: z.enum(["1mm+", "300-1mm", "<300"]).optional(),
  jaInvestiu: z.enum(["sim", "nao"]).optional(),
  numeroOperacoes: z.string().optional(),
  empresasInvestidas: z.string().optional(),

  ticketPretendido: z.enum(["1mm+", "500k-1mm", "100-500k", "<100k"]).optional(),
  instrumento: z.enum(["equity", "divida", "mutuo", "safe", "aberto"]).optional(),
  horizonte: z.enum(["3", "5", "10", "longo"]).optional(),
  atuacaoAtiva: z.enum(["ativa", "capital"]).optional(),

  motivacao: z.string().optional(),
  comoConheceu: z.string().optional(),
  acompanhaFundador: z.enum(["sim", "nao"]).optional(),

  callDisponivel: z.enum(["sim", "nao"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export function InvestidorForm() {
  const porta = getPorta("investidor");
  const [ticket, setTicket] = useState<TicketValue | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });

  const { state, submit } = useLeadSubmit<FormValues>({ tipo: "investidor" });
  const onInvalid = useScrollToFirstError<FormValues>();

  function handleTicketChange(value: TicketValue) {
    setTicket(value);
    form.setValue("ticket", value as FormValues["ticket"], { shouldValidate: true });
    // pré-popula o ticket pretendido (pode ser ajustado depois)
    form.setValue("ticketPretendido", value as FormValues["ticketPretendido"], { shouldValidate: false });
  }

  async function onSubmit(values: FormValues) {
    await submit(values);
  }

  if (state.status === "submitted") {
    return (
      <FormSuccess
        porta={porta}
        proximoPasso="Sua manifestação de interesse foi recebida. Nosso time de IR vai te enviar o teaser e propor uma call de alinhamento na sequência."
        prazoContato="Retorno em até 5 dias úteis."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 sm:space-y-8">
        <FilterQuestion
          eyebrow="Filtro de entrada"
          question="Qual a faixa de ticket que você considera para esta oportunidade?"
          options={TICKET_OPTIONS as unknown as { value: TicketValue; label: string; warning?: string }[]}
          value={ticket}
          onChange={handleTicketChange}
        />

        {ticket && (
          <>
            <FormSection number={1} title="Identidade">
              <TextField control={form.control} name="nomeCompleto" label="Nome completo" placeholder="Seu nome" />
              <TextField control={form.control} name="email" label="E-mail" type="email" placeholder="seu@email.com" />
              <TextField control={form.control} name="whatsapp" label="WhatsApp" placeholder="(00) 00000-0000" inputMode="tel" />
              <RadioCardField
                control={form.control}
                name="pfPj"
                question="Pessoa física ou jurídica?"
                layout="grid"
                options={[
                  { value: "pf", label: "Pessoa física" },
                  { value: "pj", label: "Pessoa jurídica" },
                ]}
              />
              <TextField control={form.control} name="cidadePais" label="Cidade e país" placeholder="Ex: São Paulo, Brasil" />
            </FormSection>

            <FormSection number={2} title="Perfil de investidor">
              <RadioCardField
                control={form.control}
                name="qualificado"
                question="Você se considera investidor qualificado?"
                options={[
                  { value: "1mm+", label: "Patrimônio acima de R$ 1 milhão" },
                  { value: "300-1mm", label: "Patrimônio entre R$ 300 mil e R$ 1 milhão" },
                  { value: "<300", label: "Patrimônio abaixo de R$ 300 mil" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="jaInvestiu"
                question="Já investiu em empresas privadas (anjo, venture, PE, search fund, family office)?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <TextField
                control={form.control}
                name="numeroOperacoes"
                label="Quantas operações já fez?"
                placeholder="Ex: 4"
                inputMode="numeric"
              />
              <TextField
                control={form.control}
                name="empresasInvestidas"
                label="Cite 1 ou 2 empresas em que investiu"
                placeholder="Ou escreva: prefiro não citar"
                optional
              />
            </FormSection>

            <FormSection number={3} title="Tese de investimento">
              <RadioCardField
                control={form.control}
                name="ticketPretendido"
                question="Faixa de ticket pretendido nesta oportunidade"
                options={[
                  { value: "1mm+", label: "Acima de R$ 1 milhão" },
                  { value: "500k-1mm", label: "Entre R$ 500 mil e R$ 1 milhão" },
                  { value: "100-500k", label: "Entre R$ 100 mil e R$ 500 mil" },
                  { value: "<100k", label: "Abaixo de R$ 100 mil" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="instrumento"
                question="Instrumento preferido"
                options={[
                  { value: "equity", label: "Equity" },
                  { value: "divida", label: "Dívida conversível" },
                  { value: "mutuo", label: "Mútuo" },
                  { value: "safe", label: "SAFE" },
                  { value: "aberto", label: "Aberto a discussão" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="horizonte"
                question="Horizonte de investimento"
                layout="grid"
                options={[
                  { value: "3", label: "Até 3 anos" },
                  { value: "5", label: "3 a 5 anos" },
                  { value: "10", label: "5 a 10 anos" },
                  { value: "longo", label: "Longo prazo" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="atuacaoAtiva"
                question="Tipo de atuação que você busca"
                options={[
                  { value: "ativa", label: "Ativa: assento em conselho, mentoria, contribuição estratégica" },
                  { value: "capital", label: "Só capital, sem envolvimento operacional" },
                ]}
              />
            </FormSection>

            <FormSection number={4} title="Alinhamento">
              <TextareaField
                control={form.control}
                name="motivacao"
                label="Por que a Pé Direito te interessa?"
                placeholder="Conte com calma. Mínimo de 200 caracteres."
                minLength={200}
                showCounter
              />
              <TextField
                control={form.control}
                name="comoConheceu"
                label="Como conheceu a marca?"
                placeholder="Ex: Nikolas, indicação, imprensa, redes..."
              />
              <RadioCardField
                control={form.control}
                name="acompanhaFundador"
                question="Você acompanha o Período Fundador?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim, de perto" },
                  { value: "nao", label: "Não, agora que descobri" },
                ]}
              />
            </FormSection>

            <FormSection number={5} title="Próximo passo">
              <RadioCardField
                control={form.control}
                name="callDisponivel"
                question="Disponibilidade para uma call inicial nas próximas 2 semanas?"
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
                {state.status === "submitting" ? "Enviando..." : "Quero conhecer a tese"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
