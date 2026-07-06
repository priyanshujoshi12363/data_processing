import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME", "prompt2data")

    OLLAMA_HOST = os.getenv("OLLAMA_HOST", "https://ollama.com")
    OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gpt-oss:120b")

    DEFAULT_CHUNK_SIZE = int(os.getenv("CLEAN_CHUNK_SIZE", "40"))
    CREDITS_PER_10_ROWS = int(os.getenv("CREDITS_PER_10_ROWS", "1"))


settings = Settings()
