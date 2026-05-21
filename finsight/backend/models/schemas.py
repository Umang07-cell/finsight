from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class IngestRequest(BaseModel):
    company_name: str
    year: str

class IngestResponse(BaseModel):
    message: str
    chunks_created: int
    company_name: str

class QueryRequest(BaseModel):
    question: str
    session_id: str
    mode: str = "standard"

class Source(BaseModel):
    content: str
    page: int
    company: str
    year: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]
    mode: str
    model_used: str
    report: Optional[Any] = None

class HistoryItem(BaseModel):
    id: int
    session_id: str
    question: str
    answer: str
    sources: str
    mode: str
    created_at: datetime

    class Config:
        from_attributes = True