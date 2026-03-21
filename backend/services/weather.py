"""
Open-Meteo client — fetches current weather + soil moisture/temperature.
No API key required.
"""
import httpx
from models import WeatherData

_BASE = "https://api.open-meteo.com/v1/forecast"

_DAILY_VARS = [
    "temperature_2m_max",
    "precipitation_sum",
    "rain_sum",
    "windspeed_10m_max",
    "et0_fao_evapotranspiration",
    "uv_index_max",
]

_HOURLY_VARS = [
    "cloudcover",
    "relativehumidity_2m",
    "soil_moisture_0_1cm",
    "soil_moisture_1_3cm",
    "soil_moisture_3_9cm",
    "soil_temperature_0cm",
]


def _first(lst: list) -> float | None:
    """Return the first non-None value from a list."""
    for v in (lst or []):
        if v is not None:
            return float(v)
    return None


async def fetch_weather(lat: float, lng: float) -> WeatherData:
    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": _DAILY_VARS,
        "hourly": _HOURLY_VARS,
        "forecast_days": 1,
        "timezone": "auto",
    }

    result: dict[str, float | None] = {
        "temperature_2m": None,
        "precipitation_sum": None,
        "rain_sum": None,
        "windspeed_10m_max": None,
        "et0_fao_evapotranspiration": None,
        "cloud_cover": None,
        "relative_humidity": None,
        "uv_index_max": None,
        "soil_moisture_0_1cm": None,
        "soil_moisture_1_3cm": None,
        "soil_moisture_3_9cm": None,
        "soil_temperature_0cm": None,
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(_BASE, params=params)
            resp.raise_for_status()
            data = resp.json()

        daily = data.get("daily", {})
        hourly = data.get("hourly", {})

        result["temperature_2m"] = _first(daily.get("temperature_2m_max", []))
        result["precipitation_sum"] = _first(daily.get("precipitation_sum", []))
        result["rain_sum"] = _first(daily.get("rain_sum", []))
        result["windspeed_10m_max"] = _first(daily.get("windspeed_10m_max", []))
        result["et0_fao_evapotranspiration"] = _first(daily.get("et0_fao_evapotranspiration", []))
        result["uv_index_max"] = _first(daily.get("uv_index_max", []))

        result["cloud_cover"] = _first(hourly.get("cloudcover", []))
        result["relative_humidity"] = _first(hourly.get("relativehumidity_2m", []))
        result["soil_moisture_0_1cm"] = _first(hourly.get("soil_moisture_0_1cm", []))
        result["soil_moisture_1_3cm"] = _first(hourly.get("soil_moisture_1_3cm", []))
        result["soil_moisture_3_9cm"] = _first(hourly.get("soil_moisture_3_9cm", []))
        result["soil_temperature_0cm"] = _first(hourly.get("soil_temperature_0cm", []))

    except Exception:
        pass  # Return nulls on failure

    return WeatherData(source="Open-Meteo (free)", **result)
