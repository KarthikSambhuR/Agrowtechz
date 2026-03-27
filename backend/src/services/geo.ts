import { PlotCoordinate } from "../models/types";

export function computeCentroid(coords: PlotCoordinate[]): { lat: number; lng: number } {
  const lat = coords.reduce((acc, c) => acc + c.lat, 0) / coords.length;
  const lng = coords.reduce((acc, c) => acc + c.lng, 0) / coords.length;
  return { lat, lng };
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371.0;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeRadiusKm(coords: PlotCoordinate[], centroidLat: number, centroidLng: number): number {
  if (coords.length <= 1) return 0.0;
  return Math.max(...coords.map((c) => haversineKm(centroidLat, centroidLng, c.lat, c.lng)));
}
