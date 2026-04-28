---
name: pedireito-design
description: Use this skill to generate well-branded interfaces and assets for Pé Direito, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

## ⚠️ ORDEM DE LEITURA (obrigatória antes de começar qualquer peça)

1. **`alinhamento/guideline.md`** — fonte de verdade. Contém todas as regras
   consolidadas em alinhamento direto com o cliente (paleta, tipografia,
   templates, regras de ícone, proibições, checklist). **Sobrepõe** qualquer
   outra documentação quando houver conflito.
2. **`assets/midia/README.md`** — catálogo do banco de imagens. Sempre consumir
   fotos deste banco, nunca ad-hoc.
3. **`README.md`** — contexto geral do brand (histórico, voz, referências).
4. Demais arquivos conforme necessidade.

## Estrutura do skill

```
pedireito-design/
├── SKILL.md                          ← este arquivo
├── alinhamento/
│   └── guideline.md                  ← 16 seções · fonte de verdade
├── README.md                          ← contexto brand (herdado da v1)
├── colors_and_type.css               ← tokens CSS (verde/amarelo/azul/cream)
├── assets/
│   ├── midia/                        ← BANCO DE IMAGENS
│   │   ├── README.md                 ← catálogo com uso recomendado
│   │   └── img-01..05.(png|jpg)      ← 5 fotos aprovadas
│   ├── logo-avatar.svg               ← ícone diamante grande
│   ├── check-swoosh.svg              ← ícone diamante pequeno
│   ├── logo-wordmark.svg             ← wordmark vertical "PéDireito"
│   └── product-{cor}.png             ← 4 renders de chinelo
├── ui_kits/
│   ├── instagram/, ads/, site/       ← hi-fi refs
├── preview/                          ← specimen cards de tokens
└── uploads/                          ← refs visuais originais
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

Árvore de decisão em `alinhamento/guideline.md` seção 13:

| template | uso |
|---|---|
| `.tpl-split` | body-copy + hero, ícone no TOPO |
| `.tpl-balanced` | ícone no BOTTOM, content compacto/médio (default!) |
| `.tpl-up` | ícone no BOTTOM, hero gigante (4+ linhas) |
| `.tpl-diag` | bloco 1 top-left + bloco 2 bottom-right |

## Workflow

Artifacts visuais (mocks, carrosséis, stories): copiar assets do skill pro
projeto local e gerar HTML estático. Código de produção: copiar assets e
importar `colors_and_type.css` direto.

**Antes de entregar:** rodar o checklist da seção 16 do guideline.

## Projeto de referência

Implementação completa com todos os templates, regras de ícone, stamps,
bleed, font-mix, etc: `/Users/pedromerino/Downloads/pedireito-carrossel-torres/`

10 slides manifesto "fazer o certo" em 1080×1350, com botão de export pra
PNG, aplicando todas as regras da guideline.
