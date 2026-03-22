"use client";
import { useApp, CROP_PROFILES } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid
} from "recharts";
import { 
  Timer, ShieldCheck
} from "lucide-react";

export default function Analytics() {
  const { language, activePlot, daysPlanted, marketPrices } = useApp();
  const crop = activePlot ? CROP_PROFILES[activePlot.crop] : null;

  if (!activePlot || !crop) return null;

  const currentStageIdx = Math.min(
    Math.floor((daysPlanted / crop.growthDays) * crop.stages.length),
    crop.stages.length - 1
  );
  const totalDays = crop.growthDays;
  const daysToHarvest = Math.max(0, totalDays - daysPlanted);
  const revenueEst = activePlot.area * crop.baseYield * crop.basePrice;

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32, overflowY: "auto", height: "100%" }}>
      <div className="reveal">
         <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            {tr("FARM INSIGHTS", language)}
         </h1>
         <p style={{ color: "var(--text-dim)", marginTop: 4 }}>{tr("Checking progress for", language)} {activePlot.name}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div className="premium-card reveal" style={{ animationDelay: "0.1s" }}>
           <div className="text-label">{tr("Expected Income", language)}</div>
           <div className="text-value" style={{ marginBottom: 32 }}>
              ₹{(revenueEst / 1000).toFixed(0)}k <span style={{ color: "var(--accent-secondary)", fontSize: 14 }}>{tr("+12.4% over average", language)}</span>
           </div>
           
           <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={marketPrices}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-line)" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-ghost)", fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-line)", borderRadius: 12, boxShadow: "var(--shadow-md)" }}
                      labelStyle={{ color: "var(--text-main)", fontWeight: 800, fontSize: 13 }}
                      itemStyle={{ color: "var(--accent-primary)", fontWeight: 700, fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="price" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="premium-card reveal" style={{ animationDelay: "0.2s", display: "flex", flexDirection: "column" }}>
           <div>
              <div className="text-label" style={{ color: "var(--text-ghost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>{tr("Time to Harvest", language)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                 <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg-surface)", border: "1px solid var(--border-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)" }}>
                    <Timer size={24} />
                 </div>
                 <div className="text-value" style={{ fontSize: 28, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em" }}>{daysToHarvest} <span style={{ fontSize: 12, color: "var(--text-ghost)", letterSpacing: "0.05em" }}>{tr("DAYS LEFT", language)}</span></div>
              </div>
           </div>

           <div style={{ marginTop: 24 }}>
              <div className="text-label" style={{ color: "var(--text-ghost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>{tr("Crop Progress", language)}</div>
              <div style={{ height: 10, background: "var(--bg-surface)", border: "1px solid var(--border-line)", borderRadius: 100, overflow: "hidden", marginTop: 12 }}>
                 <div style={{ width: `${Math.min(100, (daysPlanted/totalDays)*100)}%`, height: "100%", background: "var(--accent-primary)", borderRadius: 100 }} />
              </div>
           </div>

           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: "auto" }}>
              <div style={{ padding: 16, borderRadius: 14, background: "var(--bg-surface)", border: "1px solid var(--border-line)" }}>
                 <div className="text-label" style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase" }}>{tr("HEALTH", language)}</div>
                 <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-primary)", marginTop: 4 }}>{tr("Optimal", language)}</div>
              </div>
              <div style={{ padding: 16, borderRadius: 14, background: "var(--bg-surface)", border: "1px solid var(--border-line)" }}>
                 <div className="text-label" style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase" }}>{tr("STABILITY", language)}</div>
                 <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-secondary)", marginTop: 4 }}>{tr("High", language)}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="reveal" style={{ animationDelay: "0.3s" }}>
         <div className="text-label" style={{ color: "var(--text-ghost)", fontSize: 12, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>{tr("Growth Stages", language)}</div>
         <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {crop.stages.map((stage, i) => {
               const isCurrent = i === currentStageIdx;
               const isDone = i < currentStageIdx;
               return (
                  <div key={i} className="premium-card" style={{ 
                    padding: 20, 
                    borderRadius: 20,
                    borderColor: isCurrent ? "var(--accent-primary)" : "var(--border-line)",
                    background: isCurrent ? "rgba(16, 185, 129, 0.05)" : "var(--bg-card)",
                    opacity: isDone ? 0.4 : 1,
                    boxShadow: isCurrent ? "0 4px 20px rgba(16, 185, 129, 0.1)" : "none",
                    borderWidth: isCurrent ? 2 : 1
                  }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: isCurrent ? "var(--accent-primary)" : "var(--text-ghost)", letterSpacing: "1px" }}>{tr("STAGE", language)} 0{i+1}</span>
                        {isDone && <ShieldCheck size={16} color="var(--accent-primary)" />}
                     </div>
                     <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)" }}>{tr(stage.name, language)}</div>
                     <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginTop: 6 }}>{tr("Day", language)} {stage.startDay}-{stage.endDay}</div>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
