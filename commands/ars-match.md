# Command: ars-match
## Idea Generation & Market Matching Orchestration

---

## COMMAND OVERVIEW
**Purpose:** Search research databases and market intel to generate 5-8 candidate business ideas tailored to the entrepreneur's profile.

**Prerequisite:** `ars-intake` must be completed (passport locked)

**Trigger:** User says "Show me ideas," "What opportunities are there?", or automatically after `ars-intake`

**Flow:** Horizon Scanner (Agent 2) generates ideas → Jargon Breaker (Agent 3) translates → Output candidate portfolio

---

## COMMAND EXECUTION FLOW

### Step 1: Horizon Scanner Launches
System activates Agent 2 (Horizon Scanner) with the locked passport:

```
🔍 HORIZON SCANNER ACTIVATED

Scanning research databases for opportunities aligned with:
- Capital: $[X]
- Time: [Y] hours/week
- Location: [City, State]
- Skills: [List]
- Networks: [List if any]

Searching across:
✓ Academic research (ArXiv, Google Scholar)
✓ Competitive landscape (Crunchbase, AngelList)
✓ Market trends (Gartner, McKinsey, PitchBook)
✓ Open-source ecosystems (GitHub, ProductHunt)

This may take 2-3 minutes. Generating candidates...
```

### Step 2: Search Strategy Execution
Horizon Scanner executes targeted searches:

**Search Query Examples:**

For a **software engineer with ML skills in Austin, $5K capital:**
- ArXiv: "machine learning + agriculture OR healthcare OR fintech" (filter: 2023-2024)
- Crunchbase: "Startups in [ML domain] with <$5M funding" (to find bootstrappable ideas)
- PitchBook: "Fastest growing markets CAGR >20%" (filter: Texas, remote-friendly)
- GitHub: "Popular open-source projects in [domain]" (star count >10K indicates demand)

For a **marketer with 10 years B2B experience, $2K capital, remote-capable:**
- Crunchbase: "B2B SaaS founded 2023-2024 by bootstrapped founders"
- LinkedIn: "Emerging demand signals in [industry vertical]"
- ProductHunt: "Marketing tools launched in last 6 months" (competitive landscape)
- TechCrunch: "Industries with hiring + funding velocity"

### Step 3: Idea Generation Matrix
Horizon Scanner creates candidate ideas across three dimensions:

```
DIMENSION 1: Revenue Model
- SaaS (recurring)
- Marketplace (two-sided)
- Consulting/Services (hourly/project)
- Product (one-time)

DIMENSION 2: Market Type
- B2B SaaS (enterprise, SMB, micro)
- B2C (consumer, niche)
- B2B2C (platform)

DIMENSION 3: Technical Moat
- AI/ML (defensible)
- Data (network effects)
- Community (switching costs)
- Speed (early-mover advantage)
```

**Candidate Examples (for ML Engineer, $5K, Austin):**

1. **Crop Disease Detection App** (Research-to-Business Translation)
   - Revenue: Subscription ($5-10/user/month OR $500-2K/cooperatives/year)
   - Market: B2B2C (farmers via agricultural platforms)
   - Moat: Trained ML model + agricultural data

2. **Precision Agriculture Data API** (Adjacent Opportunity)
   - Revenue: Usage-based API pricing ($100-500/month per client)
   - Market: B2B SaaS (agtech platforms need data)
   - Moat: Data aggregation, normalization, real-time delivery

3. **ML Training Consulting** (Leverage Existing Skills)
   - Revenue: Project-based consulting ($200-300/hour)
   - Market: B2B services (companies training custom models)
   - Moat: Specialized expertise, faster delivery

4. **White-Label Agtech Platform** (Franchise Model)
   - Revenue: Licensing + revenue share (cooperative gets 30%, you get 70%)
   - Market: B2B2C (direct to ag cooperatives)
   - Moat: Turnkey product, network effects

### Step 4: Candidate Scoring
Each idea gets scored on:

```
CANDIDATE SCORECARD

Idea: [Name]
Source: [Where it came from]

Constraint Fit: [1-10]
  Capital Required: $[Amount] ✓ or ✗
  Time to MVP: [Weeks] ✓ or ✗
  Geographic Fit: [✓ or ✗]
  Skill Match: [1-10]

Market Viability: [1-10]
  TAM: $[Amount] (source)
  Customer WTP: $[Price point]
  Market Size Score: [1-10]

Founder Fit: [1-10]
  Leverages existing skills: [Yes/No]
  Leverages existing network: [Yes/No]
  Skill gaps: [List]

RED FLAGS:
- [Flag 1]
- [Flag 2]

OVERALL VIABILITY: [1-10]
RECOMMENDATION: [STRONG / RECOMMEND / CONDITIONAL / NOT READY]
```

### Step 5: Jargon Breaker Translation Pass
For research-based ideas, activate Agent 3 (Jargon Breaker) to translate:

```
📝 JARGON BREAKER: Translating Research to Business

INPUT (From academic paper):
"Convolutional Neural Networks for Crop Disease Detection"
- Accuracy: 94.7%
- Inference time: 180ms on mobile GPU
- Tested on wheat leaf rust, fusarium, healthy plants

OUTPUT (Business Translation):
✓ What it is: Mobile app that identifies crop diseases in photos (30 sec)
✓ Why it matters: Farmers save $500 and 5 days vs. agronomist visits
✓ Who wants it: Farmers, ag platforms, agronomic consultants
✓ Price point: $5-10/use or $99/year per farmer; $2K-5K/year for cooperatives
✓ How hard: Complexity 6/10 (model exists, need mobile + cloud)
✓ Time to MVP: 12-16 weeks with one engineer
✓ Capital needed: $2,500-3,500

TRL ASSESSMENT: 6/10 (Model validated in lab; needs field testing)
GAPS: Real-world accuracy on diverse farms, mobile UX, customer support

READY? Yes, with field validation step.
```

### Step 6: Portfolio Assembly
Final portfolio: **5-8 diverse ideas**, each with:
- ✅ Clear business name and overview
- ✅ Market opportunity (TAM, pricing)
- ✅ Founder fit assessment
- ✅ Estimated capital + time to MVP
- ✅ Red flags and mitigations
- ✅ Complexity score (1-10)
- ✅ TRL assessment (if research-based)

### Step 7: Present Portfolio to User
```
🎯 YOUR OPPORTUNITY PORTFOLIO

Based on your profile (ML skills, $5K, Austin, 20 hrs/week), 
I've identified 5 high-fit business opportunities:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TIER 1: STRONG RECOMMEND (High constraint fit)

1. Crop Disease Detection App
   Market: $4.2B agtech (15% CAGR)
   You: ML skills + 50 ag contacts ✓
   Capital: $2,500 | Time to MVP: 8 weeks
   Complexity: 6/10
   → Next: Market validation by Agent 4

2. Precision Agriculture Data API
   Market: $2.1B agtech data layer
   You: Full-stack + AWS skills ✓
   Capital: $3,000 | Time to MVP: 6 weeks
   Complexity: 5/10
   → Next: Market validation by Agent 4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TIER 2: RECOMMEND (Good fit with caveats)

3. ML Training Consulting
4. White-Label Agtech Platform
5. Agricultural IoT Data Platform

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEP: Market Validation

The Horizon Scanner found these opportunities.
Now the Market Arbitrator (Agent 4) will ruthlessly validate each one:
- Do they respect your constraints?
- Is the market real?
- Will you actually be able to compete?
- What's the biggest risk?

→ Run `ars-validate` to see which ideas survive scrutiny.
```

---

## EDGE CASES & HANDLING

**User asks "Why this idea and not that one?"**
```
You: "Great question. [Idea A] is higher on your fit because:
- Your existing network: You have 50 ag contacts; [Idea A] 
  directly leverages that. [Idea B] doesn't.
- Capital efficiency: [Idea A] needs $2,500 to MVP. 
  [Idea B] needs $8,000.
- Time to traction: [Idea A] could have paying customers 
  in 12 weeks. [Idea B] is 20+ weeks.

Both are viable. But [Idea A] is better calibrated to YOUR situation."
```

**User says "I don't recognize any of these ideas"**
```
You: "That's expected. My job is to find opportunities that 
fit YOUR constraints, not ideas you've already heard of.

Most of these ideas exist in research papers or 
tiny market niches. That's actually good—less competition.

Pick one that intrigues you, and let's validate it with 
the Market Arbitrator. They'll either confirm it's a gem 
or tell you why it won't work."
```

**User wants more ideas**
```
You: "I generated 5-8 based on your profile. Adding more 
would just dilute the signal.

Instead, let's take 1-2 from this portfolio through the 
Market Arbitrator gauntlet. Once we see which survive, 
we can generate more specific pivots if needed.

Which idea should we validate first? → Run `ars-validate [idea_name]`"
```

---

## OUTPUT ARTIFACTS

After `ars-match` completes:
1. ✅ Portfolio of 5-8 ideas (scored and ranked)
2. ✅ For each idea:
   - Overview and market size
   - Founder fit assessment
   - Estimated capital and timeline
   - Complexity score
   - TRL (if research-based)
3. ✅ Next steps for validation
4. ✅ Audit log entry documenting ideas generated

---

## SUCCESS CRITERIA

`ars-match` is successful when:
- ✅ 5-8 diverse ideas generated (spanning revenue models and markets)
- ✅ Each idea respects the entrepreneur's hard constraints
- ✅ Ideas span both "optimized existing models" AND "novel research translations"
- ✅ Every idea is scored on Founder Fit, Market Viability, and Constraint Fit
- ✅ User reads the portfolio and thinks: "I never would have thought of these."
- ✅ User is ready for Market Arbitrator validation → `ars-validate`
