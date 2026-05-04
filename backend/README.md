# LLM Observability Backend

FastAPI service that logs Gemini interactions, evaluates relevance, and stores metrics in PostgreSQL.

## Local setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Update `GEMINI_API_KEY`, `DATABASE_URL`, and optionally `ALLOWED_ORIGINS`.

4. Run the API server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
