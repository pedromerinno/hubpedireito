import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Porta } from "@/lib/portas";

interface PortaCardProps {
  porta: Porta;
  /** índice do card no grid (1-5), counter discreto */
  index: number;
}

export function PortaCard({ porta, index }: PortaCardProps) {
  const { tema } = porta;

  return (
    <Link
      to={porta.rota}
      className="group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 lg:p-7 min-h-[340px] sm:min-h-[400px] lg:min-h-[420px] transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F1D1] focus-visible:ring-current"
      style={{ backgroundColor: tema.bg, color: tema.fg }}
      aria-label={`Quero entrar pela porta ${porta.nome}`}
    >
      {/* Counter chrome em Bayon (fonte de label do brand) */}
      <span
        className="pd-lead text-base sm:text-lg"
        style={{ opacity: 0.75 }}
        aria-hidden
      >
        0{index}
      </span>

      {/* Bottom: nome + descrição + hint de arrow */}
      <div className="mt-10">
        <h3 className="text-2xl sm:text-[26px] lg:text-[24px] xl:text-[26px] font-bold tracking-tight leading-tight capitalize break-words hyphens-none">
          {porta.nome}
        </h3>

        <p
          className="mt-3 text-sm leading-snug"
          style={{ opacity: 0.8 }}
        >
          {porta.paraQuem}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
          <span>{porta.cta}</span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
            strokeWidth={2.5}
          />
        </div>
      </div>
    </Link>
  );
}
