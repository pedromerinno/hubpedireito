import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CtaButton } from "@/components/CtaButton";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LaunchDateBanner } from "@/components/LaunchDateBanner";
import { PreparationChecklist } from "@/components/PreparationChecklist";

import { ProductGallery } from "@/components/ProductGallery";
import { ProductCarousel } from "@/components/ProductCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { FullBleedImage } from "@/components/FullBleedImage";
import { EditorialBlock } from "@/components/EditorialBlock";
import { FloatingCta } from "@/components/FloatingCta";
import { joinWhatsAppGroup } from "@/lib/whatsapp";

const LAUNCH_DATE = new Date("2026-05-01T09:00:00-03:00");

function useCountdown(target: Date) {
  const [delta, setDelta] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDelta(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const total = Math.max(0, delta);
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

const Index = () => {
  const timeLeft = useCountdown(LAUNCH_DATE);

  const scrollToCta = () =>
    document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-cream text-foreground">
      {/* ─────────── TOP BAR ─────────── */}
      <div className="bg-verde text-amarelo">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5 grid grid-cols-3 items-center">
          <span className="justify-self-start font-narrow font-semibold text-xs">
            1º.05 · 9h
          </span>
          <span className="justify-self-center font-narrow font-semibold text-xs text-center">
            Pé Direito
          </span>
          <span className="justify-self-end font-narrow font-semibold text-xs text-right">
            Grupo oficial
          </span>
        </div>
      </div>

      {/* ─────────── HERO ─────────── */}
      <header className="bg-verde text-amarelo min-h-[500px] sm:min-h-[600px] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="flex justify-center">
            <BrandLogo className="h-7 sm:h-8 brightness-0 invert opacity-90" />
          </div>

          <h1 className="font-display uppercase text-amarelo text-center mt-14 leading-[1.05] text-balance text-[14vw] sm:text-[9vw] md:text-[108px]">
            tudo começa com um passo.
          </h1>

          <p className="font-narrow font-semibold lowercase text-center mt-8 text-amarelo/95 leading-[1.15] text-balance text-xl sm:text-2xl md:text-3xl">
            o seu começa com o Pé Direito.
          </p>

          <div className="mt-14 flex flex-col items-center gap-3">
            <CtaButton onClick={scrollToCta}>
              Quero começar com o Pé Direito
            </CtaButton>
            <p className="font-narrow font-bold normal-case text-[11px] sm:text-xs text-amarelo/80">
              Acesso antecipado ao lançamento oficial
            </p>
          </div>
        </div>
      </header>

      {/* ─────────── COUNTDOWN ─────────── */}
      <section
        className="bg-cream px-6 sm:px-10 py-16 sm:py-20"
        aria-label="Contagem regressiva para abertura do carrinho"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-narrow font-medium text-azul text-xs sm:text-sm mb-10 sm:mb-12">
            Abertura · 1º.05 · 9h
          </p>

          <CountdownTimer timeLeft={timeLeft} />

          <p className="font-narrow text-verde/70 text-[11px] sm:text-xs mt-6">
            Abre 1º.05 às 9h. Horário de Brasília.
          </p>

          <div className="mt-12 sm:mt-14 flex flex-col items-center gap-3">
            <CtaButton onClick={() => joinWhatsAppGroup("/boas-vindas")}>
              Entrar no grupo oficial
            </CtaButton>
            <p className="font-narrow text-verde/70 text-[11px] sm:text-xs">
              Acesso antecipado pelo grupo de WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── MARQUEE AZUL ─────────── */}
      <LaunchDateBanner date={LAUNCH_DATE} />

      {/* ─────────── FULL-BLEED · DRONE MAR BRASIL ───────────
          Source: 319723_Sea_Blue_Drone_Aerials_By_Daniel_Schua_Artlist_4K.mp4
          (do banco de vídeos do Dropbox, copiado pra public/videos local) */}
      <FullBleedImage
        src="/images/img-01.png"
        videoSrc="/videos/drone-mar-brasil.mp4"
        alt="Vista aérea de drone sobre o mar azul do Brasil"
        aspectClass="aspect-[16/9] sm:aspect-[2.4/1]"
        overlay={30}
      >
        <div className="text-center max-w-4xl">
          <p className="font-display uppercase text-amarelo leading-[1.05] text-balance text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
            é o Brasil que começa com o Pé Direito.
          </p>
        </div>
      </FullBleedImage>

      {/* ─────────── MANIFESTO EDITORIAL ─────────── */}
      <EditorialBlock
        src="/images/img-12.jpg"
        alt="Fachada de prédio com a palavra BRASIL pintada em verde sobre parede bege"
        imagePosition="right"
        imageFocus="top center"
        className="bg-cream"
      >
        <span className="inline-block font-narrow font-medium text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
          01 · Manifesto
        </span>

        <h2 className="font-display uppercase text-verde mt-8 leading-[1.05] text-balance text-4xl sm:text-5xl lg:text-6xl">
          falaram pra você não começar o ano com o Pé Direito.
        </h2>

        <h3 className="font-display uppercase text-verde-escuro mt-6 leading-[1.05] text-balance text-3xl sm:text-4xl lg:text-5xl">
          a gente decidiu começar todos os dias com o Pé Direito.
        </h3>

        <p className="font-narrow text-foreground/80 mt-8 text-base sm:text-lg leading-relaxed max-w-lg">
          Não é só um chinelo.
          <br />
          É um posicionamento.
        </p>
      </EditorialBlock>

      {/* ─────────── PULL QUOTE + CARROSSEL · VERDE ─────────── */}
      <section className="bg-verde text-amarelo px-6 sm:px-10 pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-narrow text-amarelo/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12">
            A Pé Direito nasceu pra representar o que acreditamos.
          </p>

          <p className="font-display uppercase leading-[1.05] text-balance text-4xl sm:text-6xl md:text-7xl">
            toda compra é um posicionamento.
          </p>

        </div>

        <ProductCarousel inline />

        <div className="max-w-2xl mx-auto text-center mt-12 sm:mt-16">
          <div className="font-narrow text-amarelo/80 text-lg sm:text-xl leading-relaxed space-y-1">
            <p>O que você compra…</p>
            <p>mostra o que você apoia.</p>
            <p>Mesmo que você não perceba.</p>
          </div>

          <div className="font-narrow text-amarelo/80 mt-8 text-lg sm:text-xl leading-relaxed space-y-1">
            <p>Todos os dias, você está financiando algo.</p>
            <p>Uma ideia.</p>
            <p>Um comportamento.</p>
            <p>Um tipo de mundo.</p>
          </div>
        </div>
      </section>

      {/* ─────────── MANIFESTO CONTINUAÇÃO + VÍDEO ARARA ───────────
          Source: 6352324_Ara_Macaw_Tropical_Bird_By_Wildlife_and_Nature_Studios_Artlist_4K_menor.mp4 */}
      <EditorialBlock
        src="/images/img-02.jpg"
        videoSrc="/videos/arara-tropical.mp4"
        alt="Arara tropical brasileira em vista aproximada"
        imagePosition="left"
        className="bg-cream"
      >
        <div className="font-narrow text-foreground text-lg sm:text-xl leading-relaxed space-y-1">
          <p>A maioria faz isso no automático.</p>
          <p>Mas tem quem faz diferente.</p>
        </div>
        <p className="font-display uppercase text-azul mt-8 leading-[1.0] text-balance text-3xl sm:text-4xl lg:text-5xl">
          escolhe com consciência.<br />
          escolhe o que representa.<br />
          escolhe o que acredita.
        </p>
        <p className="font-narrow font-semibold text-verde-escuro mt-8 text-base sm:text-lg leading-relaxed">
          A Pé Direito nasceu pra isso.
        </p>
      </EditorialBlock>

      {/* ─────────── FULL-BLEED · COTIDIANO (removido) ─────────── */}

      {/* ─────────── PARA QUEM ─────────── */}
      <section className="bg-cream">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px] lg:min-h-[600px]">
          <div className="max-w-2xl lg:ml-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36 flex flex-col justify-center">
            <span className="inline-block font-narrow font-medium text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
              02 · Pra quem
            </span>

            <h2 className="font-display uppercase text-verde mt-6 leading-[0.96] text-balance text-4xl sm:text-5xl lg:text-6xl">
              não é pra qualquer um.
            </h2>

            <ul className="mt-10 space-y-4">
              {[
                "Defende a família como base de tudo.",
                "Acredita no trabalho como o único caminho digno.",
                "Valoriza o empreendedorismo e a liberdade de construir.",
                "Tem princípios que não se trocam por conveniência.",
              ].map((item) => (
                <li key={item} className="flex gap-4 items-baseline">
                  <span className="font-lead text-azul text-lg sm:text-xl shrink-0">
                    →
                  </span>
                  <span className="font-narrow font-semibold text-verde-escuro leading-snug text-base sm:text-lg lg:text-xl">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex">
              <CtaButton onClick={scrollToCta}>
                Quero começar com o Pé Direito
              </CtaButton>
            </div>
          </div>

          <div className="relative min-h-[400px] sm:min-h-[480px] lg:min-h-0 overflow-hidden">
            <img
              src="/images/img-06.jpg"
              alt="Multidão de brasileiros vestindo verde e amarelo reunidos nas ruas"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─────────── CHECKLIST ─────────── */}
      <PreparationChecklist />

      {/* ─────────── PRODUTO EDITORIAL ─────────── */}
      <section className="bg-cream">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px] lg:min-h-[600px]">
          <div className="relative min-h-[400px] sm:min-h-[480px] lg:min-h-0 overflow-hidden order-2 lg:order-1">
            <video
              src="/videos/barco-gratidao.mp4"
              poster="/images/img-09.jpg"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Barco de pescador verde e amarelo chamado Gratidão ancorado na praia"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="max-w-2xl lg:mr-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36 flex flex-col justify-center order-1 lg:order-2">
            <span className="inline-block font-narrow font-medium text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
              04 · Produto
            </span>
            <h2 className="font-display uppercase text-verde mt-6 leading-[1.0] text-balance text-4xl sm:text-5xl lg:text-6xl">
              um chinelo que você usa todos os dias.
            </h2>
            <p className="font-display uppercase text-verde-escuro mt-6 leading-[1.05] text-balance text-3xl sm:text-4xl lg:text-5xl">
              um significado que você carrega pra vida.
            </p>

            <div className="mt-10 flex">
              <CtaButton onClick={scrollToCta}>
                Quero garantir meu par
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── COMEÇO DO DIA · MANIFESTO DIÁRIO ─────────── */}
      <EditorialBlock
        src="/images/Camiseta_Listrada.jpg"
        alt="Camiseta listrada amarela e branca Pé Direito pendurada no varal com céu azul ao fundo"
        imagePosition="right"
        className="bg-cream"
      >
        <span className="inline-block font-narrow font-medium text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
          03 · O ritual
        </span>

        <h2 className="font-display uppercase text-verde mt-8 leading-[1.05] text-balance text-4xl sm:text-5xl lg:text-6xl">
          todo dia começa com um passo.
        </h2>

        <div className="font-narrow text-foreground/85 mt-8 text-base sm:text-lg leading-relaxed max-w-lg space-y-1">
          <p>Antes de qualquer resultado…</p>
          <p>existe uma decisão.</p>
        </div>

        <div className="font-narrow text-foreground/85 mt-6 text-base sm:text-lg leading-relaxed max-w-lg space-y-1">
          <p>Levantar no automático…</p>
          <p>ou assumir o controle.</p>
        </div>

        <p className="font-narrow text-foreground/85 mt-6 text-base sm:text-lg leading-relaxed max-w-lg">
          Parece pequeno. Não é.
        </p>

        <p className="font-narrow font-semibold text-verde-escuro mt-6 text-base sm:text-lg leading-relaxed max-w-lg">
          Quem leva a vida a sério, leva o começo do dia também.
        </p>

        <div className="font-narrow text-foreground/85 mt-6 text-base sm:text-lg leading-relaxed max-w-lg space-y-1">
          <p>A Pé Direito nasceu pra representar isso.</p>
          <p>Um lembrete diário de como você escolhe começar.</p>
          <p>Um símbolo de quem você é, e do que você acredita.</p>
        </div>

        <div className="mt-10 flex">
          <CtaButton onClick={scrollToCta}>
            Quero começar com o Pé Direito
          </CtaButton>
        </div>
      </EditorialBlock>

      {/* ─────────── ESCASSEZ · AZUL ─────────── */}
      <section className="bg-azul px-6 sm:px-10 py-20 sm:py-28 lg:py-36 min-h-[500px] sm:min-h-[600px] flex items-center">
        <div className="text-center max-w-6xl mx-auto">
          <p className="font-narrow font-semibold uppercase tracking-wide text-amarelo/80 text-xs sm:text-sm mb-6 sm:mb-8">
            1º de maio · lote único · edição limitada
          </p>
          <p className="font-display uppercase text-amarelo leading-[1.05] text-balance text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
            quando esgotar, esgota.
          </p>
          <p className="font-narrow text-cream/80 mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            A primeira leva da Pé Direito foi produzida em quantidade limitada.
          </p>
          <p className="font-narrow font-semibold text-amarelo mt-6 sm:mt-8 text-lg sm:text-2xl leading-snug max-w-2xl mx-auto">
            Não vai ter chinelo pra todo mundo.
          </p>
        </div>
      </section>

      {/* ─────────── INSCRIÇÃO ─────────── */}
      <section
        id="inscricao"
        className="bg-verde text-amarelo px-6 sm:px-10 py-20 sm:py-28 scroll-mt-10 min-h-[500px] sm:min-h-[600px] flex items-center"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <span className="inline-block font-narrow font-medium text-amarelo/80 text-xs sm:text-sm bg-amarelo/10 rounded-full px-5 py-2">
              05 · Acesso antecipado
            </span>
          </div>

          <h2 className="font-display uppercase text-amarelo text-center mt-6 leading-[0.95] text-balance text-5xl sm:text-7xl md:text-8xl">
            garanta o seu par.
          </h2>

          <p className="font-narrow text-amarelo/95 mt-10 text-base sm:text-lg leading-relaxed max-w-xl mx-auto text-center">
            Quem está no grupo do WhatsApp recebe o link com prioridade, antes
            do público geral. Quem não está, concorre com todo mundo no dia 1º.
          </p>

          <div
            id="shopify-form-embed"
            className="mt-12 bg-amarelo text-verde-escuro rounded-2xl p-6 sm:p-10"
          >
            <div className="text-center font-narrow uppercase text-xs py-12 sm:py-16 border border-dashed border-verde-escuro/30 rounded-2xl">
              [ formulário Shopify · cole o embed code aqui ]
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <CtaButton onClick={() => joinWhatsAppGroup("/boas-vindas")}>
              Entrar no grupo oficial agora
            </CtaButton>
            <p className="font-narrow uppercase text-[11px] sm:text-xs text-amarelo/80">
              Acesso antecipado.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── GRID DE VARIANTES ─────────── */}
      <ProductGallery />

      <SiteFooter showLaunchDisclaimer />

      {/* ─────────── FLOATING CTA ─────────── */}
      <FloatingCta />
    </div>
  );
};

export default Index;
