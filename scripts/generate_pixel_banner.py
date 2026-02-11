#!/usr/bin/env python3
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from PIL import Image
from io import BytesIO

API_KEY = os.environ.get("GEMINI_API_KEY")

URL = f"https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key={API_KEY}"

def generate_banner():
    if not API_KEY:
        print("Error: GEMINI_API_KEY not found in environment")
        sys.exit(1)
        
    prompt = (
        "Generate a high-end 16-bit professional pixel art banner (ratio 3:1). "
        "Style: Professional indie game pixel art (Celeste / Hyper Light Drifter level). Visible hand-placed pixels. NO anti-aliasing. NO smooth gradients. Sharp 1:1 pixel boundaries. "
        "Palette: Neo-Arcade Gold (Deep navy #0B0E17, BNB Gold #F0B90B, Teal-mint #00D4AA, Warm cream #E2D8C4). Max 12-16 colors. "
        "Scene: A powerful red mechanical claw grabbing a glowing gold sphere. Background is a futuristic dark arcade arena with deep navy grid floor and neon highlights."
    )
    
    print(f"Generating banner with prompt: {prompt}")
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "temperature": 0.4,
        }
    }
    
    try:
        req = urllib.request.Request(
            URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            
        candidates = result.get('candidates', [])
        if not candidates:
            print("No candidates returned. Full result:")
            print(json.dumps(result, indent=2))
            return

        image_found = False
        for candidate in candidates:
            parts = candidate.get('content', {}).get('parts', [])
            for part in parts:
                if 'inlineData' in part:
                    image_found = True
                    mime_type = part['inlineData']['mimeType']
                    data = part['inlineData']['data']
                    
                    print(f"Found image with mime type: {mime_type}")
                    
                    image_data = base64.b64decode(data)
                    img = Image.open(BytesIO(image_data))
                    print(f"Original size: {img.size}")
                    
                    TARGET_WIDTH = 1500
                    TARGET_HEIGHT = 500
                    
                    w, h = img.size
                    target_ratio = TARGET_WIDTH / TARGET_HEIGHT
                    current_ratio = w / h
                    
                    if current_ratio > target_ratio:
                        new_w = int(h * target_ratio)
                        offset = (w - new_w) // 2
                        img = img.crop((offset, 0, offset + new_w, h))
                    elif current_ratio < target_ratio:
                        new_h = int(w / target_ratio)
                        offset = (h - new_h) // 2
                        img = img.crop((0, offset, w, offset + new_h))
                        
                    print(f"Cropped size: {img.size}")
                    
                    # Force pixel look: Downsample to 375x125 then upscale 4x
                    DOWNSCALE_WIDTH = 375
                    DOWNSCALE_HEIGHT = 125
                    
                    img_small = img.resize((DOWNSCALE_WIDTH, DOWNSCALE_HEIGHT), resample=Image.BILINEAR)
                    print(f"Downscaled to: {img_small.size}")
                    
                    img_pixelated = img_small.resize((TARGET_WIDTH, TARGET_HEIGHT), resample=Image.NEAREST)
                    print(f"Upscaled to: {img_pixelated.size}")
                    
                    final_path = '/Users/ancienttwo/claw-trainer/assets/banner.png'
                    os.makedirs(os.path.dirname(final_path), exist_ok=True)
                    
                    img_pixelated.save(final_path)
                    print(f"Success! Saved pixel art banner to: {final_path}")
                    return

        if not image_found:
            print("No image found in response candidates.")
            print(json.dumps(result, indent=2))
        
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    generate_banner()
