import httpx

url = "http://localhost:8000/api/recommendations"
payload = {
    "plot_id": "test-plot",
    "plot_name": "Test Plot",
    "crop": "rice",
    "area_acres": 1.5,
    "coordinates": [
        {"lat": 10.52528, "lng": 76.22565},
        {"lat": 10.52600, "lng": 76.22600},
        {"lat": 10.52500, "lng": 76.22700}
    ],
    "soil_ph": 6.5,
    "soil_health": 80,
    "days_planted": 30,
    "language": "en"
}

try:
    resp = httpx.post(url, json=payload, timeout=30.0)
    print("Status Code:", resp.status_code)
    print("Response Body:", resp.text)
except Exception as e:
    print("Request failed:", e)
