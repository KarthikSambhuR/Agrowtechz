"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = 
  | "en" | "as" | "bn" | "brx" | "doi" | "gu" | "hi" | "kn" | "ks" 
  | "kok" | "mai" | "ml" | "mni" | "mr" | "ne" | "or" | "pa" | "sa" 
  | "sat" | "sd" | "ta" | "te" | "ur";

export type CropType = "pineapple" | "rubber" | "rice" | "palm_oil" | "coffee" | "spices" | "sugarcane" | "tea";

export interface Plot {
  id: string;
  name: string;
  crop: CropType;
  area: number; // acres
  coordinates: [number, number][];
  soilPH: number;
  soilHealth: number; // 0-100
  plantCount?: number;
}

export interface SensorData {
  co2: number;        // ppm
  n2o: number;        // ppb
  moisture: number;   // %
  temperature: number; // °C
  humidity: number;   // %
  timestamp: Date;
}

export interface WeatherForecast {
  day: string;
  condition: string;
  high: number;
  low: number;
  rainfallProbability: number; // 0-100
  rainfall: number; // mm
  icon: string;
}

export interface NPK {
  nitrogen: number;   // 0-100 %
  phosphorus: number;
  potassium: number;
}

export interface GrowthStage {
  name: string;
  startDay: number;
  endDay: number;
  icon: string;
}

export interface Notification {
  id: string;
  type: "alert" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const CROP_PROFILES: Record<CropType, {
  label: string;
  labelMl: string;
  icon: string;
  image: string;
  stages: GrowthStage[];
  growthDays: number;
  basePrice: number; // ₹ per quintal
  baseYield: number; // tons per acre
  inputCost: number; // ₹ per acre
  npkNeeds: NPK;
}> = {
  pineapple: {
    label: "Pineapple", labelMl: "കൈതച്ചക്ക",
    icon: "🍍",
    image: "/images/crops/crop_pineapple.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 30, icon: "🌱" },
      { name: "Vegetative", startDay: 31, endDay: 270, icon: "🌿" },
      { name: "Flowering", startDay: 271, endDay: 360, icon: "🌸" },
      { name: "Ripening", startDay: 361, endDay: 420, icon: "🌻" },
      { name: "Harvest", startDay: 421, endDay: 480, icon: "🍍" },
    ],
    growthDays: 480,
    basePrice: 2800,
    baseYield: 8,
    inputCost: 45000,
    npkNeeds: { nitrogen: 80, phosphorus: 45, potassium: 65 },
  },
  rubber: {
    label: "Rubber", labelMl: "റബ്ബർ",
    icon: "🌳",
    image: "/images/crops/crop_rubber.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 60, icon: "🌱" },
      { name: "Vegetative", startDay: 61, endDay: 1000, icon: "🌿" },
      { name: "Flowering", startDay: 1001, endDay: 1500, icon: "🌸" },
      { name: "Ripening", startDay: 1501, endDay: 1800, icon: "🌻" },
      { name: "Harvest", startDay: 1801, endDay: 2190, icon: "🌳" },
    ],
    growthDays: 2190,
    basePrice: 18000,
    baseYield: 1.2,
    inputCost: 35000,
    npkNeeds: { nitrogen: 60, phosphorus: 35, potassium: 50 },
  },
  rice: {
    label: "Rice", labelMl: "നെല്ല്",
    icon: "🌾",
    image: "/images/crops/crop_rice.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 15, icon: "🌱" },
      { name: "Vegetative", startDay: 16, endDay: 60, icon: "🌿" },
      { name: "Flowering", startDay: 61, endDay: 85, icon: "🌸" },
      { name: "Ripening", startDay: 86, endDay: 110, icon: "🌻" },
      { name: "Harvest", startDay: 111, endDay: 130, icon: "🌾" },
    ],
    growthDays: 130,
    basePrice: 2200,
    baseYield: 2.5,
    inputCost: 28000,
    npkNeeds: { nitrogen: 90, phosphorus: 55, potassium: 70 },
  },
  palm_oil: {
    label: "Palm Oil", labelMl: "പനസ",
    icon: "🌴",
    image: "/images/crops/crop_palm_oil.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 90, icon: "🌱" },
      { name: "Vegetative", startDay: 91, endDay: 1095, icon: "🌿" },
      { name: "Flowering", startDay: 1096, endDay: 1460, icon: "🌸" },
      { name: "Ripening", startDay: 1461, endDay: 1700, icon: "🌻" },
      { name: "Harvest", startDay: 1701, endDay: 1825, icon: "🌴" },
    ],
    growthDays: 1825,
    basePrice: 9500,
    baseYield: 3.5,
    inputCost: 55000,
    npkNeeds: { nitrogen: 70, phosphorus: 60, potassium: 80 },
  },
  coffee: {
    label: "Coffee", labelMl: "കാപ്പി",
    icon: "☕",
    image: "/images/crops/crop_coffee.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 60, icon: "🌱" },
      { name: "Vegetative", startDay: 61, endDay: 900, icon: "🌿" },
      { name: "Flowering", startDay: 901, endDay: 1080, icon: "🌸" },
      { name: "Ripening", startDay: 1081, endDay: 1200, icon: "🌻" },
      { name: "Harvest", startDay: 1201, endDay: 1095, icon: "☕" },
    ],
    growthDays: 1095,
    basePrice: 32000,
    baseYield: 0.8,
    inputCost: 65000,
    npkNeeds: { nitrogen: 65, phosphorus: 40, potassium: 55 },
  },
  spices: {
    label: "Spices", labelMl: "മസാല",
    icon: "🌶️",
    image: "/images/crops/crop_spices.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 30, icon: "🌱" },
      { name: "Vegetative", startDay: 31, endDay: 120, icon: "🌿" },
      { name: "Flowering", startDay: 121, endDay: 180, icon: "🌸" },
      { name: "Ripening", startDay: 181, endDay: 240, icon: "🌻" },
      { name: "Harvest", startDay: 241, endDay: 270, icon: "🌶️" },
    ],
    growthDays: 270,
    basePrice: 45000,
    baseYield: 0.5,
    inputCost: 30000,
    npkNeeds: { nitrogen: 55, phosphorus: 45, potassium: 60 },
  },
  sugarcane: {
    label: "Sugarcane", labelMl: "കരിമ്പ്",
    icon: "🎋",
    image: "/images/crops/crop_sugarcane.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 30, icon: "🌱" },
      { name: "Vegetative", startDay: 31, endDay: 200, icon: "🌿" },
      { name: "Flowering", startDay: 201, endDay: 300, icon: "🌸" },
      { name: "Ripening", startDay: 301, endDay: 360, icon: "🌻" },
      { name: "Harvest", startDay: 361, endDay: 420, icon: "🎋" },
    ],
    growthDays: 420,
    basePrice: 3200,
    baseYield: 25,
    inputCost: 40000,
    npkNeeds: { nitrogen: 85, phosphorus: 50, potassium: 75 },
  },
  tea: {
    label: "Tea", labelMl: "ചായ",
    icon: "🍵",
    image: "/images/crops/crop_tea.png",
    stages: [
      { name: "Sowing", startDay: 0, endDay: 60, icon: "🌱" },
      { name: "Vegetative", startDay: 61, endDay: 730, icon: "🌿" },
      { name: "Flowering", startDay: 731, endDay: 900, icon: "🌸" },
      { name: "Ripening", startDay: 901, endDay: 1000, icon: "🌻" },
      { name: "Harvest", startDay: 1001, endDay: 1095, icon: "🍵" },
    ],
    growthDays: 1095,
    basePrice: 28000,
    baseYield: 1.8,
    inputCost: 50000,
    npkNeeds: { nitrogen: 75, phosphorus: 40, potassium: 65 },
  },
};

export { CROP_PROFILES };

interface AppState {
  language: Language;
  setLanguage: (l: Language) => void;
  activePage: string;
  setActivePage: (p: string) => void;
  plots: Plot[];
  userPlots: Plot[]; // Only plots added by user during onboarding/Fields
  activePlot: Plot | null;
  setActivePlot: (p: Plot | null) => void;
  sensorData: SensorData;
  setSensorData: (data: SensorData) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  weather: WeatherForecast[];
  npk: NPK | null;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  selectedCrop: CropType | null;
  setSelectedCrop: (c: CropType) => void;
  daysPlanted: number;
  irrigationSuggestion: "water" | "skip";
  marketPrices: { month: string; price: number; predicted?: boolean }[];
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addPlot: (p: Plot) => void;
  updatePlot: (id: string, updates: Partial<Plot>) => void;
  clearData: () => void;
}

const AppContext = createContext<AppState | null>(null);

function generateSensor(): SensorData {
  return {
    co2: Math.round(380 + Math.random() * 80),
    n2o: Math.round(320 + Math.random() * 40),
    moisture: Math.round(55 + Math.random() * 30),
    temperature: Math.round((26 + Math.random() * 6) * 10) / 10,
    humidity: Math.round(60 + Math.random() * 25),
    timestamp: new Date(),
  };
}

const DEMO_PLOTS: Plot[] = [];

const DEMO_WEATHER: WeatherForecast[] = [
  { day: "Today", condition: "Partly Cloudy", high: 30, low: 24, rainfallProbability: 20, rainfall: 0, icon: "⛅" },
  { day: "Tomorrow", condition: "Heavy Rain", high: 27, low: 22, rainfallProbability: 85, rainfall: 28, icon: "🌧️" },
  { day: "Wed", condition: "Thunderstorm", high: 25, low: 21, rainfallProbability: 92, rainfall: 45, icon: "⛈️" },
  { day: "Thu", condition: "Light Rain", high: 28, low: 23, rainfallProbability: 60, rainfall: 12, icon: "🌦️" },
  { day: "Fri", condition: "Sunny", high: 32, low: 25, rainfallProbability: 10, rainfall: 0, icon: "☀️" },
  { day: "Sat", condition: "Partly Cloudy", high: 31, low: 24, rainfallProbability: 30, rainfall: 5, icon: "⛅" },
  { day: "Sun", condition: "Sunny", high: 33, low: 26, rainfallProbability: 5, rainfall: 0, icon: "☀️" },
];

const DEMO_MARKET: { month: string; price: number; predicted?: boolean }[] = [
  { month: "Jun", price: 2400 },
  { month: "Jul", price: 2650 },
  { month: "Aug", price: 2500 },
  { month: "Sep", price: 4290, predicted: true },
  { month: "Oct", price: 4100, predicted: true },
  { month: "Nov", price: 3800, predicted: true },
  { month: "Dec", price: 3500, predicted: true },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1", type: "warning",
    title: "Low Calcium Detected",
    message: "Leaf tip monitoring shows calcium deficiency. Consider foliar spray.",
    timestamp: new Date(Date.now() - 15 * 60000), read: false,
  },
  {
    id: "n2", type: "success",
    title: "Photosynthesis Optimal",
    message: "Solar radiation at peak efficiency. All zones performing above baseline.",
    timestamp: new Date(Date.now() - 45 * 60000), read: false,
  },
  {
    id: "n3", type: "info",
    title: "Sensor Hub 04 Updated",
    message: "Firmware v2.4 successfully applied to Sensor Zone 4.",
    timestamp: new Date(Date.now() - 2 * 3600000), read: true,
  },
  {
    id: "n4", type: "alert",
    title: "Heavy Rain Forecast",
    message: "85% rainfall probability tomorrow. Skip irrigation for Zone 1 & 2.",
    timestamp: new Date(Date.now() - 3 * 3600000), read: true,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ml");
  const [activePage, setActivePage] = useState("dashboard");
  const [plots, setPlots] = useState<Plot[]>(DEMO_PLOTS);
  const [userPlots, setUserPlots] = useState<Plot[]>([]); // Plots created by user
  const [activePlot, setActivePlot] = useState<Plot | null>(DEMO_PLOTS[0] ?? null);
  const [sensorData, setSensorData] = useState<SensorData>(generateSensor());
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [onboarded, setOnboarded] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [daysPlanted] = useState(145);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedLang = localStorage.getItem("agrow_lang") as Language;
      const storedPlots = localStorage.getItem("agrow_plots");
      const storedUserPlots = localStorage.getItem("agrow_user_plots");
      const storedOnboarded = localStorage.getItem("agrow_onboarded");
      const storedCrop = localStorage.getItem("agrow_selectedCrop") as CropType;
      const storedAuth = localStorage.getItem("agrow_auth");
      const storedTheme = localStorage.getItem("agrow_theme") as "light" | "dark";
      
      if (storedLang) setLanguage(storedLang);
      if (storedPlots) {
        const parsed = JSON.parse(storedPlots);
        if (parsed && parsed.length > 0) {
          setPlots(parsed);
          setActivePlot(parsed[0]);
        }
      }
      if (storedUserPlots) {
        const parsedUser = JSON.parse(storedUserPlots);
        if (parsedUser && parsedUser.length > 0) {
          setUserPlots(parsedUser);
          setActivePlot(parsedUser[0]);
        }
      }
      if (storedOnboarded) setOnboarded(storedOnboarded === "true");
      if (storedCrop) setSelectedCrop(storedCrop);
      if (storedAuth) setIsAuthenticated(storedAuth === "true");
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme("light");
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("agrow_lang", language);
    localStorage.setItem("agrow_plots", JSON.stringify(plots));
    localStorage.setItem("agrow_user_plots", JSON.stringify(userPlots));
    localStorage.setItem("agrow_onboarded", onboarded.toString());
    localStorage.setItem("agrow_selectedCrop", selectedCrop || "");
    localStorage.setItem("agrow_auth", isAuthenticated.toString());
    localStorage.setItem("agrow_theme", theme);
    
    document.documentElement.setAttribute("data-theme", theme);
  }, [isClient, language, plots, userPlots, onboarded, selectedCrop, isAuthenticated, theme]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const nextWeatherRainfall = DEMO_WEATHER[1].rainfallProbability;
  const irrigationSuggestion: "water" | "skip" = nextWeatherRainfall > 70 ? "skip" : "water";

  const login = (email: string, pass: string) => {
    if (email === "farmer@farmer.in" && pass === "EricGeoKarthik@YIP1stPlace") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addPlot = (p: Plot) => {
    setPlots(prev => [p, ...prev]);
    setUserPlots(prev => [p, ...prev]);
    setActivePlot(p);
  };

  const updatePlot = (id: string, updates: Partial<Plot>) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setUserPlots(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setActivePlot(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  };

  const clearData = () => {
    localStorage.clear();
    setPlots(DEMO_PLOTS);
    setUserPlots([]);
    setActivePlot(DEMO_PLOTS[0] ?? null);
    setOnboarded(false);
    setSelectedCrop(null);
    setIsAuthenticated(false);
    setLanguage("ml");
    setActivePage("dashboard");
  };

  if (!isClient) return null;

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      activePage, setActivePage,
      plots, userPlots, activePlot, setActivePlot,
      sensorData, setSensorData,
      weather: DEMO_WEATHER,
      npk: activePlot ? CROP_PROFILES[activePlot.crop].npkNeeds : null,
      notifications, markNotificationRead,
      onboarded, setOnboarded,
      selectedCrop, setSelectedCrop,
      daysPlanted,
      irrigationSuggestion,
      marketPrices: DEMO_MARKET,
      isAuthenticated,
      login,
      logout,
      addPlot,
      updatePlot,
      clearData,
      theme,
      setTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
