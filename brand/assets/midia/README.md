# Banco de Imagens — Pé Direito

Fonte única de fotografias aprovadas para uso em posts, carrosséis, stories e
outras peças visuais. **Sempre consumir deste banco** ao criar novas peças —
não usar fotos ad-hoc baixadas ou geradas fora do aprovado.

## Catálogo · 32 imagens

Expandido em 2026-04-21 · 5 originais (01-05) + 28 novas (06-33, sem 08 e 14).

### Lote 1 — Catalogadas (01-05)

| arquivo | conteúdo | palette orgânica | melhor uso |
|---|---|---|---|
| `img-01.png` | Rio de Janeiro panorâmica · Cristo + estrada | azul céu + verde + areias | full-bleed pra slides sobre Brasil, horizonte, jornada |
| `img-02.jpg` | Jovem sorrindo em terraço favela · golden hour | amarelo + laranjas + marrom | vitalidade, juventude, manhã |
| `img-03.jpg` | Cão + parede amarela + porta azul + varal | amarelo + azul (brand-match!) | silêncio cotidiano, "chão" literal |
| `img-04.jpg` | Retrato senhora sorrindo | amarelo floral + azul | sabedoria, memória, geração |
| `img-05.png` | Vista aérea rio amazônico | verde esmeralda + água | natureza, trajetória, caminho |

### Lote 2 — Novas (06-33)

Imagens adicionadas mas ainda não catalogadas individualmente. Antes de usar,
visualizar cada uma e inferir o conteúdo/tom. Ao aplicar numa peça, atualizar
este README adicionando a linha correspondente.

Lista de arquivos disponíveis:

```
img-06.jpg · img-07.jpg · img-09.jpg · img-10.jpg · img-11.jpg · img-12.jpg
img-13.jpg · img-15.jpg · img-16.jpg · img-17.jpg · img-18.jpg · img-19.jpg
img-20.jpg · img-21.jpg · img-22.jpg · img-23.jpg · img-24.jpg · img-25.jpg
img-26.jpg · img-27.jpg · img-28.jpg · img-29.jpg · img-30.jpg · img-31.jpg
img-32.jpg · img-33.jpg
```

## ⚠️ Regras críticas

### 1. Nunca repetir imagem no mesmo post
Uma imagem só pode aparecer 1x por carrossel, mesmo em formatos diferentes
(polaroid + full-bleed). Repetir quebra a sensação de curadoria.

### 2. Escolha baseada em semântica, não decoração
A foto deve reforçar o punchline do slide. Não escolher "por enfeite" — cada
foto tem um significado que combina com certos textos.

### 3. Verificar paleta orgânica
Foto com muito azul combina melhor com slides azul-background.
Foto quente combina com slides verde/amarelo. Foto que já tem cores brand
(ex: img-03 com parede amarela e porta azul) integra naturalmente.

## Convenções de uso

### Full-bleed

Foto preenche o canvas inteiro (1080×1350), texto overlay em cream/amarelo
com overlay 20% preto garantindo legibilidade.

```html
<div class="slide photo-bleed" style="background-image:url('assets/midia/img-03.jpg')">
  ...
</div>
```

### Polaroid absolute

Card pequeno posicionado com `position:absolute` na lateral livre do slide,
FORA do fluxo do body (não participa do cálculo de layout).

```html
<div class="slide p-verde">
  <div class="mark">...</div>
  <div class="body up tpl-split">...</div>
  <div class="photo-card abs sm" style="top:48%;right:130px;transform:translateY(-50%)">
    <img src="assets/midia/img-04.jpg" alt="">
  </div>
  <div class="cta">...</div>
</div>
```

**Regra crítica:** polaroid nunca em cima nem embaixo do texto. Precisa caber
no gap vertical entre blocos de texto, posicionado na lateral oposta. Ver
seção 8 da `alinhamento/guideline.md`.

## Referências cruzadas

- Uso full-bleed e polaroid: `../../alinhamento/guideline.md` seção 8
- Exemplo aplicado: `/Users/pedromerino/Downloads/pedireito-carrossel-torres/`

## Adicionando novas imagens ao banco

Nomear sequencialmente `img-NN.jpg` ou `.png`. Atualizar este README com linha
na tabela apropriada. Imagens devem:

- Ser realistas ou hi-fi (sem ilustração genérica)
- Luz brasileira quente, alta saturação
- Sem filtros cool/b&w/duotone
- Áreas de cor uniformes suficientes pra texto overlay (se for pra full-bleed)
- Preferencialmente conter 1+ cor da paleta (verde/amarelo/azul) organicamente
