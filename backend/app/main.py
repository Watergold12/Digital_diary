from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, entries, tags
from app.core.database import Base, engine

app = FastAPI(
    title="Digital Diary API",
    description="Backend API for the Digital Diary application",
    version="1.0.0"
)

# Set up CORS
origins = [
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(entries.router)
app.include_router(tags.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running successfully"}
