import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSection } from "./FormSection";
import { FormSuccess } from "./FormSuccess";
import { FilterQuestion } from "./FilterQuestion";
import { RadioCardGroup } from "./RadioCardGroup";
import { TextField, TextareaField } from "./Field";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { getPorta } from "@/lib/portas";

const ATUACAO_OPTIONS = [
  { value: "cnpj", label: "Sim, com CNPJ ativo de representação" },
  { value: "informal", label: "Sim, mas sem CNPJ formalizado" },
  { value: "parado", label: "Já atuei, hoje estou parado" },
  {
    value: "nunca",
    label: "Nunca atuei",
    redirect: {
      rota: "/revendedor",
      portaNome: "Revendedor",
      mensagem:
        "Pra esta porta esperamos representantes comerciais com vivência B2B. Se você quer vender direto pra consumidor (B2C), a porta certa é a de Revendedor.",
    },
  },
] as const;

type AtuacaoValue = (typeof ATUACAO_OPTIONS)[number]["value"];

const schema = z.object({
  atuacao: z.enum(["cnpj", "informal", "parado", "nunca"]),
  nomeCompleto: z.string().min(1, "Campo obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(8, "WhatsApp obrigatório"),
  cnpj: z.string().min(1, "CNPJ obrigatório"),
  cidadeSede: z.string().min(1, "Campo obrigatório"),

  tempoAtuacao: z.string().min(1, "Campo obrigatório"),
  marcasRepresentadas: z.string().min(1, "Liste suas marcas principais"),
  setores: z.string().min(1, "Selecione ao menos um setor"),
  regioesAtuacao: z.string().min(1, "Liste estados ou regiões"),
  lojasAtivas: z.string().min(1, "Campo obrigatório"),
  comissaoMensal: z.string().optional(),

  estrutura: z.enum(["solo", "equipe"], { errorMap: () => ({ message: "Selecione uma opção" }) }),
  temShowroom: z.enum(["sim", "nao"], { errorMap: () => ({ message: "Selecione uma opção" }) }),
  sistemaPedidos: z.enum(["sim", "nao"], { errorMap: () => ({ message: "Selecione uma opção" }) }),

  motivacao: z.string().min(200, "Mínimo de 200 caracteres"),
  redesAtivacao: z.string().min(1, "Campo obrigatório"),
  representaConcorrente: z.enum(["sim", "nao"], { errorMap: () => ({ message: "Selecione uma opção" }) }),
  exclusividade: z.enum(["sim", "nao", "negociar"], { errorMap: () => ({ message: "Selecione uma opção" }) }),

  referencias: z.string().min(1, "Cite ao menos 2 referências"),
  algoMais: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RepresentanteForm() {
  const porta = getPorta("representante");
  const [atuacao, setAtuacao] = useState<AtuacaoValue | undefined>(undefined);
  const isBlocked = atuacao === "nunca";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });

  const { state, submit } = useLeadSubmit<FormValues>({ tipo: "representante" });

  function handleAtuacaoChange(value: AtuacaoValue) {
    setAtuacao(value);
    form.setValue("atuacao", value as FormValues["atuacao"], { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    await submit(values);
  }

  if (state.status === "submitted") {
    return (
      <FormSuccess
        porta={porta}
        proximoPasso="Nosso time comercial vai analisar sua carteira e te chamar pra alinhar áreas e exclusividade. Tenha em mãos seu portfólio quando entrarmos em contato."
        prazoContato="Retorno em até 5 dias úteis."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <FilterQuestion
          eyebrow="Filtro de entrada"
          question="Você atua como representante comercial profissional hoje?"
          options={ATUACAO_OPTIONS as unknown as { value: AtuacaoValue; label: string; redirect?: { rota: string; portaNome: string; mensagem: string } }[]}
          value={atuacao}
          onChange={handleAtuacaoChange}
        />

        {!isBlocked && atuacao && (
          <>
            <FormSection number={1} title="Identidade">
              <TextField control={form.control} name="nomeCompleto" label="Nome completo" placeholder="Seu nome" />
              <TextField control={form.control} name="email" label="E-mail" type="email" placeholder="seu@email.com" />
              <TextField control={form.control} name="whatsapp" label="WhatsApp" placeholder="(00) 00000-0000" inputMode="tel" />
              <TextField control={form.control} name="cnpj" label="CNPJ da representação" placeholder="00.000.000/0000-00" inputMode="numeric" />
              <TextField control={form.control} name="cidadeSede" label="Cidade-sede" placeholder="Ex: Curitiba" />
            </FormSection>

            <FormSection number={2} title="Experiência">
              <TextField control={form.control} name="tempoAtuacao" label="Há quanto tempo atua como representante?" placeholder="Ex: 8 anos" />
              <TextareaField
                control={form.control}
                name="marcasRepresentadas"
                label="Marcas que representa atualmente"
                placeholder="Liste as principais. Pode ser bullet por linha."
              />
              <TextField
                control={form.control}
                name="setores"
                label="Setores que atende"
                placeholder="Calçado, moda, esporte, casa, beleza, outro..."
              />
              <TextField
                control={form.control}
                name="regioesAtuacao"
                label="Estados ou regiões de atuação"
                placeholder="Ex: PR, SC e SP interior"
              />
              <TextField
                control={form.control}
                name="lojasAtivas"
                label="Quantas lojas ativas você tem na carteira hoje?"
                placeholder="Ex: 120"
                inputMode="numeric"
              />
              <TextField
                control={form.control}
                name="comissaoMensal"
                label="Faturamento médio mensal de comissão (faixa)"
                placeholder="Ex: R$ 15 a 25 mil"
                optional
              />
            </FormSection>

            <FormSection number={3} title="Estrutura">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Trabalha solo ou tem equipe?</p>
                <RadioCardGroup
                  layout="grid"
                  options={[
                    { value: "solo", label: "Solo" },
                    { value: "equipe", label: "Tenho equipe" },
                  ]}
                  value={form.watch("estrutura")}
                  onChange={(v) => form.setValue("estrutura", v as FormValues["estrutura"], { shouldValidate: true })}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Tem showroom ou escritório próprio?</p>
                <RadioCardGroup
                  layout="grid"
                  options={[
                    { value: "sim", label: "Sim" },
                    { value: "nao", label: "Não" },
                  ]}
                  value={form.watch("temShowroom")}
                  onChange={(v) => form.setValue("temShowroom", v as "sim" | "nao", { shouldValidate: true })}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Possui sistema de pedidos ou catálogo digital?</p>
                <RadioCardGroup
                  layout="grid"
                  options={[
                    { value: "sim", label: "Sim" },
                    { value: "nao", label: "Não" },
                  ]}
                  value={form.watch("sistemaPedidos")}
                  onChange={(v) => form.setValue("sistemaPedidos", v as "sim" | "nao", { shouldValidate: true })}
                />
              </div>
            </FormSection>

            <FormSection number={4} title="Estratégia">
              <TextareaField
                control={form.control}
                name="motivacao"
                label="Por que quer representar a Pé Direito?"
                placeholder="Conte com calma. Mínimo de 200 caracteres."
                minLength={200}
                showCounter
              />
              <TextField
                control={form.control}
                name="redesAtivacao"
                label="Quais redes ou grupos de lojas você consegue ativar nos primeiros 90 dias?"
                placeholder="Ex: Grupo X, Y, Z..."
              />
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Você representa hoje alguma marca concorrente direta da Pé Direito?
                </p>
                <RadioCardGroup
                  layout="grid"
                  options={[
                    { value: "sim", label: "Sim" },
                    { value: "nao", label: "Não" },
                  ]}
                  value={form.watch("representaConcorrente")}
                  onChange={(v) => form.setValue("representaConcorrente", v as "sim" | "nao", { shouldValidate: true })}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Tem disponibilidade para exclusividade na categoria sandália?
                </p>
                <RadioCardGroup
                  options={[
                    { value: "sim", label: "Sim, posso assumir exclusividade" },
                    { value: "nao", label: "Não, prefiro multi-marca" },
                    { value: "negociar", label: "Aberto a negociar" },
                  ]}
                  value={form.watch("exclusividade")}
                  onChange={(v) => form.setValue("exclusividade", v as FormValues["exclusividade"], { shouldValidate: true })}
                />
              </div>
            </FormSection>

            <FormSection number={5} title="Referências">
              <TextareaField
                control={form.control}
                name="referencias"
                label="Cite 2 contatos profissionais (marcas que representa) que possam dar referência sobre você"
                placeholder="Nome, marca, e-mail ou WhatsApp."
              />
              <TextareaField
                control={form.control}
                name="algoMais"
                label="Algo mais relevante sobre sua operação?"
                placeholder="Espaço livre."
                optional
              />
            </FormSection>

            {state.error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {state.error}
              </p>
            )}

            <div className="pt-2 flex justify-center">
              <Button
                type="submit"
                disabled={state.status === "submitting"}
                className="rounded-full px-10 py-6 bg-[#2B9402] hover:bg-[#2B9402]/90 text-[#FEBF00] font-semibold disabled:opacity-70"
              >
                {state.status === "submitting" ? "Enviando..." : "Quero representar a marca"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
