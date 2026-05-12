import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Porta } from "@/lib/portas";
import { Button } from "@/components/ui/button";

interface FormSuccessProps {
  porta: Porta;
  /** Texto que descreve o próximo passo específico daquela porta */
  proximoPasso: string;
  /** Quanto tempo até a equipe entrar em contato */
  prazoContato?: string;
}

export function FormSuccess({ porta, proximoPasso, prazoContato }: FormSuccessProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#2B9402]/15 p-8 sm:p-10 md:p-12 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2B9402]/10 text-[#2B9402] mb-6">
        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
      </div>

      <p className="text-xs font-semibold tracking-[0.28em] uppercase text-[#2B9402]/70">
        Cadastro recebido · Porta {porta.nome}
      </p>
      <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[0.95] tracking-tight text-[#2B9402] lowercase">
        obrigado por
        <br />
        caminhar com a gente.
      </h2>

      <p className="mt-6 text-base sm:text-lg text-foreground/85 leading-relaxed max-w-md mx-auto">
        {proximoPasso}
      </p>

      {prazoContato && (
        <p className="mt-3 text-sm text-muted-foreground">{prazoContato}</p>
      )}

      <div className="mt-10">
        <Button
          asChild
          className="rounded-full bg-[#2B9402] hover:bg-[#2B9402]/90 text-[#FEBF00] px-7 py-6 text-sm font-semibold gap-2"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao hub
          </Link>
        </Button>
      </div>
    </div>
  );
}
