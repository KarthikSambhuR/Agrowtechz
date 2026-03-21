"use client";
import { useApp, CROP_PROFILES } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { 
  Droplets, Thermometer, ArrowUpRight, Sprout, TrendingUp, Zap, Info, Play
} from "lucide-react";
import { motion } from "framer-motion";

import { DoodleLeaf, DoodleDrop, DoodleSun, DoodleStar, DoodleLine } from "@/components/Doodles";

function MetricCard({ 
  label, value, sub, icon, color = "var(--accent-primary)", delay = 0, trend = "+2.4%", language = "en" 
}: any) {
  // Extract rgb from hex or var for glowing effects (simple hack: use the color directly in box-shadow)
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
        <div style={{ padding: "6px 14px", borderRadius: 100, background: trend.startsWith("+") || trend === "Strong" || trend === tr("Strong", language) ? "rgba(34,197,94,0.12)" : "rgba(234,67,53,0.12)", color: trend.startsWith("+") || trend === "Strong" || trend === tr("Strong", language) ? "#16a34a" : "#dc2626", fontSize: 13, fontWeight: 800 }}>
          {trend}
        </div>
      </div>
      <div style={{ zIndex: 1 }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-ghost)", fontWeight: 800, marginBottom: 8 }}>{label}</div>
        <div className="text-value" style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
          <span style={{ fontSize: 42, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-ghost)" }}>{sub}</span>
        </div>

        {/* Dynamic Progress Bar & Context */}
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
  const { language, activePlot, userPlots, sensorData } = useApp();
  // Show the onboarded plot (first user-created plot), falling back to activePlot
  const displayPlot = userPlots.length > 0 ? userPlots[0] : activePlot;
  const crop = displayPlot ? CROP_PROFILES[displayPlot.crop] : null;

  if (!displayPlot || !crop) return null;

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 40, overflowY: "auto", height: "100%" }}>
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
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
        <div style={{ display: "flex", gap: 12, zIndex: 1 }}>
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="premium-card" 
          style={{ 
            gridColumn: "span 2", 
            background: "var(--accent-primary)",
            backgroundImage: "radial-gradient(ellipse at top right, var(--accent-secondary), transparent), radial-gradient(ellipse at bottom left, #10b981, transparent)",
            color: "#FFF",
            display: "flex",
            gap: 32,
            padding: 40,
            overflow: "hidden",
            border: "none"
          }}
        >
          {/* Decorative SVG doodle inside card */}
          <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.3, filter: "blur(14px)", zIndex: 0, transform: "rotate(-15deg)" }}>
            <DoodleLeaf size={350} color="#FFF" delay={0.5} />
          </div>
          <div style={{ position: "absolute", right: 200, bottom: -40, opacity: 0.2, filter: "blur(10px)", zIndex: 0 }}>
            <DoodleDrop size={200} color="#FFF" delay={2} />
          </div>


          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
               <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "6px 12px", borderRadius: 100, letterSpacing: "0.05em" }}>{tr("FARM EXPERT", language)}</span>
               <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFF", animation: "pulse 2s infinite" }} />
                  {tr("UPDATED JUST NOW", language)}
               </span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {tr("rainPredicted", language).split(".")[0]}.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, marginBottom: 32, maxWidth: "90%" }}>
              {tr("rainPredicted", language).split(".")[1]}.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ 
                  padding: "14px 24px", borderRadius: 100, border: "none", 
                  background: "#FFF", color: "var(--accent-primary)", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                {tr("smartSkip", language)}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.95 }}
                style={{ 
                  padding: "14px 24px", borderRadius: 100, border: "2px solid rgba(255,255,255,0.4)", 
                  background: "transparent", color: "#FFF", fontWeight: 700, fontSize: 14, cursor: "pointer" 
                }}
              >
                {tr("dismiss", language)}
              </motion.button>
            </div>
          </div>
          <div style={{
            width: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 1,
            background: "rgba(255,255,255,0.1)", borderRadius: 24, padding: 24, backdropFilter: "blur(10px)"
          }}>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}
              style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              12%
            </motion.div>
            <div style={{ fontSize: 12, fontWeight: 700, textAlign: "center", marginTop: 4, letterSpacing: "0.05em", opacity: 0.9 }}>{tr("estSavings", language).toUpperCase()}</div>
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ marginTop: 24 }}
            >
              <Zap color="#FFF" size={40} />
            </motion.div>
          </div>
        </motion.div>

        <MetricCard language={language} label={tr("soilMoisture", language)} value={sensorData.moisture} sub="%" icon={<Droplets size={24} />} delay={0.1} color="var(--accent-primary)" trend="+0.8%" />
        <MetricCard language={language} label={tr("soilTemp", language)} value={sensorData.temperature} sub="°C" icon={<Thermometer size={24} />} delay={0.2} color="var(--accent-primary)" trend="-1.2%" />
        <MetricCard language={language} label={tr("growthBio", language)} value="82" sub="%" icon={<Sprout size={24} />} delay={0.3} color="var(--accent-primary)" trend={tr("Strong", language)} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="premium-card" style={{ 
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            background: "linear-gradient(145deg, var(--bg-card), var(--bg-surface))", 
            border: "1px solid var(--border-line)",
            boxShadow: "var(--shadow-md)",
            position: "relative",
            overflow: "hidden"
        }}>
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
               <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{language === "ml" ? crop.labelMl : crop.label}</span> {tr("prices are currently strong. It might be a good time to prepare for harvest.", language)}
             </p>
           </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
