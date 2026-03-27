import { EnvironmentalSnapshot, RecommendationRequest } from "../models/types";

function buildPrompt(req: RecommendationRequest, env: EnvironmentalSnapshot): string {
  const { soil, weather } = env;

  const fmt = (v: number | null | undefined, unit: string = "", decimals: number = 2) => {
    return v !== null && v !== undefined ? `${v.toFixed(decimals)}${unit}` : "N/A";
  };

  const lines = [
    "You are an expert agronomist advisor. Analyse the following data for a farm plot and provide a structured JSON response.",
    "",
    "## Plot Details",
    `- Plot: ${req.plot_name} (ID: ${req.plot_id})`,
    `- Crop: ${req.crop}`,
    `- Area: ${req.area_acres} acres`,
    `- Days since planting: ${req.days_planted ?? "N/A"}`,
    `- Number of plants/trees: ${req.plant_count ?? "N/A"}`,
    `- Daily Action Logged by Farmer: ${req.daily_action ?? "None logged"}`,
    `- Soil pH: ${fmt(req.soil_ph)}`,
    "",
    "## Weather Data (today's forecast)",
    `- Max Temp: ${fmt(weather.temperature_2m, "C")}`,
    `- Precip: ${fmt(weather.precipitation_sum, " mm")}`,
    `- ET0: ${fmt(weather.et0_fao_evapotranspiration, " mm")}`,
    `- Soil Moisture 0-9cm: ${fmt(weather.soil_moisture_3_9cm, " m3/m3")}`,
    "",
    "## Instructions",
    "You MUST respond ONLY with a valid JSON object. Do not include markdown code blocks like ```json.",
    "The JSON MUST have the following keys EXACTLY:",
    '1. "title": A short, punchy heading for the dashboard card (e.g., "Rain expected tomorrow.", "Critical moisture deficit."). max 6 words.',
    '2. "subtitle": A brief description explaining what to do (e.g., "You can skip watering to save water.", "Start irrigation immediately to prevent stress."). max 10 words. CRITICAL: If a daily action was logged (e.g., tapped rubber), acknowledge it and estimate the yield (e.g., expected sheets based on plant count).',
    '3. "action_text": Text for the main action button (e.g., "Skip Watering", "Start Pumps", "View Alert"). max 3 words.',
    '4. "metric_value": A relevant numeric figure to display in a badge on the right (e.g., "12%", "+5mm", "35°C").',
    '5. "metric_label": Label for that metric (e.g., "WATER SAVED", "CURRENT DEFICIT", "AIR TEMP").',
    '6. "full_report": A full, structured markdown advisory report supporting the summary above. Include standard headings: ## Summary, ## Immediate Actions, ## Advice.',
    "",
    "Response FORMAT REQUIRED:",
    "{",
    '  "title": "...",',
    '  "subtitle": "...",',
    '  "action_text": "...",',
    '  "metric_value": "...",',
    '  "metric_label": "...",',
    '  "full_report": "## Summary\\n...\\n## Immediate Actions\\n..."',
    "}",
  ];
  return lines.join("\n");
}

export async function fetchRecommendations(
  req: RecommendationRequest,
  env: EnvironmentalSnapshot,
  nvidiaModel: string,
  nvidiaBaseUrl: string,
  nvidiaApiKey: string
): Promise<string> {
  const prompt = buildPrompt(req, env);
  const url = `${nvidiaBaseUrl.replace(/\/$/, "")}/chat/completions`;

  const payload = {
    model: nvidiaModel,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.4,
    top_p: 0.95,
    stream: false,
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (nvidiaApiKey && nvidiaApiKey.trim().toLowerCase() !== "none" && nvidiaApiKey.trim().toLowerCase() !== "local") {
    headers["Authorization"] = `Bearer ${nvidiaApiKey}`;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`LLM error ${resp.status}: ${errorText}`);
    throw new Error(`Cloud LLM error: ${resp.status}`);
  }

  const data: any = await resp.json();
  const choices = data?.choices || [];
  if (choices.length === 0) throw new Error("LLM returned no choices");

  const content = choices[0]?.message?.content;
  if (!content) throw new Error("LLM returned null content");

  // Cleaning
  let cleaned = content.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```")) lines.shift();
    if (lines.length > 0 && lines[lines.length - 1].startsWith("```")) lines.pop();
    cleaned = lines.join("\n").trim();
  }

  // Parse check
  try {
    const parsed = JSON.parse(cleaned);
    const required = ["title", "subtitle", "action_text", "metric_value", "metric_label", "full_report"];
    for (const k of required) {
      if (!(k in parsed)) parsed[k] = k === "full_report" ? content : "N/A";
    }
    return JSON.stringify(parsed);
  } catch (e) {
    console.warn("Failed to parse LLM response as JSON:", e);
    const fallback = {
      title: "Advisory Generated",
      subtitle: "Click More Details to view full report.",
      action_text: "Review",
      metric_value: "New",
      metric_label: "REPORT",
      full_report: content,
    };
    return JSON.stringify(fallback);
  }
}
