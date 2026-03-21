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
import Settings from "@/components/pages/Settings";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DoodleLeaf, DoodleWheat, DoodleDrop, DoodleSun, DoodleStar, DoodleLine } from "@/components/Doodles";

function LoadingScreen() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "var(--bg-dark)", /* Dark aesthetic for loading */
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 32,
    }}>
      {/* Smooth minimal thick spinner */}
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg
          width="64" height="64"
          viewBox="0 0 64 64"
          style={{ animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite", display: "block" }}
        >
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <circle
             cx="32" cy="32" r="26"
             fill="none"
             stroke="var(--accent-primary)"
             strokeWidth="8"
             strokeLinecap="round"
             strokeDasharray="163"
             strokeDashoffset="120"
          />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function PageContent({ activePage }: { activePage: string }) {
  const contentMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    analytics: <Analytics />,
    fields: <Fields />,
    market: <Market />,
    diary: <Diary />,
    support: <Support />,
    settings: <Settings />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePage}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ flex: 1, height: "100%" }}
      >
        {contentMap[activePage] || <Dashboard />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function AppShell() {
  const { onboarded, isAuthenticated, activePage } = useApp();

  // Prevents hydration flicker: don't render anything until client has read state
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  if (!hydrated) return <LoadingScreen />;
  if (!isAuthenticated) return <Login />;
  if (!onboarded) return <Onboarding onComplete={() => {}} />;

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
          background: "var(--bg-surface)",
          position: "relative",
          zIndex: 1,
        }}>
          {/* massive blurred theme circles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: "-10%", right: "-10%", width: "50%", height: "50%", background: "var(--accent-primary)", borderRadius: "50%", filter: "blur(180px)", zIndex: 0, opacity: 0.2, pointerEvents: "none", willChange: "transform, filter", transform: "translateZ(0)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: "absolute", bottom: "-5%", left: "-10%", width: "60%", height: "60%", background: "var(--accent-secondary)", borderRadius: "50%", filter: "blur(150px)", zIndex: 0, opacity: 0.15, pointerEvents: "none", willChange: "transform, filter", transform: "translateZ(0)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ position: "absolute", top: "30%", left: "30%", width: "40%", height: "40%", background: "#4285F4", borderRadius: "50%", filter: "blur(200px)", zIndex: 0, opacity: 0.08, pointerEvents: "none", willChange: "transform, filter", transform: "translateZ(0)" }}
          />

          <div style={{ position: "absolute", top: "10%", right: "8%", zIndex: 0, opacity: 0.2, filter: "blur(12px)", pointerEvents: "none" }}>
            <DoodleLeaf size={250} color="var(--accent-primary)" delay={0} />
          </div>
          <div style={{ position: "absolute", bottom: "15%", left: "6%", zIndex: 0, opacity: 0.15, filter: "blur(16px)", pointerEvents: "none" }}>
            <DoodleWheat size={220} color="var(--accent-secondary)" delay={1} />
          </div>
          <div style={{ position: "absolute", top: "40%", right: "20%", zIndex: 0, opacity: 0.1, filter: "blur(14px)", pointerEvents: "none" }}>
            <DoodleDrop size={180} color="var(--text-ghost)" delay={2} />
          </div>
          <div style={{ position: "absolute", top: "5%", left: "40%", zIndex: 0, opacity: 0.15, filter: "blur(10px)", pointerEvents: "none" }}>
            <DoodleSun size={150} color="var(--accent-primary)" delay={3} />
          </div>

          <div style={{ position: "absolute", top: "25%", left: "15%", zIndex: 0, opacity: 0.3, pointerEvents: "none", filter: "blur(0px)" }}>
            <DoodleStar size={60} color="var(--accent-secondary)" delay={1.5} />
          </div>
          <div style={{ position: "absolute", bottom: "35%", right: "12%", zIndex: 0, opacity: 0.3, pointerEvents: "none", filter: "blur(0px)" }}>
            <DoodleStar size={40} color="var(--accent-primary)" delay={0.5} />
          </div>
          <div style={{ position: "absolute", bottom: "10%", right: "40%", zIndex: 0, opacity: 0.2, pointerEvents: "none" }}>
            <DoodleLine width={300} color="var(--accent-primary)" delay={0} />
          </div>
          <PageContent activePage={activePage} />
        </main>
      </div>
    </div>
  );
}
