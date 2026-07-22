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

def retrieve_chunks(question: str, mode: str, company: str = None, year: str = None):
    top_k = {
        "fast": settings.FAST_TOP_K,
        "standard": settings.STANDARD_TOP_K,
        "deep": settings.DEEP_TOP_K
    }.get(mode, settings.STANDARD_TOP_K)

    collection = get_chroma_client().get_collection("sec_filings")

    query_embedding = get_embeddings().embed_query(question)

    where_filter = {}
    if company and year:
        where_filter = {"$and": [{"company": company}, {"year": year}]}
    elif company:
        where_filter = {"company": company}
    elif year:
        where_filter = {"year": year}

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_filter if where_filter else None,
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        chunks.append({
            "content": doc,
            "page": int(results["metadatas"][0][i].get("page", 0)),
            "company": results["metadatas"][0][i].get("company", ""),
            "year": results["metadatas"][0][i].get("year", "")
        })

    return chunks