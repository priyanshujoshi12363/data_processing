import time

from ollama import Client

from core.config import settings

_headers = (
    {"Authorization": f"Bearer {settings.OLLAMA_API_KEY}"}
    if settings.OLLAMA_API_KEY
    else None
)

client = Client(host=settings.OLLAMA_HOST, headers=_headers)


def chat(
    prompt: str,
    system: str | None = None,
    temperature: float = 0.2,
    retries: int = 3,
) -> str | None:
    messages: list[dict] = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            response = client.chat(
                model=settings.OLLAMA_MODEL,
                messages=messages,
                options={"temperature": temperature},
            )
            content = response["message"]["content"]
            if content and content.strip():
                return content.strip()
            last_error = ValueError("empty response")
        except Exception as e:
            last_error = e

        if attempt < retries:
            time.sleep(min(2 ** attempt, 8))

    print(f"[ollama] {settings.OLLAMA_MODEL} failed after {retries} attempts: {last_error}")
    return None
