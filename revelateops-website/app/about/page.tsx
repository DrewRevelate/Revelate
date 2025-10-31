'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
    year: '2018–2022',
    company: 'Reveneer',
    title: 'Sales Operations & Systems Architecture',
    description: 'Moved from sales operations associate to revenue operations manager. Designed routing, forecasting, and reporting, then led integrations, AppExchange builds, and Fortune 500 implementations with a lean team.',
    lesson: 'Document the machine while you build it—and keep it scalable as complexity rises.',
    durationMonths: 48
  },
  {
    year: '2022–2024',
    company: 'DraftSales (Fractional)',
    title: 'Fractional Salesforce Architect',
    description: 'Side consulting alongside Bevi role. Partnered with growth-stage teams that needed enterprise-grade Salesforce without full-time headcount. Designed integrations, coached operators, and shipped clarity fast.',
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
    detail: 'Series B SaaS rate: $80-110/hr (discounted from standard $180/hr). Project packages typically range from $12K-$70K. Transparent budgets, no surprise scope creep.'
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
    title: 'My Partner in Debugging',
    text: 'Meet Sirius Black—my Black Lab and the real MVP of deep work sessions. Named after the Harry Potter character, he\'s mastered the art of the "are we done yet?" head tilt right around hour three of architecture diagrams.',
    image: '/drew-and-sirius.jpeg'
  },
  {
    title: 'Wedding Dance Floor Regular',
    text: 'You\'ll find me attempting moves at family weddings—much to their dismay. The enthusiasm is there, the coordination less so. But someone\'s gotta keep the energy up.',
    image: '/family-wedding.jpeg'
  },
  {
    title: 'Quality Time with Family',
    text: 'Nothing beats exploring cities with family. This is my uncle and me in Times Square—a reminder that the best moments happen when you step away from the screens and just be present.',
    image: '/nyc-with-uncle.jpeg'
  }
];

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  const motionDisabled = prefersReducedMotion;

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
      </div>

      {/* Constellation dots - simple and clean like other pages */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[
          { x: '15%', y: '15%' }, { x: '25%', y: '12%' }, { x: '35%', y: '10%' },
          { x: '45%', y: '14%' }, { x: '55%', y: '15%' }, { x: '65%', y: '12%' },
          { x: '75%', y: '18%' }, { x: '85%', y: '15%' }, { x: '95%', y: '16%' },
          { x: '12%', y: '35%' }, { x: '28%', y: '38%' }, { x: '42%', y: '40%' },
          { x: '58%', y: '42%' }, { x: '72%', y: '38%' }, { x: '88%', y: '35%' },
          { x: '10%', y: '60%' }, { x: '22%', y: '58%' }, { x: '38%', y: '65%' },
          { x: '52%', y: '62%' }, { x: '68%', y: '60%' }, { x: '82%', y: '58%' },
          { x: '18%', y: '82%' }, { x: '32%', y: '85%' }, { x: '48%', y: '88%' },
          { x: '64%', y: '85%' }, { x: '78%', y: '82%' }, { x: '92%', y: '80%' }
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan opacity-30"
            style={{ left: pos.x, top: pos.y }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-36 pb-24 md:pt-40 lg:pt-44 xl:pt-48 lg:pb-32">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-12">
          <div className="pb-16">
            <span className="text-xs uppercase tracking-[0.4em] text-white/40">Founder story</span>
          </div>

          <motion.section
            className="relative mb-28 grid gap-16 lg:mb-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
            initial={motionDisabled ? undefined : { opacity: 0, y: 32 }}
            animate={motionDisabled ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan">Drew Lambert</p>
              <h1
                className="font-heading text-3xl leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-6xl"
              >
                I build revenue architecture because I have been the operator who needed it most.
              </h1>
              <div className="space-y-6">
                <p className="font-body text-xl leading-relaxed text-white/70 lg:text-2xl">
                  Since 2018 I have lived inside revenue teams—from managed services providers supporting <span className="text-white">150+ companies</span> to emerging SaaS startups to a <span className="text-white">Boston-based Series C IT startup</span>—stitching GTM, finance, and product data together so operators could finally explain what happened last quarter.
                </p>
                <p className="font-body text-xl leading-relaxed text-white/70 lg:text-2xl">
                  <span className="font-semibold text-white">Revelate Operations</span> is the studio I built to give founders the partner I always wanted beside me: someone who <span className="font-semibold text-white">knows the work</span>, <span className="font-semibold text-white">tells the truth</span>, and <span className="font-semibold text-white">leaves the team stronger</span>.
                </p>
              </div>
              <div className="font-body mt-10 grid gap-4 text-base text-white/60 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
                  US-based, working with distributed teams nationwide
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-magenta" />
                  Former RevOps, finance, and product analytics operator
                </div>
              </div>
            </div>

            <motion.div
              className="relative"
              {...(motionDisabled
                ? {}
                : {
                    initial: { opacity: 0, y: 24 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.2 }
                  })}
            >
              <div className="relative overflow-hidden rounded-2xl border-4 border-white/30 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/D Lambert.png"
                    alt="Portrait of Drew Lambert"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Founder</p>
                <p className="font-heading text-xl font-semibold text-white">
                  Drew Lambert
                </p>
                <p className="font-body text-sm leading-relaxed text-white/60">
                  Most working sessions still start with a notebook full of architecture diagrams and operator checklists.
                </p>
              </div>
            </motion.div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0)}>
            {/* Why section - flows naturally from hero */}
            <div className="mb-16 max-w-4xl">
              <h2 className="font-heading mb-6 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Why Revelate exists
              </h2>
              <div className="space-y-4 text-lg text-white/75">
                <p>
                  Every high-growth chapter came with the same pattern: end-of-month scramble, systems disagreeing, and a board meeting looming. I started Revelate to give leaders space to breathe by engineering the systems underneath the numbers.
                </p>
                <p>
                  My work blends finance discipline with product curiosity and operator empathy. It&apos;s less about selling new platforms and more about aligning definitions, cleaning up architecture, and coaching teams through the change.
                </p>
              </div>
            </div>

            {/* Core principles - simple list */}
            <div className="mb-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {personalReasons.map((reason, index) => (
                <div key={reason.title} className="border-l-2 border-cyan/30 pl-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan/70">0{index + 1}</p>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-white/70">{reason.text}</p>
                </div>
              ))}
            </div>

            {/* How we work */}
            <div className="border-t border-white/10 pt-16">
              <div className="mb-8">
                <h3 className="font-heading mb-3 text-2xl font-semibold text-white">
                  How Revelate shows up for operators
                </h3>
                <p className="max-w-3xl text-base text-white/70">
                  This is the short list I share with founders when they ask what makes the work different from a traditional consulting engagement.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
                {practiceFocus.map((item) => (
                  <div key={item.title} className="border-l-2 border-cyan/30 pl-4">
                    <h4 className="mb-1 text-base font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.08)}>
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                The road here
              </h2>
              <p className="font-body mt-4 max-w-3xl text-xl text-white/70">
                Every chapter made the next one possible: dialing prospects, rescuing data, architecting systems, and finally building the consultancy I wished existed when I was in the trenches.
              </p>
            </div>

            {/* Compact Timeline */}
            <div className="relative border-l-2 border-white/10 pl-8 space-y-8">
              {journeyMoments.map((moment, index) => {
                const isHighlight = Boolean(moment.highlight);
                return (
                  <div key={`${moment.year}-${index}`} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-[2.15rem] top-1 h-4 w-4 rounded-full border-2 ${isHighlight ? 'bg-magenta border-magenta' : 'bg-cyan border-cyan'}`} />

                    <div className={isHighlight ? 'pl-4 border-l-2 border-magenta/30' : ''}>
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-sm font-bold text-white">{moment.year}</span>
                        <h3 className="text-lg font-semibold text-white">{moment.company}</h3>
                      </div>
                      <p className="text-sm font-medium uppercase tracking-wide text-white/50 mb-2">
                        {moment.title}
                      </p>
                      <p className="text-base text-white/70 mb-2">
                        {moment.description}
                      </p>
                      <p className={`text-sm font-medium italic ${isHighlight ? 'text-magenta/80' : 'text-cyan/70'}`}>
                        {moment.lesson}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <section className="mb-24 lg:mb-32">
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                What I am working on now
              </h2>
            </div>

            {/* Simple list format */}
            <div className="space-y-6 max-w-4xl">
              {currentFocus.map((item, index) => (
                <div key={item.label} className="border-l-2 border-cyan/30 pl-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.label}
                  </h3>
                  <p className="font-body text-base text-white/70">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.08)}>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Operator toolkit</p>
              <h2 className="font-heading mt-5 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Systems I live in every week.
              </h2>
              <p className="font-body mt-6 max-w-3xl text-xl text-white/70">
                Seven-plus years in the Salesforce ecosystem with deep hands-on experience across 50+ implementations, and a career built on stitching finance, GTM, and product data into one understandable story.
              </p>
            </div>

            {/* Compact inline categories */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {capabilityStack.map((stack) => (
                <div key={stack.category}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan mb-3">{stack.category}</p>
                  <div className="space-y-2">
                    {stack.items.map((item) => (
                      <p key={item} className="text-sm text-white/70">• {item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.1)}>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">How engagements run</p>
              <h2 className="font-heading mt-5 text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                A consultancy built for focus and transparency.
              </h2>
              <p className="font-body mt-6 max-w-3xl text-xl text-white/70">
                I structure Revelate so founders know the cost, cadence, and expectations upfront. No bait-and-switch retainers, just operator-to-operator clarity.
              </p>
            </div>

            {/* Simple list */}
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
              {engagementNotes.map((note) => (
                <div key={note.label} className="border-l-2 border-cyan/30 pl-4">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {note.label}
                  </h3>
                  <p className="text-sm text-white/70">{note.detail}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.1)}>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Operating principles</p>
              <h2 className="font-heading mt-5 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                The guardrails I bring into every engagement.
              </h2>
            </div>

            {/* Compact list with icons */}
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
              {principles.map((principle) => (
                <div key={principle.title} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                    <principle.icon />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.15)}>
            <div className="mb-16">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Beyond the dashboards</p>
              <h2 className="font-heading mt-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Life outside the spreadsheets.
              </h2>
              <p className="font-body mt-6 max-w-3xl text-xl text-white/70">
                I am at my best when I make time to think, reset, and stay curious. These slices keep me grounded so I can be present for the teams I support.
              </p>
            </div>

            {/* Photo Grid - Cleaner, Less Card-Heavy */}
            <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {offDuty.map((item, index) => (
                <div key={item.title} className="group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">{item.title}</p>
                    <p className="text-base leading-relaxed text-white/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Music Section - Simplified, Less Nested */}
            <div className="border-t border-white/10 pt-16">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-magenta/15">
                  <svg className="h-5 w-5 text-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-magenta/70">The Soundtrack</p>
                  <h3 className="font-heading text-2xl font-semibold text-white">Five decades, infinite moods</h3>
                </div>
              </div>

              <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-white/80">
                    The playlist shifts constantly—from 70s piano rock to brand-new indie releases that dropped last week. Sometimes it&apos;s the emotional weight of a well-crafted story song. Other times it&apos;s pure theatrical bombast or the kind of infectious pop hook that won&apos;t leave your head for three days.
                  </p>
                  <p className="text-lg leading-relaxed text-white/80">
                    It&apos;s the background hum to focused work sessions, the energy boost during late-night builds, and the emotional reset between client calls. Eclectic doesn&apos;t begin to cover it—but that&apos;s the point. The best thinking happens when the soundtrack refuses to sit still.
                  </p>

                  {/* Current Vibe - Inline */}
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-white/50">Current Vibe:</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-magenta animate-pulse" />
                      <span className="text-sm text-white/70">Upbeat storytelling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <span className="text-sm text-white/70">Musical theater</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple/60 animate-pulse" style={{ animationDelay: '0.6s' }} />
                      <span className="text-sm text-white/70">Classic rock</span>
                    </div>
                  </div>
                </div>

                {/* Album Art - Clean Grid */}
                <div className="lg:w-80">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { album: 'The Click - AJR', image: '/album-the-click.jpg' },
                      { album: 'Don\'t Shoot Me - Elton John', image: '/album-dont-shoot-me.jpg' },
                      { album: 'Too Weird to Live - Panic!', image: '/album-too-weird.png' },
                      { album: 'Ever After - Marianas Trench', image: '/album-ever-after.jpg' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="aspect-square rounded-lg border-2 border-white/20 shadow-md relative overflow-hidden bg-gray-900"
                        title={item.album}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image src={item.image} alt={item.album} fill className="object-cover" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-3 text-center text-xs text-white/40">Recent rotation spanning five decades</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="relative mx-auto max-w-5xl"
            {...getFadeProps(0.18)}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent" />

              <div className="relative p-10 sm:p-14 lg:p-20">
                {/* Content */}
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                      Let&apos;s connect
                    </span>
                    <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                      Ready to talk revenue architecture?
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-white/80 leading-relaxed">
                      Whether you&apos;re untangling ARR definitions, preparing for diligence, or simply want to compare notes on revenue operations—let&apos;s connect. I respond to every message within one business day.
                    </p>
                  </div>

                  {/* Contact grid */}
                  <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                    <a
                      href="mailto:drew@revelateops.com"
                      className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.08] p-5 transition-all duration-200 hover:border-cyan/40 hover:bg-white/[0.12] hover:shadow-[0_8px_20px_rgba(0,217,255,0.2)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20 text-cyan transition-colors group-hover:bg-cyan/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Email</p>
                        <p className="text-sm font-medium text-white">drew@revelateops.com</p>
                      </div>
                    </a>

                    <a
                      href="tel:+16037551646"
                      className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.08] p-5 transition-all duration-200 hover:border-cyan/40 hover:bg-white/[0.12] hover:shadow-[0_8px_20px_rgba(0,217,255,0.2)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20 text-cyan transition-colors group-hover:bg-cyan/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Phone</p>
                        <p className="text-sm font-medium text-white">(603) 755-1646</p>
                      </div>
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Or</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  {/* CTA button */}
                  <div>
                    <Link
                      href="/book"
                      className="inline-flex items-center justify-center gap-3 rounded-xl bg-cyan px-10 py-5 text-base font-semibold text-navy transition-all duration-200 hover:bg-cyan/90"
                    >
                      Schedule a consultation
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Footer */}
                  <div className="pt-6 space-y-2">
                    <p className="text-sm font-semibold text-white">Drew Lambert</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Founder & Principal Consultant</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
