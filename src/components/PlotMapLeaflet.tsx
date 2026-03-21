"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Trash2, MapPin, Navigation, Square, Pentagon, PenLine, Pencil, MousePointer, RotateCcw, Check } from "lucide-react";

import { useApp } from "@/context/AppContext";
import { tr } from "@/lib/translations";

export interface PlotPoint {
  lat: number;
  lng: number;
}

export type DrawingTool = "polygon" | "rectangle" | "freehand" | "pointer";

interface Props {
  onPlotChange: (points: PlotPoint[], areaAcres: number | null) => void;
  initialPoints?: PlotPoint[];
  showToolPanel?: boolean;
  activeTool?: DrawingTool;
  onToolChange?: (tool: DrawingTool) => void;
}

// Haversine formula — area of polygon in acres
function polygonAreaAcres(pts: PlotPoint[]): number {
  if (pts.length < 3) return 0;
  const R = 6371000;
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
  return sqm / 4046.86;
}

const TOOL_DEFINITIONS = [
  { id: "pointer" as DrawingTool, icon: MousePointer, label: "Select / Move", desc: "Pan and inspect the map" },
  { id: "polygon" as DrawingTool, icon: Pentagon, label: "Polygon Tool", desc: "Click to place vertices" },
  { id: "rectangle" as DrawingTool, icon: Square, label: "Rectangle Tool", desc: "Drag to draw rectangle" },
  { id: "freehand" as DrawingTool, icon: PenLine, label: "Pen Tool", desc: "Draw continuous shape by dragging" },
];

export default function PlotMapLeaflet({
  onPlotChange,
  initialPoints = [],
  showToolPanel = true,
  activeTool: externalTool,
  onToolChange: externalOnToolChange,
}: Props) {
  const { language } = useApp();
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<{
    markers: any[];
    lines: any[];
    polygon: any;
    previewRect: any;
    freehandLine: any;
  }>({ markers: [], lines: [], polygon: null, previewRect: null, freehandLine: null });

  const pointsRef = useRef<PlotPoint[]>(initialPoints);
  const drawingStateRef = useRef<{
    isDrawingRect: boolean;
    rectStart: { lat: number; lng: number } | null;
    isFreehand: boolean;
    freehandPoints: PlotPoint[];
  }>({ isDrawingRect: false, rectStart: null, isFreehand: false, freehandPoints: [] });

  const [pointCount, setPointCount] = useState(initialPoints.length);
  const [area, setArea] = useState<number | null>(initialPoints.length >= 3 ? polygonAreaAcres(initialPoints) : null);
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<"idle" | "placing" | "done">(initialPoints.length >= 3 ? "done" : "idle");
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);
  
  const [internalTool, setInternalTool] = useState<DrawingTool>("polygon");
  const [hoveredTool, setHoveredTool] = useState<DrawingTool | null>(null);

  const activeTool = externalTool ?? internalTool;
  const setActiveTool = useCallback((t: DrawingTool) => {
    if (externalOnToolChange) externalOnToolChange(t);
    else setInternalTool(t);
  }, [externalOnToolChange]);

  // Keep stale closure ref of activeTool for map events
  const activeToolRef = useRef<DrawingTool>(activeTool);
  useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);

  function makeNumberIcon(L: any, n: number) {
    return L.divIcon({
      className: "",
      html: `<div style="
        width:26px;height:26px;border-radius:50%;
        background:#00A67E;color:#fff;
        font-weight:900;font-size:12px;
        display:flex;align-items:center;justify-content:center;
        border:2.5px solid #fff;
        box-shadow:0 3px 10px rgba(0,166,126,0.5);
        font-family:'Inter',sans-serif;
      ">${n}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  }

  function clearLayers(L: any, map: any) {
    const lr = layerRef.current;
    lr.markers.forEach((m) => map.removeLayer(m));
    lr.lines.forEach((m) => map.removeLayer(m));
    if (lr.polygon) map.removeLayer(lr.polygon);
    if (lr.previewRect) map.removeLayer(lr.previewRect);
    if (lr.freehandLine) map.removeLayer(lr.freehandLine);
    lr.markers = [];
    lr.lines = [];
    lr.polygon = null;
    lr.previewRect = null;
    lr.freehandLine = null;
  }

  function renderCurrentPlot(L: any, map: any) {
    clearLayers(L, map);
    const pts = pointsRef.current;
    const lr = layerRef.current;
    if (pts.length === 0) return;

    // Numbered markers
    pts.forEach((p, i) => {
      const m = L.marker([p.lat, p.lng], { icon: makeNumberIcon(L, i + 1), zIndexOffset: 1000 }).addTo(map);
      lr.markers.push(m);
    });

    // Connection lines
    if (pts.length >= 2) {
      const latlngs = pts.map((p) => [p.lat, p.lng]);
      const line = L.polyline(latlngs, { color: "#00A67E", weight: 2.5, dashArray: "8 5", opacity: 0.85 }).addTo(map);
      lr.lines.push(line);
    }

    // Preview polygon
    if (pts.length >= 3) {
      const latlngs = pts.map((p) => [p.lat, p.lng]);
      lr.polygon = L.polygon(latlngs, {
        color: "#00A67E", weight: 2, fillColor: "#00A67E", fillOpacity: 0.15,
      }).addTo(map);
    }
  }

  function finalizePlot(L: any, map: any, pts: PlotPoint[]) {
    clearLayers(L, map);
    const lr = layerRef.current;
    const latlngs = pts.map((p) => [p.lat, p.lng]);

    lr.polygon = L.polygon(latlngs, {
      color: "#00A67E", weight: 3, fillColor: "#00A67E", fillOpacity: 0.2,
    }).addTo(map);

    pts.forEach((p, i) => {
      const m = L.marker([p.lat, p.lng], { icon: makeNumberIcon(L, i + 1), zIndexOffset: 1000 }).addTo(map);
      lr.markers.push(m);
    });

    if (pts.length > 0) {
      map.fitBounds(lr.polygon.getBounds(), { padding: [80, 80] });
    }

    const ac = polygonAreaAcres(pts);
    setArea(ac);
    setStatus("done");
    setPointCount(pts.length);
    onPlotChange(pts, ac);
  }

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    let mapInstance: any = null;

    import("leaflet").then((Lmod) => {
      const L = (Lmod as any).default ?? Lmod;

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
      mapInstance = map;
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Render initial points if any
      if (initialPoints.length >= 3) {
        pointsRef.current = initialPoints;
        finalizePlot(L, map, initialPoints);
      }

      // ─── CLICK handler (polygon) ───
      map.on("click", (e: any) => {
        const tool = activeToolRef.current;
        if (tool === "pointer") return;
        if (tool === "rectangle") return; // rectangle uses mousedown/up
        if (tool === "freehand") return;  // freehand uses mousemove

        const { lat, lng } = e.latlng;

        if (tool === "polygon") {
          // Double-click finalizes polygon
          if ((e.originalEvent as MouseEvent).detail === 2 && pointsRef.current.length >= 3) {
            finalizePlot(L, map, pointsRef.current);
            return;
          }
          if (statusRef.current === "done") {
             // Reset drawing if clicking again while done
             handleResetInternal(L, map);
             pointsRef.current = [{ lat, lng }];
             setPointCount(1);
             setStatus("placing");
             renderCurrentPlot(L, map);
             onPlotChange(pointsRef.current, null);
             return;
          }

          pointsRef.current.push({ lat, lng });
          const n = pointsRef.current.length;
          setPointCount(n);
          setStatus("placing");
          renderCurrentPlot(L, map);
          onPlotChange(pointsRef.current, n >= 3 ? polygonAreaAcres(pointsRef.current) : null);
        }
      });

      // ─── DOUBLE CLICK → finalize polygon ───
      map.on("dblclick", (e: any) => {
        const tool = activeToolRef.current;
        if (tool === "polygon" && pointsRef.current.length >= 3) {
          finalizePlot(L, map, pointsRef.current);
        }
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
      });

      // ─── RECTANGLE: mousedown + mousemove + mouseup ───
      let rectGhost: any = null;
      let rectStartLatLng: any = null;

      map.on("mousedown", (e: any) => {
        if (activeToolRef.current !== "rectangle") return;
        if (drawingStateRef.current.isDrawingRect) return;
        if (statusRef.current === "done") handleResetInternal(L, map);
        drawingStateRef.current.isDrawingRect = true;
        rectStartLatLng = e.latlng;
        map.dragging.disable();
      });

      map.on("mousemove", (e: any) => {
        if (activeToolRef.current === "rectangle" && drawingStateRef.current.isDrawingRect && rectStartLatLng) {
          if (rectGhost) map.removeLayer(rectGhost);
          const bounds = L.latLngBounds(rectStartLatLng, e.latlng);
          rectGhost = L.rectangle(bounds, {
            color: "#00A67E", weight: 2, fillColor: "#00A67E", fillOpacity: 0.1, dashArray: "6 4",
          }).addTo(map);
        }

        if (activeToolRef.current === "freehand" && drawingStateRef.current.isFreehand) {
          drawingStateRef.current.freehandPoints.push({ lat: e.latlng.lat, lng: e.latlng.lng });
          const pts = drawingStateRef.current.freehandPoints;
          if (layerRef.current.freehandLine) map.removeLayer(layerRef.current.freehandLine);
          layerRef.current.freehandLine = L.polyline(
            pts.map(p => [p.lat, p.lng]),
            { color: "#00A67E", weight: 2.5, opacity: 0.85, dashArray: "none" }
          ).addTo(map);
        }
      });

      map.on("mouseup", (e: any) => {
        if (activeToolRef.current === "rectangle" && drawingStateRef.current.isDrawingRect && rectStartLatLng) {
          if (rectGhost) { map.removeLayer(rectGhost); rectGhost = null; }
          map.dragging.enable();
          drawingStateRef.current.isDrawingRect = false;

          const sw = rectStartLatLng;
          const ne = e.latlng;
          const corners: PlotPoint[] = [
            { lat: sw.lat, lng: sw.lng },
            { lat: sw.lat, lng: ne.lng },
            { lat: ne.lat, lng: ne.lng },
            { lat: ne.lat, lng: sw.lng },
          ];
          pointsRef.current = corners;
          rectStartLatLng = null;
          finalizePlot(L, map, corners);
        }

        if (activeToolRef.current === "freehand" && drawingStateRef.current.isFreehand) {
          drawingStateRef.current.isFreehand = false;
          const pts = drawingStateRef.current.freehandPoints;
          map.dragging.enable();
          if (pts.length >= 3) {
            // Simplify: sample every Nth point for cleaner polygon
            const step = Math.max(1, Math.floor(pts.length / 40));
            const sampled = pts.filter((_, i) => i % step === 0);
            pointsRef.current = sampled;
            drawingStateRef.current.freehandPoints = [];
            if (layerRef.current.freehandLine) { map.removeLayer(layerRef.current.freehandLine); layerRef.current.freehandLine = null; }
            finalizePlot(L, map, sampled);
          } else {
            drawingStateRef.current.freehandPoints = [];
          }
        }
      });

      // Freehand: mousedown starts capture
      map.on("mousedown", (e: any) => {
        if (activeToolRef.current !== "freehand") return;
        if (statusRef.current === "done") handleResetInternal(L, map);
        drawingStateRef.current.isFreehand = true;
        drawingStateRef.current.freehandPoints = [{ lat: e.latlng.lat, lng: e.latlng.lng }];
        map.dragging.disable();
      });
    });

    return () => {
      if (mapInstance) {
        mapInstance.off();
        mapInstance.remove();
        mapInstance = null;
        mapRef.current = null;
        if (divRef.current) {
          (divRef.current as any)._leaflet_id = null;
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleResetInternal(L: any, map: any) {
      clearLayers(L, map);
      pointsRef.current = [];
      drawingStateRef.current = { isDrawingRect: false, rectStart: null, isFreehand: false, freehandPoints: [] };
      setPointCount(0);
      setArea(null);
      setStatus("idle");
      onPlotChange([], null);
  }

  // Update cursor style based on active tool
  useEffect(() => {
    const container = divRef.current;
    if (!container) return;
    const cursors: Record<DrawingTool, string> = {
      pointer: "grab",
      polygon: "crosshair",
      rectangle: "crosshair",
      freehand: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%2300A67E' d='M21 2L3 9l7 4 4 7z'/%3E%3C/svg%3E\") 0 20, crosshair",
    };
    container.style.cursor = cursors[activeTool] || "crosshair";
    // Also enable/disable map dragging
    if (mapRef.current) {
      if (activeTool === "pointer") mapRef.current.dragging.enable();
      else mapRef.current.dragging.disable(); // Only allow map dragging if pointer
    }
  }, [activeTool]);

  function handleReset() {
    if (!mapRef.current) return;
    import("leaflet").then((Lmod) => {
      const L = (Lmod as any).default ?? Lmod;
      handleResetInternal(L, mapRef.current);
    });
  }

  function handleLocate() {
    if (!mapRef.current || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 17);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  function handleConfirmPolygon() {
    if (!mapRef.current || pointsRef.current.length < 3) return;
    import("leaflet").then((Lmod) => {
      const L = (Lmod as any).default ?? Lmod;
      finalizePlot(L, mapRef.current, pointsRef.current);
    });
  }

  const toolStatusText: Record<DrawingTool, string> = {
    pointer: tr("Pan and inspect the map. Toggle tools to modify.", language),
    polygon: status === "done" ? `${tr("Polygon confirmed", language)} — ${area?.toFixed(2)} ${tr("acres", language)}. ${tr("Click to restart", language)}.` : pointCount > 0 ? `${pointCount} ${pointCount > 1 ? tr("points placed", language) : tr("point placed", language)} (${tr("Double click to finish", language)})` : tr("Click map to trace points. Double click at the end.", language),
    rectangle: status === "done" ? `${tr("Rectangle confirmed", language)} — ${area?.toFixed(2)} ${tr("acres", language)}` : tr("Hold and drag to draw a rectangle area.", language),
    freehand: status === "done" ? `${tr("Freehand confirmed", language)} — ${area?.toFixed(2)} ${tr("acres", language)}` : tr("Hold and drag on map to draw. Release to finish.", language),
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Map */}
      <div ref={divRef} style={{ width: "100%", height: "100%" }} />
      
      {/* Explicit Floating Hint for touch users who don't see tooltips */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
        background: "rgba(32,33,36,0.9)", color: "#FFF", padding: "10px 20px",
        borderRadius: 100, fontSize: 13, fontWeight: 700, pointerEvents: "none", zIndex: 1000,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)", textAlign: "center"
      }}>
        {toolStatusText[activeTool]}
      </div>

      {/* ── Right-side Tools Panel ── */}
      {showToolPanel && (
        <div style={{
          position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)",
          zIndex: 1000, display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{
            background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(0,166,126,0.15)", borderRadius: 18,
            padding: "12px 8px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            display: "flex", flexDirection: "column", gap: 4, alignItems: "center",
          }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: "#00A67E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, writingMode: "horizontal-tb" }}>
              {tr("TOOLS", language)}
            </div>
            {TOOL_DEFINITIONS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTool === t.id;
              return (
                <div key={t.id} style={{ position: "relative" }}>
                  <button
                    id={`tool-${t.id}`}
                    onClick={() => setActiveTool(t.id)}
                    onMouseEnter={() => setHoveredTool(t.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                    title={t.label}
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      border: isActive ? "2px solid #00A67E" : "2px solid transparent",
                      background: isActive ? "rgba(0,166,126,0.12)" : "transparent",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.18s ease",
                      color: isActive ? "#00A67E" : "#5F6368",
                      position: "relative",
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <div style={{
                        position: "absolute", left: -3, top: "50%", transform: "translateY(-50%)",
                        width: 3, height: 20, borderRadius: 4, background: "#00A67E",
                      }} />
                    )}
                  </button>
                  {/* Tooltip */}
                  {hoveredTool === t.id && (
                    <div style={{
                      position: "absolute", right: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(32,33,36,0.92)", color: "#FFF",
                      borderRadius: 10, padding: "8px 12px", whiteSpace: "nowrap",
                      fontSize: 12, fontWeight: 700, pointerEvents: "none",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      zIndex: 2000,
                    }}>
                      <div>{tr(t.label, language)}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, marginTop: 2 }}>{tr(t.desc, language)}</div>
                      {/* Arrow */}
                      <div style={{
                        position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)",
                        width: 0, height: 0,
                        borderLeft: "6px solid rgba(32,33,36,0.92)",
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                      }} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Divider */}
            <div style={{ width: 28, height: 1, background: "rgba(0,166,126,0.15)", margin: "4px 0" }} />

            {/* Locate */}
            <button
               onClick={handleLocate}
               title={tr("My Location", language)}
               style={{
                 width: 44, height: 44, borderRadius: 12,
                 border: "2px solid transparent", background: "transparent",
                 cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                 color: locating ? "#00A67E" : "#5F6368"
               }}
            >
               <Navigation size={18} />
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              title={tr("Reset drawing", language)}
              style={{
                width: 44, height: 44, borderRadius: 12,
                border: "2px solid transparent",
                background: pointCount > 0 ? "rgba(239,68,68,0.08)" : "transparent",
                cursor: pointCount > 0 ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s ease",
                color: pointCount > 0 ? "#EF4444" : "#BDC1C6",
                opacity: pointCount > 0 ? 1 : 0.5,
              }}
            >
              <RotateCcw size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
