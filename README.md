# SentimentDash 📊

Real-time дашборд анализа тональности текстов на базе Gemini AI и WebSocket.

## Что это?

Веб-приложение для анализа эмоциональной окраски текстов. Пишешь текст — мгновенно получаешь: тональность (позитивный / негативный / нейтральный), скор от -1 до +1, уверенность модели, список эмоций и ключевых слов. Всё через WebSocket — без перезагрузки страницы.

Есть батч-режим: вставляешь несколько текстов, каждый на новой строке, и анализируешь всё сразу.

## Возможности

- ⚡ **WebSocket** — real-time анализ без polling
- 📦 **Batch-режим** — анализ до 10 текстов одним запросом
- 📈 **Графики** — pie-chart распределения, таймлайн скора (Recharts)
- 🏷️ **Эмоции и ключевые слова** — автоматическое извлечение
- 💾 **Экспорт CSV** — скачать историю всех анализов
- 🌍 **Мультиязычность** — русский, английский и другие языки

## Стек

| Слой | Технология |
|------|------------|
| Backend | Python + FastAPI + WebSockets |
| AI | Gemini 1.5 Flash (бесплатный tier) |
| Frontend | React 18 + TypeScript + TailwindCSS |
| Графики | Recharts |
| Анимации | Framer Motion |
| Деплой | Docker + docker-compose |

## Архитектура

```
sentimentdash/
├── backend/
│   ├── routers/sentiment.py    # POST /api/analyze, /batch, WS /ws/analyze
│   └── services/analyzer.py    # Gemini prompt → JSON {sentiment, score, emotions...}
└── frontend/
    ├── pages/Dashboard.tsx      # Главный дашборд (ввод + графики + история)
    └── components/
        ├── SentimentBadge.tsx   # Бейдж позитивный/негативный/нейтральный
        └── SentimentChart.tsx   # Pie + Line charts (Recharts)
```

## API

```
POST /api/analyze          # {"text": "..."}  → анализ одного текста
POST /api/batch            # {"texts": [...]} → анализ массива
WS   /api/ws/analyze       # WebSocket real-time
GET  /docs                 # Swagger UI
```

## Быстрый старт

```bash
cp .env.example .env
# GEMINI_API_KEY → https://aistudio.google.com/apikey (бесплатно)

# Docker
docker-compose up -d
# http://localhost:5173

# Или локально:
cd backend && pip install -r requirements.txt
uvicorn backend.main:app --reload

cd frontend && npm install && npm run dev
```
