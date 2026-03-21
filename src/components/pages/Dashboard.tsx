"use client";
import { useApp, CROP_PROFILES } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { 
  Droplets, Thermometer, ArrowUpRight, Sprout, TrendingUp, Zap
} from "lucide-react";

function MetricCard({ 
  label, value, sub, icon, color = "var(--accent-primary)", delay = "0s", trend = "+2.4%" 
}: any) {
  return (
    <div className="premium-card reveal" style={{ animationDelay: delay, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: 12, 
          background: "var(--bg-surface)", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          color, border: "1px solid var(--border-line)" 
        }}>
          {icon}
        </div>
        <div style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(34,197,94,0.1)", color: "#16a34a", fontSize: 11, fontWeight: 700 }}>
          {trend}
        </div>
      </div>
      <div>
        <div className="text-label" style={{ marginBottom: 4 }}>{label}</div>
        <div className="text-value" style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          {value}
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-ghost)" }}>{sub}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { language, activePlot, sensorData } = useApp();
  const crop = activePlot ? CROP_PROFILES[activePlot.crop] : null;

  if (!activePlot || !crop) return null;

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32, overflowY: "auto", height: "100%" }}>
      {/* Header section */}
      <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            WELCOME TO YOUR CONTROL CENTER.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-dim)", marginTop: 8, fontWeight: 500 }}>
            {tr("hello", language)}, Ravi Sharma. Your {language === "ml" ? crop.labelMl : crop.label} {tr("yourPlot", language).toLowerCase()} 
            <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}> is optimal.</span>
          </p>
        </div>
        <button className="btn-primary" style={{ boxShadow: "0 8px 16px -4px rgba(0, 209, 160, 0.3)" }}>
          FULL REPORT <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        <div className="premium-card reveal" style={{ 
          gridColumn: "span 2", 
          background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
          color: "#FFF",
          display: "flex",
          gap: 32,
          padding: 32,
          animationDelay: "0.1s"
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
               <span style={{ fontSize: 10, fontWeight: 900, background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: 4 }}>AI ASSISTANT</span>
               <span style={{ fontSize: 11, fontWeight: 600 }}>CONNECTED VIA SAT-LINK</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
              Significant Rain Probability (82%) <br /> within the next 48 hours.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, marginBottom: 24 }}>
              System recommends skipping current irrigation cycles. Estimated water savings: <span style={{ fontWeight: 800 }}>12,400L.</span>
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ 
                padding: "12px 20px", borderRadius: 10, border: "none", 
                background: "#000", color: "#FFF", fontWeight: 700, fontSize: 12, cursor: "pointer" 
              }}>ACTIVATE SMART SKIP</button>
              <button style={{ 
                padding: "12px 20px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.4)", 
                background: "transparent", color: "#FFF", fontWeight: 700, fontSize: 12, cursor: "pointer" 
              }}>DISMISS ALERT</button>
            </div>
          </div>
          <div style={{
            width: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 32
          }}>
            <div style={{ fontSize: 40, fontWeight: 900 }}>12%</div>
            <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 4 }}>EST. SAVINGS</div>
            <div style={{ marginTop: 24 }}>
              <Zap color="#FFF" size={32} />
            </div>
          </div>
        </div>

        <MetricCard label="Soil Moisture" value={sensorData.moisture} sub="%" icon={<Droplets size={24} />} delay="0.2s" color="var(--accent-primary)" trend="+0.8%" />
        <MetricCard label="Soil Temp" value={sensorData.temperature} sub="°C" icon={<Thermometer size={24} />} delay="0.3s" color="#F87171" trend="-1.2%" />
        <MetricCard label="Growth Bio" value="82" sub="%" icon={<Sprout size={24} />} delay="0.4s" color="#8B5CF6" trend="Strong" />
        
        <div className="premium-card reveal" style={{ 
          animationDelay: "0.5s", display: "flex", flexDirection: "column", justifyContent: "space-between",
          background: "var(--bg-surface)", borderStyle: "dashed", borderColor: "var(--accent-primary)"
        }}>
           <div>
            <div className="text-label" style={{ color: "var(--accent-primary)" }}>Resource Performance</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
              <div className="outfit" style={{ fontSize: 40, fontWeight: 900 }}>₹4.2k</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-secondary)" }}>Net Profit Track</span>
            </div>
           </div>
           
           <div style={{ background: "#FFF", padding: 12, borderRadius: 10, border: "1px solid var(--border-line)" }}>
             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
               <TrendingUp size={16} color="var(--accent-secondary)" />
               <span style={{ fontSize: 12, fontWeight: 800 }}>MARKET BULLISH (+12.4%)</span>
             </div>
             <p style={{ fontSize: 11, color: "var(--text-ghost)", lineHeight: 1.4 }}>
               Recent trade spikes in {activePlot.crop} export markets favor immediate harvest preparation.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
