"use client";
import { useApp } from "@/context/AppContext";
import { tr } from "@/lib/translations";
import { Trash2, AlertTriangle, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Language } from "@/context/AppContext";

const INDIAN_LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ks", name: "Kashmiri", nativeName: "कॉशुर" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mni", name: "Manipuri", nativeName: "ꯃꯤꯇꯩꯂꯣꯟ" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ur", name: "Urdu", nativeName: "اردو" }
];

export default function Settings() {
  const { language, setLanguage, clearData } = useApp();

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: 40, height: "100%" }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ zIndex: 1 }}
      >
        <h1 style={{ fontSize: 40, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em" }}>
          {tr("Settings", language)}
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-dim)", marginTop: 12, fontWeight: 500 }}>
          {tr("Manage your account and local data preferences.", language)}
        </p>
      </motion.div>
      <div style={{ maxWidth: 640, zIndex: 1, display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Language Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="premium-card" style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px", border: "1px solid var(--border-line)", background: "var(--bg-card)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={24} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>{tr("Regional Language", language)}</h2>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4, fontWeight: 500 }}>{tr("Select your preferred language for the Farmio platform.", language)}</p>
            </div>
          </div>
          
          <div style={{ padding: "8px 0" }}>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{
                width: "100%", padding: "16px", borderRadius: 16, border: "2px solid var(--border-line)", background: "var(--bg-surface)",
                color: "var(--text-main)", fontSize: 15, fontWeight: 700, outline: "none", cursor: "pointer",
                appearance: "none", fontFamily: "inherit"
              }}
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
            <div style={{ fontSize: 11, color: "var(--text-ghost)", marginTop: 12, fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-primary)" }} />
              {tr("Farmio supports 22 official regional languages of India. Localizations may fallback to English if incomplete.", language)}
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="premium-card" style={{ border: "1px solid rgba(234, 67, 53, 0.2)", display: "flex", flexDirection: "column", gap: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(234, 67, 53, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={24} color="#EA4335" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)" }}>{tr("Danger Zone", language)}</h2>
              <p style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 4 }}>{tr("These actions are destructive and cannot be undone.", language)}</p>
            </div>
          </div>
          
          <div style={{ background: "var(--bg-dark)", padding: 24, borderRadius: 16, border: "1px solid var(--border-line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>{tr("Clear Local Storage & Logout", language)}</div>
              <div style={{ fontSize: 13, color: "var(--text-ghost)", marginTop: 6, maxWidth: 320 }}>
                {tr("This will delete all saved data, fields, settings, and generated profiles from this device.", language)}
              </div>
            </div>
            <motion.button 
              onClick={clearData}
              whileHover={{ scale: 1.05, backgroundColor: "#EA4335", color: "#FFF" }} 
              whileTap={{ scale: 0.95 }}
              style={{ padding: "12px 20px", borderRadius: 100, border: "1px solid rgba(234, 67, 53, 0.3)", background: "transparent", color: "#EA4335", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s, color 0.2s" }}
            >
              <Trash2 size={16} /> {tr("Clear Data", language)}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
