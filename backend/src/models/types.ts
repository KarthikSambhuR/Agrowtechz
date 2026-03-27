export interface PlotCoordinate {
  lat: number;
  lng: number;
}

export interface RecommendationRequest {
  plot_id: string;
  plot_name: string;
  crop: string;
  area_acres: number;
  coordinates: PlotCoordinate[];
  soil_ph?: number;
  soil_health?: number;
  days_planted?: number;
  plant_count?: number;
  daily_action?: string;
  language?: string;
}

export interface SoilData {
  ph: number | null;
  organic_carbon: number | null;
  nitrogen: number | null;
  clay: number | null;
  sand: number | null;
  silt: number | null;
  bulk_density: number | null;
  cation_exchange: number | null;
  source: string;
}

export interface WeatherData {
  temperature_2m: number | null;
  precipitation_sum: number | null;
  rain_sum: number | null;
  windspeed_10m_max: number | null;
  et0_fao_evapotranspiration: number | null;
  cloud_cover: number | null;
  relative_humidity: number | null;
  uv_index_max: number | null;
  soil_moisture_0_1cm: number | null;
  soil_moisture_1_3cm: number | null;
  soil_moisture_3_9cm: number | null;
  soil_temperature_0cm: number | null;
  source: string;
}

export interface EnvironmentalSnapshot {
  centroid_lat: number;
  centroid_lng: number;
  radius_km: number;
  soil: SoilData;
  weather: WeatherData;
}

export interface RecommendationResponse {
  plot_id: string;
  plot_name: string;
  crop: string;
  environmental_snapshot: EnvironmentalSnapshot;
  recommendations: string;
  model_used: string;
  data_sources: string[];
}
