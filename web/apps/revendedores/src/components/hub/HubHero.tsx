import { Button } from "@/components/ui/button";
import pedireitoLogo from "@/assets/pedireito-logo.svg";
import { ArrowDown } from "lucide-react";

interface HubHeroProps {
  onSeePortas: () => void;
}

export function HubHero({ onSeePortas }: HubHeroProps) {
  return (
    <header className="relative bg-black overflow-hidden min-h-[720px] sm:min-h-[840px] lg:min-h-[88vh] flex">
      {/* Vídeo de fundo · drone sobre o mar do Brasil */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/drone-mar-brasil.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />

      {/*
        Camada preta translúcida pra dar profundidade ao vídeo e
        garantir contraste do texto bege.
      */}
      <div
        className="absolute inset-0 bg-black/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35"
        aria-hidden
      />

      {/* Conteúdo do hero */}
      <div className="relative z-[2] w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-20 sm:py-28 lg:py-32 flex flex-col items-center justify-center text-center">
        <img
          src={pedireitoLogo}
          alt="Pé Direito"
          className="h-7 sm:h-9 mx-auto"
          style={{
            // mapeia o SVG branco original pra bege #F9F1D1 via cadeia de filtros
            filter:
              "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(442%) hue-rotate(355deg) brightness(101%) contrast(94%)",
          }}
        />

        <p className="mt-16 sm:mt-24 text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-[#F9F1D1]/90">
          Período Fundador
        </p>

        <h1 className="mt-7 sm:mt-9 text-[#F9F1D1] font-extrabold tracking-tight leading-[0.94] text-4xl sm:text-6xl md:text-7xl uppercase">
          você quer caminhar
          <br />
          com a Pé Direito.
        </h1>

        <p className="mt-10 sm:mt-14 max-w-2xl mx-auto text-[#F9F1D1] text-lg sm:text-xl md:text-2xl leading-relaxed">
          Tem mais de uma forma de entrar nessa caminhada.
          <br className="hidden sm:block" />
          <span className="font-semibold"> Escolha a sua.</span>
        </p>

        <Button
          onClick={onSeePortas}
          className="mt-14 sm:mt-20 group rounded-full bg-[#FEBF00] hover:bg-[#FEBF00]/90 text-[#2B9402] px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold gap-3 transition-all"
        >
          Veja as 6 portas
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </Button>
      </div>
    </header>
  );
}
