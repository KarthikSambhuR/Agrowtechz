import math
from models import PlotCoordinate


def compute_centroid(coords: list[PlotCoordinate]) -> tuple[float, float]:
    """Return (lat, lng) centroid of a polygon."""
    lat = sum(c.lat for c in coords) / len(coords)
    lng = sum(c.lng for c in coords) / len(coords)
    return lat, lng


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance in kilometres between two points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def compute_radius_km(coords: list[PlotCoordinate], centroid_lat: float, centroid_lng: float) -> float:
    """Maximum distance from centroid to any vertex (bounding radius)."""
    if len(coords) <= 1:
        return 0.0
    return max(haversine_km(centroid_lat, centroid_lng, c.lat, c.lng) for c in coords)
