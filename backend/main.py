import io
import os
import sys
import json
import logging
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel

# Add workspace to path for local imports
sys.path.append(str(Path(__file__).parent.parent))

import pypdf
import docx

# Try to import local validation scripts
try:
    from scripts.verify_location import check_location_feasibility
except ImportError:
    check_location_feasibility = None

try:
    from scripts.check_budget_limits import check_budget_limits
except ImportError:
    check_budget_limits = None

from backend.agents import (
    call_llm,
    AGENT_1_SYSTEM,
    AGENT_2_SYSTEM,
    AGENT_3_SYSTEM,
    AGENT_4_SYSTEM,
    AGENT_5_SYSTEM,
    AGENT_6_SYSTEM,
    AGENT_7_SYSTEM,
    AGENT_8_SYSTEM
)
from backend.pdf_generator import generate_dpr_pdf

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("r2b-backend")

app = FastAPI(title="R2B Business Advisor API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_cv_file(file_content: bytes, file_name: str) -> str:
    ext = file_name.split('.')[-1].lower()
    text = ""
    try:
        if ext == "pdf":
            pdf_reader = pypdf.PdfReader(io.BytesIO(file_content))
            for page in pdf_reader.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
        elif ext in ["docx", "doc"]:
            doc = docx.Document(io.BytesIO(file_content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            text = file_content.decode('utf-8', errors='ignore')
    except Exception as e:
        logger.error(f"Error parsing file {file_name}: {e}")
        text = f"[Error parsing file {file_name}: {str(e)}]"
    return text

class IdeasRequest(BaseModel):
    profile: Dict[str, Any]

class ValidationRequest(BaseModel):
    profile: Dict[str, Any]
    skills: Dict[str, Any]
    idea: Dict[str, Any]

class PDFRequest(BaseModel):
    profile: Dict[str, Any]
    skills: Dict[str, Any]
    idea: Dict[str, Any]
    market: Dict[str, Any]
    financials: Dict[str, Any]
    risks: Dict[str, Any]
    roadmap: Dict[str, Any]
    advisor: Dict[str, Any]

@app.post("/api/extract")
async def extract_profile(
    file: Optional[UploadFile] = File(None),
    additional_text: Optional[str] = Form(None),
    budget: Optional[float] = Form(None),
    location_city: Optional[str] = Form(None),
    location_country: Optional[str] = Form(None),
    weekly_hours: Optional[int] = Form(None),
    x_api_provider: str = Header(...),
    x_api_key: str = Header(...)
):
    """
    Agent 1 & 2: Takes CV file & manual inputs, extracts profile and runs skills analysis.
    """
    cv_text = ""
    if file:
        file_content = await file.read()
        cv_text = parse_cv_file(file_content, file.filename)
    
    # Construct raw text context for Agent 1
    raw_context = f"""
    === CV/RESUME CONTENT ===
    {cv_text}
    
    === ADDITIONAL INFO ===
    {additional_text or "None provided"}
    
    === EXPLICIT CONSTRAINTS ===
    Available Capital: {f"${budget:,.2f}" if budget is not None else "Not specified"}
    Location: {f"{location_city or ''}, {location_country or ''}".strip() or "Not specified"}
    Weekly Availability: {f"{weekly_hours} hours" if weekly_hours is not None else "Not specified"}
    """
    
    try:
        # Run Agent 1: Profile Analyzer
        profile_json = await call_llm(x_api_provider, x_api_key, AGENT_1_SYSTEM, raw_context)
        
        # Override with explicit values if the LLM missed them or user provided them in inputs
        if budget is not None:
            profile_json["available_capital_usd"] = budget
        if location_city or location_country:
            profile_json["location"] = {
                "city": location_city or profile_json.get("location", {}).get("city", ""),
                "state": profile_json.get("location", {}).get("state", ""),
                "country": location_country or profile_json.get("location", {}).get("country", "")
            }
        if weekly_hours is not None:
            profile_json["weekly_hours_available"] = weekly_hours
            
        # Run Agent 2: Skill Analyzer
        skills_context = f"""
        Experience: {profile_json.get('experience', 'N/A')}
        Technical Skills: {', '.join(profile_json.get('skills_technical', []))}
        Soft Skills: {', '.join(profile_json.get('skills_soft', []))}
        """
        skills_json = await call_llm(x_api_provider, x_api_key, AGENT_2_SYSTEM, skills_context)
        
        return {
            "profile": profile_json,
            "skills": skills_json
        }
    except Exception as e:
        logger.error(f"Error in extraction pipeline: {e}")
        raise HTTPException(status_code=500, detail=f"AI Extraction failed: {str(e)}")

@app.post("/api/generate-ideas")
async def generate_ideas(
    request: IdeasRequest,
    x_api_provider: str = Header(...),
    x_api_key: str = Header(...)
):
    """
    Agent 3: Opportunity Finder. Recommends 3 business ideas.
    """
    try:
        profile_context = json.dumps(request.profile, indent=2)
        ideas_json = await call_llm(x_api_provider, x_api_key, AGENT_3_SYSTEM, profile_context)
        return ideas_json
    except Exception as e:
        logger.error(f"Error generating ideas: {e}")
        raise HTTPException(status_code=500, detail=f"Idea generation failed: {str(e)}")

@app.post("/api/validate-idea")
async def validate_idea(
    request: ValidationRequest,
    x_api_provider: str = Header(...),
    x_api_key: str = Header(...)
):
    """
    Agents 4-8: Sequential SSE execution stream for deep validating a selected idea.
    """
    profile = request.profile
    skills = request.skills
    idea = request.idea
    
    async def sse_generator():
        try:
            # ----------------------------------------------------
            # STEP 1: Hard Gate - Location Validation (Deterministic)
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Location Gate', 'status': 'running', 'message': 'Running location gate validation...'})}\n\n"
            await asyncio.sleep(0.5)
            
            location_verdict = "PASS"
            location_message = "No location-specific barriers found."
            
            if check_location_feasibility:
                try:
                    passed, warnings, blockers = check_location_feasibility(profile, idea)
                    if not passed:
                        location_verdict = "BLOCKED"
                        location_message = " | ".join(blockers)
                    elif warnings:
                        location_verdict = "FLAGGED"
                        location_message = " | ".join(warnings)
                except Exception as e:
                    logger.error(f"Location gate execution error: {e}")
                    location_verdict = "FLAGGED"
                    location_message = f"Error executing deterministic location checks: {str(e)}"
            
            yield f"data: {json.dumps({'agent': 'Location Gate', 'status': 'done', 'verdict': location_verdict, 'message': location_message})}\n\n"
            
            # ----------------------------------------------------
            # STEP 2: Hard Gate - Budget Validation (Deterministic)
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Budget Gate', 'status': 'running', 'message': 'Checking capital budget limits...'})}\n\n"
            await asyncio.sleep(0.5)
            
            budget_verdict = "PASS"
            budget_message = "Startup cost within available capital."
            
            if check_budget_limits:
                try:
                    available = float(profile.get("available_capital_usd", 0.0))
                    cost = float(idea.get("estimated_startup_cost_usd", 0.0))
                    title = idea.get("title", "Selected Idea")
                    passed, msg = check_budget_limits(available, cost, title)
                    if not passed:
                        budget_verdict = "FAIL"
                        budget_message = msg
                except Exception as e:
                    logger.error(f"Budget gate execution error: {e}")
                    budget_verdict = "BORDERLINE"
                    budget_message = f"Error parsing budget metrics: {str(e)}"
            
            yield f"data: {json.dumps({'agent': 'Budget Gate', 'status': 'done', 'verdict': budget_verdict, 'message': budget_message})}\n\n"
            
            # ----------------------------------------------------
            # STEP 3: Agent 4 - Market Research
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Market Research', 'status': 'running', 'message': 'Agent 4: Analyzing market demand and customer pain points...'})}\n\n"
            market_context = f"Profile: {json.dumps(profile)}\nIdea: {json.dumps(idea)}"
            market_data = await call_llm(x_api_provider, x_api_key, AGENT_4_SYSTEM, market_context)
            yield f"data: {json.dumps({'agent': 'Market Research', 'status': 'done', 'data': market_data})}\n\n"
            
            # ----------------------------------------------------
            # STEP 4: Agent 5 - Financial Planner
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Financial Planner', 'status': 'running', 'message': 'Agent 5: Estimating operating costs and revenue targets...'})}\n\n"
            financial_context = f"Profile: {json.dumps(profile)}\nIdea: {json.dumps(idea)}\nMarket: {json.dumps(market_data)}"
            financial_data = await call_llm(x_api_provider, x_api_key, AGENT_5_SYSTEM, financial_context)
            yield f"data: {json.dumps({'agent': 'Financial Planner', 'status': 'done', 'data': financial_data})}\n\n"
            
            # ----------------------------------------------------
            # STEP 5: Agent 6 - Risk Analyzer
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Risk Analyzer', 'status': 'running', 'message': 'Agent 6: Assessing legal risks and compiling doom scenarios...'})}\n\n"
            risk_context = f"""
            Profile: {json.dumps(profile)}
            Idea: {json.dumps(idea)}
            Budget Verdict: {budget_verdict} ({budget_message})
            Location Verdict: {location_verdict} ({location_message})
            Financials: {json.dumps(financial_data)}
            """
            risk_data = await call_llm(x_api_provider, x_api_key, AGENT_6_SYSTEM, risk_context)
            yield f"data: {json.dumps({'agent': 'Risk Analyzer', 'status': 'done', 'data': risk_data})}\n\n"
            
            # ----------------------------------------------------
            # STEP 6: Agent 7 - Business Plan Generator
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Business Plan Generator', 'status': 'running', 'message': 'Agent 7: Compiling 4-week step-by-step launch roadmap...'})}\n\n"
            roadmap_context = f"""
            Profile: {json.dumps(profile)}
            Idea: {json.dumps(idea)}
            Skills Gaps: {json.dumps(skills.get('skill_gaps', []))}
            Risks & Mitigations: {json.dumps(risk_data.get('doom_scenarios', []))}
            """
            roadmap_data = await call_llm(x_api_provider, x_api_key, AGENT_7_SYSTEM, roadmap_context)
            yield f"data: {json.dumps({'agent': 'Business Plan Generator', 'status': 'done', 'data': roadmap_data})}\n\n"
            
            # ----------------------------------------------------
            # STEP 7: Agent 8 - Final Advisor
            # ----------------------------------------------------
            yield f"data: {json.dumps({'agent': 'Final Advisor', 'status': 'running', 'message': 'Agent 8: Scanning local government schemes and compiling final advice...'})}\n\n"
            advisor_context = f"""
            Location: {json.dumps(profile.get('location', {}))}
            Category: {idea.get('category')}
            DPR Summary:
            - Idea: {idea.get('title')}
            - Cost: {idea.get('estimated_startup_cost_usd')}
            - Revenue target: {financial_data.get('monthly_revenue_target')}
            """
            advisor_data = await call_llm(x_api_provider, x_api_key, AGENT_8_SYSTEM, advisor_context)
            yield f"data: {json.dumps({'agent': 'Final Advisor', 'status': 'done', 'data': advisor_data})}\n\n"
            
            # Final finished event
            yield f"data: {json.dumps({'agent': 'Pipeline Complete', 'status': 'finished'})}\n\n"
            
        except Exception as e:
            logger.error(f"Error in validation SSE stream: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return StreamingResponse(sse_generator(), media_type="text/event-stream")

@app.post("/api/download-pdf")
async def download_pdf(request: PDFRequest):
    """
    Compiles analysis results into a PDF using ReportLab and downloads it.
    """
    try:
        data = {
            "profile": request.profile,
            "skills": request.skills,
            "idea": request.idea,
            "market": request.market,
            "financials": request.financials,
            "risks": request.risks,
            "roadmap": request.roadmap,
            "advisor": request.advisor
        }
        pdf_bytes = generate_dpr_pdf(data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=DPR_{data['idea'].get('id', 'business')}.pdf"}
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail=f"PDF Generation failed: {str(e)}")
