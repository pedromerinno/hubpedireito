import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CtaButton } from "@/components/CtaButton";
import { SiteFooter } from "@/components/SiteFooter";
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

const BoasVindas = () => {
  const c = useCountdown(LAUNCH_DATE);

  return (
    <div className="min-h-screen bg-cream text-foreground">
      {/* TOP BAR — slim, SF Pro/Arial, sentence case */}
      <div className="bg-verde text-amarelo">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-2 flex items-center justify-between">
          <span className="font-narrow font-medium text-xs">
            Você está dentro
          </span>
          <span className="font-narrow font-medium text-xs">
            Lançamento · 1º.05
          </span>
        </div>
      </div>

      {/* HERO — bege, vídeo como protagonista */}
      <header className="px-6 sm:px-10 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center">
            <BrandLogo className="h-9 sm:h-11" />
          </div>

          <p className="font-narrow font-medium text-azul text-center mt-12 text-xs sm:text-sm">
            Bem-vindo ao grupo oficial
          </p>

          <h1 className="font-display lowercase text-verde text-center mt-5 leading-[0.94] text-balance text-5xl sm:text-7xl md:text-8xl">
            você está dentro.
          </h1>

          {/* Player de vídeo — protagonista do hero */}
          <div className="mt-12 aspect-video w-full bg-verde-escuro rounded-2xl overflow-hidden">
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              poster="/welcome-poster.png"
              preload="metadata"
            >
              {/* TODO: dropar /public/welcome.mp4 */}
              <source src="/welcome.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>
          </div>

          <p className="font-narrow uppercase text-verde-escuro/55 text-center mt-4 text-[11px] sm:text-xs">
            Mensagem do embaixador · ~1 min
          </p>

          <p className="font-narrow text-foreground/90 mt-12 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Se você está aqui, é porque entendeu antes dos outros: o que você
            compra automaticamente apoia. E tá na hora de apoiar marcas que
            representam aquilo que a gente acredita.
          </p>
        </div>
      </header>

      {/* AVISO DE GOLPE — único bloco em azul, função de alerta */}
      <section className="bg-azul text-amarelo px-6 sm:px-10 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <p className="font-narrow font-medium text-amarelo/85 text-xs sm:text-sm">
            Atenção · golpe rolando
          </p>

          <h2 className="font-display lowercase mt-6 leading-[0.96] text-balance text-4xl sm:text-6xl md:text-7xl">
            a gente não vende nada antes do dia 1º de maio.
          </h2>

          <div className="mt-10 space-y-5 font-narrow text-base sm:text-lg leading-relaxed text-amarelo/95 max-w-2xl">
            <p>
              Já tá aparecendo gente tentando se aproveitar do movimento.
              Grupos falsos. Sites falsos.
            </p>
            <p className="font-poster uppercase text-xl sm:text-2xl">
              Se vier de qualquer outro canal, é golpe.
            </p>
            <p>
              O único canal oficial é o site da marca. O link do lançamento vai
              ser enviado dentro do grupo de WhatsApp, no dia 1º de maio.
            </p>
          </div>
        </div>
      </section>

      {/* COUNTDOWN + FECHAMENTO — verde, encerra a página */}
      <section className="bg-verde text-amarelo px-6 sm:px-10 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-narrow font-medium text-amarelo/80 text-xs sm:text-sm">
            1º · 05 · Lote único
          </p>

          <h2 className="font-display lowercase mt-6 leading-[0.94] text-balance text-5xl sm:text-7xl md:text-8xl">
            a gente se vê dia 1º.
          </h2>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-14 max-w-xl mx-auto">
            {[
              ["dias", c.days],
              ["horas", c.hours],
              ["min", c.minutes],
              ["seg", c.seconds],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="flex flex-col items-center"
              >
                <span className="font-lead text-4xl sm:text-6xl tabular-nums text-amarelo leading-none">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="font-narrow font-medium text-[10px] sm:text-xs mt-3 text-amarelo/80">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="font-narrow text-amarelo/95 mt-14 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Lote único. Edição limitada. Não vai ter pra todo mundo. Mas você
            entrou na hora certa.
          </p>

          <div className="mt-10 flex justify-center">
            <CtaButton onClick={() => joinWhatsAppGroup("/boas-vindas")}>
              Confirmar entrada no grupo
            </CtaButton>
          </div>
        </div>
      </section>

      <SiteFooter showLaunchDisclaimer />
    </div>
  );
};

export default BoasVindas;
