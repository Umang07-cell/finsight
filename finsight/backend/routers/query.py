import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.schemas import QueryRequest, QueryResponse, Source
from services.retriever_service import retrieve_chunks
from services.llm_service import query_llm
from db.database import get_db
from db.models import ChatHistory

router = APIRouter()

@router.post("/", response_model=QueryResponse)
async def query_filing(request: QueryRequest, db: Session = Depends(get_db)):
    if request.mode not in ["fast", "standard", "deep"]:
        raise HTTPException(status_code=400, detail="Mode must be fast, standard, or deep")

    try:
        chunks = retrieve_chunks(request.question, request.mode)
    except Exception:
        chunks = []

    try:
        result = query_llm(request.question, chunks, request.mode)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

    sources = [Source(**chunk) for chunk in chunks]

    db_entry = ChatHistory(
        session_id=request.session_id,
        question=request.question,
        answer=result["answer"],
        sources=json.dumps([s.dict() for s in sources]),
        mode=request.mode
    )
    db.add(db_entry)
    db.commit()

    return QueryResponse(
        answer=result["answer"],
        sources=sources,
        mode=request.mode,
        model_used=result["model_used"],
        report=result.get("report")
    )