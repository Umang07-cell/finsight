import os
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

def _fix_sslmode(url: str) -> str:
    if "sslmode=required" in url:
        return url.replace("sslmode=required", "sslmode=require")
    return url

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DATABASE_URL: str = _fix_sslmode(os.getenv("DATABASE_URL", "sqlite:///./finsight.db"))
    FAST_MODEL: str = "llama-3.1-8b-instant"
    STANDARD_MODEL: str = "llama-3.3-70b-versatile"
    DEEP_MODEL: str = "llama-3.3-70b-versatile"
    FAST_TOP_K: int = 5
    STANDARD_TOP_K: int = 10
    DEEP_TOP_K: int = 20
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    CHROMA_PATH: str = os.getenv("CHROMA_PATH", "/var/data/chroma_db")

@lru_cache()
def get_settings():
    return Settings()