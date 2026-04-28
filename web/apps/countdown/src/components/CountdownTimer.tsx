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
      <div className="bg-secondary text-primary rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
        <span className="text-3xl sm:text-5xl font-bold tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-primary-foreground/80 mt-2 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ timeLeft }: CountdownTimerProps) {
  return (
    <div className="flex gap-2 sm:gap-4 justify-center">
      <TimeBlock value={timeLeft.days} label="Dias" />
      <div className="text-secondary text-3xl sm:text-5xl font-bold self-start mt-3 sm:mt-4">:</div>
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <div className="text-secondary text-3xl sm:text-5xl font-bold self-start mt-3 sm:mt-4">:</div>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <div className="text-secondary text-3xl sm:text-5xl font-bold self-start mt-3 sm:mt-4">:</div>
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
}
