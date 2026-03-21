# Agrowtechz Backend API

FastAPI-based backend that provides AI-powered farm recommendations using:
- **Kimi K2.5** (via NVIDIA NIM) — LLM for analysis
- **SoilGrids REST v2** (ISRIC) — free soil property data (no API key)
- **Open-Meteo** — free weather + soil moisture/temperature data (no API key)

---

## Quick Start

### 1. Configure your API key

Open `backend/.env` and replace the placeholder with your real NVIDIA NIM key:

```
NVIDIA_API_KEY=nvapi-YOUR_REAL_KEY_HERE
```

Get a free key at: **https://build.nvidia.com**

### 2. Install dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 3. Start the server

```powershell
python main.py
```

The API will be available at `http://localhost:8000`

- **Interactive docs (Swagger UI):** http://localhost:8000/docs
- **Health check:** http://localhost:8000/api/health

---

## API Endpoints

### `GET /api/health`
Returns server status and configured model name.

### `POST /api/recommendations`
The main endpoint. Accepts plot polygon + crop metadata, fetches real
environmental data, and returns an AI recommendation.

**Request body:**
```json
{
  "plot_id": "plot-12345",
  "plot_name": "North Rice Plot",
  "crop": "rice",
  "area_acres": 2.5,
  "coordinates": [
    { "lat": 10.5276, "lng": 76.2144 },
    { "lat": 10.5290, "lng": 76.2160 },
    { "lat": 10.5265, "lng": 76.2170 }
  ],
  "soil_ph": 6.2,
  "soil_health": 82,
  "days_planted": 45,
  "language": "en"
}
```

**Response:** JSON with `recommendations` (markdown), `environmental_snapshot` (soil + weather data), and `model_used`.

---

## Architecture

```
backend/
├── main.py                    ← FastAPI app entry point
├── config.py                  ← Env-based settings (pydantic-settings)
├── models.py                  ← Pydantic request/response models
├── .env                       ← Your API keys (gitignored)
├── .env.example               ← Template (safe to commit)
├── requirements.txt
├── services/
│   ├── geo.py                 ← Centroid + radius computation
│   ├── soil.py                ← SoilGrids v2 client (free)
│   ├── weather.py             ← Open-Meteo client (free)
│   └── llm.py                 ← NVIDIA NIM / Kimi K2.5 client
└── routers/
    ├── health.py              ← GET /api/health
    └── recommendations.py    ← POST /api/recommendations
```

## Data Sources

| Source | Data | Cost |
|---|---|---|
| [SoilGrids v2 (ISRIC)](https://soilgrids.org) | pH, organic carbon, N, clay/sand/silt, bulk density, CEC | **Free, no key** |
| [Open-Meteo](https://open-meteo.com) | Temperature, humidity, precipitation, UV, ET₀, soil moisture (3 depths), soil temperature | **Free, no key** |
| [NVIDIA NIM](https://build.nvidia.com) | Kimi K2.5 LLM inference | **Free tier available** |

## How Spatial Averaging Works

The API takes all vertex `coordinates` of the plot polygon and:
1. Computes the **centroid** (arithmetic mean lat/lng)
2. Computes the **bounding radius** (max Haversine distance from centroid to any vertex)

Both SoilGrids and Open-Meteo queries use this centroid point, so you get data representative of the entire plot, not just one corner.
