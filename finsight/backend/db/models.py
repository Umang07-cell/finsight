from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from db.database import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    question = Column(Text)
    answer = Column(Text)
    sources = Column(Text)
    mode = Column(String, default="standard")
    created_at = Column(DateTime(timezone=True), server_default=func.now())