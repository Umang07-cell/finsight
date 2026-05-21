import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import IngestResponse
from services.ingest_service import ingest_pdf

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