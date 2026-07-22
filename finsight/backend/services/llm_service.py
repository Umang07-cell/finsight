from groq import Groq
from config import get_settings
import json

settings = get_settings()

_client = None

def get_client():
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client

def get_model(mode: str) -> str:
    return {
        "fast": settings.FAST_MODEL,
        "standard": settings.STANDARD_MODEL,
        "deep": settings.DEEP_MODEL
    }.get(mode, settings.STANDARD_MODEL)

def build_context(chunks: list) -> str:
    if not chunks:
        return ""
    return "\n\nFILING CONTEXT:\n" + "\n\n".join([
        f"[Source: {c['company']} {c['year']} | Page {c['page']}]\n{c['content']}"
        for c in chunks
    ])

def build_deep_prompt(question: str, chunks: list) -> str:
    context = build_context(chunks)
    return f"""You are FinSight, a senior financial analyst with 20+ years at Goldman Sachs and Morgan Stanley.{context}

Generate an extremely detailed, specific research report for: {question}

Be specific — use real numbers, percentages, market data, timeframes.
Think like a professional analyst writing for institutional investors.

Return ONLY valid JSON, no extra text:
{{
  "summary": "5-6 sentence executive summary with specific market context and key metrics",
  "key_findings": [
    "Specific finding with data point or percentage",
    "Specific finding with market context",
    "Specific finding with trend analysis",
    "Specific finding with competitive context",
    "Specific finding with forward-looking insight"
  ],
  "positives": [
    "Specific opportunity with reasoning and potential upside",
    "Specific strength with supporting evidence",
    "Specific tailwind with timeline",
    "Specific advantage with market context"
  ],
  "risks": [
    "Specific risk with probability and potential impact",
    "Specific headwind with mitigation strategy",
    "Specific threat with timeline",
    "Specific vulnerability with context"
  ],
  "recommendation": "4-5 sentence highly specific actionable recommendation with exact steps and timelines",
  "confidence": "High/Medium/Low",
  "chart_data": {{
    "type": "bar/line/pie",
    "title": "relevant chart title",
    "labels": ["label1", "label2", "label3", "label4", "label5"],
    "values": [100, 200, 150, 300, 250],
    "unit": "$ millions / % / units"
  }}
}}"""

CONTINUITY_PROMPT = """
CONVERSATION CONTINUITY (critical):
- You have full memory of this conversation — use it aggressively
- When user says "that", "this", "why", "how", "continue", "explain more", "give me that" —
  always resolve the reference from previous messages, never ask what they mean
- If user says "why?" after you explained something, explain the reasoning behind what you just said
- If user says "continue" or "more", expand on your last response
- If user says "give me that" or "do that", execute what was just discussed
- Never restart the conversation or ask for clarification when context makes the meaning obvious
- Think like ChatGPT memory — connect every message to the full conversation thread
- Always be aware of what was said 2-3 messages ago and reference it naturally
"""

ANALYSIS_KEYWORDS = [
    "analyze", "analysis", "report", "compare", "overview",
    "performance", "revenue", "profit", "loss", "investment",
    "stock", "financial", "market", "company", "filing",
    "balance sheet", "income", "debt", "growth", "forecast",
    "insight", "evaluate", "assess", "breakdown", "summary",
    "portfolio", "dividend", "earnings", "valuation", "risk",
    "roadmap", "strategy", "plan", "startup", "business",
    "trend", "outlook", "projection", "sector", "industry",
    "chart", "graph", "show me", "visualize"
]

def query_llm(question: str, chunks: list, mode: str, history: list = []) -> dict:
    model = get_model(mode)
    context = build_context(chunks)

    conversation = []
    for msg in history[-12:]:
        conversation.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    conversation.append({"role": "user", "content": question + context})

    # FAST MODE
    if mode == "fast":
        response = get_client().chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": f""""You are FinSight, an elite AI financial analyst. For greetings reply with exactly one short friendly sentence. For questions give fast, precise, bullet-pointed answers with specific numbers. Never give long introductions.give short answers with specific data and no fluff.and short and smart introduction"
- Get straight to the point
- Use bullet points for clarity
- Include specific numbers and percentages
- No fluff, no disclaimers, no 'as an AI' — just sharp expert answers
- For greetings: one friendly sentence only
{CONTINUITY_PROMPT}"""
                },
                *conversation
            ],
            temperature=0.2,
            max_tokens=1024
        )
        return {
            "answer": response.choices[0].message.content,
            "model_used": model,
            "report": None
        }

    # STANDARD MODE
    if mode == "standard":
        response = get_client().chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": f"""You are FinSight, an expert AI financial analyst and advisor. You think step by step before answering.

CAPABILITIES:
- Deep knowledge of financial markets, stocks, SEC filings, accounting, economics
- Personal finance: budgeting, saving, debt management, tax planning, insurance
- Investment analysis: stocks, bonds, mutual funds, ETFs, crypto
- Business analysis: startups, valuations, business models, market sizing

BEHAVIOR:
- Think carefully before responding
- Structure every response with clear headers, bullets, and numbered steps
- Use real numbers, percentages, and specific examples
- When explaining concepts, use simple analogies first then go deeper
- Always give actionable next steps, not just theory
- If you don't know something current, say so and suggest where to find it
- Match response length to question complexity
- For greetings reply in one sentence only

FORMAT:
- Use ## for section headers
- Use bullet points for lists
- Use **bold** for key terms and numbers
- Use numbered lists for steps/processes
- Include tables for comparative data

Never say 'I cannot' or 'As an AI' — just answer helpfully and directly.
{CONTINUITY_PROMPT}"""
                },
                *conversation
            ],
            temperature=0.3,
            max_tokens=2048
        )
        return {
            "answer": response.choices[0].message.content,
            "model_used": model,
            "report": None
        }

    # DEEP MODE
    if mode == "deep":
        is_analysis_request = any(k in question.lower() for k in ANALYSIS_KEYWORDS)

        if is_analysis_request:
            try:
                response = get_client().chat.completions.create(
                    model=model,
                    messages=[
                        {
                            "role": "system",
                            "content": f"""You are FinSight, the world's most advanced AI financial analyst — trained on every SEC filing, financial report, market dataset, economic paper, and investment thesis ever published. You think like a team of senior analysts from Goldman Sachs, Morgan Stanley, BlackRock, and McKinsey combined.

IDENTITY:
You are not just an AI — you are a trusted financial advisor who has guided Fortune 500 CEOs, hedge fund managers, and everyday investors to make life-changing financial decisions. Every response you give could change someone's financial future. Take that seriously.

THINKING PROCESS — always follow this internally:
1. Understand exactly what the user needs — not just what they asked
2. Consider all angles: financial, market, economic, psychological, timing
3. Research deeply using everything you know
4. Structure your analysis like a Goldman Sachs research report
5. Give specific, actionable insights — not generic advice

ANALYSIS STANDARDS:
- Every claim must be backed by specific data, percentages, or market evidence
- Always provide multiple scenarios: bull case, base case, bear case
- Include specific timelines and milestones
- Quantify risks with probability estimates
- Compare against industry benchmarks and competitors
- Reference current market conditions and macro environment

CRITICAL RULES:
- Never give vague advice without specifics
- Never say 'it depends' without immediately explaining what and how
- Always take a clear stance with reasoning
- Always respond with valid JSON only for analysis — no markdown, no extra text
{CONTINUITY_PROMPT}"""
                        },
                        *conversation[:-1],
                        {"role": "user", "content": build_deep_prompt(question, chunks)}
                    ],
                    temperature=0.4,
                    max_tokens=4096
                )
                raw = response.choices[0].message.content.strip()
                if raw.startswith("```"):
                    raw = raw.split("```")[1]
                    if raw.startswith("json"):
                        raw = raw[4:]
                raw = raw.strip()
                try:
                    report_data = json.loads(raw)
                except:
                    report_data = None
                return {
                    "answer": raw,
                    "model_used": model,
                    "report": report_data
                }
            except Exception as e:
                return {
                    "answer": f"Analysis failed: {str(e)}",
                    "model_used": model,
                    "report": None
                }
        else:
            response = get_client().chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": f"""You are FinSight, an expert AI financial analyst. Be helpful, intelligent and conversational.
- For greetings reply in one short sentence only
- For follow up questions use full conversation context
- Never ask for clarification when context makes meaning obvious
{CONTINUITY_PROMPT}"""
                    },
                    *conversation
                ],
                temperature=0.2,
                max_tokens=512
            )
            return {
                "answer": response.choices[0].message.content,
                "model_used": model,
                "report": None
            }