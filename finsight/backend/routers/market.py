from fastapi import APIRouter, HTTPException
from services.market_service import get_stock_quote, get_market_news, search_symbol

router = APIRouter()

@router.get("/quote/{symbol}")
async def stock_quote(symbol: str):
    result = await get_stock_quote(symbol)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/news")
async def market_news(symbol: str = None):
    return await get_market_news(symbol)

@router.get("/search")
async def search_stock(q: str):
    return await search_symbol(q)