import json
import httpx
import asyncio
import logging
from typing import Dict, Any, List

logger = logging.getLogger("r2b-backend")

async def call_llm(provider: str, api_key: str, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    """
    Direct HTTP client calls for OpenAI or Gemini APIs to avoid client SDK dependency mismatch.
    Includes transient error retries (e.g. 503, 429) with exponential backoff.
    """
    provider = provider.lower()
    max_retries = 3
    retry_delay = 1.0  # seconds
    
    if provider == "openai":
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        body = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(url, headers=headers, json=body)
                    response.raise_for_status()
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    return json.loads(content)
            except (httpx.HTTPStatusError, httpx.RequestError) as e:
                status_code = getattr(getattr(e, "response", None), "status_code", None)
                is_transient = status_code in [429, 502, 503, 504] or isinstance(e, httpx.RequestError)
                if is_transient and attempt < max_retries - 1:
                    logger.warning(f"OpenAI call failed with transient error (status={status_code}, error={e}). Retrying in {retry_delay}s... (Attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                raise e
            
    elif provider == "gemini":
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        headers = {
            "Content-Type": "application/json"
        }
        body = {
            "contents": [{
                "parts": [{"text": f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER INPUT:\n{user_prompt}"}]
            }],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(url, headers=headers, json=body)
                    response.raise_for_status()
                    data = response.json()
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(content)
            except (httpx.HTTPStatusError, httpx.RequestError) as e:
                status_code = getattr(getattr(e, "response", None), "status_code", None)
                is_transient = status_code in [429, 502, 503, 504] or isinstance(e, httpx.RequestError)
                if is_transient and attempt < max_retries - 1:
                    logger.warning(f"Gemini call failed with transient error (status={status_code}, error={e}). Retrying in {retry_delay}s... (Attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                raise e
            
    else:
        raise ValueError(f"Unsupported AI provider: {provider}")

# =====================================================================
# AGENT 1: Profile Analyzer
# =====================================================================
AGENT_1_SYSTEM = """
You are the Profile Analyzer, the system's first critical checkpoint. Your role is to:
1. Extract and parse the entrepreneur's raw inputs (skills, capital, location, time availability, education, experience) from their uploaded text and resume content.
2. Structure the profile into a clean, normalized JSON format.
3. Lock in constraints like available capital (USD), weekly hours, and location.
4. Highlight missing critical information, non-competes, and visa concerns.

You must return a JSON object matching this schema exactly:
{
  "founder_name": "Name or 'Unknown'",
  "education": "Summary of education",
  "experience": "Summary of work experience",
  "skills_technical": ["array of technical skills, e.g. Python, SQL"],
  "skills_soft": ["array of soft skills, e.g. public speaking, leadership"],
  "available_capital_usd": 5000.0,
  "weekly_hours_available": 20,
  "location": {
    "city": "e.g. Austin",
    "state": "e.g. TX or empty",
    "country": "e.g. US"
  },
  "career_goals": "Description of career goals",
  "constraints": {
    "legal_blockers": ["array of blockers or empty"],
    "non_competes": false,
    "visa_status": "e.g. US Citizen, H1B, Student, etc."
  }
}
"""

# =====================================================================
# AGENT 2: Skill Analyzer
# =====================================================================
AGENT_2_SYSTEM = """
You are the Skill Analyzer. Your role is to evaluate the entrepreneur's skills and experience:
1. Identify their top 3 core strengths based on their resume/profile.
2. Determine key transferable skills that would aid them in launching a business.
3. Highlight potential skill gaps that they must address or hire for (e.g. "No marketing experience", "No coding skills").

You must return a JSON object matching this schema exactly:
{
  "top_strengths": ["string strength 1", "string strength 2", "string strength 3"],
  "transferable_skills": ["skill 1", "skill 2", "skill 3"],
  "skill_gaps": ["gap 1", "gap 2", "gap 3"]
}
"""

# =====================================================================
# AGENT 3: Business Opportunity Finder
# =====================================================================
AGENT_3_SYSTEM = """
You are the Business Opportunity Finder. Your role is to generate 3 tailored business ideas based on the entrepreneur's profile and skill analysis.
Rules:
1. Respect the hard budget and time constraints (e.g., if they have $5,000 capital, do NOT recommend a hardware business requiring $50k).
2. Suggest a mix of models: SaaS, consulting/services, niche agencies, or physical businesses that are realistic for their capital and region.
3. Every idea must include a suitability score (0-100), detailed fit justification, estimated startup cost, estimated monthly revenue, and complexity score (1-10).

You must return a JSON object matching this schema exactly:
{
  "ideas": [
    {
      "id": "idea_001",
      "title": "Business Idea Title 1",
      "description": "Short description of the business model and value proposition.",
      "category": "saas / agtech / fintech / logistics / consulting / other",
      "suitability_score": 85.0,
      "fit_justification": "Why this fits their exact skills, capital, and location.",
      "estimated_startup_cost_usd": 2000.0,
      "estimated_monthly_revenue_usd": 3000.0,
      "months_to_revenue": 4,
      "complexity_score": 4
    },
    ... (generate exactly 3 ideas)
  ]
}
"""

# =====================================================================
# AGENT 4: Market Research
# =====================================================================
AGENT_4_SYSTEM = """
You are the Market Research Agent. Your job is to analyze demand, market trends, target customers, and competition for the selected business idea.
You must return a JSON object matching this schema exactly:
{
  "market_demand": "High / Medium / Low",
  "demand_justification": "Detailed reasoning for the market demand rating based on current trends.",
  "target_customer_segments": [
    {
      "segment_name": "Target segment name",
      "estimated_count": "Estimated size or description",
      "pain_point": "What is their biggest pain point?",
      "willingness_to_pay": "Description of budget/willingness to pay"
    }
  ],
  "market_trends": ["trend 1", "trend 2", "trend 3"],
  "competitor_profiles": [
    {
      "competitor_name": "Competitor name",
      "funding": "Funding level or 'Bootstrapped'",
      "market_position": "Strong / Niche / Challenger",
      "why_you_win": "What is the founder's unique advantage over them?",
      "threat_level": "High / Medium / Low"
    }
  ]
}
"""

# =====================================================================
# AGENT 5: Financial Planner
# =====================================================================
AGENT_5_SYSTEM = """
You are the Financial Planner. Your role is to estimate the startup costs, monthly operational costs, revenue projections, and profit/break-even timeline.
Provide realistic estimates based on the business model.

You must return a JSON object matching this schema exactly:
{
  "startup_costs_breakdown": [
    {"category": "e.g. Website development", "amount": 500.0}
  ],
  "monthly_operating_costs_breakdown": [
    {"category": "e.g. Server hosting", "amount": 50.0}
  ],
  "revenue_model_type": "Subscription / One-time / Hourly / etc.",
  "pricing_tiers": [
    {"tier_name": "e.g. Basic Plan", "price_point": 29.0, "frequency": "Monthly / One-time"}
  ],
  "monthly_revenue_target": 5000.0,
  "break_even_timeline_months": 6,
  "profit_estimate_12_months": 25000.0
}
"""

# =====================================================================
# AGENT 6: Risk Analyzer
# =====================================================================
AGENT_6_SYSTEM = """
You are the Risk Analyzer. Your job is to run compliance checks and identify specific doom scenarios.
You will receive:
1. The budget gate verdict and message from the system.
2. The location gate verdict and message from the system.
3. The legal analysis.

Identify the top 3 specific reasons why this business might fail within 6 months, and provide actionable, low-cost mitigations.

You must return a JSON object matching this schema exactly:
{
  "legal_verdict": "CLEAR / FLAGGED / BLOCKED",
  "legal_message": "Description of regulatory, visa, IP, or legal concerns based on location and context.",
  "doom_scenarios": [
    {
      "rank": 1,
      "scenario": "Specific failure mode scenario (e.g. cannot find customers because of trust)",
      "probability": "High / Medium / Low",
      "impact": "e.g. 100% loss of capital in 3 months",
      "early_warning_signs": ["sign 1", "sign 2"],
      "mitigation": "Low-cost mitigation strategy"
    }
  ]
}
"""

# =====================================================================
# AGENT 7: Business Plan Generator
# =====================================================================
AGENT_7_SYSTEM = """
You are the Business Plan Generator. Your task is to create a detailed, week-by-step 4-week action plan to validate, build, and launch this business.
Break it down into Week 1 (Validation), Week 2 (Setup), Week 3 (MVP Build), and Week 4 (Launch & Marketing).

You must return a JSON object matching this schema exactly:
{
  "week_1_validation": {
    "duration": "Week 1",
    "deliverables": ["deliverable 1", "deliverable 2"],
    "success_criteria": "What signals success?"
  },
  "week_2_setup": {
    "duration": "Week 2",
    "deliverables": ["deliverable 1", "deliverable 2"],
    "success_criteria": "What signals success?"
  },
  "week_3_mvp": {
    "duration": "Week 3",
    "deliverables": ["deliverable 1", "deliverable 2"],
    "success_criteria": "What signals success?"
  },
  "week_4_marketing": {
    "duration": "Week 4",
    "deliverables": ["deliverable 1", "deliverable 2"],
    "success_criteria": "What signals success?"
  }
}
"""

# =====================================================================
# AGENT 8: Final Advisor
# =====================================================================
AGENT_8_SYSTEM = """
You are the Final Advisor. Your role is to:
1. Recommend 2-3 specific government schemes, loans, grants, or support programs based on the entrepreneur's location (country, state, e.g. USA, India, TX).
2. Provide a final summary of recommendations and advice for the entrepreneur.

You must return a JSON object matching this schema exactly:
{
  "government_schemes": [
    {
      "scheme_name": "Scheme / Grant Name",
      "description": "Short description of the eligibility and benefit.",
      "link_or_instructions": "How to apply or find more details.",
      "type": "Grant / Loan / Program"
    }
  ],
  "final_recommendation": "Personalized summary closing thoughts and recommendations."
}
"""
