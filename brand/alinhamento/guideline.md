# Pé Direito — Guideline de Alinhamento

Documento consolidado das regras estabelecidas em alinhamento direto com o cliente.
Refina e sobrepõe as diretrizes do `README.md` sempre que houver conflito.

> Este documento é a **fonte de verdade** para projetos de carrossel, post único e
> criativos sociais. Leia antes de começar qualquer peça. Ajuste e expanda quando
> novas regras forem definidas.

---

## 1. Paleta — travada em 4 cores

Para projetos de carrossel use **apenas** estas 4 cores. Sem tons intermediários,
sem opacidades criando "quase-cores", sem preto.

| cor | hex | rgb | uso |
|---|---|---|---|
| **verde** | `#2B9402` | `rgb(43, 148, 2)` | bg, texto, display |
| **amarelo** | `#FEBF00` | `rgb(254, 191, 0)` | bg, texto de alto destaque |
| **azul** | `#005CE1` | `rgb(0, 92, 225)` | bg, texto, link, stamp |
| **bege** | `#F9F1D1` | `rgb(249, 241, 209)` | bg respiro, caixa de texto |

**Azul específico para carrossel é `#005CE1`**, não o azul elétrico `#0600FF` que
aparece em outros materiais da marca.

### Combinações bg + texto permitidas

| bg | texto | nome da paleta | quando usar |
|---|---|---|---|
| verde | amarelo | `p-verde` | combo-assinatura, abertura/fecho |
| amarelo | verde (display grande) | `p-amarelo` | contraste forte, manifesto |
| azul | amarelo | `p-azul` | alto impacto |
| bege | azul | `p-cream-az` | respiro, editorial, body-copy |
| bege | verde | `p-cream-vd` | respiro mais quieto |

### ❌ PROIBIDO

**Bg amarelo + texto azul.** Contraste ruim, leitura sofre.

**Em bg amarelo só é permitido:**
- Letras grandes em verde (display direto)
- NENHUM texto pequeno (body-copy) direto sobre o amarelo — não cabe

Se precisa de body-copy num slide amarelo, **mude a palette** para outra
combinação onde o texto lê naturalmente.

---

## 2. Tipografia

| fonte | papel | caixa default | tamanho |
|---|---|---|---|
| **Anton** (sub Coolvetica/Tusker) | display grande, hero line | lowercase | 110–280px |
| **Archivo Black** (sub Tusker) | acento de peso dentro de Anton | acompanha o contexto | via `<b>` |
| **Bayon** | chrome, labels, contador | UPPERCASE letter-spaced | 12–40px |
| **Arial Narrow** | body-copy, voz manifesto | Sentence case | 38–58px |

### Regra geral de case

- **Tudo que não é body-copy Arial Narrow PODE ser UPPERCASE** (display, hero,
  equal, solo, setup-em-Anton, stamp). Use `.body.up` no body pra ativar.
- **Body-copy Arial Narrow fica em Sentence case** (voz editorial/manifesto).
  Nunca em uppercase — perde o sabor de texto narrativo.
- **Lowercase no display** é válido quando a voz precisa ser mais quieta/manifesto
  (slides soltos ou quando o carrossel inteiro pede esse tom).
- **Acento UPPERCASE** em 1 palavra dentro de frase lowercase é permitido
  (clássico do brand: "FALTAm", "FALSO").
- **Nunca itálico.** Em nenhuma fonte.

### Hierarquia de tamanhos

Para carrossel 1080×1350, use estes modificadores já calibrados:

```
.s-xs  =  96px
.s-sm  = 118px
.s-md  = 144px
.s-lg  = 176px
.s-xl  = 210px
.s-xxl = 250px
```

Ajuste por slide conforme o comprimento do texto — **nunca estoure o canvas**.

### ⚠️ REGRA CRÍTICA · overflow em UPPERCASE

UPPERCASE em Anton ocupa **~30% mais largura** que lowercase. Textos longos
que funcionam em lowercase estouram quando `.up` é aplicado.

**Área útil do body:** 1080 - 130×2 = **820px de largura**.

**Máximo de caracteres por linha** (aprox. em Anton UPPERCASE):

| size | chars/linha | palavras típicas |
|---|---|---|
| s-xs  (96)  | ~22 | "quem permanece," |
| s-sm  (118) | ~17 | "tudo pra você" |
| s-md  (144) | ~14 | "você, continuou" |
| s-lg  (176) | ~11 | "é sempre." |
| s-xl  (210) | ~9  | "é sinal." |
| s-xxl (250) | ~7  | "chão." |

Antes de publicar: **medir cada linha** contando caracteres. Se passar da
máxima, quebrar em `<br>` adicional OU reduzir tamanho.

**Sintoma típico de overflow:** no preview (browser escalado) parece OK, mas
no PNG exportado o texto aparece cortado nas bordas. Sempre testar exportando
PNG antes de entregar.

### ⚠️ REGRA FIRME · safe margin — fonte nunca encosta na lateral

**Todo bloco de display (hero/solo/equal/setup) tem `max-width:820px` travado
no CSS.** Canvas 1080 − padding lateral 130×2 = 820px de área útil. Nenhum
glyph pode passar dessa largura.

**Armadilhas comuns:**

1. **`<b>` em Archivo Black explode a largura.** O scale de 1.12em pra
   equalizar cap-height também aumenta a largura linear em ~12%. A tabela de
   chars/linha acima é válida pra Anton uppercase puro — com `<b>` dentro, a
   conta é *chars × 1.12*. Ex: `ESCOLHERAM` (10 chars) em `<b>` a s-sm (118)
   rende visualmente como ~11 chars Anton, ainda dentro dos 17 chars max. Mas
   `DESISTIR` (8 chars) em `<b>` a s-md (144) rende como ~9 chars Anton, perto
   do limite de 14, pode estourar dependendo do kerning.

2. **Uma palavra grande em `<b>` sozinha numa linha** tem mais risco que duas
   palavras menores somadas, porque não há espaço pra quebrar.

**Protocolo:**

- Sempre exportar PNG e conferir as 4 bordas laterais.
- Se uma palavra em `<b>` estourar: reduzir um size (ex: s-md → s-sm).
- Se NÃO estourar com `<b>` mas estoura com UPPERCASE: reduzir OU tirar `<b>`.
- **Último recurso:** CSS `overflow-wrap:break-word` quebra no meio da palavra
  — funciona como segurança, mas visualmente feio. Não confiar nele como
  solução de design, só como safety net.

### Line-height

- Display Anton lowercase: mínimo `.96` (senão corta descendentes p/g/q e acentos)
- Display Anton UPPERCASE: pode ir a `.92`
- Body-copy Arial Narrow: `1.3` (leitura confortável)

---

## 3. Body-copy — regra sanduíche

**Arial Narrow só aparece no INÍCIO ou no FIM do slide. Nunca sanduichado entre
dois displays grandes.**

### Permitido ✓

- body-copy → display (body abre o slide)
- display → body-copy (body fecha o slide)
- body-copy → display → display (body abre, displays depois)
- display → display → body-copy (displays abrem, body fecha)

### Proibido ❌

- display → body-copy → display (quebra o ritmo do poster)
- body-copy → display → body-copy (pior ainda)

### Por quê

O carrossel é poster, não artigo. O body-copy é a voz editorial que contextualiza
o hit visual — ele enquadra, não interrompe. Se precisa de mais de um parágrafo
body-copy, provavelmente precisa de mais de um slide.

### Quebra de linha obrigatória em body-copy longo

**Body-copy com frase longa nunca fica em uma linha só.** Sempre quebrar em
múltiplas linhas nos pontos naturais de pausa (fim de frase, conjunções, ritmo):

❌ Ruim: `Você continuou orando. Ensinando seus filhos. Segurando a mão.`
✓ Bom:  `Você continuou orando.<br>Ensinando seus filhos.<br>Segurando a mão.`

Quebrar a cada ponto-final, ou a cada 4-6 palavras em frases sem pontuação.

### Distribuição harmônica das linhas

Ao quebrar, distribuir o texto **equilibradamente entre as linhas**. Evitar:

- ❌ Linha órfã muito curta no final (ex: `...Segurando a mão da sua mulher` /
  `na calçada.` — "na calçada" sobra)
- ❌ Uma linha muito longa + uma linha muito curta
- ❌ Quebras que deixam uma preposição ou palavra pequena sozinha

✓ Preferir larguras visuais parecidas (aproximar a contagem de caracteres por
linha). Pode quebrar no meio da frase se isso gerar mais harmonia — desde que
a quebra não distorça o sentido.

Exemplo:
```
❌ 29/11 chars (órfã)        ✓ 22/18 chars (balanceado)
Segurando a mão da sua mulher   Segurando a mão da sua
na calçada.                     mulher na calçada.
```

Faz vista antes de publicar: se uma linha parece "sobrar" ou "faltar", realinhe.

### ⚠️ REGRA FIRME · nunca palavra órfã no meio

**Uma palavra sozinha em uma linha no MEIO do body-copy é proibido.**
Exemplos:

❌ Errado:
```
Pra você ceder, se
dobrar,                  ← ÓRFÃO
se adaptar — até não
se reconhecer no
espelho.                 ← ÓRFÃO final
```

✓ Correto:
```
Pra você ceder, se dobrar,
se adaptar — até não se
reconhecer no espelho.
```

**Como evitar órfãos:**

1. Ampliar o container (max-width maior) pra caber mais texto por linha
2. Reescrever pra que as palavras finais de cada frase caibam com as palavras
   anteriores (ex: trocar onde o comma cai, mover "se" ou "no" pra linha
   anterior)
3. Reduzir o texto — se a sentença não cabe bem em 3 linhas balanceadas,
   provavelmente é longa demais
4. Quebrar em ponto semanticamente mais cedo pra empurrar mais palavras pra
   última linha

**Regra prática:** se a última linha de um bloco de texto tem só 1-2 palavras
(<10 chars), é órfã. Rebalancear ou reduzir.

### Gap maior ao redor de body-copy longo

Body-copy multi-linha precisa de **respiro extra** antes do próximo elemento.
Use `two-block` (gap 110px) se estiver junto com display no padrão de blocos,
ou aumente manualmente o gap pra não colar no hero.

---

## 3.1. Ordem de frase — preservar o fluxo natural top → bottom

**⚠️ REGRA FIRME:** o carrossel lê top-to-bottom. A ordem dos elementos visuais
DENTRO de um slide precisa espelhar a ordem de leitura da frase original.
Inverter a posição (ex: colocar explicação acima do hook, ou reveal antes do
contexto) quebra o sentido e deixa o leitor reconstruindo a frase.

### Como identificar inversão

Leia o texto original da copy (como se fosse uma frase contínua). Depois leia
o slide de cima pra baixo. Se a ordem não bater, está invertido.

```
Copy original:         Slide (atual):            Slide (correto):
Mas olha de novo.      setup "mas olha..."       body-copy "Mas olha..."
Enquanto diziam        (top, grupo com list)      + "Enquanto diziam..."
que o país mudou…      equal list milhões         (top, junto)
Milhões pras ruas.     body-copy "Enquanto        equal list (bottom)
                       diziam..." (bottom) ❌    ✓ preserva ordem
```

### Como resolver sem quebrar a regra-sanduíche

Se a frase tem estrutura "display → body-copy → display" (sanduíche proibido),
duas saídas:

1. **Fundir body-copy + setup no topo** em um único body-copy que carrega as
   duas ideias. A frase "Mas olha de novo" vira parte do body-copy em vez
   de ser um display separado.
2. **Usar `tpl-up`** (padding:130px 130px 260px) quando a tese (hero/solo) vem
   primeiro e a explicação (body-copy) depois — coloca hero no topo e
   body-copy imediatamente abaixo, respeitando a ordem.

### Exceção permitida

Reorganizar ordem visual APENAS se a versão invertida também fizer sentido
como leitura autônoma (ex: pergunta embaixo, resposta em cima, que funciona
como "O QUÊ: X. PORQUÊ: Y"). Em caso de dúvida, preservar a ordem.

---

## 4. Menos texto

Posts **não pedem clique**. Ativam identidade. Regra de ouro:

- Cortar redundâncias
- Se 3 frases dizem a mesma coisa, fique com 1
- Copy declarativa, sem explicação/justificativa/tradução
- Se uma palavra carrega o hit, ela basta

Quando em dúvida: **corte**.

---

## 5. Box · destaque inline de palavra

A `.box` é um marcador/highlight sobre palavra-chave — **nunca um container de
frase**. Regras firmes:

### Regras ✓

1. **Aplicar só em 1-2 palavras**, nunca em frase ou parágrafo inteiro
2. **Sempre como `<span>` inline** dentro do texto maior, nunca como `<div>` bloco
3. Usar box-decoration-break:clone pra quebras de linha limparem certo

### Proibições ❌

- Box em frase inteira (use troca de palette se precisa de contraste)
- Box como block element ou parágrafo inteiro
- Box em 3+ palavras consecutivas

### Regra das 4 camadas de cor (crítica)

A caixa envolve 3 camadas de cor além do bg do slide. Nenhuma pode repetir a outra:

1. **bg do slide** (a cor atrás de tudo)
2. **cor do texto principal** (letras do texto maior, onde a box está dentro)
3. **cor da caixa** (background do span)
4. **cor do texto dentro da caixa** (letras dentro do span)

**Regras:**
- cor da caixa ≠ bg do slide
- cor da caixa ≠ cor do texto principal
- cor do texto dentro ≠ bg do slide
- cor do texto dentro ≠ cor da caixa (trivial — senão some)

Com 4 cores brand e 2 ocupadas pelo slide (bg + texto principal), sobram 2 pra
caixa (bg da caixa + texto dentro).

### Exemplo válido

Slide `p-azul` (bg azul, texto amarelo). Cores disponíveis pra box: `{verde, bege}`.

```html
<div class="hero-line">é o que <span class="box">você</span> faz.</div>
```

Onde `.box` = bege bg + verde texto. Todas as 4 camadas distintas ✓

### Exemplo inválido

Slide `p-azul` com box amarelo + azul texto. **PROIBIDO**: box amarelo = cor do texto
principal, texto azul = cor do bg do slide. Colapsa visualmente.

---

## 6. Ícone losango (diamante bandeira)

O losango é a **única assinatura visual** dos carrosséis. Sem wordmark "PéDireito"
no footer dos slides (exceto slide de fecho/CTA).

### Regra principal · ícone segue o BLOCO MAIS PRÓXIMO (proximidade)

**O diamante acompanha o alinhamento horizontal do bloco de texto mais próximo
dele**, não o alinhamento geral do slide.

- Ícone no **TOPO** (tl/tc/tr) → olha o **bloco do topo** do slide
- Ícone no **BOTTOM** (bl/bc/br) → olha o **bloco do bottom**

Se o bloco mais próximo é **left-aligned** → ícone à esquerda (tl/bl).
Se o bloco mais próximo é **centralizado** → ícone centralizado (tc/bc).

**Exemplo prático** (slide 2 tpl-split):
- Topo: body-copy LEFT
- Bottom: hero CENTER
- Ícone `tl` (fica no topo, bloco próximo é body-copy LEFT)
- Se o ícone estivesse no bottom, seria `bc` (pra seguir o hero CENTER)

**Motivo:** quando um slide tem 2 blocos com alinhamentos diferentes, o ícone
faz mais sentido visual se ancora com o bloco vizinho, não com o bloco do outro
extremo. O olho lê verticalmente e espera que os elementos próximos estejam
alinhados entre si.

### ❌ Erros a evitar

**Ícone em `bl` ao lado de hero al-c bottom** — o ícone fica na lateral
esquerda enquanto o hero está centralizado. Cria tensão visual: o olho
entende mal o alinhamento.

```
❌ errado:               ✓ correto:

[body-copy top-left]     [body-copy top-left]
   ·                        ·
   ·                        ·
      [HERO CENTER]            [HERO CENTER]
◆                                  ◆
[mark bl, sozinho           [mark bc, alinhado
 à esquerda]                 sob o hero]
```

**Quando o texto muda pra centralizado, o logo TAMBÉM muda.** Não deixe mark
em `tl`/`bl` convivendo com hero/solo em al-c — troque pra `tc`/`bc`
correspondente.

### Solo/centered full — mark sempre centralizado

Quando o slide é **solo centralizado** (`body.center` ou `body` com só um
bloco al-c), o mark **obrigatoriamente** vai em `tc` ou `bc`. Nunca em tl/bl.

### ⚠️ REGRA FIRME · zona reservada do mark — conteúdo nunca sobrepõe

**O mark ocupa um retângulo fixo no canvas** (82×48px, offset 130px das
bordas). Nenhum bloco de texto (body-copy, setup, hero, equal, solo) pode
ocupar essa zona — causa colisão visual com o ícone.

**Zonas reservadas (1080×1350 canvas):**

```
TOP-LEFT         TOP-CENTER        TOP-RIGHT
(130, 130)       (499, 130)        (868, 130)
to               to                to
(212, 178)       (581, 178)        (950, 178)

BOTTOM-LEFT      BOTTOM-CENTER     BOTTOM-RIGHT
(130, 1172)      (499, 1172)       (868, 1172)
to               to                to
(212, 1220)      (581, 1220)       (950, 1220)
```

**Regra no padding dos templates:**

- Se o mark PODE aparecer no top → `padding-top ≥ 260px` (178 + 82 de respiro)
- Se o mark PODE aparecer no bottom → `padding-bottom ≥ 260px`

Templates com mark-safe default:

| template | padding | mark top | mark bottom |
|---|---|---|---|
| `.body` default | 260 130 260 | ✓ | ✓ |
| `.body.tpl-split` | 320 130 260 | ✓ | ✓ |
| `.body.tpl-up` | 260 130 260 | ✓ | ✓ |
| `.body.tpl-balanced` | 260 130 260 | ✓ | ✓ |
| `.body.tpl-diag` | 130 130 400 | ⚠ só top-left | ✓ (diag-anchor) |

**Sintoma típico:** hero ou body-copy grande rende em cima do ícone. Exemplo
real: slide com `tpl-up` + mark `tl` onde a primeira letra do hero "QUEM"
colava/sobrepunha o diamante.

**Resolução:** se precisar de conteúdo ocupando a zona do mark, MOVA o mark
pro lado oposto (top ↔ bottom). Nunca reduza padding abaixo de 260px na ponta
onde o mark está.

Posições efetivas:

```
tl · tc
bl · bc
```

`tr`/`br` reservados pro `tpl-diag` (`diag-anchor`) ou casos específicos.

### Escolha vertical (top vs bottom)

Top e bottom são escolhas de ritmo — não há regra rígida. Boas práticas:

- Solo/frase curta centralizada → `bc` (assinatura embaixo, igual ref histórica)
- Primeiro slide do carrossel → `tl` ou `tc` (abertura)
- Último slide / CTA → `tc` ou `bc` (fechamento)
- Varie ao longo do carrossel — não empilhe 3 slides consecutivos na mesma
  posição vertical

### Lógica de distribuição

Diamante **é assinatura**, não decoração. Presente em todos os slides, tamanho
consistente (82×48px), afastado 130px das bordas (não grudado no extremo).

---

## 7. Stamps — tape rotacionada com palavra-pivô

Padrão clássico da marca: uma palavra do próprio texto aparece em bloco
retangular rotacionado (3-5°), com caixa alta forçada.

### Regra fundamental

**A palavra no stamp deve ser PARTE do texto do slide.** Nunca labels externos
tipo "FALTAM" ou "ÚLTIMAS" soltos. Sempre integrado ao punchline.

Exemplo histórico do brand:

```
NADA FOI DESTRUÍDO.
[FOI]   ← stamp verde com amarelo
ESCONDIDO
```

A palavra "FOI" é parte da frase "FOI ESCONDIDO", não um label externo.

### Regra das 4 camadas (mesma do box)

O stamp também tem 4 camadas de cor — todas distintas:

1. bg do slide
2. cor do texto principal
3. cor do stamp (fundo do bloco rotacionado)
4. cor do texto dentro do stamp

Nenhuma camada repete outra. Com 4 cores brand e 2 ocupadas pelo slide, sobram 2
pro stamp (bg + texto interno).

### Combinações válidas por palette

| palette do slide | cores ocupadas | stamp pode usar |
|---|---|---|
| `p-verde` | verde + amarelo | `{azul, bege}` → `.az-cr` ou `.cr-az` |
| `p-amarelo` | amarelo + verde | `{azul, bege}` → `.az-cr` ou `.cr-az` |
| `p-azul` | azul + amarelo | `{verde, bege}` → `.vd-cr` ou `.cr-vd` |
| `p-cream-az` | bege + azul | `{verde, amarelo}` → `.vd-am` ou `.am-vd` |
| `p-cream-vd` | bege + verde | `{azul, amarelo}` → `.az-am` ou `.am-az` |

### Tamanhos

Proporcional ao hero do slide — nunca competir com o hero principal:

```
.stamp.sm  =  80px
.stamp.md  = 110px
.stamp.lg  = 170px
```

---

## 8. Fotos — dois formatos apenas

### Full-bleed

Foto preenche o canvas inteiro. Texto sobrepõe em overlay.

**Cores de texto — restritas:** em photo-bleed só é permitido **cream e
amarelo**. Verde e azul PERDEM leitura na foto (verde se mistura com verde
da foto; azul fica baixo contraste em fotos quentes). Nunca usar.

- `mark`, `setup`, `body-copy`, `cta` → cream
- `hero-line`, `equal`, `solo` → amarelo

**Overlay obrigatório:** camada de `rgba(0,0,0,.35)` (35% preto) cobrindo toda
a foto. Uniformiza o contraste — escurece áreas claras da foto (paredes
amareladas, céus, praias, etc.) garantindo que cream e amarelo leiam em
qualquer zona.

```css
.slide.photo-bleed::after{
  content:"";
  position:absolute;inset:0;
  background:rgba(0,0,0,.35);
  z-index:1;pointer-events:none;
}
```

Nota: o preto aqui é uma transparência de OVERLAY, não substituto das cores
brand. A foto continua colorida, só ganha uma camada sutil de mais peso.

### ⚠️ REGRA CRÍTICA · legibilidade em photo-bleed

**Se o texto não lê com clareza sobre a foto, um dos 3 é a causa:**

1. Cor do texto errada (verde ou azul) → trocar pra cream ou amarelo
2. Overlay ausente ou fraco → aplicar `.slide.photo-bleed::after` 20% preto
3. Foto com zona muito clara no local do texto → aumentar opacity do overlay
   pra 25-30%, OU trocar a foto por uma com melhor distribuição de luz

Nunca entregue com texto ilegível.

### Body padding no photo-bleed

Foto cobre o slide inteiro (`background-size:cover`). Body padding continua
valendo (130 horizontal). O texto lê dentro do retângulo do body, com scrim
garantindo contraste.

- Imagem deve ter áreas "vazias" ou uniformes pra texto descansar (mesmo com
  scrim, composição limpa facilita muito)

### Polaroid

Card pequeno arredondado como âncora visual no fluxo.

- Variantes de tamanho: `.sm` (240×300) · default (300×375) · `.lg` (380×475)
- Wide variant: `.wide` (420×336 aspect 5/4)
- Radius: `22px`
- Sem borda, sem sombra (design flat do brand)
- Posicionamento: `.left`, `.right`, ou centralizado (default)

### ⚠️ REGRA · polaroid NUNCA como flex child do body

**Adicionar polaroid como filho do `.body` QUEBRA o layout.** Entra no cálculo
de flex, rouba espaço vertical, e o hero acaba colidindo com o ícone ou o
content transborda.

**Solução: polaroid sempre como absolute, filho do `.slide` (não do `.body`)**:

```html
<div class="slide p-verde">
  <div class="mark">...</div>
  <div class="body up tpl-split">
    <div class="body-copy">...</div>
    <div class="hero-line">...</div>
  </div>
  <!-- polaroid FORA do body, como irmão -->
  <div class="photo-card abs sm" style="top:48%;right:130px;transform:translateY(-50%)">
    <img src="assets/midia/img-02.jpg" alt="">
  </div>
  <div class="cta">...</div>
</div>
```

CSS: `.photo-card.abs{position:absolute;z-index:2;margin:0}`

**Vantagens:**
- Não participa do flex do body → não quebra tpl-split/tpl-balanced/two-block
- Posicionamento livre via `top`/`right`/`bottom`/`left` inline
- Funciona em QUALQUER slide, independente da densidade de texto

### Regra de posicionamento do polaroid

**Polaroid nunca pode sobrepor texto.** Precisa caber no GAP vertical entre
os blocos de texto, posicionado na coluna lateral oposta (geralmente direita).

**Matemática pra validar ANTES de aplicar:**

1. Calcule y-range de cada bloco de texto do slide
   - Ex slide 2 tpl-split: body-copy y=320-559, hero y=989-1220
2. Identifique o gap vertical entre eles
   - Ex: gap livre = 559-989 = 430px
3. Polaroid sm = 300px de altura → cabe com 130px de margem
4. Centralize o polaroid NO CENTRO do gap, não no centro do slide
   - Centro do gap = (559+989)/2 = 774px → 774/1350 = 57%
   - Inline: `style="top:57%;right:130px;transform:translateY(-50%)"`

**Quando o slide não permite polaroid:**

- Conteúdo denso sem gap central (tpl-balanced com body-copy + hero grande)
- Conteúdo já centralizado usando toda largura (slide solo centralizado)
- Qualquer caso onde o cálculo acima mostra overlap inevitável

Nesses slides: **não use polaroid**. Use full-bleed ou deixe text-only.

**Checklist de validação antes de publicar:**

- [ ] Polaroid top > bloco-texto-acima bottom + 30px (margem)?
- [ ] Polaroid bottom < bloco-texto-abaixo top - 30px (margem)?
- [ ] Polaroid left > texto-proximo right + 60px (separação horizontal)?

Se qualquer checkbox falhar, ajuste ou remova o polaroid.

### Escolha de foto

- Fotos quentes, luz brasileira, alta saturação
- Sem b&w, sem duotone, sem filtros cool/moody
- Composição deve reforçar o texto — não ilustrar decorativamente

### ⚠️ REGRA · nunca repetir imagem no mesmo post

**Uma mesma imagem não pode aparecer 2x no mesmo carrossel/post**, mesmo que
em formatos diferentes (ex: polaroid num slide + full-bleed em outro).

Um carrossel Instagram é UM post (mesmo com 10 slides). Repetir imagem quebra
a sensação de curadoria e empobrece a narrativa visual.

Antes de aplicar uma foto, conferir se já foi usada em outro slide do mesmo
carrossel. Se sim, escolher outra do banco.

### Banco de imagens único

**Sempre consumir do banco de imagens do skill**, nunca usar fotos ad-hoc.

Localização: `~/.claude/skills/pedireito-design/assets/midia/`

Arquivos disponíveis (ver `assets/midia/README.md` pra catálogo completo):

| arquivo | conteúdo | melhor uso |
|---|---|---|
| `img-01.png` | Rio panorâmico · Cristo + estrada | slides sobre Brasil/horizonte |
| `img-02.jpg` | Jovem sorrindo em terraço favela | vitalidade, juventude |
| `img-03.jpg` | Cão + parede amarela + porta azul | slides em bg cream, "chão" literal |
| `img-04.jpg` | Retrato senhora sorrindo | sabedoria, memória, geração |
| `img-05.png` | Rio aéreo amazônico | natureza, trajetória, caminho |

Ao criar um novo carrossel/post: **copiar** a imagem escolhida do skill pro
projeto local:

```bash
cp ~/.claude/skills/pedireito-design/assets/midia/img-03.jpg \
   /caminho/do/projeto/assets/
```

Se uma imagem necessária não existir no banco, adicionar primeiro no banco
(com atualização do `README.md`), depois consumir. Mantém consistência visual
entre todas as peças do brand.

---

## 9. Acentos de ênfase

Quatro técnicas de ênfase dentro de uma frase, usar com moderação.

### Acento de peso (weight)

Uma palavra em Archivo Black (pesado) dentro de frase em Anton (regular):

```html
<div class="hero-line">você <b>continuou</b> fazendo.</div>
```

### Acento de cor (color)

Uma palavra em cor diferente dentro da frase:

```
.c-am  → amarelo
.c-vd  → verde
.c-az  → azul
.c-cr  → bege
```

Exemplo (igual a ref histórica "MAS ERA SÓ"):

```html
<div class="hero-line">mas era <span class="c-am">só</span>...</div>
```

### Acento de caixa (box inline)

Uma ou duas palavras em marcador bege. Ver seção 5.

### Acento de fonte (font-mix dentro da palavra)

Troca de família tipográfica DENTRO da mesma palavra — cria textura sofisticada.
Referência histórica: "PRÓ**pria**" onde PRÓ é Archivo Black pesado e pria é
Anton condensado.

Classes:

```
.f-heavy   → Archivo Black (pesado, chunky)  — font-size:1.10em
.f-anton   → Anton (condensado, leve)
.f-bayon   → Bayon (flat-top caps)           — font-size:1.18em
.f-narrow  → Arial Narrow (elegante)
```

**⚠️ REGRA FIRME · altura igual (cap-height match):** quando mistura fontes na
mesma palavra OU na mesma linha, as alturas dos glyphs devem bater visualmente.
Archivo Black e Bayon renderizam cap-height menor que Anton por natureza — se
não compensar, a palavra em peso/família diferente aparece "afundada" na linha.

**Vale pros dois caminhos de mix:**

1. **Via `<span class="f-heavy/f-bayon">`** — classes já carregam `font-size`
   compensado (`.f-heavy` = 1.12em, `.f-bayon` = 1.18em).
2. **Via `<b>` inline** dentro de hero/solo/equal/setup — CSS do `<b>` precisa
   incluir `font-size:1.12em` também. Antes só tinha peso/letter-spacing,
   faltava o scale — resultado: "você <b>PARA</b> de se posicionar" saía com
   PARA visivelmente menor que VOCÊ. Regra firmada após catch do cliente.

Se depois de aplicar 1.12em a altura ainda estiver desigual (acontece em sizes
s-lg+), **sobe a escala** da fonte menor (1.15em, 1.18em) até bater no olho.
Nunca remova o mix — ajuste a escala.

**Como conferir:** imprimir o slide ou abrir em tamanho real e olhar a linha de
topo dos glyphs uppercase. Se uma palavra tem o topo visivelmente mais baixo que
as outras, falta scale.

Exemplo:

```html
<div class="hero-line s-md">
  você <span class="f-heavy">con</span><span class="f-anton">tinuou</span>
</div>
```

Usar **uma técnica por slide**. Nunca peso + cor + box + font-mix empilhados no
mesmo slide.

---

## 10. Alinhamento misto — por BLOCO, nunca por linha

Brincar com alinhamento entre **blocos** do mesmo slide cria ritmo visual.
A regra crítica é **agrupar linhas que pertencem juntas em um único bloco** e
aplicar o alinhamento no bloco inteiro, não linha a linha.

### ❌ Escadinha (proibido)

Alternar alinhamento linha-por-linha dentro do mesmo tipo de elemento cria
efeito escadinha — a pontuação migra visualmente e polui o ritmo.

```
quem permanece, constrói.    ← left
    quem resiste, lidera.    ← center
        quem não se vende,   ← right
           deixa nome.
```

**Não fazer isso.**

### ✓ Dois blocos (padrão ref "DOS SÍMBOLOS / DA PRÓPRIA CASA")

Divida o conteúdo em 2 blocos lógicos. Cada bloco com uma alinhamento. Blocos
com alinhamento diferente entre si:

```
Bloco A (left):
  DOS
  SÍMBOLOS.
  DA FÉ.
  DA TRADIÇÃO.

Bloco B (center ou outro):
  DA PRÓPRIA
  CASA.
```

### Utilities

```
.al-l  → align-self:flex-start; text-align:left
.al-c  → align-self:center; text-align:center
.al-r  → align-self:flex-end; text-align:right
```

Aplicar no **elemento pai de um bloco** (ou num elemento único que contém várias
linhas via `<br>`). Não colocar em cada linha individualmente.

### Exemplo correto (tríade agrupada)

```html
<div class="body">
  <div class="body-copy al-l">A regra é a mesma há dois mil anos:</div>
  <div class="hero-line s-xs al-c">
    quem permanece, <b>constrói</b>.<br>
    quem resiste, <b>lidera</b>.<br>
    quem não se vende, <b>deixa nome</b>.
  </div>
</div>
```

Dois blocos: setup à esquerda + tríade centralizada. Cada bloco coeso, um
alinhamento cada. **Nunca três alinhamentos diferentes dentro do mesmo bloco**.

### Combinações recomendadas

- **Bloco 1 left + Bloco 2 center** (ritmo clássico)
- **Bloco 1 center + Bloco 2 left** (inversão)
- **Bloco 1 left + Bloco 2 left offset** (ref "PRÓPRIA" offset horizontal)

Usar **no máximo 2 blocos** por slide. Três blocos começa a virar caos.

---

## 11. Bleed maximalista — palavra gigante grudada na borda

Regra crítica: **texto maximalista (ultra-grande que preenche o slide
horizontalmente) SÓ pode aparecer grudado ao TOPO ou à BASE do slide**. Nunca
flutuando no meio.

### Referência

Ref histórica "ABANDONO" — palavra-âncora verde gigante, encostada na borda
inferior do slide, letras podendo vazar levemente pra fora do canvas.

### Regra

- Maximalista no **topo** (glued to top) = `.bleed.top`
- Maximalista no **bottom** (glued to bottom) = `.bleed.bottom`
- Maximalista no meio do slide = **PROIBIDO**

Se a palavra grande vai ficar "flutuando" no meio, reduza o tamanho pra hero
normal (`.s-lg` ou `.s-xl`). Maximalismo só faz sentido quando a letra é
estrutural (encostada numa borda).

### Quando usar

- Slide de fecho/CTA (palavra-assinatura gigante embaixo)
- Slide de anchor conceitual (palavra-conceito enorme cortada)
- Slide de payoff dramático

Usar **no máximo 1-2 slides por carrossel** — é um recurso de impacto, não uma
fórmula.

---

## 12. Wordmark "PéDireito"

Quando escrever o nome da marca como texto (não o logo SVG):

- Sempre `PéDireito` — P e D maiúsculos, resto minúsculo
- **Nunca** `pédireito` (tudo minúsculo)
- **Nunca** `PÉDIREITO` (tudo maiúsculo)
- **Nunca** `Pé Direito` com espaço em criativos ou logo (só em prosa)

No design: Anton, tamanho grande (200-260px), como assinatura.

---

## 13. Arquétipos de slide

### ⚠️ REGRA FIRME · aberturas variadas entre carrosséis

**O slide 1 (hook) NUNCA pode ter a mesma estrutura visual entre dois carrosséis
seguidos.** O primeiro slide é o que aparece no feed — se todos os carrosséis
abrirem com o mesmo formato (ex: sempre `tpl-split` + hero + body-copy +
polaroid na direita), o brand perde variedade de ritmo no feed.

**Formatos disponíveis pra abertura** (rotacionar entre eles):

| formato | estrutura | quando usar |
|---|---|---|
| **split + polaroid** | hero/body-copy vertical + foto polaroid lateral | hook narrativo com rosto humano |
| **photo-bleed centered** | foto full-bleed + solo ou hero centrado único | hook forte, impactante, sem explicação |
| **solo centered** | campo cor + solo huge centralizado | manifesto puro, uma frase que basta |
| **bleed maximalista** | body-copy top + palavra gigante no bleed bottom | hook com palavra-âncora (ex: "sozinho.", "acabou.") |
| **stamp com pivot** | hero + palavra-pivô rotacionada em cima | quando tem palavra-chave que merece destaque visual |
| **equal (comparativo)** | dois blocos de peso igual | hook que contrasta duas ideias |

**Check antes de publicar:** comparar o slide 1 do carrossel novo com o slide 1
dos 2-3 carrosséis anteriores. Se a estrutura base (template + tipos de blocos
+ posição da foto) for igual, trocar pra outro formato da lista.

### Quatro estruturas base que se repetem

### Parallel / Equal

Dois blocos de peso visual igual — comparativo ou antítese.

```
tem gente discutindo.
tem gente vivendo.
```

### Payoff

Setup pequeno + hero grande.

```
No dia em que virou piada fazer o certo,   ← setup
você continuou                              ← hero
fazendo.
```

### Solo

Frase única centralizada, sem divisão.

```
silêncio
também é
posição.
```

### Manifesto

Para copy longa: body-copy Arial Narrow no topo ou rodapé, hero display ancorando.

```
Você continuou orando. Ensinando seus        ← body-copy (start)
filhos. Segurando a mão.
e disseram                                    ← hero (end)
que isso era atraso.
```

### Template 3-Zonas (split vertical)

Composição clássica de post com respiração máxima — 3 zonas verticais com
margens simétricas top/bottom:

```
┌────────────────────────┐
│                        │ ← 130px do topo
│  [ICONE]               │
│                        │
│                        │ ← respiro grande
│                        │
│  bloco 1               │ ← texto 1 (body-copy, small lead)
│  (body-copy start)     │
│                        │
│                        │
│                        │ ← espaço flexível entre blocos
│                        │
│  BLOCO 2               │ ← texto 2 (hero, grande)
│  (hero end)            │
│                        │ ← 130px do bottom (espelha top)
└────────────────────────┘
```

**Regras:**
- Icon `tl` no topo (130px da borda)
- Bloco 1 começa com respiro grande abaixo do icon (~200px de gap)
- Bloco 2 ancora no bottom, com 130px de margem que **espelha** a margem do icon
- Entre os 2 blocos, espaço flexível (usar `justify-content:space-between`)

Classe: `.body.tpl-split` (padding 320 top + 130 bottom, space-between)

```html
<div class="slide p-verde">
  <div class="mark tl">...diamond...</div>
  <div class="body up tpl-split">
    <div class="body-copy">No dia em que virou piada fazer o certo,</div>
    <div class="hero-line s-md">você <b>continuou</b> fazendo.</div>
  </div>
</div>
```

**Usar quando:** slide tem 2 blocos textuais distintos (um curto + um âncora)
e a respiração é importante. Ótimo pra slide de abertura ou momentos de
impacto calmo.

### Árvore de decisão de templates (body-copy + hero)

Pra decidir QUAL template usar num slide com body-copy + hero:

```
A posição do ícone (definida pela regra de alinhamento) é...

├── TOPO (tl, tc, tr)
│    → .tpl-split (split vertical com margens espelhando o ícone)
│
└── BOTTOM (bl, bc, br)
     → .tpl-balanced (centraliza considerando o ícone, whitespace simétrico)
     │
     └── Exceção: Hero muito grande (4+ linhas heavy) + risco de cramping
          → .tpl-up (empurra conteúdo pra cima, bottom livre)
```

**Motivo do `tpl-balanced`**: o `justify-content:center` padrão centraliza
conteúdo DENTRO do body (que tem padding simétrico). Mas o ícone bottom está
fora do body, logo o "center" do body NÃO é o center visual considerando o
ícone. Resultado: topo com muito whitespace, bottom cramped. O `tpl-balanced`
ajusta o padding pra que o ícone conte no cálculo, criando whitespace
simétrico visualmente entre topo-do-slide e ícone-top.

**Respiro mínimo no topo:** `tpl-balanced` tem `padding-top:100px` (não zero).
Isso garante que conteúdos grandes (tipo slide com litania de 4 linhas + setup)
não grudem no topo do slide. Se content é pequeno, sobra whitespace; se é
grande, o topo ainda respira 100px.

### Template tpl-up · quando o hero é grande e ícone no bottom

Quando o hero tem 3+ linhas e o ícone precisa ficar no bottom (porque tem
conteúdo centralizado ou por regra de alinhamento), use `tpl-up` pra puxar
tudo pra cima:

```css
.body.tpl-up{
  justify-content:flex-start;
  padding:130px 90px 260px;
}
```

- `justify-content:flex-start` → conteúdo começa no topo do body
- `padding-top:130` → alinha com a posição do ícone top (simétrico se não existir)
- `padding-bottom:260` → reserva espaço generoso pro ícone bottom respirar
- two-block `gap:110` entre blocos continua valendo

Aplicado em slides como o 9 (hero "é agora que o amanhã está sendo escrito"
em 4 linhas + ícone `bc`).

### ⚠️ INCOMPATIBILIDADE · tpl-split + ícone no bottom

`tpl-split` empurra o hero pra perto do bottom (padding-bottom:130px). Se o
ícone também está no bottom (`bl`, `bc`, `br`), eles **colidem** — texto sobre
o ícone.

**Regra firme: texto NUNCA pode sobrepor o ícone.** Se tá acontecendo,
reposicione um dos dois — ou troque de template.

### Tabela de compatibilidade template × ícone

| template | ícone topo (tl/tc/tr) | ícone bottom (bl/bc/br) | obs |
|---|---|---|---|
| default (só `.body`) | ✓ whitespace simétrico | ⚠ top heavy | center padrão |
| `.two-block` | ✓ | ⚠ top heavy | só ajusta o gap |
| `.tpl-split` | ✓ | ❌ **COLIDE** | só topo |
| `.tpl-balanced` | ✓ | ✓ **recomendado** | compensa ícone no cálculo |
| `.tpl-up` | ⚠ desperdiça topo | ✓ | quando hero é gigante |
| `.tpl-diag` | (usa `diag-anchor`) | — | template específico |

### Template Diagonal

Composição com tensão diagonal — bloco 1 top-left, bloco 2 bottom-right,
ícone acompanha à direita. O texto do bloco 2 continua left-aligned dentro
dele, mas o bloco inteiro está **posicionado à direita do canvas**.

```
┌────────────────────────────┐
│                            │
│  BLOCO 1                   │ ← top-left (hero + stamp)
│  (display + stamp)         │
│                            │
│                            │
│                            │
│               BLOCO 2      │ ← bottom-right (body-copy)
│               texto        │    texto é left-aligned dentro
│               em 3 linhas  │    do bloco, mas bloco fica à direita
│                            │
│                    [ICON]  │ ← icon acompanha (br)
│                            │
└────────────────────────────┘
```

**Regras:**
- Bloco 1 no topo esquerdo (padding-top menor que tpl-split pra pressionar pra cima)
- Bloco 2 com `align-self:flex-end` (lateral direita do canvas), `max-width:~52%`
- Texto dentro do bloco 2 mantém `text-align:left`
- Icon vai pra `br` (bottom-right) acompanhando o bloco 2

**Classe:** `.body.tpl-diag`

```html
<div class="slide p-azul">
  <div class="mark br">...</div>
  <div class="body up tpl-diag">
    <div class="group">
      <div class="hero-line s-md">chamaram de<br>evolução.</div>
      <div class="stamp md cr-vd">era pressão.</div>
    </div>
    <div class="body-copy sm">Pra você ceder, se dobrar, se adaptar — até não se reconhecer no espelho.</div>
  </div>
</div>
```

**Posição do ícone neste template:**

A regra geral continua valendo — **ícone segue o alinhamento horizontal do
TEXTO** (onde o texto começa a ser lido). No tpl-diag o bloco 2 está à direita,
mas o texto dentro é left-aligned; o ícone alinha com a **borda esquerda do
texto do bloco 2**, não com o extremo direito do canvas.

Isso cria uma coluna visual imaginária onde o leitor pega o texto do bloco 2 e
desce até encontrar o ícone — continuidade vertical.

CSS: classe `.mark.diag-anchor` posiciona o ícone em `left:522px;bottom:130px`
(calibrado pra bater com a borda esquerda do bloco 2 no canvas 1080×1350).

**Usar quando:** slide tem um hit forte em cima (hero + stamp) + uma
explicação/desdobramento em body-copy. O diagonal cria drama e o ícone ancora
a leitura do bloco 2.

### Poster Triplo Vertical

Arquétipo ref "NADA FOI DESTRUÍDO. [FOI] ESCONDIDO". Tudo caixa alta, tudo
centralizado, sequência vertical de 3 partes com **fontes diferentes em cada
uma**:

```
┌──────────────────────────┐
│  NADA FOI DESTRUÍDO.     │ ← topo: Arial Narrow Bold (.f-narrow-bold) azul
│                          │
│       [FOI]              │ ← meio: stamp verde rotacionado com font-mix
│                          │         dentro da palavra (Archivo Black + Anton)
│                          │
│     ESCONDIDO            │ ← base: Anton condensado (.f-anton) amarelo
└──────────────────────────┘
```

**Estrutura:**
- Todo o slide em UPPERCASE + centralizado (`.body.center.up`)
- **Topo**: frase-setup em Arial Narrow Bold (ou MPI/chunky condensed)
- **Meio**: stamp rotacionado com a palavra-pivot — font-mix dentro da própria
  palavra (ex: "F" em Archivo Black, "OI" em Anton)
- **Base**: palavra-fecho em Anton condensado grande

**Por quê funciona:** três texturas tipográficas distintas criam hierarquia sem
apoiar-se em tamanho apenas. Cada linha "parece" uma fonte diferente, mas todas
convivem no brand system.

**Usar quando:** o texto tem estrutura "afirmação → pivot → revelação" (negação
+ stamp + revelação). Máximo 1-2 slides por carrossel.

### Poster Ritmo Tipográfico (4-zonas)

Arquétipo ref "O BRASIL [NÃO] PRECISA SER REINVENTADO". Tudo caixa alta + tudo
centralizado + sequência vertical de 4 zonas, cada uma com **família
tipográfica diferente**, criando textura rítmica forte:

```
┌─────────────────────────────┐
│                             │
│       O BRASIL              │ ← Zona 1: Tusker Grotesk 3700 Bold (.f-heavy)
│                             │           verde, UPPERCASE, grande (s-xl)
│                             │
│        [NÃO]                │ ← Zona 2: stamp azul rotacionado,
│                             │           texto AMARELO dentro,
│                             │           fontes MIX MPI Gothic Bold + Bayon
│                             │           dentro da mesma palavra
│                             │
│     PRECISA SER             │ ← Zona 3: Bayon (.f-bayon) verde,
│                             │           UPPERCASE, médio (s-md)
│                             │
│     REINVENTADO             │ ← Zona 4: Tusker Grotesk (.f-heavy) verde,
│                             │           UPPERCASE, grande (s-lg/s-xl)
└─────────────────────────────┘
```

**Estrutura típica:**
- Fundo bege (`p-cream-vd`)
- Todo UPPERCASE, tudo centralizado (`.body.center`)
- **Zona 1** — palavra-abertura ou sujeito. Font: `.f-heavy` (Archivo Black sub)
- **Zona 2** — stamp com palavra-pivot curta (1-2 palavras). Rotação -4°. Fundo
  azul, texto amarelo. Font-mix: `.f-heavy` + `.f-bayon` alternados **letra a
  letra ou sílaba a sílaba** dentro da palavra
- **Zona 3** — frase-complemento em Bayon. Menor que zonas 1/4, mais esticada
  (Bayon é naturalmente mais aberta)
- **Zona 4** — palavra-fecho que rima com Zona 1. Volta pra `.f-heavy`

**Sequência tipográfica vertical:**
`Tusker (heavy) → mix no stamp → Bayon (linear) → Tusker (heavy)`

Cria um "A-B-C-A" rítmico: pesado, interrompido, leve, pesado. É o arquétipo
mais sofisticado do brand — usar como slide-âncora do carrossel.

**Paleta das 4 camadas (obrigatório diferenciar):**
| zona | bg | texto |
|---|---|---|
| slide | bege (`--cream`) | — |
| texto principal | — | verde (`--verde`) |
| stamp | azul (`--azul`) | amarelo (`--amarelo`) |

Todas as 4 distintas ✓

**Exemplo em código:**

```html
<div class="slide p-cream-vd">
  <div class="mark tr">...</div>
  <div class="body center up" style="gap:40px">
    <div class="hero-line s-xl f-heavy">o brasil</div>
    <div class="stamp md az-am">
      <span class="f-heavy">n</span><span class="f-bayon">ã</span><span class="f-heavy">o</span>
    </div>
    <div class="hero-line s-md f-bayon">precisa ser</div>
    <div class="hero-line s-xl f-heavy">reinventado</div>
  </div>
</div>
```

**Quando usar:** slide-âncora do carrossel, momento de clímax ou manifesto
principal. Máximo 1 slide por carrossel (é muito forte pra repetir).

---

### Regra crítica · textos do meio em slides com bleed

Quando o slide tem uma palavra/wordmark **maximalista colada ao bottom (bleed)**,
o conteúdo do meio precisa ser **menor** pra não competir com o âncora final.

**Hierarquia obrigatória:**

```
body-copy sm       (~38px)   ← intro pequena
hero-line s-sm     (~118px)  ← médio
BLEED BOTTOM       (~300px)  ← MÁXIMO, a estrela
```

❌ Errado: hero-line s-md (144px) + bleed 300px → competem pelo olho
✓ Certo: hero-line s-sm (118px) + bleed 300px → o bleed domina, meio desce

O bleed é o hit. Tudo acima dele é subordinado, serve de rampa. Se o texto do
meio tá do mesmo tamanho do bleed, reduza até o bleed dominar.

---

## 14. Formato

| formato | dimensão | uso |
|---|---|---|
| Feed Instagram | 1080 × 1350 | carrossel, post único |
| Story | 1080 × 1920 | stories |
| Avatar | 1080 × 1080 | posts quadrados, thumb |

Trabalhar no tamanho real do canvas e escalar para preview — nunca projetar em
tamanho reduzido e esticar.

---

## 15. Proibições gerais

- ❌ Preto puro `#000` como cor da marca
- ❌ Gradientes em UI (exceto scrim sutil sobre foto)
- ❌ Glassmorphism, backdrop-filter
- ❌ Sombras soltas (exceto `shadow-stamp` específico)
- ❌ Itálico em qualquer fonte
- ❌ Amarelo bg + azul texto (contraste ruim)
- ❌ Amarelo bg + body-copy (use display só, ou troque palette)
- ❌ Body-copy sandwich (entre dois displays)
- ❌ Box em frase inteira (só 1-2 palavras inline)
- ❌ Box em block element (sempre `<span>` inline)
- ❌ Stamp com cor igual ao bg do slide ou ao texto principal
- ❌ Wordmark "PéDireito" no footer de cada slide (só no slide CTA)
- ❌ Bordas arredondadas além de 8px em UI (cards de foto podem 20-40px)
- ❌ Ícones externos (Lucide etc.) — só o losango do brand
- ❌ Mocks com "Lorem ipsum" — sempre copy real
- ❌ Traduções de palavras em inglês — brand é Portuguese-first

---

## 16. Checklist antes de finalizar

### Paleta
- [ ] Só usa as 4 cores brand? (verde/amarelo/azul/bege, sem tons intermediários)
- [ ] Azul é `#005CE1` (carrossel)?
- [ ] Nenhum slide é amarelo + azul texto?
- [ ] Nenhum slide amarelo tem body-copy direto (só display grande)?

### Tipografia
- [ ] Nenhum itálico em nenhum lugar?
- [ ] Case misto ao longo dos slides (não tudo caixa alta)?
- [ ] Wordmark "PéDireito" com P e D maiúsculos, resto minúsculo?

### Body-copy
- [ ] Body-copy só no início ou no fim, nunca sanduichado?
- [ ] Texto foi cortado ao mínimo? Tem palavra sobrando?

### Box
- [ ] Nenhum `.box` wrappa frase inteira (só 1-2 palavras)?
- [ ] Todos os `.box` são `<span>` inline (não `<div>` block)?
- [ ] Regra das 4 camadas de cor respeitada em cada `.box`?

### Stamp
- [ ] Stamp usa palavra DO texto do slide (não label externo)?
- [ ] Regra das 4 camadas de cor respeitada (bg slide ≠ texto ≠ stamp bg ≠ stamp texto)?

### Assinatura visual
- [ ] Diamante em 6 posições variadas ao longo do carrossel?
- [ ] Wordmark "PéDireito" só aparece no slide de fecho, não em todos?

### Layout
- [ ] Nenhuma fonte estoura o canvas?
- [ ] Line-height ≥ `.96` em display lowercase (pra não cortar acentos)?

Se qualquer item acima estiver ambíguo, consulte `../README.md` e as referências
visuais em `../uploads/` para precedentes.

---

## Referências

Regras acima foram estabelecidas durante construção do carrossel manifesto
"fazer o certo" (10 slides, 1080×1350), referenciando as 4 refs visuais
históricas do brand:
- Ref A: "NADA FOI DESTRUÍDO. [FOI] ESCONDIDO" — stamp inline, cream bg
- Ref B: "CHAMARAM... MAS ERA SÓ ABANDONO" — acento de cor, anchor gigante
- Ref C: "O BRASILEIRO NÃO ESTÁ PERDIDO... BRASIL" — peso accent + polaroid
- Ref D: Photo-bleed com texto overlay e diamante topo esquerdo

Ver `/Users/pedromerino/Downloads/pedireito-carrossel-torres/` para
implementação de referência com todas as regras aplicadas.
