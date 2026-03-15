"""Анализ тональности через Gemini 1.5 Flash."""
import os
import json
import httpx
from datetime import datetime

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent?key={key}"
)

PROMPT = """Проанализируй тональность текста. Верни ТОЛЬКО валидный JSON без markdown-обёртки.

Текст:
---
{text}
---

JSON:
{{
  "sentiment": "positive" | "negative" | "neutral",
  "score": число от -1.0 до 1.0,
  "confidence": число от 0.0 до 1.0,
  "emotions": ["список", "эмоций", "из", "текста"],
  "keywords": ["ключевые", "слова"],
  "summary": "краткое описание тональности 1 предложение",
  "language": "язык текста (ru/en/etc)"
}}"""


async def analyze_text(text: str) -> dict:
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY not set")

    payload = {
        "contents": [{"parts": [{"text": PROMPT.format(text=text[:3000])}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 512},
    }

    async with httpx.AsyncClient(timeout=20) as c:
        r = await c.post(GEMINI_URL.format(key=key), json=payload)
        r.raise_for_status()
        raw = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    result = json.loads(raw)
    result["text"] = text[:200]
    result["timestamp"] = datetime.utcnow().isoformat()
    return result


async def batch_analyze(texts: list[str]) -> list[dict]:
    results = []
    for text in texts[:10]:  # limit batch
        try:
            r = await analyze_text(text)
            results.append(r)
        except Exception as e:
            results.append({
                "text": text[:200],
                "sentiment": "neutral",
                "score": 0.0,
                "confidence": 0.0,
                "emotions": [],
                "keywords": [],
                "summary": f"Ошибка: {e}",
                "language": "unknown",
                "timestamp": datetime.utcnow().isoformat(),
            })
    return results
