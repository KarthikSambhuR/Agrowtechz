"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Leaf, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState("farmer@farmer.in");
  const [password, setPassword] = useState("farmer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    setError("");
    setLoading(true);
    
    // Simulate delay for feel
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError("Invalid credentials or access code.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "stretch",
      background: "#FFFFFF",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0, 209, 160, 0.05) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0, 209, 160, 0.03) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Visual Side */}
      <div style={{
        flex: 1.2,
        background: "#F8FAFC",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 100px",
        borderRight: "1px solid var(--border-line)",
      }}>
        <div style={{ position: "relative", zIndex: 10 }}>
           <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "var(--accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 40px rgba(0, 209, 160, 0.3)",
            marginBottom: 40,
          }}>
            <Leaf size={28} color="#FFF" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", color: "#1E293B", maxWidth: 500 }}>
             INTELLIGENT <br />
             <span style={{ color: "var(--accent-primary)" }}>FARM COMMANDERS.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-dim)", marginTop: 20, maxWidth: 450, lineHeight: 1.6, fontWeight: 500 }}>
            Optimizing agricultural output through geospatial AI and precision sensor telemetry.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 60 }}>
             {[
               { icon: <ShieldCheck />, title: "SECURE NODE", desc: "Enterprise End-to-End" },
               { icon: <Mail />, title: "LIVE TELEMETRY", desc: "Direct Sat-Link Sync" },
             ].map((item, i) => (
               <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ color: "var(--accent-primary)" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#1E293B" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-ghost)", fontWeight: 750, textTransform: "uppercase", marginTop: 4 }}>{item.desc}</div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
        <div className="reveal" style={{ width: "100%", maxWidth: 400, padding: 40 }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1E293B" }}>Sign In</h2>
            <p style={{ color: "var(--text-ghost)", fontSize: 12, marginTop: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              ENTER YOUR AGRO-ID CREDENTIALS
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}>
                <Mail size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 16 }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="SYNC ADDRESS"
                  style={{
                    width: "100%",
                    background: "#F8FAFC",
                    border: "1px solid var(--border-line)",
                    padding: "16px 16px 16px 48px",
                    borderRadius: 14,
                    color: "#1E293B",
                    fontSize: 14,
                    fontWeight: 700,
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.background = "#FFF" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border-line)"; e.currentTarget.style.background = "#F8FAFC" }}
                />
              </div>

              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}>
                <Lock size={18} color="var(--text-ghost)" style={{ position: "absolute", left: 16 }} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ACCESS KEY"
                  style={{
                    width: "100%",
                    background: "#F8FAFC",
                    border: "1px solid var(--border-line)",
                    padding: "16px 16px 16px 48px",
                    borderRadius: 14,
                    color: "#1E293B",
                    fontSize: 14,
                    fontWeight: 700,
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                   onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.background = "#FFF" }}
                   onBlur={e => { e.currentTarget.style.borderColor = "var(--border-line)"; e.currentTarget.style.background = "#F8FAFC" }}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: "12px", background: "#FEF2F2", color: "#EF4444", borderRadius: 10, border: "1px solid #FEE2E2", textAlign: "center", fontSize: 13, fontWeight: 700 }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
              style={{ padding: 18, fontSize: 15, width: "100%", justifyContent: "center", marginTop: 12, borderRadius: 14, boxShadow: "0 12px 24px -6px rgba(0, 209, 160, 0.4)" }}
            >
              {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: "var(--text-ghost)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
             SECURED BY AGRO-LINK DATA
          </p>
        </div>
      </div>
    </div>
  );
}
