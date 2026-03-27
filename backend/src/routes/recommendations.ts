import { Hono } from "hono";
import { RecommendationRequest, RecommendationResponse, EnvironmentalSnapshot } from "../models/types";
import { computeCentroid, computeRadiusKm } from "../services/geo";
import { fetchSoil } from "../services/soil";
import { fetchWeather } from "../services/weather";
import { fetchRecommendations } from "../services/llm";

const recommendations = new Hono<{
  Bindings: {
    NVIDIA_MODEL: string;
    NVIDIA_BASE_URL: string;
    NVIDIA_API_KEY: string;
  };
}>();

recommendations.post("/", async (c) => {
  const req = await c.req.json<RecommendationRequest>();

  if (!req.coordinates || req.coordinates.length === 0) {
    return c.json({ error: "At least one coordinate is required." }, 422);
  }

  // 1. Compute centroid + radius
  const { lat, lng } = computeCentroid(req.coordinates);
  const radiusKm = computeRadiusKm(req.coordinates, lat, lng);

  // 2. Fetch soil + weather in parallel
  const [soilData, weatherData] = await Promise.all([fetchSoil(lat, lng), fetchWeather(lat, lng)]);

  const env: EnvironmentalSnapshot = {
    centroid_lat: lat,
    centroid_lng: lng,
    radius_km: radiusKm,
    soil: soilData,
    weather: weatherData,
  };

  // 3. Call LLM
  try {
    const recommendationText = await fetchRecommendations(
      req,
      env,
      c.env.NVIDIA_MODEL,
      c.env.NVIDIA_BASE_URL,
      c.env.NVIDIA_API_KEY
    );

    const response: RecommendationResponse = {
      plot_id: req.plot_id,
      plot_name: req.plot_name,
      crop: req.crop,
      environmental_snapshot: env,
      recommendations: recommendationText,
      model_used: c.env.NVIDIA_MODEL,
      data_sources: ["SoilGrids v2 (ISRIC)", "Open-Meteo", `NVIDIA NIM / ${c.env.NVIDIA_MODEL}`],
    };

    return c.json(response);
  } catch (error: any) {
    console.error("Recommendation error:", error);
    return c.json({ error: `LLM call failed: ${error.message}` }, 502);
  }
});

export default recommendations;
