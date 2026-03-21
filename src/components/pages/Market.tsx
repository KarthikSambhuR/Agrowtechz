"use client";
import { useApp, CROP_PROFILES } from "@/context/AppContext";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Cell, 
} from "recharts";
import { 
  TrendingUp, TrendingDown, ArrowRight, Globe, Package
} from "lucide-react";

const MARKET_DATA = [
  { crop: "Pineapple", price: 4290, trend: 12.5, unit: " /Quintal", flag: "up" },
  { crop: "Rubber", price: 19800, trend: 3.2, unit: " /Quintal", flag: "up" },
  { crop: "Spices", price: 48000, trend: -2.1, unit: " /Quintal", flag: "down" },
  { crop: "Coffee", price: 33500, trend: 8.7, unit: " /Quintal", flag: "up" },
  { crop: "Palm Oil", price: 10200, trend: 1.5, unit: " /Quintal", flag: "up" },
  { crop: "Rice", price: 2350, trend: -0.8, unit: " /Quintal", flag: "down" },
];

const BAR_DATA = MARKET_DATA.map(m => ({
  name: m.crop.substring(0, 4),
  price: m.price,
  flag: m.flag,
}));

export default function Market() {
  const { language, activePlot } = useApp();
  const crop = activePlot ? CROP_PROFILES[activePlot.crop] : null;

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32, overflowY: "auto", height: "100%" }}>
      <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
           <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1E293B", letterSpacing: "-0.04em" }}>
              GLOBAL TRADE TERMINAL
           </h1>
           <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Live agricultural commodity analytics</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
           <button className="btn-secondary">Export Data</button>
           <button className="btn-primary">View Market Trends</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
         <div className="premium-card reveal" style={{ animationDelay: "0.1s" }}>
            <div className="text-label" style={{ marginBottom: 24 }}>Cross-Commodity Pricing Index</div>
            <div style={{ height: 300 }}>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BAR_DATA} barSize={40}>
                     <CartesianGrid stroke="rgba(0,0,0,0.02)" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--text-ghost)", fontSize: 11 }} />
                     <Tooltip 
                        contentStyle={{ background: "#FFF", border: "1px solid var(--border-line)", borderRadius: 10 }}
                     />
                     <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                        {BAR_DATA.map((entry, i) => (
                           <Cell key={`cell-${i}`} fill={entry.flag === 'up' ? 'var(--accent-primary)' : '#F87171'} fillOpacity={0.8} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="premium-card reveal" style={{ animationDelay: "0.2s", display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="text-label" style={{ marginBottom: 4 }}>Price Volatility List</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
               {MARKET_DATA.slice(0,5).map(item => (
                  <div key={item.crop} style={{ 
                    padding: 16, borderRadius: 14, background: "var(--bg-surface)", 
                    border: "1px solid var(--border-line)",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                     <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           {item.flag === 'up' ? <TrendingUp size={16} color="var(--accent-primary)" /> : <TrendingDown size={16} color="#F87171" />}
                        </div>
                        <div>
                           <div style={{ fontSize: 13, fontWeight: 800 }}>{item.crop}</div>
                           <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700 }}>₹{item.price.toLocaleString("en-IN")}</div>
                        </div>
                     </div>
                     <div style={{ 
                       fontSize: 12, fontWeight: 900, 
                       color: item.flag === 'up' ? "var(--accent-secondary)" : "#F87171" 
                     }}>
                        {item.flag === 'up' ? '+' : '-'}{Math.abs(item.trend)}%
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {crop && activePlot && (
        <div className="premium-card reveal" style={{ 
          animationDelay: "0.3s", 
          background: "var(--accent-soft)",
          borderColor: "var(--accent-primary)"
        }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                 <div className="text-label" style={{ color: "var(--accent-secondary)" }}>Impact Analysis: {language === 'ml' ? crop.labelMl : crop.label}</div>
                 <h2 className="outfit" style={{ fontSize: 24, fontWeight: 900 }}>Production Potential</h2>
              </div>
              <button className="btn-primary">Trade Strategy <ArrowRight size={16} /></button>
           </div>
           
           <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "SPOT RATE", val: `₹${crop.basePrice.toLocaleString("en-IN")}`, icon: <Globe size={18} /> },
                { label: "EST. HARVEST", val: `${(activePlot.area * crop.baseYield).toFixed(1)} Tons`, icon: <Package size={18} /> },
                { label: "MARKET ALPHA", val: `+12.4%`, icon: <TrendingUp size={18} /> },
                { label: "CONFIDENCE", val: "94.2%", icon: <ArrowRight size={18} /> },
              ].map((item, i) => (
                <div key={i} style={{ padding: 16, background: "#FFF", borderRadius: 12, border: "1px solid var(--border-line)" }}>
                   <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      {item.icon} {item.label}
                   </div>
                   <div style={{ fontSize: 20, fontWeight: 800 }}>{item.val}</div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
