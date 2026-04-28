/*
 * Pé Direito · Manifesto Generator (Figma Plugin)
 * v2 — com templates, uppercase forçado, SVG fiel, photo placeholders
 */

// ═══════════════ PALETA ═══════════════
const COLORS = {
  verde:   { r: 43/255,  g: 148/255, b: 2/255   },
  amarelo: { r: 254/255, g: 191/255, b: 0/255   },
  azul:    { r: 0/255,   g: 92/255,  b: 225/255 },
  cream:   { r: 249/255, g: 241/255, b: 209/255 },
};

const PALETTES = {
  'p-verde':    { bg: COLORS.verde,   text: COLORS.amarelo },
  'p-amarelo':  { bg: COLORS.amarelo, text: COLORS.verde   },
  'p-azul':     { bg: COLORS.azul,    text: COLORS.amarelo },
  'p-cream-az': { bg: COLORS.cream,   text: COLORS.azul    },
  'p-cream-vd': { bg: COLORS.cream,   text: COLORS.verde   },
};

// ═══════════════ DIAMANTE (SVG — cor injetada dinamicamente) ═══════════════
function makeDiamondSvg(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const fill = 'rgb(' + r + ',' + g + ',' + b + ')';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="82" height="48" viewBox="0 0 497 280">' +
    '<path fill="' + fill + '" d="M486.461 122.728 L 265.268 2.91 C 258.228 -0.907 249.45 -0.966 242.323 2.715 L 11.244 122.533 C -3.748 130.304 -3.748 149.722 11.244 157.493 L 242.323 277.292 C 249.428 280.973 258.228 280.895 265.268 277.097 L 486.483 157.299 C 500.997 149.45 500.997 130.577 486.483 122.728 Z M 248.668 214.461 C 202.8 214.461 165.623 181.137 165.623 140.023 C 165.623 98.909 202.8 65.585 248.668 65.585 C 294.536 65.585 331.713 98.909 331.713 140.023 C 331.713 181.137 294.536 214.461 248.668 214.461 Z"/>' +
    '</svg>';
}

// ═══════════════ DADOS DOS 10 SLIDES ═══════════════
// <b>...</b> = Archivo Black (weight accent)
// align: 'left' | 'center' (per-block alignment)
const SLIDES = [
  {
    palette: 'p-verde', markPos: 'tl', template: 'tpl-split', up: true,
    bodyCopy: 'No dia em que virou\npiada fazer o certo,',
    hero: 'você <b>con</b>tinuou\nfazendo.', heroSize: 144, heroAlign: 'left',
    photo: 'img-15.jpg', photoType: 'polaroid',
  },
  {
    palette: 'p-cream-az', markPos: 'tl', template: 'tpl-split', up: true,
    bodyCopy: 'Você continuou orando.\nEnsinando seus filhos.\nSegurando a mão da sua\nmulher na calçada.', bodyAlign: 'left',
    hero: 'e disseram\nque isso era <b>atraso</b>.', heroSize: 118, heroAlign: 'center',
    photo: 'img-06.jpg', photoType: 'polaroid',
  },
  {
    palette: 'p-amarelo', markPos: 'bc', template: 'tpl-balanced', up: true,
    hero: 'careta.\ningênuo.\natrasado.', heroSize: 144, heroAlign: 'left',
    solo: 'você, <b>não</b>.', soloSize: 144, soloAlign: 'center',
  },
  {
    palette: 'p-azul', markPos: 'tc', template: 'tpl-diag', up: true,
    hero: 'chamaram de\nevolução.', heroSize: 144, heroAlign: 'left',
    stamp: 'era pressão.',
    bodyCopyBottomRight: 'Pra você ceder, se dobrar,\nse adaptar — até não se\nreconhecer no espelho.',
  },
  {
    palette: 'p-cream-vd', markPos: 'bl', template: 'tpl-split', up: true,
    bodyCopy: 'O inimigo nunca foi argumento.\nFoi a mesma sugestão repetida mil vezes:\nque o que você acredita é ridículo,\no que ensina é ultrapassado.', bodyAlign: 'left',
    hero: 'tudo pra você\n<b>recuar em silêncio</b>.', heroSize: 118, heroAlign: 'center',
    photo: 'img-10.jpg', photoType: 'bleed',
  },
  {
    palette: 'p-verde', markPos: 'bc', template: 'tpl-balanced', up: true,
    setup: 'você não recuou.', setupAlign: 'left',
    equal: 'acordou cedo.\npagou as contas.\neducou os filhos.\nhonrou a palavra.', equalSize: 118, equalAlign: 'left',
    bodyCopyBottom: 'Fez o certo quando ninguém olhava.', bodyCopyBottomAlign: 'center',
  },
  {
    palette: 'p-cream-az', markPos: 'tl', template: 'tpl-split', up: true,
    bodyCopy: 'Não é o aplauso que\nconstrói um homem.\nNão é a validação.', bodyAlign: 'left',
    hero: 'é o que você faz\nàs <b>seis da manhã</b>.', heroSize: 118, heroAlign: 'left',
    photo: 'img-30.jpg', photoType: 'bleed',
  },
  {
    palette: 'p-cream-vd', markPos: 'tc', template: 'tpl-balanced', up: true,
    bodyCopyTop: 'A regra é a mesma há dois mil anos:', bodyAlign: 'center',
    hero: 'quem permanece, <b>constrói</b>.\nquem resiste, <b>lidera</b>.\nquem não se vende, <b>deixa nome</b>.', heroSize: 80, heroAlign: 'left',
  },
  {
    palette: 'p-azul', markPos: 'bc', template: 'tpl-balanced', up: true,
    bodyCopy: 'Se hoje parece\nque não compensa,\nolhe de novo.', bodyAlign: 'left',
    hero: 'é <b>agora</b>\nque o amanhã\nestá sendo escrito.', heroSize: 144, heroAlign: 'center',
  },
  {
    palette: 'p-verde', markPos: 'tc', template: 'tpl-center', up: true,
    bodyCopyTop: 'Todo dia começa com um passo.', bodyAlign: 'center',
    hero: 'dê o seu com o', heroSize: 118, heroAlign: 'center',
    wordmark: 'PéDireito.',
  },
];

// ═══════════════ FONTES ═══════════════
// Tenta carregar Arial Narrow (system font no macOS), cai pra Inter se faltar.
// Flags globais dizem ao makeText qual fonte de body-copy usar.
const FONT_STATE = {
  bodyFamily: 'Inter', // fallback default
};

async function loadFonts() {
  const displayFonts = [
    { family: 'Anton', style: 'Regular' },
    { family: 'Archivo Black', style: 'Regular' },
    { family: 'Bayon', style: 'Regular' },
    { family: 'Inter', style: 'Regular' },
  ];
  for (const f of displayFonts) {
    try { await figma.loadFontAsync(f); } catch (e) {
      console.warn('Font missing: ' + f.family);
    }
  }

  // Tenta várias grafias possíveis de Arial Narrow
  const narrowVariants = [
    { family: 'Arial Narrow', style: 'Regular' },
    { family: 'Arial', style: 'Narrow' },
    { family: 'Arial Narrow', style: 'Bold' },
  ];
  for (const f of narrowVariants) {
    try {
      await figma.loadFontAsync(f);
      FONT_STATE.bodyFamily = f.family;
      FONT_STATE.bodyStyle = f.style;
      console.log('✓ Body font: ' + f.family + ' ' + f.style);
      return;
    } catch (e) { /* try next */ }
  }
  console.log('Arial Narrow não disponível, usando Inter como body-copy');
}

// ═══════════════ HELPERS ═══════════════
function markOffset(pos) {
  const offsets = {
    tl: { x: 130, y: 130 },
    tc: { x: (1080 - 82) / 2, y: 130 },
    tr: { x: 1080 - 130 - 82, y: 130 },
    bl: { x: 130, y: 1350 - 130 - 48 },
    bc: { x: (1080 - 82) / 2, y: 1350 - 130 - 48 },
    br: { x: 1080 - 130 - 82, y: 1350 - 130 - 48 },
  };
  return offsets[pos] || offsets.tl;
}

// Parser de markup <b>...</b> pra weight accent (Archivo Black)
function parseBold(text) {
  const ranges = [];
  let clean = '';
  let i = 0;
  while (i < text.length) {
    if (text.substr(i, 3) === '<b>') {
      const start = clean.length;
      i += 3;
      while (i < text.length && text.substr(i, 4) !== '</b>') {
        clean += text[i++];
      }
      ranges.push([start, clean.length]);
      i += 4; // skip </b>
    } else {
      clean += text[i++];
    }
  }
  return { clean: clean, ranges: ranges };
}

function makeText(content, fontSize, color, opts) {
  opts = opts || {};
  let family = opts.family || 'Anton';
  let style = 'Regular';
  if (family === 'Inter' && FONT_STATE.bodyFamily !== 'Inter') {
    family = FONT_STATE.bodyFamily;
    style = FONT_STATE.bodyStyle || 'Regular';
  }
  const t = figma.createText();
  try {
    t.fontName = { family: family, style: style };
  } catch (e) {
    t.fontName = { family: 'Inter', style: 'Regular' };
  }

  // Parse <b> markup e aplica Archivo Black nos ranges
  const parsed = parseBold(content);
  t.characters = parsed.clean;
  for (const r of parsed.ranges) {
    try {
      t.setRangeFontName(r[0], r[1], { family: 'Archivo Black', style: 'Regular' });
    } catch (e) { console.warn('setRangeFontName failed', e); }
  }
  t.fontSize = fontSize;
  t.fills = [{ type: 'SOLID', color: color }];
  if (opts.lineHeight !== undefined) {
    t.lineHeight = { value: opts.lineHeight, unit: 'PERCENT' };
  }
  if (opts.letterSpacing !== undefined) {
    t.letterSpacing = { value: opts.letterSpacing, unit: 'PERCENT' };
  }
  if (opts.textCase) {
    t.textCase = opts.textCase;
  }
  if (opts.textAlign) {
    t.textAlignHorizontal = opts.textAlign;
  }
  if (opts.maxWidth) {
    t.textAutoResize = 'HEIGHT';
    t.resize(opts.maxWidth, t.height);
  }
  return t;
}

function addPhotoPlaceholder(slide, filename, type) {
  if (type === 'bleed') {
    const rect = figma.createRectangle();
    rect.name = 'photo-bleed: ' + filename + ' (arraste imagem aqui)';
    rect.resize(1080, 1350);
    rect.x = 0; rect.y = 0;
    rect.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
    slide.insertChild(0, rect);
    // overlay 35% black
    const overlay = figma.createRectangle();
    overlay.name = 'overlay 35% black';
    overlay.resize(1080, 1350);
    overlay.x = 0; overlay.y = 0;
    overlay.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.35 }];
    slide.insertChild(1, overlay);
  } else {
    const rect = figma.createRectangle();
    rect.name = 'polaroid: ' + filename + ' (arraste imagem aqui)';
    rect.resize(240, 300);
    rect.x = 1080 - 130 - 240;
    rect.y = 550;
    rect.cornerRadius = 22;
    rect.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }];
    slide.appendChild(rect);
  }
}

// ═══════════════ TEMPLATES ═══════════════
// cada template retorna posição Y inicial + gap entre blocos
function tplPositions(template, blocks) {
  const totalHeight = blocks.reduce((sum, b, i) => sum + b.height + (i > 0 ? 40 : 0), 0);
  if (template === 'tpl-split') {
    // content distribuído entre top (320) e bottom (130)
    const result = [];
    if (blocks.length >= 2) {
      result.push({ y: 320 }); // primeiro no topo
      const last = blocks[blocks.length - 1];
      result.push({ y: 1350 - 130 - last.height }); // último no bottom
      // intermediários (raro com tpl-split)
      for (let i = 1; i < blocks.length - 1; i++) {
        result.splice(i, 0, { y: 320 + blocks[0].height + 40 + (i - 1) * 180 });
      }
    } else {
      result.push({ y: (1350 - blocks[0].height) / 2 });
    }
    return result;
  }
  if (template === 'tpl-balanced') {
    // content centrado, padding-bottom 178, padding-top 100
    const bodyArea = 1350 - 100 - 178;
    const startY = 100 + (bodyArea - totalHeight) / 2;
    let cursor = startY;
    return blocks.map(b => {
      const pos = { y: cursor };
      cursor += b.height + 40;
      return pos;
    });
  }
  if (template === 'tpl-diag') {
    // bloco 1 top (130), último bloco bottom-right (400px antes da base)
    const result = [];
    result.push({ y: 130 });
    for (let i = 1; i < blocks.length - 1; i++) {
      result.push({ y: 130 + blocks[0].height + 40 + (i - 1) * 200 });
    }
    if (blocks.length > 1) {
      const last = blocks[blocks.length - 1];
      result.push({ y: 1350 - 400 - last.height, alignRight: true });
    }
    return result;
  }
  if (template === 'tpl-center') {
    // center default
    let cursor = (1350 - totalHeight) / 2;
    return blocks.map(b => {
      const pos = { y: cursor };
      cursor += b.height + 40;
      return pos;
    });
  }
  // default: stack from 260
  let cursor = 260;
  return blocks.map(b => {
    const pos = { y: cursor };
    cursor += b.height + 40;
    return pos;
  });
}

// ═══════════════ CRIAR SLIDE ═══════════════
function createSlide(data, index) {
  const slide = figma.createFrame();
  slide.name = (index + 1).toString().padStart(2, '0') + ' · ' + data.palette;
  slide.resize(1080, 1350);
  slide.clipsContent = true;

  const palette = PALETTES[data.palette];
  slide.fills = [{ type: 'SOLID', color: palette.bg }];

  const isBleed = data.photoType === 'bleed';
  const textColor = isBleed ? COLORS.amarelo : palette.text;
  const bodyColor = isBleed ? COLORS.cream : palette.text;

  // photo-bleed vai como bg + overlay (se for photo-bleed)
  if (isBleed) {
    addPhotoPlaceholder(slide, data.photo, 'bleed');
  }

  // Diamond (cor: cream se bleed, senão palette.text)
  const diamondColor = isBleed ? COLORS.cream : palette.text;
  const mark = figma.createNodeFromSvg(makeDiamondSvg(diamondColor));
  mark.name = 'diamond';
  const off = markOffset(data.markPos);
  mark.x = off.x; mark.y = off.y;
  slide.appendChild(mark);

  // ═══ coletar blocos de texto pra calcular template ═══
  const textOpts = {
    anton: { family: 'Anton', lineHeight: 96, letterSpacing: -2 },
    body: { family: 'Inter', lineHeight: 130, maxWidth: 820 },
    bodySmall: { family: 'Inter', lineHeight: 130, maxWidth: 820 },
    setup: { family: 'Anton', lineHeight: 100, letterSpacing: -0.5 },
  };

  const blocks = []; // { node, type, height }

  // Converte 'left'|'center'|'right' → 'LEFT'|'CENTER'|'RIGHT' pra Figma
  function align(val, def) {
    const v = (val || def || 'left').toUpperCase();
    return v;
  }

  if (data.bodyCopyTop || data.bodyCopy) {
    const txt = data.bodyCopyTop || data.bodyCopy;
    const opts = Object.assign({}, textOpts.body, {
      textAlign: align(data.bodyAlign, 'left'),
    });
    const n = makeText(txt, 46, bodyColor, opts);
    n.name = 'body-copy';
    blocks.push({ node: n, type: 'body', height: n.height });
  }
  if (data.setup) {
    const opts = Object.assign({}, textOpts.setup, {
      maxWidth: 820,
      textAlign: align(data.setupAlign, 'left'),
    });
    if (data.up) opts.textCase = 'UPPER';
    const n = makeText(data.setup, 64, textColor, opts);
    n.name = 'setup';
    blocks.push({ node: n, type: 'setup', height: n.height });
  }
  if (data.equal) {
    const opts = Object.assign({}, textOpts.anton, {
      lineHeight: 100, letterSpacing: -1.5, maxWidth: 820,
      textAlign: align(data.equalAlign, 'left'),
    });
    if (data.up) opts.textCase = 'UPPER';
    const n = makeText(data.equal, data.equalSize || 118, textColor, opts);
    n.name = 'equal';
    blocks.push({ node: n, type: 'equal', height: n.height });
  }
  if (data.hero) {
    const opts = Object.assign({}, textOpts.anton, {
      maxWidth: 820,
      textAlign: align(data.heroAlign, 'left'),
    });
    if (data.up) opts.textCase = 'UPPER';
    const n = makeText(data.hero, data.heroSize || 144, textColor, opts);
    n.name = 'hero-line';
    blocks.push({ node: n, type: 'hero', height: n.height });
  }
  if (data.stamp) {
    // stamp com auto-layout — frame se ajusta ao tamanho do texto + padding
    const frame = figma.createFrame();
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.paddingLeft = 34;
    frame.paddingRight = 34;
    frame.paddingTop = 14;
    frame.paddingBottom = 22;
    frame.fills = [{ type: 'SOLID', color: COLORS.cream }];
    frame.name = 'stamp: ' + data.stamp;
    const stampText = makeText(data.stamp, 90, COLORS.verde, {
      family: 'Anton', lineHeight: 88, letterSpacing: -1, textCase: 'UPPER',
    });
    frame.appendChild(stampText);
    frame.rotation = 4;
    blocks.push({ node: frame, type: 'stamp', height: frame.height });
  }
  if (data.solo) {
    const opts = Object.assign({}, textOpts.anton, {
      textAlign: align(data.soloAlign, 'center'), maxWidth: 820,
    });
    if (data.up) opts.textCase = 'UPPER';
    const n = makeText(data.solo, data.soloSize || 144, textColor, opts);
    n.name = 'solo';
    blocks.push({ node: n, type: 'solo', height: n.height });
  }
  if (data.bodyCopyBottom) {
    const n = makeText(data.bodyCopyBottom, 38, bodyColor, {
      family: 'Inter', lineHeight: 130, maxWidth: 820,
      textAlign: align(data.bodyCopyBottomAlign, 'center'),
    });
    n.name = 'body-copy-bottom';
    blocks.push({ node: n, type: 'body', height: n.height });
  }
  if (data.bodyCopyBottomRight) {
    // tpl-diag: body-copy no bottom-right
    const n = makeText(data.bodyCopyBottomRight, 38, bodyColor, {
      family: 'Inter', lineHeight: 130, maxWidth: 500,
    });
    n.name = 'body-copy-bottom-right';
    blocks.push({ node: n, type: 'body-right', height: n.height });
  }
  if (data.wordmark) {
    const n = makeText(data.wordmark, 260, textColor, {
      family: 'Anton', lineHeight: 95, letterSpacing: 0.5,
      textAlign: 'CENTER', maxWidth: 1080,
    });
    n.name = 'wordmark';
    blocks.push({ node: n, type: 'wordmark', height: n.height });
  }

  // ═══ posicionar blocos usando template ═══
  const positions = tplPositions(data.template || 'tpl-split', blocks);
  blocks.forEach((b, i) => {
    const pos = positions[i] || { y: 260 };

    if (b.type === 'wordmark') {
      b.node.x = 0;
      b.node.y = 1350 - b.node.height - 130;
    } else if (pos.alignRight || b.type === 'body-right') {
      // tpl-diag: bloco direito
      b.node.x = 1080 - 130 - 500;
      b.node.y = pos.y;
    } else if (b.type === 'stamp') {
      // stamp rotacionado — centralizar horizontalmente no slide
      b.node.x = (1080 - b.node.width) / 2;
      b.node.y = pos.y;
    } else {
      // Texto: sempre x=130 (body padding). textAlignHorizontal dentro do bloco
      // faz a centralização visual funcionar (maxWidth=820 garante bounds).
      b.node.x = 130;
      b.node.y = pos.y;
    }
    slide.appendChild(b.node);
  });

  // polaroid absolute (se não for bleed)
  if (data.photo && data.photoType === 'polaroid') {
    addPhotoPlaceholder(slide, data.photo, 'polaroid');
  }

  return slide;
}

// ═══════════════ MAIN ═══════════════
async function generate(slides, title) {
  await loadFonts();

  const carousel = figma.createFrame();
  carousel.name = title || 'Pé Direito · Manifesto (' + slides.length + ' slides)';
  carousel.layoutMode = 'HORIZONTAL';
  carousel.primaryAxisSizingMode = 'AUTO';
  carousel.counterAxisSizingMode = 'AUTO';
  carousel.itemSpacing = 80;
  carousel.paddingLeft = 80;
  carousel.paddingRight = 80;
  carousel.paddingTop = 80;
  carousel.paddingBottom = 80;
  carousel.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];

  for (let i = 0; i < slides.length; i++) {
    const slide = createSlide(slides[i], i);
    carousel.appendChild(slide);
  }

  figma.currentPage.appendChild(carousel);
  figma.viewport.scrollAndZoomIntoView([carousel]);
  figma.notify('✓ ' + slides.length + ' slides gerados');
  figma.closePlugin();
}

// ═══════════════ UI · BOOT ═══════════════
figma.showUI(__html__, { width: 420, height: 640 });

// ═══════════════ MENSAGENS ═══════════════
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'ui-ready') {
      // UI carregada — enviar API key salva (se houver).
      try {
        const savedKey = await figma.clientStorage.getAsync('anthropic-api-key');
        figma.ui.postMessage({ type: 'key-loaded', key: savedKey || '' });
      } catch (e) {
        console.error('clientStorage read failed:', e);
        figma.ui.postMessage({ type: 'key-loaded', key: '' });
      }

    } else if (msg.type === 'generate') {
      // Geração manifesto-base (SLIDES hardcoded — botão legacy/demo).
      await generate(SLIDES, 'Pé Direito · fazer o certo');

    } else if (msg.type === 'generate-from-data') {
      // Geração a partir de slides vindos da UI (IA ou input manual).
      if (!msg.slides || !Array.isArray(msg.slides) || msg.slides.length === 0) {
        figma.notify('Slides inválidos — verifique a estrutura.', { error: true });
        return;
      }
      await generate(msg.slides, msg.title);

    } else if (msg.type === 'save-key') {
      await figma.clientStorage.setAsync('anthropic-api-key', msg.key || '');
      figma.ui.postMessage({ type: 'key-saved' });

    } else if (msg.type === 'clear-key') {
      await figma.clientStorage.deleteAsync('anthropic-api-key');
      figma.ui.postMessage({ type: 'key-loaded', key: '' });

    } else if (msg.type === 'cancel') {
      figma.closePlugin();
    }
  } catch (err) {
    console.error(err);
    figma.notify('Erro: ' + (err.message || err), { error: true, timeout: 6000 });
    figma.ui.postMessage({ type: 'error', message: err.message || String(err) });
  }
};
