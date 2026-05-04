# LLM Observability & Eval Platform

Full-stack platform for logging Gemini LLM interactions, estimating cost and latency, scoring relevance, and visualizing activity in a production-style dashboard.

## Repo structure

```
backend/
frontend/
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## Backend setup (FastAPI + PostgreSQL)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create a database and set the environment variables:

```bash
copy .env.example .env
```

Update `.env` with:
- `GEMINI_API_KEY`
- `DATABASE_URL`
- `ALLOWED_ORIGINS` (optional, comma-separated)

Run the API:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Frontend setup (Next.js + Tailwind)

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to your backend URL (default is `http://localhost:8000`).

## Deployment notes

- Render: set `GEMINI_API_KEY`, `DATABASE_URL`, and `ALLOWED_ORIGINS` (your Vercel URL).
- Vercel: set `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL.

## API endpoints

- `POST /ask`
- `GET /logs`
- `POST /replay/{id}`
