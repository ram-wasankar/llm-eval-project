import os

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from llm import evaluate_response, estimate_cost, generate_response
from models import LogEntry
from schemas import AskRequest, LogResponse

app = FastAPI(title="LLM Observability API")


def _get_allowed_origins() -> list[str]:
    allowed = os.getenv("ALLOWED_ORIGINS", "*")
    if allowed.strip() == "*":
        return ["*"]
    return [origin.strip() for origin in allowed.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


def _next_version(db: Session, prompt: str) -> int:
    latest = db.execute(
        select(func.max(LogEntry.version)).where(LogEntry.prompt == prompt)
    ).scalar()
    return (latest or 0) + 1


def _create_log_entry(db: Session, prompt: str) -> LogEntry:
    response_text, latency = generate_response(prompt)
    estimated_cost = estimate_cost(prompt, response_text)
    score = evaluate_response(prompt, response_text)
    version = _next_version(db, prompt)

    entry = LogEntry(
        prompt=prompt,
        response=response_text,
        latency=latency,
        estimated_cost=estimated_cost,
        score=score,
        version=version,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@app.post("/ask", response_model=LogResponse)
def ask(request: AskRequest, db: Session = Depends(get_db)):
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    try:
        entry = _create_log_entry(db, prompt)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="LLM request failed") from exc
    return entry


@app.get("/logs", response_model=list[LogResponse])
def get_logs(
    min_score: float | None = Query(default=None),
    max_latency: float | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(LogEntry)

    if min_score is not None:
        stmt = stmt.where(LogEntry.score >= min_score)
    if max_latency is not None:
        stmt = stmt.where(LogEntry.latency <= max_latency)
    if search:
        stmt = stmt.where(LogEntry.prompt.ilike(f"%{search}%"))

    stmt = stmt.order_by(LogEntry.timestamp.desc())
    results = db.execute(stmt).scalars().all()
    return results


@app.post("/replay/{log_id}", response_model=LogResponse)
def replay(log_id: int, db: Session = Depends(get_db)):
    existing = db.get(LogEntry, log_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Log entry not found")
    try:
        entry = _create_log_entry(db, existing.prompt)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="LLM request failed") from exc
    return entry
