import { ButtonHTMLAttributes, forwardRef } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "verde" | "amarelo" | "azul" | "ghost" | "locked";

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "lg";
}

const VARIANTS: Record<Variant, string> = {
  /**
   * default — preto puro + branco. Única superfície do projeto onde `#000` é permitido,
   * por decisão de calibração com o cliente. Não replicar em outros elementos.
   * Tipografia: SF Pro/Arial Narrow 600 (sentence case), sem uppercase, sem tracking —
   * Bayon não funciona em escala pequena de CTA.
   */
  primary: "bg-black text-white hover:bg-black/90",
  verde: "bg-verde text-amarelo hover:bg-verde-escuro",
  /** uso secundário/pontual; default é primary */
  amarelo: "bg-amarelo text-verde-escuro hover:brightness-95",
  azul: "bg-azul text-amarelo hover:brightness-95",
  ghost: "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5",
  /** uso exclusivo do app countdown — não substituir */
  locked: "bg-verde-escuro text-amarelo cursor-not-allowed",
};

export const CtaButton = forwardRef<HTMLButtonElement, CtaButtonProps>(
  ({ className, variant = "primary", size = "lg", children, disabled, ...rest }, ref) => {
    const sizeCls =
      size === "lg" ? "px-8 py-5 text-base sm:text-lg" : "px-6 py-3 text-sm sm:text-base";

    const isLocked = variant === "locked";

    // CTA primário usa SF Pro (font-narrow 600). Demais variants seguem em Bayon
    // UPPERCASE (font-lead) — escala de botão é aceitável quando o token de marca
    // é o suporte cromático (amarelo/verde/azul/locked), não o preto neutro.
    const typeCls =
      variant === "primary"
        ? "font-narrow font-semibold"
        : "font-lead uppercase";

    return (
      <button
        ref={ref}
        disabled={disabled ?? isLocked}
        className={cn(
          "inline-flex items-center justify-center gap-3 rounded-full transition-all",
          typeCls,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde focus-visible:ring-offset-2",
          VARIANTS[variant],
          sizeCls,
          isLocked && "pointer-events-none",
          className,
        )}
        {...rest}
      >
        {isLocked && <Lock className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />}
        {children}
      </button>
    );
  },
);
CtaButton.displayName = "CtaButton";
