import { useEffect, useState } from "react";
import { Package, Users, Globe, Instagram, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { CtaButton } from "@/components/CtaButton";
import { CountdownTimer } from "@/components/CountdownTimer";
import { PreparationChecklist } from "@/components/PreparationChecklist";
import { SiteFooter } from "@/components/SiteFooter";

const LAUNCH_DATE = new Date("2026-05-14T09:00:00-03:00");
const STORE_URL = "https://www.usepedireito.com.br";

function useCountdown(target: Date) {
  const [delta, setDelta] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDelta(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const total = Math.max(0, delta);
  const isExpired = delta <= 0;
  return {
    timeLeft: {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / (1000 * 60)) % 60),
      seconds: Math.floor((total / 1000) % 60),
    },
    isExpired,
  };
}

const urgencyItems = [
  {
    icon: Package,
    text: "50 mil pares no primeiro lote.",
  },
  {
    icon: Users,
    text: "Mais de 100.000 pessoas aguardando.",
  },
];

const golpeCanais = [
  {
    icon: Globe,
    label: "Site oficial",
    value: "usepedireito.com.br",
    href: "https://www.usepedireito.com.br",
  },
  {
    icon: Instagram,
    label: "Instagram oficial",
    value: "@usepedireito__",
    href: "https://www.instagram.com/usepedireito__",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp do suporte",
    value: "+55 27 3199-0337",
    href: "https://wa.me/552731990337",
  },
];

const Index = () => {
  const { timeLeft, isExpired } = useCountdown(LAUNCH_DATE);

  const handleCtaClick = () => {
    if (isExpired) {
      window.location.href = STORE_URL;
    }
  };

  return (
    <div className="min-h-screen bg-cream text-foreground">
      {/* ─────────── TOP BAR ─────────── */}
      <div className="bg-verde text-amarelo">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5 grid grid-cols-3 items-center">
          <span className="justify-self-start font-narrow font-semibold text-xs">
            14.05 · 9h
          </span>
          <span className="justify-self-center font-narrow font-semibold text-xs text-center">
            Pé Direito
          </span>
          <span className="justify-self-end font-narrow font-semibold text-xs text-right">
            Lançamento
          </span>
        </div>
      </div>

      {/* ─────────── HERO ─────────── */}
      <header
        className="bg-verde text-amarelo flex flex-col justify-center"
        aria-label="Contagem regressiva para abertura do carrinho"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-20 sm:pt-20 sm:pb-28 w-full">
          <div className="flex flex-col items-center gap-4">
            <BrandLogo className="h-7 sm:h-8 brightness-0 invert opacity-90" />
            <p className="font-narrow font-semibold text-xs sm:text-sm text-cream text-center">
              Ditado Popular · Identidade Brasileira · Liberdade de Escolha
            </p>
          </div>

          <h1 className="font-display uppercase text-amarelo text-center mt-10 sm:mt-12 leading-[1.05] text-balance text-[12vw] sm:text-[8vw] md:text-[96px]">
            tudo começa com um passo.
          </h1>

          <p className="font-narrow font-semibold text-center mt-6 sm:mt-8 text-amarelo leading-[1.15] text-balance text-xl sm:text-2xl md:text-3xl">
            O seu começa com o Pé Direito.
          </p>

          <div className="mt-12 sm:mt-14">
            <CountdownTimer timeLeft={timeLeft} tone="light" />
          </div>

          <div className="mt-12 sm:mt-14 flex flex-col items-center gap-3">
            <CtaButton
              onClick={handleCtaClick}
              variant={isExpired ? "primary" : "locked"}
              disabled={!isExpired}
            >
              {isExpired
                ? "Carrinho aberto · clique aqui"
                : "Carrinho abre 14.05 às 9h"}
            </CtaButton>
            <p className="font-narrow font-semibold text-[11px] sm:text-xs text-cream">
              {isExpired
                ? "Corra. As unidades são limitadas."
                : "Abre 14.05 às 9h · Horário de Brasília"}
            </p>
          </div>
        </div>
      </header>

      {/* ─────────── URGÊNCIA · AZUL ─────────── */}
      <section
        className="bg-azul px-6 sm:px-10 lg:px-16 py-20 sm:py-28"
        aria-labelledby="urgencia-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <span className="inline-block font-narrow font-semibold text-azul text-xs sm:text-sm bg-amarelo rounded-full px-5 py-2">
              Por que a urgência é real
            </span>
            <h2
              id="urgencia-heading"
              className="font-display uppercase text-amarelo mt-8 leading-[1.0] text-balance text-4xl sm:text-5xl md:text-6xl"
            >
              Não vai ter pra todo mundo.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {urgencyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-5 bg-cream rounded-2xl p-6 sm:p-8 min-h-[120px]"
                >
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-verde rounded-full flex items-center justify-center">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-amarelo" aria-hidden />
                  </div>
                  <span className="font-narrow font-semibold text-verde-escuro text-base sm:text-lg leading-snug">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── CUIDADO COM O GOLPE ─────────── */}
      <section
        className="bg-amarelo px-6 sm:px-10 lg:px-16 py-20 sm:py-28"
        aria-labelledby="golpe-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <span className="inline-block font-narrow font-semibold text-amarelo text-xs sm:text-sm bg-verde-escuro rounded-full px-5 py-2">
              Atenção
            </span>
            <h2
              id="golpe-heading"
              className="font-display uppercase text-verde-escuro mt-8 leading-[1.0] text-balance text-4xl sm:text-5xl md:text-6xl"
            >
              Cuidado com o golpe.
            </h2>
            <p className="font-narrow font-semibold text-verde-escuro mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              A Pé Direito vende em um único lugar. Não compre fora dos canais oficiais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {golpeCanais.map((canal) => {
              const Icon = canal.icon;
              return (
                <a
                  key={canal.label}
                  href={canal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-start gap-4 bg-verde rounded-2xl p-6 sm:p-7 min-h-[160px] transition-transform hover:-translate-y-1"
                >
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-cream rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-verde-escuro" aria-hidden />
                  </div>
                  <div>
                    <p className="font-narrow font-semibold text-cream text-xs uppercase tracking-wide">
                      {canal.label}
                    </p>
                    <p className="font-narrow font-semibold text-cream text-base sm:text-lg leading-snug mt-1">
                      {canal.value}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          <p className="font-narrow font-semibold text-verde-escuro mt-12 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center">
            A Pé Direito nunca pede pix antecipado, nunca vende por link de mensagem privada, nunca oferece desconto fora do site oficial. Desconfiou, denuncia.
          </p>
        </div>
      </section>

      {/* ─────────── CHECKLIST ─────────── */}
      <PreparationChecklist />

      <SiteFooter showLaunchDisclaimer />
    </div>
  );
};

export default Index;
