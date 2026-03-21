"use client";
import { useApp } from "@/context/AppContext";
import { 
  Bell, Settings, Search
} from "lucide-react";

export default function Topbar() {
  const { 
    plots, activePlot, setActivePlot, 
    notifications, sensorData 
  } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;
  const currentStatus = sensorData.moisture < 40 ? "Needs Water" : "Stable Health";

  return (
    <header style={{
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      background: "var(--bg-dark)",
      borderBottom: "1px solid var(--border-line)",
    }}>
      {/* Search / Status Area */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ position: "relative" }}>
          <Search size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 14, top: 12 }} />
          <input 
            type="text" 
            placeholder="Search Command..." 
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-line)",
              borderRadius: "10px",
              padding: "10px 16px 10px 42px",
              color: "var(--text-main)",
              width: 260,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "0 0 10px var(--accent-primary)" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>{currentStatus}</span>
        </div>
      </div>

      {/* Utilities */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Plot Selector */}
        <div style={{ display: "flex", gap: 4, background: "var(--bg-surface)", padding: 4, borderRadius: 10, border: "1px solid var(--border-line)" }}>
          {plots.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlot(p)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: activePlot?.id === p.id ? "var(--accent-primary)" : "transparent",
                color: activePlot?.id === p.id ? "#FFF" : "var(--text-dim)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: "var(--border-line)", margin: "0 4px" }} />

        {/* Notif / Settings */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ padding: 10, borderRadius: 10, position: "relative", border: "none" }}>
            <Bell size={20} color="var(--text-dim)" strokeWidth={2.5} />
            {unreadCount > 0 && (
              <div style={{ 
                position: "absolute", top: 4, right: 4, width: 8, height: 8, 
                background: "#EF4444", borderRadius: "50%", border: "2px solid var(--bg-surface)" 
              }} />
            )}
          </button>
          <button className="btn-secondary" style={{ padding: 10, borderRadius: 10, border: "none" }}>
            <Settings size={20} color="var(--text-dim)" strokeWidth={2.5} />
          </button>
        </div>

        {/* Avatar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, 
          paddingLeft: 12,
          borderLeft: "1px solid var(--border-line)",
          cursor: "pointer",
        }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 900 }}>RAVI SHARMA</div>
            <div style={{ fontSize: 10, color: "var(--accent-secondary)", fontWeight: 750, textTransform: "uppercase" }}>PREMIUM MEMBER</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "var(--accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 13, color: "#FFF",
            boxShadow: "0 4px 10px rgba(0, 209, 160, 0.2)",
          }}>
            RS
          </div>
        </div>
      </div>
    </header>
  );
}
