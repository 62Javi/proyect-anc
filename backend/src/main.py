from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.endpoints import router

import os

app = FastAPI(title="Fourier Series API")

# Configure CORS - Support local dev, Pi tunnels, Cloudflare Pages, and custom env
default_origins = [
    "https://anc.sixtor.com",
    "https://anc2.sixtor.com",
    "https://anc.sixtor.site",
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:8083",  # Local Production access
    "http://127.0.0.1:8083",
    "http://192.168.1.100:8083",  # Local Pi access
]

env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins = [orig.strip() for orig in env_origins.split(",") if orig.strip()]
else:
    origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*(\.pages\.dev|sixtor\.(com|site))",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Fourier Series API is running"}
