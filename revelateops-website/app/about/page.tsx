'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMemo, useState } from 'react';

const journeyMoments = [
  {
    year: '2018',
    company: 'IBM',
    title: 'Business Development Specialist',
    description: 'My first assignment was cold calling for IBM. High-volume outreach exposed every flaw in the data—so I built dashboards and hygiene routines that kept the floor aligned.',
    lesson: 'Data only matters if the people using it can trust it.',
    durationMonths: 6
  },
  {
    year: '2019–2022',
    company: 'Reveneer',
    title: 'Sales Operations & Systems Architecture',
    description: 'Moved from sales operations associate to revenue operations manager. Designed routing, forecasting, and reporting, then led integrations, AppExchange builds, and Fortune 500 implementations with a lean team.',
    lesson: 'Document the machine while you build it—and keep it scalable as complexity rises.',
    durationMonths: 43
  },
  {
    year: '2022–2024',
    company: 'DraftSales',
    title: 'Fractional Salesforce Architect',
    description: 'Partnered with growth-stage teams that needed enterprise-grade Salesforce without full-time headcount. Designed integrations, coached operators, and shipped clarity fast.',
    lesson: 'Ship clarity quickly, then scale the playbook.',
    durationMonths: 24
  },
  {
    year: '2022–2025',
    company: 'Bevi',
    title: 'Senior Revenue Systems Engineer',
    description: 'Owned Salesforce architecture for a $100M+ Series C team. Modernized CRM, stitched product and finance data, and returned 15+ hours to sellers every month.',
    lesson: 'Automation only matters if operators feel the difference.',
    durationMonths: 39
  },
  {
    year: '2025',
    company: 'Revelate Operations',
    title: 'Founder & Principal Consultant',
    description: 'Opened an operator-led consultancy for Series B teams—documentation-first and focused on revenue architecture resets instead of rebuilds.',
    lesson: 'Operators deserve an operator-led partner.',
    durationMonths: 4,
    highlight: true
  }
];

const personalReasons = [
  {
    title: 'Operators deserve operators',
    text: 'I have sat in the seat, owned the targets, and defended the forecasts. Revelate exists so growth-stage teams get an advisor who has already pulled the levers they are wrestling with.'
  },
  {
    title: 'Revenue truth should be shared',
    text: 'When finance, RevOps, and product see different numbers, momentum dies. I started this practice to rebuild shared definitions so numbers travel cleanly across systems.'
  },
  {
    title: 'Documentation is the deliverable',
    text: 'Every engagement ends with the playbooks and rationales the internal team needs. No black boxes, no mystery configurations—just clarity the team can maintain.'
  }
];

const practiceFocus = [
  {
    title: 'Revenue architecture resets',
    description: 'Brownfield redesigns for Series B SaaS teams with $10-50M ARR. We repair the stack you already rely on instead of pitching a re-platform.'
  },
  {
    title: 'Systematic discovery',
    description: 'Mapping Salesforce, NetSuite, data warehouses, and integration layers before a single change is shipped so nothing breaks downstream.'
  },
  {
    title: 'Root cause architecture',
    description: 'Tracing noisy ARR reporting back to conflicting definitions, brittle integrations, and manual handoffs—then engineering the fixes that stick.'
  },
  {
    title: 'Measured outcomes',
    description: 'Every project anchors to quantifiable results: hours recaptured, leakage avoided, governance tightened, and board-ready reporting restored.'
  }
];

const currentFocus = [
  {
    label: 'Series B brownfield interventions',
    detail: 'Unwinding ARR definition drift, stabilizing reconciliation, and restoring executive trust in visibility without halting day-to-day operations.'
  },
  {
    label: 'Readiness for diligence & audits',
    detail: 'Building evidence, documentation, and automation so investor and compliance questions have clear answers before they are asked.'
  },
  {
    label: 'Everyday systems hygiene',
    detail: 'Maintaining runbooks, enablement plans, and governance cadences so improvements survive long after the project ends.'
  }
];

const caseSnapshots = [
  {
    name: 'Series B media-tech platform',
    summary: 'Eliminated six figures in manual reconciliation waste and aligned ARR logic across Salesforce, NetSuite, and product systems.',
    impact: ['120 hours/month manual work automated', '90-day implementation window', 'Board reporting regained credibility']
  },
  {
    name: 'FinTech SaaS revenue team',
    summary: 'Shipped Azure AD SSO, Salesforce Data Cloud, and AWS PrivateLink integrations without introducing new platforms or downtime.',
    impact: ['6-week go-live', '99.9% uptime with full audit trail', 'Security posture hardened for enterprise sales']
  },
  {
    name: 'National nonprofit foundation',
    summary: 'Migrated legacy donations to Stripe, rolled out Salesforce Nonprofit Cloud, and launched a modern community portal.',
    impact: ['73% faster processing time', '$450K migrated with zero data loss', 'Engagement tools rebuilt for staff and donors']
  }
];

const capabilityStack = [
  { category: 'Salesforce ecosystem', items: ['Sales Cloud', 'Data Cloud', 'Nonprofit Cloud', 'AgentForce AI', 'Lightning Sync'] },
  { category: 'Finance & integration', items: ['NetSuite ERP', 'Azure AD + SSO architecture', 'AWS PrivateLink', 'Boomi middleware'] },
  { category: 'Revenue operations', items: ['CPQ & subscription management', 'Account hierarchy modeling', 'Revenue leakage diagnostics'] },
  { category: 'Security & compliance', items: ['SAML configuration patterns', 'HIPAA / SOC 2 / PCI-aware approaches', 'Investor diligence prep'] }
];

const engagementNotes = [
  {
    label: 'Fixed-hour engagements',
    detail: 'Project packages typically range from $12K-$70K at $75-$110/hr. Transparent budgets, no surprise scope creep.'
  },
  {
    label: 'Deliberately limited load',
    detail: 'Two to three active clients at a time so you are never competing for attention.'
  },
  {
    label: 'Documentation-first delivery',
    detail: 'Interviews, discovery notes, decision logs, and runbooks stay with your team when we wrap.'
  },
  {
    label: 'Stakeholder choreography',
    detail: 'Facilitating alignment between finance, GTM, product, and engineering so fixes span the full revenue spine.'
  }
];

const principles = [
  {
    title: 'Tell the whole story',
    description: 'I surface the uncomfortable truths about revenue data—because ignoring them never made a diligence meeting easier.',
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20a8 8 0 1 0-8-8" />
        <path d="M12 4v16" />
      </svg>
    )
  },
  {
    title: 'Stay close to the operators',
    description: 'No layered handoffs. You work directly with me or a peer who has owned revenue metrics in-house.',
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      </svg>
    )
  },
  {
    title: 'Leave a manual behind',
    description: 'Every engagement ships with evergreen documentation so your team can maintain momentum without me in the room.',
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    )
  },
  {
    title: 'Respect the humans behind the data',
    description: 'Revenue architecture is people architecture. I adjust pacing and comms to protect the humans doing the heavy lift.',
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    )
  }
];

const offDuty = [
  {
    title: 'Where you will find me',
    text: 'Exploring southern New Hampshire, cycling before inbox zero, and coaching local builders on revenue instrumentation.'
  },
  {
    title: 'Listening on repeat',
    text: 'An alternating mix of Tycho, Bonobo, and indie playlists that make long architecture sessions feel like flow state.'
  },
  {
    title: 'Always learning from',
    text: 'Operators who share their postmortems openly. The best lessons come from teams candid about what broke.'
  }
];

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  const [motionEnabled, setMotionEnabled] = useState(true);
  const motionDisabled = useMemo(
    () => prefersReducedMotion || !motionEnabled,
    [prefersReducedMotion, motionEnabled]
  );

  const getFadeProps = (delay = 0) => {
    if (motionDisabled) return {};
    return {
      initial: { opacity: 0, y: 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.6, delay }
    } as const;
  };

  const formatTenure = (months: number) => {
    if (months <= 0) {
      return 'Less than 1 mo';
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    }
    if (remainingMonths > 0) {
      parts.push(`${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`);
    }
    return parts.join(' ');
  };

  const getTimelineVariant = (months: number) => {
    if (months >= 36) {
      return {
        paddingClass: 'p-10 lg:p-14',
        circleClass: 'h-20 w-20 text-lg shadow-[0_0_0_16px_rgba(61,217,255,0.12)]',
        dotOffsetClass: 'top-16'
      };
    }
    if (months >= 24) {
      return {
        paddingClass: 'p-9 lg:p-12',
        circleClass: 'h-[4.5rem] w-[4.5rem] text-base shadow-[0_0_0_12px_rgba(61,217,255,0.12)]',
        dotOffsetClass: 'top-[3.9rem]'
      };
    }
    if (months >= 12) {
      return {
        paddingClass: 'p-8 lg:p-10',
        circleClass: 'h-16 w-16 text-sm shadow-[0_0_0_10px_rgba(61,217,255,0.1)]',
        dotOffsetClass: 'top-[3.5rem]'
      };
    }
    if (months >= 6) {
      return {
        paddingClass: 'p-7 lg:p-8',
        circleClass: 'h-14 w-14 text-xs shadow-[0_0_0_8px_rgba(61,217,255,0.08)]',
        dotOffsetClass: 'top-[3.25rem]'
      };
    }
    return {
      paddingClass: 'p-6 lg:p-7',
      circleClass: 'h-12 w-12 text-xs shadow-[0_0_0_6px_rgba(61,217,255,0.08)]',
      dotOffsetClass: 'top-[3rem]'
    };
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B16] via-[#09102A] to-[#070915]" />
        <div className="absolute top-[-25%] right-[-20%] h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[160px]" />
        <div className="absolute bottom-[-30%] left-[-18%] h-[40rem] w-[40rem] rounded-full bg-cyan/15 blur-[190px]" />
        {!motionDisabled && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.25, 0.45, 0.25], scale: [0.97, 1.03, 0.97], rotate: [0, 2, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute top-[12%] left-[10%] h-64 w-64 rounded-xl border border-cyan/15 bg-cyan/10 blur-3xl" />
            <div className="absolute bottom-[18%] right-[14%] h-56 w-56 rounded-full border border-magenta/25 bg-magenta/10 blur-2xl" />
          </motion.div>
        )}
        <svg className="absolute inset-0 h-full w-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 18 }).map((_, index) => {
            const x = (index % 6) * 18 + 10;
            const y = Math.floor(index / 6) * 18 + 14;
            return <circle key={index} cx={`${x}%`} cy={`${y}%`} r="1.4" fill="#68DEFF" opacity="0.35" />;
          })}
          <line x1="18%" y1="24%" x2="42%" y2="12%" stroke="#3CD9FF" strokeWidth="0.6" strokeOpacity="0.32" />
          <line x1="42%" y1="12%" x2="62%" y2="18%" stroke="#3CD9FF" strokeWidth="0.6" strokeOpacity="0.26" />
          <line x1="64%" y1="66%" x2="82%" y2="56%" stroke="#3CD9FF" strokeWidth="0.6" strokeOpacity="0.22" />
          <line x1="22%" y1="74%" x2="36%" y2="86%" stroke="#3CD9FF" strokeWidth="0.6" strokeOpacity="0.28" />
        </svg>
      </div>

      <div className="relative z-10 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-12">
          <div className="flex flex-col items-end justify-between gap-6 pb-14 md:flex-row md:items-center">
            <span className="text-xs uppercase tracking-[0.4em] text-white/40">Founder story</span>
            <button
              type="button"
              onClick={() => setMotionEnabled((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors duration-200 hover:border-cyan/40 hover:text-white"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${motionEnabled ? 'bg-cyan shadow-[0_0_12px_2px_rgba(109,229,255,0.6)]' : 'bg-white/40'}`}
              />
              {motionEnabled ? 'Pause subtle motion' : 'Enable motion'}
            </button>
          </div>

          <motion.section
            className="relative mb-24 grid gap-14 lg:mb-32 lg:grid-cols-[1.1fr_0.9fr]"
            initial={motionDisabled ? undefined : { opacity: 0, y: 32 }}
            animate={motionDisabled ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
                <span>Drew Lambert</span>
              </div>
              <h1
                className="font-heading text-5xl leading-tight text-white"
              >
                I build revenue architecture because I have been the operator who needed it most.
              </h1>
              <p
                className="font-body mt-6 text-xl text-white/70"
              >
                Since 2018 I have lived inside revenue teams at Reveneer, DraftSales, and Bevi—stitching GTM, finance, and product data together so operators could finally explain what happened last quarter. Revelate Operations is the studio I built to give founders the partner I always wanted beside me: someone who knows the work, tells the truth, and leaves the team stronger.
              </p>
              <div className="font-body mt-8 grid gap-4 text-base text-white/60 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
                  Based in Milford, NH working with distributed teams
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-magenta" />
                  Former RevOps, finance, and product analytics operator
                </div>
              </div>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 backdrop-blur"
              {...(motionDisabled
                ? {}
                : {
                    initial: { opacity: 0, y: 24 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.2 }
                  })}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(109,229,255,0.22),_transparent_70%)]" />
              <div className="relative flex h-full flex-col gap-6">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/founder-portrait.png"
                      alt="Portrait of Drew Lambert"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060816]/60 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-black/30 px-5 py-4 backdrop-blur-sm">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/70">Founder</p>
                      <p className="font-heading text-lg font-semibold text-white">
                        Drew Lambert
                      </p>
                    </div>
                  </div>
                </div>
                <p className="font-body text-base text-white/70">
                  Most working sessions still start with a notebook full of architecture diagrams and operator checklists.
                </p>
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            className="relative mb-24 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-10 lg:mb-32 lg:p-16"
            {...getFadeProps(0)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/15 to-cyan/5 opacity-60" />
            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Why Revelate exists</p>
                <h2
                  className="font-heading mt-5 text-5xl font-bold leading-tight text-white"
                >
                  I am building the consultancy I needed when revenue truth was on the line.
                </h2>
              </div>
              <div className="font-body space-y-6 text-xl text-white/75">
                <p>
                  Every high-growth chapter came with the same pattern: end-of-month scramble, systems disagreeing, and a board meeting looming. I started Revelate to give leaders space to breathe by engineering the systems underneath the numbers.
                </p>
                <p>
                  My work blends finance discipline with product curiosity and operator empathy. It is less about selling new platforms and more about aligning definitions, cleaning up architecture, and coaching teams through the change.
                </p>
              </div>
            </div>
            <div className="relative mt-12 grid gap-6 md:grid-cols-3">
              {personalReasons.map((reason, index) => (
                <div key={reason.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">0{index + 1}</p>
                  <h3 className="mt-4 text-xl font-semibold text-white" >
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-base text-white/70">{reason.text}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-16">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <h3
                  className="font-heading text-[28px] font-semibold text-white"
                >
                  How Revelate shows up for operators
                </h3>
                <p className="font-body max-w-2xl text-base text-white/70">
                  This is the short list I share with founders when they ask what makes the work different from a traditional consulting engagement.
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {practiceFocus.map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <h4 className="text-xl font-semibold text-white" >
                      {item.title}
                    </h4>
                    <p className="mt-3 text-base text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.08)}>
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2
                  className="font-heading text-5xl font-bold text-white"
                >
                  Recent engagements at a glance
                </h2>
                <p className="font-body mt-4 text-xl text-white/70">
                  The patterns repeat: conflicting definitions, manual reconciliation, brittle integrations. Here is how a few teams moved past them.
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {caseSnapshots.map((snapshot) => (
                <div key={snapshot.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-cyan/30 bg-cyan/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
                      Case file
                    </span>
                    <span className="text-xs text-white/50">{snapshot.name}</span>
                  </div>
                  <p className="mt-4 text-base text-white/80">{snapshot.summary}</p>
                  <ul className="mt-5 space-y-2 text-base text-white/65">
                    {snapshot.impact.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.1)}>
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2
                  className="font-heading text-5xl font-bold text-white"
                >
                  The road here
                </h2>
                <p className="font-body mt-4 text-xl text-white/70">
                  Every chapter made the next one possible: dialing prospects, rescuing data, architecting systems, and finally building the consultancy I wished existed when I was in the trenches.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-[2.3rem] top-12 bottom-12 hidden w-px bg-gradient-to-b from-cyan/40 via-white/15 to-magenta/40 lg:block" />
              <div className="space-y-10 lg:pl-24">
                {journeyMoments.map((moment, index) => {
                  const isHighlight = Boolean(moment.highlight);
                  const variant = getTimelineVariant(moment.durationMonths ?? 0);
                  const paddingClass = isHighlight ? 'p-9 lg:p-12' : variant.paddingClass;
                  const circleClass = isHighlight
                    ? 'h-16 w-16 text-base shadow-[0_0_0_14px_rgba(217,70,239,0.22)]'
                    : variant.circleClass;
                  const dotOffsetClass = isHighlight ? 'top-[3.6rem]' : variant.dotOffsetClass;
                  return (
                    <motion.div
                      key={`${moment.year}-${index}`}
                      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ${isHighlight ? 'border-magenta/40 bg-gradient-to-br from-magenta/15 to-magenta/5 shadow-lg shadow-magenta/10' : ''} ${paddingClass}`}
                      {...getFadeProps(index * 0.05)}
                    >
                      {isHighlight && <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-magenta/15 to-transparent opacity-60" />}
                      <div
                        className={`absolute -left-16 top-6 hidden items-center justify-center rounded-full border border-white/15 bg-[#080E1F] font-semibold text-white lg:flex ${circleClass}`}
                                             >
                        {moment.year}
                      </div>
                      <div
                        className={`absolute -left-3 ${dotOffsetClass} hidden h-3 w-3 rounded-full ${isHighlight ? 'bg-magenta shadow-[0_0_0_8px_rgba(217,70,239,0.18)]' : 'bg-cyan shadow-[0_0_0_8px_rgba(61,217,255,0.18)]'} pointer-events-none lg:block`}
                      />
                      <div className="relative flex flex-col gap-4">
                        <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                          {moment.year}
                        </span>
                        <h3 className="text-xl font-semibold text-white">
                          {moment.company}
                        </h3>
                        <p className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                          {moment.title}
                        </p>
                        <p className="font-body text-base text-white/70">
                          {moment.description}
                        </p>
                        <p className="font-body text-base font-medium text-cyan/70">
                          {moment.lesson}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <section className="mb-24 lg:mb-32">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2
                  className="font-heading text-5xl font-bold text-white"
                >
                  What I am working on now
                </h2>
                <p className="font-body mt-4 text-xl text-white/70">
                  A snapshot of the type of work currently on my desk.
                </p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {currentFocus.map((item) => (
                <motion.div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-8" {...getFadeProps(0.05)}>
                  <h3 className="text-xl font-semibold text-white" >
                    {item.label}
                  </h3>
                  <p className="font-body mt-3 text-base text-white/70">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.08)}>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Operator toolkit</p>
                <h2
                  className="font-heading mt-5 text-5xl font-bold leading-tight text-white"
                >
                  Systems I live in every week.
                </h2>
                <p className="font-body mt-6 text-xl text-white/70">
                  Seven-plus years in the Salesforce ecosystem, 300+ Trailhead badges, and a career built on stitching finance, GTM, and product data into one understandable story.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {capabilityStack.map((stack) => (
                  <div key={stack.category} className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan/70">{stack.category}</p>
                    <ul className="mt-3 space-y-2 text-base text-white/70">
                      {stack.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-magenta" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.1)}>
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">How engagements run</p>
                <h2
                  className="font-heading mt-5 text-5xl font-bold leading-tight text-white"
                >
                  A consultancy built for focus and transparency.
                </h2>
                <p className="font-body mt-6 text-xl text-white/70">
                  I structure Revelate so founders know the cost, cadence, and expectations upfront. No bait-and-switch retainers, just operator-to-operator clarity.
                </p>
              </div>
              <div className="grid gap-6">
                {engagementNotes.map((note) => (
                  <div key={note.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-xl font-semibold text-white" >
                      {note.label}
                    </h3>
                    <p className="mt-3 text-base text-white/70">{note.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.1)}>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Operating principles</p>
                <h2
                  className="font-heading mt-5 text-5xl font-bold leading-tight text-white"
                >
                  The guardrails I bring into every engagement.
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {principles.map((principle) => (
                  <div key={principle.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                      <principle.icon />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white" >
                      {principle.title}
                    </h3>
                    <p className="font-body mt-3 text-base text-white/70">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="relative mb-24 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-10 lg:mb-32 lg:p-16"
            {...getFadeProps(0.15)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/15 to-transparent opacity-70" />
            <div className="relative grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Beyond the dashboards</p>
                <h2
                  className="font-heading mt-4 text-3xl font-semibold text-white sm:text-4xl"
                >
                  Life outside the spreadsheets.
                </h2>
                <p className="font-body mt-6 text-xl text-white/70">
                  I am at my best when I make time to think, reset, and stay curious. These slices keep me grounded so I can be present for the teams I support.
                </p>
              </div>
              <div className="grid gap-6">
                {offDuty.map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">{item.title}</p>
                    <p className="mt-3 text-base text-white/80">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-white/5 p-12 text-center lg:p-16"
            {...getFadeProps(0.18)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan/20 via-transparent to-transparent" />
            <div className="font-body relative space-y-6 text-white/80">
              <h2
                className="font-heading text-3xl font-semibold text-white sm:text-4xl"
              >
                Let me know what you are wrestling with.
              </h2>
              <p className="text-lg">
                Whether you are untangling ARR definitions, preparing for diligence, or simply want to compare notes on revenue instrumentation, I am a message away.
              </p>
              <div className="pt-6 text-sm uppercase tracking-[0.3em] text-white/50">
                <p>Drew Lambert, Founder</p>
                <p className="mt-2 text-white/40">Milford, NH</p>
              </div>
              <div className="flex flex-col items-center gap-4 pt-4 text-base text-cyan">
                <a href="mailto:drew@revelateops.com" className="transition-colors duration-200 hover:text-cyan/80">
                  drew@revelateops.com
                </a>
                <a href="tel:+16037551646" className="transition-colors duration-200 hover:text-cyan/80">
                  (603) 755-1646
                </a>
              </div>
              <div className="pt-8">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-cyan/40 bg-cyan/20 px-10 py-4 text-lg font-semibold text-white transition-all duration-200 hover:border-cyan/60 hover:bg-cyan/25"
                                 >
                  Book a conversation
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
