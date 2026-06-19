"use client";
import { useApp, CROP_PROFILES } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { ChevronRight, Droplets, Wind, Thermometer, Sprout, Activity, ArrowRight, Zap, RefreshCw, AlertTriangle, CheckCircle, Sparkles, X, Globe, ArrowUpRight, TrendingUp, Info, Play, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { fetchRecommendations, checkBackendHealth, RecommendationResponse } from "@/lib/api";

import { DoodleLeaf, DoodleDrop, DoodleSun, DoodleStar, DoodleLine } from "@/components/Doodles";

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "currentColor", fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 className="md-head" key={i} style={{ fontSize: 18, fontWeight: 800, marginTop: 12, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 className="md-head" key={i} style={{ fontSize: 20, fontWeight: 900, marginTop: 12, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {line.replace("# ", "")}
        </h1>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={i} style={{ fontWeight: 800, marginTop: 12, marginBottom: 4 }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6, paddingLeft: 4 }}>
          <div className="md-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", marginTop: 8, flexShrink: 0 }} />
          <span style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>
            {renderInline(line.replace(/^[-*] /, ""))}
          </span>
        </div>
      );
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6, paddingLeft: 4 }}>
          <div className="md-num" style={{
            width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "currentColor", flexShrink: 0, marginTop: 2
          }}>{num}</div>
          <span style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>
            {renderInline(line.replace(/^\d+\. /, ""))}
          </span>
        </div>
      );
    } else if (line.startsWith("---")) {
      elements.push(<div className="md-hr" key={i} style={{ height: 1, background: "rgba(255,255,255,0.3)", margin: "16px 0" }} />);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
    } else {
      elements.push(
        <p key={i} style={{ fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>
          {renderInline(line)}
        </p>
      );
    }
  });

  return <div>{elements}</div>;
}

function MetricCard({ 
  label, value, sub, icon, color = "var(--accent-primary)", delay = 0, trend = "+2.4%", language = "en" 
}: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      className="premium-card" 
      style={{ 
        display: "flex", flexDirection: "column", gap: 20, 
        background: "var(--bg-card)", 
        border: "1px solid var(--border-line)", 
        boxShadow: "var(--shadow-lg)",
        position: "relative"
      }}
    >
      <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.05, transform: "scale(2)", pointerEvents: "none" }}>
        {icon}
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          style={{ 
            width: 56, height: 56, borderRadius: 20, 
            background: `linear-gradient(135deg, var(--bg-surface), ${color}22)`, 
            display: "flex", alignItems: "center", justifyContent: "center", 
            color, border: `1px solid ${color}33`,
            boxShadow: `0 8px 16px ${color}22`
          }}
        >
          {icon}
        </motion.div>
        <div style={{ padding: "6px 14px", borderRadius: 100, background: trend && trend.startsWith("+") || trend === "Strong" || trend === tr("Strong", language) ? "rgba(34,197,94,0.12)" : "rgba(234,67,53,0.12)", color: trend && trend.startsWith("+") || trend === "Strong" || trend === tr("Strong", language) ? "#16a34a" : "#dc2626", fontSize: 13, fontWeight: 800 }}>
          {trend}
        </div>
      </div>
      <div style={{ zIndex: 1 }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-ghost)", fontWeight: 800, marginBottom: 8 }}>{label}</div>
        <div className="text-value" style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
          <span style={{ fontSize: 42, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-ghost)" }}>{sub}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ height: 8, background: "rgba(0,0,0,0.04)", borderRadius: 100, overflow: "hidden", position: "relative" }}>
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${sub === "%" ? Number(value) : (Number(value) / 50) * 100}%` }} 
               transition={{ duration: 1, delay: delay + 0.3 }} 
               style={{ height: "100%", background: color, borderRadius: 100, boxShadow: `0 0 10px ${color}` }} 
             />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase" }}>
             <span>{sub === "%" ? (label.includes(tr("Plant Growth", language)) ? tr("Growth Capacity", language) : tr("Saturation Level", language)) : tr("Thermal Index", language)}</span>
             <span style={{ color }}>{Number(value) > 60 || (sub === "°C" && Number(value) > 25) ? tr("Optimal", language) : tr("Monitoring", language)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { language, activePlot, userPlots, sensorData, setSensorData, daysPlanted } = useApp();
  const displayPlot = userPlots.length > 0 ? userPlots[0] : activePlot;
  const crop = displayPlot ? CROP_PROFILES[displayPlot.crop] : null;

  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendUp, setBackendUp] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parsedMsg, setParsedMsg] = useState<any>(null);
  const [dailyPromptState, setDailyPromptState] = useState<"hidden" | "asking" | "analyzing">("hidden");
  const [loadingStep, setLoadingStep] = useState<string>("");
  
  useEffect(() => {
    checkBackendHealth().then(setBackendUp);
  }, []);

  const confirmAndRunAnalysis = useCallback(async (actionTaken?: string) => {
    if (!displayPlot || !displayPlot.coordinates || displayPlot.coordinates.length < 3) return;
    
    // Remember the answer immediately so we don't ask again if language changes mid-analysis
    if (actionTaken) {
      localStorage.setItem(`dashboard_action_${displayPlot.id}`, actionTaken);
    }
    
    setDailyPromptState("analyzing");
    setLoading(true);
    setError(null);

    const finalSteps = [
      "Consulting crop optimization systems...",
      "Formulating agronomic recommendations...",
      "Evaluating yield forecast metrics...",
      "Analyzing bio-dynamic data logs...",
      "Synthesizing expert agricultural advisory...",
      "Generating personalized field guidance..."
    ];
    const chosenFinalStep = finalSteps[Math.floor(Math.random() * finalSteps.length)];

    const steps = [
      "Establishing link with IoT Gateway...",
      "Requesting device data payload...",
      "Synthesizing soil moisture & CO2 telemetry...",
      chosenFinalStep
    ];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
      }
    }, 1200);

    try {
      const data = await fetchRecommendations({
        plot_id: displayPlot.id,
        plot_name: displayPlot.name,
        crop: displayPlot.crop,
        area_acres: displayPlot.area,
        coordinates: displayPlot.coordinates.map(([lat, lng]) => ({ lat, lng })),
        soil_ph: displayPlot.soilPH ?? null,
        soil_health: displayPlot.soilHealth ?? null,
        days_planted: daysPlanted,
        plant_count: displayPlot.plantCount,
        daily_action: actionTaken,
        language,
      });
      setResult(data);
      if (data.sensor_data) {
        setSensorData({
          ...data.sensor_data,
          timestamp: new Date(),
        });
      }
      localStorage.setItem(`dashboard_ai_${displayPlot.id}_${language}`, JSON.stringify(data));
    } catch (e: any) {
      setError(e.message ?? "Failed to connect to backend.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setDailyPromptState("hidden");
    }
  }, [displayPlot, daysPlanted, language, setSensorData]);

  const runAnalysis = useCallback(() => {
    if (dailyPromptState === "hidden") {
      setDailyPromptState("asking");
    }
  }, [dailyPromptState]);

  // Read response from local storage and trigger auto analysis
  useEffect(() => {
    if (!displayPlot) return;
    
    // reset state
    setDailyPromptState("hidden");

    const cached = localStorage.getItem(`dashboard_ai_${displayPlot.id}_${language}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setResult(parsed);
        if (parsed.sensor_data) {
          setSensorData({
            ...parsed.sensor_data,
            timestamp: new Date(),
          });
        }
      } catch (p) {
        localStorage.removeItem(`dashboard_ai_${displayPlot.id}_${language}`);
        setDailyPromptState("asking");
      }
    } else {
      // Do not clear the result immediately to avoid flashing to empty state on language change
      
      // Auto-trigger analysis if we already have a stored action for this plot
      const storedAction = localStorage.getItem(`dashboard_action_${displayPlot.id}`);
      if (storedAction) {
        confirmAndRunAnalysis(storedAction);
      } else {
        setDailyPromptState("asking");
      }
    }
  }, [displayPlot?.id, language, confirmAndRunAnalysis, setSensorData]);

  useEffect(() => {
    if (result && result.recommendations) {
      try {
        setParsedMsg(JSON.parse(result.recommendations));
      } catch (e) {
        setParsedMsg({
          title: "Analysis generated.",
          subtitle: "Click below to see detailed markdown advisory actions.",
          action_text: "Acknowledge",
          metric_value: "OK",
          metric_label: "STATUS",
          full_report: result.recommendations
        });
      }
    } else {
      setParsedMsg(null);
    }
  }, [result]);

  if (!displayPlot || !crop) return null;

  return (
    <>
      <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 40, overflowY: "auto", height: "100%" }}>
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.6 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}
        >
          <div style={{ position: "absolute", top: -40, left: 200, zIndex: 0, opacity: 0.15, filter: "blur(12px)", pointerEvents: "none" }}>
            <DoodleSun size={150} color="var(--accent-secondary)" delay={1} />
          </div>
          <div style={{ position: "absolute", top: -10, left: 350, zIndex: 0, opacity: 0.8, pointerEvents: "none" }}>
            <DoodleStar size={30} color="var(--accent-primary)" delay={0} />
          </div>
          <div style={{ zIndex: 1, position: "relative" }}>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {tr("controlCenter", language)}
            </h1>
            <div style={{ position: "absolute", bottom: -10, left: 0 }}>
               <DoodleLine width={180} color="var(--accent-secondary)" delay={0.5} />
            </div>
            <p style={{ fontSize: 16, color: "var(--text-dim)", marginTop: 20, fontWeight: 500 }}>
              {tr("hello", language)}, Ravi. {tr("yourPlot", language)} {language === "ml" ? crop.labelMl : crop.label} {tr("plotIs", language).toLowerCase() === "plot is in the" ? "" : ""}
              <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}> {tr("optimal", language)}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", zIndex: 1 }}>
            {/* IoT status indicator */}
            <div style={{ 
              display: "flex", alignItems: "center", gap: 8, 
              background: "var(--bg-card)", border: "1px solid var(--border-line)", 
              padding: "10px 18px", borderRadius: "100px", fontSize: 13, 
              fontWeight: 800, color: "var(--text-main)", 
              boxShadow: "var(--shadow-sm)", marginRight: 8
            }}>
              <motion.span 
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%", 
                  background: "#10b981", boxShadow: "0 0 10px #10b981" 
                }} 
              />
              <span>IoT Network: Active</span>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ padding: "12px 16px" }}>
              <Play size={18} fill="currentColor" /> {tr("watchBrief", language)}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ boxShadow: "0 8px 16px -4px rgba(15, 157, 88, 0.4)" }}>
              {tr("fullReport", language)} <ArrowUpRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} 
            className="premium-card" 
            style={{ 
              gridColumn: "span 2", 
              background: "var(--accent-primary)",
              backgroundImage: "radial-gradient(ellipse at top right, var(--accent-secondary), transparent), radial-gradient(ellipse at bottom left, #10b981, transparent)",
              color: "#FFF", display: "flex", flexDirection: "column", gap: 16, padding: 40, overflow: "hidden", border: "none", minHeight: 320, position: "relative"
            }}
          >
            <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.3, filter: "blur(14px)", zIndex: 0, transform: "rotate(-15deg)" }}>
              <DoodleLeaf size={350} color="#FFF" delay={0.5} />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, zIndex: 1 }}>
               <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "6px 12px", borderRadius: 100, letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase" }}>
                 FARM EXPERT
               </span>
               <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 6 }}>
                 <p style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFF" }} /> 
                 {loading ? (
                   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}>
                       <RefreshCw size={12} color="#FFF" />
                     </motion.div>
                     Updating...
                   </div>
                 ) : "UPDATED JUST NOW"}
               </span>
            </div>

            <AnimatePresence mode="wait">
              {loading && !parsedMsg && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 1, display: "flex", flex: 1, alignItems: "center", gap: 16 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                    <RefreshCw size={32} color="#FFF" />
                  </motion.div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                    Evaluating parameters...
                  </div>
                </motion.div>
              )}

              {error && !parsedMsg && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 1, padding: "16px 20px", borderRadius: 16, background: "rgba(255,0,0,0.2)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", gap: 12, alignItems: "flex-start", marginTop: 20 }}>
                  <AlertTriangle size={18} color="#FFF" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#FFF" }}>Analysis Failed</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4, fontWeight: 500 }}>{error}</div>
                    <motion.button onClick={runAnalysis} style={{ marginTop: 16, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)", color: "#FFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Retry</motion.button>
                  </div>
                </motion.div>
              )}

              {parsedMsg && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 1, flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    <h2 style={{ fontSize: 42, fontWeight: 900, color: "#FFF", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                      {parsedMsg.title}
                    </h2>
                    <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", fontWeight: 500, marginBottom: 20 }}>
                      {parsedMsg.subtitle}
                    </p>
                    
                    <div style={{ display: "flex", gap: 12 }}>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        style={{ padding: "14px 28px", borderRadius: 100, border: "none", background: "#FFF", color: "var(--accent-primary)", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
                      >
                        {parsedMsg.action_text || "Apply"}
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        style={{ padding: "14px 28px", borderRadius: 100, border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "#FFF", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
                      >
                        More Details
                      </motion.button>
                    </div>
                  </div>

                  {(() => {
                    const parts = String(parsedMsg.metric_value || "").split(" ");
                    const val = parts[0];
                    const unit = parts.slice(1).join(" ");

                    return (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{
                          minWidth: 190, width: "fit-content", height: 210, borderRadius: 28, 
                          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)", 
                          border: "1px solid rgba(255,255,255,0.25)",
                          position: "relative", overflow: "hidden", marginLeft: 40, flexShrink: 0,
                          transform: "translateY(-15px)"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "28px 24px", height: "100%", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, marginTop: -10 }}>
                            <div style={{ fontSize: 60, fontWeight: 900, color: "#FFF", letterSpacing: "-0.04em", lineHeight: 1, textAlign: "center" }}>
                              {val}
                            </div>
                            {unit && (
                              <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em", lineHeight: 1.2, marginTop: 4, textAlign: "center" }}>
                                {unit}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em", textAlign: "center", textTransform: "uppercase" }}>
                              {parsedMsg.metric_label}
                            </div>
                            <Zap size={24} color="#FFF" style={{ opacity: 0.9 }} fill="#FFF" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <MetricCard language={language} label={tr("soilMoisture", language)} value={sensorData.moisture} sub="%" icon={<Droplets size={24} />} delay={0.1} color="var(--accent-primary)" trend="+0.8%" />
          <MetricCard language={language} label={tr("soilTemp", language)} value={sensorData.temperature} sub="°C" icon={<Thermometer size={24} />} delay={0.2} color="var(--accent-primary)" trend="-1.2%" />
          <MetricCard language={language} label={tr("growthBio", language)} value="82" sub="%" icon={<Sprout size={24} />} delay={0.3} color="var(--accent-primary)" trend={tr("Strong", language)} />
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="premium-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(145deg, var(--bg-card), var(--bg-surface))", border: "1px solid var(--border-line)", boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.04, transform: "scale(1.5)" }}>
               <TrendingUp size={200} color="var(--accent-primary)" />
             </div>
             <div style={{ zIndex: 1, position: "relative" }}>
              <div style={{ color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                 <Info size={16} strokeWidth={3} /> {tr("Financial Overview", language)}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--accent-primary)", lineHeight: 1 }}>₹4.2k</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-dim)" }}>{tr("netProfit", language)}</span>
              </div>
             </div>
             <motion.div whileHover={{ scale: 1.03, y: -2 }} style={{ background: "var(--bg-dark)", padding: 20, borderRadius: 20, border: "1px solid var(--border-line)", boxShadow: "var(--shadow-md)", zIndex: 1, position: "relative" }}>
               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                 <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <TrendingUp size={16} color="var(--accent-primary)" strokeWidth={3} />
                 </div>
                 <span style={{ fontSize: 14, fontWeight: 900, color: "var(--text-main)", letterSpacing: "0.02em" }}>{tr("PRICES ARE RISING (+12.4%)", language)}</span>
               </div>
               <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, fontWeight: 500 }}>
                 <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{language === "ml" ? crop?.labelMl : crop?.label}</span> {tr("prices are currently strong. It might be a good time to prepare for harvest.", language)}
               </p>
             </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Advice Detail Modal */}
      <AnimatePresence>
        {isModalOpen && parsedMsg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 650, maxHeight: "80vh", background: "var(--bg-card)", border: "1px solid var(--border-line)", borderRadius: 28, boxShadow: "var(--shadow-xl)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Sparkles size={20} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>Detailed Expert Advisory</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ border: "none", background: "rgba(0,0,0,0.04)", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "24px", overflowY: "auto", flex: 1, color: "var(--text-main)" }}>
                <MarkdownBlock text={parsedMsg.full_report} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Input Prompt Modal */}
      <AnimatePresence>
        {dailyPromptState !== "hidden" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ width: "100%", maxWidth: 460, background: "var(--bg-glass)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32, padding: 40, boxShadow: "var(--shadow-xl)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
            >
              {dailyPromptState === "asking" ? (
                <>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 10px 24px rgba(15,157,88,0.3)" }}>
                    <Sparkles size={32} color="#FFF" />
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 12 }}>
                    {displayPlot.crop === "rubber" ? "Did you tap the rubber trees today?" : 
                     displayPlot.crop === "sugarcane" ? "Did you irrigate the sugarcane plot today?" :
                     displayPlot.crop === "rice" ? "Did you check the water levels today?" :
                     displayPlot.crop === "tea" ? "Did you pick tea leaves today?" :
                     displayPlot.crop === "coffee" ? "Did you prune or harvest today?" :
                     displayPlot.crop === "palm_oil" ? "Did you harvest fresh fruit bunches today?" :
                     displayPlot.crop === "pineapple" ? "Did you apply fertilizer or water today?" :
                     "Did you water the plot today?"}
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-ghost)", fontWeight: 600, marginBottom: 36, lineHeight: 1.5 }}>
                    Your response helps our AI fine-tune precise yield estimates and farm recommendations.
                  </p>
                  
                  <div style={{ display: "flex", gap: 12, width: "100%", flexDirection: "column" }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => confirmAndRunAnalysis("Yes, task completed today")} style={{ padding: "18px", borderRadius: 16, background: "var(--accent-primary)", color: "#FFF", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(15,157,88,0.25)" }}>
                      Yes, I did
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => confirmAndRunAnalysis("No, skipped today")} style={{ padding: "18px", borderRadius: 16, background: "var(--bg-surface)", color: "var(--text-main)", fontSize: 16, fontWeight: 800, border: "2px solid var(--border-line)", cursor: "pointer" }}>
                      No, not today
                    </motion.button>
                    <button onClick={() => confirmAndRunAnalysis("No action supplied")} style={{ padding: "12px", background: "transparent", color: "var(--text-dim)", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 8, transition: "color 0.2s" }}>
                      Skip
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ padding: "20px 0" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} style={{ display: "inline-block", padding: 20, background: "var(--bg-surface)", borderRadius: "50%", border: "1px solid var(--border-line)" }}>
                    <Globe size={48} color="var(--accent-primary)" />
                  </motion.div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)", marginTop: 32, letterSpacing: "-0.02em" }}>Syncing Devices & AI</h3>
                  <p style={{ fontSize: 15, color: "var(--text-dim)", fontWeight: 600, marginTop: 12, lineHeight: 1.5, minHeight: "24px" }}>{loadingStep || "Syncing with IoT telemetry models..."}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
