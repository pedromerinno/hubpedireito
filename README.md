# Pé Direito

Repositório monorepo da marca **Pé Direito** — a marca do povo brasileiro.

Aqui mora tudo: identidade de marca, ferramentas de produção de conteúdo, apps web, jogos, e a configuração dos agentes de IA que assistem na criação dia-a-dia.

## Estrutura

```
PeDireito/
├── brand/              ← identidade de marca (fonte única de verdade)
├── conteudo/           ← ferramentas de produção (carrosséis, plugin Figma)
├── games/              ← jogos da marca
│   └── chinelada/
├── web/                ← monorepo Turborepo das 5 apps web
│   ├── apps/
│   └── packages/
├── _archive/           ← versões antigas / backups
└── .claude/            ← config dos agentes e skills da marca
    ├── agents/
    └── skills/
```

## `/brand` — identidade de marca

**Fonte única de verdade da marca.** Todos os assets, regras e referências oficiais.

```
brand/
├── alinhamento/
│   └── guideline.md          ← 16 seções · regras consolidadas com o cliente
├── assets/
│   ├── colors_and_type.css   ← tokens CSS (paleta, tipografia)
│   ├── logos/                ← logo-avatar, logo-wordmark, check-swoosh
│   ├── midia/                ← banco de fotos aprovadas (catálogo no README)
│   ├── products/             ← renders dos chinelos (4 cores)
│   └── ref/                  ← referências de carrosséis
├── exports/                  ← carrosséis finalizados (PNGs)
├── README.md
└── SKILL.md
```

**Quem consome:** designers, devs, e os agentes de IA. Antes de qualquer peça nova, lê-se a guideline.

## `/conteudo` — ferramentas de produção

Mini-apps web e plugins usados pra **produzir conteúdo** (não são produtos finais).

```
conteudo/
├── carrossel-sozinho/   ← gerador de carrossel single-deck (HTML+JS)
├── carrossel-torres/    ← gerador de carrossel multi-frame
└── figma-plugin/        ← plugin do Figma com helpers da marca
```

Cada subpasta tem seu `start.sh` ou `manifest.json` próprio.

## `/games` — jogos da marca

```
games/
└── chinelada/           ← jogo "Chinelada"
```

## `/web` — monorepo Turborepo

5 apps web + pacotes compartilhados. Stack: **Vite + React 18 + TS + Tailwind + shadcn/ui + Supabase**.

| App | Porta | Propósito |
|---|---|---|
| countdown | 8080 | LP de contagem regressiva |
| lp-lancamento | 8081 | LP pública de lançamento |
| painel-admin | 8082 | Painel admin (interno) |
| revendedores | 8083 | LP pública de revendedores |
| portal | 8084 | Portal de notícias |

```bash
cd web
npm install
npm run dev          # roda os 5 em paralelo
npm run dev:lp       # ou um específico
```

Detalhes completos em [`web/README.md`](web/README.md).

## `/_archive` — backups

Versões antigas e repositórios pré-monorepo. Pode ser deletado quando tudo estiver estável em produção.

## `/.claude` — agentes de IA e skills

Config local dos agentes do Claude Code que ajudam na criação. Versionado com o repo, então qualquer pessoa que clonar já tem acesso.

```
.claude/
├── agents/                   ← 4 subagentes especializados
│   ├── pedireito-copy.md
│   ├── pedireito-designer-posts.md
│   ├── pedireito-designer-carrossel.md
│   └── pedireito-ui-ux.md
└── skills/
    └── pedireito-design/     ← skill da marca (refs visuais + ui kits)
        ├── SKILL.md
        ├── referencias-web/  ← screenshots de páginas aprovadas
        ├── ui_kits/          ← refs hi-fi por canal (instagram, ads, site)
        └── preview/          ← specimen cards de tokens
```

Os agentes leem `brand/alinhamento/guideline.md` antes de qualquer peça — a marca é fonte de verdade absoluta.

## Voz e posicionamento

- **Marca:** Pé Direito é **a marca do povo brasileiro** (posicionamento, não categoria — nunca "o chinelo brasileiro").
- **Nome:** sempre `Pé Direito` (com P, D maiúsculos e acento). Nunca `pé direito`, `Pe Direito`, etc.
- **Voz:** manifesto, declarativa, português-brasileiro, terceira pessoa coletiva, lowercase com acentos UPPERCASE pontuais.

Detalhes completos em `brand/alinhamento/guideline.md`.

## Contatos oficiais

- Instagram: [@usepedireito__](https://instagram.com/usepedireito__)
- TikTok: [@usepedireito](https://tiktok.com/@usepedireito)
- Site: [usepedireito.com.br](https://usepedireito.com.br)
- WhatsApp suporte: +55 27 3199-0337
