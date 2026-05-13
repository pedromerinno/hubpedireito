interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type CountdownTone = "dark" | "light";

interface CountdownTimerProps {
  timeLeft: TimeLeft;
  tone?: CountdownTone;
}

const toneClasses: Record<
  CountdownTone,
  { number: string; label: string; colon: string }
> = {
  dark: {
    number: "text-verde",
    label: "text-verde/85",
    colon: "text-verde",
  },
  light: {
    number: "text-amarelo",
    label: "text-amarelo/85",
    colon: "text-amarelo",
  },
};

function TimeBlock({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: CountdownTone;
}) {
  const t = toneClasses[tone];
  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-lead text-5xl sm:text-6xl md:text-7xl lg:text-8xl tabular-nums leading-none ${t.number}`}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span
        className={`font-narrow font-medium text-xs sm:text-sm md:text-base mt-3 sm:mt-4 ${t.label}`}
      >
        {label}
      </span>
    </div>
  );
}

function Colon({ tone }: { tone: CountdownTone }) {
  return (
    <span
      className={`font-lead text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none self-start ${toneClasses[tone].colon}`}
    >
      :
    </span>
  );
}

export function CountdownTimer({
  timeLeft,
  tone = "dark",
}: CountdownTimerProps) {
  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center items-start">
      <TimeBlock value={timeLeft.days} label="Dias" tone={tone} />
      <Colon tone={tone} />
      <TimeBlock value={timeLeft.hours} label="Horas" tone={tone} />
      <Colon tone={tone} />
      <TimeBlock value={timeLeft.minutes} label="Min" tone={tone} />
      <Colon tone={tone} />
      <TimeBlock value={timeLeft.seconds} label="Seg" tone={tone} />
    </div>
  );
}
