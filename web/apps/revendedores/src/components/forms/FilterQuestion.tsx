import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption<V extends string = string> {
  value: V;
  label: string;
  /** quando preenchido, redireciona o usuário pra outra porta com mensagem */
  redirect?: {
    rota: string;
    portaNome: string;
    mensagem: string;
  };
  /** quando preenchido, mostra uma mensagem inline (não bloqueia) */
  warning?: string;
}

interface FilterQuestionProps<V extends string> {
  /** rótulo curto acima da pergunta (ex: "Filtro de entrada") */
  eyebrow?: string;
  question: string;
  options: FilterOption<V>[];
  value: V | undefined;
  onChange: (value: V) => void;
  /** disabled quando o usuário já respondeu e quer travar a edição */
  disabled?: boolean;
}

export function FilterQuestion<V extends string>({
  eyebrow = "Filtro de entrada",
  question,
  options,
  value,
  onChange,
  disabled,
}: FilterQuestionProps<V>) {
  const selected = options.find((o) => o.value === value);

  return (
    <div className="rounded-2xl bg-[#005CE1] text-[#F9F1D1] p-5 sm:p-7 md:p-8 shadow-lg">
      <p className="text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#FEBF00]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-lg sm:text-xl md:text-2xl font-semibold leading-snug">
        {question}
      </h2>

      <div className="mt-6 space-y-2.5">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={cn(
                "group w-full flex items-center justify-between gap-3 text-left rounded-xl border-2 px-5 py-3.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEBF00]",
                isSelected
                  ? "bg-[#FEBF00] border-[#FEBF00] text-[#005CE1]"
                  : "bg-[#005CE1] border-[#F9F1D1]/25 text-[#F9F1D1] hover:border-[#F9F1D1] hover:bg-[#005CE1]/70",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <span className="text-sm sm:text-base font-medium leading-snug">
                {opt.label}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-colors",
                  isSelected ? "bg-[#005CE1] text-[#FEBF00]" : "bg-[#F9F1D1]/10 text-[#F9F1D1]/60"
                )}
                aria-hidden
              >
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Mensagens de redirect/warning */}
      {selected?.redirect && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F9F1D1] text-[#005CE1] p-4 sm:p-5">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-[#2B9402]" />
          <div className="text-sm leading-relaxed">
            <p>{selected.redirect.mensagem}</p>
            <Link
              to={selected.redirect.rota}
              className="mt-3 inline-flex items-center gap-1.5 font-semibold text-[#2B9402] hover:underline"
            >
              Ir para o formulário de {selected.redirect.portaNome}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {selected?.warning && !selected.redirect && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FEBF00]/15 border border-[#FEBF00]/30 text-[#F9F1D1] p-4">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-[#FEBF00]" />
          <p className="text-sm leading-relaxed">{selected.warning}</p>
        </div>
      )}
    </div>
  );
}
