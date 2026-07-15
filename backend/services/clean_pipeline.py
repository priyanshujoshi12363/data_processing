"""
Two-stage in-memory cleaning:

  1. AI polish (chunked, concurrent) — normalizes values per the user's prompt.
     Skipped automatically for large files with no prompt (the deterministic
     stage already handles them fast).
  2. Deterministic finalize — global dedup, validation, imputation,
     duplicate-key flagging and a cleaning_notes audit column.

Stage 2 runs on the whole dataset at once, so it scales to 10k+ rows and never
misses duplicates that span AI chunks.
"""

from typing import Tuple

import pandas as pd

from core.config import settings
from services.ai_agent import AICleaningAgent
from services.cleaning_ops import deterministic_clean


def run_cleaning(
    df: pd.DataFrame,
    prompt: str = "",
    chunk_size: int = settings.DEFAULT_CHUNK_SIZE,
) -> Tuple[pd.DataFrame, dict]:
    total_rows = len(df)
    has_prompt = bool(prompt and prompt.strip())

    # Run the AI stage when the user asked for something specific, or when the
    # file is small enough that a general polish is cheap.
    run_ai = total_rows > 0 and (has_prompt or total_rows <= settings.AI_MAX_AUTO_ROWS)

    if run_ai:
        agent = AICleaningAgent(chunk_size=chunk_size, concurrency=settings.OLLAMA_CONCURRENCY)
        df = agent.clean_dataframe(df, user_prompt=prompt)

    cleaned, stats = deterministic_clean(df, total_rows)
    stats["aiStage"] = run_ai
    return cleaned, stats
