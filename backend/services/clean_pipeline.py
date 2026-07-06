from typing import Tuple

import pandas as pd

from core.config import settings
from services.ai_agent import AICleaningAgent


def run_cleaning(df: pd.DataFrame, prompt: str = "", chunk_size: int = settings.DEFAULT_CHUNK_SIZE) -> Tuple[pd.DataFrame, dict]:
    total_rows = len(df)

    agent = AICleaningAgent(chunk_size=chunk_size)
    cleaned = agent.clean_dataframe(df, user_prompt=prompt)

    before = len(cleaned)
    cleaned = cleaned.dropna(how="all")
    null_removed = before - len(cleaned)

    before = len(cleaned)
    cleaned = cleaned.drop_duplicates().reset_index(drop=True)
    dup_removed = before - len(cleaned)

    stats = {
        "totalRows": total_rows,
        "cleanedRows": len(cleaned),
        "duplicatesRemoved": dup_removed,
        "nullRowsRemoved": null_removed,
    }
    return cleaned, stats
