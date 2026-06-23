# Command: ars-dpr
## DPR (Detailed Project Report) Compilation & Finalization

---

## COMMAND OVERVIEW
**Purpose:** Compile the final Detailed Project Report (DPR) after an idea has survived all validation gates.

**Prerequisites:** 
- ✅ Profile locked (`ars-intake`)
- ✅ Ideas generated (`ars-match`)
- ✅ Market Arbitrator validation (`ars-validate` → APPROVED)
- ✅ Legal & Compliance check (Agent 5 → CLEAR)
- ✅ Doom Scenario mitigation (Agent 6 → MITIGATIONS LOCKED)

**Trigger:** After all 7 agents sign off, user says "Finalize DPR" or system auto-triggers

**Flow:** DPR Compiler (Agent 7) assembles 6-part report → Updates passport with final DPR lockfile → Outputs actionable roadmap

---

## COMMAND EXECUTION FLOW

### Step 1: Pre-DPR Validation Checklist
System verifies all prerequisites are complete:

```
✓ Profile Auditor (Agent 1): PASSED
  - Passport locked with constraints
  - Entrepreneur profile validated

✓ Horizon Scanner (Agent 2): PASSED
  - 5-8 ideas generated
  - All scored and ranked

✓ Jargon Breaker (Agent 3): PASSED
  - Ideas translated to business language
  - Complexity and TRL assessed

✓ Market Arbitrator (Agent 4): APPROVED ← MUST BE YES
  - Idea validated against competitors
  - Hard gates (budget, time, geography) passed
  - Risk mitigation strategies locked

✓ Legal & Compliance (Agent 5): CLEAR ← MUST BE YES
  - Regulatory blockers identified
  - Privacy/data concerns flagged
  - Legal paths forward documented

✓ Doom Scenario Stress-Tester (Agent 6): MITIGATIONS LOCKED ← MUST BE YES
  - Top 3 failure scenarios identified
  - Low-cost mitigation strategies locked
  - Survival roadmap documented

IF ANY GATE IS NOT COMPLETE:
→ HALT and ask user which gate to complete
→ Do not proceed to DPR until ALL gates pass
```

### Step 2: DPR Compiler Activation
System activates Agent 7 (DPR Compiler) with:
- Locked passport
- Approved idea (from Market Arbitrator)
- Legal clearances (from Agent 5)
- Doom scenario mitigations (from Agent 6)

```
📋 DPR COMPILER ACTIVATED

Assembling Detailed Project Report for:
[Idea Name]

Input sources:
✓ Entrepreneur profile (Agent 1)
✓ Market opportunity (Agent 2)
✓ Business translation (Agent 3)
✓ Market validation (Agent 4)
✓ Legal clearance (Agent 5)
✓ Risk mitigation (Agent 6)

Generating 6-part DPR...
```

### Step 3: DPR Assembly (6-Part Structure)

The DPR Compiler produces a comprehensive 6-part report:

#### **PART 1: EXECUTIVE SUMMARY**
```markdown
# DPR: [Idea Name]

## One-Paragraph Overview
[Clear, compelling summary of what the business is, who it serves, 
why now, and why the founder is positioned to win]

## Key Metrics
| Metric | Value |
|--------|-------|
| Estimated TAM | $[X] |
| Year 1 Revenue Target | $[X] |
| Time to Break-Even | [X months] |
| Estimated Startup Cost | $[X] |
| Founder Advantage | [Key differentiator] |

## Verdict
**This business is VIABLE because:**
1. [Constraint fit reason]
2. [Market demand reason]
3. [Founder fit reason]

**Biggest Risk:** [Primary risk + mitigation]

---
```

#### **PART 2: MARKET OPPORTUNITY**
```markdown
# 2. Market Opportunity

## Problem Statement
**Who has this problem?**
- Customer Type 1: [Description + TAM estimate]
- Customer Type 2: [Description + TAM estimate]

**Current Solution (Status Quo)**
- How they solve it today: [Current approach]
- Cost: $[Amount] | Time: [Duration] | Quality: [Assessment]
- Pain points: [What sucks about the current solution?]

## Your Solution
**What you're offering:**
[Clear description of product/service]

**Why it's better:**
- Faster: [How much faster? Proof?]
- Cheaper: [How much cheaper? Math?]
- Better: [What's superior? Why?]

## Market Size & Timing
**Total Addressable Market (TAM):** $[X] billion
- Source: [Gartner / McKinsey / PitchBook report]
- Logic: [How you calculated it]

**Serviceable Market (Year 1):** $[X] million
- Realism check: [Why this is achievable for a founder in Month 12]

**Competitive Landscape**
| Competitor | Funding | Users | Why You Win |
|------------|---------|-------|-----------|
| [Competitor 1] | $[Amount] | [Count] | [Your advantage] |
| [Competitor 2] | $[Amount] | [Count] | [Your advantage] |

## Timing & Urgency
**Why now?**
- [Market pull reason 1]
- [Technology enabler reason]
- [Regulatory tailwind reason]
- **Window of opportunity:** [How long before this closes?]

---
```

#### **PART 3: BUSINESS MODEL & FINANCIALS**
```markdown
# 3. Business Model & Unit Economics

## Revenue Model
**Primary Revenue Stream:** [Subscription / Per-use / Licensing / Hybrid]

**Pricing Architecture**
- Customer Segment 1: $[Price] [per unit/month/year]
  - Willingness to Pay: [Evidence or reasoning]
  - Annual Contract Value (ACV): $[Amount]
  
- Customer Segment 2: $[Price] [per unit/month/year]
  - ACV: $[Amount]

## Unit Economics (Year 1 Target)
| Metric | Value |
|--------|-------|
| Customer Acquisition Cost (CAC) | $[Amount] |
| Lifetime Value (LTV) | $[Amount] |
| LTV:CAC Ratio | [Should be >3x] |
| Gross Margin | [%] |
| Monthly Churn | [%] |

## 12-Month Financial Projection
```
Month 1-3: MVP development, zero revenue
Month 4-6: Launch, 10 paying customers, $[X] MRR
Month 7-12: Growth phase, 50 paying customers, $[X] MRR
Year 1 Revenue: $[X]
Year 1 Burn Rate: $[X] (salary, AWS, marketing)
Year 1 Net: $[X] (profit/loss)
```

## Capital Requirements
**Startup Costs (Pre-Launch)**
- Product development: $[Amount]
- Infrastructure/legal: $[Amount]
- Initial marketing: $[Amount]
- **Total:** $[Amount]

**12-Month Operating Burn**
- Founder salary: $[Amount] / month × 12
- Infrastructure (AWS, tools): $[Amount] / month × 12
- Marketing/Sales: $[Amount] / month × 12
- **Total Monthly Burn:** $[Amount]

**Funding Gap Analysis**
- Available capital: $[From passport]
- Needed for 12-month runway: $[Amount]
- Gap: $[Amount] (covered by: early revenue / co-founder / small raise)

---
```

#### **PART 4: GO-TO-MARKET STRATEGY**
```markdown
# 4. Go-to-Market Strategy

## Customer Acquisition Strategy
**Primary Channel:** [Direct sales / Content / Partnerships / Marketplace / Other]

**Channel Details**
- How you'll find customers: [Specific tactics]
- Cost per acquisition: $[Amount]
- Expected conversion rate: [%]
- Time to first customer: [X weeks]

**Launch Milestones**
- Week 1-4: MVP completion
- Week 5-8: Beta with 5 customers
- Week 9-12: Public launch
- Month 4-6: 20 customers, $[X] MRR
- Month 6-12: 50 customers, $[X] MRR

## Retention & Expansion
**How you'll keep customers:**
- [Retention tactic 1]
- [Retention tactic 2]

**Expansion strategy:**
- [Up-sell: What do you sell next?]
- [Cross-sell: What adjacent products?]

## Competitive Positioning
**Your Differentiator:** [Why you, specifically]

**Why competitors can't copy you (yet):**
1. [Defensible advantage 1]
2. [Defensible advantage 2]

---
```

#### **PART 5: FOUNDER FIT & EXECUTION PLAN**
```markdown
# 5. Founder Fit & Execution Plan

## Why You're Positioned to Win
**Existing Strengths You Leverage**
- Skill 1: [How you use this in the business]
- Skill 2: [How you use this]
- Network: [Existing relationship you'll leverage]
- Asset: [Existing IP / data / infrastructure]

**Critical Skill Gaps & How You'll Close Them**
| Gap | Impact | Solution | Timeline |
|-----|--------|----------|----------|
| [Gap 1] | [Why it matters] | [How you'll learn/hire] | [Weeks] |
| [Gap 2] | [Why it matters] | [How you'll learn/hire] | [Weeks] |

## 12-Month Execution Roadmap
**Phase 1 (Month 1-3): Build**
- Milestones: [Specific deliverables]
- Resources needed: [Capital, time, help]
- Success metric: [What "done" looks like]

**Phase 2 (Month 4-6): Launch & Learn**
- Milestones: [Launch, beta feedback, iterate]
- Resources: [What you need]
- Success metric: [Customer feedback, early revenue]

**Phase 3 (Month 7-12): Scale & Refine**
- Milestones: [Grow customer base, optimize unit economics]
- Resources: [Do you need to hire? Raise?]
- Success metric: [X customers, $X MRR, positive unit economics]

## Decision Gates (Pivot Points)
**Gate 1 (Month 6):** Do we have product-market fit?
- If YES: Continue scaling
- If NO: Pivot to [Alternative market segment / Revenue model]

**Gate 2 (Month 9):** Are unit economics working?
- If YES: Double down on sales
- If NO: Pivot to [More efficient customer acquisition channel]

---
```

#### **PART 6: RISK MITIGATION & CONTINGENCY**
```markdown
# 6. Risk Mitigation & Contingency Plan

## Top 3 Failure Scenarios & Mitigations

### Scenario 1: [Primary Risk]
**Why it could happen:**
[Description of the failure mode]

**Impact if it happens:**
[What goes wrong? When?]

**Low-Cost Mitigation:**
1. [Mitigation tactic 1]
2. [Mitigation tactic 2]
3. [Mitigation tactic 3]

**Success Indicator:**
[How you'll know the mitigation worked]

---

### Scenario 2: [Secondary Risk]
[Same structure as Scenario 1]

---

### Scenario 3: [Tertiary Risk]
[Same structure as Scenario 1]

---

## Regulatory & Legal Clearance
**Any regulatory blockers?** NO / YES [Describe]

**Privacy/Data concerns?** NO / YES [Describe]

**IP/IP Assignment issues?** NO / YES [Describe]

**Path forward:** [How you'll navigate any legal/regulatory constraints]

---
```

### Step 4: DPR Lockfile Update
Update `entrepreneur_passport.yaml` with final DPR metadata:

```yaml
dpr_lockfile:
  status: "COMPLETED"
  idea_id: "[e.g., idea_001_crop_disease_detection]"
  idea_name: "[Full idea name]"
  dpr_version: "1.0"
  generated_timestamp: "[ISO 8601 timestamp]"
  
  # Hard gates that all passed
  validation_gates_passed:
    - "profile_auditor"
    - "horizon_scanner"
    - "jargon_breaker"
    - "market_arbitrator"
    - "legal_compliance"
    - "doom_scenario_tester"
  
  validation_gates_failed: []
  
  # Final business metrics
  estimated_startup_cost_usd: [Amount]
  estimated_12_month_revenue_usd: [Amount]
  estimated_time_to_market_months: [Number]
  
  # Critical risks documented
  regulatory_risks: [List]
  mitigation_strategies:
    - [Mitigation 1]
    - [Mitigation 2]
    - [Mitigation 3]
```

### Step 5: DPR Output & Presentation
System presents final DPR to user:

```
✅ YOUR DETAILED PROJECT REPORT (DPR) IS READY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DPR: Crop Disease Detection Mobile App

Idea: Validated ✓
Market: Validated ✓
Team (You): Fit ✓
Risks: Documented & Mitigated ✓
Legal: Clear ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ONE-PAGE SUMMARY:

Your Business: Mobile app that detects crop diseases from photos 
in 30 seconds, serving farmers and agricultural platforms.

Market: $4.2B agtech market growing at 15% CAGR. You'll target 
50 paying customers in Year 1 = $[X] revenue.

Why You Win: ML expertise + 50 existing agricultural contacts 
+ $5K capital = 8-week MVP launch.

Capital Required: $2,500 (MVP)
Time to MVP: 8 weeks
Runway: 12 months on $500/month burn rate

Top Risks:
1. Farmers prefer human agronomists (Mitigation: Partner with 
   agronomists, don't replace them)
2. Accuracy on rare diseases (Mitigation: App flags uncertain 
   cases for expert review)
3. User adoption (Mitigation: Launch through ag cooperatives, 
   not direct to farmers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 12-MONTH EXECUTION ROADMAP:

Month 1-3: Build MVP (AI model integration + mobile app)
Month 4: Launch beta with 5 farmers + 2 ag cooperatives
Month 5-6: Iterate based on feedback, 20 customers
Month 7-12: Scale to 50 customers, hit $[X] MRR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS:

1. Download full DPR (6-part report)
2. Build your core team / find co-founder if needed
3. Month 1: Set up AWS account, start development
4. Week 5: Begin customer discovery with ag cooperatives
5. Week 8: Launch beta

Ready to start? Timeline is tight but achievable.

Questions? Ask me anything about the plan.
```

### Step 6: Artifact Export
Generate exportable documents:

```
📥 DOWNLOADABLE ARTIFACTS:

✓ dpr-full-report.pdf (6-part DPR, 15-20 pages)
✓ dpr-one-pager.md (Executive summary)
✓ execution-roadmap.md (12-month month-by-month plan)
✓ financial-model.xlsx (Revenue projections + burn rate)
✓ risk-mitigation-checklist.md (Top 3 risks + tactics)
✓ entrepreneur-passport-locked.yaml (Final profile snapshot)

All files timestamped and immutable (for audit trail).
```

---

## EDGE CASES & HANDLING

**User says "I want to modify the DPR"**
```
You: "The DPR is now locked based on the validation gates. 
If you want to change it, you need to go back through the 
appropriate gate:

- Change idea? → Re-run Market Arbitrator (Agent 4)
- Change capital assumptions? → Update passport and re-validate
- Change timeline? → Update Legal/Compliance review

Which aspect needs updating?"
```

**User asks "What if I run out of money?"**
```
You: "Good question. Your 12-month runway is $[X]. 
If you burn faster, your options:

1. Raise a small seed round (but that changes terms)
2. Take on revenue earlier than planned (shift customer 
   acquisition timeline forward)
3. Hire a co-founder to share burn
4. Pivot to lower-burn model (consulting first, product later)

The DPR assumes Option 1 or 2. Which would you prefer?"
```

**User says "I'm ready to launch"**
```
You: "Awesome! Here's your launch checklist:

✓ DPR completed and locked
✓ All validation gates passed
✓ Risks documented and mitigated
✓ 12-month roadmap locked

BEFORE YOU START:
1. Review the full DPR (6-part report)
2. Share with a trusted advisor (co-founder? mentor?)
3. Lock in your first 3 customer conversations
4. Set up your development environment

Questions? I'm here to help."
```

---

## OUTPUT ARTIFACTS

After `ars-dpr` completes:
1. ✅ Full 6-part Detailed Project Report (15-20 pages)
2. ✅ One-pager executive summary
3. ✅ 12-month execution roadmap (month-by-month)
4. ✅ Financial model (revenue projections, burn rate, unit economics)
5. ✅ Risk mitigation checklist
6. ✅ Updated `entrepreneur_passport.yaml` (DPR lockfile populated)
7. ✅ Audit trail documenting all 7 agent decisions

---

## SUCCESS CRITERIA

`ars-dpr` is successful when:
- ✅ All 7 validation gates have passed
- ✅ DPR is 6 parts complete, detailed, and actionable
- ✅ Entrepreneur reads it and feels confident to start
- ✅ DPR is locked (immutable audit trail)
- ✅ Entrepreneur has clear 12-month execution roadmap
- ✅ Top 3 risks are identified with low-cost mitigations
- ✅ Entrepreneur knows exactly how to launch
