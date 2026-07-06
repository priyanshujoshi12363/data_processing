import io
from typing import Tuple

import pandas as pd

SUPPORTED_EXTENSIONS = {"csv", "tsv", "json", "jsonl", "txt", "xlsx"}

MEDIA_TYPES = {
    "csv": "text/csv",
    "tsv": "text/tab-separated-values",
    "json": "application/json",
    "jsonl": "application/x-ndjson",
    "txt": "text/plain",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


def detect_txt_structure(text: str) -> str:
    stripped = text.strip()
    if not stripped:
        return "text"
    if stripped.startswith(("{", "[")):
        return "json"

    lines = [l for l in text.split("\n") if l.strip()]
    chat_like = 0
    for line in lines[:50]:
        head, sep, _ = line.partition(":")
        if sep and len(head) < 40 and not any(x in head.lower() for x in ("http", "www")):
            chat_like += 1
    if lines and chat_like / len(lines) > 0.6:
        return "chat"

    sample = text[:4000]
    if sample.count(",") > sample.count("\t") and "," in sample:
        return "csv"
    if "\t" in sample:
        return "tsv"
    return "text"


def _parse_chat(text: str) -> pd.DataFrame:
    rows: list[dict] = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        speaker, sep, message = line.partition(":")
        if sep:
            rows.append({"speaker": speaker.strip(), "message": message.strip()})
        elif rows:
            rows[-1]["message"] += " " + line
    if not rows:
        raise ValueError("No chat lines found")
    return pd.DataFrame(rows)


def load_dataframe(data: bytes, ext: str) -> Tuple[pd.DataFrame, dict]:
    ext = ext.lower()
    fmt = ext

    if ext == "csv":
        df = pd.read_csv(io.BytesIO(data))
    elif ext == "tsv":
        df = pd.read_csv(io.BytesIO(data), sep="\t")
    elif ext == "json":
        df = pd.read_json(io.BytesIO(data))
    elif ext == "jsonl":
        df = pd.read_json(io.BytesIO(data), lines=True)
    elif ext == "xlsx":
        df = pd.read_excel(io.BytesIO(data))
    elif ext == "txt":
        text = data.decode("utf-8", errors="ignore")
        fmt = detect_txt_structure(text)
        if fmt == "chat":
            df = _parse_chat(text)
        elif fmt == "json":
            df = pd.read_json(io.StringIO(text))
        elif fmt == "csv":
            df = pd.read_csv(io.StringIO(text))
        elif fmt == "tsv":
            df = pd.read_csv(io.StringIO(text), sep="\t")
        else:
            lines = [l.rstrip("\n") for l in text.split("\n") if l.strip()]
            df = pd.DataFrame({"text": lines})
    else:
        raise ValueError(f"Unsupported file extension: {ext}")

    metadata = {"rows": len(df), "columns": len(df.columns), "detected_format": fmt}
    return df, metadata


def serialize_dataframe(df: pd.DataFrame, ext: str, detected_format: str) -> Tuple[io.BytesIO, str]:
    ext = ext.lower()
    buffer = io.BytesIO()

    if ext == "csv":
        buffer.write(df.to_csv(index=False).encode("utf-8"))
    elif ext == "tsv":
        buffer.write(df.to_csv(sep="\t", index=False).encode("utf-8"))
    elif ext == "json":
        buffer.write(df.to_json(orient="records", indent=2, force_ascii=False).encode("utf-8"))
    elif ext == "jsonl":
        buffer.write(df.to_json(orient="records", lines=True, force_ascii=False).encode("utf-8"))
    elif ext == "xlsx":
        df.to_excel(buffer, index=False)
    elif ext == "txt":
        if detected_format == "chat" and {"speaker", "message"} <= set(df.columns):
            text = "\n".join(f"{r['speaker']}: {r['message']}" for _, r in df.iterrows())
        elif "text" in df.columns and len(df.columns) == 1:
            text = "\n".join(df["text"].astype(str))
        else:
            text = df.to_csv(index=False)
        buffer.write(text.encode("utf-8"))
    else:
        buffer.write(df.to_csv(index=False).encode("utf-8"))

    buffer.seek(0)
    return buffer, MEDIA_TYPES.get(ext, "application/octet-stream")
