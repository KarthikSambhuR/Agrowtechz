"use client";
import { useApp, CROP_PROFILES, CropType } from "@/context/AppContext";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ArrowLeft, ShieldCheck, Leaf, Globe, Check } from "lucide-react";
import type { PlotPoint } from "@/components/PlotMapLeaflet";

/* ── Dynamically import the Leaflet map (client-only, no SSR) ── */
const PlotMapLeaflet = dynamic(
  () => import("@/components/PlotMapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 16, background: "#F4F7F6",
      }}>
        <div style={{
          width: 44, height: 44,
          border: "4px solid var(--accent-primary)",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
          Loading OpenStreetMap…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

/* ── Crop meta ── */
const CROP_DESCRIPTIONS: Record<CropType, string> = {
  pineapple: "Acidic soil, 18–32°C, 1000–1500 mm/yr",
  rubber:    "Deep loam soil, 25–32°C, high humidity",
  rice:      "Waterlogged/clay soils, 20–35°C",
  palm_oil:  "Well-drained alluvial, > 2000 mm/yr",
  coffee:    "Altitude 600–2000 m, shade-loving",
  spices:    "Warm humid tropics, rich organic soil",
  sugarcane: "Deep fertile soil, 20–35°C",
  tea:       "Acidic soils, cool & moist climate",
};

const CROP_ORDER: CropType[] = [
  "pineapple", "rubber", "rice", "palm_oil",
  "coffee", "spices", "sugarcane", "tea",
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { setSelectedCrop, setOnboarded } = useApp();

  const [step, setStep]           = useState<"crop" | "map" | "analyzing">("crop");
  const [selected, setSelected]   = useState<CropType | null>(null);
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [plotArea, setPlotArea]   = useState<number | null>(null);
  const [progress, setProgress]   = useState(0);

  const plotReady = plotPoints.length === 4;

  /* ── kick off the calibration animation ── */
  function startAnalysis() {
    setStep("analyzing");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 10 + 4;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          if (selected) setSelectedCrop(selected);
          setOnboarded(true);
          onComplete();
        }, 700);
      }
    }, 110);
  }

  /* ══════════════
     STEP 1 — Crop
  ══════════════ */
  if (step === "crop") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "#FFFFFF", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* ── header ── */}
        <div style={{
          padding: "28px 60px 0", display: "flex", alignItems: "center", gap: 16,
          flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "var(--accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 18px rgba(0,166,126,0.3)",
          }}>
            <Leaf size={22} color="#FFF" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14 }}>AGROWTECHZ SETUP</div>
            <div style={{ fontSize: 10, color: "var(--text-ghost)", fontWeight: 700, letterSpacing: "0.1em" }}>
              STEP 1 OF 2 — CROP PROFILE
            </div>
          </div>
          {/* progress pills */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-primary)" }}>Crop</div>
            </div>
            <div style={{ width: 32, height: 2, background: "var(--border-strong)", borderRadius: 2 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border-strong)" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-ghost)" }}>Plot Map</div>
            </div>
          </div>
        </div>

        {/* ── body ── */}
        <div style={{ padding: "32px 60px 40px", flex: 1, display: "flex", flexDirection: "column", gap: 28, overflowY: "auto" }}>
          <div className="reveal">
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              SELECT YOUR PRIMARY<br />
              <span style={{ color: "var(--accent-primary)" }}>CROP PROFILE.</span>
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-dim)", marginTop: 10, fontWeight: 500 }}>
              We'll calibrate soil sensors, irrigation logic and market models for your selection.
            </p>
          </div>

          {/* crop grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {CROP_ORDER.map((crop, i) => {
              const prof = CROP_PROFILES[crop];
              const isSelected = selected === crop;
              return (
                <div
                  key={crop}
                  onClick={() => setSelected(crop)}
                  style={{
                    position: "relative", cursor: "pointer",
                    border: `2px solid ${isSelected ? "var(--accent-primary)" : "var(--border-line)"}`,
                    background: isSelected ? "var(--accent-soft)" : "#FFF",
                    padding: "20px 18px", borderRadius: 18,
                    transition: "all 0.2s ease",
                    boxShadow: isSelected ? "0 4px 18px rgba(0,166,126,0.15)" : "var(--shadow-sm)",
                    animation: `revealUp 0.4s ease-out ${0.05 * i}s both`,
                  }}
                >
                  <div style={{ fontSize: 34, marginBottom: 10, lineHeight: 1 }}>{prof.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{prof.label}</div>
                  <p style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>
                    {CROP_DESCRIPTIONS[crop]}
                  </p>
                  {isSelected && (
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      width: 22, height: 22, borderRadius: "50%",
                      background: "var(--accent-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={13} color="#FFF" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn-primary"
              disabled={!selected}
              onClick={() => setStep("map")}
              style={{ padding: "16px 36px", fontSize: 14, borderRadius: 14 }}
            >
              NEXT: MAP YOUR PLOT <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════
     STEP 2 — OSM Plot Drawing
  ══════════════════════════ */
  if (step === "map") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "#FFF", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* ── topbar ── */}
        <div style={{
          padding: "16px 28px",
          background: "#FFF", borderBottom: "1px solid var(--border-line)",
          display: "flex", alignItems: "center", gap: 20, flexShrink: 0,
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* back */}
          <button
            className="btn-secondary"
            onClick={() => { setPlotPoints([]); setPlotArea(null); setStep("crop"); }}
            style={{ padding: "10px 16px", borderRadius: 10, gap: 6 }}
          >
            <ArrowLeft size={17} /> Back
          </button>

          {/* title */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 17 }}>DEFINE YOUR PLOT ON THE MAP</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 1 }}>
              Click <strong>4 corners</strong> of your field on OpenStreetMap — polygon closes automatically.
            </div>
          </div>

          {/* selected crop pill */}
          {selected && (
            <div style={{
              display: "flex", gap: 10, alignItems: "center",
              padding: "9px 16px", borderRadius: 12,
              background: "var(--accent-soft)", border: "1px solid var(--border-line)",
            }}>
              <span style={{ fontSize: 22 }}>{CROP_PROFILES[selected].icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Crop</div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{CROP_PROFILES[selected].label}</div>
              </div>
            </div>
          )}

          {/* area badge — shows once confirmed */}
          {plotReady && plotArea !== null && (
            <div style={{
              padding: "9px 18px", background: "#F0FBF7",
              border: "1.5px solid var(--accent-primary)",
              borderRadius: 12, textAlign: "center",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--accent-secondary)", letterSpacing: "0.06em" }}>AREA</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "var(--accent-primary)" }}>
                {plotArea.toFixed(2)} <span style={{ fontSize: 11 }}>ac</span>
              </div>
            </div>
          )}

          {/* step pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)" }}>Crop ✓</div>
            </div>
            <div style={{ width: 32, height: 2, background: "var(--accent-primary)", borderRadius: 2 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-primary)" }}>Plot Map</div>
            </div>
          </div>

          {/* primary action */}
          <button
            className="btn-primary"
            onClick={startAnalysis}
            style={{
              padding: "14px 28px", fontSize: 13, borderRadius: 12, whiteSpace: "nowrap",
              opacity: plotReady ? 1 : 0.75,
            }}
          >
            {plotReady ? "SUBMIT & CALIBRATE" : "SKIP MAP →"}
            <ArrowRight size={17} />
          </button>
        </div>

        {/* ── full map ── */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <PlotMapLeaflet
            onPlotChange={(pts, area) => {
              setPlotPoints(pts);
              setPlotArea(area);
            }}
          />
        </div>
      </div>
    );
  }

  /* ══════════════
     ANALYZING
  ══════════════ */
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "#FFF",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ width: 420, textAlign: "center" }}>
        <div style={{
          width: 76, height: 76, borderRadius: 22,
          background: "var(--accent-soft)", margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Globe size={38} color="var(--accent-primary)" />
        </div>

        <div className="text-label" style={{ color: "var(--accent-primary)", fontSize: 11, marginBottom: 8 }}>
          SYSTEM CALIBRATING
        </div>
        <div style={{ fontSize: 76, fontWeight: 900, color: "var(--text-main)", lineHeight: 1 }}>
          {Math.round(progress)}%
        </div>

        {/* progress bar */}
        <div style={{ height: 7, background: "var(--bg-surface)", borderRadius: 4, overflow: "hidden", margin: "24px 0 16px" }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
            transition: "width 0.15s ease", borderRadius: 4,
          }} />
        </div>

        {/* step labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {[
            "Syncing OpenStreetMap geofences",
            "Deploying soil AI models",
            "Loading sensor telemetry",
            "Calibrating market feed",
          ].map((label, i) => {
            const done = progress >= 25 * (i + 1);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                justifyContent: "center",
                fontSize: 12, fontWeight: 600,
                color: done ? "var(--accent-secondary)" : "var(--text-ghost)",
                transition: "color 0.3s ease",
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: done ? "var(--accent-primary)" : "var(--bg-surface)",
                  border: `2px solid ${done ? "var(--accent-primary)" : "var(--border-strong)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s ease",
                }}>
                  {done && <Check size={9} color="#FFF" strokeWidth={3} />}
                </div>
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
