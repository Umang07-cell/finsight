import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
import chromadb
from config import get_settings

settings = get_settings()

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PATH)

def ingest_pdf(file_path: str, company_name: str, year: str) -> int:
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP
    )
    chunks = splitter.split_documents(documents)

    collection_name = "sec_filings"
    try:
        collection = chroma_client.get_collection(collection_name)
    except:
        collection = chroma_client.create_collection(collection_name)

    texts = [chunk.page_content for chunk in chunks]
    metadatas = [
        {
            "company": company_name,
            "year": year,
            "page": str(chunk.metadata.get("page", 0))
        }
        for chunk in chunks
    ]
    ids = [f"{company_name}_{year}_{i}" for i in range(len(chunks))]

    embedded = embeddings.embed_documents(texts)

    collection.add(
        embeddings=embedded,
        documents=texts,
        metadatas=metadatas,
        ids=ids
    )

    return len(chunks)