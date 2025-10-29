'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Hero from '@/components/Hero';
import FAQAccordion from '@/components/FAQAccordion';
import StickyNav from '@/components/StickyNav';
import Link from 'next/link';
import { industryStats, signalsWithStats, rebuildCostStat } from '@/lib/data/stats';

const signals = [
  {
    title: 'Forecast drift every Monday',
    detail: 'Board deck and Salesforce drift by double digits. Leadership exports to spreadsheets to get “real” numbers.',
  },
  {
    title: 'Automations cascade unpredictably',
    detail: 'Legacy Flow, Apex, Pardot, and middleware jobs collide. A routing tweak ripples into entitlement or marketing SLAs.',
  },
  {
    title: 'Integrations play the blame game',
    detail: 'Product telemetry, marketing ops, and finance sync on different cadences so duplicates and stale ARR figures linger for days.',
  },
  {
    title: 'RevOps backlog balloons',
    detail: 'Hundreds of Jira tickets need tribal knowledge from vendors who already left. Teams wait because production feels brittle.',
  },
];

const differentiators = [
  {
    title: '100% US-Based, Principal-Led',
    detail: 'No offshore teams, no junior hires, no hand-offs. You work directly with a principal consultant who maps your metadata, builds your automations, and ships production fixes. Fully on-shore, United States consulting.',
  },
  {
    title: 'Transparent, Accountable Billing',
    detail: "Incredibly detailed time logs available on demand for any project. You know exactly what you're paying for—down to the hour, the task, and the deliverable. No black boxes, no surprises.",
  },
  {
    title: 'Deep Expertise Across the Revenue Stack',
    detail: "From Salesforce and NetSuite to Apollo, Workato, and 30+ integration platforms—I've architected revenue operations across the modern enterprise stack. Your specific integration challenge? I've likely solved it twice already.",
  },
  {
    title: 'AI-Augmented Excellence',
    detail: 'I leverage cutting-edge AI to accelerate diagnostics, automate documentation, and deliver insights faster—without sacrificing the human judgment that makes complex systems work. AI-augmented workflow that combines efficiency with expertise.',
  },
];

const process = [
  {
    phase: 'Discovery & Audit',
    focus: 'Working session & audit',
    summary:
      'We pull the automation map apart live, align on business goals, and scope a modernization sprint the board will understand.',
    deliverables: [
      '15-minute intro call with executive recap',
      'Prioritized modernization backlog ranked by revenue risk',
      'Aligned budget, owners, and success metrics',
    ],
  },
  {
    phase: 'Stabilize Production',
    focus: 'Stabilize production',
    summary:
      'Ship regular improvements to routing, forecasting, attribution, and integrations with regression tests and rollback plans.',
    deliverables: [
      'Version-controlled automations with reviewers',
      'Live health dashboards for SLA, pipeline, and ARR',
      'Change log committed to your repo with Loom walkthroughs',
    ],
  },
  {
    phase: 'Instrument & Hand Off',
    focus: 'Instrument & hand off',
    summary:
      'Wire observability, documentation, and enablement so the internal team owns the system without vendor hand-holding.',
    deliverables: [
      'Leadership scorecards wired to trusted data',
      'Runbooks and enablement sessions for admins and GTM',
      '30-day follow-up window for edge cases',
    ],
  },
];

const metrics = [
  {
    value: '120 hrs',
    label: 'monthly time saved',
    description: 'automated manual reconciliation work for recent Series B client.',
  },
  {
    value: '6-16 wks',
    label: 'typical timeline',
    description: 'from discovery to production improvements, depending on scope.',
  },
  {
    value: '$200K+',
    label: 'savings identified',
    description: 'in annual operational inefficiencies for Series B media-tech client.',
  },
];


const faqs = [
  {
    question: 'What happens before we commit?',
    answer:
      'We start with a 15-minute intro call. You bring the symptoms, I map the breaking points live, and you leave with a modernization backlog, budget, and timeline—even if we choose not to move forward together.',
  },
  {
    question: 'Can you partner with our internal admin or MSP?',
    answer:
      'Yes. I ship inside your tooling, pair on reviews, and leave Loom explainers plus written runbooks so your admin or MSP inherits a stable system.',
  },
  {
    question: 'How quickly do production changes land?',
    answer:
      'Sandbox fixes ship in week one. Production updates land on a regular cadence—typically weekly to bi-weekly—with regression tests, change logs, and rollback plans committed to your repo.',
  },
  {
    question: 'Do you work outside of SaaS revenue teams?',
    answer:
      'My focus is B2B SaaS with 30–150 sellers using Salesforce as the source of truth across marketing, sales, customer success, and finance. I can recommend partners if you sit outside that band.',
  },
];

export default function Home() {
  const differentiatorsSectionRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const outcomesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const withMotion = (value: string) => (prefersReducedMotion ? '0%' : value);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Parallax for Differentiators section
  const { scrollYProgress: differentiatorScrollProgress } = useScroll({
    target: differentiatorsSectionRef,
    offset: ['start end', 'end start'],
  });

  const differentiatorHeaderY = useTransform(
    differentiatorScrollProgress,
    [0, 0.3],
    [50, 0]
  );

  const differentiatorHeaderOpacity = useTransform(
    differentiatorScrollProgress,
    [0, 0.3],
    [0, 1]
  );

  // Parallax for Results section
  const { scrollYProgress: resultsScrollProgress } = useScroll({
    target: resultsRef,
    offset: ['start end', 'end start'],
  });

  const resultsBackgroundY = useTransform(
    resultsScrollProgress,
    [0, 1],
    ['0%', withMotion('38%')]
  );

  const resultsPatternY = useTransform(
    resultsScrollProgress,
    [0, 1],
    ['0%', withMotion('24%')]
  );

  const resultsGlowScale = useTransform(
    resultsScrollProgress,
    [0, 1],
    [1, prefersReducedMotion ? 1 : 1.12]
  );

  const resultsPatternOpacity = useTransform(
    resultsScrollProgress,
    [0, 1],
    [0.18, prefersReducedMotion ? 0.18 : 0.42]
  );

  const resultsCardsY = useTransform(
    resultsScrollProgress,
    [0, 1],
    ['0%', withMotion('-18%')]
  );

  // Parallax for Outcomes section
  const { scrollYProgress: outcomesScrollProgress } = useScroll({
    target: outcomesRef,
    offset: ['start end', 'end start'],
  });

  const outcomesContentY = useTransform(
    outcomesScrollProgress,
    [0, 1],
    ['0%', withMotion('-12%')]
  );

  const outcomesCardsY = useTransform(
    outcomesScrollProgress,
    [0, 1],
    ['0%', withMotion('8%')]
  );

  // Parallax for CTA section
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ['start end', 'end start'],
  });

  const ctaContentY = useTransform(
    ctaScrollProgress,
    [0, 1],
    ['0%', withMotion('-18%')]
  );

  return (
    <>
      <Hero />
      <StickyNav />

      {/* NEW: Differentiators Section */}
      <section
        ref={differentiatorsSectionRef}
        id="differentiators"
        className="bg-white py-20 text-navy"
        aria-labelledby="differentiators-heading"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            style={{
              y: prefersReducedMotion ? 0 : differentiatorHeaderY,
              opacity: prefersReducedMotion ? 1 : differentiatorHeaderOpacity
            }}
            className="max-w-3xl text-center mx-auto"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Why choose Drew
            </span>
            <h2 id="differentiators-heading" className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl">
              Four things that make this different
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#334155]">
              No offshore teams. No junior devs. No surprises. Just principal-level expertise embedded with your team.
            </p>
          </motion.div>

          {/* Currently Working With Section */}
          <div className="mt-12 mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-xl border border-cyan/20 bg-gradient-to-br from-cyan/[0.04] to-transparent p-6 sm:p-8">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan mb-4">
                  Currently Working With
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe3f0] bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm">
                    <svg className="h-4 w-4 text-cyan" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Series B SaaS
                  </span>
                  <span className="text-[#64748b]">|</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe3f0] bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm">
                    <svg className="h-4 w-4 text-cyan" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Mid-Market Manufacturing
                  </span>
                  <span className="text-[#64748b]">|</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe3f0] bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm">
                    <svg className="h-4 w-4 text-cyan" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Early-Stage Fintech
                  </span>
                </div>
                <p className="mt-5 text-xs text-[#64748b] leading-relaxed">
                  I maintain 2-3 active engagements at a time to ensure deep focus and quality delivery for each client.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, index) => {
              const isExpanded = expandedCard === index;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: "easeOut"
                  }}
                  onHoverStart={() => setExpandedCard(index)}
                  onHoverEnd={() => setExpandedCard(null)}
                  onClick={() => setExpandedCard(isExpanded ? null : index)}
                  className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-6 shadow-[0_6px_12px_rgba(17,27,58,0.12)] transition-all duration-200 hover:shadow-[0_8px_16px_rgba(0,217,255,0.2)] hover:border-cyan/40 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,132,255,0.08)_0%,rgba(255,255,255,0)_70%)]" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
                      <svg className="h-6 w-6 text-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-navy">{item.title}</h3>
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                        marginTop: isExpanded ? 12 : 0
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm leading-6 text-[#64748b]">{item.detail}</p>
                    </motion.div>
                    {!isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-xs font-medium text-cyan"
                      >
                        <span>Learn more</span>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW: Documented Outcomes Section */}
      <section
        ref={outcomesRef}
        id="outcomes"
        className="relative overflow-hidden bg-navy py-28 text-white"
        aria-labelledby="outcomes-heading"
      >
        <div className="pointer-events-none absolute inset-0">
          {/* Removed gradients - using single cyan gradient from Approach section */}
        </div>

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            style={{ y: prefersReducedMotion ? 0 : outcomesContentY }}
            className="max-w-3xl text-center mx-auto"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-magenta">
              Documented outcomes
            </span>
            <h2 id="outcomes-heading" className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl">
              Results that speak for themselves
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Compared against industry benchmarks from recent research
            </p>
          </motion.div>

          {/* Concrete Client Outcome Example */}
          <motion.div
            style={{ y: prefersReducedMotion ? 0 : outcomesContentY }}
            className="mt-10 mx-auto max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-xl border border-cyan/30 bg-cyan/[0.08] p-6 backdrop-blur-md shadow-[0_12px_32px_rgba(0,217,255,0.15)]">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-white/90 leading-relaxed">
                  <strong className="text-white">Recent outcome:</strong> Series B Media-Tech company—stabilized forecast accuracy from 63% to 94%, eliminated $200K in duplicate platform spend, reduced RevOps team reporting time by 120 hours/month.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: prefersReducedMotion ? 0 : outcomesCardsY }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex h-1 w-14 rounded-full bg-magenta" />
                <div className="space-y-1.5">
                  <p className="text-[1.85rem] font-semibold leading-tight text-white md:text-[2.1rem]">6-16 weeks</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">to production</p>
                  <p className="text-xs leading-5 text-white/75">typical timeline for meaningful improvements to revenue architecture.</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-white/60">Industry benchmark:</p>
                    <p className="mt-1 text-xs leading-5 text-white/75">
                      Only <a href={signalsWithStats[0].sourceUrl} className="font-semibold underline decoration-magenta/40 underline-offset-2 hover:text-magenta hover:decoration-magenta transition" target="_blank" rel="noopener noreferrer">20%</a> of orgs forecast within 5% accuracy <span className="text-white/50">(Xactly 2024)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex h-1 w-14 rounded-full bg-magenta" />
                <div className="space-y-1.5">
                  <p className="text-[1.85rem] font-semibold leading-tight text-white md:text-[2.1rem]">Weekly</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">production cadence</p>
                  <p className="text-xs leading-5 text-white/75">regular deployment of improvements while maintaining system stability.</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-white/60">Industry benchmark:</p>
                    <p className="mt-1 text-xs leading-5 text-white/75">
                      <a href={signalsWithStats[1].sourceUrl} className="font-semibold underline decoration-magenta/40 underline-offset-2 hover:text-magenta hover:decoration-magenta transition" target="_blank" rel="noopener noreferrer">20%</a> of IT budget consumed by tech debt maintenance <span className="text-white/50">(Forrester 2024)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex h-1 w-14 rounded-full bg-magenta" />
                <div className="space-y-1.5">
                  <p className="text-[1.85rem] font-semibold leading-tight text-white md:text-[2.1rem]">Incremental</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">approach</p>
                  <p className="text-xs leading-5 text-white/75">targeted fixes instead of expensive 9-month agency rebuilds.</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-white/60">Industry benchmark:</p>
                    <p className="mt-1 text-xs leading-5 text-white/75">
                      Complex implementations cost <a href={rebuildCostStat.url} className="font-semibold underline decoration-magenta/40 underline-offset-2 hover:text-magenta hover:decoration-magenta transition" target="_blank" rel="noopener noreferrer">{rebuildCostStat.range}</a> over 9 months <span className="text-white/50">({rebuildCostStat.source} {rebuildCostStat.year})</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={resultsRef}
        id="approach"
        className="relative overflow-hidden bg-white py-28 text-navy"
        aria-labelledby="approach-heading"
      >
        <motion.div
          style={{ y: resultsBackgroundY, scale: resultsGlowScale }}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {/* Signature Cyan Gradient - Homepage */}
          <div className="absolute right-[12%] top-[-30%] h-[420px] w-[420px] rounded-full bg-cyan/12 blur-[70px]" />
          <motion.div
            style={{ y: resultsPatternY, opacity: resultsPatternOpacity }}
            className="absolute inset-0"
          >
            <div className="h-full w-full bg-[radial-gradient(circle,rgba(0,132,255,0.22)_1px,transparent_1px)] opacity-70 mix-blend-soft-light [background-size:46px_46px]" />
          </motion.div>
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Two paths forward
            </span>
            <h2 id="approach-heading" className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl">
              Hire a conglomerate that bills you. Or an embedded principal who joins your team.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#334155]">
              Every RevOps leader faces this choice. One burns $200K on a nine-month rebuild with offshore developers. The other stabilizes what's broken in 6-16 weeks—with incremental production improvements throughout.
            </p>
          </div>

          {/* Visual: 1 Principal vs 8-12 Team */}
          <div className="mt-12 mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-[0_6px_12px_rgba(17,27,58,0.12)]">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                {/* Left: Traditional Agency */}
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 mb-4">
                    Typical Agency
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-navy">8-12 team members</p>
                  <p className="text-xs text-[#64748b] mt-1">Multiple handoffs, time zones, skill levels</p>
                </div>

                {/* Divider */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-24 w-px bg-[#dbe3f0]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <span className="text-xs font-semibold text-[#64748b]">VS</span>
                  </div>
                </div>

                {/* Right: Revelate */}
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan mb-4">
                    Revelate
                  </p>
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-cyan/10 flex items-center justify-center border-2 border-cyan">
                      <svg className="h-8 w-8 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-navy">1 principal</p>
                  <p className="text-xs text-[#64748b] mt-1">Who knows your entire system</p>
                </div>
              </div>
            </div>
          </div>

          {/* Split Comparison */}
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Left: Big Consultancy (What to Avoid) */}
            <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-[#f8fafc] p-8 shadow-[0_6px_12px_rgba(17,27,58,0.12)]">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Traditional Agency
                </span>
              </div>
              <h3 className="text-xl font-semibold text-navy">The Conglomerate Model</h3>
              <p className="mt-3 text-sm text-[#64748b]">What most consultancies offer</p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Offshore teams, junior developers</p>
                    <p className="mt-1 text-xs text-[#64748b]">Your system gets passed between time zones and skill levels</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Opaque billing, hidden costs</p>
                    <p className="mt-1 text-xs text-[#64748b]">Vague invoices. Surprise overages. No detailed time tracking.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Nine-month rebuilds, revenue at risk</p>
                    <p className="mt-1 text-xs text-[#64748b]">Rip-and-replace strategy freezes your GTM while they rebuild</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Generic playbooks, no context</p>
                    <p className="mt-1 text-xs text-[#64748b]">They've never seen your tech stack combination before</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-red-700">Industry Reality Check</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-red-700">•</span>
                    <span className="text-red-900">
                      <a href={industryStats[0].url} className="font-semibold underline decoration-red-400 underline-offset-2 hover:text-red-600 hover:decoration-red-600 transition" title={industryStats[0].tooltip} target="_blank" rel="noopener noreferrer">{industryStats[0].number}</a> of CRM data is incomplete or missing critical fields
                      <span className="ml-1 text-xs text-red-700">({industryStats[0].source} {industryStats[0].year})</span>
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-red-700">•</span>
                    <span className="text-red-900">
                      <a href={industryStats[3].url} className="font-semibold underline decoration-red-400 underline-offset-2 hover:text-red-600 hover:decoration-red-600 transition" title={industryStats[3].tooltip} target="_blank" rel="noopener noreferrer">{industryStats[3].number}</a> average wasted annually on unused SaaS licenses
                      <span className="ml-1 text-xs text-red-700">({industryStats[3].source} {industryStats[3].year})</span>
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-red-700">•</span>
                    <span className="text-red-900">
                      <a href={industryStats[2].url} className="font-semibold underline decoration-red-400 underline-offset-2 hover:text-red-600 hover:decoration-red-600 transition" title={industryStats[2].tooltip} target="_blank" rel="noopener noreferrer">{industryStats[2].number}</a> of sales rep time spent on non-selling activities
                      <span className="ml-1 text-xs text-red-700">({industryStats[2].source} {industryStats[2].year})</span>
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-red-700">•</span>
                    <span className="text-red-900">
                      <a href={industryStats[1].url} className="font-semibold underline decoration-red-400 underline-offset-2 hover:text-red-600 hover:decoration-red-600 transition" title={industryStats[1].tooltip} target="_blank" rel="noopener noreferrer">{industryStats[1].number}</a> average annual cost of poor data quality
                      <span className="ml-1 text-xs text-red-700">({industryStats[1].source} {industryStats[1].year})</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Principal-Led Partner (Your Approach) */}
            <div className="relative overflow-hidden rounded-xl border-2 border-cyan bg-white p-8 shadow-[0_6px_12px_rgba(0,217,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,217,255,0.25)] transition-shadow duration-200">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Principal-Led Partner
                </span>
              </div>
              <h3 className="text-xl font-semibold text-navy">The Embedded Partner Model</h3>
              <p className="mt-3 text-sm text-[#64748b]">What you get working with me</p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/10">
                    <svg className="h-3 w-3 text-cyan" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Principal consultant who embeds with your team</p>
                    <p className="mt-1 text-xs text-[#64748b]">I join standups, pair on tickets, and ship fixes alongside your admins</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/10">
                    <svg className="h-3 w-3 text-cyan" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">6-16 week engagements, incremental production improvements</p>
                    <p className="mt-1 text-xs text-[#64748b]">Stabilize what's broken without freezing revenue for months</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/10">
                    <svg className="h-3 w-3 text-cyan" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Flexible engagement, transparent billing</p>
                    <p className="mt-1 text-xs text-[#64748b]">Pay for hours used, not full-time overhead. Cancel anytime.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/10">
                    <svg className="h-3 w-3 text-cyan" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Your team owns the system when we're done</p>
                    <p className="mt-1 text-xs text-[#64748b]">Documentation, runbooks, and enablement so you're never dependent</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 rounded-2xl border border-cyan/30 bg-cyan/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">The cost difference</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-cyan">•</span>
                    <span className="text-navy">
                      Average agency rebuild: <span className="font-semibold">$50K-$200K</span> over 9 months
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-cyan">•</span>
                    <span className="text-navy">
                      My modernization approach: <span className="font-semibold text-cyan">6-16 weeks</span> depending on scope, incremental production improvements with regular deployments
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="bg-[#f8fafc] py-28 text-navy" aria-labelledby="process-heading">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-blue">
              How the sprint runs
            </span>
            <h2 id="process-heading" className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl">
              Sprints that protect revenue while we modernize.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#334155] md:text-lg">
              We run an immersion audit, then ship incremental improvements on a regular cadence with the same rigor your engineers expect.
            </p>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            {process.map((step, index) => (
              <div
                key={step.phase}
                className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-[0_8px_12px_rgba(17,27,58,0.15)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,132,255,0.16)_0%,_rgba(255,255,255,0)_85%)]" />
                <div className="relative">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue/15 text-sm font-semibold text-navy shadow-[0_6px_12px_rgba(0,132,255,0.3)]">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">{step.phase}</p>
                  <h3 className="mt-2 text-xl font-semibold text-navy">{step.focus}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#334155]">{step.summary}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]">Delivered</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#334155]">
                    {step.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative overflow-hidden bg-[#f8fafc] py-28 text-navy"
        aria-labelledby="faq-heading"
      >
        <div className="pointer-events-none absolute inset-0">
          {/* Removed gradients for cleaner aesthetic */}
        </div>

        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Still deciding?
            </span>
            <h2 id="faq-heading" className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl">
              Fast answers before we hop on a call.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#334155] md:text-lg">
              Need something else? Email{' '}
              <a href="mailto:drew@revelateops.com" className="text-cyan underline decoration-cyan/40 underline-offset-4">
                drew@revelateops.com
              </a>{' '}
              and I'll reply within a day.
            </p>
          </div>

          <FAQAccordion items={faqs} className="mt-14" />

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition-colors duration-200 hover:text-blue"
            >
              See all FAQs
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        id="cta"
        className="relative overflow-hidden bg-navy-ink py-28 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Removed gradients for cleaner aesthetic */}
          <div className="absolute inset-0 mix-blend-screen opacity-30">
            <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:160px_160px,160px_160px]" />
          </div>
        </div>

        <motion.div style={{ y: prefersReducedMotion ? '0%' : ctaContentY }} className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="overflow-hidden rounded-xl border border-white/30 bg-white/10 px-6 py-10 shadow-[0_8px_12px_rgba(8,13,40,0.6)] backdrop-blur-xl sm:rounded-2xl sm:px-8 sm:py-12">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan">Next step</span>
            <h2 id="cta-heading" className="mt-6 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl">
              Bring the messy org to a working session. We'll map the fixes together.
            </h2>
            <p className="mt-6 text-base leading-7 text-white/90 md:text-lg md:leading-8">
              Book a 15-minute consultation. We'll expose what's breaking, outline the modernization sprint, and confirm whether
              I'm the right fit. Worst case—you leave with a prioritized list to tackle internally.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-magenta px-10 py-4 text-base font-semibold text-white shadow-[0_8px_12px_rgba(217,70,239,0.4)] transition-all duration-200 hover:bg-[#c235d9] hover:shadow-[0_8px_12px_rgba(217,70,239,0.5)]"
              >
                Schedule working session
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
              >
                Review scope & pricing
              </Link>
            </div>
            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <p className="mt-6 text-sm text-white/90">
              Prefer async? Email <a className="underline decoration-cyan/50 underline-offset-4" href="mailto:drew@revelateops.com">drew@revelateops.com</a> with context and we'll start there.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
