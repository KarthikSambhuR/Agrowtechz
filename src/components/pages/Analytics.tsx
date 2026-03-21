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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-line)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-ghost)" }} />
                    <Tooltip 
                      contentStyle={{ background: "#FFF", border: "1px solid var(--border-line)", borderRadius: 10 }}
                    />
                    <Area type="monotone" dataKey="price" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="premium-card reveal" style={{ animationDelay: "0.2s", display: "flex", flexDirection: "column", gap: 24 }}>
           <div>
              <div className="text-label">{tr("Time to Harvest", language)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                 <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)" }}>
                    <Timer size={24} />
                 </div>
                 <div className="text-value" style={{ fontSize: 24 }}>{daysToHarvest} <span style={{ fontSize: 12, color: "var(--text-ghost)" }}>{tr("DAYS LEFT", language)}</span></div>
              </div>
           </div>

           <div>
              <div className="text-label">{tr("Crop Progress", language)}</div>
              <div style={{ height: 8, background: "var(--bg-surface)", borderRadius: 4, overflow: "hidden", marginTop: 12 }}>
                 <div style={{ width: `${(daysPlanted/totalDays)*100}%`, height: "100%", background: "var(--accent-primary)" }} />
              </div>
           </div>

           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-surface)" }}>
                 <div className="text-label" style={{ fontSize: 9 }}>{tr("HEALTH", language)}</div>
                 <div style={{ fontSize: 16, fontWeight: 800 }}>{tr("Optimal", language)}</div>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-surface)" }}>
                 <div className="text-label" style={{ fontSize: 9 }}>{tr("STABILITY", language)}</div>
                 <div style={{ fontSize: 16, fontWeight: 800 }}>{tr("High", language)}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="reveal" style={{ animationDelay: "0.3s" }}>
         <div className="text-label" style={{ marginBottom: 16 }}>{tr("Growth Stages", language)}</div>
         <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {crop.stages.map((stage, i) => {
               const isCurrent = i === currentStageIdx;
               const isDone = i < currentStageIdx;
               return (
                  <div key={i} className="premium-card" style={{ 
                    padding: 16, 
                    borderColor: isCurrent ? "var(--accent-primary)" : "var(--border-line)",
                    background: isCurrent ? "var(--accent-soft)" : "#FFF",
                    opacity: isDone ? 0.6 : 1
                  }}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: "var(--text-ghost)" }}>{tr("STAGE", language)} 0{i+1}</span>
                        {isDone && <ShieldCheck size={14} color="var(--accent-secondary)" />}
                     </div>
                     <div style={{ fontSize: 16, fontWeight: 800 }}>{tr(stage.name, language)}</div>
                     <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>{tr("Day", language)} {stage.startDay}-{stage.endDay}</div>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
