import { Language } from "@/context/AppContext";

type Translations = Record<string, Record<Language, string>>;

export const t: Translations = {
  // Nav
  dashboard: { en: "Dashboard", ml: "ഡാഷ്ബോർഡ്" },
  myFields: { en: "My Fields", ml: "എന്റെ വയലുകൾ" },
  market: { en: "Market", ml: "മാർക്കറ്റ്" },
  diary: { en: "Diary", ml: "ഡയറി" },
  support: { en: "Support", ml: "പിന്തുണ" },
  analytics: { en: "Analytics", ml: "വിശകലനം" },
  // Dashboard
  hello: { en: "Hello", ml: "നമസ്കാരം" },
  yourPlot: { en: "Your", ml: "നിങ്ങളുടെ" },
  plotIs: { en: "plot is in the", ml: "പ്ലോട്ട് ഇതിലാണ്" },
  stage: { en: "Stage", ml: "ഘട്ടം" },
  activePlot: { en: "Active Plot", ml: "സജീവ പ്ലോട്ട്" },
  smartInsight: { en: "Smart Insight", ml: "സ്മാർട്ട് ഉൾക്കാഴ്ച" },
  applyAdjustment: { en: "Apply Adjustment", ml: "ക്രമീകരണം പ്രയോഗിക്കുക" },
  soilHealth: { en: "Soil Health", ml: "മണ്ണ് ആരോഗ്യം" },
  environment: { en: "Environment", ml: "പരിസ്ഥിതി" },
  nutrients: { en: "Nutrients (NPK)", ml: "പോഷകങ്ങൾ (NPK)" },
  watering: { en: "Watering", ml: "ജലസേചനം" },
  optimal: { en: "Optimal", ml: "ഒപ്റ്റിമൽ" },
  nitrogen: { en: "Nitrogen", ml: "നൈട്രജൻ" },
  phosphorus: { en: "Phosphorus", ml: "ഫോസ്ഫറസ്" },
  potassium: { en: "Potassium", ml: "പൊട്ടാസ്യം" },
  nextDosing: { en: "Next dosing in 3 days", ml: "3 ദിവസത്തിനുള്ളിൽ അടുത്ത ഡോസ്" },
  yieldProjection: { en: "Yield Projection", ml: "വിളവ് പ്രക്ഷേപണം" },
  biometricFeed: { en: "Biometric Feed", ml: "ബയോമെട്രിക് ഫീഡ്" },
  estimatedHarvest: { en: "Estimated Harvest", ml: "കണക്കാക്കിയ വിളവ്" },
  // Weather
  rainPredicted: { en: "Rain predicted for tomorrow. Skip irrigation to optimize soil moisture.", ml: "നാളെ മഴ പ്രവചിക്കപ്പെടുന്നു. മണ്ണിലെ ഈർപ്പം ഒപ്റ്റിമൈസ് ചെയ്യാൻ ജലസേചനം ഒഴിവാക്കുക." },
  goodTimeToWater: { en: "Soil moisture is low. Optimal time to irrigate your field now.", ml: "മണ്ണിലെ ഈർപ്പം കുറവാണ്. ഇപ്പോൾ ജലസേചനത്തിന് ഒപ്റ്റിമൽ സമയം." },
  skipIrrigation: { en: "Skip Irrigation", ml: "ജലസേചനം ഒഴിവാക്കുക" },
  waterNow: { en: "Water Now", ml: "ഇപ്പോൾ നനയ്ക്കുക" },
  // Market / Analytics
  predictiveAnalytics: { en: "Predictive Analytics", ml: "പ്രവചനാത്മക വിശകലനം" },
  growthTimeline: { en: "Growth Timeline", ml: "വളർച്ചാ ടൈംലൈൻ" },
  projectedRevenue: { en: "Projected Revenue", ml: "പ്രവചിക്കപ്പെടുന്ന വരുമാനം" },
  marketRate: { en: "Market Rate Trajectory", ml: "മാർക്കറ്റ് നിരക്ക് ട്രാജക്ടറി" },
  confidenceScore: { en: "Confidence Score", ml: "വിശ്വാസ്യത സ്കോർ" },
  unlockStrategy: { en: "Unlock Strategy", ml: "തന്ത്രം അൺലോക്ക് ചെയ്യുക" },
  daysRemaining: { en: "Days Remaining", ml: "ദിവസങ്ങൾ ബാക്കി" },
  moistureRetention: { en: "Moisture Retention", ml: "ഈർപ്പ നിലനിർത്തൽ" },
  canopyTemp: { en: "Canopy Temp", ml: "കാനോപ്പി താപനില" },
  riskIndex: { en: "Risk Index", ml: "അപകട സൂചിക" },
  // Fields / Map
  defineField: { en: "Define your field boundaries.", ml: "നിങ്ങളുടെ ഫീൽഡ് അതിർത്തികൾ നിർണ്ണയിക്കുക." },
  geoMapDesc: { en: "Use precision satellite instrumentation to accurately map the perimeter of your primary plot.", ml: "നിങ്ങളുടെ പ്രധാന പ്ലോട്ടിന്റെ ചുറ്റളവ് കൃത്യമായി മാപ്പ് ചെയ്യാൻ സ്യൂട്ട് സ്‌റ്റൈൽ ഉപകരണം ഉപയോഗിക്കുക." },
  totalArea: { en: "Total Calculated Area", ml: "മൊത്തം കണക്കാക്കിയ വിസ്തീർണ്ണം" },
  selectCrop: { en: "Select Your Crop", ml: "നിങ്ങളുടെ വിള തിരഞ്ഞെടുക്കുക" },
  // Onboarding
  selectPrimaryGrowth: { en: "Select your Primary Growth Focus", ml: "നിങ്ങളുടെ പ്രധാന വളർച്ചാ ഫോക്കസ് തിരഞ്ഞെടുക്കുക" },
  initializingAI: { en: "Initializing AI models for your crop...", ml: "നിങ്ങളുടെ വിളയ്ക്കായി AI മോഡലുകൾ തുടങ്ങുന്നു..." },
  initializeCore: { en: "Initialize Core", ml: "കോർ ഇനിഷ്യലൈസ് ചെയ്യുക" },
  analyzingSoil: { en: "Analyzing Soil Data...", ml: "മണ്ണ് ഡാറ്റ വിശകലനം ചെയ്യുന്നു..." },
  // Misc
  liveStatus: { en: "Live Status", ml: "തത്സമയ നില" },
  commandCenter: { en: "Command Center", ml: "കമാൻഡ് സെന്റർ" },
  weather: { en: "Weather", ml: "കാലാവസ്ഥ" },
  profitEstimate: { en: "Profit Estimate", ml: "ലാഭ കണക്ക്" },
  inputCosts: { en: "Input Costs", ml: "ഇൻപുട്ട് ചെലവ്" },
  expectedYield: { en: "Expected Yield", ml: "പ്രതീക്ഷിത വിളവ്" },
  netProfit: { en: "Est. Net Profit", ml: "കണക്കാക്കിയ അറ്റ ലാഭം" },
};

export function tr(key: string, lang: Language): string {
  return t[key]?.[lang] ?? t[key]?.["en"] ?? key;
}
