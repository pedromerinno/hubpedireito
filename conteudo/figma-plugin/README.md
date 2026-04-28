# Pé Direito · Figma Plugin

Plugin de geração de carrossel manifesto direto no Figma. Duas formas de usar:

1. **IA (recomendado)** — cola sua Anthropic API key, escreve o briefing em
   texto livre, o plugin chama Claude pra gerar o conteúdo estruturado
   seguindo o guideline, e monta os slides no Figma.
2. **Demo** — gera o template manifesto "fazer o certo" (10 slides hardcoded)
   pra ver o brand em ação sem precisar de API key.

Em ambos os casos, aplica paleta, tipografia, templates e alinhamentos em
slides `1080×1350`.

---

## Instalação (uma vez)

1. Abrir **Figma Desktop** (não funciona no browser — Plugin API local)
2. Menu: **Plugins → Development → Import plugin from manifest...**
3. Selecionar `manifest.json` desta pasta
4. Plugin fica disponível em **Plugins → Development → Pé Direito · Manifesto Generator**

## Uso · modo IA

1. Pegar API key em https://console.anthropic.com/settings/keys
2. Abrir qualquer arquivo Figma
3. **Plugins → Development → Pé Direito · Manifesto Generator**
4. Colar API key no campo `sk-ant-api03-...` e clicar **save** (fica local
   no clientStorage do Figma — não vai pra lugar nenhum)
5. Escrever um briefing no textarea (ex: "10 slides sobre ritual matinal,
   hook forte no slide 1, fecho com CTA PéDireito")
6. Selecionar **Slides** (5/7/10) e **Modelo** (Opus 4.7 melhor / Sonnet 4.6 rápido)
7. Clicar **⚡ gerar com ia**
8. ~10-30s depois, o carrossel aparece na página atual

O plugin usa **prompt caching** na system prompt — primeira chamada tem custo
full, chamadas subsequentes no mesmo dia ficam ~90% mais baratas na parte
cacheável (o schema + regras do brand).

## Uso · modo demo

1. Abrir qualquer arquivo Figma
2. **Plugins → Development → Pé Direito · Manifesto Generator**
3. Clicar **gerar template demo · 10 slides** (botão de baixo)
4. Frame horizontal com 10 slides manifesto "fazer o certo" aparece

## Fontes necessárias

Plugin carrega automaticamente do Figma:
- **Anton** · display principal
- **Archivo Black** · weight accent (`<b>`)
- **Bayon** · chrome
- **Arial Narrow** · body-copy (fallback automático pra Inter se não instalada)

Todas exceto Arial Narrow são Google Fonts que Figma resolve automático. Arial
Narrow é system font — plugin tenta 3 variações de grafia e cai pra Inter se
nenhuma funcionar.

---

## O que a v2 suporta

### Tipografia
- ✓ Anton / Archivo Black / Bayon / Arial Narrow com fallback automático
- ✓ `textCase: UPPER` via `up: true` na data
- ✓ **Weight accent** via `<b>...</b>` markup — Archivo Black aplicado em range
- ✓ Font-mix letra-a-letra (ex: `<b>con</b>tinuou` → "CON" heavy + "TINUOU" anton)

### Templates
- ✓ `tpl-split` — content distribuído top + bottom (space-between)
- ✓ `tpl-balanced` — centrado considerando ícone bottom (padding 100/178)
- ✓ `tpl-diag` — bloco 1 top-left + bloco 2 bottom-right
- ✓ `tpl-center` — conteúdo centralizado padrão

### Alinhamento por bloco
- ✓ `bodyAlign`, `heroAlign`, `soloAlign`, `equalAlign`, `setupAlign`, `bodyCopyBottomAlign`
- Valores: `'left'`, `'center'`, `'right'`
- Aplicado via `textAlignHorizontal` com maxWidth=820

### Outros elementos
- ✓ Diamante bandeira (SVG) em 6 posições: tl/tc/tr/bl/bc/br
- ✓ Stamp rotacionado com auto-layout (frame se ajusta ao texto)
- ✓ Photo placeholder pra full-bleed (retângulo + overlay 35% black)
- ✓ Photo placeholder pra polaroid absolute (canto direito)
- ✓ Wordmark bleed bottom (slide 10)

---

## Limitações conhecidas

- ✗ **Fotos reais** — placeholders são retângulos cinzas. Arrastar imagem manualmente
  depois de gerar, ou substituir fill por image fill no Figma
- ✗ **Color accent inline** (`<span c-vd>só</span>`) — não implementado. Usar
  `<b>` como workaround (muda peso, não cor)
- ✗ **Font-mix com altura equalizada** — Archivo Black renderiza cap-height um
  pouco menor que Anton. No HTML compensamos com `font-size:1.10em`, no plugin
  não ajustamos (limitação do setRangeFontSize não ser granular)
- ✗ **Stamps em todas as variantes de cor** — stamp usa hardcoded cream+verde.
  Customizar via data seria boa evolução

---

## Editar / customizar

### Trocar conteúdo dos slides

Editar `code.js`, array `SLIDES`. Schema de cada slide:

```js
{
  palette: 'p-verde' | 'p-amarelo' | 'p-azul' | 'p-cream-az' | 'p-cream-vd',
  markPos: 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br',
  template: 'tpl-split' | 'tpl-balanced' | 'tpl-diag' | 'tpl-center',
  up: true, // força UPPERCASE em setup/equal/hero/solo

  // Blocos de texto (todos opcionais):
  bodyCopy: 'Texto que entra no topo, Arial Narrow',
  bodyCopyTop: '...', // alias pra bodyCopy
  bodyCopyBottom: '...', // body-copy pós hero
  bodyCopyBottomRight: '...', // tpl-diag: body-copy no bottom-right

  setup: 'Linha pequena em Anton',
  equal: 'linha 1\nlinha 2\nlinha 3', // litania
  hero: 'Frase <b>principal</b>', // <b> vira Archivo Black
  solo: 'Frase única centralizada.',
  stamp: 'palavra pivot',
  wordmark: 'PéDireito.',

  // Tamanhos (valores em px):
  heroSize: 144, // 96 · 118 · 144 · 176 · 210 · 250
  soloSize: 144,
  equalSize: 118,

  // Alinhamentos (default: body-copy left, hero left, solo center):
  bodyAlign: 'left' | 'center' | 'right',
  heroAlign: 'left' | 'center',
  soloAlign: 'center',
  equalAlign: 'left',
  setupAlign: 'left',
  bodyCopyBottomAlign: 'center',

  // Photo placeholder (opcional):
  photo: 'img-01.jpg', // nome do arquivo (pra referência futura)
  photoType: 'bleed' | 'polaroid',
}
```

### Trocar paleta

Editar constantes `COLORS` no topo do `code.js`.

### Ajustar templates

Função `tplPositions(template, blocks)` retorna array de `{y, alignRight?}`
para cada bloco. Adicionar novo template significa adicionar um `if (template === 'tpl-x')`.

---

## Arquitetura

- `manifest.json` — metadata do plugin + permissions
- `code.js` — lógica principal (roda no sandbox do Figma, Plugin API)
- `ui.html` — interface user (iframe, comunica via `postMessage`)

## Debug

Abrir console: **Plugins → Development → Open Console** (Figma Desktop).
`console.log()`s do plugin aparecem lá.

## Atualizar

Editar qualquer arquivo da pasta → rodar o plugin de novo no Figma. Sem build,
sem transpile, sem deploy. Figma lê os arquivos atuais no momento da execução.
