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
import { ExternalLink, ArrowLeft } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "horario",
    question: "Quando o carrinho abre?",
    answer:
      "O carrinho abre em 1º.05 às 9h (horário de Brasília). Não há prorrogação — fique de olho na contagem regressiva para não perder o horário.",
  },
  {
    id: "unidades",
    question: "Quantas unidades estão disponíveis?",
    answer:
      "A primeira leva é em quantidade limitada — lote único, edição limitada. Quando esgotar, esgota. Quem está no grupo do WhatsApp recebe o link com prioridade, antes do público geral.",
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
      <div className="min-h-full bg-cream">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
          {/* Hero */}
          <header className="text-center space-y-3">
            <p className="font-narrow font-medium text-azul text-xs sm:text-sm">
              FAQ
            </p>
            <h1
              id="faq-heading"
              className="font-display lowercase text-verde leading-[0.96] text-balance text-4xl sm:text-5xl md:text-6xl"
            >
              perguntas frequentes
            </h1>
            <p className="font-narrow text-verde-escuro/85 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Tudo o que você precisa saber sobre o lançamento e a abertura do carrinho.
            </p>
          </header>

          {/* FAQ em cards */}
          <section aria-labelledby="faq-heading" className="space-y-3">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border border-verde-escuro/15 rounded-2xl bg-cream/60 overflow-hidden px-4 sm:px-5"
                >
                  <AccordionTrigger className="text-left py-5 sm:py-6 hover:no-underline [&[data-state=open]]:pb-2 text-base sm:text-lg font-semibold text-verde">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-narrow text-verde-escuro/80 text-sm sm:text-base leading-relaxed pb-5 sm:pb-6 pt-0">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Suporte */}
          <section
            id="suporte"
            className="bg-verde rounded-2xl p-6 sm:p-8 space-y-5 text-amarelo"
            aria-labelledby="suporte-heading"
          >
            <h2
              id="suporte-heading"
              className="font-display lowercase leading-[1.0] text-balance text-3xl sm:text-4xl"
            >
              suporte
            </h2>
            <p className="font-narrow text-amarelo/90 text-sm sm:text-base leading-relaxed max-w-lg">
              Precisa de ajuda com seu pedido, dúvidas sobre entrega ou algum problema técnico? Entre em contato pelo canal oficial da Pé Direito.
            </p>
            <Button
              asChild
              className="w-full sm:w-auto bg-amarelo text-verde-escuro hover:bg-amarelo/90 font-narrow font-semibold rounded-full px-8 py-6 text-base"
            >
              <a
                href="https://wa.me/552731990337"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Falar com o suporte
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </section>

          {/* Voltar */}
          <p className="text-center pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-narrow font-medium text-sm text-verde hover:text-verde/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar para a contagem regressiva
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FaqSuporte;
