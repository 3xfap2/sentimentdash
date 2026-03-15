import json
import asyncio
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from backend.services import analyzer

router = APIRouter(prefix="/api", tags=["sentiment"])


class TextRequest(BaseModel):
    text: str


class BatchRequest(BaseModel):
    texts: list[str]


@router.post("/analyze")
async def analyze(req: TextRequest):
    if not req.text.strip():
        raise HTTPException(400, "Text is empty")
    if len(req.text) > 5000:
        raise HTTPException(400, "Text too long (max 5000 chars)")
    return await analyzer.analyze_text(req.text)


@router.post("/batch")
async def batch(req: BatchRequest):
    if not req.texts:
        raise HTTPException(400, "No texts provided")
    return await analyzer.batch_analyze(req.texts)


@router.websocket("/ws/analyze")
async def ws_analyze(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            text = payload.get("text", "")
            if not text:
                await websocket.send_json({"error": "Empty text"})
                continue
            # Stream: send "processing" status first
            await websocket.send_json({"status": "processing"})
            try:
                result = await analyzer.analyze_text(text)
                await websocket.send_json({"status": "done", "result": result})
            except Exception as e:
                await websocket.send_json({"status": "error", "error": str(e)})
    except WebSocketDisconnect:
        pass
