"use client";
import { useApp, CROP_PROFILES } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import {
  fetchRecommendations,
  checkBackendHealth,
  RecommendationResponse,
} from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, RefreshCw, AlertTriangle, Wifi, WifiOff,
  Thermometer, Droplets, Wind, CloudRain, Sprout,
  FlaskConical, Layers, Sun, ChevronRight, Copy, Check
} from "lucide-react";
import Image from "next/image";

// ─── Markdown renderer (simple, no external dep) ─────────────────────────────
function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} style={{ fontSize: 22, fontWeight: 900, color: "var(--text-main)", marginTop: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {line.replace("# ", "")}
        </h1>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={i} style={{ fontWeight: 800, color: "var(--text-main)", marginTop: 16, marginBottom: 4 }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6, paddingLeft: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-primary)", marginTop: 8, flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, fontWeight: 500 }}>
            {renderInline(line.replace(/^[-*] /, ""))}
          </span>
        </div>
      );
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6, paddingLeft: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%", background: "var(--accent-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "var(--accent-primary)", flexShrink: 0, marginTop: 2
          }}>{num}</div>
          <span style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, fontWeight: 500 }}>
            {renderInline(line.replace(/^\d+\. /, ""))}
          </span>
        </div>
      );
    } else if (line.startsWith("---")) {
      elements.push(<div key={i} style={{ height: 1, background: "var(--border-line)", margin: "16px 0" }} />);
    } else if (line.startsWith("|")) {
      // Skip table lines for simplicity (they'll be caught by raw block)
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
    } else {
      elements.push(
        <p key={i} style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, fontWeight: 500 }}>
          {renderInline(line)}
        </p>
      );
    }
  });

  return <div>{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Bold text **...**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "var(--text-main)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

// ─── Env data card ────────────────────────────────────────────────────────────
function DataPill({
  icon, label, value, unit, color = "var(--accent-primary)"
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: string;
  color?: string;
}) {
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 14,
      background: "var(--bg-surface)", border: "1px solid var(--border-line)",
      display: "flex", gap: 10, alignItems: "center",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center", color
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", marginTop: 1 }}>
          {value !== null && value !== undefined ? `${value} ${unit}` : "N/A"}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Recommendations() {
  const { activePlot, userPlots, daysPlanted, language } = useApp();
  const plot = userPlots[0] ?? activePlot;
  const crop = plot ? CROP_PROFILES[plot.crop] : null;

  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendUp, setBackendUp] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  // Health check on mount
  useEffect(() => {
    checkBackendHealth().then(setBackendUp);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!plot || !plot.coordinates || plot.coordinates.length < 3) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRecommendations({
        plot_id: plot.id,
        plot_name: plot.name,
        crop: plot.crop,
        area_acres: plot.area,
        coordinates: plot.coordinates.map(([lat, lng]) => ({ lat, lng })),
        soil_ph: plot.soilPH ?? null,
        soil_health: plot.soilHealth ?? null,
        days_planted: daysPlanted,
        language,
      });
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  }, [plot, daysPlanted, language]);

  const copyRecommendations = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.recommendations).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!plot || !crop) {
    return (
      <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            {tr("No Plot Selected", language)}
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, fontWeight: 500 }}>
            {tr("Add a field on the My Fields page first, then come back for AI recommendations.", language)}
          </p>
        </div>
      </div>
    );
  }

  const env = result?.environmental_snapshot;

  return (
    <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 28, height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)"
            }}>
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em" }}>
              {tr("AI Recommendations", language)}
            </h1>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-dim)", fontWeight: 500 }}>
            {tr("Powered by", language)} <strong>Kimi K2.5</strong> {tr("via NVIDIA NIM · Real soil & weather data", language)}
          </p>
        </div>

        {/* Backend status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {backendUp !== null && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 100,
              background: backendUp ? "rgba(34,197,94,0.1)" : "rgba(234,67,53,0.1)",
              border: `1px solid ${backendUp ? "rgba(34,197,94,0.3)" : "rgba(234,67,53,0.3)"}`,
              color: backendUp ? "#16a34a" : "#dc2626",
              fontSize: 12, fontWeight: 700,
            }}>
              {backendUp ? <Wifi size={12} /> : <WifiOff size={12} />}
              {backendUp ? "Backend Online" : "Backend Offline"}
            </div>
          )}
        </div>
      </motion.div>

      {/* Plot summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card"
        style={{ padding: "20px 24px", display: "flex", gap: 20, alignItems: "center" }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0 }}>
          <Image src={crop.image} fill alt="" style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)" }}>{plot.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-ghost)", fontWeight: 600, marginTop: 2 }}>
            {crop.icon} {language === "ml" ? crop.labelMl : crop.label} ·{" "}
            {plot.area.toFixed(2)} {tr("acres", language)} ·{" "}
            {daysPlanted} {tr("days planted", language)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {result && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyRecommendations}
              style={{
                padding: "10px 18px", borderRadius: 100, cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: "var(--bg-surface)", border: "1px solid var(--border-line)", color: "var(--text-main)",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              {copied ? <Check size={14} color="var(--accent-primary)" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAnalysis}
            disabled={loading || !backendUp}
            style={{
              padding: "10px 24px", borderRadius: 100, border: "none",
              background: loading || !backendUp ? "var(--border-line)" : "var(--accent-primary)",
              color: loading || !backendUp ? "var(--text-ghost)" : "#FFF",
              cursor: loading || !backendUp ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: loading || !backendUp ? "none" : "0 6px 20px rgba(0,166,126,0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
              {loading ? <RefreshCw size={16} /> : <Sparkles size={16} />}
            </motion.div>
            {loading ? tr("Analysing…", language) : result ? tr("Re-analyse", language) : tr("Run AI Analysis", language)}
          </motion.button>
        </div>
      </motion.div>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: "16px 20px", borderRadius: 16,
              background: "rgba(234,67,53,0.08)", border: "1px solid rgba(234,67,53,0.25)",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}
          >
            <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#dc2626" }}>Analysis Failed</div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2, fontWeight: 500 }}>{error}</div>
              {!backendUp && (
                <div style={{ fontSize: 12, color: "var(--text-ghost)", marginTop: 6, fontWeight: 600 }}>
                  💡 Make sure the backend is running: <code style={{ background: "var(--bg-surface)", padding: "1px 6px", borderRadius: 4 }}>python main.py</code> inside <code>backend/</code>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Pulsing skeleton cards */}
            {[280, 180, 220, 160].map((h, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                style={{
                  height: h, borderRadius: 20,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-line)",
                }}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: "12px 0", color: "var(--text-ghost)", fontSize: 13, fontWeight: 600 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                <RefreshCw size={14} />
              </motion.div>
              Fetching real soil & weather data for your plot, then asking Kimi K2.5…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Environmental snapshot grid */}
            <div>
              <div className="text-label" style={{ marginBottom: 12 }}>📡 Live Environmental Data</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                <DataPill icon={<Thermometer size={16} />} label="Air Temp" value={env?.weather.temperature_2m ?? null} unit="°C" color="#f97316" />
                <DataPill icon={<Droplets size={16} />} label="Humidity" value={env?.weather.relative_humidity ?? null} unit="%" color="#3b82f6" />
                <DataPill icon={<CloudRain size={16} />} label="7-Day Rain" value={env?.weather.precipitation_sum ?? null} unit="mm" color="#06b6d4" />
                <DataPill icon={<Wind size={16} />} label="Wind Avg" value={env?.weather.windspeed_10m_max ?? null} unit="km/h" color="#8b5cf6" />
                <DataPill icon={<Droplets size={16} />} label="Soil Moist (0-1cm)" value={env?.weather.soil_moisture_0_1cm !== null && env?.weather.soil_moisture_0_1cm !== undefined ? parseFloat((env.weather.soil_moisture_0_1cm * 100).toFixed(1)) : null} unit="%" color="var(--accent-primary)" />
                <DataPill icon={<Thermometer size={16} />} label="Soil Temp" value={env?.weather.soil_temperature_0cm ?? null} unit="°C" color="#f97316" />
                <DataPill icon={<Sun size={16} />} label="UV Index Max" value={env?.weather.uv_index_max ?? null} unit="" color="#eab308" />
                <DataPill icon={<Layers size={16} />} label="ET₀ (7d)" value={env?.weather.et0_fao_evapotranspiration ?? null} unit="mm" color="#14b8a6" />
              </div>
            </div>

            {/* Soil grid */}
            <div>
              <div className="text-label" style={{ marginBottom: 12 }}>🪱 Soil Analysis (SoilGrids 0–30cm avg)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                <DataPill icon={<FlaskConical size={16} />} label="Soil pH" value={env?.soil.ph ?? null} unit="" color="#ec4899" />
                <DataPill icon={<Sprout size={16} />} label="Organic Carbon" value={env?.soil.organic_carbon ?? null} unit="g/kg" color="var(--accent-primary)" />
                <DataPill icon={<Sprout size={16} />} label="Nitrogen" value={env?.soil.nitrogen ?? null} unit="cg/kg" color="#22c55e" />
                <DataPill icon={<Layers size={16} />} label="Clay" value={env?.soil.clay ?? null} unit="%" color="#a16207" />
                <DataPill icon={<Layers size={16} />} label="Sand" value={env?.soil.sand ?? null} unit="%" color="#d97706" />
                <DataPill icon={<Layers size={16} />} label="Silt" value={env?.soil.silt ?? null} unit="%" color="#78716c" />
                <DataPill icon={<Layers size={16} />} label="Bulk Density" value={env?.soil.bulk_density ?? null} unit="kg/dm³" color="#64748b" />
                <DataPill icon={<FlaskConical size={16} />} label="CEC" value={env?.soil.cation_exchange ?? null} unit="cmol/kg" color="#7c3aed" />
              </div>
              <div style={{ fontSize: 11, color: "var(--text-ghost)", marginTop: 8, fontWeight: 600 }}>
                Sources: {result.data_sources.join(" · ")}
              </div>
            </div>

            {/* Recommendation card */}
            <div className="premium-card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Sparkles size={18} color="#FFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)" }}>AI Farm Advisory</div>
                    <div style={{ fontSize: 11, color: "var(--text-ghost)", fontWeight: 600 }}>{result.model_used}</div>
                  </div>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 100,
                  background: "var(--accent-soft)", border: "1px solid rgba(0,166,126,0.2)",
                  fontSize: 11, fontWeight: 800, color: "var(--accent-primary)"
                }}>
                  LIVE DATA
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--border-line)", paddingTop: 20 }}>
                <MarkdownBlock text={result.recommendations} />
              </div>
            </div>

            {/* Location info */}
            <div style={{ padding: "10px 16px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-line)", display: "flex", gap: 20, fontSize: 12, color: "var(--text-ghost)", fontWeight: 600 }}>
              <span>📍 Centroid: {env?.centroid_lat.toFixed(4)}, {env?.centroid_lng.toFixed(4)}</span>
              <span>⭕ Radius: {env?.radius_km} km</span>
              <span><ChevronRight size={12} style={{ verticalAlign: "middle" }} /> Model: {result.model_used}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state — no result yet */}
      {!result && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 20, padding: 60
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 96, height: 96, borderRadius: 28,
              background: "var(--accent-soft)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <Sparkles size={44} color="var(--accent-primary)" />
          </motion.div>
          <div style={{ textAlign: "center", maxWidth: 360 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", marginBottom: 10, letterSpacing: "-0.02em" }}>
              {tr("Ready to Analyse", language)}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, fontWeight: 500 }}>
              {tr("Click Run AI Analysis to fetch live soil & weather data for your", language)}{" "}
              <strong style={{ color: "var(--text-main)" }}>{plot.name}</strong>{" "}
              {tr("and get personalised recommendations from Kimi K2.5.", language)}
            </p>
          </div>
          {!backendUp && backendUp !== null && (
            <div style={{
              padding: "12px 20px", borderRadius: 14,
              background: "rgba(234,67,53,0.08)", border: "1px solid rgba(234,67,53,0.2)",
              fontSize: 13, color: "#dc2626", fontWeight: 600, textAlign: "center"
            }}>
              ⚠️ Backend offline. Run <code style={{ background: "var(--bg-surface)", padding: "1px 6px", borderRadius: 4 }}>python main.py</code> in <code>backend/</code>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
