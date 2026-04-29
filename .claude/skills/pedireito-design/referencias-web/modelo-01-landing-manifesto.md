# Modelo 01 — Guideline de design: landing pública longa-manifesto

Sistema de design pra landings públicas longas no estilo manifesto editorial do Pé Direito.

**Esta doc define princípios e padrões abstratos**, não um template de página. Use como guideline pra construir páginas com a mesma DNA visual mas com **conteúdo, blocos e ordem totalmente diferentes** conforme a intenção de cada projeto.

**Implementação de exemplo:** `web/apps/lp-lancamento/`. É **um caso aplicado** do Modelo 01 — não um modelo a copiar. Use como ilustração de "como o sistema se materializa", nunca como esqueleto a duplicar.

Esta doc complementa (não substitui) `~/.claude/agents/pedireito-ui-ux.md`. Lá: regras gerais de marca (paleta, tipografia, CTA, footer, voz). Aqui: **sistema visual e padrões de composição** específicos do Modelo 01.

---

## 1. Quando aplicar o Modelo 01

**Use** quando a página atende a maioria destes critérios:
- Comunicação pra cliente final, narrativa em sequência longa.
- Objetivo é construir convicção via manifesto/posicionamento, não converter por funcionalidade.
- Conteúdo é majoritariamente editorial (texto + foto), pouco interativo.
- Conversão por captura (lista, grupo, inscrição) — não checkout direto, não login, não busca.
- Densidade de leitura média-alta: usuário rola pra absorver argumento, não pra escanear opções.

**Não use** em:
- Apps internos (admin, painel) → padrão funcional/denso, outro modelo.
- LPs curtas com 1 CTA único (login, captura simples) → bloco único basta.
- Página de countdown puro → use referência `countdown-lp-clean-01.png`.
- FAQ, suporte, termos legais → padrão informativo, não manifesto.
- Portal de notícias → padrão editorial de feed/cards, outro modelo.
- Catálogo de produto → padrão grid/filtro, outro modelo.

**Sinais de que NÃO é Modelo 01:** nav horizontal de menu, busca, tabs, cards dinâmicos, filtros, paginação, formulário com mais de 5 campos visíveis ao mesmo tempo.

---

## 2. Princípios fundamentais

Os 7 princípios abaixo regem **toda decisão de design** dentro do Modelo 01. Quando em conflito, princípio mais alto na lista vence.

### 2.1 Uma ideia por bloco
Cada seção carrega **uma única ideia** — uma frase de manifesto, uma promessa, uma prova, um convite. Se um bloco precisa de subtítulo + 3 parágrafos + lista + 2 CTAs pra fazer sentido, está fazendo trabalho de dois blocos. **Divida.**

### 2.2 Cor faz o trabalho de divisão
A transição entre seções **é a troca de cor de fundo**. Não use bordas, dividers, sombras, espaçamento extra ou ornamentos pra separar conteúdo. Se dois blocos precisam de divisor, mude a cor de fundo de um deles.

### 2.3 Pulse cromático
A página tem **respiração rítmica** entre fundos cream (descanso) e fundos sólidos da paleta (impacto). Sequências longas de cream esvaziam; sequências longas de cor sólida cansam. O olho precisa do alternar. Ver §4.

### 2.4 Hierarquia por troca de família, não só por tamanho
Mudou de peso visual? **Mudou de fonte.** Anton grande seguido de Anton menor é hierarquia pobre. Anton grande seguido de SF Pro semibold é hierarquia rica. Tamanho é o ajuste fino; família é a estrutura.

### 2.5 Editorial flat
Zero sombra. Zero gradiente. Zero borda visível como ornamento. Zero glassmorphism. Zero ícone decorativo. A página é uma **revista impressa**: cor sólida, tipografia, foto/vídeo, espaço em branco. Nada que pareça "interface".

### 2.6 Foto e vídeo como conteúdo, não decoração
Mídia full-bleed ou mídia 50/50 com texto. Nunca mídia em card pequeno, nunca mídia "ilustrando" texto. **A mídia carrega seu próprio peso narrativo** — se foi escolhida, ocupa espaço e ar suficientes pra existir.

### 2.7 Um CTA por bloco
Cada seção tem no máximo **um botão de ação**. Se precisa de mais convites, viram microcopy, links inline ou ghost. Múltiplos CTAs primary por seção quebram a hierarquia de decisão.

---

## 3. Sistema visual

### 3.1 Container e largura
- **Container canônico:** `max-w-7xl mx-auto px-6 sm:px-10 lg:px-16` — usado em chrome (top bar, footer) e em qualquer banda com conteúdo limitado por leitura.
- **Largura de leitura interna:** `max-w-2xl` (corpo editorial denso), `max-w-3xl` (texto centralizado), `max-w-4xl` (pull-quote curto), `max-w-lg` (parágrafo lateral em bloco 50/50).
- **Full-bleed:** seções de mídia, marquee horizontal, banners de produto. Sem container, ocupam 100vw.
- **Nunca usar:** `max-w-6xl` ou menor como container principal (apertado), `max-w-[1440px]` ou maior (perde sensação editorial).

### 3.2 Ritmo vertical
- **Padding vertical padrão de seção:** `py-20 sm:py-28`.
- **Padding em seções "respiratórias"** (pull-quote, escassez, convite final): `py-20 sm:py-28 lg:py-36`.
- **Padding em seções de chrome** (top bar, microcopy strip): `py-4 sm:py-5`.
- **Min-height em seções de impacto:** `min-h-[500px] sm:min-h-[600px]` — garante presença mesmo com pouco conteúdo, evita seção "achatada".
- **Min-height em pull-quotes sólidos:** `min-h-[400px] sm:min-h-[500px]`.

### 3.3 Gaps internos do bloco
Padrão de espaçamento dentro de um bloco de conteúdo:
- Eyebrow → H2: `mt-6` ou `mt-8`
- H2 → subtítulo (mesmo bloco): `mt-6`
- H2/subtítulo → body: `mt-8` ou `mt-10`
- Body → CTA: `mt-10` a `mt-14`
- Bloco textual longo → próximo stanza dentro do mesmo bloco: `mt-6` a `mt-8`

### 3.4 Cor on cor — combinações autorizadas
Escolha de cor de texto **depende exclusivamente do fundo**. Não há liberdade.

| Fundo | Texto principal | Texto secundário/longo | Eyebrow |
|---|---|---|---|
| `bg-cream` | `text-foreground` (verde-escuro) ou `text-verde` | `text-foreground/80` ou `text-verde-escuro/85` | `text-azul` sobre pílula `bg-[#FFF2C9]` |
| `bg-verde` | `text-amarelo` | `text-amarelo/85` ou `text-amarelo/95` | `text-amarelo/80` sobre pílula `bg-amarelo/10` |
| `bg-verde-escuro` | `text-amarelo` ou `text-cream` | `text-cream/70` ou `text-cream/80` | `text-amarelo/80` sobre pílula `bg-amarelo/10` |
| `bg-azul` | `text-amarelo` | `text-amarelo/85` ou `text-cream/80` | `text-amarelo/80` (com `tracking-wide` autorizado pra eyebrow uppercase aqui — única exceção) |
| `bg-amarelo` (raro, só como "ilha" sobre verde) | `text-verde-escuro` | `text-verde-escuro/85` | `text-azul` ou `text-verde` |

**Regras absolutas:**
- Texto on-verde / on-verde-escuro / on-azul = sempre **amarelo** ou cream pra texto longo. Nunca branco puro.
- Texto on-cream = sempre verde-escuro/verde/azul. Nunca cinza, nunca preto.
- `bg-[#FFF2C9]` (cream-amarelado, variação 1-stop do cream) é o **único token "fora da paleta"** autorizado, e exclusivamente pra pílula de eyebrow on-cream.

### 3.5 Tipografia aplicada ao Modelo 01
Famílias e regras gerais ficam no agente principal. **Aqui: escalas e contextos específicos.**

| Contexto | Família | Caixa | Escala |
|---|---|---|---|
| Hero principal de página | Anton | lowercase | `text-[14vw] sm:text-[9vw] md:text-[108px]` |
| H2 de seção editorial | Anton | lowercase | `text-4xl sm:text-5xl lg:text-6xl` |
| H3 de seção (subtítulo no mesmo bloco) | Anton | lowercase | `text-3xl sm:text-4xl lg:text-5xl` |
| Pull-quote sólido grande | Anton | lowercase | `text-4xl sm:text-6xl md:text-7xl` |
| Claim de escassez/urgência | Anton | lowercase | `text-5xl sm:text-7xl md:text-8xl lg:text-9xl` |
| Marquee horizontal | Bayon | UPPERCASE | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` |
| Contador numérico (quando aplicável) | Bayon | — | `text-5xl sm:text-6xl md:text-7xl lg:text-8xl` |
| Body editorial | SF Pro / Arial | lowercase | `text-base sm:text-lg leading-relaxed` |
| Body em bloco grande de impacto | SF Pro / Arial | lowercase | `text-lg sm:text-xl leading-relaxed` |
| Eyebrow / chrome / microcopy | SF Pro / Arial semibold | lowercase ou UPPERCASE | `text-xs sm:text-sm` |
| Microcopy abaixo de CTA | SF Pro / Arial | lowercase | `text-[11px] sm:text-xs` |

**Lembretes do agente principal aplicados:**
- Sem `tracking-*` (única exceção: eyebrow uppercase on-azul).
- Texto ≤ `text-base` sempre `font-semibold` mínimo.
- Anton sempre lowercase. Bayon sempre UPPERCASE.
- Nunca itálico.

### 3.6 Borda e arredondamento
Bordas retas e cantos retos são o default. Os **únicos elementos arredondados** autorizados:
- **CTA**: `rounded-full`
- **Pílulas de eyebrow** (chip de "01 · Manifesto" tipo): `rounded-full`
- **Cards translúcidos** sobre fundo escuro (checklist, lista de ações): `rounded-2xl`
- **"Ilhas" de conteúdo destacado** sobre fundo de cor sólida (caixa de form, módulo de destaque): `rounded-2xl`

Tudo o mais é canto reto. Sem `rounded-md`, `rounded-lg`, `rounded-xl` em qualquer outro elemento.

### 3.7 Mídia
- **Imagem em bloco 50/50:** `min-h-[320px] sm:min-h-[420px] lg:min-h-0`, `object-cover` com `objectPosition` controlável pra crop.
- **Full-bleed paisagem:** aspect ratios autorizados — `aspect-[16/9]`, `aspect-[2.4/1]`, `aspect-[21/9]`. Escolha pelo recorte da foto.
- **Vídeo:** sempre autoplay loop muted playsInline. Sempre tem fallback `poster` em imagem (`src` da tag `<img>` faz isso).
- **Overlay sobre mídia full-bleed** com texto por cima: 30-40% escuro. Sem overlay se a mídia já é escura o suficiente.
- **Drop-shadow em texto sobre mídia:** `drop-shadow-lg` no texto do pull-quote. Sem outras sombras.

---

## 4. Padrões de composição

Esta seção lista **categorias de bloco** — moldes de composição. Cada categoria pode produzir infinitos blocos diferentes (conteúdos, copy, imagens, ordem). **Não use os exemplos abaixo como receita.** Use como gramática.

### 4.1 Chrome strip
**Tipo:** linha horizontal fina, full-width, cor sólida.
**Função:** ancorar contexto institucional (data, marca, ação) ou status operacional. Não é nav.
**Padrão:**
- Container `max-w-7xl` interno.
- Grid 3 colunas (esquerda · centro · direita) ou conteúdo centralizado único.
- SF Pro semibold `text-xs`.
- Padding vertical curto: `py-4 sm:py-5`.
- Cor do fundo = cor de seção da paleta; texto = par de contraste.

### 4.2 Bloco de impacto solo
**Tipo:** seção full-width de cor sólida, conteúdo centralizado, alta presença.
**Função:** abrir página, fechar página, fazer pull-quote forte, declarar escassez, transição entre atos.
**Padrão:**
- `min-h-[500px] sm:min-h-[600px]` (alto impacto) ou `min-h-[400px] sm:min-h-[500px]` (intermediário).
- `flex items-center justify-center`.
- Container interno: `max-w-3xl`, `max-w-4xl` ou `max-w-6xl` dependendo do peso do claim.
- Conteúdo centralizado: pode ter eyebrow + título display + microcopy + CTA, mas **só uma camada por vez é forte** (o resto é suporte).
- Cor de fundo: verde, verde-escuro ou azul. Cream também é possível pra impacto editorial introspectivo.

### 4.3 Bloco editorial 50/50
**Tipo:** divisão `lg:grid-cols-2` — mídia de um lado, conteúdo do outro.
**Função:** workhorse da narrativa. Maior parte do corpo da página.
**Padrão:**
- Conteúdo limita `max-w-2xl`, cola na borda interna do grid (`lg:ml-auto` ou `lg:mr-auto`).
- Padding interno do conteúdo: `px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-28`.
- Mídia ocupa coluna inteira, `min-h-[320px] sm:min-h-[420px] lg:min-h-0`, `object-cover`.
- Estrutura interna do conteúdo (componível, não obrigatória):
  - Eyebrow (pílula `bg-[#FFF2C9] text-azul`)
  - Título display (Anton)
  - (opcional) Subtítulo display um nível menor (Anton)
  - Body (SF Pro, `max-w-lg`)
  - (opcional) CTA
- **Alterne `imagePosition`** entre blocos editoriais consecutivos pra criar movimento visual zigue-zague.

### 4.4 Bloco mídia full-bleed
**Tipo:** seção com aspect ratio paisagem, mídia ocupa 100% do bloco, opcional texto sobreposto.
**Função:** respiro narrativo, reforço atmosférico, pull-quote sobre cenário, transição entre atos editoriais.
**Padrão:**
- Aspect ratio `[16/9]`, `[2.4/1]` ou `[21/9]`.
- Mídia: imagem ou vídeo (autoplay loop muted).
- Overlay 30-40 escuro se houver texto por cima.
- Texto sobreposto: pull-quote Anton centralizado, cor amarela, `drop-shadow-lg`.
- Sem texto: peça atmosférica pura, deixa a mídia falar.

### 4.5 Bloco lista 50/50
**Tipo:** divisão `lg:grid-cols-2` — conteúdo com lista de um lado, foto do outro.
**Função:** transmitir critérios, valores, requisitos, etapas — qualquer coisa que se beneficia de **enumeração marcada**.
**Padrão:**
- Mesma estrutura de container do bloco editorial 50/50.
- Conteúdo: eyebrow → título display → `<ul>` com itens → CTA.
- Cada item: símbolo de marcador (`→` em Bayon azul ou similar) + texto SF Pro semibold verde-escuro `text-base sm:text-lg lg:text-xl`.
- Itens curtos (uma frase declarativa cada). Máx ~5 itens — mais que isso vira leitura, não enumeração.

### 4.6 Bloco card-list translúcido
**Tipo:** seção sobre fundo escuro (verde-escuro), com cards translúcidos empilhados.
**Função:** lista de ações operacionais, próximos passos, checklist, regras.
**Padrão:**
- `bg-verde-escuro`, container `max-w-3xl`.
- Cards: `bg-white/[0.06] rounded-2xl p-5 sm:p-6`. Hover: `bg-white/[0.09]`.
- Conteúdo do card: marcador visual (checkbox, número, ícone) + label SF Pro cream.
- Estado "concluído" ou "inativo" trata com `opacity-70` (não muda cor).
- Stack vertical com `space-y-3 sm:space-y-4` entre cards.

### 4.7 Bloco ilha sobre cor sólida
**Tipo:** seção de cor sólida (verde, azul) com um módulo "ilha" arredondado de cor contrastante (amarelo).
**Função:** destacar conteúdo funcional dentro de uma seção declarativa — formulário, embed, módulo de cálculo, destaque informativo.
**Padrão:**
- Seção externa: bg verde ou azul, conteúdo centralizado.
- Ilha: `bg-amarelo text-verde-escuro rounded-2xl p-6 sm:p-10`.
- A ilha é o único elemento arredondado generoso da página — deve ser raro (1 por página, no máximo 2).

### 4.8 Marquee horizontal
**Tipo:** faixa full-width de cor sólida, texto Bayon UPPERCASE rolando infinitamente.
**Função:** divisor rítmico entre atos editoriais, reforço de informação-chave (data, slogan, posicionamento).
**Padrão:**
- Cor do fundo = azul (preferencial), pode ser amarelo em casos específicos.
- Padding vertical: `py-12 sm:py-14 md:py-16`.
- Conteúdo: texto Bayon amarelo `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`, repetido 3x dentro de container `flex w-max`, animação `marquee 25s linear infinite`.
- **Máximo 1-2 marquees por página** — mais que isso vira ruído.

### 4.9 Banner mídia full-bleed (encerramento)
**Tipo:** banner de imagem único, full-width, alto aspect ratio paisagem.
**Função:** encerrar narrativa de produto/marca antes do footer. Showcase de variantes, lineup de SKU, cena institucional.
**Padrão:**
- `aspect-[1920/460]` ou similar. `object-cover object-top` pra controlar crop.
- Sem texto sobreposto — o banner já é a peça.
- Não confundir com bloco mídia full-bleed (§4.4): aqui é peça de fechamento, não respiro narrativo.

### 4.10 Footer rico
**Tipo:** seção institucional, fundo escuro, 4 colunas em desktop.
**Função:** encerrar página com nav, legal, social, copyright.
**Padrão:** definido no agente principal. Sempre presente em Modelo 01.

### 4.11 Floating CTA
**Tipo:** barra fixa no rodapé da viewport, aparece em scroll.
**Função:** garantir que o CTA principal está sempre acessível, mesmo no meio da leitura.
**Padrão:**
- Aparece após scroll > 600px da viewport.
- Fixed bottom, full-width, `bg-verde-escuro/95 backdrop-blur-md`.
- Conteúdo: microcopy curta + CTA primary + botão dismiss.
- Microcopy responsiva: versão curta em mobile.
- Sempre presente em Modelo 01.

---

## 5. Composição da página — gramática, não receita

Modelo 01 é uma **sequência rítmica de blocos** das categorias acima. Não há ordem fixa, nem set obrigatório.

### 5.1 Atos da narrativa
Pense a página em **3-5 atos**:
1. **Abertura** — declarar a tese (bloco de impacto solo, geralmente).
2. **Desenvolvimento** — provar e expandir (sequência de editoriais 50/50, mídia full-bleed, pull-quotes sólidos).
3. **(opcional) Convite operacional** — instruções, checklist, próximos passos (card-list translúcido, lista 50/50).
4. **Fechamento** — escassez, urgência, convite final (bloco de impacto solo + bloco ilha com formulário).
5. **Coda** — produto, lineup, footer.

Cada ato tem 1-4 blocos. Página total: 7-15 blocos.

### 5.2 Regras de combinação
- **Nunca dois blocos da mesma cor de fundo seguidos** sem cream ou full-bleed entre eles.
- **Nunca dois blocos editoriais 50/50 seguidos com mídia do mesmo lado** — alterne.
- **Nunca dois marquees seguidos.** Máx 1-2 por página inteira.
- **Sempre alterne intensidade**: bloco de alto impacto (impacto solo, full-bleed, pull-quote) seguido de bloco de leitura (editorial 50/50, lista) seguido de impacto seguido de leitura.
- **Final antes do footer**: encerre com bloco de impacto solo ou banner mídia. Nunca termine a narrativa em editorial 50/50 — fica em aberto.

### 5.3 Pulse cromático — como projetar
Antes de codar, **desenhe a sequência de cores em uma linha**:
```
verde → cream → azul → cream → cream → verde → cream → escuro → cream → azul → verde → cream → escuro
```
Onde cada nó é um bloco. Valide:
- Sem dois iguais consecutivos.
- Cream aparece com frequência (ato de descanso).
- Verde-escuro só em momentos operacionais (checklist, footer).
- Azul é pontual (marquee, escassez) — não vira cor base.
- Verde é a cor de afirmação (abertura, convite, declaração).

Se a linha de cores não tem ritmo (3 cream seguidos, 2 verdes seguidos), reordene blocos antes de codar.

### 5.4 Densidade
- **Mínimo viável de Modelo 01:** 5 blocos (abertura impacto + 2 editoriais + fechamento + footer). Abaixo disso, não é Modelo 01 — é landing curta, outro padrão.
- **Máximo confortável:** 15 blocos. Acima disso, o argumento se dilui — divida em duas páginas.
- **Sweet spot:** 8-12 blocos.

---

## 6. Anti-padrões específicos do Modelo 01

Além das regras gerais do agente, **no Modelo 01 NUNCA**:

- ❌ Cards flutuantes com `bg-white` e `shadow-*` sobre fundo cream — quebra a linguagem flat.
- ❌ Header com nav horizontal de menu — chrome strip é institucional, não navegacional.
- ❌ Múltiplos CTAs primary num mesmo bloco. Um por bloco. Outros viram ghost, microcopy ou link.
- ❌ Dois blocos da mesma cor sólida seguidos sem cream/mídia entre eles.
- ❌ Bordas como divisor de seção — divisor é cor.
- ❌ `text-gray-*`, `text-slate-*`, `bg-white` em conteúdo de seção (cream é o "branco" da marca).
- ❌ Anton em corpo de texto, em CTA, ou em UPPERCASE.
- ❌ Bayon em microcopy, eyebrow pequeno, body, CTA primary.
- ❌ Mais de 2 marquees na página.
- ❌ Pular footer rico ou pular FloatingCta — ambos sempre presentes.
- ❌ Encerrar a página em editorial 50/50 antes do footer — fica em aberto, sem fechamento.
- ❌ Mídia em card pequeno "ilustrando" texto — mídia é conteúdo, ocupa espaço próprio.
- ❌ Iconografia decorativa. Ícones só funcionais (cadeado, checkbox, social no footer, dismiss).
- ❌ Animação além de marquee horizontal e respiração suave de elementos numéricos. Sem parallax, sem reveal-on-scroll, sem hover transforms.

---

## 7. Workflow recomendado pra construir uma página Modelo 01

1. **Definir intenção da página em 1 frase.** "LP pra captar interesse de revendedores antes do programa B2B abrir."
2. **Definir os 3-5 atos da narrativa.** "Ato 1: por que ser revendedor / Ato 2: o que muda na vida de quem é / Ato 3: requisitos / Ato 4: convite e captura."
3. **Atribuir 1-3 blocos por ato.** Use o catálogo de §4 como gramática. Escolha categoria, não conteúdo específico.
4. **Desenhar o pulse cromático em uma linha.** Validar (§5.3).
5. **Validar densidade.** 7-12 blocos, ato sem buraco, fechamento antes do footer.
6. **Listar mídias necessárias.** Conferir banco de imagens. Se faltar, propor alternativa antes de codar.
7. **Pedir copy ao agente `pedireito-copy`.** UI/UX não escreve copy — só dimensiona tipografia pro ritmo.
8. **Codar reusando componentes** existentes (`web/apps/lp-lancamento/src/components/` é a referência viva). Extrair pra `web/packages/` se for reusar de fato em outro app.
9. **Rodar dev server**, conferir mobile (375px), tablet (768px), desktop (1280px+).
10. **Checklist de marca** (final do agente principal) + checklist do Modelo 01:
    - [ ] Pulse cromático respeitado
    - [ ] Sem dois blocos editoriais 50/50 com mídia do mesmo lado consecutivos
    - [ ] Máx 2 marquees
    - [ ] Footer rico + FloatingCta presentes
    - [ ] Fechamento antes do footer é impacto solo ou banner mídia
    - [ ] Cada bloco tem máx 1 CTA primary
    - [ ] Cada bloco carrega uma única ideia

---

## 8. Componentes implementados (referência viva)

Em `web/apps/lp-lancamento/src/components/` existem componentes que materializam categorias de §4. Use como **base de extração** quando construir nova página Modelo 01:

| Categoria de bloco (§4) | Componente de referência |
|---|---|
| Editorial 50/50 (§4.3) | `EditorialBlock` |
| Mídia full-bleed (§4.4) | `FullBleedImage` |
| Marquee horizontal (§4.8) | `LaunchDateBanner` (genérico via prop `text`) |
| Card-list translúcido (§4.6) | `PreparationChecklist` (lista hardcoded — copie e adapte) |
| Banner full-bleed encerramento (§4.9) | `ProductGallery` (banner hardcoded — copie e adapte) |
| Footer rico (§4.10) | `SiteFooter` |
| Floating CTA (§4.11) | `FloatingCta` |
| CTA padrão | `CtaButton` |
| Logo da marca | `BrandLogo` |

**Quando criar nova página em outro app:** se o componente é de fato reutilizável (`EditorialBlock`, `FullBleedImage`, `CtaButton`, `BrandLogo`, `SiteFooter`, `FloatingCta`), extraia pra `web/packages/ui` ou similar antes de duplicar. Se é específico (`PreparationChecklist`, `ProductGallery` com conteúdo hardcoded), copie e adapte conscientemente.
