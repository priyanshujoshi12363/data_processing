# Prompt2Data — AI Data Cleaning API

Upload a dataset in **any common format**, describe how you want it cleaned in a
prompt, and an AI agent (gpt-oss on **Ollama Cloud**) cleans it row-by-row and
streams the cleaned file straight back to you.

## Privacy: zero data storage

Uploaded data is treated as confidential. It is **never** written to disk, a
database, or any cloud storage. Each request is handled entirely in memory:

```
Upload (bytes in RAM) -> clean in memory -> stream cleaned file back -> RAM freed
```

The only thing touched in MongoDB is the **user's own credit balance**. No file
content, previews, or rows are ever persisted.

## Pipeline

```
POST /clean  (file + prompt)
        |
        v
  Parse into a DataFrame (in memory)      -- file_service.load_dataframe
        |
        v
  AI cleaning agent                        -- ai_agent.AICleaningAgent
   split into row chunks
   each chunk -> gpt-oss (Ollama Cloud)
   clean per prompt, keep keys/order/row-count
   bad chunk -> keep originals (never lose data)
        |
        v
  Drop empty rows + duplicates             -- clean_pipeline.run_cleaning
        |
        v
  Serialize + stream back to the user      -- file_service.serialize_dataframe
```

## Project structure

```
backend/
├── main.py                  FastAPI app
├── requirements.txt
├── .env.example
├── core/
│   ├── config.py            env-driven settings
│   └── ollama_client.py     gpt-oss on Ollama Cloud
├── db/
│   └── db.py                Mongo users collection (credits only)
├── routes/
│   └── clean_routes.py      POST /clean
└── services/
    ├── file_service.py      in-memory load / serialize (any format)
    ├── ai_agent.py          chunked gpt-oss cleaning agent
    └── clean_pipeline.py    in-memory orchestration
```

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env        # then fill in your keys
uvicorn main:app --reload
```

Needs an **Ollama Cloud API key** (https://ollama.com → API Keys) and a MongoDB
connection (for user credits). To run gpt-oss locally instead of the cloud:
`ollama pull gpt-oss:20b`, then set `OLLAMA_HOST=http://localhost:11434`,
`OLLAMA_MODEL=gpt-oss:20b`, and leave `OLLAMA_API_KEY` blank.

## API

### `POST /clean` (multipart form)

| field  | type | notes                                   |
|--------|------|-----------------------------------------|
| userId | str  | Mongo user id (credits are deducted)    |
| file   | file | csv, tsv, json, jsonl, txt, xlsx        |
| prompt | str  | optional cleaning instructions          |

**Response:** the cleaned file as a streaming download. Metadata is returned in
response headers (no data stored server-side):

- `Content-Disposition` — cleaned filename
- `X-Clean-Stats` — JSON: `{ totalRows, cleanedRows, duplicatesRemoved, nullRowsRemoved }`
- `X-Detected-Format` — resolved format (csv, chat, json, ...)
- `X-Credits-Used` / `X-Credits-Remaining`

Errors: `400` unsupported/unparseable file, `402` not enough credits, `404` user not found.

## Notes

- **gpt-oss is the only model.** Every chunk is sent as JSON with strict
  key/row-count rules so structure is preserved and no rows are lost.
- **Synchronous by design** — the cleaned file is returned in the same request so
  nothing has to be stored while you wait. Very large files mean longer requests.
- **Credits:** `ceil(rows / 10) * CREDITS_PER_10_ROWS`, charged only after a
  successful clean.
