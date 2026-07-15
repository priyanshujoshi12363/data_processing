# Prompt2Data

**Clean any dataset with a single prompt.** Upload a messy CSV / Excel / JSON
file, describe how you want it cleaned in plain English, and an AI agent
(gpt-oss on Ollama Cloud) hands back a clean file — row by row. **Your data is
never stored.**

---

## What it does

- Drop a dataset in almost any format (CSV, TSV, JSON, JSONL, TXT, XLSX).
- Describe the cleanup in a prompt: *"fix city spellings, normalize the country
  column to USA, remove emojis from notes."*
- An AI agent chunks the rows, cleans each chunk with **gpt-oss**, preserves the
  exact columns / order / row-count, then strips duplicates and empty rows.
- You get the cleaned file streamed straight back, with a full report of what
  changed.
- **Zero storage** — every file is processed entirely in memory. Nothing is
  written to disk, a database, or cloud storage.

---

## Architecture

```
Browser (Next.js UI)
   │  1. Google sign-in (Firebase)  → JWT
   │  2. POST /api/clean  (file + prompt, Bearer JWT)
   ▼
Next.js route handler  /api/clean
   │  • verifies the Firebase JWT (firebase-admin)
   │  • looks up the user in MongoDB (by uid) → gets _id + credits
   │  • forwards the file to the Python backend as multipart
   ▼
Python FastAPI backend  POST /clean
   │  • parses the file into a DataFrame (in memory)
   │  • AI agent: split into row-chunks → gpt-oss (Ollama Cloud) → clean
   │  • drop duplicate + empty rows
   │  • deduct credits from the same Mongo user (_id)
   │  • stream the cleaned file back  (+ stats in response headers)
   ▼
Cleaned file streamed back through Next.js to the browser download
```

Both apps share **one MongoDB** (`prompt2data` db, `users` collection). The
Next.js side keys users by Firebase `uid`; the Python side deducts credits by the
Mongo `_id`. The `/api/clean` route bridges the two so the browser never talks to
the Python backend directly and the token is always verified server-side.

---

## Repository layout

```
prompt2data/
├── backend/         Python FastAPI cleaning service (gpt-oss, in-memory)
│   ├── main.py
│   ├── core/        config + Ollama Cloud client
│   ├── routes/      POST /clean
│   ├── services/    file parsing, AI agent, pipeline
│   └── README.md    ← backend details
│
└── prompt2data/     Next.js 16 frontend (landing, Google login, dashboard)
    ├── src/app/     pages + /api routes
    ├── src/lib/     auth, firebase, mongo, hooks
    └── README.md    ← frontend details
```

---

## Tech stack

| Layer     | Tech                                                          |
|-----------|--------------------------------------------------------------|
| Frontend  | Next.js 16 (App Router), React 19, Tailwind CSS v4           |
| Auth      | Firebase Authentication (Google / GitHub) + firebase-admin   |
| Database  | MongoDB (users + credits only — never uploaded data)         |
| Backend   | FastAPI, pandas                                              |
| AI model  | gpt-oss (`gpt-oss:120b`) via Ollama Cloud                    |

---

## Running locally

**1. Backend** (`backend/`)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # add OLLAMA_API_KEY + MONGO_URI
uvicorn main:app --reload     # → http://localhost:8000
```

**2. Frontend** (`prompt2data/`)

```bash
cd prompt2data
npm install
cp .env.local.example .env.local   # add Firebase keys, MONGO_URI, PYTHON_API_URL
npm run dev                        # → http://localhost:3000
```

Use the **same `MONGO_URI`** in both `.env` files so credits line up. Point
`PYTHON_API_URL` at the running backend (`http://localhost:8000`).

See `backend/README.md` and `prompt2data/README.md` for the full details of each
side.

---

## Pricing / credits

- New users get **100 free credits** on signup.
- Cost is `ceil(rows / 10)` credits, charged **only after a successful clean**.

---

## Privacy

Uploaded data is treated as confidential. It is processed entirely in memory and
streamed back to the user. It is **never** written to disk, saved to a database,
or uploaded to any third-party storage. MongoDB only ever holds user accounts and
credit balances.
