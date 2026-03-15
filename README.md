# SentimentDash 📊

Real-time дашборд анализа тональности текстов на базе Gemini AI.

## Возможности

- ⚡ **WebSocket** — мгновенный анализ в реальном времени
- 📦 **Batch-анализ** — анализируй несколько текстов сразу
- 📈 **Графики** — распределение positive/negative/neutral, таймлайн скора
- 🏷️ **Эмоции и ключевые слова** — извлечение из текста
- 💾 **Экспорт CSV** — сохрани результаты
- 🌍 **Мультиязычность** — работает с русским и английским

## Стек

- **Backend:** Python + FastAPI + WebSockets
- **AI:** Gemini 1.5 Flash (бесплатный tier)
- **Frontend:** React 18 + TypeScript + Recharts + TailwindCSS
- **Docker:** docker-compose

## Быстрый старт

```bash
cp .env.example .env
# Получи ключ: https://aistudio.google.com/apikey
# Вставь в GEMINI_API_KEY=

# Docker
docker-compose up -d
# http://localhost:5173

# Или локально:
cd backend && pip install -r requirements.txt
uvicorn backend.main:app --reload

cd frontend && npm install && npm run dev
```

## API

- `POST /api/analyze` — один текст `{"text": "..."}`
- `POST /api/batch` — батч `{"texts": ["...", "..."]}`
- `WS  /api/ws/analyze` — WebSocket real-time
- `GET /docs` — Swagger UI
