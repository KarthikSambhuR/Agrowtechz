import { Hono } from "hono";
import { cors } from "hono/cors";
import recommendations from "./routes/recommendations";

const app = new Hono<{
  Bindings: {
    CORS_ORIGINS: string;
    NVIDIA_MODEL: string;
    NVIDIA_BASE_URL: string;
    NVIDIA_API_KEY: string;
  };
}>();

// CORS middleware
app.use("*", async (c, next) => {
  const allowed = c.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) || [];
  const corsHandler = cors({
    origin: (origin) => {
      if (!origin) return "*";
      if (
        allowed.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return origin;
      }
      return allowed.length > 0 ? allowed[0] : "*";
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
  return corsHandler(c, next);
});

// Health check
app.get("/api/health", (c) => c.json({ status: "ok", service: "Agrowtechz Worker API" }));

// Mount routers
app.route("/api/recommendations", recommendations);

// Root
app.get("/", (c) => {
  return c.json({
    message: "Agrowtechz API is running on Cloudflare Workers. Visit /api/health for status.",
  });
});

export default app;
