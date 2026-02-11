#!/usr/bin/env python3
import base64
import json
import os
import sys
import urllib.request

# Use the API key from environment
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY not found in environment")
    sys.exit(1)

# URL from _ops/gen-assets.py
URL = f"https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key={API_KEY}"

def generate_banner():
    prompt = (
        "Generate a pixel art image (1500x500 aspect ratio). "
        "Style: 16-bit retro pixel art, Pokemon Pokedex aesthetic. Sharp pixels, no blur. "
        "Content: A central red mechanical claw (looking powerful and high-tech) holding a glowing sci-fi ball. "
        "The background is a futuristic digital arena with grid lines and neon accents. "
        "Include some tech UI elements in the corners. "
        "High quality, professional game asset."
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
            
        # Extract image
        candidates = result.get('candidates', [])
        if not candidates:
            print("No candidates returned")
            return
            
        for candidate in candidates:
            parts = candidate.get('content', {}).get('parts', [])
            for part in parts:
                if 'inlineData' in part:
                    mime_type = part['inlineData']['mimeType']
                    data = part['inlineData']['data']
                    
                    if mime_type in ['image/png', 'image/jpeg']:
                        is_png = mime_type == 'image/png'
                        ext = 'png' if is_png else 'jpg'
                        temp_path = f'/Users/ancienttwo/claw-trainer/assets/banner_temp.{ext}'
                        final_path = '/Users/ancienttwo/claw-trainer/assets/banner.png'
                        
                        os.makedirs(os.path.dirname(final_path), exist_ok=True)
                        
                        with open(temp_path, 'wb') as f:
                            f.write(base64.b64decode(data))
                        
                        if not is_png:
                            print(f"Converting {temp_path} to PNG...")
                            try:
                                import subprocess
                                subprocess.run(['sips', '-s', 'format', 'png', temp_path, '--out', final_path], check=True)
                                os.remove(temp_path)
                            except Exception as e:
                                print(f"Conversion failed: {e}. Renaming original to .png (might have wrong header)")
                                os.rename(temp_path, final_path)
                        else:
                            os.rename(temp_path, final_path)
                            
                        print(f"Success! Banner saved to {final_path}")
                        return
                    else:
                        print(f"Received unsupported image type: {mime_type}")
                        
        print("No image found in response")
        print(json.dumps(result, indent=2))
        
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    generate_banner()
