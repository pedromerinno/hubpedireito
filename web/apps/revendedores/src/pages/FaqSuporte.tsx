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
import { Mail, ExternalLink, ArrowLeft, HelpCircle } from "lucide-react";

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
      <div className="min-h-full bg-[#FCF8ED]">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
          {/* Hero */}
          <header className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFF2C9] text-[#2B9402] mb-2" aria-hidden>
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1
              id="faq-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2B9402] tracking-tight"
            >
              Perguntas frequentes
            </h1>
            <p className="text-[#2B9402]/85 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
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
                  className="border border-border border-b-0 rounded-xl bg-card shadow-sm overflow-hidden px-4 sm:px-5 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left py-5 sm:py-6 hover:no-underline [&[data-state=open]]:pb-2 text-base sm:text-lg font-semibold text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-primary/80 text-sm sm:text-base leading-relaxed pb-5 sm:pb-6 pt-0">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Suporte */}
          <section
            id="suporte"
            className="bg-[#2B9402] rounded-2xl p-6 sm:p-8 space-y-5 text-white"
            aria-labelledby="suporte-heading"
          >
            <h2
              id="suporte-heading"
              className="text-xl sm:text-2xl font-bold flex items-center gap-3"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20" aria-hidden>
                <Mail className="h-5 w-5" />
              </span>
              Suporte
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-lg">
              Precisa de ajuda com seu pedido, dúvidas sobre entrega ou algum problema técnico? Entre em contato pelo canal oficial da Pé Direito.
            </p>
            <Button
              asChild
              className="w-full sm:w-auto bg-white text-[#2B9402] hover:bg-white/90 font-semibold rounded-full px-8 py-6"
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

          {/* Voltar */}
          <p className="text-center pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2B9402] hover:text-[#2B9402]/80 transition-colors"
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
