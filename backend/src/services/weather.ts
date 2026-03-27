import { WeatherData } from "../models/types";

const BASE = "https://api.open-meteo.com/v1/forecast";

const DAILY_VARS = [
  "temperature_2m_max",
  "precipitation_sum",
  "rain_sum",
  "windspeed_10m_max",
  "et0_fao_evapotranspiration",
  "uv_index_max",
];

const HOURLY_VARS = [
  "cloudcover",
  "relativehumidity_2m",
  "soil_moisture_0_1cm",
  "soil_moisture_1_3cm",
  "soil_moisture_3_9cm",
  "soil_temperature_0cm",
];

function first(lst: any[]): number | null {
  for (const v of lst || []) {
    if (v !== null && v !== undefined) return Number(v);
  }
  return null;
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const result: any = {
    temperature_2m: null,
    precipitation_sum: null,
    rain_sum: null,
    windspeed_10m_max: null,
    et0_fao_evapotranspiration: null,
    cloud_cover: null,
    relative_humidity: null,
    uv_index_max: null,
    soil_moisture_0_1cm: null,
    soil_moisture_1_3cm: null,
    soil_moisture_3_9cm: null,
    soil_temperature_0cm: null,
    source: "Open-Meteo (free)",
  };

  try {
    const url = new URL(BASE);
    url.searchParams.append("latitude", lat.toString());
    url.searchParams.append("longitude", lng.toString());
    DAILY_VARS.forEach((v) => url.searchParams.append("daily", v));
    HOURLY_VARS.forEach((v) => url.searchParams.append("hourly", v));
    url.searchParams.append("forecast_days", "1");
    url.searchParams.append("timezone", "auto");

    const resp = await fetch(url.toString());
    if (!resp.ok) throw new Error(`Open-Meteo failed: ${resp.status}`);
    const data: any = await resp.json();

    const daily = data.daily || {};
    const hourly = data.hourly || {};

    result.temperature_2m = first(daily.temperature_2m_max);
    result.precipitation_sum = first(daily.precipitation_sum);
    result.rain_sum = first(daily.rain_sum);
    result.windspeed_10m_max = first(daily.windspeed_10m_max);
    result.et0_fao_evapotranspiration = first(daily.et0_fao_evapotranspiration);
    result.uv_index_max = first(daily.uv_index_max);

    result.cloud_cover = first(hourly.cloudcover);
    result.relative_humidity = first(hourly.relativehumidity_2m);
    result.soil_moisture_0_1cm = first(hourly.soil_moisture_0_1cm);
    result.soil_moisture_1_3cm = first(hourly.soil_moisture_1_3cm);
    result.soil_moisture_3_9cm = first(hourly.soil_moisture_3_9cm);
    result.soil_temperature_0cm = first(hourly.soil_temperature_0cm);
  } catch (error) {
    console.error("fetchWeather error:", error);
  }

  return result as WeatherData;
}
