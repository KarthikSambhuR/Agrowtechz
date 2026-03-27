# Agrowtechz Cloudflare Worker Backend

This is the Agrowtechz backend rewritten for **Cloudflare Workers** using **TypeScript** and **Hono**.

## Why TypeScript?
- **Performance**: Cloudflare Workers' JS engine (V8) is much faster for cold starts and overall execution than the Python (Pyodide) shim.
- **Native Support**: Cloudflare's `fetch` API is first-class in JavaScript.
- **Reliability**: TypeScript provides strong types for the complex data structures used in the farm recommendation engine.

## Local Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Add environment variables**:
    Update `.dev.vars` with your `NVIDIA_API_KEY`.
3.  **Run locally**:
    ```bash
    npm run dev
    ```

## Deployment

To deploy to Cloudflare:

1.  **Login to Wrangler**:
    ```bash
    npx wrangler login
    ```
2.  **Add API Key as a Secret**:
    ```bash
    npx wrangler secret put NVIDIA_API_KEY
    ```
3.  **Deploy**:
    ```bash
    npm run deploy
    ```

## API Endpoints

- `GET /api/health`: Check service status.
- `POST /api/recommendations`: Generate recommendations (same payload format as original backend).
