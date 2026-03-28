"""
NVIDIA NIM LLM client - calls any model via the OpenAI-compatible chat
completions endpoint. Forces JSON output for Dashboard integration.
"""
import asyncio
import httpx
import logging
import json
from config import settings
from models import RecommendationRequest, EnvironmentalSnapshot

logger = logging.getLogger(__name__)


LANGUAGE_MAP = {
    "en": "English",
    "as": "Assamese",
    "bn": "Bengali",
    "brx": "Bodo",
    "doi": "Dogri",
    "gu": "Gujarati",
    "hi": "Hindi",
    "kn": "Kannada",
    "ks": "Kashmiri",
    "kok": "Konkani",
    "mai": "Maithili",
    "ml": "Malayalam",
    "mni": "Manipuri",
    "mr": "Marathi",
    "ne": "Nepali",
    "or": "Odia",
    "pa": "Punjabi",
    "sa": "Sanskrit",
    "sat": "Santali",
    "sd": "Sindhi",
    "ta": "Tamil",
    "te": "Telugu",
    "ur": "Urdu"
}


def _build_prompt(req: RecommendationRequest, env: EnvironmentalSnapshot) -> str:
    soil = env.soil
    weather = env.weather
    target_language = LANGUAGE_MAP.get(req.language or "en", "English")

    def fmt(v, unit="", decimals=2):
        return f"{round(v, decimals)}{unit}" if v is not None else "N/A"

    lines = [
        f"You are an expert agronomist advisor. Analyse the following data for a farm plot and provide a structured JSON response in {target_language}.",
        "",
        "## Plot Details",
        f"- Plot: {req.plot_name} (ID: {req.plot_id})",
        f"- Crop: {req.crop}",
        f"- Area: {req.area_acres} acres",
        f"- Days since planting: {req.days_planted if req.days_planted is not None else 'N/A'}",
        f"- Number of plants/trees: {req.plant_count if req.plant_count is not None else 'N/A'}",
        f"- Daily Action Logged by Farmer: {req.daily_action if req.daily_action else 'None logged'}",
        f"- Soil pH: {fmt(req.soil_ph)}",
        "",
        "## Weather Data (today's forecast)",
        f"- Max Temp: {fmt(weather.temperature_2m, 'C')}",
        f"- Precip: {fmt(weather.precipitation_sum, ' mm')}",
        f"- ET0: {fmt(weather.et0_fao_evapotranspiration, ' mm')}",
        f"- Soil Moisture 0-9cm: {fmt(weather.soil_moisture_3_9cm, ' m3/m3')}",
        "",
        "## Instructions",
        f"You MUST respond ONLY with a valid JSON object. All text values MUST be in {target_language}.",
        "Do not include markdown code blocks like ```json."
        "The JSON MUST have the following keys EXACTLY (do not translate the keys, only the values):",
        '1. "title": A short, punchy heading for the dashboard card. max 6 words.',
        '2. "subtitle": A brief description explaining what to do. max 10 words. CRITICAL: If a daily action was logged, acknowledge it and estimate the yield.',
        '3. "action_text": Text for the main action button. max 3 words.',
        '4. "metric_value": A relevant numeric figure to display in a badge on the right.',
        '5. "metric_label": Label for that metric (e.g., "WATER SAVED", "CURRENT DEFICIT").',
        '6. "full_report": A full, structured markdown advisory report supporting the summary above. Include standard headings: ## Summary, ## Immediate Actions, ## Advice.',
        "",
        "Response FORMAT REQUIRED:",
        "{",
        '  "title": "...",',
        '  "subtitle": "...",',
        '  "action_text": "...",',
        '  "metric_value": "...",',
        '  "metric_label": "...",',
        '  "full_report": "## Summary\\n...\\n## Immediate Actions\\n..."',
        "}"
    ]
    return "\n".join(lines)


def _call_llm_sync(url: str, payload: dict, headers: dict) -> dict:
    with httpx.Client(timeout=90.0) as client:
        resp = client.post(url, json=payload, headers=headers)

    if not resp.is_success:
        body = resp.text[:2000]
        logger.error(f"LLM HTTP {resp.status_code}: {body}")
        raise Exception(f"HTTP {resp.status_code} from LLM: {body}")

    return resp.json()


async def fetch_recommendations(req: RecommendationRequest, env: EnvironmentalSnapshot) -> str:
    prompt = _build_prompt(req, env)

    model = settings.nvidia_model
    base_url = settings.nvidia_base_url.rstrip("/")
    api_key = settings.nvidia_api_key

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1500,
        "temperature": 0.4, # slightly lower temperature for better JSON adherence
        "top_p": 0.95,
        "stream": False,
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if api_key and api_key.strip().lower() not in ("", "none", "local"):
        headers["Authorization"] = f"Bearer {api_key}"

    url = f"{base_url}/chat/completions"
    logger.info(f"LLM request to {url} | model={model}")

    data = await asyncio.to_thread(_call_llm_sync, url, payload, headers)

    choices = data.get("choices") or []
    if not choices:
        raise Exception(f"LLM returned no choices. Response: {data}")

    content = choices[0].get("message", {}).get("content")

    if content is None:
        raise Exception(f"LLM returned null content. finish_reason={choices[0].get('finish_reason')}")

    # clean any accidental markdown wrapping ```json ... ```
    cleaned = content.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first and last line
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    # Validate JSON structure
    try:
        parsed = json.loads(cleaned)
        required = ["title", "subtitle", "action_text", "metric_value", "metric_label", "full_report"]
        for k in required:
            if k not in parsed:
                parsed[k] = "N/A" if k != "full_report" else content
        return json.dumps(parsed)
    except Exception as e:
        logger.warning(f"Failed to parse LLM response as JSON: {e}. Raw: {content[:200]}")
        # Fallback structure so the frontend doesn't crash
        fallback = {
            "title": "Advisory Generated",
            "subtitle": "Click More Details to view full report.",
            "action_text": "Review",
            "metric_value": "New",
            "metric_label": "REPORT",
            "full_report": content
        }
        return json.dumps(fallback)
