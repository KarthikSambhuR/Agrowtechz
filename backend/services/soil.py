"""
SoilGrids REST v2 client - fetches soil properties for a lat/lng point.
No API key required.

Uses asyncio.to_thread + sync httpx to avoid Windows ProactorEventLoop DNS issues.
"""
import asyncio
import httpx
from models import SoilData

_BASE = "https://rest.isric.org/soilgrids/v2.0/properties/query"

# SoilGrids property names -> our field names
_PROP_MAP = {
    "phh2o": "ph",
    "oc": "organic_carbon",
    "nitrogen": "nitrogen",
    "clay": "clay",
    "sand": "sand",
    "silt": "silt",
    "bdod": "bulk_density",
    "cec": "cation_exchange",
}


def _fetch_soil_sync(lat: float, lng: float) -> dict:
    params = {
        "lon": lng,
        "lat": lat,
        "property": list(_PROP_MAP.keys()),
        "depth": ["0-5cm"],
        "value": ["mean"],
    }
    with httpx.Client(timeout=15.0) as client:
        resp = client.get(_BASE, params=params)
        resp.raise_for_status()
        return resp.json()


async def fetch_soil(lat: float, lng: float) -> SoilData:
    values: dict[str, float | None] = {v: None for v in _PROP_MAP.values()}

    try:
        data = await asyncio.to_thread(_fetch_soil_sync, lat, lng)

        for layer in data.get("properties", {}).get("layers", []):
            prop_name = layer.get("name")
            field_name = _PROP_MAP.get(prop_name)
            if not field_name:
                continue
            depths = layer.get("depths", [])
            if depths:
                raw = depths[0].get("values", {}).get("mean")
                if raw is not None:
                    # SoilGrids returns scaled integers; divide by the stated factor
                    factor = layer.get("unit_measure", {}).get("d_factor", 1) or 1
                    values[field_name] = raw / factor
    except Exception:
        pass  # Return nulls on any failure - caller handles gracefully

    return SoilData(source="SoilGrids v2 (ISRIC)", **values)
