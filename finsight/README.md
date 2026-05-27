# FinSight — AI Financial Intelligence Platform

> Your personal AI financial analyst powered by RAG, Llama 3, and real-time market data.

🌐 **Live Demo:** [finsight-ai-finance.up.railway.app](https://finsight-ai-finance.up.railway.app)

---

## What is FinSight?

FinSight is a full-stack AI-powered financial intelligence platform that lets you:

- Ask anything about stocks, investments, taxes, insurance, and personal finance
- Upload SEC 10-K filings and get AI-powered analysis with cited sources
- Get comprehensive company analysis without uploading any files
- Analyze financial images and documents directly from chat
- Generate detailed research reports with charts and downloadable PDFs

---

## Features

| Feature | Description |
|---|---|
| 🤖 Multi-mode AI | Fast (Llama 3 8B), Standard (Llama 3 70B), Deep Research with full reports |
| 📄 SEC Filing Analysis | Upload 10-K PDFs and query with RAG + vector search |
| 🏢 Company Insight | Get full analysis for any company without uploading files |
| 📊 Visual Reports | Deep mode generates charts, positives/risks, and recommendations |
| 📥 PDF Download | Download research reports as PDFs |
| 🖼️ Image Analysis | Upload financial charts or documents for AI analysis |
| 💬 Chat Memory | Full conversation history across modes |
| 🌙 Dark Mode | Light and dark theme with animated mode transitions |
| 📱 Responsive | Works on mobile and desktop |

---

## Tech Stack

### Backend
- **FastAPI** — REST API
- **LangChain** — RAG orchestration
- **ChromaDB** — Vector database
- **HuggingFace** — Local embeddings (`all-MiniLM-L6-v2`)
- **Groq API** — LLM inference (Llama 3)
- **SQLite** — Chat history persistence
- **Alpha Vantage** — Live market data

### Frontend
- **React + Vite** — UI framework
- **Framer Motion** — Animations
- **Tailwind CSS** — Styling
- **Recharts** — Data visualization
- **jsPDF + html2canvas** — PDF generation

### Deployment
- **Railway** — Backend + Frontend hosting

---

## Architecture

```
User Query
    ↓
React Frontend
    ↓
FastAPI Backend
    ↓
Query Router (Fast / Standard / Deep)
    ↓
HuggingFace Embeddings → ChromaDB Vector Search
    ↓
Groq LLM (Llama 3 8B / 70B)
    ↓
Structured Response (text / report + chart)
    ↓
Chat History → SQLite
```

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (free at console.groq.com)
- Alpha Vantage API key (free at alphavantage.co)

### Backend

```bash
cd finsight/backend
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
uvicorn main:app --reload
```

### Frontend

```bash
cd finsight/frontend
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
```
GROQ_API_KEY=your_groq_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
DATABASE_URL=sqlite:///./finsight.db
```

---

## Project Structure

```
finsight/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── routers/
│   │   ├── query.py         # Chat endpoint
│   │   ├── ingest.py        # PDF/image upload
│   │   ├── history.py       # Chat history
│   │   └── market.py        # Market data
│   ├── services/
│   │   ├── llm_service.py   # Groq LLM calls
│   │   ├── retriever_service.py  # Vector search
│   │   └── ingest_service.py     # PDF chunking
│   └── db/
│       ├── database.py      # SQLAlchemy setup
│       └── models.py        # DB models
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx     # Landing page
    │   │   └── Chat.jsx     # Main chat UI
    │   ├── components/
    │   │   ├── MessageBubble.jsx  # Chat messages
    │   │   └── Sidebar.jsx        # Drawer menu
    │   └── hooks/
    │       ├── useChat.js   # Chat state + API
    │       └── useUpload.js # File upload
    └── index.html
```

---

## Author

**Umang Pawar**
- GitHub: [@Umang07-cell](https://github.com/Umang07-cell)
- Built as a portfolio project demonstrating RAG, LLM integration, and full-stack AI development
