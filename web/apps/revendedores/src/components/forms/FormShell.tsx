import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import pedireitoLogo from "@/assets/pedireito-logo.svg";
import { SiteFooter } from "@/components/SiteFooter";
import { PORTAS, type Porta } from "@/lib/portas";

interface FormShellProps {
  porta: Porta;
  manifesto: string;
  children: React.ReactNode;
}

/** Mapeia o SVG branco original pra bege #F9F1D1 via cadeia de filtros. */
const LOGO_FILTER_CREAM =
  "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(442%) hue-rotate(355deg) brightness(101%) contrast(94%)";

export function FormShell({ porta, manifesto, children }: FormShellProps) {
  const portaIndex = PORTAS.findIndex((p) => p.id === porta.id) + 1;
  const hasVideo = Boolean(porta.videoUrl);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F1D1]">
      {/* Hero da porta (full-bleed video + top bar overlay) */}
      <header
        className="relative overflow-hidden min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] flex flex-col"
        style={hasVideo ? undefined : { backgroundColor: porta.tema.bg }}
      >
        {hasVideo && (
          <>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={porta.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
            />
            {/* Overlay escuro pra garantir leitura do texto cream/amarelo */}
            <div className="absolute inset-0 bg-black/35" aria-hidden />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
              aria-hidden
            />
          </>
        )}

        {/* Top bar — fica sobre o vídeo */}
        <div className="relative z-[2]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#F9F1D1]/90 hover:text-[#F9F1D1] transition-opacity"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao hub
            </Link>
            <img
              src={pedireitoLogo}
              alt="Pé Direito"
              className="h-5 sm:h-6 w-auto"
              style={{ filter: LOGO_FILTER_CREAM }}
            />
          </div>
        </div>

        {/* Conteúdo do hero (centralizado vertical na área restante) */}
        <div className="relative z-[2] flex-1 flex items-center px-5 sm:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-[960px] mx-auto w-full">
            <p
              className="pd-lead text-base sm:text-lg text-[#F9F1D1]/85"
              aria-hidden
            >
              porta 0{portaIndex}
            </p>

            <h1 className="mt-6 sm:mt-8 text-[#FEBF00] text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[0.92] tracking-tight uppercase">
              {porta.nome}.
            </h1>

            <p className="mt-8 sm:mt-10 text-[#F9F1D1] text-lg sm:text-xl md:text-2xl font-medium leading-snug max-w-2xl">
              {porta.definicao}
            </p>

            <p className="mt-5 text-[#F9F1D1]/85 text-sm sm:text-base max-w-2xl leading-relaxed">
              {manifesto}
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo do form */}
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-[820px] mx-auto">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}
