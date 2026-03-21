from pydantic import BaseModel


# ── Request ────────────────────────────────────────────────────────────────────

class PlotCoordinate(BaseModel):
    lat: float
    lng: float


class RecommendationRequest(BaseModel):
    plot_id: str
    plot_name: str
    crop: str
    area_acres: float
    coordinates: list[PlotCoordinate]
    soil_ph: float | None = None
    soil_health: float | None = None
    days_planted: int | None = None
    language: str = "en"


# ── Response ───────────────────────────────────────────────────────────────────

class SoilData(BaseModel):
    ph: float | None
    organic_carbon: float | None
    nitrogen: float | None
    clay: float | None
    sand: float | None
    silt: float | None
    bulk_density: float | None
    cation_exchange: float | None
    source: str


class WeatherData(BaseModel):
    temperature_2m: float | None
    precipitation_sum: float | None
    rain_sum: float | None
    windspeed_10m_max: float | None
    et0_fao_evapotranspiration: float | None
    cloud_cover: float | None
    relative_humidity: float | None
    uv_index_max: float | None
    soil_moisture_0_1cm: float | None
    soil_moisture_1_3cm: float | None
    soil_moisture_3_9cm: float | None
    soil_temperature_0cm: float | None
    source: str


class EnvironmentalSnapshot(BaseModel):
    centroid_lat: float
    centroid_lng: float
    radius_km: float
    soil: SoilData
    weather: WeatherData


class RecommendationResponse(BaseModel):
    plot_id: str
    plot_name: str
    crop: str
    environmental_snapshot: EnvironmentalSnapshot
    recommendations: str
    model_used: str
    data_sources: list[str]
