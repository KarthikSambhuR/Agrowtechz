import { SoilData } from "../models/types";

const BASE = "https://rest.isric.org/soilgrids/v2.0/properties/query";

const PROP_MAP: Record<string, keyof SoilData> = {
  phh2o: "ph",
  oc: "organic_carbon",
  nitrogen: "nitrogen",
  clay: "clay",
  sand: "sand",
  silt: "silt",
  bdod: "bulk_density",
  cec: "cation_exchange",
};

export async function fetchSoil(lat: number, lng: number): Promise<SoilData> {
  const result: any = {
    ph: null,
    organic_carbon: null,
    nitrogen: null,
    clay: null,
    sand: null,
    silt: null,
    bulk_density: null,
    cation_exchange: null,
    source: "SoilGrids v2 (ISRIC)",
  };

  try {
    const url = new URL(BASE);
    url.searchParams.append("lon", lng.toString());
    url.searchParams.append("lat", lat.toString());
    Object.keys(PROP_MAP).forEach((p) => url.searchParams.append("property", p));
    url.searchParams.append("depth", "0-5cm");
    url.searchParams.append("value", "mean");

    const resp = await fetch(url.toString());
    if (!resp.ok) throw new Error(`SoilGrids failed: ${resp.status}`);
    const data: any = await resp.json();

    const layers = data?.properties?.layers || [];
    for (const layer of layers) {
      const propName = layer.name;
      const fieldName = PROP_MAP[propName];
      if (!fieldName) continue;

      const depths = layer.depths || [];
      if (depths.length > 0) {
        const raw = depths[0].values?.mean;
        if (raw !== undefined && raw !== null) {
          const factor = layer.unit_measure?.d_factor || 1;
          result[fieldName] = raw / factor;
        }
      }
    }
  } catch (error) {
    console.error("fetchSoil error:", error);
  }

  return result as SoilData;
}
