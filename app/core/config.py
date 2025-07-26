from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = ("DATABASE_URL")
    ACCESS_TOKEN_SECRET: str = ("ACCESS_TOKEN_SECRET")

    class Config:
        env_file = ".env"

settings = Settings()