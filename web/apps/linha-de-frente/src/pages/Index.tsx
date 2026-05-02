import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { BrandLogo } from "@/components/BrandLogo";
import { CtaButton } from "@/components/CtaButton";
import { LaunchDateBanner } from "@/components/LaunchDateBanner";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCarousel } from "@/components/ProductCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { FullBleedImage } from "@/components/FullBleedImage";
import { EditorialBlock } from "@/components/EditorialBlock";
import { FloatingCta } from "@/components/FloatingCta";
import { joinWhatsAppGroup } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/useReveal";

// Lançamento oficial: 12.05.2026 · 00:00 BRT (horário de Brasília, UTC-3)
const LAUNCH_DATE = new Date("2026-05-12T00:00:00-03:00");

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

  const entrarNoCirculo = () => joinWhatsAppGroup("/boas-vindas");

  // Hero entrance — stagger sutil ao carregar.
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>("[data-hero-reveal]");
    if (els.length === 0) return;
    gsap.set(els, { opacity: 0, y: reduced ? 0 : 12 });
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: reduced ? 0.4 : 0.7,
      ease: "power2.out",
      stagger: 0.08,
      delay: 0.05,
    });
  }, []);

  // Refs de scroll-reveal por bloco.
  const origemRef = useReveal<HTMLDivElement>();
  const droneRef = useReveal<HTMLDivElement>();
  const linhaFrenteHeaderRef = useReveal<HTMLDivElement>();
  const linhaFrenteGridRef = useReveal<HTMLDivElement>({ stagger: 0.06 });
  const carrosselHeaderRef = useReveal<HTMLDivElement>();
  const numerosGridRef = useReveal<HTMLDivElement>({ stagger: 0.06 });
  const primeiroPassoRef = useReveal<HTMLDivElement>();
  const circuloHeaderRef = useReveal<HTMLDivElement>();
  const circuloGridRef = useReveal<HTMLDivElement>({ stagger: 0.06 });
  const manifestoRef = useReveal<HTMLDivElement>();
  const ctaFinalRef = useReveal<HTMLDivElement>();
  const camisetaRef = useReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-cream text-foreground">
      {/* ─────────── TOP BAR ─────────── */}
      <div className="bg-verde text-amarelo">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5 grid grid-cols-3 items-center">
          <span className="justify-self-start font-narrow font-semibold text-xs">
            12.05
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
      <header className="bg-verde text-amarelo min-h-[600px] sm:min-h-[680px] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-20 sm:pt-20 sm:pb-28 w-full">
          <div className="flex justify-center" data-hero-reveal>
            <BrandLogo className="h-7 sm:h-8 brightness-0 invert opacity-90" />
          </div>

          <p className="font-narrow font-semibold uppercase text-amarelo text-center mt-12 text-sm sm:text-base" data-hero-reveal>
            Lançamento Oficial · Dia 12 de Maio
          </p>

          <h1 className="font-display uppercase text-amarelo text-center mt-6 leading-[1.02] text-balance text-[12vw] sm:text-[8vw] md:text-[88px] lg:text-[100px]" data-hero-reveal>
            Te disseram pra não começar com o Pé Direito.
          </h1>

          <p className="font-narrow font-semibold text-center mt-10 text-amarelo leading-[1.18] text-balance text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto" data-hero-reveal>
            A gente fez uma marca feita pra quem cansou de ver o lado certo ser tratado como lado B.
          </p>

          {/* Countdown ao vivo no hero */}
          <div className="mt-14 sm:mt-16" data-hero-reveal>
            <div className="bg-cream rounded-3xl px-6 sm:px-10 py-10 sm:py-12 max-w-3xl mx-auto">
              <p className="font-narrow font-semibold uppercase text-azul text-xs sm:text-sm text-center mb-8">
                Contagem regressiva
              </p>
              <HeroCountdown timeLeft={timeLeft} tone="dark" />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3" data-hero-reveal>
            <CtaButton onClick={entrarNoCirculo}>
              Entrar no Círculo Pé Direito
            </CtaButton>
            <p className="font-narrow font-semibold text-[11px] sm:text-xs text-amarelo">
              Vagas limitadas · O Círculo fecha antes do dia 12
            </p>
          </div>
        </div>
      </header>

      {/* ─────────── MARQUEE AZUL ─────────── */}
      <LaunchDateBanner date={LAUNCH_DATE} />

      {/* ─────────── 01 · A ORIGEM ─────────── */}
      <div ref={origemRef}>
      <EditorialBlock
        src="/images/img-12.jpg"
        alt="Fachada de prédio com a palavra BRASIL pintada em verde sobre parede bege"
        imagePosition="right"
        imageFocus="top center"
        className="bg-cream"
      >
        <span className="inline-block font-narrow font-semibold text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
          A origem
        </span>

        <p className="font-narrow font-semibold uppercase text-azul text-xs sm:text-sm mt-6">
          De onde a gente vem
        </p>

        <h2 className="font-display uppercase text-verde mt-4 leading-[1.02] text-balance text-4xl sm:text-5xl lg:text-6xl">
          A gente nasceu de uma lacuna.
        </h2>

        <div className="font-narrow text-verde-escuro mt-8 text-base sm:text-lg leading-relaxed max-w-lg space-y-5">
          <p>
            Em 2024, uma marca de chinelo disse, em rede nacional, pro brasileiro
            não entrar em 2026 com o pé direito. Falaram pelo brasileiro sem ouvir
            o brasileiro. Foram canceladas. Milhões rasgaram o chinelo.
          </p>
          <p>
            E ficou um vazio. Um vazio que nenhuma marca grande quis preencher,
            porque marca grande, no Brasil, tem medo de assumir lado.
          </p>
          <p className="font-semibold text-verde-escuro">
            A Pé Direito assumiu.
          </p>
          <p>
            Não como nicho. Não como protesto. Como linha de frente: marca de
            qualidade, estética que orgulha, posicionamento que não pede licença.
          </p>
          <p className="font-semibold text-verde-escuro">
            A primeira marca brasileira a botar a cara, o nome e o produto do
            lado em que a maioria do país já está.
          </p>
        </div>
      </EditorialBlock>
      </div>

      {/* ─────────── FULL-BLEED · DRONE MAR BRASIL ─────────── */}
      <div ref={droneRef}>
      <FullBleedImage
        src="/images/img-01.png"
        videoSrc="/videos/drone-mar-brasil.mp4"
        alt="Vista aérea de drone sobre o mar azul do Brasil"
        aspectClass="aspect-[16/9] sm:aspect-[2.4/1]"
        overlay={30}
      >
        <div className="text-center max-w-4xl">
          <p className="font-display uppercase text-amarelo leading-[1.02] text-balance text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
            É o Brasil que começa com o Pé Direito.
          </p>
        </div>
      </FullBleedImage>
      </div>

      {/* ─────────── 02 · O QUE A PÉ DIREITO É ─────────── */}
      <section className="bg-verde text-amarelo px-6 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto" ref={linhaFrenteHeaderRef}>
            <span className="inline-block font-narrow font-semibold text-verde text-xs sm:text-sm bg-amarelo rounded-full px-5 py-2">
              O que a Pé Direito é
            </span>
            <h2 className="font-display uppercase text-amarelo mt-8 leading-[1.02] text-balance text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
              Não somos lado B. Somos linha de frente.
            </h2>
          </div>

          <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" ref={linhaFrenteGridRef}>
            {[
              {
                n: "01",
                t: "Estética que respeita.",
                d: "Produto pensado, design sério, qualidade real. A Pé Direito é uma marca que orgulha quem calça, não uma camiseta de campanha em forma de chinelo.",
              },
              {
                n: "02",
                t: "Posicionamento que não esconde.",
                d: "A gente fala o que pensa. E o que a gente pensa é o que o brasileiro pensa há muito tempo, mas nenhuma marca tinha coragem de dizer.",
              },
              {
                n: "03",
                t: "Cultura que constrói.",
                d: "Cada par vendido alimenta um movimento que valoriza o que sempre sustentou esse país: família, fé, trabalho e amor pela pátria.",
              },
              {
                n: "04",
                t: "Movimento que começa do chão.",
                d: "Pé Direito não é uma marca de chinelo. É a porta de entrada pra uma transformação cultural que começa do chão pra cima. Literalmente.",
              },
            ].map((card) => (
              <article
                key={card.n}
                className="bg-cream rounded-3xl p-8 sm:p-10"
              >
                <p className="font-lead text-azul text-2xl sm:text-3xl">
                  {card.n}
                </p>
                <h3 className="font-display uppercase text-verde mt-4 leading-[1.05] text-balance text-3xl sm:text-4xl">
                  {card.t}
                </h3>
                <p className="font-narrow text-verde-escuro mt-5 text-base sm:text-lg leading-relaxed">
                  {card.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CAMISETA · MAIS QUE CHINELO ─────────── */}
      <div ref={camisetaRef}>
      <EditorialBlock
        src="/images/Camiseta_Listrada.jpg"
        alt="Camiseta listrada amarela e branca com bandeira do Brasil bordada no peito, pendurada num varal sobre céu azul"
        imagePosition="right"
        imageFocus="center"
        className="bg-cream"
      >
        <span className="inline-block font-narrow font-semibold text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
          Mais que chinelo
        </span>

        <h2 className="font-display uppercase text-verde mt-8 leading-[1.02] text-balance text-4xl sm:text-5xl lg:text-6xl">
          Uma marca pra um povo. Não pra um pé.
        </h2>

        <div className="font-narrow text-verde-escuro mt-8 text-base sm:text-lg leading-relaxed max-w-lg space-y-5">
          <p>
            A Pé Direito começa do chão. Mas não para no pé.
          </p>
          <p>
            Camiseta listrada, bandeira no peito, identidade visual com cara de Brasil. Cada peça é mais um motivo pra orgulho. E mais um sinal de que essa marca veio pra ficar.
          </p>
        </div>
      </EditorialBlock>
      </div>

      {/* ─────────── PULL QUOTE + CARROSSEL · VERDE-ESCURO ─────────── */}
      <section className="bg-verde-escuro text-amarelo px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center" ref={carrosselHeaderRef}>
          <p className="font-narrow text-amarelo text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12">
            A Pé Direito nasceu pra representar o que acreditamos.
          </p>

          <p className="font-display uppercase leading-[1.05] text-4xl sm:text-6xl md:text-7xl sm:text-balance">
            Toda compra é<br className="sm:hidden" /> um posicionamento.
          </p>
        </div>

        <ProductCarousel inline />

        <div className="max-w-2xl mx-auto text-center mt-12 sm:mt-16">
          <div className="font-narrow text-cream text-lg sm:text-xl leading-relaxed space-y-1">
            <p>O que você compra…</p>
            <p>Mostra o que você apoia.</p>
            <p>Mesmo que você não perceba.</p>
          </div>

          <div className="font-narrow text-cream mt-8 text-lg sm:text-xl leading-relaxed space-y-1">
            <p>Todos os dias, você está financiando algo.</p>
            <p>Uma ideia.</p>
            <p>Um comportamento.</p>
            <p>Um tipo de mundo.</p>
          </div>
        </div>
      </section>

      {/* ─────────── 03 · NÚMEROS ─────────── */}
      <section className="bg-azul px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 sm:mb-16">
            <span className="inline-block font-narrow font-semibold text-azul text-xs sm:text-sm bg-amarelo rounded-full px-5 py-2">
              O movimento em números
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" ref={numerosGridRef}>
            {[
              { n: "+480 mil", l: "Pessoas caminhando junto" },
              { n: "20 mil", l: "Pares vendidos na pré-venda" },
              { n: "80 mil", l: "Pares prontos pro dia 12" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="bg-cream rounded-3xl p-10 sm:p-12 text-center"
              >
                <p className="font-display uppercase text-verde leading-[1] text-5xl sm:text-6xl md:text-7xl">
                  {stat.n}
                </p>
                <p className="font-narrow font-semibold text-verde-escuro mt-6 text-base sm:text-lg leading-snug">
                  {stat.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── 04 · O CÍRCULO (intro) ─────────── */}
      <div ref={primeiroPassoRef}>
      <EditorialBlock
        src="/images/img-06.jpg"
        alt="Multidão de brasileiros vestindo verde e amarelo reunidos nas ruas"
        imagePosition="left"
        className="bg-cream"
      >
        <span className="inline-block font-narrow font-semibold text-azul text-xs sm:text-sm bg-[#FFF2C9] rounded-full px-5 py-2 w-fit">
          Seu primeiro passo
        </span>

        <h2 className="font-display uppercase text-verde mt-8 leading-[1.02] text-balance text-4xl sm:text-5xl lg:text-6xl">
          Tudo começa com o primeiro passo. O seu é entrar no Círculo.
        </h2>

        <div className="font-narrow text-verde-escuro mt-8 text-base sm:text-lg leading-relaxed max-w-lg space-y-5">
          <p>
            O Círculo Pé Direito é o primeiro lugar onde a marca acontece. É de
            lá que sai o link de compra antes da loja, é de lá que sai recado
            direto, sem filtro de algoritmo, sem rede social no meio.
          </p>
          <p>
            Quem entra no Círculo não tá só comprando primeiro. Tá participando
            ativamente das ações que apontam pra transformação cultural que a
            gente quer ver no Brasil.
          </p>
          <p className="font-semibold text-verde-escuro">
            A transformação cultural do Brasil vai começar com o pé direito. E
            ela começa com o seu primeiro passo.
          </p>
        </div>

        <div className="mt-10 flex">
          <CtaButton onClick={entrarNoCirculo}>
            Entrar no Círculo Pé Direito
          </CtaButton>
        </div>
      </EditorialBlock>
      </div>

      {/* ─────────── 04 · O CÍRCULO (4 cards) ─────────── */}
      <section className="bg-verde-escuro px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 sm:mb-16 max-w-3xl mx-auto" ref={circuloHeaderRef}>
            <span className="inline-block font-narrow font-semibold text-verde-escuro text-xs sm:text-sm bg-amarelo rounded-full px-5 py-2">
              O que você ganha no Círculo
            </span>
            <h3 className="font-display uppercase text-amarelo mt-8 leading-[1.05] text-balance text-3xl sm:text-4xl lg:text-5xl">
              Quatro motivos pra estar lá dentro antes do dia 12.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" ref={circuloGridRef}>
            {[
              {
                n: "01",
                t: "Você compra antes do Brasil inteiro.",
                d: "No dia 12, a venda abre primeiro aqui dentro. Quem está no Círculo escolhe primeiro, garante o tamanho, garante o par.",
              },
              {
                n: "02",
                t: "Você participa das próximas ações.",
                d: "A Pé Direito não vai parar no chinelo. As próximas ações culturais saem primeiro daqui. Quem está no Círculo decide junto e anda junto.",
              },
              {
                n: "03",
                t: "Você recebe direto, sem rede social no meio.",
                d: "Recados do Nikolas, bastidores da marca, próximos lançamentos. Cai no seu WhatsApp, sem algoritmo cortando.",
              },
              {
                n: "04",
                t: "Você entra pra história da marca.",
                d: "Os primeiros do Círculo ficam registrados. Quando essa marca virar o que ela vai virar, dá pra dizer: eu estava.",
              },
            ].map((card) => (
              <article
                key={card.n}
                className="bg-cream rounded-3xl p-8 sm:p-10"
              >
                <p className="font-lead text-azul text-2xl sm:text-3xl">
                  {card.n}
                </p>
                <h4 className="font-display uppercase text-verde mt-4 leading-[1.05] text-balance text-3xl sm:text-4xl">
                  {card.t}
                </h4>
                <p className="font-narrow text-verde-escuro mt-5 text-base sm:text-lg leading-relaxed">
                  {card.d}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 sm:mt-16 flex flex-col items-center gap-3">
            <CtaButton onClick={entrarNoCirculo}>
              Entrar no Círculo Pé Direito
            </CtaButton>
            <p className="font-narrow font-semibold text-[11px] sm:text-xs text-cream">
              Vagas limitadas · O Círculo fecha antes do dia 12
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── 05 · MANIFESTO ─────────── */}
      <section className="bg-amarelo px-6 sm:px-10 lg:px-16 py-24 sm:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center" ref={manifestoRef}>
          <span className="inline-block font-narrow font-semibold text-amarelo text-xs sm:text-sm bg-verde rounded-full px-5 py-2">
            Manifesto
          </span>

          <h2 className="font-display uppercase text-verde mt-10 leading-[1.02] text-balance text-5xl sm:text-7xl md:text-8xl">
            A cultura brasileira nunca teve uma marca.
          </h2>

          <div className="font-narrow text-verde-escuro mt-12 text-lg sm:text-xl md:text-2xl leading-relaxed space-y-5 max-w-2xl mx-auto">
            <p>Teve discurso. Teve voto. Teve tribuna.</p>
            <p>
              Mas marca, com estética, com chão, com chinelo no pé, nunca teve.
            </p>
            <p className="font-display uppercase text-verde text-4xl sm:text-5xl md:text-6xl leading-[1.02] pt-4 pb-2">
              Agora tem.
            </p>
            <p>
              A Pé Direito é a primeira marca a assumir, em rede nacional e em
              alto e bom som, o lado de quem ama esse país do jeito que ele é,
              e quer ele do jeito que ele pode ser.
            </p>
            <p className="font-semibold">
              A transformação cultural do Brasil começa com o pé direito.
            </p>
            <p className="font-semibold">
              E ela começa com o seu primeiro passo.
            </p>
          </div>

          <p className="font-narrow font-semibold uppercase text-verde mt-16 text-sm sm:text-base">
            Pé Direito · 12.05.2026
          </p>
        </div>
      </section>

      {/* ─────────── 06 · CTA FINAL ─────────── */}
      <section
        id="inscricao"
        className="bg-verde text-amarelo px-6 sm:px-10 lg:px-16 py-24 sm:py-32 scroll-mt-10 min-h-[600px] flex items-center"
      >
        <div className="max-w-4xl mx-auto text-center" ref={ctaFinalRef}>
          <span className="inline-block font-narrow font-semibold text-verde text-xs sm:text-sm bg-amarelo rounded-full px-5 py-2">
            Acesso antecipado
          </span>

          <h2 className="font-display uppercase text-amarelo mt-10 leading-[1.02] text-balance text-5xl sm:text-7xl md:text-8xl">
            Vivendo uma vida com o Pé Direito.
          </h2>

          <p className="font-narrow text-amarelo mt-10 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A gente começa dia 12. Mas o seu começo é agora. Entra no Círculo,
            anda primeiro, e faz parte do que vai virar uma das maiores
            transformações culturais que esse país já viu.
          </p>

          {/* Countdown compacto pra reforçar urgência */}
          <div className="mt-14 max-w-3xl mx-auto bg-cream rounded-3xl px-6 sm:px-10 py-10">
            <p className="font-narrow font-semibold uppercase text-azul text-xs sm:text-sm mb-6">
              Faltam pra abrir
            </p>
            <HeroCountdown timeLeft={timeLeft} tone="dark" />
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <CtaButton onClick={entrarNoCirculo}>
              Entrar no Círculo Pé Direito
            </CtaButton>
            <p className="font-narrow font-semibold text-[11px] sm:text-xs text-amarelo inline-flex items-center gap-2">
              <span aria-hidden>⚠</span>
              <span>
                O Círculo fecha antes do lançamento. Quem entra agora, anda
                primeiro.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── GRID DE VARIANTES ─────────── */}
      <ProductGallery />

      <SiteFooter
        showLaunchDisclaimer
        tagline="A primeira marca da linha de frente. A marca do povo brasileiro."
      />

      {/* ─────────── FLOATING CTA ─────────── */}
      <FloatingCta />
    </div>
  );
};

function HeroCountdown({
  timeLeft,
  tone = "dark",
}: {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  tone?: "dark" | "light";
}) {
  const blocks: Array<{ value: number; label: string }> = [
    { value: timeLeft.days, label: "Dias" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  const numberColor = tone === "dark" ? "text-azul" : "text-amarelo";
  const labelColor = tone === "dark" ? "text-verde-escuro" : "text-cream";
  const sepColor = tone === "dark" ? "text-verde" : "text-cream";

  return (
    <div className="flex gap-3 sm:gap-5 md:gap-7 justify-center items-start">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-start gap-3 sm:gap-5 md:gap-7">
          <div className="flex flex-col items-center">
            <span className={`font-lead text-5xl sm:text-6xl md:text-7xl tabular-nums leading-none ${numberColor}`}>
              {b.value.toString().padStart(2, "0")}
            </span>
            <span className={`font-narrow font-semibold text-xs sm:text-sm mt-3 ${labelColor}`}>
              {b.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className={`font-lead text-5xl sm:text-6xl md:text-7xl leading-none self-start ${sepColor}`}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Index;
