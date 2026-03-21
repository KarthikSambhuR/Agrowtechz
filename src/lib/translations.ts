import { Language } from "@/context/AppContext";

type Translations = Record<string, Partial<Record<Language, string>>>;

export const t: Translations = {
  // Nav
  dashboard: { en: "Dashboard", ml: "ഡാഷ്ബോർഡ്" },
  fields: { en: "My Fields", ml: "എന്റെ വയലുകൾ" },
  myFields: { en: "My Fields", ml: "എന്റെ വയലുകൾ" },
  market: { en: "Market", ml: "മാർക്കറ്റ്" },
  diary: { en: "Diary", ml: "ഡയറി" },
  support: { en: "Support", ml: "പിന്തുണ" },
  analytics: { en: "Analytics", ml: "വിശകലനം" },
  recommendations: { en: "AI Advisor", ml: "AI ഉപദേഷ്ടാവ്" },
  
  // Analytics Additions
  "FARM INSIGHTS": { en: "Farm Insights", ml: "ഫാം സ്ഥിതിവിവരക്കണക്കുകൾ" },
  "Checking progress for": { en: "Checking progress for", ml: "പുരോഗതി പരിശോധിക്കുന്നു" },
  "Expected Income": { en: "Expected Income", ml: "പ്രതീക്ഷിക്കുന്ന വരുമാനം" },
  "Time to Harvest": { en: "Time to Harvest", ml: "വിളവെടുപ്പിനുള്ള സമയം" },
  
  // Market Additions
  "MARKET PRICES": { en: "Market Prices", ml: "വിപണി വിലകൾ" },
  "Current and future crop prices": { en: "Current and future crop prices", ml: "നിലവിലുള്ളതും ഭാവിയിലുള്ളതുമായ വിള വിലകൾ" },
  "Export Data": { en: "Export Data", ml: "ഡാറ്റ ഡൗൺലോഡ് ചെയ്യുക" },
  "Price Changes": { en: "Price Changes", ml: "വില മാറ്റങ്ങൾ" },

  // Dashboard
  hello: { en: "Hello", ml: "നമസ്കാരം" },
  yourPlot: { en: "Your", ml: "നിങ്ങളുടെ" },
  plotIs: { en: "field is looking", ml: "പ്ലോട്ട് ഇതിലാണ്" },
  stage: { en: "Stage", ml: "ഘട്ടം" },
  activePlot: { en: "Selected Field", ml: "സജീവ പ്ലോട്ട്" },
  smartInsight: { en: "Farm Advice", ml: "സ്മാർട്ട് ഉൾക്കാഴ്ച" },
  applyAdjustment: { en: "Update Plan", ml: "ക്രമീകരണം പ്രയോഗിക്കുക" },
  soilHealth: { en: "Soil Health", ml: "മണ്ണ് ആരോഗ്യം" },
  environment: { en: "Environment", ml: "പരിസ്ഥിതി" },
  nutrients: { en: "Nutrients (NPK)", ml: "പോഷകങ്ങൾ (NPK)" },
  watering: { en: "Watering", ml: "ജലസേചനം" },
  optimal: { en: "healthy right now.", ml: "മികച്ച രീതിയിൽ പ്രവർത്തിക്കുന്നു." },
  nitrogen: { en: "Nitrogen", ml: "നൈട്രജൻ" },
  phosphorus: { en: "Phosphorus", ml: "ഫോസ്ഫറസ്" },
  potassium: { en: "Potassium", ml: "പൊട്ടാസ്യം" },
  nextDosing: { en: "Next fertilizer in 3 days", ml: "3 ദിവസത്തിനുള്ളിൽ അടുത്ത ഡോസ്" },
  yieldProjection: { en: "Expected Harvest", ml: "വിളവ് പ്രക്ഷേപണം" },
  biometricFeed: { en: "Crop Health", ml: "ബയോമെട്രിക് ഫീഡ്" },
  estimatedHarvest: { en: "Total Expected", ml: "കണക്കാക്കിയ വിളവ്" },
  soilMoisture: { en: "Soil Moisture", ml: "മണ്ണിലെ ഈർപ്പം" },
  soilTemp: { en: "Soil Temp", ml: "മണ്ണിലെ താപനില" },
  growthBio: { en: "Plant Growth", ml: "വളർച്ച ബയോ" },
  // Weather
  rainPredicted: { en: "Rain expected tomorrow. You can skip watering to save water.", ml: "നാളെ മഴ പ്രവചിക്കപ്പെടുന്നു. മണ്ണിലെ ഈർപ്പം ഒപ്റ്റിമൈസ് ചെയ്യാൻ ജലസേചനം ഒഴിവാക്കുക." },
  goodTimeToWater: { en: "Soil is dry. It's a good time to water your field.", ml: "മണ്ണിലെ ഈർപ്പം കുറവാണ്. ഇപ്പോൾ ജലസേചനത്തിന് ഒപ്റ്റിമൽ സമയം." },
  skipIrrigation: { en: "Skip Watering", ml: "ജലസേചനം ഒഴിവാക്കുക" },
  waterNow: { en: "Water Now", ml: "ഇപ്പോൾ നനയ്ക്കുക" },
  // Alerts & Actions
  smartSkip: { en: "Skip Watering", ml: "സ്മാർട്ട് സ്കിപ്പ് സജീവമാക്കുക" },
  dismiss: { en: "Close Alert", ml: "മുന്നറിയിപ്പ് ഒഴിവാക്കുക" },
  estSavings: { en: "WATER SAVED", ml: "കണക്കാക്കിയ ലാഭം" },
  watchBrief: { en: "Watch summary", ml: "ചുരുക്കം കാണുക" },
  fullReport: { en: "Full Report", ml: "മുഴുവൻ റിപ്പോർട്ട്" },
  // Market / Analytics
  predictiveAnalytics: { en: "Future Estimates", ml: "പ്രവചനാത്മക വിശകലനം" },
  growthTimeline: { en: "Growth Timeline", ml: "വളർച്ചാ ടൈംലൈൻ" },
  projectedRevenue: { en: "Expected Revenue", ml: "പ്രവചിക്കപ്പെടുന്ന വരുമാനം" },
  marketRate: { en: "Market Price Trends", ml: "മാർക്കറ്റ് നിരക്ക് ട്രാജക്ടറി" },
  confidenceScore: { en: "Reliability", ml: "വിശ്വാസ്യത സ്കോർ" },
  unlockStrategy: { en: "View Plan", ml: "തന്ത്രം അൺലോക്ക് ചെയ്യുക" },
  daysRemaining: { en: "Days to Harvest", ml: "ദിവസങ്ങൾ ബാക്കി" },
  moistureRetention: { en: "Water Holding", ml: "ഈർപ്പ നിലനിർത്തൽ" },
  canopyTemp: { en: "Leaf Temp", ml: "കാനോപ്പി താപനില" },
  riskIndex: { en: "Risk Level", ml: "അപകട സൂചിക" },
  // Fields / Map
  defineField: { en: "Mark your field borders.", ml: "നിങ്ങളുടെ ഫീൽഡ് അതിർത്തികൾ നിർണ്ണയിക്കുക." },
  geoMapDesc: { en: "Use the map to draw the shape of your farm field.", ml: "നിങ്ങളുടെ പ്രധാന പ്ലോട്ടിന്റെ ചുറ്റളവ് കൃത്യമായി മാപ്പ് ചെയ്യാൻ സ്യൂട്ട് സ്‌റ്റൈൽ ഉപകരണം ഉപയോഗിക്കുക." },
  totalArea: { en: "Total Farm Area", ml: "മൊത്തം കണക്കാക്കിയ വിസ്തീർണ്ണം" },
  selectCrop: { en: "What are you growing?", ml: "നിങ്ങളുടെ വിള തിരഞ്ഞെടുക്കുക" },
  // Onboarding
  selectPrimaryGrowth: { en: "Select Your Main Crop", ml: "നിങ്ങളുടെ പ്രധാന വളർച്ചാ ഫോക്കസ് തിരഞ്ഞെടുക്കുക" },
  initializingAI: { en: "Checking crop data...", ml: "നിങ്ങളുടെ വിളയ്ക്കായി AI മോഡലുകൾ തുടങ്ങുന്നു..." },
  initializeCore: { en: "Get Started", ml: "കോർ ഇനിഷ്യലൈസ് ചെയ്യുക" },
  analyzingSoil: { en: "Checking Farm Data...", ml: "മണ്ണ് ഡാറ്റ വിശകലനം ചെയ്യുന്നു..." },
  // Misc
  liveStatus: { en: "Current Status", ml: "തത്സമയ നില" },
  controlCenter: { en: "My Farm", ml: "കൺട്രോൾ സെന്റർ" },
  commandCenter: { en: "Farm Summary", ml: "കമാൻഡ് സെന്റർ" },
  weather: { en: "Weather", ml: "കാലാവസ്ഥ" },
  profitEstimate: { en: "Profit Estimate", ml: "ലാഭ കണക്ക്" },
  inputCosts: { en: "Farming Costs", ml: "ഇൻപുട്ട് ചെലവ്" },
  expectedYield: { en: "Expected Yield", ml: "പ്രതീക്ഷിത വിളവ്" },
  netProfit: { en: "Estimated Profit", ml: "കണക്കാക്കിയ അറ്റ ലാഭം" },
};

export function tr(key: string, lang: Language): string {
  return t[key]?.[lang] ?? t[key]?.["en"] ?? key;
}
