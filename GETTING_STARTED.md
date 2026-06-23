# GETTING STARTED WITH R2B

**Your first 1 hour using the R2B Venture Architect**

This guide walks you through running the system end-to-end, reviewing results, and taking next steps.

---

## ⏱️ **Timeline**

| Step | Time | What You Do |
|------|------|-----------|
| 1. Setup | 5 min | Install Python dependencies |
| 2. Run tests | 5 min | Verify system works |
| 3. Interactive session | 25 min | Answer interview questions, get DPR |
| 4. Review output | 15 min | Read your DPR, understand recommendations |
| 5. Next steps | 5 min | Decide what to do next |

**Total: 55 minutes**

---

## 1. SETUP (5 minutes)

### Install Python 3.8+

Check if you have Python:
```bash
python --version
```

If not installed, download from https://www.python.org (3.8 or newer)

### Install Dependencies

```bash
cd r2b-business-advisor
pip install pyyaml
```

Verify installation:
```bash
python -c "import yaml; print('✓ YAML installed')"
```

---

## 2. RUN TESTS (5 minutes)

Verify the system works:

```bash
python test_integration.py
```

**Expected output:**
```
✓ PASS  ALICE    - Technical founder with limited capital...
✓ PASS  BOB      - Non-technical solo founder with tight budget...
✓ PASS  CHARLIE  - Domain expert from emerging market...
✓ PASS  DIANA    - Experienced solopreneur with adequate capital...

SUMMARY: 4 passed, 0 failed out of 4
```

If you see "✓ PASS" for all 4, you're good! The system is working.

**If tests fail:**
- Make sure `yaml` module is installed: `pip install pyyaml`
- Make sure you're in the right directory: `cd r2b-business-advisor`
- Check Python version: `python --version` (should be 3.8+)

---

## 3. INTERACTIVE SESSION (25 minutes)

Now run the system with YOUR constraints:

```bash
python orchestrator.py
```

You'll be guided through the **full pipeline**:

### Phase 1: Interview (10 minutes)

The system will ask:

1. **Your background**
   - What's your professional background?
   - What skills do you have?
   - Example: "ML engineer, 5 years Google"

2. **Your capital**
   - How much money do you have?
   - Be specific: "$5,000" not "some savings"
   - This determines what's financially feasible

3. **Your time commitment**
   - How many hours/week can you dedicate?
   - Be realistic (includes your current job if applicable)
   - Example: "20 hours/week"

4. **Your location**
   - Where are you located?
   - Can you relocate?
   - Affects regulatory requirements and customer access

5. **Your constraints**
   - Any non-compete clauses from previous job?
   - Visa/immigration status issues?
   - IP assignment agreements?
   - Example: "H1B visa, no non-compete"

6. **Your goals**
   - Timeline to first revenue?
   - Target annual revenue?
   - Eventually hire a team or stay solo?

**Output:** `entrepreneur_passport.yaml` (locked, immutable)

### Phase 2: Idea Generation (5 minutes)

The system searches for 5-8 ideas tailored to YOUR constraints.

**You'll see:**
- 5-8 business ideas
- Founder-fit score for each (0.0-1.0)
- Complexity score (1-10)
- Bootstrap feasibility (Y/N)

**Example ideas:**
- Idea 1: AI content audit service (fit: 0.92, complexity: 3) ✓ Bootstrap
- Idea 2: Enterprise ML model registry (fit: 0.88, complexity: 7) ✓ Bootstrap
- Idea 3: ML training platform for SMBs (fit: 0.85, complexity: 5) ✓ Bootstrap

**Output:** `ideas_portfolio.json`

### Phase 3: Validation (10 minutes)

System runs 4 validation gates:

1. **Budget Gate** 
   - Is startup cost ≤ available capital?
   - Verdict: PASS ✓ or FAIL ✗

2. **Location Gate**
   - Any geographic/compliance blockers?
   - Verdict: PASS ✓ or FLAGGED ⚠️

3. **Legal Gate**
   - Any regulatory blockers?
   - Verdict: CLEAR ✓ or FLAGGED ⚠️ or BLOCKED ✗

4. **Market Gate**
   - Is the market real?
   - Verdict: APPROVED ✓ or REJECTED ✗

If all gates pass, system selects the best idea and compiles your **DPR** (6-part business plan).

**Output:** `DPR_idea_001.json` + Markdown + CSV exports

---

## 4. REVIEW OUTPUT (15 minutes)

After the session completes, you'll have:

### Generated Files

```
output/
├── entrepreneur_passport_20260618_143215.yaml
├── ideas_portfolio_20260618_143215.json
├── DPR_idea_001_20260618_143215.json
├── DPR_idea_001_20260618_143215.md
└── DPR_idea_001_20260618_143215.csv
```

### What to Read First

**1. Read the 1-page Executive Summary**

Open the JSON file and read `part_1_executive_summary`:

```json
{
  "business_name": "ModelVault AI",
  "tagline": "Enterprise ML model registry for data science teams",
  "problem": "...",
  "solution": "...",
  "market_opportunity": "TAM: $3.2B..."
}
```

**Ask yourself:** Does this concept excite me? Do I believe this is a real problem?

**2. Check Part 3: Financial Model**

Look at `startup_costs` and `revenue_model`:

```json
{
  "startup_costs": {
    "total": 4900,
    "funded_by": "Personal savings ($5,000 available)"
  },
  "revenue_model": {
    "monthly_recurring_revenue_target": "$18K by month 12"
  }
}
```

**Ask yourself:** Can I afford this? Does the path to revenue seem realistic?

**3. Review Part 5: Roadmap**

Look at the phase-by-phase breakdown:

```json
{
  "phase_0_validation": {
    "duration": "Months 1-2",
    "deliverables": ["Interview 20 ML engineers about pain points..."]
  },
  "phase_1_mvp": {
    "duration": "Months 3-10",
    "deliverables": ["Core model registry...", "Basic lineage tracking..."]
  }
}
```

**Ask yourself:** Can I execute this? Which phase is most challenging?

**4. Study Part 6: Risk Mitigation**

Read the top 3 failure scenarios:

```json
{
  "top_3_risks": [
    {
      "rank": 1,
      "failure_scenario": "Founder unable to acquire customers",
      "early_warning_signs": ["Month 6: Still zero paying customers..."],
      "mitigation": "Hire fractional VP Sales by month 4"
    }
  ]
}
```

**Ask yourself:** Am I prepared for these risks? Do the mitigations feel doable?

---

## 5. NEXT STEPS (What to Do Monday Morning)

### If You Love the Idea

**Week 1: Validate the Market**
```
Do this: Interview 20 people in your target market
  • "Is this problem urgent for you?" (Y/N)
  • "Would you pay $X/month?" (Y/N)
  • Take notes on exact quotes

Success criteria: ≥15 say "urgent" AND ≥10 say "would pay"
```

**Week 2-3: Build Phase 1 MVP**
Follow the roadmap in Part 5. Start with the smallest possible feature set.

**Week 4+: Talk to Customers**
Get 3-5 early customers using your MVP. Track: activation, retention, willingness to pay more.

### If You're Unsure

**Try These:**

1. **Share the DPR with someone you trust**
   - Ask: "Does this seem like a real business?"
   - Ask: "What would you do differently?"

2. **Run another idea through the system**
   - Go back through Phase 2 (idea generation)
   - Pick a different idea, run validation again
   - Compare 2-3 ideas side-by-side

3. **Talk to potential customers**
   - Show Part 1 (Executive Summary) to 5 people in target market
   - Ask: "Have you had this problem?"
   - Listen for enthusiasm level

### If You Hate the Idea

**That's OK!** The system is designed to kill bad ideas early. Better to find out now than after months of work.

**Next move:**
- Re-run the system (skip already answered questions in interview)
- Ask for a different idea set from Phase 2
- Try a different founder profile (if you want to test different constraints)

---

## 📚 **DETAILED REFERENCE**

### Understanding Your Passport

Your `entrepreneur_passport.yaml` looks like:

```yaml
session_id: "20260618_143215"
timestamp: "2026-06-18T14:32:15Z"

founder_info:
  name: "Alice Chen"
  background: "ML Engineer, Google 5 years"
  location: "Austin, TX"
  timezone: "US/Central"

constraints:
  available_capital_usd: 5000
  weekly_hours_available: 20
  can_relocate: false
  skills:
    - "Python"
    - "PyTorch"
    - "Kubernetes"
    - "GCP"
  
  legal:
    visa_status: "H1B (note: legal review recommended)"
    non_compete: false
    ip_assignments: []

goals:
  target_annual_revenue_usd: 50000
  timeline_to_first_revenue_months: 6
  eventual_team_size: "solo → 1-2 hires by year 2"

audit_trail:
  interview_conducted_at: "2026-06-18T14:32:15Z"
  profile_locked_at: "2026-06-18T14:35:22Z"
  # Once locked, cannot be changed (ensures constraints don't shift)
```

**Key insight:** This passport flows to ALL downstream agents. Once locked, your constraints don't change. This prevents "scope creep" where founders later say "actually I have $50K" (would change all analysis).

---

### Understanding Your Ideas Portfolio

Your `ideas_portfolio.json` lists 5-8 ranked ideas:

```json
{
  "ideas": [
    {
      "id": "idea_001",
      "title": "ModelVault AI - ML Model Registry",
      "description": "Enterprise SaaS for model governance...",
      "startup_cost_usd": 4900,
      "complexity_score": 7,  // 1=trivial, 10=very hard
      "founder_fit": 0.92,    // 0.0-1.0 scale
      "bootstrap_feasible": true,  // Can launch on your capital?
      "months_to_revenue": 6
    },
    {
      "id": "idea_002",
      "title": "ML Training Platform for SMBs",
      "description": "...",
      "startup_cost_usd": 2800,
      "complexity_score": 5,
      "founder_fit": 0.88,
      "bootstrap_feasible": true,
      "months_to_revenue": 4
    },
    // ... more ideas
  ]
}
```

**Ranking logic:**
- Top ideas have highest `founder_fit` score
- All ideas are `bootstrap_feasible` (can launch on your capital)
- Mix of complexity levels (3, 5, 7)

**Pro tip:** If you don't like idea #1, try idea #3 or #5. Each is validated for your specific constraints.

---

### Understanding Your DPR

Your `DPR_*.json` is the detailed business plan:

```json
{
  "metadata": {
    "dpr_id": "DPR-ALICE-001-20260618",
    "founder_name": "Alice Chen",
    "generated_at": "2026-06-18T14:45:33Z"
  },
  
  "part_1_executive_summary": {
    // 1-paragraph concept
    // Problem statement
    // Solution approach
    // Market size (TAM/SAM/SOM)
    // Why you should win
  },
  
  "part_2_market_analysis": {
    // Target customer persona
    // Pain points
    // Competitive landscape
    // Market verdict: APPROVED (confidence: 0.88)
  },
  
  "part_3_financial_model": {
    // Startup costs (detailed breakdown)
    // Revenue model (pricing tiers)
    // 3-year financial projection
    // Break-even analysis
    // Budget verdict: PASS
  },
  
  "part_4_go_to_market": {
    // Phase 1: Awareness (months 1-3)
    // Phase 2: Product-led growth (months 3-6)
    // Phase 3: Sales conversations (months 6-12)
  },
  
  "part_5_roadmap": {
    // Phase 0: Validation (weeks 1-2)
    // Phase 1: MVP (weeks 3-10)
    // Phase 2: Early traction (weeks 11-18)
    // Phase 3: Growth (ongoing)
  },
  
  "part_6_risk_mitigation": {
    "top_3_risks": [
      {
        "rank": 1,
        "failure_scenario": "Founder unable to acquire customers",
        "probability": "MEDIUM-HIGH",
        "impact": "No revenue by month 12",
        "early_warning_signs": [
          "Month 6: Still zero paying customers",
          "Month 9: Inbound interest stalled"
        ],
        "mitigation": "Hire fractional VP Sales by month 4"
      }
      // ... more risks
    ]
  }
}
```

---

## 🎯 **COMMON SCENARIOS**

### Scenario 1: "I have an idea, not sure if it's viable"

**What to do:**
1. Run: `python orchestrator.py`
2. Answer interview questions with your current constraints
3. In Phase 2, when asked "which idea interests you?", describe yours
4. System will analyze YOUR idea against YOUR constraints

**Expected outcome:** DPR telling you if idea is viable given your capital/time/skills

### Scenario 2: "I'm comparing 3 different ideas"

**What to do:**
1. Run 3 separate sessions (create 3 different profiles or same profile + different ideas)
2. Generate 3 DPRs
3. Compare Part 3 (financial model) and Part 6 (risks) side-by-side
4. Pick the one with lowest risk + highest founder fit

**Example comparison:**
```
Idea A: ML Registry      Idea B: SaaS Platform    Idea C: Consulting
- Risk level: HIGH      - Risk level: MEDIUM     - Risk level: LOW
- Fit: 0.92            - Fit: 0.88              - Fit: 0.75
- Time to revenue: 6mo  - Time to revenue: 4mo   - Time to revenue: 1mo
- Capital needed: $4.9K - Capital needed: $2.8K  - Capital needed: $1.2K
```

Pick based on YOUR priorities (speed vs. upside vs. risk tolerance)

### Scenario 3: "I need to convince my co-founder/investor"

**What to do:**
1. Export DPR to Markdown: Already done (DPR_*.md file)
2. Print Part 1 + Part 2 (1-2 pages)
3. Share Part 3 (financial model) and Part 6 (risks)
4. Use exact numbers from DPR when discussing

**Pro tip:** Investors love the risk mitigation section (Part 6). Founders who've thought through failure modes = sophisticated founders.

---

## ✅ **CHECKLIST: You're Ready When...**

- [ ] Python 3.8+ installed (`python --version` shows 3.8+)
- [ ] YAML module installed (`pip install pyyaml` successful)
- [ ] Tests pass (`python test_integration.py` shows all 4 ✓ PASS)
- [ ] You've read this Getting Started guide
- [ ] You understand the 6-part DPR structure
- [ ] You know what to do if you hate the idea (re-run with different idea)
- [ ] You know what to do if you love it (validate with 20 customers)

---

## 🆘 **TROUBLESHOOTING**

### "I don't understand my DPR"

Read this guide's "Understanding Your DPR" section. If still confused, check the example DPR:
```bash
cat examples/DPR_alice_chen_modelVault.json
```

### "The system is asking me questions I don't want to answer"

Some questions are required (capital, time, location). If you don't know an answer:
- Use your best estimate
- You can always re-run with different constraints later
- The system is designed to help you explore options

### "I got a BLOCKED verdict on legal gate"

This means your constraints have a hard blocker:
- Non-compete prevents you from building this type of product
- Visa restrictions prevent you from operating in a jurisdiction
- IP assignments belong to your employer

**Next move:** 
1. Read Part 6 (Risk Mitigation) for what specifically is blocked
2. Consult a lawyer ($1K-$2K) to clarify actual risk
3. If truly blocked, try a different idea from the portfolio

### "All my ideas are marked LOW founder fit"

This means your constraints don't match the generated ideas well:
- Your skills don't align with available opportunities
- Your capital is too low (constraints ideas to services-only)
- Your time is too low (no room for learning/risk)

**Next move:**
- Consider hiring a co-founder with complementary skills
- Increase capital or increase hours/week
- Try a consulting/service-based business (lower complexity)

---

## 📞 **FINAL TIPS**

**1. Be honest in the interview**
- Don't say you have $50K if you have $5K
- Don't say 50 hrs/week if you can only do 15
- System is designed to give you good advice IF you give it accurate constraints

**2. Share your DPR early**
- With potential customers (Part 1 + Part 2)
- With potential co-founders (Part 3 + Part 6)
- With mentors (all parts)
- Ask for brutal feedback

**3. Treat roadmap as a living document**
- Phase 1 is mostly fixed (MVP scope)
- Phases 2+ will change based on customer feedback
- Update your DPR monthly as you learn

**4. Track the risks**
- Copy the "early warning signs" from Part 6
- Check them every month
- If you see an early warning sign, act fast (don't wait for crisis)

---

**You're all set! Run `python orchestrator.py` and build something great.** 🚀
