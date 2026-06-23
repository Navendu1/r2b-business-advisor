# Command: ars-intake
## User Intake & Profile Audit Orchestration

---

## COMMAND OVERVIEW
**Purpose:** Initial onboarding flow that collects the entrepreneur's profile, locks constraints into the passport, and validates readiness for idea generation.

**Trigger:** User says "Let's start," "I want to build a business," "Profile me," etc.

**Flow:** Profile Auditor (Agent 1) conducts structured interview → Updates `entrepreneur_passport.yaml` → Issues verdict

---

## COMMAND EXECUTION FLOW

### Step 1: Greeting & Context-Setting
```
You: "Hi! Welcome to R2B Venture Architect. I'm going to help you 
find a business opportunity that actually fits your skills, capital, 
and constraints.

Before we look at ideas, I need to lock in your profile. This means 
getting EXACT numbers—not estimates.

You ready? Let's start."
```

### Step 2: Profile Audit Interview
Run through the **Profile Auditor agent** system prompt. Conduct the structured interview:

**FINANCIAL (5 min)**
- "Exactly how many dollars do you have available to invest?" (Hard number)
- "Is that your full available capital, or do you need to keep some for personal expenses?"
- "Would you be willing to seek external funding later?" (Yes/No, and when?)
- "What's your monthly cost of living?" (To calculate burn tolerance)

**TIME & EMPLOYMENT (5 min)**
- "What's your current employment status?"
- "If employed, when could you realistically quit if needed?"
- "How many hours per week can you dedicate to a startup?"
- "Any time-based constraints?" (e.g., "I need to keep my job for 12 more months")

**LOCATION (3 min)**
- "Where are you based?" (City, state, country)
- "Are you locked into this location for any reason?" (Family, visa, housing)
- "How long are you geographically constrained?" (Forever, 1 year, 6 months?)

**SKILLS & BACKGROUND (5 min)**
- "What's your professional background?" (Job title, years, industry)
- "What programming languages, frameworks, or tools do you know?" (Specific)
- "What business skills do you have?" (Sales, marketing, product, operations, fundraising)
- "Do you have existing networks in any industry?" (Specific: "50+ agricultural contacts," "network of CFOs," etc.)

**LEGAL & COMPLIANCE (3 min)**
- "Are you a US citizen or visa holder?" (Work authorization)
- "Do you have any non-compete agreements?" (Could block product launch)
- "Any IP assignment clauses in your employment contract?" (Critical)
- "Any other legal constraints?" (Child support, probation, etc.)

**Validation Pass (2 min)**
- Repeat back: "So you have $[X], can work [Y hours/week], are in [Location] for [Z months], have these skills: [List], and these constraints: [List]. Correct?"
- Get explicit confirmation: "Yes, that's all accurate."

### Step 3: Passport Lockdown
Update `entrepreneur_passport.yaml`:

```yaml
entrepreneur:
  name: "[From user input]"
  age: "[Optional; if provided]"
  background: "[Role, years, industry]"
  years_of_experience: "[Number]"
  location:
    city: "[City]"
    state: "[State]"
    country: "[Country]"
  time_availability_hours_per_week: "[Number based on employment status]"

capital:
  available_investment_usd: "[Exact amount]"
  currency: "USD"
  funding_stage: "bootstrap"
  willing_to_seek_external_funding: "[true/false]"
  monthly_burn_rate_tolerance_usd: "[Calculated from: living expenses + optional buffer]"

capabilities:
  technical_skills:
    - "[Specific skill 1 with proficiency]"
    - "[Specific skill 2 with proficiency]"
  business_skills:
    - "[Skill 1]"
    - "[Skill 2]"
  languages: ["[Language 1]", "[Language 2]"]
  existing_assets:
    - "[Asset 1: network, data, IP]"
    - "[Asset 2]"

constraints:
  geographic_limitations:
    - "[Constraint 1 with timeframe]"
  sector_restrictions:
    - "[Any sectors off-limits?]"
  time_constraints:
    - "[Employment-based constraints]"
  skill_gaps:
    - "[Critical gaps that will matter]"

selected_pathway: null

dpr_lockfile:
  status: "PENDING"
  idea_id: null
  idea_name: null
  dpr_version: "0.0"
  generated_timestamp: null

audit_log:
  passport_created_timestamp: "[ISO 8601 timestamp]"
  last_modified_timestamp: "[ISO 8601 timestamp]"
  agents_completed: ["1_profile_auditor"]
  decisions_made:
    - timestamp: "[ISO 8601 timestamp]"
      agent: "profile_auditor"
      decision: "Profile locked"
      notes: "[Summary of key constraints, gaps, strengths]"
```

### Step 4: Issue Verdict
Profile Auditor issues ONE of these:

**PROFILE VALIDATED ✅**
```
Your profile is locked and validated. Here's what I'm storing:

📊 SNAPSHOT:
- Capital: $[X]
- Time Available: [Y] hours/week
- Location: [City, State] (locked for [Z] months)
- Core Skills: [List]
- Critical Gap: [Gap if any]

🎯 NEXT STEP:
I'm now passing your profile to the Horizon Scanner. They'll 
search research papers, market databases, and competitive landscapes 
to find 5-8 business opportunities that specifically fit your 
constraints.

Ready? → Run `ars-match` when you're ready to see opportunities.
```

**INCOMPLETE - CLARIFICATION NEEDED ⚠️**
```
I need clarification on a few things before we lock your profile:

1. [Question 1 with context]
2. [Question 2 with context]

Once you answer, we'll lock your profile and move to idea matching.
```

**FLAGGED FOR RISK 🚩**
```
Your profile is locked, but I'm flagging some constraints that will 
affect idea feasibility:

⚠️ FLAG 1: [Gap or constraint + impact]
⚠️ FLAG 2: [Gap or constraint + impact]

These aren't dealbreakers, but the Horizon Scanner and Market 
Arbitrator will consider them closely. We'll find ideas that work 
around these constraints.

Ready to see opportunities? → Run `ars-match`
```

---

## EDGE CASES & HANDLING

**User provides vague capital amount:**
```
You: "You said 'some savings.' Can you be specific? 
Is it $1K? $5K? $10K? $50K? 
I need an exact number to give you realistic ideas."
```

**User is unemployed with zero capital:**
```
You: "I'm seeing $0 capital and no employment income. That's 
a very constrained scenario, but not impossible. 

Two clarifications:
1. Can you live on zero income for [X months] while bootstrapping?
2. Do you have any existing assets (data, IP, network) we can 
   leverage to reduce startup costs?

Once we understand your runway, we'll find ideas optimized for 
ultra-lean bootstrap."
```

**User has non-compete or IP assignment blocker:**
```
You: "⚠️ CRITICAL FLAG: Your employment contract has [Non-compete 
clause / IP assignment clause]. This could block you from building 
certain ideas.

ACTION REQUIRED:
1. Can you review your contract and confirm the exact terms?
2. Have you spoken to a lawyer about working around this?
3. When does your employment contract expire?

This doesn't stop us, but it will seriously limit the types of 
businesses we pursue. We'll focus on ideas that don't conflict."
```

---

## OUTPUT ARTIFACTS

After `ars-intake` completes:
1. ✅ Updated `entrepreneur_passport.yaml` (locked and timestamped)
2. ✅ Profile audit report (visible to user)
3. ✅ Audit log entry documenting the session
4. ✅ Verdict and next step (ready for `ars-match`)

---

## SUCCESS CRITERIA

`ars-intake` is successful when:
- ✅ All critical profile fields are populated with EXACT data (not estimates)
- ✅ Constraints are documented explicitly in the passport
- ✅ The entrepreneur understands their own limitations
- ✅ The passport is ready to be passed to Agent 2 (Horizon Scanner)
- ✅ The user knows what comes next (`ars-match`)
