import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSection } from "./FormSection";
import { FormSuccess } from "./FormSuccess";
import { RadioCardField } from "./RadioCardGroup";
import { FormErrorBanner } from "./FormErrorBanner";
import { TextField, TextareaField, SelectField, ESTADOS_BR } from "./Field";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { getPorta } from "@/lib/portas";

// Apenas o e-mail é obrigatório.
// Os demais campos são opcionais para não travar o envio. O time
// completa o que faltar no follow-up por WhatsApp.
const schema = z.object({
  nomeCompleto: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  cidade: z.string().optional(),
  estado: z.string().optional(),

  papelNoEvento: z.enum(["noivo", "cerimonialista", "padrinho", "outro"]).optional(),

  tipoDeUso: z.enum(["kit_padrinhos", "pos_festa", "ambos"]).optional(),
  dataEvento: z.string().optional(),
  localCidade: z.string().optional(),
  quantidadeEstimada: z.enum(["ate30", "30a80", "80a150", "150mais"]).optional(),
  personalizacaoInteresse: z.enum(["sim", "nao"]).optional(),

  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CasamentoForm() {
  const porta = getPorta("casamento");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });

  const { state, submit } = useLeadSubmit<FormValues>({ tipo: "casamento" });
  const onInvalid = useScrollToFirstError<FormValues>();

  async function onSubmit(values: FormValues) {
    await submit(values);
  }

  if (state.status === "submitted") {
    return (
      <FormSuccess
        porta={porta}
        proximoPasso="Nosso time de eventos vai analisar seu pedido e voltar com as opções de kit, prazo de produção e personalização disponíveis pro seu casamento."
        prazoContato="Retorno em até 5 dias úteis."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 sm:space-y-8">
        <FormSection number={1} title="Identidade">
          <TextField
            control={form.control}
            name="nomeCompleto"
            label="Nome completo"
            placeholder="Seu nome"
          />
          <TextField
            control={form.control}
            name="whatsapp"
            label="WhatsApp"
            placeholder="(00) 00000-0000"
            inputMode="tel"
          />
          <TextField
            control={form.control}
            name="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
          />
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
            <TextField
              control={form.control}
              name="cidade"
              label="Cidade onde você mora"
              placeholder="Ex: Salvador"
            />
            <SelectField
              control={form.control}
              name="estado"
              label="Estado"
              placeholder="UF"
              options={ESTADOS_BR}
            />
          </div>
        </FormSection>

        <FormSection number={2} title="Seu papel no evento">
          <RadioCardField
            control={form.control}
            name="papelNoEvento"
            question="Como você se encaixa nesse casamento?"
            options={[
              { value: "noivo", label: "Sou noivo ou noiva" },
              { value: "cerimonialista", label: "Sou cerimonialista ou produtor(a) de evento" },
              { value: "padrinho", label: "Sou padrinho ou madrinha" },
              { value: "outro", label: "Outro envolvimento" },
            ]}
          />
        </FormSection>

        <FormSection
          number={3}
          title="O evento"
          hint="A gente vai pelos dois caminhos. Você escolhe qual faz sentido pro seu dia."
        >
          <RadioCardField
            control={form.control}
            name="tipoDeUso"
            question="Como você quer usar Pé Direito no casamento?"
            options={[
              {
                value: "kit_padrinhos",
                label: "Kit pros padrinhos e madrinhas (presente ou lembrança)",
              },
              {
                value: "pos_festa",
                label: "Chinelo pós festa (conforto pra galera dançar)",
              },
              {
                value: "ambos",
                label: "Os dois caminhos",
              },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              control={form.control}
              name="dataEvento"
              label="Data do casamento"
              placeholder="Ex: 12/09/2026 ou ainda definindo"
            />
            <TextField
              control={form.control}
              name="localCidade"
              label="Cidade do evento"
              placeholder="Ex: Trancoso, BA"
            />
          </div>

          <RadioCardField
            control={form.control}
            name="quantidadeEstimada"
            question="Quantos pares você imagina precisar?"
            layout="grid"
            options={[
              { value: "ate30", label: "Até 30 pares" },
              { value: "30a80", label: "Entre 30 e 80 pares" },
              { value: "80a150", label: "Entre 80 e 150 pares" },
              { value: "150mais", label: "Mais de 150 pares" },
            ]}
          />

          <RadioCardField
            control={form.control}
            name="personalizacaoInteresse"
            question="Tem interesse em personalização (nome dos noivos, data, cor)?"
            layout="grid"
            options={[
              { value: "sim", label: "Sim, quero saber as opções" },
              { value: "nao", label: "Não, o padrão Pé Direito já está ótimo" },
            ]}
          />
        </FormSection>

        <FormSection number={4} title="Algo mais">
          <TextareaField
            control={form.control}
            name="observacoes"
            label="Quer contar mais alguma coisa sobre o evento?"
            placeholder="Tema, paleta, prazo apertado, nome de quem indicou. Espaço livre."
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
            {state.status === "submitting" ? "Enviando..." : "Quero levar Pé Direito pro meu dia"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
