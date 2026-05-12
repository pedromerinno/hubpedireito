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
import { TextField, TextareaField, SelectField, ESTADOS_BR } from "./Field";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { getPorta } from "@/lib/portas";

const CAPITAL_OPTIONS = [
  { value: "500k+", label: "Acima de R$ 500 mil" },
  { value: "250-500k", label: "Entre R$ 250 mil e R$ 500 mil" },
  { value: "100-250k", label: "Entre R$ 100 mil e R$ 250 mil" },
  {
    value: "<100k",
    label: "Abaixo de R$ 100 mil",
    redirect: {
      rota: "/revendedor",
      portaNome: "Revendedor",
      mensagem:
        "Pra abrir uma franquia Pé Direito você precisa, hoje, de capital acima de R$ 100 mil. Se a sua intenção é começar com volume menor, a porta certa é a de Revendedor.",
    },
  },
] as const;

type CapitalValue = (typeof CAPITAL_OPTIONS)[number]["value"];

// Apenas o e-mail é obrigatório. Os demais campos seguem opcionais
// pra não bloquear envio — o time decide depois o que cobrar no follow-up.
const schema = z.object({
  capital: z.enum(["500k+", "250-500k", "100-250k", "<100k"]).optional(),
  nomeCompleto: z.string().optional(),
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  whatsapp: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),

  jaEmpresario: z.enum(["sim", "nao"]).optional(),
  tempoEmpreendendo: z.string().optional(),
  negociosOperados: z.string().optional(),
  experienciaVarejo: z.enum(["sim", "nao"]).optional(),
  pessoasOperacao: z.string().optional(),

  cidade: z.string().optional(),
  estado: z.string().optional(),
  bairroRegiao: z.string().optional(),
  tipoPonto: z.enum(["rua", "shopping", "outlet", "quiosque", "indefinido"]).optional(),
  jaTemPonto: z.enum(["sim", "nao"]).optional(),
  prazoInauguracao: z.enum(["90", "180", "365", "indef"]).optional(),

  modoOperacao: z.enum(["pessoal", "gerencia", "ambos"]).optional(),
  capitalGiro: z.enum(["sim", "nao"]).optional(),

  motivacao: z.string().optional(),
  tempoAcompanha: z.string().optional(),
  comoConheceu: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function FranquiaForm() {
  const porta = getPorta("franquia");
  const [capital, setCapital] = useState<CapitalValue | undefined>(undefined);
  const isBlocked = capital === "<100k";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { capital: undefined, nomeCompleto: "", email: "", whatsapp: "", cpf: "" } as Partial<FormValues> as FormValues,
  });

  const { state, submit } = useLeadSubmit<FormValues>({ tipo: "franquia" });
  const onInvalid = useScrollToFirstError<FormValues>();

  function handleCapitalChange(value: CapitalValue) {
    setCapital(value);
    form.setValue("capital", value as FormValues["capital"], { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    await submit(values);
  }

  if (state.status === "submitted") {
    return (
      <FormSuccess
        porta={porta}
        proximoPasso="Sua candidatura à franquia foi recebida. Nosso time de expansão vai analisar seu perfil e te convidar para uma call inicial."
        prazoContato="Retorno em até 7 dias úteis."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 sm:space-y-8">
        <FilterQuestion
          eyebrow="Filtro de entrada"
          question="Qual capital você tem disponível para investir na operação completa (ponto, estoque, equipe, taxa de franquia)?"
          options={CAPITAL_OPTIONS as unknown as { value: CapitalValue; label: string; redirect?: { rota: string; portaNome: string; mensagem: string } }[]}
          value={capital}
          onChange={handleCapitalChange}
        />

        {!isBlocked && capital && (
          <>
            <FormSection number={1} title="Identidade">
              <TextField control={form.control} name="nomeCompleto" label="Nome completo" placeholder="Seu nome" />
              <TextField control={form.control} name="email" label="E-mail" type="email" placeholder="seu@email.com" />
              <TextField control={form.control} name="whatsapp" label="WhatsApp" placeholder="(00) 00000-0000" inputMode="tel" />
              <TextField control={form.control} name="cpf" label="CPF" placeholder="000.000.000-00" inputMode="numeric" />
              <TextField control={form.control} name="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" optional />
            </FormSection>

            <FormSection number={2} title="Perfil empresarial">
              <RadioCardField
                control={form.control}
                name="jaEmpresario"
                question="Você já é empresário hoje?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <TextField control={form.control} name="tempoEmpreendendo" label="Há quanto tempo empreende?" placeholder="Ex: 5 anos" />
              <TextareaField
                control={form.control}
                name="negociosOperados"
                label="Que negócios você opera ou operou?"
                placeholder="Conte rapidamente sobre seus negócios atuais e passados."
              />
              <RadioCardField
                control={form.control}
                name="experienciaVarejo"
                question="Tem experiência com varejo físico?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <TextField control={form.control} name="pessoasOperacao" label="Quantas pessoas trabalham na sua operação atual?" placeholder="Ex: 12" inputMode="numeric" />
            </FormSection>

            <FormSection number={3} title="Localização" hint="Cidade alvo, ponto comercial e prazo.">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
                <TextField control={form.control} name="cidade" label="Cidade da franquia desejada" placeholder="Ex: Belo Horizonte" />
                <SelectField control={form.control} name="estado" label="Estado" placeholder="UF" options={ESTADOS_BR} />
              </div>
              <TextField control={form.control} name="bairroRegiao" label="Bairro ou região de interesse" placeholder="Pode listar mais de uma" optional />
              <RadioCardField
                control={form.control}
                name="tipoPonto"
                question="Tipo de ponto pretendido"
                layout="grid"
                options={[
                  { value: "rua", label: "Rua" },
                  { value: "shopping", label: "Shopping" },
                  { value: "outlet", label: "Outlet" },
                  { value: "quiosque", label: "Quiosque" },
                  { value: "indefinido", label: "Ainda definindo" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="jaTemPonto"
                question="Você já tem ponto comercial em vista?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="prazoInauguracao"
                question="Em quanto tempo pretende inaugurar?"
                options={[
                  { value: "90", label: "Até 90 dias" },
                  { value: "180", label: "Entre 90 e 180 dias" },
                  { value: "365", label: "Entre 180 e 365 dias" },
                  { value: "indef", label: "Sem prazo definido" },
                ]}
              />
            </FormSection>

            <FormSection number={4} title="Operação">
              <RadioCardField
                control={form.control}
                name="modoOperacao"
                question="Pretende operar pessoalmente ou contratar gerência?"
                options={[
                  { value: "pessoal", label: "Pessoalmente, no dia-a-dia" },
                  { value: "gerencia", label: "Vou contratar uma gerência" },
                  { value: "ambos", label: "Misto: entro nas decisões, gerente toca a rotina" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="capitalGiro"
                question="Você tem capital de giro além do investimento inicial?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
            </FormSection>

            <FormSection number={5} title="Alinhamento com a marca">
              <TextareaField
                control={form.control}
                name="motivacao"
                label="Por que quer abrir uma franquia Pé Direito?"
                placeholder="Conte com calma. Mínimo de 200 caracteres."
                minLength={200}
                showCounter
              />
              <TextField
                control={form.control}
                name="tempoAcompanha"
                label="Você acompanha a marca há quanto tempo?"
                placeholder="Ex: desde o lançamento, há 6 meses..."
              />
              <TextField
                control={form.control}
                name="comoConheceu"
                label="Como conheceu o Período Fundador?"
                placeholder="Ex: vídeo do Nikolas, indicação, imprensa..."
              />
            </FormSection>

            <FormErrorBanner errors={form.formState.errors} submitError={state.error} />

            <div className="pt-2 flex justify-center">
              <Button
                type="submit"
                disabled={state.status === "submitting"}
                className="rounded-full px-10 py-6 bg-[#2B9402] hover:bg-[#2B9402]/90 text-[#FEBF00] font-semibold disabled:opacity-70"
              >
                {state.status === "submitting" ? "Enviando..." : "Quero abrir uma franquia"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
