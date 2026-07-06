import json
import re
from typing import Callable, Optional

import pandas as pd

from core.config import settings
from core.ollama_client import chat

SYSTEM_PROMPT = """You are a precise data-cleaning engine.

You receive one chunk of a dataset as a JSON array of row objects. Clean every \
row and return the result.

Hard rules:
1. Return ONLY a JSON array. No prose, no markdown, no code fences.
2. Output the SAME number of objects as the input, in the SAME order.
3. Keep the SAME keys on every object. Never add or drop keys.
4. Never invent facts. If a value is unrecoverable, use null.
5. Preserve the meaning of each value; only fix what the instructions ask for.
"""

DEFAULT_INSTRUCTIONS = (
    "Fix spelling, grammar, casing and punctuation. Trim extra whitespace. "
    "Standardize obvious inconsistencies. Remove emojis and junk characters. "
    "Leave already-correct values untouched."
)


def _extract_json_array(text: str) -> Optional[list]:
    if not text:
        return None
    text = re.sub(r"```(?:json)?", "", text).strip()
    start, end = text.find("["), text.rfind("]")
    if start == -1 or end == -1 or end < start:
        return None
    try:
        data = json.loads(text[start : end + 1])
        return data if isinstance(data, list) else None
    except json.JSONDecodeError:
        return None


class AICleaningAgent:
    def __init__(
        self,
        chunk_size: int = settings.DEFAULT_CHUNK_SIZE,
        progress_callback: Optional[Callable[[int, str], None]] = None,
    ):
        self.chunk_size = max(1, chunk_size)
        self.progress_callback = progress_callback

    def clean_dataframe(self, df: pd.DataFrame, user_prompt: str = "") -> pd.DataFrame:
        if df.empty:
            return df

        columns = list(df.columns)
        instructions = DEFAULT_INSTRUCTIONS
        if user_prompt and user_prompt.strip():
            instructions += f"\n\nUser instructions (highest priority):\n{user_prompt.strip()}"

        records = df.where(pd.notna(df), None).to_dict(orient="records")
        total = len(records)
        total_chunks = (total + self.chunk_size - 1) // self.chunk_size

        cleaned_rows: list[dict] = []
        for index, start in enumerate(range(0, total, self.chunk_size), start=1):
            chunk = records[start : start + self.chunk_size]
            cleaned_rows.extend(self._clean_chunk(chunk, columns, instructions))
            self._report(index, total_chunks)

        cleaned_df = pd.DataFrame(cleaned_rows)
        return cleaned_df.reindex(columns=columns)

    def _clean_chunk(self, chunk: list[dict], columns: list[str], instructions: str) -> list[dict]:
        user_message = (
            f"{instructions}\n\n"
            f"Columns (keep exactly these keys): {columns}\n"
            f"Rows to clean ({len(chunk)} objects):\n"
            f"{json.dumps(chunk, ensure_ascii=False)}"
        )

        response = chat(user_message, system=SYSTEM_PROMPT)
        parsed = _extract_json_array(response)

        if not parsed or len(parsed) != len(chunk):
            return chunk

        normalized: list[dict] = []
        for original, cleaned in zip(chunk, parsed):
            if isinstance(cleaned, dict):
                normalized.append({col: cleaned.get(col, original.get(col)) for col in columns})
            else:
                normalized.append(original)
        return normalized

    def _report(self, done_chunks: int, total_chunks: int) -> None:
        if not self.progress_callback:
            return
        progress = 20 + int((done_chunks / max(1, total_chunks)) * 65)
        self.progress_callback(progress, f"AI cleaning chunk {done_chunks}/{total_chunks}")
