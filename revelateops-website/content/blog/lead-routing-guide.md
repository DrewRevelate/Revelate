---
title: "Lead Routing Is Broken at Most SaaS Companies (Here's How to Fix It)"
description: "Slow lead routing kills conversion. A practical guide to diagnosing routing bottlenecks in Salesforce and building a system that responds in minutes, not hours."
date: "2026-01-22"
author: "Drew Lambert"
category: "Salesforce"
tags: ["Lead Routing", "Salesforce", "Sales Operations", "Conversion Rate", "Automation"]
---

Let me share a number that changed how I think about lead routing: **2 hours and 14 minutes.**

That was the average lead routing time at a Series C SaaS company I worked with. Not a broken system — a *working* one. Leads came in, got scored, got assigned, and landed in a rep's queue. The process worked exactly as designed. It just took two hours to complete because the logic was spread across three different automation tools running on different trigger schedules.

We got it to 3 minutes. The conversion rate improvement was measurable within the first month.

Most SaaS companies know that speed-to-lead matters. Research from multiple sources consistently shows that response time is one of the strongest predictors of conversion. Yet the average B2B lead response time remains stubbornly high — measured in hours, not minutes — because the routing infrastructure underneath was built incrementally and never optimized end-to-end.

## Why Lead Routing Gets Complicated

In a simple world, lead routing is straightforward: lead comes in, assign to rep, done. But Series B SaaS companies don't live in a simple world. They live in one where:

- **Territory assignments** change quarterly (or more often)
- **Round-robin pools** need to account for rep capacity, time zones, and PTO
- **Account matching** should route leads from existing customers to their account owner, not a new-business rep
- **Scoring logic** determines whether a lead goes to SDR or directly to AE
- **Channel attribution** routes partner-sourced leads differently from inbound
- **Segment rules** send enterprise leads to one team and mid-market to another

Each of these requirements was probably added separately, by different people, at different times. The result is a routing system that nobody fully understands and everyone is afraid to change.

## The Diagnostic: Finding Your Bottlenecks

Before you start rebuilding routing logic, measure what's actually happening. Most teams skip this step because they assume they know where the problems are. They're usually wrong.

### Step 1: Measure End-to-End Routing Time

Pull every lead created in the last 90 days. Calculate the time between creation and first assignment to a human owner (not a queue). Then look at the distribution:

- **P50** (median) — what's the typical experience?
- **P90** — what happens to the bottom 10%?
- **P99** — what are the worst cases?

The P90 and P99 numbers are where the real story lives. A system with a 5-minute median but a 4-hour P90 has a design problem that averages hide.

### Step 2: Map the Automation Chain

Trace a single lead through every automation that touches it, in order. Document:

- What triggers each step (record create, field update, scheduled batch)
- How long each step takes
- What data each step reads and writes
- What happens when a step fails

You're looking for three patterns:
1. **Serial bottlenecks** — steps that wait for a previous step to complete when they don't need to
2. **Polling intervals** — scheduled automations that only run every 15 or 30 minutes
3. **Race conditions** — multiple automations that fire on the same trigger and interfere with each other

### Step 3: Audit Your Matching Logic

Account matching is where most routing systems break down. The logic for determining "is this lead from an existing account?" seems simple but has edge cases everywhere:

- Email domain matching fails for personal email addresses
- Company name matching fails for subsidiaries and DBAs
- Multiple contacts at the same account create duplicate matching conflicts
- Fuzzy matching creates false positives that route leads to the wrong rep

Pull your match rates. How many leads get matched correctly? How many get matched incorrectly? How many should have matched but didn't? Each failure mode has a different solution.

## Building a Routing System That Actually Works

The goal isn't perfection. It's a system that handles 95% of cases correctly within minutes and surfaces the remaining 5% for human review rather than silently misrouting them.

### Principle 1: Single Source of Truth for Rules

Consolidate all routing logic into one place. Not three Flows, a Process Builder, and an Apex trigger. One Flow (or one Apex class if the logic is complex enough to warrant it) that owns the entire routing decision.

This sounds obvious but it's the single highest-impact change you can make. When routing logic lives in one place:
- You can read the complete decision tree
- Changes have predictable effects
- Testing covers the full path
- New team members can understand it

### Principle 2: Assignment, Then Notification

Separate the assignment decision from the notification mechanism. The routing engine decides who gets the lead. A separate process handles alerting (Slack notification, email, mobile push — whatever your team uses).

This decoupling lets you change how reps get notified without touching assignment logic, and vice versa. It also makes testing simpler because you can verify assignment correctness without triggering notifications.

### Principle 3: Build for the Exception Path

Every routing system needs a fallback. What happens when:
- No territory matches?
- The assigned rep is out of office?
- The account owner has left the company?
- Matching finds multiple possible accounts?

Design these exception paths explicitly. A lead in a "needs manual review" queue with context about why it couldn't be auto-routed is infinitely better than a lead silently assigned to the wrong person.

### Principle 4: Measure After You Ship

After you rebuild routing, instrument it. Track:
- **Routing time** (creation to assignment) — set an alert if P90 exceeds your threshold
- **Reassignment rate** — how often do leads get manually reassigned after routing? High rates mean your rules need refinement
- **First-touch time** — how long after assignment does the rep actually engage? This is the metric that matters for conversion, and it's influenced by routing quality

## Common Patterns and Solutions

### The "Queue Black Hole"

**Symptom:** Leads get assigned to a queue but nobody pulls them promptly.

**Fix:** Replace queue assignment with direct user assignment wherever possible. If you need queues for load balancing, add automated escalation that reassigns after a time threshold (30 minutes for high-intent leads, 2 hours for everything else).

### The "Stale Territory Map"

**Symptom:** Leads route based on territory definitions from two quarters ago. New accounts and changed segments don't match.

**Fix:** Build territory rules on dynamic attributes (company size, industry, geography) rather than static account lists. Static lists drift. Dynamic rules adapt automatically.

### The "Scoring Delay"

**Symptom:** Leads can't be routed until they're scored, but scoring depends on enrichment data that takes minutes to populate.

**Fix:** Implement two-stage routing. Stage 1 runs immediately on lead creation using only the data you have (form fields, domain). Stage 2 re-evaluates after enrichment completes and upgrades the assignment if needed. The lead gets to a human fast; the *right* human gets it shortly after.

### The "Partner Attribution Fight"

**Symptom:** Partner-sourced leads should route to the partner team, but source attribution is unreliable or arrives late.

**Fix:** Use dedicated form endpoints or UTM structures for partner channels so attribution is structural, not inferential. If a lead enters through the partner form, it's partner-sourced — no scoring model required.

## The Bottom Line

Lead routing is infrastructure. It's not glamorous, it doesn't show up in demos, and nobody writes blog posts about their amazing routing engine. But it's the first operational system that touches every potential dollar of revenue your company will earn.

Get it right and your reps spend time selling. Get it wrong and your best leads go cold while your routing system runs a 30-minute batch job to figure out who should call them.

The fix is rarely revolutionary. It's consolidation, measurement, and iteration — applied by someone who's seen the failure modes before and knows which patterns actually work at scale.

---

*Drew Lambert helps Series B SaaS companies fix their revenue operations infrastructure. Previously, he reduced lead routing time from 2+ hours to 3 minutes at a $100M+ SaaS company.*
