"use client";
import { useApp } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { 
  LayoutDashboard, Map, BarChart3, Store, BookOpen, LifeBuoy, Sprout, LogOut, Moon, Sun, ShoppingBag, BookMarked, Leaf, Cloud, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const { activePage, setActivePage, logout, language, setLanguage, theme, setTheme } = useApp();

  const NAV_ITEMS = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "fields", icon: <Map size={20} />, label: "My Fields" },
    { id: "analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { id: "recommendations", icon: <Sparkles size={20} />, label: "AI Advisor", highlight: true },
    { id: "market", icon: <ShoppingBag size={20} />, label: "Market" },
    { id: "diary", icon: <BookMarked size={20} />, label: "Diary" },
    { id: "support", icon: <LifeBuoy size={20} />, label: "Support" },
  ];

  return (
    <aside style={{
      width: 280,
      minWidth: 280,
      height: "100%",
      background: "var(--bg-surface)", // Use surface color
      borderRight: "1px solid var(--border-line)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      gap: 32,
      zIndex: 100,
    }}>
      {/* Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 12 }}>
        <motion.div 
          whileHover={{ rotate: 15 }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: "var(--accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Leaf size={24} color="#FFF" strokeWidth={2.5} />
        </motion.div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em" }}>
            Farmio
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          const isHighlight = (item as any).highlight;
          return (
            <motion.div 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              key={item.id}
              className={`side-link ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id as any)}
              style={{
                position: "relative",
                ...(isHighlight && !isActive ? {
                  background: "linear-gradient(90deg, rgba(0,166,126,0.08), rgba(0,166,126,0.04))",
                  border: "1px solid rgba(0,166,126,0.2)",
                  borderRadius: 100,
                } : {}),
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 100,
                    background: "var(--accent-soft)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {item.icon}
              <span style={{ fontSize: 14 }}>{tr(item.id, language)}</span>
              {isHighlight && !isActive && (
                <span style={{
                  marginLeft: "auto",
                  fontSize: 9, fontWeight: 900, letterSpacing: "0.06em",
                  padding: "2px 7px", borderRadius: 100,
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  color: "#FFF",
                }}>AI</span>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Footer / Utilities */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          padding: "16px 20px", borderRadius: 20,
          background: "var(--bg-dark)",
          border: "1px solid var(--border-line)",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <Cloud size={24} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>28°C</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 500 }}>{tr("Mostly Clear", language)}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }} />
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "var(--bg-surface)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ width: 44, minWidth: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-line)", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "var(--accent-soft)" }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            style={{ width: 44, minWidth: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", color: "#EA4335", border: "1px solid rgba(234, 67, 53, 0.4)", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
