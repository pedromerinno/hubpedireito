---
description: Regra de layout para barras horizontais de informação (top bars, banners, announcement bars)
globs:
  - "web/**/*.tsx"
  - "web/**/*.jsx"
---

# Top Bar / Announcement Bar — Layout de 3 colunas

Sempre que criar uma barra horizontal de informação (top bar, banner, announcement bar),
ela **deve conter exatamente 3 áreas de conteúdo**:

1. **Esquerda** — informação primária ou contextual (ex: data, status, nome do evento)
2. **Centro** — informação de destaque ou complementar (ex: countdown, tagline, CTA curto)
3. **Direita** — ação ou informação secundária (ex: link, botão, badge)

## Implementação com Tailwind

Usar CSS Grid com 3 colunas de largura igual para garantir centralização perfeita
do item do meio, independente do tamanho dos itens laterais:

```tsx
<div className="grid grid-cols-3 items-center">
  <span className="justify-self-start">Esquerda</span>
  <span className="justify-self-center text-center">Centro</span>
  <span className="justify-self-end text-right">Direita</span>
</div>
```

### Por que grid e não flex justify-between?

Com `flex justify-between` e 3 itens, o item central só fica visualmente centralizado
se os itens laterais tiverem a mesma largura. Com `grid-cols-3`, cada coluna ocupa 1/3
do espaço, garantindo centralização real.

### Regras adicionais

- Nunca deixar uma top bar com apenas 1 ou 2 itens — sempre preencher as 3 posições.
- Se não houver conteúdo para uma posição, usar um `<span>` vazio para manter o layout.
- Em mobile, se o espaço for insuficiente, o item central pode ser ocultado com `hidden sm:block`.
