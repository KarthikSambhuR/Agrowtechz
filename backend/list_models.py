import httpx
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("NVIDIA_API_KEY")
base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")

url = f"{base_url}/models"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
}

print(f"Connecting to: {url}")
try:
    resp = httpx.get(url, headers=headers, timeout=10.0)
    if resp.status_code == 200:
        data = resp.json()
        models = data.get("data", [])
        for m in models:
            if "kimi" in m["id"].lower() or "moonshot" in m["id"].lower():
                print(f" 👉 Model ID: '{m['id']}'")
    else:
        print("Body:", resp.text)
except Exception as e:
    print("Failed to fetch models:", e)
