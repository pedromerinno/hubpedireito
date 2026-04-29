---
name: pedireito-design
description: Use this skill to generate well-branded interfaces and assets for Pé Direito, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

## ⚠️ ORDEM DE LEITURA (obrigatória antes de começar qualquer peça)

A fonte de verdade da marca vive em `/brand/` (raiz do projeto). Esta skill
contém apenas os complementos visuais que o Claude precisa pra prototipar.

1. **`brand/alinhamento/guideline.md`** — fonte de verdade. 16 seções
   consolidadas em alinhamento direto com o cliente (paleta, tipografia,
   templates, regras de ícone, proibições, checklist). **Sobrepõe** qualquer
   outra documentação quando houver conflito.
2. **`brand/assets/midia/README.md`** — catálogo do banco de imagens. Sempre
   consumir fotos deste banco, nunca ad-hoc.
3. **`brand/README.md`** — contexto geral do brand (histórico, voz, posicionamento).
4. **`brand/assets/colors_and_type.css`** — tokens CSS oficiais.
5. Demais arquivos desta skill conforme necessidade (refs visuais, UI kits).

## Estrutura

**Fonte de verdade da marca** (`/brand/` na raiz do projeto):

```
brand/
├── alinhamento/
│   └── guideline.md            ← 16 seções · fonte de verdade
├── README.md                    ← contexto brand
├── assets/
│   ├── colors_and_type.css     ← tokens CSS oficiais
│   ├── logos/                  ← logo-avatar, logo-wordmark, check-swoosh
│   ├── midia/                  ← BANCO DE IMAGENS (catálogo no README.md)
│   ├── products/               ← 4 renders de chinelo (amarelo, azul, branco, verde)
│   └── ref/                    ← CARROSSEL refs (12 PNGs)
└── exports/                    ← carrosséis finalizados
```

**Esta skill** (`.claude/skills/pedireito-design/`):

```
pedireito-design/
├── SKILL.md                    ← este arquivo
├── referencias-web/            ← screenshots de páginas web aprovadas
├── ui_kits/
│   ├── instagram/, ads/, site/ ← refs hi-fi por canal
└── preview/                    ← specimen cards de tokens (HTML)
```

## Paleta travada (carrossel)

| | hex | rgb |
|---|---|---|
| **verde** | `#2B9402` | `rgb(43, 148, 2)` |
| **amarelo** | `#FEBF00` | `rgb(254, 191, 0)` |
| **azul** | `#005CE1` | `rgb(0, 92, 225)` |
| **bege** | `#F9F1D1` | `rgb(249, 241, 209)` |

## Voz

Manifesto-style, declarativa, Portuguese-first. Lowercase display com acentos
uppercase pontuais. Sem itálico em nenhuma fonte. Sem preto puro como cor.

## Tipografia (4 famílias, cada uma com função)

- **Anton** (sub Tusker/Coolvetica) — display grande, hero
- **Archivo Black** (sub Tusker heavy/MPI Gothic) — acento de peso
- **Bayon** — chrome, labels, counters (UPPERCASE letter-spaced)
- **Arial Narrow** — voz de manifesto, body-copy longo

## Templates (quando usar qual)

Árvore de decisão em `brand/alinhamento/guideline.md` seção 13:

| template | uso |
|---|---|
| `.tpl-split` | body-copy + hero, ícone no TOPO |
| `.tpl-balanced` | ícone no BOTTOM, content compacto/médio (default!) |
| `.tpl-up` | ícone no BOTTOM, hero gigante (4+ linhas) |
| `.tpl-diag` | bloco 1 top-left + bloco 2 bottom-right |

## Workflow

Artifacts visuais (mocks, carrosséis, stories): copiar assets de `brand/`
pro projeto local e gerar HTML estático. Código de produção (apps em
`web/apps/*`): copiar imagem pro `public/` da app e importar
`brand/assets/colors_and_type.css` direto.

**Antes de entregar:** rodar o checklist da seção 16 do guideline.
