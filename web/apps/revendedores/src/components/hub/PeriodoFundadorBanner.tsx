export function PeriodoFundadorBanner() {
  return (
    <section
      className="bg-[#269204] py-20 sm:py-28 lg:py-36 px-6 sm:px-8"
      aria-label="O Período Fundador"
    >
      <div className="max-w-[1180px] mx-auto text-center">
        <span className="inline-flex items-center rounded-full bg-[#FEBF00] px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase text-[#269204]">
          O que é o Período Fundador
        </span>

        <div className="mt-6 sm:mt-8">
          <p className="pd-display text-[#FEBF00] text-4xl sm:text-6xl md:text-[72px] leading-[0.94] uppercase">
            a pé direito não nasceu
            <br />
            pra calçar pés.
          </p>

          <div className="mt-10 sm:mt-14 flex justify-center">
            <img
              src="/products/banner-chinelo.gif"
              alt="Chinelo Pé Direito em movimento"
              className="w-full max-w-[420px] sm:max-w-[560px] md:max-w-[720px] h-auto select-none pointer-events-none"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="mt-10 sm:mt-14 text-[#FEBF00] text-xl sm:text-2xl md:text-[28px] leading-[1.4] max-w-[980px] mx-auto">
            Nasceu pra calçar uma geração que decidiu começar de novo.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 max-w-[620px] mx-auto">
          <p className="text-[#F9F1D1] text-base sm:text-lg leading-[1.5]">
            Estamos no Período Fundador. A janela em que a marca
            escolhe quem caminha junto desde o primeiro passo.
          </p>
          <p className="mt-4 sm:mt-5 text-[#FEBF00] text-base sm:text-lg font-semibold">
            Se você está aqui, é porque pode ser um deles.
          </p>
        </div>
      </div>
    </section>
  );
}
