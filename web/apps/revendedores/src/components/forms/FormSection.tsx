interface FormSectionProps {
  number: string | number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormSection({ number, title, hint, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-[#2B9402]/10 bg-white p-5 sm:p-7 md:p-8 shadow-sm">
      <header className="mb-6 sm:mb-7 flex items-start gap-4">
        <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-[#2B9402] text-[#FEBF00] text-sm font-extrabold">
          {String(number).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-[#2B9402] leading-tight">
            {title}
          </h2>
          {hint && (
            <p className="mt-1 text-sm text-[#005CE1]/70 leading-snug">{hint}</p>
          )}
        </div>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
