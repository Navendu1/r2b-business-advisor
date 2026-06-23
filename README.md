# R2B Venture Architect 🚀

[![Python 3.8+](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/your-username/r2b-business-advisor)](https://github.com/your-username/r2b-business-advisor/issues)
[![GitHub Forks](https://img.shields.io/github/forks/your-username/r2b-business-advisor)](https://github.com/your-username/r2b-business-advisor/network)

**AI-Powered Business Validation System** — Transform raw business ideas into investor-ready Detailed Project Reports (DPRs) in 2 weeks.

R2B (Research-to-Business) is a sophisticated 7-agent orchestration system that validates startup ideas against real founder constraints. It combines LLM-powered narrative analysis with deterministic Python hard gates to produce bulletproof business plans.

---

## 🎯 What This Solves

Startup founders waste months validating ideas:

| Problem | Status Quo | R2B Solution |
|---------|-----------|-------------|
| "Is this market real?" | Manual research, no guidance | Market Arbitrator Agent validates traction |
| "Can I afford to build this?" | Guesswork on costs | Budget gate checks feasibility |
| "What could kill this startup?" | No systematic risk analysis | Doom Scenario Agent identifies 3 failure modes |
| "What should I do first?" | No roadmap | DPR provides 6-part execution plan |

---

## 🏗️ How It Works

### 7-Agent Sequential Pipeline

```
Input: Founder Profile (skills, capital, location, constraints)
         ↓
     [1] Profile Auditor       → Locks founder constraints
     [2] Horizon Scanner       → Generates 5-8 tailored ideas
     [3] Jargon Breaker        → Translates to plain English
     [4] Market Arbitrator     → Validates market traction
     [5] Legal Compliance      → Identifies regulatory blockers
     [6] Doom Scenario         → Identifies top 3 failure modes
     [7] DPR Compiler          → Assembles final business plan
         ↓
Output: Founder-ready 6-part DPR (JSON, CSV, Markdown)
```

### Supporting Infrastructure

| Component | Purpose |
|-----------|---------|
| **Orchestrator** | Coordinates the 7-agent pipeline |
| **Hard Gates** | Deterministic validation (budget, location, legal) |
| **Entrepreneur Passport** | Immutable lockfile of founder constraints |
| **Business Report Template** | 6-part DPR schema |

---

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/r2b-business-advisor.git
cd r2b-business-advisor

# Install dependencies
pip install -r requirements.txt

# Verify installation
python orchestrator.py --help
```

### Interactive Mode (Recommended)

```bash
python orchestrator.py
```

Follow the prompts:
1. **Profile Intake** (5 min) → Answer questions about skills, budget, constraints
2. **Idea Matching** (10 min) → System generates tailored ideas
3. **Validation Gates** (15 min) → Legal, budget, market checks
4. **DPR Compilation** (10 min) → Final report generation

**Total time:** ~40 minutes → Full DPR ready

### Automated Mode (Pre-existing Profile)

```bash
python orchestrator.py profiles/alice_profile.yaml
```

### View Results

Generated files appear in `output/`:
- `DPR_idea_XXX.json` — Structured data
- `DPR_idea_XXX.csv` — Spreadsheet format
- `DPR_idea_XXX.md` — Human-readable report
- `entrepreneur_passport_XXX.yaml` — Locked founder profile
python orchestrator.py

# You'll be guided through:
# 1. Structured interview (capture constraints)
# 2. Idea generation (get 5-8 tailored opportunities)
# 3. Validation gates (legal, market, budget, risk)
# 4. DPR compilation (final business plan)

# Output: entrepreneur_passport.yaml + DPR_*.json + artifacts
```

### Automated Mode (With Profile)

```bash
# Run with pre-defined founder profile
python orchestrator.py profiles/alice_profile.yaml

# Faster for testing; skips interview
```

### Test the System

```bash
# Run integration tests
python test_integration.py

# Should pass 4 test cases (Alice, Bob, Charlie, Diana)

# Export test case profiles to YAML
python test_integration.py --export-profiles

# Run specific test
python test_integration.py --profile alice --verbose
```

---

## 📋 **THE 6-PART DETAILED PROJECT REPORT (DPR)**

Every successful venture produces a DPR with these sections:

### **Part 1: Executive Summary**
- Business concept in 1 paragraph
- Problem being solved
- Solution approach
- Market opportunity (TAM/SAM/SOM)
- Why this founder should win
- 1-page version

### **Part 2: Market Analysis**
- Target customer profile (persona)
- Primary pain points (minimum 3)
- Competitive landscape
- Market gaps where your solution fits
- Market trends supporting demand
- Market arbitrator verdict (APPROVED/REJECTED with confidence score)

### **Part 3: Financial Model**
- Startup costs breakdown (detailed)
- Revenue model (pricing tiers, unit economics)
- Conservative 3-year financial projection
- Monthly burn rate and runway
- Break-even analysis
- Budget gate verdict (PASS/FAIL)

### **Part 4: Go-to-Market (GTM) Strategy**
- Phase 1: Awareness & validation (months 1-3)
- Phase 2: Product-led growth (months 3-6)
- Phase 3: Sales conversations (months 6-12)
- Customer acquisition strategy
- GTM verdict with confidence score

### **Part 5: Roadmap**
- Phase 0: Validation sprint (2 weeks)
- Phase 1: MVP (8 weeks) - ship and get first paying customer
- Phase 2: Early traction (3 months) - scale to 10+ customers
- Phase 3: Growth (ongoing) - hire team, pursue Series A
- Each phase includes: deliverables, success criteria, team size, budget

### **Part 6: Risk Mitigation**
- Top 3 failure scenarios (ranked by probability × impact)
- For each: description, probability, impact, founder vulnerability, early warning signs, mitigation tactics
- Survival readiness score
- Critical decision points
- Next-week action items

---

## 👥 **THE 4 TEST CASES (Real-World Scenarios)**

The system includes 4 founder personas with real constraints:

### **Test Case 1: Alice Chen** ⭐ **(Recommended first test)**
- **Background:** ML Engineer from FAANG
- **Location:** Austin, TX
- **Capital:** $5,000
- **Time:** 20 hrs/week
- **Visa:** H1B (legal complication)
- **Expected idea:** AI/ML-focused SaaS (e.g., ModelVault AI)
- **Key risks:** Zero GTM experience, visa complexity

**Example artifact:** [DPR_alice_chen_modelVault.json](examples/DPR_alice_chen_modelVault.json)

### **Test Case 2: Bob Martinez**
- **Background:** Marketing Manager (non-technical)
- **Location:** Rural Texas
- **Capital:** $2,000 (tight budget)
- **Time:** 15 hrs/week
- **Legal:** Non-compete clause
- **Expected idea:** Service-based (consulting, done-for-you)
- **Key risks:** Budget too small for SaaS, cannot build competing product

### **Test Case 3: Charlie Okonkwo**
- **Background:** Operations manager (emerging market expertise)
- **Location:** Lagos, Nigeria
- **Capital:** $1,500
- **Time:** 25 hrs/week (high commitment)
- **Legal:** Payment processor restrictions, tax complexity
- **Expected idea:** Localized logistics or agritech
- **Key risks:** International compliance, payment processing

### **Test Case 4: Diana Kowalski** ⭐ **(Ideal scenario)**
- **Background:** PM + experienced solopreneur
- **Location:** Denver, CO (can relocate)
- **Capital:** $8,000 (healthy)
- **Time:** 35 hrs/week (serious commitment)
- **Legal:** No blockers
- **Expected idea:** Broadest portfolio (SaaS, content, tools)
- **Key risks:** Execution risk only (all constraints favorable)

---

## 📂 **DIRECTORY STRUCTURE**

```
r2b-business-advisor/
│
├── 📜 orchestrator.py                    # Main entry point (run this first)
├── 🧪 test_integration.py                # Integration test suite
│
├── agents/                               # 7 agent system prompts
│   ├── 1_profile_auditor_agent.md        # Constraint interviewer
│   ├── 2_horizon_scanner_agent.md        # Idea researcher
│   ├── 3_jargon_breaker_agent.md         # Research translator
│   ├── 4_market_arbitrator_agent.md      # Market validator
│   ├── 5_legal_compliance_agent.md       # Regulatory screener
│   ├── 6_doom_scenario_agent.md          # Risk stress-tester
│   └── 7_dpr_compiler_agent.md           # Report assembler
│
├── commands/                             # Orchestration flows
│   ├── ars-intake.md                     # Agent 1 orchestration
│   ├── ars-match.md                      # Agents 2-3 orchestration
│   └── ars-dpr.md                        # Agents 4-7 orchestration
│
├── scripts/                              # Hard gates (Python)
│   ├── check_budget_limits.py            # Budget validation gate
│   └── verify_location.py                # Location feasibility gate
│
├── shared/                               # Shared schemas
│   ├── entrepreneur_passport.yaml        # State lockfile schema
│   └── business_report_template.yaml     # DPR schema
│
├── profiles/                             # Test case founder profiles
│   ├── alice_profile.yaml                # Alice Chen profile (H1B ML engineer)
│   ├── bob_profile.yaml                  # Bob Martinez profile (non-tech)
│   ├── charlie_profile.yaml              # Charlie Okonkwo profile (emerging market)
│   └── diana_profile.yaml                # Diana Kowalski profile (experienced PM)
│
├── examples/                             # Reference artifacts
│   ├── DPR_alice_chen_modelVault.json    # Sample DPR (Alice's idea)
│   ├── entrepreneur_passport_example.yaml # Sample passport
│   └── ideas_portfolio_example.json      # Sample idea list
│
└── README.md                             # This file
```

---

## 🎮 **HOW TO USE (STEP BY STEP)**

### **Step 1: Run in Interactive Mode**

```bash
python orchestrator.py
```

The system will guide you through:
1. **Agent 1 Interview** (10 minutes)
   - "What's your background?"
   - "How much capital do you have?"
   - "How many hours/week can you commit?"
   - "Any legal constraints?" (non-competes, visa, IP assignments)
   - Output: `entrepreneur_passport.yaml` (locked, immutable)

2. **Agents 2-3: Idea Generation** (5 minutes)
   - Searches for 5-8 tailored ideas
   - Scores each idea for "founder fit"
   - Output: `ideas_portfolio.json` (ranked by fit)

3. **Agents 4-7: Validation** (10 minutes)
   - Hard gates: Budget check, location feasibility
   - Agent 4: Market arbitration ("Is this market real?")
   - Agent 5: Legal compliance ("Any blockers?")
   - Agent 6: Stress-test ("What could kill this?")
   - Agent 7: Compile DPR
   - Output: `DPR_idea_001.json` (6-part business plan) + markdown/CSV exports

**Total time:** 25 minutes → Founder-ready business plan

---

### **Step 2: Review the DPR**

Open the generated DPR (e.g., `DPR_alice_chen_modelVault.json`) and review:

1. **Part 1 (Executive Summary)**: Does the concept resonate?
2. **Part 2 (Market)**: Is this market real? Do I believe it?
3. **Part 3 (Financials)**: Can I afford to build this? Is the unit economics realistic?
4. **Part 4 (GTM)**: Do I know how to reach customers?
5. **Part 5 (Roadmap)**: Can I execute this in phases?
6. **Part 6 (Risk)**: Am I prepared for the top 3 risks?

---

### **Step 3: Validate with Customers**

The DPR includes a **Week 1 action plan**:

```
Week 1: Validate 20 customer conversations
  - Show problem/solution to 20 people in target market
  - Record: "Is this urgent for you?" (Y/N)
  - Record: "Would you pay $X/month?" (Y/N)
  
Success criteria: ≥15 say "urgent" AND ≥10 say "would pay"
If not met: Pivot idea or restart with different concept
```

---

### **Step 4: Execute Phase 1 (MVP)**

Once validated, follow the **roadmap** in Part 5:

- **Week 1-2:** Set up basic infrastructure
- **Week 3-6:** Build MVP (minimal features, ruthless scope)
- **Week 7-8:** Closed beta with 3-5 early customers
- **Week 9+:** Launch publicly, track metrics

---

## 🧪 **RUNNING TESTS**

### Test All Scenarios

```bash
python test_integration.py
```

Output:
```
✓ PASS  ALICE    - Technical founder with limited capital...
✓ PASS  BOB      - Non-technical solo founder with tight budget...
✓ PASS  CHARLIE  - Domain expert from emerging market...
✓ PASS  DIANA    - Experienced solopreneur with adequate capital...

SUMMARY: 4 passed, 0 failed out of 4
```

### Test Specific Founder

```bash
python test_integration.py --profile alice --verbose
```

### Export Test Profiles as YAML

```bash
python test_integration.py --export-profiles
```

Creates:
- `profiles/alice_profile.yaml`
- `profiles/bob_profile.yaml`
- `profiles/charlie_profile.yaml`
- `profiles/diana_profile.yaml`

Then run orchestrator with any profile:
```bash
python orchestrator.py profiles/alice_profile.yaml
```

---

## 🤖 **AGENT DETAILS (What Each Agent Does)**

### Agent 1: Profile Auditor
**Role:** Gatekeeper for founder constraints

- Conducts structured interview
- Extracts exact constraints (not vague answers)
- Validates profile completeness
- Locks entrepreneur_passport.yaml (immutable)
- 7 "Iron Rules" enforce rigor (e.g., "No 'some savings' — must be exact $5,000")

### Agent 2: Horizon Scanner
**Role:** Opportunity researcher

- Searches ArXiv (research), Crunchbase (existing models), PitchBook (funded companies)
- Generates 5-8 ideas tailored to founder constraints
- Mixes 3 sources: existing business models (2-3 ideas), research translations (2-3), adjacent opportunities (1-2)
- Scores each idea on "founder fit" (0.0-1.0 scale)

### Agent 3: Jargon Breaker
**Role:** Research translator

- Takes abstract research and translates to business propositions
- Assesses Technology Readiness Level (TRL) for research-based ideas
- Scores complexity (1-10 scale)
- Complexity >7 → requires hiring/funding; <5 → bootstrap-feasible

### Agent 4: Market Arbitrator
**Role:** Ruthless market validator

- Assesses if market is real (TAM, existing competition, customer demand)
- Verdict: APPROVED / REJECTED
- Confidence score (0.0-1.0)
- Can override Agent 2's scoring

### Agent 5: Legal & Compliance
**Role:** Regulatory screener

- Identifies compliance costs (licenses, certifications, regulatory filings)
- Checks for non-competes, IP assignments, visa restrictions
- Verdict: CLEAR / FLAGGED / BLOCKED
- Jurisdiction database covers US, EU, Asia, emerging markets

### Agent 6: Doom Scenario
**Role:** Stress-tester

- Identifies top 3 failure scenarios specific to **this founder + this idea**
- For each: probability, impact, early warning signs, low-cost mitigations
- Calculates "survival readiness" score
- Forces founder to think through "what could kill this?"

### Agent 7: DPR Compiler
**Role:** Report assembler

- Consolidates all upstream agent outputs
- Resolves contradictions (if any)
- Assembles 6-part DPR
- Exports in multiple formats: JSON, Markdown, CSV
- Locks entrepreneur_passport.yaml (final state)

---

## 🔒 **THE "PASSPORT" SYSTEM (State Management)**

All founder constraints are captured in **entrepreneur_passport.yaml** — an immutable lockfile that:

1. **Captures constraints once** (at intake, Agent 1)
2. **Flows to all downstream agents** (Agents 2-7 reference it)
3. **Never changes during validation** (prevents goal-post moving)
4. **Includes audit trail** (timestamp, session ID, all decisions)

Example passport structure:
```yaml
session_id: "20260618_143215"
founder_name: "Alice Chen"
constraints:
  available_capital_usd: 5000
  weekly_hours_available: 20
  location: "Austin, TX"
  visa_status: "H1B (note: legal review required)"
  skills: ["ML/AI", "Python", "Kubernetes"]
  legal_blockers: []
  non_competes: false
ideas_generated: 5
selected_idea: "idea_001"
dpr_locked_at: "2026-06-18T14:45:33Z"
```

---

## 📊 **EXAMPLE: ALICE'S JOURNEY**

### Input Profile
```
Name: Alice Chen
Background: ML Engineer at Google
Location: Austin, TX
Capital: $5,000
Time: 20 hrs/week
Visa: H1B (immigration concern)
Skills: Python, PyTorch, Kubernetes, GCP
Constraints: Cannot work on competing product (potential non-compete)
```

### Output DPR
**Business:** ModelVault AI (enterprise ML model registry)

**Market:** $3.2B total addressable market (ML ops infrastructure)

**Financial:**
- Startup cost: $4,900 (within budget ✓)
- MVP timeline: 10 weeks
- Break-even: 1 paying customer @ $500/mo
- Year 1 projection: 10 customers @ $18K MRR

**Roadmap:**
- Weeks 1-2: Validation (interview 20 ML engineers)
- Weeks 3-10: MVP (model registry + versioning)
- Weeks 11-18: Early traction (10+ customers, governance features)
- Month 19+: Series A (hire team, expand)

**Top 3 Risks:**
1. ⚠️ Zero GTM experience → Hire fractional VP Sales by month 4
2. ⚠️ H1B visa complications → Consult immigration attorney week 1 (CRITICAL)
3. ⚠️ Feature-creep delays MVP → Time-box each sprint to 1 week

**Verdict:** ✅ APPROVED (proceed with caution on visa + GTM)

---

## ⚙️ **CUSTOMIZATION & EXTENSION**

### Adding New Agents

1. Create new agent file: `agents/8_my_new_agent.md`
2. Define system prompt following existing pattern
3. Update `orchestrator.py` to call new agent
4. Add to validation pipeline

### Modifying Hard Gates

1. Edit `scripts/check_budget_limits.py` or `scripts/verify_location.py`
2. Update logic (deterministic Python)
3. Test with `test_integration.py`

### Customizing DPR Schema

Edit `shared/business_report_template.yaml` to add/remove sections

---

## 🐛 **TROUBLESHOOTING**

### "ImportError: No module named yaml"
```bash
pip install pyyaml
```

### "Passport file not found"
```bash
# Run interactive mode first
python orchestrator.py
# This creates entrepreneur_passport.yaml
```

### "Ideas generation returned 0 ideas"
Check that profile constraints are reasonable:
- Capital ≥ $1,000
- Hours ≥ 10/week
- Skills ≠ empty

---

## 📈 **SUCCESS METRICS**

The system is working well if:

✅ **Profile Phase (Agent 1)**
- 100% of founders complete interview
- 95%+ of constraints are specific (not vague)

✅ **Idea Phase (Agents 2-3)**
- 100% of ideas match founder constraints
- Average founder fit score >0.80
- Complexity scores vary (mix of 3, 5, 7+)

✅ **Validation Phase (Agents 4-7)**
- 70%+ of ideas pass market arbitration
- 80%+ of DPRs include 3+ actionable risks
- All roadmaps are achievable within runway

✅ **Founder Satisfaction**
- Founder feels "I know what to do next"
- Founder can show DPR to cofounders/investors
- Founder can start Phase 1 MVP immediately

---

## 📞 **SUPPORT & FEEDBACK**

For questions or contributions:

1. Check [agent details](#agent-details-what-each-agent-does) above
2. Review [example DPR](examples/DPR_alice_chen_modelVault.json)
3. Run [test cases](#running-tests) to see system in action
4. Review agent markdown files for detailed protocols

---

## 📜 **LICENSE & CREDITS**

Built as part of the R2B (Research-to-Business) venture validation initiative.

**Inspired by:**
- Lean methodology (MVP mindset)
- Y Combinator's startup advice
- Harvard Business School case method
- Sequoia Capital partnership frameworks

---

## 🚀 **NEXT: GET STARTED**

```bash
# 1. Install dependencies
pip install pyyaml

# 2. Run first test
python test_integration.py

# 3. Try interactive mode
python orchestrator.py

# 4. Review generated DPR
cat output/DPR_*.json

# 5. Share your results!
```

**Happy validating!** 🎯
