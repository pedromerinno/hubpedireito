import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PORTAS, type PortaId, getPorta } from "@/lib/portas";
import { cn } from "@/lib/utils";

interface QuizOption {
  label: string;
  /** pontuação que esta opção dá pra cada porta */
  scores: Partial<Record<PortaId, number>>;
}

interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "intencao",
    prompt: "O que você quer fazer com a Pé Direito?",
    options: [
      {
        label: "Operar um negócio físico no meu nome",
        scores: { franquia: 3, revendedor: 1 },
      },
      {
        label: "Vender pra lojas (B2B)",
        scores: { representante: 3 },
      },
      {
        label: "Vender pra pessoas próximas (B2C)",
        scores: { revendedor: 3 },
      },
      {
        label: "Aportar capital na empresa",
        scores: { investidor: 3 },
      },
      {
        label: "Conectar minha marca ao movimento",
        scores: { patrocinador: 3 },
      },
      {
        label: "Levar pro meu casamento ou evento",
        scores: { casamento: 3 },
      },
    ],
  },
  {
    id: "capital",
    prompt: "Qual a sua capacidade de capital disponível?",
    options: [
      {
        label: "Acima de R$ 500 mil",
        scores: { franquia: 2, investidor: 2, patrocinador: 1 },
      },
      {
        label: "Entre R$ 100 mil e R$ 500 mil",
        scores: { franquia: 1, investidor: 2, patrocinador: 1 },
      },
      {
        label: "Entre R$ 10 mil e R$ 100 mil",
        scores: { representante: 1, revendedor: 1, patrocinador: 1, casamento: 1 },
      },
      {
        label: "Abaixo de R$ 10 mil",
        scores: { revendedor: 2, casamento: 1 },
      },
    ],
  },
  {
    id: "experiencia",
    prompt: "Qual a sua experiência hoje?",
    options: [
      {
        label: "Sou empresário com varejo físico",
        scores: { franquia: 3 },
      },
      {
        label: "Sou representante comercial com carteira ativa",
        scores: { representante: 3 },
      },
      {
        label: "Já vendo produtos (loja, redes, porta a porta)",
        scores: { revendedor: 3 },
      },
      {
        label: "Sou investidor ou executivo de capital",
        scores: { investidor: 3 },
      },
      {
        label: "Represento uma empresa ou marca",
        scores: { patrocinador: 3 },
      },
      {
        label: "Sou noivo, cerimonialista ou organizo eventos",
        scores: { casamento: 3 },
      },
    ],
  },
];

type Answers = Record<string, number>;

function pickWinner(answers: Answers): PortaId {
  const totals: Record<PortaId, number> = {
    franquia: 0,
    representante: 0,
    revendedor: 0,
    investidor: 0,
    patrocinador: 0,
    casamento: 0,
  };

  QUESTIONS.forEach((q) => {
    const idx = answers[q.id];
    if (idx == null) return;
    const opt = q.options[idx];
    if (!opt) return;
    (Object.keys(opt.scores) as PortaId[]).forEach((porta) => {
      totals[porta] += opt.scores[porta] ?? 0;
    });
  });

  let winner: PortaId = "revendedor";
  let max = -1;
  (Object.keys(totals) as PortaId[]).forEach((porta) => {
    if (totals[porta] > max) {
      max = totals[porta];
      winner = porta;
    }
  });
  return winner;
}

export function QuizPortas() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const winner = useMemo(() => (done ? getPorta(pickWinner(answers)) : null), [done, answers]);

  function selectOption(idx: number) {
    const next = { ...answers, [question.id]: idx };
    setAnswers(next);
    if (isLast) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  return (
    <section
      className="bg-[#005CE1] py-16 sm:py-24 px-5 sm:px-8"
      aria-labelledby="quiz-heading"
    >
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center rounded-full bg-[#F9F1D1] px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase text-[#005CE1]">
            Mini-quiz
          </span>
          <h2
            id="quiz-heading"
            className="mt-5 text-[#FEBF00] text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.92] tracking-tight uppercase"
          >
            não tenho certeza
            <br />
            qual sou eu.
          </h2>
          <p className="mt-5 text-[#F9F1D1]/85 text-base sm:text-lg max-w-lg mx-auto">
            Três perguntas. A gente te aponta a porta certa.
          </p>
        </div>

        {!done && question ? (
          <div className="rounded-2xl bg-[#F9F1D1] p-6 sm:p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold uppercase text-[#005CE1]/70">
                Pergunta {step + 1} de {QUESTIONS.length}
              </p>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-6 rounded-full transition-colors",
                      i <= step ? "bg-[#005CE1]" : "bg-[#005CE1]/15"
                    )}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-[#005CE1] text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
              {question.prompt}
            </h3>

            <div className="mt-6 sm:mt-8 space-y-2.5">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectOption(i)}
                  className="group w-full flex items-center justify-between gap-3 text-left rounded-xl border-2 border-[#005CE1]/15 bg-white px-5 py-4 hover:border-[#005CE1] hover:bg-[#005CE1]/[0.04] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005CE1]"
                >
                  <span className="text-[#005CE1] text-base sm:text-lg font-medium">
                    {opt.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#005CE1]/40 group-hover:text-[#005CE1] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-6 text-sm font-medium text-[#005CE1]/70 hover:text-[#005CE1] transition-colors"
              >
                ← Pergunta anterior
              </button>
            )}
          </div>
        ) : winner ? (
          <div className="rounded-2xl bg-[#FEBF00] p-6 sm:p-8 md:p-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#2B9402]/80">
              Sua porta é
            </p>
            <h3 className="mt-2 text-[#2B9402] text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.92] tracking-tight uppercase">
              {winner.nome}.
            </h3>
            <p className="mt-4 text-[#2B9402] text-lg sm:text-xl font-medium">
              {winner.definicao}
            </p>
            <p className="mt-2 text-[#2B9402]/85 text-sm sm:text-base">
              {winner.paraQuem}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="rounded-full bg-[#2B9402] hover:bg-[#2B9402]/90 text-[#FEBF00] px-7 py-6 text-base font-semibold gap-2"
              >
                <Link to={winner.rota}>
                  Entrar pela porta {winner.nome}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={reset}
                className="rounded-full px-6 py-6 text-base font-semibold text-[#2B9402] hover:bg-[#2B9402]/10 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refazer
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
