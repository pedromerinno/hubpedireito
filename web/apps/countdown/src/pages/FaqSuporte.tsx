import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Mail, ExternalLink } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "horario",
    question: "Quando o carrinho abre?",
    answer:
      "O carrinho abre às segundas-feiras às 9h (horário de Brasília). Não há prorrogação — fique de olho na contagem regressiva para não perder o horário.",
  },
  {
    id: "unidades",
    question: "Quantas unidades estão disponíveis?",
    answer:
      "São 10.000 unidades por rodada. Com cerca de 50.000 pessoas na fila, a abertura é por ordem de acesso. Recomendamos estar preparado no horário.",
  },
  {
    id: "como-comprar",
    question: "Como faço para comprar?",
    answer:
      "Quando a contagem regressiva chegar a zero, o botão \"CARRINHO ABERTO\" ficará ativo. Clique e você será direcionado ao site para finalizar sua compra.",
  },
  {
    id: "horario-brasilia",
    question: "O horário é sempre de Brasília?",
    answer:
      "Sim. Todos os horários são em horário de Brasília. Ajuste seu relógio para não perder a abertura do carrinho.",
  },
  {
    id: "problemas",
    question: "E se eu tiver problemas no site?",
    answer:
      "Entre em contato com nosso suporte pelo link abaixo. Estamos prontos para ajudar com dúvidas técnicas ou sobre seu pedido.",
  },
];

const FaqSuporte = () => {
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (hash === "suporte") {
      const el = document.getElementById("suporte");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-[600px] mx-auto px-4 py-8 space-y-10">
        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h1
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
          >
            Perguntas frequentes
          </h1>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Suporte */}
        <section
          id="suporte"
          className="bg-card rounded-xl border p-6 sm:p-8 space-y-4"
          aria-labelledby="suporte-heading"
        >
          <h2
            id="suporte-heading"
            className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2"
          >
            <Mail className="h-6 w-6 text-primary" aria-hidden />
            Suporte
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Precisa de ajuda com seu pedido, dúvidas sobre entrega ou algum
            problema técnico? Entre em contato pelo canal oficial da Pé Direito.
          </p>
          <Button
            asChild
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <a
              href="https://www.usepedireito.com.br/contato"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Falar com o suporte
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </Button>
        </section>

        <p className="text-center">
          <Link
            to="/"
            className="text-sm text-primary hover:underline font-medium"
          >
            ← Voltar para a contagem regressiva
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default FaqSuporte;
