import httpx
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("NVIDIA_API_KEY")
base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")

url = f"{base_url}/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "moonshotai/kimi-k2.5",
    "messages": [
        {"role": "user", "content": "Say hello to testing"}
    ],
    "max_tokens": 10
}

print(f"Connecting to: {url}")
try:
    resp = httpx.post(url, headers=headers, json=payload, timeout=20.0)
    print("Status:", resp.status_code)
    print("Body:", resp.text)
except Exception as e:
    print("Failed to call completions:", e)
