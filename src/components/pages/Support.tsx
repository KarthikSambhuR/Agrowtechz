"use client";
import { useApp } from "@/context/AppContext";
import { MessageSquare, Phone, ShieldAlert, ChevronRight, HelpCircle } from "lucide-react";

export default function Support() {
  useApp(); // consume context (no state needed currently)

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32, overflowY: "auto", height: "100%" }}>
      <div className="reveal">
         <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1E293B", letterSpacing: "-0.04em" }}>
            CENTRAL SUPPORT NODE
         </h1>
         <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Access technical assistance and safety protocols</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <div className="premium-card reveal" style={{ 
           animationDelay: "0.1s", display: "flex", flexDirection: "column", gap: 20
         }}>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Direct Channels</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               {[
                 { icon: <MessageSquare size={20} />, label: "Live Support Chat", val: "Online Now", color: "var(--accent-primary)" },
                 { icon: <Phone size={20} />, label: "Emergency Agri-Line", val: "Available 24/7", color: "var(--accent-secondary)" },
                 { icon: <ShieldAlert size={20} />, label: "Safety Protocol Desk", val: "Protocol Hub", color: "#F87171" },
               ].map((item, i) => (
                 <div key={i} style={{ 
                   display: "flex", justifyContent: "space-between", alignItems: "center", 
                   padding: 20, borderRadius: 16, background: "var(--bg-surface)",
                   border: "1px solid var(--border-line)", cursor: "pointer"
                 }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                       <div style={{ color: item.color }}>{item.icon}</div>
                       <div style={{ fontSize: 13, fontWeight: 800 }}>{item.label}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                       <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>{item.val}</div>
                       <ChevronRight size={14} color="var(--text-ghost)" />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="premium-card reveal" style={{ animationDelay: "0.2s" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Knowledge Base</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
               {[
                 "How to calibrate N2O sensors manually?",
                 "Optimizing water usage for rubber trees",
                 "Understanding harvest readiness prediction",
                 "Securing your command node access",
               ].map((q, i) => (
                 <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                       <HelpCircle size={16} color="var(--text-ghost)" />
                       <div style={{ fontSize: 14, fontWeight: 750 }}>{q}</div>
                    </div>
                    <ChevronRight size={14} color="var(--text-ghost)" />
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="premium-card reveal" style={{ 
        animationDelay: "0.3s",
        background: "var(--accent-primary)",
        color: "#FFF",
        padding: "40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
         <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Need On-Site Analysis?</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              Request a physical soil health audit and drone survey for your plots.
            </p>
         </div>
         <button style={{ 
           padding: "16px 32px", borderRadius: 12, background: "#FFF", color: "var(--accent-primary)", 
           border: "none", fontWeight: 900, fontSize: 16, cursor: "pointer",
           boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
         }}>
           BOOK INSPECTION
         </button>
      </div>
    </div>
  );
}
