# Revelate Website Redesign - Progress Tracker

**Started:** 2025-10-29
**Target Completion:** 2-3 weeks
**Reference Document:** [design-thinking-2025-10-29.md](design-thinking-2025-10-29.md)

---

## Overview

**Core Concepts:**
- **B: Exclusive Principal** - Positioning/Messaging
- **C: Progressive Disclosure + Motion** - Interaction Design
- **E: Restrained Space Aesthetic** - Visual Design

**Success Definition:** Visitors understand what Revelate offers in 7 seconds, feel trust + wow + possibility, and confidently book calls.

---

## PHASE 1: Quick Wins (This Week)
**Goal:** Ship low-effort, high-impact changes immediately
**Time Estimate:** 4-6 hours
**Status:** ✅ Complete

### Visual Cleanup (Concept E)
- [x] Reduce blur radius: 170px → 70px on all gradients
  - Files: `app/page.tsx`, `app/book/page.tsx`
  - Find: `blur-[170px]`, `blur-[130px]`, `blur-[220px]`
  - Replace with: `blur-[70px]`
- [x] Eliminate secondary gradient orbs (keep one per page)
  - Homepage: Keep cyan gradient top-right only
  - Book page: Keep magenta gradient top-center only
- [x] Reduce noise texture opacity to 0.005
  - Current: `opacity-[0.015]`
  - New: `opacity-[0.005]`
- [x] Test on Book page first, verify look/feel, then roll out to homepage

**Notes/Blockers:**
All visual cleanup complete. Single signature gradient per page implemented.

**Completed:** 2025/10/29

---

### Messaging Fix (Concept B)
- [x] Replace "Boutique" with "Principal-Led" everywhere
  - Search entire codebase for "boutique" (case-insensitive)
  - Update: "Boutique Principal" → "Principal-Led Partner"
  - Update: "Boutique Consultant" → "Embedded Principal"
- [x] Update hero subhead: Add "2-3 clients at a time"
  - File: `components/Hero.tsx` (or wherever hero lives)
  - Add language emphasizing selective engagement
- [x] Add one concrete client outcome to Outcomes section
  - Example: "Series B Media-Tech: 120hrs/month saved, $200K waste eliminated"
  - File: `app/page.tsx` - Outcomes section

**Notes/Blockers:**
All messaging updates complete. Hero now includes "I take on 2-3 clients at a time. Deep focus. No handoffs."

**Completed:** 2025/10/29

---

## PHASE 2: Core Prototype (Next Week)
**Goal:** Build three core concepts for testing
**Time Estimate:** 12-16 hours
**Status:** ✅ Complete

### Progressive Disclosure (Concept C)

#### FAQ Accordion
- [x] Convert FAQ section to collapsible accordion
  - Show only question headlines by default
  - Click/tap to expand individual answer
  - Smooth height animation on expand/collapse
  - File: `app/page.tsx` - FAQ section

**Notes:**
Created FAQAccordion.tsx component with framer-motion animations. Integrated into homepage.

**Completed:** 2025/10/29

---

#### Differentiators "Learn More"
- [x] Add expansion interaction to differentiator cards
  - Initial view: Icon + headline only (no body text)
  - Hover/click: Expand to show detail text
  - Consider: Modal, inline expansion, or side panel
  - File: `app/page.tsx` - Differentiators section

**Notes:**
Implemented inline expansion with smooth height animation. Works on hover (desktop) and click (mobile).

**Completed:** 2025/10/29

---

#### Sticky Section Navigation
- [x] Create sticky header showing current section
  - Sections: "Why Drew" | "Approach" | "Process" | "FAQ" | "Book Call"
  - Highlight current section in cyan as user scrolls
  - Click to jump to section (smooth scroll)
  - File: Create `components/StickyNav.tsx` or add to layout

**Notes:**
Created StickyNav.tsx with scroll tracking. Auto-hides until scrolling past hero. Integrated on homepage.

**Completed:** 2025/10/29

---

#### Parallax Effect (Test)
- [x] Add parallax to ONE section as engagement test
  - Recommended: Comparison section or Outcomes section
  - Subtle effect: Different scroll speeds for bg vs content
  - Use existing Framer Motion setup
  - Monitor: Does it enhance or distract?

**Notes:**
Added subtle parallax to Outcomes section. Content moves -12%, cards move +8%. Respects prefers-reduced-motion.

**Completed:** 2025/10/29

---

### Exclusive Principal Positioning (Concept B)

#### Hero Section Rewrite
- [x] Update hero headline
  - Option A: "Principal-Led Salesforce Modernization"
  - Option B: "Embedded RevOps Partner for Series B+ SaaS"
  - Make it clear and specific
- [x] Update subhead
  - Include: "I take on 2-3 clients at a time. Deep focus. No handoffs. 6-16 weeks to production stability."
- [x] File: `components/Hero.tsx`

**Notes:**
Hero subhead updated with "I take on 2-3 clients at a time. Deep focus. No handoffs."

**Completed:** 2025/10/29

---

#### "Currently Working With" Section
- [x] Create new section showing client contexts (anonymized)
  - Example: "Series B SaaS | Mid-Market Manufacturing | Early-Stage Fintech"
  - Position: Below hero or in differentiators
  - Visual: Simple text or logo placeholders
  - File: `app/page.tsx` or `components/Hero.tsx`

**Notes:**
Added after differentiators header. Shows 3 client contexts with visual badges.

**Completed:** 2025/10/29

---

#### Comparison Section Update
- [x] Remove style inconsistencies
  - Match card style from differentiators section
  - Same shadow: `shadow-[0_6px_12px_rgba(17,27,58,0.12)]`
  - Same border radius, spacing, typography
- [x] Add visual clarity
  - Your approach (left): Add cyan accent border (2px)
  - Traditional (right): Neutral gray border
- [x] File: `app/page.tsx` - Comparison section

**Notes:**
Unified card styling applied. Cyan accent border added to "Your Approach" card.

**Completed:** 2025/10/29

---

#### Visual: "1 Principal vs 8-12 Team"
- [x] Add visual comparison element
  - Show scale difference between agency model and you
  - Could be: Icon grid, simple infographic, or text callout
  - Position: In differentiators or comparison section
  - Message: "Typical Agency: 8-12 team members | Revelate: 1 principal who knows your system"

**Notes:**
Icon grid visualization added above comparison cards. Shows 12 small icons vs 1 large icon.

**Completed:** 2025/10/29

---

### Restrained Aesthetic Complete (Concept E)

#### One Signature Gradient Per Page
- [x] Homepage: Single cyan gradient (top-right, 70px blur, 12% opacity)
  - Remove all other gradients from sections
  - File: `app/page.tsx`
- [x] Book page: Single magenta gradient (top-center, 70px blur, 14% opacity)
  - Remove competing gradients
  - File: `app/book/page.tsx`

**Notes:**
All secondary gradients removed. Single signature gradient implemented per page.

**Completed:** 2025/10/29

---

#### Unified Card Styles
- [x] Ensure all cards use same visual language
  - Differentiators cards
  - Comparison cards
  - Process cards
  - Outcomes cards
  - Book page cards
- [x] Consistent properties:
  - Border: `border-[#dbe3f0]` or `border-white/15` (depending on bg)
  - Shadow: `shadow-[0_6px_12px_rgba(17,27,58,0.12)]`
  - Radius: `rounded-xl`
  - Padding: `p-6` or `p-8`

**Notes:**
All cards now use unified styling system throughout the site.

**Completed:** 2025/10/29

---

#### Constellation Dot Pattern
- [ ] Add subtle constellation/dot pattern overlay
  - Replace heavy radial gradients
  - Very subtle: 0.3 opacity or less
  - Could use CSS pattern or SVG overlay
  - Test on dark sections first

**Notes:**
Skipped - restrained aesthetic achieved without additional patterns.

**Completed:** N/A

---

## PHASE 3: Test & Iterate (Week After)
**Goal:** Validate assumptions, fix friction, ship
**Time Estimate:** 8-10 hours
**Status:** ⏸️ Not Started

### Recruit Testers
- [ ] Identify 5-7 target testers
  - 2-3 RevOps leaders (Series B+ SaaS)
  - 2-3 Sales VPs (scaling pain)
  - 1-2 founders (tech debt challenges)
- [ ] Reach out via LinkedIn with testing request
- [ ] Schedule 15-minute feedback sessions

**Target Testers:**
1. __________________ (Role: ____________)
2. __________________ (Role: ____________)
3. __________________ (Role: ____________)
4. __________________ (Role: ____________)
5. __________________ (Role: ____________)
6. __________________ (Role: ____________)
7. __________________ (Role: ____________)

**Notes:**


**Completed:** ____/____/____

---

### Prepare Testing Script
- [ ] Create testing script document
  - Task 1: "Can you figure out what I do in 10 seconds?"
  - Task 2: "You need Salesforce help. Would you book a call?"
  - Task 3: "What would you want to know before booking?"
  - Task 4: "What's your first impression?"
- [ ] Prepare Feedback Capture Grid template
- [ ] Set up screen recording (if remote) or note-taking setup

**Notes:**


**Completed:** ____/____/____

---

### Run User Tests
- [ ] Test Session 1: __________________ (Date: ____/____/____)
  - Feedback summary:

- [ ] Test Session 2: __________________ (Date: ____/____/____)
  - Feedback summary:

- [ ] Test Session 3: __________________ (Date: ____/____/____)
  - Feedback summary:

- [ ] Test Session 4: __________________ (Date: ____/____/____)
  - Feedback summary:

- [ ] Test Session 5: __________________ (Date: ____/____/____)
  - Feedback summary:

- [ ] Test Session 6: __________________ (Date: ____/____/____)
  - Feedback summary:

- [ ] Test Session 7: __________________ (Date: ____/____/____)
  - Feedback summary:


**Completed:** ____/____/____

---

### Identify Patterns
- [ ] Review all feedback capture grids
- [ ] Identify what 3+ people struggled with
- [ ] Prioritize top 3 friction points to fix

**Top 3 Friction Points:**
1. ________________________________________________________
2. ________________________________________________________
3. ________________________________________________________

**Completed:** ____/____/____

---

### Fix Top 3 Friction Points
- [ ] Friction Point #1: ________________________________________
  - Fix:
  - Files modified:

- [ ] Friction Point #2: ________________________________________
  - Fix:
  - Files modified:

- [ ] Friction Point #3: ________________________________________
  - Fix:
  - Files modified:


**Completed:** ____/____/____

---

### Retest & Ship
- [ ] Retest with 2 users to validate fixes
  - Tester 1: __________________ (Date: ____/____/____)
  - Tester 2: __________________ (Date: ____/____/____)
- [ ] Confirm improvements based on feedback
- [ ] Ship final version to production
- [ ] Announce update (LinkedIn, email list, etc.)

**Notes:**


**Completed:** ____/____/____

---

## Success Metrics Tracking

### Immediate Metrics (Week 1-2)
- [ ] Set up analytics tracking for bounce rate
- [ ] Monitor time on page (compare before/after)
- [ ] Track click-through rate to Book page
- [ ] Collect qualitative feedback from visitors

**Week 1 Metrics:**
- Bounce rate: ______%
- Avg time on page: ______ min
- CTR to Book page: ______%
- Qualitative feedback:

**Week 2 Metrics:**
- Bounce rate: ______%
- Avg time on page: ______ min
- CTR to Book page: ______%
- Qualitative feedback:

---

### Validation Metrics (From User Testing)
- [ ] 5/7 users can explain what you do in 10 seconds
  - Result: ___/7 users passed
- [ ] Trust rating averages 8+ out of 10
  - Average: ____/10
- [ ] "Principal-Led" signals expertise (not limitation)
  - Result: ☐ Yes  ☐ No  ☐ Mixed
- [ ] Restrained aesthetic feels professional
  - Result: ☐ Yes  ☐ No  ☐ Mixed
- [ ] Visitors use progressive disclosure features
  - Result: ☐ Yes  ☐ No  ☐ Mixed

---

### Business Metrics (30-60 Days)
*Track these post-launch*

**Week 4:**
- Discovery calls booked: ______
- Lead quality: ☐ Improved  ☐ Same  ☐ Worse
- Conversion rate (visitors → calls): ______%

**Week 8:**
- Discovery calls booked: ______
- Lead quality: ☐ Improved  ☐ Same  ☐ Worse
- Conversion rate (visitors → calls): ______%
- Close rate (calls → clients): ______%

---

## Project Status

**Current Phase:** Phase ___ of 3
**Overall Progress:** ____%
**Next Milestone:** ________________________________
**Blockers:** ________________________________

---

## Retrospective (Post-Launch)

**What worked well:**


**What didn't work:**


**What we learned:**


**Next iteration priorities:**


---

**Last Updated:** 2025/10/29
