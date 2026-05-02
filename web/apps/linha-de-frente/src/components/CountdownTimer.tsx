interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  timeLeft: TimeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-lead text-5xl sm:text-6xl md:text-7xl lg:text-8xl tabular-nums text-verde leading-none">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="font-narrow font-medium text-xs sm:text-sm md:text-base text-verde/85 mt-3 sm:mt-4">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="font-lead text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-verde leading-none self-start">
      :
    </span>
  );
}

export function CountdownTimer({ timeLeft }: CountdownTimerProps) {
  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center items-start">
      <TimeBlock value={timeLeft.days} label="Dias" />
      <Colon />
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <Colon />
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <Colon />
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
}
