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

    # Concurrent gpt-oss requests during the AI polish stage.
    OLLAMA_CONCURRENCY = int(os.getenv("OLLAMA_CONCURRENCY", "6"))
    # If there's no user prompt and the file is bigger than this, skip the AI
    # stage entirely — the deterministic pipeline already cleans it fast.
    AI_MAX_AUTO_ROWS = int(os.getenv("AI_MAX_AUTO_ROWS", "2000"))


settings = Settings()
