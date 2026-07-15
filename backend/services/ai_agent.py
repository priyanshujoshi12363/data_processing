"""
AI polish stage.

The agent ONLY normalizes values per the user's instructions (typos, casing,
formatting). It never adds/removes rows, never deduplicates, never fills in
missing values, and never invents data — all of that is handled deterministically
on the whole dataset afterwards (see cleaning_ops.py). Chunks are independent, so
they run concurrently to stay fast on large files.
"""

import json
import re
from concurrent.futures import ThreadPoolExecutor
from typing import Optional

import pandas as pd

from core.config import settings
from core.ollama_client import chat

SYSTEM_PROMPT = """You are a precise data-normalizing engine.

You receive one chunk of a dataset as a JSON array of row objects. Normalize the \
values and return the result.

Hard rules:
1. Return ONLY a JSON array. No prose, no markdown, no code fences.
2. Output the SAME number of objects as the input, in the SAME order.
3. Keep the SAME keys on every object. Never add or drop keys.
4. Do NOT invent data. If a value is missing or clearly invalid, return null for it.
5. Do NOT deduplicate and do NOT fill in missing values — that is handled elsewhere.
6. Only normalize: fix spelling/casing, trim whitespace, standardize formats.
"""

DEFAULT_INSTRUCTIONS = (
    "Fix spelling and casing, trim whitespace, and standardize obvious formatting "
    "inconsistencies. Leave already-correct values untouched. Return null for "
    "missing or clearly invalid values (do not guess replacements)."
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
        concurrency: int = settings.OLLAMA_CONCURRENCY,
    ):
        self.chunk_size = max(1, chunk_size)
        self.concurrency = max(1, concurrency)

    def clean_dataframe(self, df: pd.DataFrame, user_prompt: str = "") -> pd.DataFrame:
        if df.empty:
            return df

        columns = list(df.columns)
        instructions = DEFAULT_INSTRUCTIONS
        if user_prompt and user_prompt.strip():
            instructions += f"\n\nUser instructions (highest priority):\n{user_prompt.strip()}"

        records = df.where(pd.notna(df), None).to_dict(orient="records")
        chunks = [records[i : i + self.chunk_size] for i in range(0, len(records), self.chunk_size)]
        results: list[Optional[list[dict]]] = [None] * len(chunks)

        with ThreadPoolExecutor(max_workers=self.concurrency) as executor:
            futures = {
                executor.submit(self._clean_chunk, chunk, columns, instructions): idx
                for idx, chunk in enumerate(chunks)
            }
            for future in futures:
                idx = futures[future]
                results[idx] = future.result()

        cleaned_rows = [row for chunk in results if chunk for row in chunk]
        return pd.DataFrame(cleaned_rows).reindex(columns=columns)

    def _clean_chunk(self, chunk: list[dict], columns: list[str], instructions: str) -> list[dict]:
        user_message = (
            f"{instructions}\n\n"
            f"Columns (keep exactly these keys): {columns}\n"
            f"Rows to normalize ({len(chunk)} objects):\n"
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
