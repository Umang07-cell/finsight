from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from models.schemas import HistoryItem
from db.database import get_db
from db.models import ChatHistory

router = APIRouter()

@router.get("/{session_id}", response_model=List[HistoryItem])
async def get_history(session_id: str, db: Session = Depends(get_db)):
    history = db.query(ChatHistory)\
        .filter(ChatHistory.session_id == session_id)\
        .order_by(ChatHistory.created_at.desc())\
        .limit(50)\
        .all()
    return history

@router.delete("/{session_id}")
async def clear_history(session_id: str, db: Session = Depends(get_db)):
    db.query(ChatHistory)\
        .filter(ChatHistory.session_id == session_id)\
        .delete()
    db.commit()
    return {"message": "History cleared"}