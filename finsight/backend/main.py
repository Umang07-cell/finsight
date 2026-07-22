from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ingest, query, history, market
from db.database import init_db

app = FastAPI(
    title="FinSight API",
    description="SEC Filing Intelligence Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://protective-warmth-production-a213.up.railway.app",
        "https://finsight-frontend.onrender.com",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok", "service": "finsight-api"}

app.include_router(ingest.router, prefix="/api/ingest", tags=["Ingest"])
app.include_router(query.router, prefix="/api/query", tags=["Query"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(market.router, prefix="/api/market", tags=["Market"])

@app.get("/")
async def root():
    return {"message": "FinSight API is running"}