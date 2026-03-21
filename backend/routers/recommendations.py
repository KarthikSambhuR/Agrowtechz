import asyncio
from fastapi import APIRouter, HTTPException
from models import RecommendationRequest, RecommendationResponse, EnvironmentalSnapshot
from services.geo import compute_centroid, compute_radius_km
from services.soil import fetch_soil
from services.weather import fetch_weather
from services.llm import fetch_recommendations
from config import settings

router = APIRouter()


@router.post("/recommendations", response_model=RecommendationResponse)
async def recommendations(req: RecommendationRequest):
    if not req.coordinates:
        raise HTTPException(status_code=422, detail="At least one coordinate is required.")

    # 1. Compute centroid + radius
    centroid_lat, centroid_lng = compute_centroid(req.coordinates)
    radius_km = compute_radius_km(req.coordinates, centroid_lat, centroid_lng)

    # 2. Fetch soil + weather in parallel
    soil_data, weather_data = await asyncio.gather(
        fetch_soil(centroid_lat, centroid_lng),
        fetch_weather(centroid_lat, centroid_lng),
    )

    env = EnvironmentalSnapshot(
        centroid_lat=centroid_lat,
        centroid_lng=centroid_lng,
        radius_km=radius_km,
        soil=soil_data,
        weather=weather_data,
    )

    # 3. Call LLM
    try:
        recommendation_text = await fetch_recommendations(req, env)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {exc}") from exc

    return RecommendationResponse(
        plot_id=req.plot_id,
        plot_name=req.plot_name,
        crop=req.crop,
        environmental_snapshot=env,
        recommendations=recommendation_text,
        model_used=settings.nvidia_model,
        data_sources=["SoilGrids v2 (ISRIC)", "Open-Meteo", f"NVIDIA NIM / {settings.nvidia_model}"],
    )
