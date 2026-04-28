import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CtaButton } from "@/components/CtaButton";
import { joinWhatsAppGroup } from "@/lib/whatsapp";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-verde-escuro/95 backdrop-blur-md border-t border-amarelo/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <p className="font-narrow text-cream text-sm sm:text-base leading-tight hidden sm:block">
            <span className="text-amarelo font-semibold">1º.05 às 9h</span>
            {" · "}
            Quem está no grupo compra primeiro.
          </p>
          <p className="font-narrow text-cream text-sm leading-tight sm:hidden">
            <span className="text-amarelo font-semibold">1º.05</span>
            {" · "}
            Grupo compra primeiro.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <CtaButton
              size="md"
              onClick={() => joinWhatsAppGroup("/boas-vindas")}
            >
              Entrar no grupo
            </CtaButton>
            <button
              onClick={() => setDismissed(true)}
              className="text-cream/50 hover:text-cream transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
