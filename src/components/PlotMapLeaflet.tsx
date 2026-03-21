"use client";
import { useEffect, useRef, useState } from "react";
import { Trash2, MapPin, Navigation } from "lucide-react";

export interface PlotPoint {
  lat: number;
  lng: number;
}

interface Props {
  onPlotChange: (points: PlotPoint[], areaAcres: number | null) => void;
}

// Haversine formula — area of polygon in acres
function polygonAreaAcres(pts: PlotPoint[]): number {
  if (pts.length < 3) return 0;
  // Shoelace in metres² using equirectangular approximation
  const R = 6371000; // metres
  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = (pts[i].lng * Math.PI / 180) * R * Math.cos((pts[i].lat * Math.PI / 180));
    const yi = (pts[i].lat * Math.PI / 180) * R;
    const xj = (pts[j].lng * Math.PI / 180) * R * Math.cos((pts[j].lat * Math.PI / 180));
    const yj = (pts[j].lat * Math.PI / 180) * R;
    area += xi * yj - xj * yi;
  }
  const sqm = Math.abs(area) / 2;
  return sqm / 4046.86; // to acres
}

export default function PlotMapLeaflet({ onPlotChange }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<{
    markers: any[];
    lines: any[];
    polygon: any;
    labelMarkers: any[];
  }>({ markers: [], lines: [], polygon: null, labelMarkers: [] });
  const pointsRef = useRef<PlotPoint[]>([]);
  const [pointCount, setPointCount] = useState(0);
  const [area, setArea] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<"idle" | "placing" | "done">("idle");

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    import("leaflet").then((Lmod) => {
      const L = (Lmod as any).default ?? Lmod;

      // Fix broken default icons in Next.js/webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(divRef.current!, {
        center: [10.5276, 76.2144],
        zoom: 14,
        doubleClickZoom: false,
        zoomControl: false,
      });

      // ── OpenStreetMap tiles ──
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;

      map.on("click", (e: any) => {
        // Block clicks once 4 points are placed
        if (pointsRef.current.length >= 4) return;

        const { lat, lng } = e.latlng;
        pointsRef.current.push({ lat, lng });
        renderPlot(L, map);

        const n = pointsRef.current.length;
        setPointCount(n);

        if (n === 4) {
          finalizePlot(L, map);
        } else {
          setStatus("placing");
        }
      });
    });

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  function makeNumberIcon(L: any, n: number) {
    return L.divIcon({
      className: "",
      html: `
        <div style="
          width:28px;height:28px;border-radius:50%;
          background:#00A67E;color:#fff;
          font-weight:900;font-size:13px;
          display:flex;align-items:center;justify-content:center;
          border:3px solid #fff;
          box-shadow:0 3px 10px rgba(0,166,126,0.5);
          font-family:'Roboto',sans-serif;
        ">${n}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  function clearLayers(L: any, map: any) {
    const lr = layerRef.current;
    lr.markers.forEach((m) => map.removeLayer(m));
    lr.lines.forEach((m) => map.removeLayer(m));
    lr.labelMarkers.forEach((m) => map.removeLayer(m));
    if (lr.polygon) map.removeLayer(lr.polygon);
    lr.markers = [];
    lr.lines = [];
    lr.labelMarkers = [];
    lr.polygon = null;
  }

  function renderPlot(L: any, map: any) {
    clearLayers(L, map);
    const pts = pointsRef.current;
    const lr = layerRef.current;

    // Draw markers 1-4
    pts.forEach((p, i) => {
      const m = L.marker([p.lat, p.lng], { icon: makeNumberIcon(L, i + 1), zIndexOffset: 1000 }).addTo(map);
      lr.markers.push(m);
    });

    // Draw lines between placed points
    if (pts.length >= 2) {
      const latlngs = pts.map((p) => [p.lat, p.lng]);
      const line = L.polyline(latlngs, {
        color: "#00A67E", weight: 2.5, dashArray: "8 5", opacity: 0.8,
      }).addTo(map);
      lr.lines.push(line);
    }

    // Preview filled polygon once we have 3+
    if (pts.length >= 3) {
      const latlngs = pts.map((p) => [p.lat, p.lng]);
      lr.polygon = L.polygon(latlngs, {
        color: "#00A67E", weight: 0, fillColor: "#00A67E", fillOpacity: 0.12,
      }).addTo(map);
    }
  }

  function finalizePlot(L: any, map: any) {
    clearLayers(L, map);
    const pts = pointsRef.current;
    const lr = layerRef.current;
    const latlngs = pts.map((p) => [p.lat, p.lng]);

    // Solid polygon
    lr.polygon = L.polygon(latlngs, {
      color: "#00A67E", weight: 3, fillColor: "#00A67E", fillOpacity: 0.18,
    }).addTo(map);

    // Numbered corner markers
    pts.forEach((p, i) => {
      const m = L.marker([p.lat, p.lng], { icon: makeNumberIcon(L, i + 1), zIndexOffset: 1000 }).addTo(map);
      lr.markers.push(m);
    });

    // Fit to bounds
    map.fitBounds(lr.polygon.getBounds(), { padding: [80, 80] });

    const ac = polygonAreaAcres(pts);
    setArea(ac);
    setStatus("done");
    onPlotChange(pts, ac);
  }

  function handleReset() {
    if (!mapRef.current) return;
    import("leaflet").then((Lmod) => {
      const L = (Lmod as any).default ?? Lmod;
      clearLayers(L, mapRef.current);
      pointsRef.current = [];
      setPointCount(0);
      setArea(null);
      setStatus("idle");
      onPlotChange([], null);
    });
  }

  function handleLocate() {
    if (!mapRef.current || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 16);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  /* ── UI ── */
  const instructionText =
    status === "idle"
      ? "Click 4 corners of your field to define the plot boundary."
      : status === "placing"
      ? pointCount < 4
        ? `Point ${pointCount} placed — click point ${pointCount + 1} (${4 - pointCount} remaining)`
        : "Finalizing…"
      : "✓ 4-point boundary confirmed. Review and click Confirm.";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* The actual map */}
      <div ref={divRef} style={{ width: "100%", height: "100%" }} />

      {/* ── top-left info card ── */}
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(14px)",
        border: "1px solid rgba(0,166,126,0.15)", borderRadius: 16,
        padding: "16px 20px", minWidth: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}>
        {/* Point counter dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: n <= pointCount ? "#00A67E" : "#F0F7F4",
              border: `2px solid ${n <= pointCount ? "#00A67E" : "#C8E0D9"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 900,
              color: n <= pointCount ? "#FFF" : "#8AA59C",
              transition: "all 0.25s ease",
            }}>
              {n <= pointCount ? "✓" : n}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dim)", lineHeight: 1.4 }}>
          {instructionText}
        </div>

        {area !== null && (
          <div style={{
            marginTop: 12, paddingTop: 12,
            borderTop: "1px solid rgba(0,166,126,0.15)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Calculated Area</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#00A67E", marginTop: 2 }}>
              {area.toFixed(2)} <span style={{ fontSize: 13, color: "var(--text-dim)" }}>acres</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
              ≈ {(area * 0.4047).toFixed(3)} ha
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            onClick={handleLocate}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid var(--border-line)",
              background: "#FFF", cursor: "pointer", fontSize: 12, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              color: "var(--text-dim)",
            }}
          >
            <Navigation size={14} color={locating ? "#00A67E" : undefined} />
            {locating ? "Locating…" : "My Location"}
          </button>

          {pointCount > 0 && (
            <button
              onClick={handleReset}
              style={{
                padding: "9px 14px", borderRadius: 10, border: "1px solid #FBCFCF",
                background: "#FFF9F9", cursor: "pointer", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6, color: "#EF4444",
              }}
            >
              <Trash2 size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── bottom instruction overlay ── */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(0,166,126,0.92)", backdropFilter: "blur(8px)",
        color: "#FFF", borderRadius: 10, padding: "10px 20px",
        fontSize: 12, fontWeight: 800, letterSpacing: "0.04em",
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 4px 16px rgba(0,166,126,0.3)",
        pointerEvents: "none",
      }}>
        <MapPin size={14} />
        {status === "done"
          ? `PLOT CONFIRMED — ${area?.toFixed(2)} ACRES`
          : `CLICK ${4 - pointCount} MORE POINT${4 - pointCount !== 1 ? "S" : ""} TO CLOSE POLYGON`}
      </div>

      {/* ── legend dots ── */}
      <div style={{
        position: "absolute", top: 16, right: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.95)", borderRadius: 10,
        padding: "10px 14px", border: "1px solid var(--border-line)",
        boxShadow: "var(--shadow-sm)", fontSize: 11, fontWeight: 700, color: "var(--text-dim)",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00A67E" }} />
          Plot corners
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 24, height: 3, background: "#00A67E", borderRadius: 2, opacity: 0.5 }} />
          Boundary
        </div>
      </div>
    </div>
  );
}
