import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import type { Porta } from "@/lib/portas";

interface FormSuccessProps {
  porta: Porta;
  /** Texto que descreve o próximo passo específico daquela porta */
  proximoPasso: string;
  /** Quanto tempo até a equipe entrar em contato */
  prazoContato?: string;
}

export function FormSuccess({ porta, proximoPasso, prazoContato }: FormSuccessProps) {
  return (
    <div className="rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(43,148,2,0.12)] ring-1 ring-black/[0.04] px-6 sm:px-10 py-12 sm:py-16 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#2B9402]/30 text-[#2B9402] mb-8">
        <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
      </div>

      <p className="text-[11px] font-semibold uppercase text-[#2B9402]/60">
        Cadastro recebido · Porta {porta.nome}
      </p>

      <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[0.95] tracking-tight text-[#2B9402] uppercase">
        obrigado por
        <br />
        caminhar com a gente.
      </h2>

      <p className="mt-6 text-base sm:text-[17px] text-foreground/75 leading-relaxed max-w-[440px] mx-auto">
        {proximoPasso}
      </p>

      {prazoContato && (
        <p className="mt-2 text-sm text-muted-foreground/80">{prazoContato}</p>
      )}

      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#2B9402] transition-colors hover:text-[#2B9402]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B9402]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        Voltar ao hub
      </Link>
    </div>
  );
}
