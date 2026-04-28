export function ProductGallery() {
  return (
    <section
      className="w-full overflow-hidden pt-8 sm:pt-10 leading-0 border-0 outline-none -mb-px [&_*]:border-0"
      aria-label="Cores disponíveis"
      style={{ borderWidth: 0 }}
    >
      <div className="flex w-max leading-0 border-0" style={{ animation: "marquee 40s linear infinite reverse", borderWidth: 0 }}>
        <img
          src="/BG_Footer.jpg"
          alt="Pé Direito – banner"
          className="shrink-0 w-[100vw] h-auto object-cover object-center block align-bottom border-0 outline-none"
        />
        <img
          src="/BG_Footer.jpg"
          alt=""
          className="shrink-0 w-[100vw] h-auto object-cover object-center block align-bottom border-0 outline-none"
          aria-hidden
        />
        <img
          src="/BG_Footer.jpg"
          alt=""
          className="shrink-0 w-[100vw] h-auto object-cover object-center block align-bottom border-0 outline-none"
          aria-hidden
        />
      </div>
    </section>
  );
}
