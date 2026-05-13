/**
 * Grid 4-col full-bleed alinhado à referência canônica de "página limpa"
 * (ver ~/.claude/skills/pedireito-design/referencias-web/countdown-lp-clean-01.png).
 *
 * `banner-chinelos.jpg` em /public já é o layout canônico:
 * 4 chinelos em 4 fundos coloridos (amarelo/verde, azul/amarelo, branco/verde-claro,
 * verde-escuro/azul). Source 1920×490 com ~30px de borda branca no rodapé —
 * cropamos via aspect-ratio + object-cover/top pra cortar essa borda no render.
 */
export function ProductGallery() {
  return (
    <section className="w-full overflow-hidden" aria-label="Cores disponíveis do chinelo Pé Direito">
      <img
        src="/banner-chinelos.jpg"
        alt="Quatro chinelos Pé Direito em cores diferentes — amarelo, azul, branco e verde-escuro — sobre fundos coloridos."
        className="w-full block aspect-[1920/460] object-cover object-top"
      />
    </section>
  );
}
