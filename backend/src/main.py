from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.endpoints import router

app = FastAPI(title="Fourier Series API")

# Configure CORS - Use specific origins for production
origins = [
    "https://anc.sixtor.site",
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:8083",  # Local Production access
    "http://127.0.0.1:8083",
    "http://192.168.1.100:8083", # Local Pi access
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Fourier Series API is running"}
