"use client";
import { useApp } from "@/context/AppContext";
import { 
  Bell, Settings, Search, Menu
} from "lucide-react";
import { tr } from "@/lib/translations";
import { motion } from "framer-motion";

export default function Topbar() {
  const { 
    plots, activePlot, setActivePlot, setActivePage,
    notifications, sensorData, language
  } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;
  const currentStatus = sensorData.moisture < 40 ? tr("Needs Water", language) : tr("Healthy", language);

  return (
    <header style={{
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      background: "var(--bg-glass)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid var(--border-line)",
      zIndex: 50,
      position: "sticky",
      top: 0,
    }}>
      {/* Search / Status Area */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <button className="btn-secondary" style={{ padding: 10, border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Menu size={20} color="var(--text-dim)" />
        </button>
        <div style={{ position: "relative" }}>
          <Search size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder={tr("Search Farmio...", language)} 
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-line)",
              borderRadius: "100px",
              padding: "12px 16px 12px 48px",
              color: "var(--text-main)",
              width: 340,
              fontSize: 15,
              outline: "none",
              fontWeight: 500,
              boxShadow: "var(--shadow-sm)",
              transition: "box-shadow 0.2s, width 0.2s"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", padding: "8px 16px", borderRadius: 100, border: "1px solid var(--border-line)", boxShadow: "var(--shadow-sm)" }}>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "0 0 12px var(--accent-primary)" }} 
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>{currentStatus}</span>
        </div>
      </div>

      {/* Utilities */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Plot Selector */}
        <div style={{ display: "flex", gap: 4, background: "var(--bg-surface)", padding: 4, borderRadius: 100, marginRight: 12 }}>
          {plots.map(p => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={p.id}
              onClick={() => setActivePlot(p)}
              style={{
                padding: "8px 16px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: activePlot?.id === p.id ? "var(--bg-dark)" : "transparent",
                color: activePlot?.id === p.id ? "var(--text-main)" : "var(--text-dim)",
                boxShadow: activePlot?.id === p.id ? "var(--shadow-sm)" : "none",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {p.name}
            </motion.button>
          ))}
        </div>

        {/* Notif / Settings */}
        <motion.button whileHover={{ backgroundColor: "rgba(60,64,67,0.04)" }} whileTap={{ scale: 0.95 }} style={{ padding: 10, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", position: "relative" }}>
          <Bell size={22} color="var(--text-dim)" />
          {unreadCount > 0 && (
            <div style={{ 
              position: "absolute", top: 8, right: 8, width: 8, height: 8, 
              background: "#EA4335", borderRadius: "50%", border: "2px solid var(--bg-dark)" 
            }} />
          )}
        </motion.button>
        <motion.button onClick={() => setActivePage("settings")} whileHover={{ backgroundColor: "rgba(60,64,67,0.04)" }} whileTap={{ scale: 0.95 }} style={{ padding: 10, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", marginRight: 8 }}>
          <Settings size={22} color="var(--text-dim)" />
        </motion.button>

        {/* Avatar */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
          display: "flex", alignItems: "center", gap: 12, 
          paddingLeft: 16,
          borderLeft: "1px solid var(--border-line)",
          cursor: "pointer",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, color: "var(--bg-dark)",
            boxShadow: "0 4px 12px var(--accent-glow)",
            border: "2px solid var(--bg-card)"
          }}>
            RS
          </div>
        </motion.div>
      </div>
    </header>
  );
}
