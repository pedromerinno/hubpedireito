import pedireitoLogo from "@/assets/pedireito-logo.svg";
import { cn } from "@/lib/utils";

interface RevendedorStickyBarProps {
  onFillForm: () => void;
  visible: boolean;
}

export function RevendedorStickyBar({ onFillForm, visible }: RevendedorStickyBarProps) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-4 px-4 py-3.5 sm:py-4 sm:px-6 transition-all duration-300",
        "bg-verde",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
      aria-hidden={!visible}
    >
      <img
        src={pedireitoLogo}
        alt="Pé Direito"
        className="h-4 w-auto shrink-0 brightness-0 invert opacity-90"
      />
      <span className="font-narrow font-medium text-amarelo text-sm truncate">
        Seja um revendedor
      </span>
      <button
        type="button"
        onClick={onFillForm}
        className="shrink-0 font-narrow font-medium text-amarelo text-sm hover:text-amarelo/80 transition-colors"
      >
        /BR
      </button>
    </header>
  );
}
