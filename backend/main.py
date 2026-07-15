from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.clean_routes import router as clean_router

app = FastAPI(title="Prompt2Data — AI Data Cleaning API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "Content-Disposition",
        "X-Clean-Stats",
        "X-Detected-Format",
        "X-Credits-Used",
        "X-Credits-Remaining",
    ],
)

app.include_router(clean_router)


@app.get("/")
def home():
    return {"status": "ok", "service": "prompt2data-clean"}


@app.get("/health")
def health():
    return {"status": "ok"}
