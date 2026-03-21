"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ml";

export type CropType = "pineapple" | "rubber" | "rice" | "palm_oil" | "coffee" | "spices" | "sugarcane" | "tea";

export interface Plot {
  id: string;
  name: string;
  crop: CropType;
  area: number; // acres
  coordinates: [number, number][];
  soilPH: number;
  soilHealth: number; // 0-100
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
  activePlot: Plot | null;
  setActivePlot: (p: Plot) => void;
  sensorData: SensorData;
  weather: WeatherForecast[];
  npk: NPK;
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

const DEMO_PLOTS: Plot[] = [
  {
    id: "plot-alpha-7",
    name: "Plot Alpha-7",
    crop: "pineapple",
    area: 1.2,
    coordinates: [[8.5241, 76.9366], [8.5245, 76.9380], [8.5230, 76.9385], [8.5225, 76.9370]],
    soilPH: 6.5,
    soilHealth: 84,
  },
  {
    id: "plot-beta-2",
    name: "Plot Beta-2",
    crop: "rubber",
    area: 2.8,
    coordinates: [[8.5260, 76.9400], [8.5268, 76.9418], [8.5248, 76.9422], [8.5240, 76.9405]],
    soilPH: 5.8,
    soilHealth: 72,
  },
];

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
  const [language, setLanguage] = useState<Language>("en");
  const [activePage, setActivePage] = useState("dashboard");
  const [plots] = useState<Plot[]>(DEMO_PLOTS);
  const [activePlot, setActivePlot] = useState<Plot>(DEMO_PLOTS[0]);
  const [sensorData, setSensorData] = useState<SensorData>(generateSensor());
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [onboarded, setOnboarded] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [daysPlanted] = useState(145);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(generateSensor());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const nextWeatherRainfall = DEMO_WEATHER[1].rainfallProbability;
  const irrigationSuggestion: "water" | "skip" = nextWeatherRainfall > 70 ? "skip" : "water";

  const login = (email: string, pass: string) => {
    if (email === "farmer@farmer.in" && pass === "farmer") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      activePage, setActivePage,
      plots, activePlot, setActivePlot,
      sensorData,
      weather: DEMO_WEATHER,
      npk: CROP_PROFILES[activePlot?.crop ?? "pineapple"].npkNeeds,
      notifications, markNotificationRead,
      onboarded, setOnboarded,
      selectedCrop, setSelectedCrop,
      daysPlanted,
      irrigationSuggestion,
      marketPrices: DEMO_MARKET,
      isAuthenticated,
      login,
      logout,
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
