"use client";
import { useApp, CROP_PROFILES, CropType, Plot } from "@/context/AppContext";
import { useState, useCallback } from "react";
import { tr } from "@/lib/translations";
import dynamic from "next/dynamic";
import {
  Plus, ShieldCheck, X, Check, ChevronRight,
  Leaf, MapPin, Layers
} from "lucide-react";
import type { PlotPoint, DrawingTool } from "@/components/PlotMapLeaflet";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Dynamically import Leaflet map (no SSR)
const PlotMapLeaflet = dynamic(() => import("@/components/PlotMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-surface)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-ghost)" }}>Loading map…</div>
    </div>
  ),
});

const CROP_ORDER: CropType[] = ["pineapple", "rubber", "rice", "palm_oil", "coffee", "spices", "sugarcane", "tea"];

export default function Fields() {
  const { userPlots, activePlot, setActivePlot, addPlot, updatePlot, language } = useApp();

  // Show only user-created plots (the ones from onboarding + added here)
  const displayPlots = userPlots.length > 0 ? userPlots : [];

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addStep, setAddStep] = useState<"crop" | "map">("crop");
  const [newCrop, setNewCrop] = useState<CropType | null>(null);
  const [newPoints, setNewPoints] = useState<PlotPoint[]>([]);
  const [newArea, setNewArea] = useState<number | null>(null);
  
  // Tools state for both maps
  const [addMapTool, setAddMapTool] = useState<DrawingTool>("polygon");
  const [viewMapTool, setViewMapTool] = useState<DrawingTool>("pointer");

  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(
    activePlot && userPlots.some(p => p.id === activePlot?.id) ? activePlot.id : (userPlots[0]?.id ?? null)
  );

  const selectedPlotForView = displayPlots.find(p => p.id === selectedPlotId) || null;
  const plotReady = newPoints.length >= 3;

  function handleSaveNewPlot() {
    if (!newCrop || !plotReady) return;
    const plot: Plot = {
      id: `plot-${Date.now()}`,
      name: `${CROP_PROFILES[newCrop].label} Plot`,
      crop: newCrop,
      area: newArea ?? 1.5,
      coordinates: newPoints.map(pt => [pt.lat, pt.lng] as [number, number]),
      soilPH: parseFloat((6 + Math.random()).toFixed(1)),
      soilHealth: Math.floor(75 + Math.random() * 25),
    };
    addPlot(plot);
    setSelectedPlotId(plot.id);
    setActivePlot(plot);
    setShowAddPanel(false);
    setAddStep("crop");
    setNewCrop(null);
    setNewPoints([]);
    setNewArea(null);
  }

  function handlePlotSelect(p: Plot) {
    setSelectedPlotId(p.id);
    setActivePlot(p);
    setViewMapTool("pointer"); // Reset tool when selecting another plot
  }

  function handleViewPlotChange(pts: PlotPoint[], area: number | null) {
    if (selectedPlotId && pts.length >= 3) {
       updatePlot(selectedPlotId, {
         coordinates: pts.map(pt => [pt.lat, pt.lng] as [number, number]),
         area: area ?? selectedPlotForView?.area ?? 1.5
       });
    }
  }

  return (
    <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 28, height: "100%", overflowY: "auto", position: "relative" }}>
      {/* Header */}
      <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em" }}>
            {tr("YOUR FARM MAPS", language)}
          </h1>
          <p style={{ color: "var(--text-dim)", marginTop: 4, fontWeight: 500 }}>
            {displayPlots.length > 0
              ? `${displayPlots.length} ${tr("fields saved", language)}`
              : tr("No fields yet — add your first field", language)}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary">
            <Layers size={16} /> {tr("Manage Data", language)}
          </button>
          <button className="btn-primary" onClick={() => { setShowAddPanel(true); setAddStep("crop"); }}>
            <Plus size={18} /> {tr("Add New Field", language)}
          </button>
        </div>
      </div>

      {/* Main Layout: Map + Sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, flex: 1, minHeight: 500 }}>

        {/* ── Main Column with Stats + Map Area ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stats Bar (Moved outside the map to prevent obstruction) */}
          {selectedPlotForView && (
            <div className="premium-card reveal" style={{
              padding: "16px 24px", display: "flex", gap: 32, alignItems: "center",
            }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", position: "relative" }}>
                  <Image src={CROP_PROFILES[selectedPlotForView.crop].image} fill alt="" style={{ objectFit: "cover" }} priority />
                </div>
                <div>
                  <div className="text-label" style={{ fontSize: 10 }}>{tr("Selected Plot", language)}</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedPlotForView.name}</div>
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: "var(--border-line)" }} />
              <div>
                <div className="text-label" style={{ fontSize: 10 }}>{tr("Total Area", language)}</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {selectedPlotForView.area.toFixed(2)} <span style={{ opacity: 0.5, fontSize: 14 }}>{tr("ACRES", language)}</span>
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: "var(--border-line)" }} />
              <div>
                <div className="text-label" style={{ fontSize: 10 }}>{tr("Soil Health Index", language)}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-primary)" }}>
                  {selectedPlotForView.soilHealth}%
                </div>
              </div>
            </div>
          )}

          <div className="premium-card reveal" style={{ padding: 0, overflow: "hidden", position: "relative", flex: 1, minHeight: 400 }}>
            {displayPlots.length === 0 ? (
              /* Empty state */
              <div style={{
                width: "100%", height: "100%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 20, padding: 40,
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 24,
                  background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={36} color="var(--accent-primary)" strokeWidth={2} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>{tr("No Fields Yet", language)}</div>
                  <div style={{ fontSize: 14, color: "var(--text-dim)", fontWeight: 500, maxWidth: 300 }}>
                    {tr('Add your first mapped field using the "Add New Field" button above', language)}
                  </div>
                </div>
                <button className="btn-primary" onClick={() => { setShowAddPanel(true); setAddStep("crop"); }}>
                  <Plus size={16} /> {tr("Add First Field", language)}
                </button>
              </div>
            ) : (
              /* Full map with selected plot */
              <div style={{ position: "absolute", inset: 0 }}>
                {/* Note: Not using key={selectedPlotId} to prevent map remount flickering */}
                <PlotMapLeaflet
                  key={selectedPlotId} /* Use ID to cleanly reset Leaflet only on plot switch, avoiding arbitrary re-renders while same plot is selected */
                  onPlotChange={handleViewPlotChange}
                  initialPoints={selectedPlotForView?.coordinates?.map(c => ({ lat: c[0], lng: c[1] })) ?? []}
                  showToolPanel={true}
                  activeTool={viewMapTool}
                  onToolChange={setViewMapTool}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar: Plot List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div className="premium-card reveal" style={{ animationDelay: "0.2s", padding: 24 }}>
            <div className="text-label" style={{ marginBottom: 16 }}>{tr("Saved Fields", language)}</div>
            {displayPlots.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🌱</div>
                <div style={{ fontSize: 13, color: "var(--text-ghost)", fontWeight: 600 }}>{tr("No fields added yet", language)}</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {displayPlots.map((p) => {
                  const isActive = selectedPlotForView?.id === p.id;
                  const prof = CROP_PROFILES[p.crop];
                  return (
                    <motion.div
                      key={p.id}
                      onClick={() => handlePlotSelect(p)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        padding: "10px 12px", borderRadius: 14, cursor: "pointer",
                        background: isActive ? "var(--accent-soft)" : "var(--bg-surface)",
                        border: `1px solid ${isActive ? "var(--accent-primary)" : "var(--border-line)"}`,
                        transition: "all 0.2s ease",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      <div style={{
                        width: 48, height: 48, borderRadius: 10, position: "relative",
                        overflow: "hidden", border: `1px solid ${isActive ? "rgba(0,166,126,0.2)" : "var(--border-line)"}`
                      }}>
                        <Image src={prof.image} alt={prof.label} fill style={{ objectFit: "cover" }} priority />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-ghost)", fontWeight: 600, marginTop: 2 }}>{p.area.toFixed(2)} {tr("acres", language)} · {language === "ml" ? prof.labelMl : tr(prof.label, language)}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <div className="badge">{p.soilHealth >= 80 ? tr("Healthy", language) : tr("Moderate", language)}</div>
                        {isActive && <ChevronRight size={14} color="var(--accent-primary)" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="premium-card reveal" style={{ animationDelay: "0.3s", padding: 24 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              <span style={{ fontSize: 14, fontWeight: 800 }}>{tr("Map Saved Safely", language)}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 12, lineHeight: 1.6, fontWeight: 500 }}>
              {tr("Your field locations are accurately saved and ready to use for farm advice and tracking.", language)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Add Plot Overlay ── */}
      <AnimatePresence>
        {showAddPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 2000,
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddPanel(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                width: "92vw", maxWidth: 1100, height: "88vh",
                background: "var(--bg-surface)", borderRadius: 28,
                overflow: "hidden", display: "flex", flexDirection: "column",
                boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
                border: "1px solid var(--border-line)",
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: "20px 28px", borderBottom: "1px solid var(--border-line)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "var(--bg-card)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Leaf size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)" }}>{tr("Add New Plot", language)}</h2>
                    <p style={{ fontSize: 12, color: "var(--text-ghost)", fontWeight: 600, marginTop: 2 }}>
                      {addStep === "crop" ? tr("Step 1: Choose a crop", language) : tr("Step 2: Draw your field boundary", language)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddPanel(false)}
                  style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border-line)", background: "var(--bg-surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step indicator */}
              <div style={{ padding: "12px 28px", background: "var(--bg-card)", borderBottom: "1px solid var(--border-line)", display: "flex", gap: 8, alignItems: "center" }}>
                {[tr("Select Crop", language), tr("Draw Field", language)].map((s, i) => {
                  const stepIdx = addStep === "crop" ? 0 : 1;
                  const done = i < stepIdx;
                  const active = i === stepIdx;
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", fontSize: 11, fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: done ? "var(--accent-primary)" : active ? "var(--accent-soft)" : "var(--border-line)",
                        color: done ? "#FFF" : active ? "var(--accent-primary)" : "var(--text-ghost)",
                        border: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
                      }}>
                        {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: active ? "var(--text-main)" : "var(--text-ghost)" }}>{s}</span>
                      {i < 1 && <ChevronRight size={14} color="var(--border-strong)" />}
                    </div>
                  );
                })}
              </div>

              {/* Step Content */}
              <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                <AnimatePresence mode="wait">
                  {addStep === "crop" && (
                    <motion.div
                      key="crop-step"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      style={{ padding: 32, height: "100%", overflowY: "auto" }}
                    >
                      <p style={{ fontSize: 15, color: "var(--text-dim)", fontWeight: 500, marginBottom: 24 }}>
                        {tr("Select the primary crop for this field plot:", language)}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
                        {CROP_ORDER.map((crop) => {
                          const prof = CROP_PROFILES[crop];
                          const isSelected = newCrop === crop;
                          return (
                            <motion.div
                              key={crop} onClick={() => setNewCrop(crop)}
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              style={{
                                position: "relative", cursor: "pointer",
                                border: `2px solid ${isSelected ? "var(--accent-primary)" : "var(--border-line)"}`,
                                background: isSelected ? "var(--accent-soft)" : "var(--bg-card)",
                                padding: "10px", borderRadius: 16,
                                display: "flex", flexDirection: "column", gap: 10,
                                transition: "all 0.2s ease",
                                boxShadow: isSelected ? "0 4px 16px rgba(0,166,126,0.15)" : "none",
                              }}
                            >
                              <div style={{ width: "100%", height: 100, position: "relative", borderRadius: 10, overflow: "hidden" }}>
                                <Image src={prof.image} fill alt="" style={{ objectFit: "cover" }} />
                              </div>
                              <div style={{ textAlign: "center", paddingBottom: 6 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>{prof.icon} {language === "ml" ? prof.labelMl : tr(prof.label, language)}</div>
                                <div style={{ fontSize: 11, color: "var(--text-ghost)", fontWeight: 600 }}>{prof.growthDays} {tr("days to harvest", language)}</div>
                              </div>
                              {isSelected && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Check size={12} color="#FFF" strokeWidth={3} />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <button className="btn-secondary" onClick={() => setShowAddPanel(false)}>{tr("Cancel", language)}</button>
                        <button
                          className="btn-primary"
                          disabled={!newCrop}
                          onClick={() => setAddStep("map")}
                          style={{ opacity: newCrop ? 1 : 0.5, cursor: newCrop ? "pointer" : "not-allowed" }}
                        >
                          {tr("Continue to Map", language)} <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {addStep === "map" && (
                    <motion.div
                      key="map-step"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      style={{ height: "100%", display: "flex", flexDirection: "column" }}
                    >
                      {/* Editor Top Bar */}
                      <div style={{
                        padding: "10px 20px", borderBottom: "1px solid var(--border-line)",
                        background: "var(--bg-card)", display: "flex", gap: 8, alignItems: "center",
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-main)" }}>{tr("Draw Your Field Boundaries", language)}</span>
                        <div style={{ flex: 1 }} />
                        {newCrop && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 10, background: "var(--accent-soft)", border: "1px solid rgba(0,166,126,0.2)" }}>
                            <div style={{ width: 20, height: 20, position: "relative", borderRadius: 4, overflow: "hidden" }}>
                              <Image src={CROP_PROFILES[newCrop].image} fill alt="" style={{ objectFit: "cover" }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-primary)" }}>{language === "ml" ? CROP_PROFILES[newCrop].labelMl : tr(CROP_PROFILES[newCrop].label, language)}</span>
                          </div>
                        )}
                        {newArea !== null && (
                          <div style={{ padding: "6px 14px", borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border-line)", fontSize: 12, fontWeight: 800 }}>
                            📐 {newArea.toFixed(2)} {tr("acres", language)}
                          </div>
                        )}
                      </div>

                      {/* Map */}
                      <div style={{ flex: 1, position: "relative" }}>
                        <PlotMapLeaflet
                          onPlotChange={(pts, area) => { setNewPoints(pts); setNewArea(area); }}
                          showToolPanel={true}
                          activeTool={addMapTool}
                          onToolChange={setAddMapTool}
                        />
                      </div>

                      {/* Bottom action bar */}
                      <div style={{
                        padding: "14px 20px", borderTop: "1px solid var(--border-line)",
                        background: "var(--bg-card)", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between",
                      }}>
                        <button
                          className="btn-secondary"
                          onClick={() => setAddStep("crop")}
                          style={{ padding: "10px 20px" }}
                        >
                          ← {tr("Back", language)}
                        </button>
                        <div style={{ display: "flex", gap: 12 }}>
                          {!plotReady && (
                            <div style={{ fontSize: 13, color: "var(--text-ghost)", fontWeight: 600, display: "flex", alignItems: "center" }}>
                              {tr("Draw a plot on the map to continue", language)}
                            </div>
                          )}
                          <button
                            onClick={handleSaveNewPlot}
                            disabled={!plotReady}
                            style={{
                              padding: "12px 24px", borderRadius: 100, border: "none",
                              background: plotReady ? "var(--accent-primary)" : "var(--border-line)",
                              color: plotReady ? "#FFF" : "var(--text-ghost)",
                              cursor: plotReady ? "pointer" : "not-allowed",
                              fontWeight: 700, fontSize: 14,
                              display: "flex", alignItems: "center", gap: 8,
                              boxShadow: plotReady ? "0 6px 16px rgba(0,166,126,0.3)" : "none",
                              transition: "all 0.2s",
                            }}
                          >
                            <Check size={16} /> {tr("Save Plot", language)}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
