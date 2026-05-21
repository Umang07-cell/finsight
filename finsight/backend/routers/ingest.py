import os
import shutil
import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import IngestResponse
from services.ingest_service import ingest_pdf
from groq import Groq
from config import get_settings

settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)

router = APIRouter()

UPLOAD_DIR = "./data/filings"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=IngestResponse)
async def ingest_filing(
    file: UploadFile = File(...),
    company_name: str = Form(...),
    year: str = Form(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_path = f"{UPLOAD_DIR}/{company_name}_{year}.pdf"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        chunks_created = ingest_pdf(file_path, company_name, year)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return IngestResponse(
        message="Filing ingested successfully",
        chunks_created=chunks_created,
        company_name=company_name
    )

@router.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        from pypdf import PdfReader
        import io
        contents = await file.read()
        reader = PdfReader(io.BytesIO(contents))
        text = ""
        for page in reader.pages[:10]:
            text += page.extract_text() or ""
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        response = client.chat.completions.create(
            model=settings.STANDARD_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are FinSight, an expert financial analyst. Analyze the provided document and give a comprehensive structured analysis with key findings, insights, and recommendations."
                },
                {
                    "role": "user",
                    "content": f"Analyze this document:\n\n{text[:8000]}"
                }
            ],
            temperature=0.3,
            max_tokens=2048
        )
        return {"analysis": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        ext = file.filename.split('.')[-1].lower()
        media_type = f"image/{ext}" if ext != 'jpg' else "image/jpeg"

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{media_type};base64,{base64_image}"
                            }
                        },
                        {
                            "type": "text",
                            "text": "You are FinSight, an expert financial analyst. Analyze this image in detail. If it contains financial data, charts, graphs, or documents, provide a comprehensive financial analysis with key insights, trends, and recommendations."
                        }
                    ]
                }
            ],
            temperature=0.3,
            max_tokens=2048
        )
        return {"analysis": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))