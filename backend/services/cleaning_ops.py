"""
Deterministic cleaning that runs on the WHOLE dataset in one pass (fast, scales
to 100k+ rows). This is where dedup, validation, imputation and duplicate-key
flagging happen — never the AI, because the AI only ever sees one chunk and would
miss anything spanning chunks.

Everything is recorded per-row into a `cleaning_notes` audit column.
"""

import re

import numpy as np
import pandas as pd

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_MISSING_TOKENS = {"", "nan", "none", "null", "na", "n/a", "-"}
_MONEY_HINTS = ("salary", "income", "price", "amount", "cost", "pay", "wage", "fee", "revenue")


def _is_id(name: str) -> bool:
    n = name.lower()
    return n in {"id", "index", "sr", "sno", "s.no", "srno"} or n.endswith("_id")


def _is_age(name: str) -> bool:
    return "age" in name.lower()


def _is_money(name: str) -> bool:
    n = name.lower()
    return any(k in n for k in _MONEY_HINTS)


def _norm_phone(v):
    if pd.isna(v):
        return v
    digits = re.sub(r"\D", "", str(v))
    if len(digits) == 10:
        return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
    if len(digits) == 11 and digits[0] == "1":
        return f"1-{digits[1:4]}-{digits[4:7]}-{digits[7:]}"
    return str(v).strip()


def _note(notes: list[list[str]], mask, msg: str) -> None:
    for pos in np.where(np.asarray(mask))[0]:
        notes[pos].append(msg)


def detect_type(name: str, series: pd.Series) -> str:
    """Classify a column: email / phone / date / numeric / categorical / text."""
    lname = name.lower()
    vals = series.dropna().astype(str).str.strip()
    vals = vals[~vals.str.lower().isin(_MISSING_TOKENS)]
    if vals.empty:
        return "text"
    sample = vals.head(300)
    digits = sample.str.replace(r"\D", "", regex=True)

    if "email" in lname or "mail" in lname:
        return "email"
    if any(k in lname for k in ("phone", "mobile", "contact", "tel", "fax")):
        return "phone"
    if any(k in lname for k in ("date", "joined", "created", "updated", "dob", "birth", "time")):
        return "date"

    if sample.str.match(EMAIL_RE).mean() > 0.5:
        return "email"
    if pd.to_numeric(sample, errors="coerce").notna().mean() > 0.85:
        return "numeric"
    if (sample.str.contains(r"[-.\s/]") & digits.str.len().between(7, 15)).mean() > 0.6:
        return "phone"
    if pd.to_datetime(sample, errors="coerce", format="mixed").notna().mean() > 0.7:
        return "date"
    if vals.nunique() <= 25 and vals.nunique() <= 0.5 * len(vals):
        return "categorical"
    return "text"


def _normalize(df: pd.DataFrame, profile: dict[str, str]) -> None:
    for col, t in profile.items():
        if t == "numeric":
            df[col] = pd.to_numeric(df[col], errors="coerce")
            continue

        s = df[col].astype("string").str.strip()
        s = s.mask(s.str.lower().isin(_MISSING_TOKENS))

        if t == "email":
            df[col] = s.str.lower()
        elif t == "phone":
            df[col] = s.map(_norm_phone)
        elif t == "date":
            df[col] = pd.to_datetime(s, errors="coerce", format="mixed").dt.strftime("%Y-%m-%d")
        else:
            df[col] = s


def _validate(df: pd.DataFrame, profile: dict[str, str], notes: list[list[str]]) -> None:
    for col, t in profile.items():
        if t == "email":
            s = df[col].astype("string")
            invalid = s.notna() & ~s.str.match(EMAIL_RE, na=False)
            df.loc[invalid.fillna(False), col] = pd.NA
            _note(notes, invalid.fillna(False).to_numpy(), f"invalid email removed")

        elif t == "numeric" and not _is_id(col):
            v = pd.to_numeric(df[col], errors="coerce")
            if _is_age(col):
                bad = v.notna() & ((v < 0) | (v > 120))
            elif _is_money(col):
                bad = v.notna() & (v < 0)
            else:
                bad = pd.Series(False, index=df.index)
            bad = bad.fillna(False)
            df.loc[bad, col] = np.nan
            _note(notes, bad.to_numpy(), f"invalid {col} removed")


def _impute(df: pd.DataFrame, profile: dict[str, str], notes: list[list[str]]) -> None:
    for col, t in profile.items():
        if t == "numeric" and not _is_id(col):
            v = pd.to_numeric(df[col], errors="coerce")
            miss = v.isna()
            if miss.any() and v.notna().any():
                med = float(v.median())
                intlike = bool((v.dropna() % 1 == 0).all())
                fill = round(med) if intlike else round(med, 2)
                df[col] = v.fillna(fill)
                _note(notes, miss.to_numpy(), f"{col} imputed ({fill})")
            else:
                df[col] = v

        elif t == "email":
            miss = df[col].isna()
            df.loc[miss, col] = "unknown@email.com"
            _note(notes, miss.to_numpy(), "email imputed (unknown@email.com)")

        elif t == "categorical":
            miss = df[col].isna()
            if miss.any():
                mode = df[col].dropna().mode()
                fill = mode.iloc[0] if len(mode) else "Unknown"
                df.loc[miss, col] = fill
                _note(notes, miss.to_numpy(), f"{col} imputed ({fill})")

        elif t in ("phone", "text"):
            miss = df[col].isna()
            df.loc[miss, col] = "Unknown"
            _note(notes, miss.to_numpy(), f"{col} imputed (Unknown)")

        elif t == "date":
            miss = df[col].isna()
            _note(notes, miss.to_numpy(), "date missing")


def _flag_duplicate_keys(df: pd.DataFrame, profile: dict[str, str], notes: list[list[str]]) -> None:
    for col, t in profile.items():
        if t in ("email", "phone"):
            s = df[col].astype("string")
            real = s.notna() & ~s.isin(["unknown@email.com", "Unknown"])
            counts = s[real].value_counts()
            dupes = set(counts[counts > 1].index)
            mask = (real & s.isin(dupes)).to_numpy()
            _note(notes, mask, f"duplicate {col} flagged")


def _finalize_numeric(df: pd.DataFrame, profile: dict[str, str]) -> None:
    for col, t in profile.items():
        if t == "numeric":
            v = pd.to_numeric(df[col], errors="coerce")
            if v.notna().any() and bool((v.dropna() % 1 == 0).all()):
                df[col] = v.astype("Int64")
            else:
                df[col] = v


def deterministic_clean(df: pd.DataFrame, original_total: int) -> tuple[pd.DataFrame, dict]:
    df = df.reset_index(drop=True)
    profile = {c: detect_type(c, df[c]) for c in df.columns}
    notes: list[list[str]] = [[] for _ in range(len(df))]

    _normalize(df, profile)
    _validate(df, profile, notes)

    # drop fully-empty rows
    keep = df.notna().any(axis=1).to_numpy()
    null_removed = int((~keep).sum())
    df = df[keep].reset_index(drop=True)
    notes = [n for n, k in zip(notes, keep) if k]

    # global exact-duplicate removal (this is what catches cross-chunk dupes)
    dup_mask = df.duplicated(keep="first").to_numpy()
    dup_removed = int(dup_mask.sum())
    keep2 = ~dup_mask
    df = df[keep2].reset_index(drop=True)
    notes = [n for n, k in zip(notes, keep2) if k]

    _impute(df, profile, notes)
    _flag_duplicate_keys(df, profile, notes)
    _finalize_numeric(df, profile)

    cells_imputed = sum(1 for row in notes for n in row if "imputed" in n)
    dupes_flagged = sum(1 for row in notes for n in row if n.startswith("duplicate"))

    df["cleaning_notes"] = ["; ".join(n) if n else "OK" for n in notes]

    stats = {
        "totalRows": original_total,
        "cleanedRows": len(df),
        "duplicatesRemoved": dup_removed,
        "nullRowsRemoved": null_removed,
        "cellsImputed": cells_imputed,
        "duplicatesFlagged": dupes_flagged,
    }
    return df, stats
