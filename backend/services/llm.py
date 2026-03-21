"""
NVIDIA NIM LLM client — calls Kimi K2.5 (or any configured model) via
the OpenAI-compatible chat completions endpoint.
"""
import httpx
from config import settings
from models import RecommendationRequest, EnvironmentalSnapshot


def _build_prompt(req: RecommendationRequest, env: EnvironmentalSnapshot) -> str:
    soil = env.soil
    weather = env.weather

    def fmt(v, unit="", decimals=2):
        return f"{round(v, decimals)}{unit}" if v is not None else "N/A"

    lines = [
        f"You are an expert agronomist. Analyse the following data for a farm plot and provide detailed, actionable recommendations.",
        f"",
        f"## Plot Details",
        f"- Plot: {req.plot_name} (ID: {req.plot_id})",
        f"- Crop: {req.crop}",
        f"- Area: {req.area_acres} acres",
        f"- Days since planting: {req.days_planted if req.days_planted is not None else 'N/A'}",
        f"- Farmer-measured soil pH: {fmt(req.soil_ph)}",
        f"- Farmer-reported soil health score: {fmt(req.soil_health, '%')}",
        f"",
        f"## Location",
        f"- Centroid: {env.centroid_lat:.5f}°N, {env.centroid_lng:.5f}°E",
        f"- Plot radius: {fmt(env.radius_km, ' km')}",
        f"",
        f"## Soil Data (SoilGrids v2 — 0-5 cm depth)",
        f"- pH (H₂O): {fmt(soil.ph)}",
        f"- Organic Carbon: {fmt(soil.organic_carbon, ' g/kg')}",
        f"- Total Nitrogen: {fmt(soil.nitrogen, ' cg/kg')}",
        f"- Clay: {fmt(soil.clay, ' g/kg')}",
        f"- Sand: {fmt(soil.sand, ' g/kg')}",
        f"- Silt: {fmt(soil.silt, ' g/kg')}",
        f"- Bulk Density: {fmt(soil.bulk_density, ' cg/cm³')}",
        f"- Cation Exchange Capacity: {fmt(soil.cation_exchange, ' mmol(c)/kg')}",
        f"",
        f"## Weather Data (Open-Meteo — today's forecast)",
        f"- Max Temperature: {fmt(weather.temperature_2m, '°C')}",
        f"- Precipitation: {fmt(weather.precipitation_sum, ' mm')}",
        f"- Rain: {fmt(weather.rain_sum, ' mm')}",
        f"- Max Wind Speed: {fmt(weather.windspeed_10m_max, ' km/h')}",
        f"- Evapotranspiration (ET₀): {fmt(weather.et0_fao_evapotranspiration, ' mm')}",
        f"- Cloud Cover: {fmt(weather.cloud_cover, '%')}",
        f"- Relative Humidity: {fmt(weather.relative_humidity, '%')}",
        f"- UV Index Max: {fmt(weather.uv_index_max)}",
        f"- Soil Moisture 0-1 cm: {fmt(weather.soil_moisture_0_1cm, ' m³/m³')}",
        f"- Soil Moisture 1-3 cm: {fmt(weather.soil_moisture_1_3cm, ' m³/m³')}",
        f"- Soil Moisture 3-9 cm: {fmt(weather.soil_moisture_3_9cm, ' m³/m³')}",
        f"- Soil Temperature 0 cm: {fmt(weather.soil_temperature_0cm, '°C')}",
        f"",
        f"## Instructions",
        f"Respond in {'the local language of this region (auto-detect from coordinates) or ' if req.language == 'auto' else ''}{'English' if req.language in ('en', 'auto') else req.language}.",
        f"Provide a structured markdown report with:",
        f"1. **Summary** — brief overview of current conditions",
        f"2. **Soil Health Assessment** — interpretation of soil values for {req.crop}",
        f"3. **Weather Impact** — how today's conditions affect the crop",
        f"4. **Immediate Actions** — what the farmer should do in the next 7 days",
        f"5. **Irrigation Advice** — based on ET₀ and soil moisture",
        f"6. **Fertilisation Advice** — based on nitrogen and organic carbon levels",
        f"7. **Risk Alerts** — any pest, disease, or weather risks to watch for",
        f"Be concise but actionable. Use bullet points where appropriate.",
    ]
    return "\n".join(lines)


async def fetch_recommendations(req: RecommendationRequest, env: EnvironmentalSnapshot) -> str:
    prompt = _build_prompt(req, env)

    payload = {
        "model": settings.nvidia_model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1024,
        "temperature": 0.6,
        "top_p": 0.95,
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {settings.nvidia_api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{settings.nvidia_base_url}/chat/completions",
            json=payload,
            headers=headers,
        )
        resp.raise_for_status()
        data = resp.json()

    return data["choices"][0]["message"]["content"]
