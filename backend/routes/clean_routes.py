import json
from math import ceil
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from core.config import settings
from db.db import user_collection
from services.clean_pipeline import run_cleaning
from services.file_service import (
    SUPPORTED_EXTENSIONS,
    load_dataframe,
    serialize_dataframe,
)

router = APIRouter(prefix="/clean", tags=["clean"])


def _chunk_size_for(total_rows: int) -> int:
    if total_rows < 200:
        return 25
    if total_rows < 2000:
        return 40
    if total_rows < 10000:
        return 60
    return 80


@router.post("")
async def clean(
    userId: str = Form(...),
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
):
    filename = file.filename or "data"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported: {sorted(SUPPORTED_EXTENSIONS)}",
        )

    raw = await file.read()

    try:
        df, metadata = load_dataframe(raw, ext)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {e}")

    rows = metadata["rows"]
    if rows == 0:
        raise HTTPException(status_code=400, detail="File has no rows")

    detected_format = metadata["detected_format"]
    required_credits = max(1, ceil(rows / 10) * settings.CREDITS_PER_10_ROWS)

    user = user_collection.find_one({"_id": ObjectId(userId)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    available = user.get("credits", 0)
    if available < required_credits:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Not enough credits",
                "required": required_credits,
                "available": available,
                "rows": rows,
            },
        )

    cleaned_df, stats = run_cleaning(df, prompt=prompt or "", chunk_size=_chunk_size_for(rows))

    user_collection.update_one({"_id": ObjectId(userId)}, {"$inc": {"credits": -required_credits}})

    buffer, media_type = serialize_dataframe(cleaned_df, ext, detected_format)
    base = filename.rsplit(".", 1)[0] if "." in filename else filename
    out_name = f"{base}_cleaned.{ext}"

    headers = {
        "Content-Disposition": f'attachment; filename="{out_name}"',
        "X-Clean-Stats": json.dumps(stats),
        "X-Detected-Format": detected_format,
        "X-Credits-Used": str(required_credits),
        "X-Credits-Remaining": str(available - required_credits),
    }
    return StreamingResponse(buffer, media_type=media_type, headers=headers)
