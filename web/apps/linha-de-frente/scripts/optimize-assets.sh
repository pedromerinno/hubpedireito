#!/usr/bin/env bash
# Otimização offline dos assets pesados pra compensar a ausência de
# Image Resizing/Polish no plano Cloudflare Free.
#
# Idempotente: roda só sobre originais que ainda não tem WebP equivalente
# e arquivos acima do threshold de tamanho.
#
# Pré-requisitos:
#   brew install webp mozjpeg ffmpeg svgo  (macOS)
#   apt install webp libjpeg-turbo-progs ffmpeg && npm i -g svgo  (Linux)

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC="$APP_DIR/public"

cd "$PUBLIC"

echo "==> Convertendo PNGs >500KB pra WebP (q=82)"
find . -type f -name "*.png" -size +500k | while read -r png; do
  webp="${png%.png}.webp"
  if [ ! -f "$webp" ] || [ "$png" -nt "$webp" ]; then
    cwebp -q 82 -mt "$png" -o "$webp" 2>&1 | tail -2
  fi
done

echo "==> Recomprimindo JPEGs >500KB com mozjpeg (q=80, progressive)"
find . -type f \( -name "*.jpg" -o -name "*.jpeg" \) -size +500k | while read -r jpg; do
  tmp="${jpg}.tmp"
  cjpeg -quality 80 -progressive -optimize -outfile "$tmp" "$jpg" 2>/dev/null && mv "$tmp" "$jpg"
done

echo "==> Re-encodando MP4s (CRF 28, faststart)"
find . -type f -name "*.mp4" | while read -r mp4; do
  tmp="${mp4%.mp4}.optimized.mp4"
  if [ ! -f "$tmp" ] || [ "$mp4" -nt "$tmp" ]; then
    ffmpeg -y -hide_banner -loglevel error \
      -i "$mp4" \
      -c:v libx264 -crf 28 -preset slow \
      -movflags +faststart \
      -c:a aac -b:a 96k \
      "$tmp"
    mv "$tmp" "$mp4"
  fi
done

echo "==> Otimizando SVGs"
find . -type f -name "*.svg" -exec svgo --quiet {} \; 2>/dev/null || true

echo "==> Resumo de tamanho do diretório public/"
du -sh .
echo ""
echo "Os 10 maiores arquivos restantes:"
find . -type f -size +200k -exec du -h {} \; | sort -hr | head -10
