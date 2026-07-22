import os
from config import get_settings

settings = get_settings()

_embeddings = None
_chroma_client = None

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        from langchain_huggingface import HuggingFaceEmbeddings
        _embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return _embeddings

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        import chromadb
        _chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PATH)
    return _chroma_client

def ingest_pdf(file_path: str, company_name: str, year: str) -> int:
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    loader = PyPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP
    )
    chunks = splitter.split_documents(documents)

    collection_name = "sec_filings"
    try:
        collection = get_chroma_client().get_collection(collection_name)
    except:
        collection = get_chroma_client().create_collection(collection_name)

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

    embedded = get_embeddings().embed_documents(texts)

    collection.add(
        embeddings=embedded,
        documents=texts,
        metadatas=metadatas,
        ids=ids
    )

    return len(chunks)