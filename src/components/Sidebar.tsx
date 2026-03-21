"use client";
import { useApp } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { 
  LayoutDashboard, Map, BarChart3, ShoppingBag, 
  BookMarked, LifeBuoy, Languages, LogOut, Leaf, Cloud
} from "lucide-react";

export default function Sidebar() {
  const { language, setLanguage, activePage, setActivePage, logout } = useApp();

  const NAV_ITEMS = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "fields", icon: <Map size={20} />, label: "My Fields" },
    { id: "analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { id: "market", icon: <ShoppingBag size={20} />, label: "Market" },
    { id: "diary", icon: <BookMarked size={20} />, label: "Diary" },
    { id: "support", icon: <LifeBuoy size={20} />, label: "Support" },
  ];

  return (
    <aside style={{
      width: 280,
      minWidth: 280,
      height: "100%",
      background: "var(--bg-dark)",
      borderRight: "1px solid var(--border-line)",
      display: "flex",
      flexDirection: "column",
      padding: "32px 20px",
      gap: 32,
      zIndex: 100,
    }}>
      {/* Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "var(--accent-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 16px -4px rgba(0, 209, 160, 0.4)",
        }}>
          <Leaf size={24} color="#FFF" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: "var(--text-main)", letterSpacing: "1px", textTransform: "uppercase" }}>
            AGROW
          </h1>
          <div style={{ fontSize: 10, color: "var(--text-ghost)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: -2 }}>
            Intelligence
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <div 
              key={item.id}
              className={`side-link ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id as any)}
            >
              {item.icon}
              <span style={{ fontSize: 14 }}>{tr(item.id, language)}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer / Utilities */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          padding: 16, borderRadius: 16,
          background: "var(--bg-surface)",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <Cloud size={20} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>28°C</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)" }}>Mostly Clear</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => setLanguage(language === "en" ? "ml" : "en")}
            className="btn-secondary" 
            style={{ flex: 1, padding: "10px", borderRadius: 10 }}
          >
            <Languages size={18} />
          </button>
          <button 
            onClick={logout}
            className="btn-secondary" 
            style={{ padding: "10px", borderRadius: 10, color: "#EF4444" }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
