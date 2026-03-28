"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Mail, Lock, X } from "lucide-react";
import { tr } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { login, language } = useApp();
  const [email, setEmail] = useState("farmer@farmer.in");
  const [password, setPassword] = useState("EricGeoKarthik@YIP1stPlace");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleSubmit = (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    setError("");
    setLoading(true);
    
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError(tr("Invalid credentials or access code.", language));
        setLoading(false);
      }
    }, 800);
  };

  const inputStyle = {
    width: "100%", padding: "16px 16px 16px 44px", 
    background: "var(--bg-surface)", 
    border: "1px solid var(--border-line)", 
    borderRadius: 14, fontSize: 14, fontWeight: 600, color: "var(--text-main)",
    outline: "none", transition: "all 0.2s ease"
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-surface)", position: "relative", overflow: "hidden"
    }}>
      {/* Massive ambient blurred mesh gradients */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, -60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-20%", right: "-10%", width: "70vw", height: "70vh", background: "var(--accent-primary)", borderRadius: "50%", filter: "blur(200px)", zIndex: 0, opacity: 0.25, pointerEvents: "none" }}
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], x: [0, -80, 0], y: [0, 80, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "80vw", height: "80vh", background: "var(--accent-secondary)", borderRadius: "50%", filter: "blur(250px)", zIndex: 0, opacity: 0.2, pointerEvents: "none" }}
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ position: "absolute", top: "20%", left: "30%", width: "50vw", height: "50vh", background: "#4285F4", borderRadius: "50%", filter: "blur(250px)", zIndex: 0, opacity: 0.1, pointerEvents: "none" }}
      />

      {/* Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          width: "100%", maxWidth: 420,
          background: "var(--bg-card)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: 32, padding: 32,
          boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
          border: "1px solid var(--border-line)",
          position: "relative", zIndex: 10
        }}
      >
        {/* Top Header Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          {/* Segmented Control */}
          <div style={{ display: "flex", background: "var(--bg-surface)", border: "1px solid var(--border-line)", borderRadius: 100, padding: 4 }}>
            <button onClick={() => setMode("signup")} style={{ padding: "14px 24px", borderRadius: 100, background: mode === "signup" ? "var(--text-main)" : "transparent", color: mode === "signup" ? "var(--bg-dark)" : "var(--text-dim)", fontSize: 13, fontWeight: 700, transition: "all 0.2s", border: "none", cursor: "pointer" }}>{tr("Sign up", language)}</button>
            <button onClick={() => setMode("signin")} style={{ padding: "14px 24px", borderRadius: 100, background: mode === "signin" ? "var(--text-main)" : "transparent", color: mode === "signin" ? "var(--bg-dark)" : "var(--text-dim)", fontSize: 13, fontWeight: 700, transition: "all 0.2s", border: "none", cursor: "pointer" }}>{tr("Sign in", language)}</button>
          </div>
          <button style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--border-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-main)", border: "none", cursor: "pointer", transition: "background 0.2s" }}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-main)", marginBottom: 28, letterSpacing: "-0.03em" }}>
          {mode === "signin" ? tr("Welcome back", language) : tr("Create an account", language)}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ display: "flex", gap: 12 }}>
              <input placeholder={tr("First name", language)} style={{ ...inputStyle, padding: "16px" }} onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; }} onBlur={e => { e.currentTarget.style.borderColor = "var(--border-line)"; }} />
              <input placeholder={tr("Last name", language)} style={{ ...inputStyle, padding: "16px" }} onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; }} onBlur={e => { e.currentTarget.style.borderColor = "var(--border-line)"; }} />
            </motion.div>
          )}
          
          <div style={{ position: "relative" }}>
            <Mail size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input type="email" value={mode === "signin" ? email : ""} onChange={e => setEmail(e.target.value)} placeholder={tr("Enter your email", language)} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; }} onBlur={e => { e.currentTarget.style.borderColor = "var(--border-line)"; }} />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input type="password" value={mode === "signin" ? password : ""} onChange={e => setPassword(e.target.value)} placeholder={tr("Password", language)} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; }} onBlur={e => { e.currentTarget.style.borderColor = "var(--border-line)"; }} />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} style={{ color: "#EF4444", fontSize: 13, fontWeight: 700, textAlign: "center", padding: "8px 0" }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} type="submit" style={{ width: "100%", padding: 18, background: "var(--text-main)", color: "var(--bg-dark)", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
            {mode === "signin" ? (loading ? tr("Signing in...", language) : tr("Sign in", language)) : tr("Create an account", language)}
          </motion.button>
        </form>

        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: 12, opacity: 0.5 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-strong)" }} />
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{tr("Or sign in with", language)}</div>
          <div style={{ flex: 1, height: 1, background: "var(--border-strong)" }} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: 16, background: "var(--bg-surface)", border: "1px solid var(--border-line)", borderRadius: 14, cursor: "pointer", display: "flex", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </motion.button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: 16, background: "var(--bg-surface)", border: "1px solid var(--border-line)", borderRadius: 14, cursor: "pointer", display: "flex", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", color: "var(--text-main)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.08.45-2.06.67-2.93-.24C3.89 16.32 2.86 9.58 6.94 6.72c1.24-.86 2.51-.95 3.38-.98 1.4-.04 2.65.65 3.41 1.04.88.45 2.55 1.3 4.29.98 1.09-.2 1.94-.55 2.76-1.12.33 1.25-.13 2.56-1.19 3.55-1.06.99-2.29 1.4-3.4 1.46-.03 1.25.43 2.23 1.05 2.95 1.07 1.25 2.55 1.6 2.92 1.67-.09.32-.68 2.26-2.08 4.01zM15.11 5.37c.72-.88 1.15-2.09.95-3.37-1.15.12-2.47.8-3.28 1.76-.68.8-1.25 2.07-.98 3.34 1.25.16 2.52-.76 3.31-1.73z"/></svg>
          </motion.button>
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-ghost)", fontWeight: 500 }}>
          {tr("By continuing, you agree to our", language)} <span style={{ color: "var(--text-main)", fontWeight: 700, cursor: "pointer" }}>{tr("Terms & Service", language)}</span>
        </p>
      </motion.div>
    </div>
  );
}
