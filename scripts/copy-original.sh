#!/bin/sh
# Garante que o app original (HTML autocontido, fonte de verdade) esteja em public/
# a cada build/preview, mesmo que o diretório public/ seja regenerado.
set -e
SRC="$(dirname "$0")/../src/assets/gestao-de-projetos-cet-2026-rautaki-3-e7d21.html"
DST="$(dirname "$0")/../public/gestao-de-projetos-cet-2026-rautaki-3-e7d21.html"
if [ -f "$SRC" ]; then
  cp -f "$SRC" "$DST"
fi
