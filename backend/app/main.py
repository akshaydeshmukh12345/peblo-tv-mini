from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db.database import Base, engine

# Import all models
from app.models.show import Show
from app.models.season import Season
from app.models.episode import Episode
from app.models.publish_run import PublishRun

# Import API routers
from app.api.shows import router as shows_router
from app.api.seasons import router as seasons_router
from app.api.episodes import router as episodes_router
from app.api.catalog import router as catalog_router


app = FastAPI(
    title="Peblo TV Mini API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create all database tables
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


# API Routers
app.include_router(shows_router)
app.include_router(seasons_router)
app.include_router(episodes_router)
app.include_router(catalog_router)


@app.get("/")
def root():
    return {
        "message": "Peblo TV Mini API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "peblo-tv-mini-api",
    }


@app.get("/health/database")
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }