import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers.health import router as health_router
from routers.recommendations import router as recommendations_router

app = FastAPI(
    title="Agrowtechz API",
    description="AI-powered farm recommendation engine using Kimi K2.5, SoilGrids and Open-Meteo",
    version="1.0.0",
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers under /api
app.include_router(health_router, prefix="/api")
app.include_router(recommendations_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Agrowtechz API is running. Visit /docs for the interactive API reference."}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
    )
