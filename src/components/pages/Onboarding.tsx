"use client";
import { useApp, CROP_PROFILES, CropType } from "@/context/AppContext";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ArrowLeft, Leaf, Globe, Check } from "lucide-react";
import { tr } from "@/lib/translations";
import React from "react";
import type { PlotPoint, DrawingTool } from "@/components/PlotMapLeaflet";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PlotMapLeaflet = dynamic(() => import("@/components/PlotMapLeaflet"), { ssr: false, loading: () => null });

const CROP_ORDER: CropType[] = ["pineapple", "rubber", "rice", "palm_oil", "coffee", "spices", "sugarcane", "tea"];

const GlassCard = ({ children, style = {} }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 30 }}
    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    style={{
      width: "100%", maxWidth: 640,
      background: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
      borderRadius: 32, padding: 36,
      boxShadow: "0 40px 80px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8), inset 1px 0 0 rgba(255,255,255,0.4)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      zIndex: 10, ...style
    }}
  >
    {children}
  </motion.div>
);

const BackgroundBlobs = React.memo(() => (
  <>
    <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, -60, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "-20%", right: "-10%", width: "70vw", height: "70vh", background: "var(--accent-primary)", borderRadius: "50%", filter: "blur(200px)", zIndex: 0, opacity: 0.25, pointerEvents: "none", willChange: "transform, filter", transform: "translateZ(0)" }} />
    <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -80, 0], y: [0, 80, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "80vw", height: "80vh", background: "var(--accent-secondary)", borderRadius: "50%", filter: "blur(250px)", zIndex: 0, opacity: 0.2, pointerEvents: "none", willChange: "transform, filter", transform: "translateZ(0)" }} />
    <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }} style={{ position: "absolute", top: "20%", left: "30%", width: "50vw", height: "50vh", background: "#4285F4", borderRadius: "50%", filter: "blur(250px)", zIndex: 0, opacity: 0.1, pointerEvents: "none", willChange: "transform, filter", transform: "translateZ(0)" }} />
  </>
));

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { setSelectedCrop, setOnboarded, addPlot, language } = useApp();
  const [step, setStep] = useState<"crop" | "map" | "analyzing">("crop");
  const [selected, setSelected] = useState<CropType | null>(null);
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [plotArea, setPlotArea] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTool, setActiveTool] = useState<DrawingTool>("polygon");

  const plotReady = plotPoints.length >= 3;

  function startAnalysis() {
    setStep("analyzing");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 10 + 4;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          if (selected) {
            setSelectedCrop(selected);
            addPlot({
              id: `plot-${Date.now()}`,
              name: `My ${CROP_PROFILES[selected].label} Plot`,
              crop: selected,
              area: plotArea || 1.5,
              coordinates: plotPoints.map(pt => [pt.lat, pt.lng] as [number, number]),
              soilPH: parseFloat((6 + Math.random()).toFixed(1)),
              soilHealth: Math.floor(80 + Math.random() * 20),
            });
          }
          setOnboarded(true);
          onComplete();
        }, 800);
      }
    }, 120);
  }



  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--bg-surface)", display: "flex", overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      {/* Always keep blobs mounted — conditionally hiding caused remount flicker */}
      <div style={{ position: "absolute", inset: 0, opacity: step === "map" || step === "analyzing" ? 0 : 1, transition: "opacity 0.6s ease", pointerEvents: "none" }}>
        <BackgroundBlobs />
      </div>
      {/* Keep map mounted if step is map OR analyzing, to avoid flickering unmount */}
      {(step === "map" || step === "analyzing") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, filter: step === "analyzing" ? "blur(8px) brightness(0.7)" : "blur(0px) brightness(1)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <PlotMapLeaflet
            onPlotChange={(pts, area) => { setPlotPoints(pts); setPlotArea(area); }}
            showToolPanel={step === "map"}
            activeTool={activeTool}
            onToolChange={setActiveTool}
          />
        </motion.div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {step === "crop" && (
          <GlassCard key="crop" style={{ maxWidth: 800 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(15, 157, 88, 0.3)" }}>
                <Leaf size={24} color="#FFF" />
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>{tr("What are you growing?", language)}</h2>
                <p style={{ fontSize: 13, color: "var(--text-ghost)", fontWeight: 700, marginTop: 2, textTransform: "uppercase", letterSpacing: "1px" }}>{tr("Step 1 of 2", language)}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {CROP_ORDER.map((crop) => {
                const prof = CROP_PROFILES[crop];
                const isSelected = selected === crop;
                return (
                  <motion.div
                    key={crop} onClick={() => setSelected(crop)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      position: "relative", cursor: "pointer",
                      border: `1px solid ${isSelected ? "rgba(15,157,88,0.5)" : "rgba(0,0,0,0.05)"}`,
                      background: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)",
                      padding: "8px", borderRadius: 20,
                      boxShadow: isSelected ? "0 8px 24px rgba(15, 157, 88, 0.2), inset 0 0 0 2px var(--accent-primary)" : "none",
                      display: "flex", flexDirection: "column", gap: 12, overflow: "hidden"
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", height: 120, borderRadius: 14, overflow: "hidden" }}>
                      <Image
                        src={prof.image}
                        alt={prof.label}
                        fill
                        priority
                        style={{ objectFit: "cover", transition: "transform 0.4s ease", transform: isSelected ? "scale(1.05)" : "scale(1)" }}
                      />
                      {isSelected && (
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                      )}
                    </div>
                    
                    <div style={{ padding: "0 8px 8px" }}>
                       <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 6 }}>{prof.icon} {language === "ml" ? prof.labelMl : tr(prof.label, language)}</div>
                       <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)" }}>{prof.growthDays} {tr("days to harvest", language)}</div>
                    </div>

                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(15,157,88,0.4)", zIndex: 10 }}>
                        <Check size={14} color="#FFF" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!selected} onClick={() => setStep("map")} style={{ width: "100%", padding: 18, background: "var(--text-main)", color: "#FFF", borderRadius: 16, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: selected ? 1 : 0.5, boxShadow: selected ? "0 12px 24px -6px rgba(0, 0, 0, 0.4)" : "none" }}>
              {tr("Continue to Map", language)} <ArrowRight size={18} />
            </motion.button>
          </GlassCard>
        )}

        {step === "map" && (
          <motion.div key="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: "absolute", bottom: 32, left: 32, right: "auto", zIndex: 10, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Info Card */}
            <div style={{
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
              borderRadius: 24, padding: "24px 28px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.6)",
              width: 380,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em" }}>{tr("Mark Your Field", language)}</h2>
                  <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 500, marginTop: 4 }}>{tr("Draw the boundary of your field on the map", language)}</p>
                </div>
                <button
                  onClick={() => setStep("crop")}
                  style={{ background: "rgba(0,0,0,0.04)", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-main)", cursor: "pointer" }}
                >
                  <ArrowLeft size={16} />
                </button>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {selected && (
                  <div style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.7)", borderRadius: 14, border: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase" }}>{tr("Crop", language)}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <div style={{ width: 24, height: 24, position: "relative", borderRadius: 6, overflow: "hidden" }}>
                        <Image src={CROP_PROFILES[selected].image} alt="" fill style={{ objectFit: "cover" }} priority />
                      </div>
                      {language === "ml" ? CROP_PROFILES[selected].labelMl : tr(CROP_PROFILES[selected].label, language)}
                    </div>
                  </div>
                )}
                <div style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.7)", borderRadius: 14, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase" }}>{tr("Area", language)}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: plotReady ? "var(--accent-primary)" : "var(--text-main)", marginTop: 2 }}>{plotArea !== null ? `${plotArea.toFixed(2)}` : "--"}<span style={{ fontSize: 12, marginLeft: 4, fontWeight: 600 }}>{tr("ac", language)}</span></div>
                </div>
              </div>

              {!plotReady && (
                <div style={{
                  padding: "12px 16px", borderRadius: 12,
                  background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)",
                  fontSize: 12, fontWeight: 600, color: "#92400E", marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>⚠️</span>
                  {tr("Draw a plot on the map to continue", language)}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={startAnalysis}
                disabled={!plotReady}
                style={{
                  width: "100%", padding: 16,
                  background: plotReady ? "var(--accent-primary)" : "rgba(0,0,0,0.06)",
                  color: plotReady ? "#FFF" : "var(--text-ghost)",
                  borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none",
                  cursor: plotReady ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: plotReady ? "0 8px 20px -4px rgba(15, 157, 88, 0.4)" : "none",
                  transition: "all 0.25s ease",
                }}
              >
                {plotReady ? (<><Check size={18} /> {tr("Confirm Plot & Continue", language)}</>) : tr("Draw plot to continue", language)}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "analyzing" && (
          <GlassCard key="analyzing" style={{ textAlign: "center", padding: 48, maxWidth: 440 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.8)", margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}>
              <Globe size={40} color="var(--accent-primary)" />
            </motion.div>

            <div style={{ color: "var(--text-ghost)", fontSize: 12, fontWeight: 800, letterSpacing: "2px", marginBottom: 8, textTransform: "uppercase" }}>{tr("Setting up your farm", language)}</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: "var(--text-main)", lineHeight: 1, letterSpacing: "-0.04em" }}>{Math.round(progress)}%</div>

            <div style={{ height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 100, overflow: "hidden", margin: "32px 0 32px" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--accent-primary)", transition: "width 0.15s ease", borderRadius: 100 }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Looking at satellite maps", "Checking local soil types", "Connecting farm data"].map((label, i) => {
                const done = progress >= 33 * (i + 1);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", fontSize: 14, fontWeight: 600, color: done ? "var(--text-main)" : "var(--text-ghost)", transition: "color 0.3s ease" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? "var(--accent-primary)" : "rgba(255,255,255,0.6)", border: `2px solid ${done ? "var(--accent-primary)" : "rgba(0,0,0,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>
                      {done && <Check size={12} color="#FFF" strokeWidth={3} />}
                    </div>
                    {tr(label, language)}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </AnimatePresence>
    </div>
  );
}
