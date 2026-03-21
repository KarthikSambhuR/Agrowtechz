"use client";
import { useApp } from "@/context/AppContext";
import { Plus, LocateFixed, Layers, ShieldCheck } from "lucide-react";
import { useRef, useEffect } from "react";

export default function Fields() {
  const { plots, activePlot, setActivePlot } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0,0,0,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    plots.forEach((plot, idx) => {
      const active = activePlot?.id === plot.id;
      const offX = idx * 60;
      ctx.beginPath();
      ctx.moveTo(150 + offX, 100); ctx.lineTo(400 + offX, 120);
      ctx.lineTo(380 + offX, 240); ctx.lineTo(120 + offX, 220);
      ctx.closePath();
      ctx.fillStyle = active ? "rgba(0, 166, 126, 0.12)" : "rgba(0,0,0,0.02)";
      ctx.fill();
      ctx.strokeStyle = active ? "#00A67E" : "rgba(0,0,0,0.12)";
      ctx.lineWidth = active ? 3 : 1.5;
      ctx.stroke();
    });
  }, [plots, activePlot]);

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 32, height: "100%", overflowY: "auto" }}>
      <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em" }}>
            YOUR GEOSPATIAL MAPS
          </h1>
          <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Manage and monitor plot boundaries</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary">Manage Indices</button>
          <button className="btn-primary">
            <Plus size={18} /> Add New Plot
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, flex: 1, minHeight: 0 }}>
        {/* Map Canvas */}
        <div className="premium-card reveal" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 450, animationDelay: "0.1s" }}>
          <canvas
            ref={canvasRef}
            width={800} height={500}
            style={{ width: "100%", height: "100%" }}
          />

          {/* Overlay buttons */}
          <div style={{ position: "absolute", top: 20, right: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn-secondary" style={{ padding: 10, borderRadius: 10, background: "#FFF" }}>
              <Layers size={20} color="var(--text-dim)" />
            </button>
            <button className="btn-secondary" style={{ padding: 10, borderRadius: 10, background: "#FFF" }}>
              <LocateFixed size={20} color="var(--text-dim)" />
            </button>
          </div>

          {/* Stats overlay */}
          <div style={{
            position: "absolute", bottom: 20, left: 20,
            background: "#FFF",
            padding: "16px 24px", borderRadius: 16, border: "1px solid var(--border-line)",
            display: "flex", gap: 32, alignItems: "center", boxShadow: "var(--shadow-lg)"
          }}>
            <div>
              <div className="text-label" style={{ fontSize: 9 }}>Total Boundary Area</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {activePlot?.area} <span style={{ opacity: 0.5 }}>ACRE</span>
              </div>
            </div>
            <div style={{ paddingLeft: 32, borderLeft: "1px solid var(--border-line)" }}>
              <div className="text-label" style={{ fontSize: 9 }}>Satellite Precision</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-secondary)" }}>±0.1m</div>
            </div>
          </div>
        </div>

        {/* Sidebar - Plot List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="premium-card reveal" style={{ animationDelay: "0.2s", padding: 24 }}>
            <div className="text-label" style={{ marginBottom: 16 }}>Inventory Registry</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {plots.map(p => (
                <div
                  key={p.id}
                  onClick={() => setActivePlot(p)}
                  style={{
                    padding: 16, borderRadius: 12, cursor: "pointer",
                    background: activePlot?.id === p.id ? "var(--accent-soft)" : "var(--bg-surface)",
                    border: "1px solid",
                    borderColor: activePlot?.id === p.id ? "var(--accent-primary)" : "var(--border-line)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text-ghost)", fontWeight: 700 }}>{p.area} A</span>
                  </div>
                  <div className="badge">Healthy</div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card reveal" style={{ animationDelay: "0.3s", padding: 24, background: "var(--bg-surface)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              <span style={{ fontSize: 14, fontWeight: 800 }}>Calibration Stable</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 12, lineHeight: 1.5 }}>
              GNSS L1/L5 dual-band coordination confirmed. All boundaries are verified with enterprise-grade precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
