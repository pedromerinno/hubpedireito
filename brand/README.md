# Pé Direito · Brand

Pasta de distribuição com as regras e assets do brand pra o time consumir em
qualquer criação de post, carrossel, story ou peça visual.

> Fonte original: skill `pedireito-design` do Claude Code. Esta pasta é uma
> cópia sincronizada — sempre que novas regras forem estabelecidas, o skill
> é atualizado primeiro e depois replicado aqui.

---

## 📖 Por onde começar

1. **Ler `alinhamento/guideline.md`** — as 16 regras que guiam todo o design.
   É a fonte de verdade. Todo dev/designer lê antes de criar qualquer peça.
2. **Ver `assets/midia/README.md`** — catálogo das 5 fotos aprovadas. Sempre
   consumir deste banco, nunca ad-hoc.
3. **Importar `assets/colors_and_type.css`** — tokens prontos pra usar em
   qualquer projeto HTML/CSS. Contém as 4 cores travadas e as classes base.

---

## 🎨 Paleta travada (carrossel)

| cor | hex | rgb | uso |
|---|---|---|---|
| **verde** | `#2B9402` | `rgb(43, 148, 2)` | bg, texto, display |
| **amarelo** | `#FEBF00` | `rgb(254, 191, 0)` | bg, texto, acento |
| **azul** | `#005CE1` | `rgb(0, 92, 225)` | bg, texto, link |
| **bege** | `#F9F1D1` | `rgb(249, 241, 209)` | respiro, caixa |

❌ **Proibido:** amarelo bg + azul texto (contraste ruim).

---

## ✍️ Tipografia

| fonte | papel |
|---|---|
| **Anton** (sub Tusker/Coolvetica) | display grande, hero |
| **Archivo Black** (sub MPI/Tusker heavy) | peso acento |
| **Bayon** | chrome, labels, UPPERCASE |
| **Arial Narrow** | voz de manifesto, body-copy longo |

- Nunca itálico em nenhuma fonte
- Tudo que não é body-copy pode ser UPPERCASE
- Body-copy Arial Narrow só no **início** ou **fim** do slide (nunca sandwich)

---

## 📐 Templates de layout

Decidir pelo tipo de slide e posição do ícone (ver seção 13 da guideline):

| template | uso |
|---|---|
| `.tpl-split` | body-copy + hero, ícone no TOPO (respiração máxima) |
| `.tpl-balanced` | ícone no BOTTOM + content médio (**default pra bottom**) |
| `.tpl-up` | ícone no BOTTOM + hero gigante (4+ linhas) |
| `.tpl-diag` | bloco 1 top-left + bloco 2 bottom-right (diagonal) |

---

## 🎯 Ícone (losango bandeira)

- Tamanho: `82×48px` · margem das bordas: `130px`
- 6 posições: `tl / tc / tr / bl / bc / br`
- **Regra:** ícone segue o alinhamento do bloco MAIS PRÓXIMO dele
  - Ícone no topo → bloco do topo manda
  - Ícone no bottom → bloco do bottom manda
- Nunca texto sobre o ícone

---

## 🖼️ Banco de imagens

5 fotos aprovadas em `assets/midia/`:

- `img-01.png` — Rio panorâmico (Cristo + estrada)
- `img-02.jpg` — Jovem sorrindo em terraço favela
- `img-03.jpg` — Cão + parede amarela + porta azul
- `img-04.jpg` — Retrato senhora sorrindo
- `img-05.png` — Rio aéreo amazônico

Ver `assets/midia/README.md` pro catálogo completo com uso recomendado.

---

## 📱 Formato

| formato | dimensão | uso |
|---|---|---|
| Feed Instagram | `1080 × 1350` | carrossel, post único |
| Story | `1080 × 1920` | stories |
| Avatar | `1080 × 1080` | posts quadrados, thumb |

---

## 🗂️ Estrutura desta pasta

```
brand/
├── README.md                     ← este arquivo (quickstart)
├── SKILL.md                      ← meta do skill
├── alinhamento/
│   └── guideline.md              ← 16 seções · fonte de verdade
├── exports/                      ← carrosséis finalizados
└── assets/
    ├── colors_and_type.css       ← tokens CSS prontos
    ├── midia/                    ← banco de imagens
    │   ├── README.md             ← catálogo com uso
    │   └── img-01..33            ← fotos aprovadas
    └── logos/
        ├── logo-avatar.svg       ← diamante grande
        ├── check-swoosh.svg      ← diamante pequeno
        └── logo-wordmark.svg     ← "PéDireito" vertical
```

---

## ✅ Checklist antes de entregar qualquer peça

Ver seção 16 completa em `alinhamento/guideline.md`. Resumo:

- [ ] Só usa as 4 cores brand?
- [ ] Nenhum slide tem amarelo bg + azul texto?
- [ ] Body-copy Arial Narrow só no início ou fim (nunca sandwich)?
- [ ] Stamp usa palavra do próprio texto (não label externo)?
- [ ] Icon segue o bloco mais próximo dele?
- [ ] Nenhum texto sobrepõe o ícone?
- [ ] Nenhuma fonte estoura o canvas?
- [ ] Foto vem do banco `assets/midia/` (não ad-hoc)?
- [ ] Wordmark "PéDireito" com casing correto (P e D maiúsculos)?
- [ ] Sem itálico em nenhum lugar?

---

## 🔁 Atualização

Se o brand refinar alguma regra, atualize primeiro o skill original:
`~/.claude/skills/pedireito-design/` e depois resync esta pasta:

```bash
# Resync do skill pro brand (rode isso quando houver mudanças)
cp ~/.claude/skills/pedireito-design/SKILL.md \
   /Users/pedromerino/Documents/PeDireito/brand/
cp ~/.claude/skills/pedireito-design/alinhamento/guideline.md \
   /Users/pedromerino/Documents/PeDireito/brand/alinhamento/
cp -r ~/.claude/skills/pedireito-design/assets/midia/ \
   /Users/pedromerino/Documents/PeDireito/brand/assets/midia/
cp ~/.claude/skills/pedireito-design/colors_and_type.css \
   /Users/pedromerino/Documents/PeDireito/brand/assets/
cp ~/.claude/skills/pedireito-design/assets/{logo-avatar,check-swoosh,logo-wordmark}.svg \
   /Users/pedromerino/Documents/PeDireito/brand/assets/logos/
```
