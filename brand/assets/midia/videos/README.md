# Banco de vídeos · Pé Direito

Vídeos aprovados pra uso em posts, carrosséis (slides com fundo de vídeo) e stories. Funciona como contraparte do banco de imagens (`../*.jpg`).

## Specs canônicas

### Source ideal (gravado/exportado pra Pé Direito)

| formato | dimensão | duração | fps | codec | bitrate alvo | uso |
|---|---|---|---|---|---|---|
| feed retrato | 1080×1350 | 5–15s loop | 30 | h264 (libx264) | ~4–6 Mbps | post-vídeo, slide com bg vídeo |
| feed quadrado | 1080×1080 | 5–15s loop | 30 | h264 | ~4–6 Mbps | post quadrado |
| story | 1080×1920 | 5–15s loop | 30 | h264 | ~5–7 Mbps | story vertical |

### Source aceito (HD horizontal, será cropado)

Se o vídeo source for **HD horizontal (1280×720, 1920×1080)**, o pipeline `render-video.mjs` faz `scale=force_original_aspect_ratio=increase` + crop centralizado pra 1080×1350. **Atenção**: aspect 16:9 → 4:5 perde ~55% da largura. Garantir composição **centralizada** no vídeo source pra não cortar elementos importantes nas laterais. FPS 25 é aceito (Instagram suporta 25–60).

**Container**: `.mp4`
**Pixel format**: `yuv420p` (compatibilidade Instagram)
**Áudio**: sem áudio por padrão (`-an`). Se tiver, AAC 128kbps. Instagram silencia por default e a marca é manifesto visual.
**Tamanho máximo**: 30 MB por arquivo (limite Instagram).
**Loop seamless**: primeiro e último frames idênticos pra loop limpo.

## Naming

`vid-NN.mp4` em sequência (vid-01.mp4, vid-02.mp4, ...). Sem espaço, sem caracter especial.

## Conteúdo aceito

- Imagens em movimento que reforcem a identidade: Brasil real, povo, trabalho, fé, família, Brasil-paisagem, mãos, chão.
- Cor dominante on-brand (verde, amarelo, azul, bege, ou cromia neutra que case com overlay da paleta).
- Texturas/movimento sutil também são bem-vindos (gradiente animado, partículas, padrões orgânicos).

## Conteúdo proibido

- Ninguém com rosto identificável sem release de imagem.
- Logo de outra marca visível.
- Material com áudio com voz/música protegida.
- Stock genérico (palmeira clichê, cidade noturna estilo Pexels).

## Como adicionar um vídeo novo

1. Otimizar pra specs acima (use ffmpeg ou DaVinci).
2. Salvar como `vid-NN.mp4` com o próximo número disponível.
3. Adicionar entrada em `conteudo/_uso-videos.json` quando for usado em alguma peça.
4. Verificar tamanho com `ls -lh` — deve ficar abaixo de 30 MB.

## Comando de referência (otimização ffmpeg)

```bash
ffmpeg -i input.mov \
  -vf "scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350" \
  -c:v libx264 -preset slow -crf 22 \
  -pix_fmt yuv420p -movflags +faststart \
  -an -t 10 \
  vid-NN.mp4
```
