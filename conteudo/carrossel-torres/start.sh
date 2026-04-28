#!/bin/bash
# Inicia um servidor local pro carrossel funcionar com download PNG.
# Roda: bash start.sh

cd "$(dirname "$0")"

PORT=8000

echo "▶ Pé Direito · Carrossel Torres"
echo "  Servindo em http://localhost:$PORT"
echo "  Ctrl+C pra parar"
echo ""

# Abre browser automaticamente após 1s
(sleep 1 && open "http://localhost:$PORT") &

# Python 3 (built-in no macOS)
python3 -m http.server $PORT
