const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

interface LaunchDateBannerProps {
  /** Quando informado, exibe este texto em vez da data (ex: "Seja um Revendedor"). */
  text?: string;
  date?: Date;
}

function BannerContentText({ text }: { text: string }) {
  return (
    <div className="flex items-center shrink-0 whitespace-nowrap px-8 sm:px-12 md:px-16 lg:px-20">
      <span className="font-lead text-amarelo text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase">
        {text}
      </span>
    </div>
  );
}

function BannerContentDate({ day, month }: { day: string; month: string }) {
  return (
    <div className="flex items-center shrink-0 whitespace-nowrap px-8 sm:px-12 md:px-16 lg:px-20">
      <span className="font-lead text-amarelo text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        ÁS 9H
      </span>
      <span className="font-lead text-amarelo text-4xl sm:text-5xl md:text-6xl lg:text-7xl ml-12 sm:ml-16 md:ml-20 lg:ml-28">
        {day} {month}
      </span>
      <span className="font-lead text-amarelo text-4xl sm:text-5xl md:text-6xl lg:text-7xl ml-12 sm:ml-16 md:ml-20 lg:ml-28">
        ÁS 9H
      </span>
    </div>
  );
}

export function LaunchDateBanner({ text, date }: LaunchDateBannerProps) {
  const useText = text != null && text !== "";
  const day = date?.getDate().toString().padStart(2, "0") ?? "00";
  const month = date ? MESES[date.getMonth()] : "JAN";

  return (
    <section
      className="bg-azul py-12 sm:py-14 md:py-16 overflow-hidden"
      aria-label={useText ? text : "Data de abertura do carrinho"}
    >
      <div className="flex w-max" style={{ animation: "marquee 25s linear infinite" }}>
        {useText ? (
          <>
            <BannerContentText text={text} />
            <BannerContentText text={text} />
            <BannerContentText text={text} />
          </>
        ) : (
          <>
            <BannerContentDate day={day} month={month} />
            <BannerContentDate day={day} month={month} />
            <BannerContentDate day={day} month={month} />
          </>
        )}
      </div>
    </section>
  );
}
