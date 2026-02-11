#!/usr/bin/env python3
import argparse
import os
import sys
import time
from pathlib import Path


def load_env_file(filepath=".env"):
    if not os.path.exists(filepath):
        return
    with open(filepath) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())


def generate_image(
    prompt,
    model="Tongyi-MAI/Z-Image-Turbo",
    width=1024,
    height=1024,
    negative_prompt="",
    api_key=None,
):
    try:
        import requests
    except ImportError:
        print("Error: requests library is required. Install it with 'pip install requests'")
        sys.exit(1)

    if api_key is None:
        api_key = os.environ.get("MODELSCOPE_API_KEY")

    if not api_key:
        print("Error: MODELSCOPE_API_KEY is required")
        print("\nTo set up your API key:")
        print("1. Create a .env file in the project root with:")
        print("   MODELSCOPE_API_KEY=your-api-key-here")
        print("2. Or set the environment variable:")
        print("   export MODELSCOPE_API_KEY=your-api-key-here")
        print("\nGet your API key from: https://modelscope.cn/my/myaccesstoken")
        sys.exit(1)

    headers = {"Authorization": f"Bearer {api_key}"}

    print(f"Submitting image generation task...")
    print(f"Prompt: {prompt[:80]}...")

    response = requests.post(
        "https://api.modelscope.cn/api/v1/studio/maas/text-to-image",
        headers=headers,
        json={
            "model": model,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": width,
            "height": height,
        },
    )

    if response.status_code != 200:
        print(f"Error: Failed to submit task (status {response.status_code})")
        print(response.text)
        sys.exit(1)

    task_data = response.json()
    task_id = task_data.get("task_id")

    if not task_id:
        print("Error: No task_id in response")
        print(task_data)
        sys.exit(1)

    print(f"Task submitted. Task ID: {task_id}")

    max_attempts = 60
    for attempt in range(max_attempts):
        time.sleep(2)
        poll_response = requests.get(
            f"https://api.modelscope.cn/api/v1/studio/maas/text-to-image/{task_id}",
            headers=headers,
        )

        if poll_response.status_code != 200:
            print(f"Poll error (attempt {attempt + 1}/{max_attempts}): {poll_response.status_code}")
            continue

        poll_data = poll_response.json()
        status = poll_data.get("status")

        if status == "SUCCEEDED":
            return poll_data
        elif status == "FAILED":
            print(f"Error: Task failed - {poll_data.get('error', 'Unknown error')}")
            sys.exit(1)

        print(f"Waiting... ({attempt + 1}/{max_attempts})", end="\r")

    print("\nError: Task timed out")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Generate images using ModelScope's Z-Image-Turbo model"
    )
    parser.add_argument("prompt", help="Text description of the image to generate")
    parser.add_argument(
        "--model", "-m", default="Tongyi-MAI/Z-Image-Turbo", help="ModelScope model ID"
    )
    parser.add_argument(
        "--output", "-o", default="generated_image.png", help="Output file path"
    )
    parser.add_argument("--width", "-W", type=int, default=1024, help="Image width")
    parser.add_argument("--height", "-H", type=int, default=1024, help="Image height")
    parser.add_argument("--negative", "-n", default="", help="Negative prompt")
    parser.add_argument("--api-key", help="ModelScope API key (overrides .env file)")

    args = parser.parse_args()

    env_path = Path(".env")
    if env_path.exists():
        load_env_file(".env")

    result = generate_image(
        prompt=args.prompt,
        model=args.model,
        width=args.width,
        height=args.height,
        negative_prompt=args.negative,
        api_key=args.api_key,
    )

    image_url = result.get("image_url")
    if not image_url:
        print("Error: No image_url in response")
        sys.exit(1)

    print(f"Downloading image from {image_url[:60]}...")

    import requests

    image_response = requests.get(image_url, stream=True)
    if image_response.status_code != 200:
        print(f"Error: Failed to download image (status {image_response.status_code})")
        sys.exit(1)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "wb") as f:
        for chunk in image_response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"\nImage saved to: {output_path}")


if __name__ == "__main__":
    main()
