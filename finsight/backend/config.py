import os
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

class Settings:
    ALPHA_VANTAGE_KEY: str = os.getenv("ALPHA_VANTAGE_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./finsight.db")
    FAST_MODEL: str = "llama-3.1-8b-instant"
    STANDARD_MODEL: str = "llama-3.3-70b-versatile"
    DEEP_MODEL: str = "llama-3.3-70b-versatile"
    FAST_TOP_K: int = 5
    STANDARD_TOP_K: int = 10
    DEEP_TOP_K: int = 20
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    CHROMA_PATH: str = "./chroma_db"

@lru_cache()
def get_settings():
    return Settings()