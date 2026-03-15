from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import sentiment

app = FastAPI(title="SentimentDash API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sentiment.router)


@app.get("/health")
def health():
    return {"status": "ok"}
