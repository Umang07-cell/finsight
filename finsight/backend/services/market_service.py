import httpx
from config import get_settings

settings = get_settings()

BASE_URL = "https://www.alphavantage.co/query"

async def get_stock_quote(symbol: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params={
            "function": "GLOBAL_QUOTE",
            "symbol": symbol.upper(),
            "apikey": settings.ALPHA_VANTAGE_KEY
        })
        data = response.json()
        quote = data.get("Global Quote", {})
        if not quote:
            return {"error": f"No data found for {symbol}"}
        return {
            "symbol": quote.get("01. symbol"),
            "price": quote.get("05. price"),
            "change": quote.get("09. change"),
            "change_percent": quote.get("10. change percent"),
            "high": quote.get("03. high"),
            "low": quote.get("04. low"),
            "volume": quote.get("06. volume"),
            "latest_trading_day": quote.get("07. latest trading day")
        }

async def get_market_news(symbol: str = None) -> list:
    async with httpx.AsyncClient() as client:
        params = {
            "function": "NEWS_SENTIMENT",
            "apikey": settings.ALPHA_VANTAGE_KEY,
            "limit": 5
        }
        if symbol:
            params["tickers"] = symbol.upper()
        response = await client.get(BASE_URL, params=params)
        data = response.json()
        feed = data.get("feed", [])
        return [
            {
                "title": item.get("title"),
                "summary": item.get("summary"),
                "source": item.get("source"),
                "url": item.get("url"),
                "sentiment": item.get("overall_sentiment_label")
            }
            for item in feed[:5]
        ]

async def search_symbol(keywords: str) -> list:
    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params={
            "function": "SYMBOL_SEARCH",
            "keywords": keywords,
            "apikey": settings.ALPHA_VANTAGE_KEY
        })
        data = response.json()
        matches = data.get("bestMatches", [])
        return [
            {
                "symbol": m.get("1. symbol"),
                "name": m.get("2. name"),
                "type": m.get("3. type"),
                "region": m.get("4. region")
            }
            for m in matches[:5]
        ]