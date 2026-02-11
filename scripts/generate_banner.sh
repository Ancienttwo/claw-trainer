#!/bin/bash
set -e

source .venv/bin/activate

if ! python3 -c "import requests" &> /dev/null; then
  pip3 install requests
fi

if [ -z "$MODELSCOPE_API_KEY" ]; then
  if [[ "$1" != "--api-key" ]]; then
    echo "Please set MODELSCOPE_API_KEY environment variable or pass --api-key argument."
    echo "Example: export MODELSCOPE_API_KEY=your_key_here"
    echo "Or run: ./scripts/generate_banner.sh --api-key your_key_here"
    exit 1
  fi
fi

python3 scripts/generate_image.py \
  "Professional 16-bit indie game pixel art style, high contrast, sharp edges. A powerful red mechanical claw descending to grab a glowing gold energy sphere. Background is a futuristic high-tech digital arena with deep navy grid floor and floating circuit-like elements. Dithering patterns. Limited color palette: #0B0E17, #F0B90B, #00D4AA, #E2D8C4. No anti-aliasing, clean pixel art." \
  --width 1500 --height 500 \
  --output assets/banner-raw.png \
  "$@"
