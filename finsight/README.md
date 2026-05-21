# FinSight — SEC Filing Intelligence Engine

AI-powered RAG system for querying SEC 10-K filings with natural language.

## Stack
- Backend: FastAPI + LangChain + ChromaDB/Pinecone
- Frontend: React + Framer Motion + Tailwind CSS
- Database: SQLite (dev) / PostgreSQL (prod)
- Deployment: Railway

## Features
- Upload and ingest SEC 10-K PDF filings
- Natural language Q&A with cited answers
- Multi-document comparison
- Chat history persistence
- Responsive UI for mobile and desktop

## Setup
### Backend
cd backend && pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload

### Frontend
cd frontend && npm install && npm run dev
