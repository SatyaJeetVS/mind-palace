import os
from typing import List
from pydantic import BaseSettings, AnyHttpUrl
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Mind Palace"
    
    # CORS
    CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:4200"]
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "mind_palace")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    class Config:
        case_sensitive = True

settings = Settings() 