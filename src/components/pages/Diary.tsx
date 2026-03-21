"use client";
import { useApp } from "@/context/AppContext";
import { BookOpen, Plus, Search, Calendar, ShieldCheck, Zap, Droplets } from "lucide-react";
import { tr } from "@/lib/translations";

interface DiaryEntry {
  id: string;
  type: "irrigation" | "fertilizer" | "harvest" | "observation";
  title: string;
  message: string;
  timestamp: Date;
  plotId: string;
}

const ENTRIES: DiaryEntry[] = [
  { id: "e1", type: "irrigation", title: "Watering Cycle", message: "Watering completed in 45 mins. 450L used.", timestamp: new Date(Date.now() - 3600000), plotId: "p1" },
  { id: "e2", type: "fertilizer", title: "Fertilizer Added", message: "Added 2.4kg of fertilizer.", timestamp: new Date(Date.now() - 86400000), plotId: "p1" },
  { id: "e3", type: "observation", title: "Growth Check", message: "Crop is growing well after the rain.", timestamp: new Date(Date.now() - 172800000), plotId: "p1" },
];

export default function Diary() {
  const { activePlot, language } = useApp();

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32, overflowY: "auto", height: "100%" }}>
      <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
           <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1E293B", letterSpacing: "-0.04em" }}>
              {tr("FARM DIARY", language)}
           </h1>
           <p style={{ color: "var(--text-dim)", marginTop: 4 }}>{tr("History for", language)} {activePlot?.name}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
           <button className="btn-secondary">{tr("Export Log", language)}</button>
           <button className="btn-primary">
              <Plus size={18} /> {tr("New Entry", language)}
           </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
         <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ position: "relative", marginBottom: 16 }}>
               <Search size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 16, top: 14 }} />
               <input 
                 type="text" 
                 placeholder={tr("Search logs...", language)} 
                 className="premium-card"
                 style={{ width: "100%", padding: "14px 16px 14px 48px", outline: "none", borderRadius: 14 }}
               />
            </div>

            {ENTRIES.map((entry, i) => (
               <div key={entry.id} className="premium-card reveal" style={{ 
                 animationDelay: `${0.1 + i*0.1}s`,
                 display: "flex", gap: 20
               }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: entry.type === 'irrigation' ? 'rgba(0, 166, 126, 0.1)' : 'rgba(0,0,0,0.03)',
                    color: entry.type === 'irrigation' ? 'var(--accent-primary)' : 'var(--text-dim)',
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                     {entry.type === 'irrigation' ? <Droplets size={24} /> : <BookOpen size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontSize: 16, fontWeight: 800 }}>{tr(entry.title, language)}</div>
                        <div style={{ fontSize: 11, color: "var(--text-ghost)", fontWeight: 700 }}>{entry.timestamp.toLocaleDateString()}</div>
                     </div>
                     <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.5 }}>{tr(entry.message, language)}</p>
                     
                     <div style={{ 
                       marginTop: 16, display: "flex", gap: 12, 
                       paddingTop: 16, borderTop: "1px solid var(--border-line)"
                     }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                           <Calendar size={12} color="var(--text-ghost)" />
                           <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text-ghost)", textTransform: "uppercase" }}>{tr("SAVED", language)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                           <ShieldCheck size={12} color="var(--accent-secondary)" />
                           <span style={{ fontSize: 10, fontWeight: 800, color: "var(--accent-secondary)", textTransform: "uppercase" }}>{tr("VERIFIED", language)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <div className="reveal" style={{ animationDelay: "0.2s" }}>
            <div className="premium-card" style={{ padding: 24, textAlign: "center", background: "var(--bg-surface)" }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: 20, 
                  background: "#FFF", margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-primary)", boxShadow: "var(--shadow-md)"
                }}>
                   <Zap size={32} />
                </div>
                <div className="text-label" style={{ color: "var(--accent-primary)" }}>{tr("Farmio Assistant", language)}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "12px 0 8px" }}>{tr("Weekly Summary", language)}</h3>
                <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 24 }}>
                  {tr("Crop growth has improved this week. No pests or diseases found.", language)}
                </p>
                <button className="btn-secondary" style={{ width: "100%", borderRadius: 12 }}>{tr("Refresh Summary", language)}</button>
            </div>
         </div>
      </div>
    </div>
  );
}
