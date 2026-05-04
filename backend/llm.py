import os
import re
import time

import google.generativeai as genai

MODEL_NAME = "gemini-1.5-flash"
ESTIMATED_COST_PER_1K_WORDS = 0.002

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

genai.configure(api_key=GEMINI_API_KEY)
MODEL = genai.GenerativeModel(MODEL_NAME)


def generate_response(prompt: str) -> tuple[str, float]:
    start = time.perf_counter()
    result = MODEL.generate_content(prompt)
    latency = time.perf_counter() - start
    text = result.text or ""
    return text, latency


def estimate_cost(prompt: str, response: str) -> float:
    total_words = len((prompt + " " + response).split())
    cost = (total_words / 1000.0) * ESTIMATED_COST_PER_1K_WORDS
    return round(cost, 6)


def evaluate_response(prompt: str, response: str) -> float:
    judge_prompt = (
        "You are a strict evaluator. Score how relevant the response is to the prompt "
        "on a scale of 1 to 10. Respond with a single number only.\n\n"
        f"PROMPT:\n{prompt}\n\nRESPONSE:\n{response}\n"
    )
    try:
        result = MODEL.generate_content(judge_prompt)
        raw = (result.text or "").strip()
        return _parse_score(raw)
    except Exception:
        return 1.0


def _parse_score(text: str) -> float:
    match = re.search(r"(\d+(?:\.\d+)?)", text)
    if not match:
        return 1.0
    score = float(match.group(1))
    if score < 1:
        return 1.0
    if score > 10:
        return 10.0
    return score
