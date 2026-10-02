#!/usr/bin/env bash
# Department card art: design-src/floor_icons/*.png -> public/dept-art/*.webp
#
#   bash scripts/build-dept-art.sh
#
# The sources are 1536x1024 renders (~1.7 MB PNG each). Cards are ~165px wide
# on a phone and 244px on desktop, so three widths cover 1x-3x. Output is named
# by Department key, not source filename ("pouches.png" -> "pouch-*.webp").
set -euo pipefail

SRC="../design-src/floor_icons"
OUT="public/dept-art"
mkdir -p "$OUT"

for src in "$SRC"/*.png; do
  name=$(basename "$src" .png)
  [ "$name" = "pouches" ] && name="pouch"
  for w in 320 640 960; do
    cwebp -quiet -q 78 -m 6 -resize "$w" 0 "$src" -o "$OUT/$name-$w.webp"
  done
done

ls -l "$OUT"
