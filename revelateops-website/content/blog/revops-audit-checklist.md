---
title: "The RevOps Audit Checklist: 20 Questions Before You Hire a Consultant"
description: "Before spending $50K on a RevOps engagement, run this self-assessment. These 20 questions reveal whether your revenue stack needs a tune-up or an overhaul."
date: "2026-01-15"
author: "Drew Lambert"
category: "RevOps Strategy"
tags: ["RevOps", "Audit", "Self-Assessment", "CRM", "Revenue Operations", "Checklist"]
---

I'm going to do something unusual for a consultant: give you the questions I'd ask in a paid discovery session, for free.

Not because I'm generous (I mean, I am — but that's not the point). It's because the biggest waste of money in RevOps consulting isn't bad consultants. It's companies hiring consultants before they understand their own problems.

When you walk into a discovery call knowing exactly where your revenue operations hurt, two things happen: you make better hiring decisions, and whoever you hire gets to work faster. That saves you time, money, and the frustrating experience of paying someone to tell you things you could have figured out yourself.

Run through these 20 questions honestly. Tally your answers. Then decide whether you need outside help — and what kind.

## Data Integrity (Questions 1-5)

### 1. Can you pull ARR from Salesforce and match it within 5% of your finance team's number?

If the answer is no, there's a definitional gap between your CRM and your books. This is the single most common problem I see, and it's the one that erodes board-level trust fastest.

**Score yourself:** Exact match = 3, within 5% = 2, different planet = 0

### 2. What percentage of your opportunity records have all required fields populated?

Pick five fields that your reporting depends on (close date, amount, stage, owner, source). What percentage of opportunities have all five populated correctly? Not "populated" as in someone typed "TBD" — actually populated with accurate data.

**Score yourself:** >95% = 3, 80-95% = 2, <80% = 0

### 3. How many duplicate account records exist in your CRM?

Run a basic duplicate check: accounts with matching domains, names within edit distance, or overlapping contacts. If you can't run this check, that's also your answer.

**Score yourself:** <2% = 3, 2-10% = 2, >10% or "I don't know" = 0

### 4. When was the last time someone validated your lead scoring model?

Not "reviewed" — validated against actual outcomes. Did leads that scored high convert at higher rates? Did the score predict anything? If your scoring model hasn't been validated against closed-won data in the last 6 months, it's decorative.

**Score yourself:** <6 months = 3, 6-12 months = 2, never or "we don't have scoring" = 0

### 5. Can a new hire understand your data model in their first week?

Show a new team member your Salesforce schema and custom objects. Can they figure out where key data lives, what the relationships are, and what the custom fields mean? If the answer requires a 90-minute walkthrough from someone who's been there for three years, your data model is a liability.

**Score yourself:** Self-explanatory = 3, documented but complex = 2, tribal knowledge only = 0

## Automation Health (Questions 6-10)

### 6. How many active automations do you have?

Count them all: Flows, Process Builders, Apex triggers, workflow rules, validation rules, third-party automations (Pardot, HubSpot, Workato, etc.). Don't estimate. Count.

**Score yourself:** <30 and documented = 3, 30-75 = 2, >75 or "I can't count them" = 0

### 7. Do you have a change management process for automation updates?

When someone needs to modify a Flow or add a trigger, what happens? Is there a review process? A testing environment? A rollback plan? Or does someone edit production directly and hope for the best?

**Score yourself:** Formal review + sandbox = 3, informal but consistent = 2, YOLO = 0

### 8. When was the last time an automation broke something in production?

Not "caused a minor issue" — actually broke something. Wrong data got written, leads got misrouted, reports showed incorrect numbers, notifications fired incorrectly.

**Score yourself:** >6 months ago = 3, 1-6 months = 2, this month = 0

### 9. How many of your automations could you describe to a new team member?

Not "could you point them to documentation" — could you explain what each one does, why it exists, and what happens if it stops working? If the answer is less than half, your automation portfolio has more unknown unknowns than known knowns.

**Score yourself:** >80% = 3, 50-80% = 2, <50% = 0

### 10. Do your automations have error handling?

When a Flow fails to update a record, does it retry? Log the error? Alert someone? Or does it fail silently and leave data in an inconsistent state?

**Score yourself:** Comprehensive = 3, partial = 2, "what's error handling?" = 0

## Process Efficiency (Questions 11-15)

### 11. How long does it take a lead to get to a human after form submission?

Measure this. Don't guess. Pull the actual data — median and P90 response time from form fill to first human assignment.

**Score yourself:** <5 minutes = 3, 5-30 minutes = 2, >30 minutes = 0

### 12. How many hours per week does your revenue leader spend on forecast preparation?

If your VP of Sales or CRO spends more than 2 hours per week building forecast reports, something is wrong. Either the data isn't trustworthy, the reports don't exist, or the CRM doesn't match reality.

**Score yourself:** <2 hours = 3, 2-5 hours = 2, >5 hours = 0

### 13. How many tools are in your revenue stack?

Count every tool that touches revenue data: CRM, marketing automation, enrichment, intent data, conversation intelligence, CPQ, billing, analytics, etc.

**Score yourself:** <8 and integrated = 3, 8-15 = 2, >15 or "I'd have to check" = 0

### 14. Can you trace a customer from first touch to closed-won in one system?

Pull up a recent closed-won deal. Can you see, in one place, the marketing touch that generated the lead, every interaction through the sales process, and the final contract details? Or do you need to check three different systems?

**Score yourself:** Single view = 3, mostly connected = 2, "it's in a spreadsheet" = 0

### 15. What's your pipeline-to-close ratio, and do you trust it?

Do you know how much pipeline you need to create for every dollar of closed revenue? And more importantly — is that ratio calculated from CRM data you trust, or from a manually maintained spreadsheet?

**Score yourself:** Known and CRM-sourced = 3, known but manually calculated = 2, unknown = 0

## Team & Governance (Questions 16-20)

### 16. Who owns your CRM?

Not who administers it. Who owns the strategy? Who decides what objects exist, what automations get built, and how the tool evolves? If the answer is "nobody" or "whoever yells loudest," governance is your first problem.

**Score yourself:** Dedicated owner with mandate = 3, part-time owner = 2, nobody = 0

### 17. How do teams request changes to the revenue stack?

Is there a defined intake process — a form, a ticketing system, a regular review meeting? Or do requests come in via Slack DM and get prioritized by who asked most recently?

**Score yourself:** Formal intake + prioritization = 3, informal but managed = 2, chaos = 0

### 18. When was the last time you decommissioned a tool or automation?

Addition is easy. Removal is where governance lives. If your team adds tools and automations but never retires them, your stack will only ever grow more complex.

**Score yourself:** <3 months ago = 3, 3-12 months = 2, "we've never removed anything" = 0

### 19. Does your sales team use the CRM or work around it?

Watch what reps actually do. Do they log activities in the CRM? Use it for pipeline management? Or do they maintain their own spreadsheets and only touch Salesforce when forced to by management?

**Score yourself:** Primary tool = 3, use it reluctantly = 2, active workarounds = 0

### 20. Is there a documented "source of truth" for each key metric?

For ARR, pipeline, conversion rate, sales velocity, and CAC: can you point to a single, agreed-upon source for each? If different teams pull these metrics from different places, your reporting conflicts are a feature of your architecture, not a bug.

**Score yourself:** All documented = 3, most documented = 2, "we debate this quarterly" = 0

## Score Interpretation

**Tally your points (max 60):**

| Score | Assessment |
|-------|-----------|
| **50-60** | Your revenue operations are solid. You probably need optimization, not an overhaul. A focused engagement on specific bottlenecks would be highest-value. |
| **35-49** | You have good foundations with real gaps. A structured modernization sprint (6-12 weeks) targeting your weakest areas would pay for itself. |
| **20-34** | Your revenue stack has significant structural issues. You need a systematic audit and remediation plan before adding any new tools or complexity. |
| **0-19** | You're operating on institutional memory and workarounds. The good news: the upside from fixing this is enormous. The bad news: it won't fix itself. |

## Now What?

If you scored 35 or above, you might not need a consultant at all. Prioritize the questions where you scored 0 and tackle them one at a time with your internal team.

If you scored below 35, an outside perspective will accelerate the fix — but not just any consultant. You want someone who's done this specific work (brownfield Salesforce modernization at scaling companies) and can show results, not just methodology decks.

Either way, you now have a map. You know where the problems are. That puts you ahead of 90% of companies who hire consultants based on a vague sense that "something is wrong with our CRM."

---

*Drew Lambert runs Revelate Operations, specializing in legacy Salesforce modernization for Series B SaaS companies. If your self-assessment surfaced specific questions, [book a free 15-minute discovery call](/book) — no pitch, just answers.*
