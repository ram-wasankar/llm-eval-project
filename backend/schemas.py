from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AskRequest(BaseModel):
    prompt: str = Field(min_length=1)


class LogResponse(BaseModel):
    id: int
    prompt: str
    response: str
    latency: float
    estimated_cost: float
    score: float
    timestamp: datetime
    version: int

    model_config = ConfigDict(from_attributes=True)
