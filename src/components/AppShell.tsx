"use client";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Dashboard from "@/components/pages/Dashboard";
import Analytics from "@/components/pages/Analytics";
import Fields from "@/components/pages/Fields";
import Market from "@/components/pages/Market";
import Diary from "@/components/pages/Diary";
import Support from "@/components/pages/Support";
import Onboarding from "@/components/pages/Onboarding";
import Login from "@/components/pages/Login";
import { useState, useEffect } from "react";

function PageContent() {
  const { activePage } = useApp();
  switch (activePage) {
    case "dashboard": return <Dashboard />;
    case "analytics": return <Analytics />;
    case "fields": return <Fields />;
    case "market": return <Market />;
    case "diary": return <Diary />;
    case "support": return <Support />;
    default: return <Dashboard />;
  }
}

export default function AppShell() {
  const { onboarded, isAuthenticated } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setShowOnboarding(!onboarded);
  }, [onboarded]);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      background: "var(--bg-dark)",
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <main style={{ 
          flex: 1, 
          overflowY: "auto", 
          overflowX: "hidden",
          background: "var(--bg-dark)",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: 800,
            height: 800,
            background: "radial-gradient(circle, rgba(0, 209, 160, 0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
            pointerEvents: "none",
            zIndex: -1,
          }} />
          <PageContent />
        </main>
      </div>
    </div>
  );
}
