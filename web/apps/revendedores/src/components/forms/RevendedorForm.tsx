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

const CANAL_OPTIONS = [
  { value: "fisica", label: "Loja física própria (mesmo que pequena)" },
  { value: "online", label: "Loja online / e-commerce próprio" },
  { value: "redes", label: "Redes sociais e WhatsApp" },
  { value: "eventos", label: "Eventos, igrejas, comunidades" },
  { value: "porta", label: "Porta a porta / sacoleira" },
  { value: "indef", label: "Ainda não decidi" },
] as const;

type CanalValue = (typeof CANAL_OPTIONS)[number]["value"];

// Apenas o e-mail é obrigatório.
const schema = z.object({
  canalVenda: z.enum(["fisica", "online", "redes", "eventos", "porta", "indef"]).optional(),

  nomeCompleto: z.string().optional(),
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  whatsapp: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cnpjStatus: z.enum(["sim", "nao", "mei"]).optional(),

  jaVende: z.enum(["sim", "nao"]).optional(),
  oQueVende: z.string().optional(),
  tempoVendendo: z.string().optional(),
  clientelaAtiva: z.string().optional(),

  volumeMensal: z.enum(["20", "50", "100", "300", "300+"]).optional(),
  espacoEstoque: z.enum(["sim", "nao"]).optional(),
  exclusividade: z.enum(["exclusivo", "junto"]).optional(),

  motivacao: z.string().optional(),
  comoConheceu: z.string().optional(),
  redeOuComunidade: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RevendedorForm() {
  const porta = getPorta("revendedor");
  const [canal, setCanal] = useState<CanalValue | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });
  const onInvalid = useScrollToFirstError<FormValues>();
  const { state, submit } = useLeadSubmit<FormValues>({ tipo: "revendedor" });

  function handleCanalChange(value: CanalValue) {
    setCanal(value);
    form.setValue("canalVenda", value as FormValues["canalVenda"], { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    await submit(values);
  }

  if (state.status === "submitted") {
    return (
      <FormSuccess
        porta={porta}
        proximoPasso="Vamos te enviar o kit de revenda, condições e ativação no próximo lote do Período Fundador. Fica atento ao WhatsApp."
        prazoContato="Retorno em até 3 dias úteis."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 sm:space-y-8">
        <FilterQuestion
          eyebrow="Filtro de entrada"
          question="Como você pretende vender a Pé Direito?"
          options={CANAL_OPTIONS as unknown as { value: CanalValue; label: string }[]}
          value={canal}
          onChange={handleCanalChange}
        />

        {canal && (
          <>
            <FormSection number={1} title="Identidade">
              <TextField control={form.control} name="nomeCompleto" label="Nome completo" placeholder="Seu nome" />
              <TextField control={form.control} name="email" label="E-mail" type="email" placeholder="seu@email.com" />
              <TextField control={form.control} name="whatsapp" label="WhatsApp" placeholder="(00) 00000-0000" inputMode="tel" />
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
                <TextField control={form.control} name="cidade" label="Cidade" placeholder="Sua cidade" />
                <SelectField control={form.control} name="estado" label="Estado" placeholder="UF" options={ESTADOS_BR} />
              </div>
              <RadioCardField
                control={form.control}
                name="cnpjStatus"
                question="Tem CNPJ?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim, CNPJ ativo" },
                  { value: "mei", label: "MEI" },
                  { value: "nao", label: "Não tenho" },
                ]}
              />
            </FormSection>

            <FormSection number={2} title="Operação atual">
              <RadioCardField
                control={form.control}
                name="jaVende"
                question="Você já vende algum produto hoje?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <TextField control={form.control} name="oQueVende" label="Se sim, o quê?" placeholder="Ex: roupas, cosméticos..." optional />
              <TextField control={form.control} name="tempoVendendo" label="Há quanto tempo vende?" placeholder="Ex: 3 anos" optional />
              <TextField
                control={form.control}
                name="clientelaAtiva"
                label="Tem clientela ativa? Quantas pessoas compram de você regularmente?"
                placeholder="Estimativa, ex: 80"
                optional
              />
            </FormSection>

            <FormSection number={3} title="Capacidade">
              <RadioCardField
                control={form.control}
                name="volumeMensal"
                question="Volume mensal estimado de compra (pares)"
                options={[
                  { value: "20", label: "Até 20 pares" },
                  { value: "50", label: "20 a 50 pares" },
                  { value: "100", label: "50 a 100 pares" },
                  { value: "300", label: "100 a 300 pares" },
                  { value: "300+", label: "Acima de 300 pares" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="espacoEstoque"
                question="Tem espaço para estoque?"
                layout="grid"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <RadioCardField
                control={form.control}
                name="exclusividade"
                question="Vai vender exclusivamente Pé Direito?"
                options={[
                  { value: "exclusivo", label: "Só Pé Direito" },
                  { value: "junto", label: "Junto com outros produtos" },
                ]}
              />
            </FormSection>

            <FormSection number={4} title="Alinhamento com a marca">
              <TextareaField
                control={form.control}
                name="motivacao"
                label="Por que quer revender Pé Direito?"
                placeholder="Conte um pouco. Mínimo de 100 caracteres."
                minLength={100}
                showCounter
              />
              <TextField
                control={form.control}
                name="comoConheceu"
                label="Como conheceu a marca?"
                placeholder="Ex: Nikolas, redes, indicação..."
              />
              <TextField
                control={form.control}
                name="redeOuComunidade"
                label="Tem alguma rede social ou comunidade onde já divulga seus produtos?"
                placeholder="@usuario, link ou nome do grupo"
                optional
              />
            </FormSection>

            <FormErrorBanner errors={form.formState.errors} submitError={state.error} />

            <div className="pt-2 flex justify-center">
              <Button
                type="submit"
                disabled={state.status === "submitting"}
                className="rounded-full px-10 py-6 bg-[#2B9402] hover:bg-[#2B9402]/90 text-[#FEBF00] font-semibold disabled:opacity-70"
              >
                {state.status === "submitting" ? "Enviando..." : "Quero ser revendedor"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
