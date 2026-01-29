'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What types of companies do you work with?',
    answer:
      'I specialize in Series B SaaS companies with $10-50M ARR who have outgrown their initial Salesforce and revenue stack setup. These are typically companies that built their GTM systems quickly during early growth and now need architecture that scales without breaking what already works.',
  },
  {
    question: 'Why not just hire a full-time RevOps person?',
    answer:
      'You absolutely should, eventually. But a full-time hire takes 3-6 months to recruit, onboard, and ramp. Meanwhile, revenue leaks compound. I bridge that gap: stabilize the architecture in 6-16 weeks so your future hire inherits a documented, maintainable system instead of a mess. Some clients bring me in specifically to define the role and set up the environment before hiring.',
  },
  {
    question: 'How is this different from a Salesforce consulting partner?',
    answer:
      'Traditional partners scope a 9-month rebuild, staff it with junior consultants, and bill $150K-300K. I take the opposite approach: incremental improvements shipped on a regular cadence, principal-only delivery (you never talk to anyone but me), and fixed-scope sprints. The goal is production improvements starting week one, not a grand unveiling months later.',
  },
  {
    question: 'What does a typical engagement look like?',
    answer:
      'It starts with a 15-minute discovery call to understand your situation. If we\'re a fit, I run a diagnostic audit (usually 1-2 weeks) that maps your entire revenue stack and surfaces the highest-impact fixes. From there, we work in fixed-scope sprints, typically 8-16 weeks total. You get incremental improvements deployed regularly, not a single big-bang release.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Typical engagements run $35K-70K for a full 8-16 week sprint. My hourly rate is $75-110/hr depending on scope and complexity. Every project is scoped with a clear budget before work begins -- no surprises, no scope creep without mutual agreement. Compare that to $150K-300K for a traditional Salesforce partner or $160K+/yr for a full-time senior hire.',
  },
  {
    question: 'Can you work with our existing Salesforce admin or RevOps team?',
    answer:
      'That\'s the ideal scenario. I embed with your team, not replace them. Every engagement ends with documentation, runbooks, and enablement sessions so your team owns the system independently after I leave. The goal is to make myself unnecessary.',
  },
  {
    question: 'What if our Salesforce instance is really messy?',
    answer:
      'That\'s exactly when you need this. I specialize in brownfield environments -- existing systems that have accumulated technical debt, conflicting automations, and manual workarounds. I\'ve worked with instances that had 50+ integration workflows, duplicate data across departments, and forecasting that nobody trusted. The diagnostic phase is specifically designed to map the mess before we touch anything.',
  },
  {
    question: 'Do you do greenfield Salesforce implementations?',
    answer:
      'Rarely. My sweet spot is modernizing existing systems. If you\'re starting from scratch, a Salesforce implementation partner is probably a better fit. Where I add the most value is when you already have a system that works "well enough" but is holding back growth.',
  },
  {
    question: 'What tools and platforms do you work with?',
    answer:
      'Primarily Salesforce (Sales Cloud, Service Cloud, Revenue Cloud, CPQ, Data Cloud, Experience Cloud), but I work across the full GTM stack: HubSpot, NetSuite, Salesloft, ZoomInfo, Apollo, Outreach, Gong, Clari, and most major integration platforms (Workato, Zapier, Tray.io). If it touches revenue data, I\'ve probably worked with it.',
  },
  {
    question: 'Why do you limit to 2-3 clients at a time?',
    answer:
      'Quality over volume. Every engagement gets my full attention -- I\'m the one doing the work, attending the standups, and making the architectural decisions. I\'ve seen what happens when consultancies spread people too thin. By capping my client load, I can deliver the kind of deep, embedded partnership that actually moves the needle.',
  },
  {
    question: 'What happens after the engagement ends?',
    answer:
      'Every project includes documentation, runbooks, and a 30-day follow-up window for edge cases. You\'ll have everything your team needs to maintain and extend the system independently. If you need ongoing support beyond that, we can discuss a retainer arrangement, but the goal is always to leave you self-sufficient.',
  },
  {
    question: 'Are you US-based?',
    answer:
      'Yes. I\'m based in the Boston area and work remotely with distributed teams nationwide. All work is done by me personally -- no offshore teams, no subcontractors, no junior developers.',
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-cyan group"
      >
        <span className="font-heading text-lg font-semibold text-white group-hover:text-cyan transition-colors pr-8">
          {item.question}
        </span>
        <span className="flex-shrink-0">
          <svg
            className={`h-5 w-5 text-cyan transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-body pb-6 text-base leading-relaxed text-white/70">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-navy">
      {/* Hero */}
      <section className="relative pt-36 sm:pt-40 md:pt-44 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
            Questions & Answers
          </span>
          <h1 className="font-heading mt-5 text-4xl sm:text-5xl font-semibold leading-[1.2] tracking-[-0.02em] text-white">
            Frequently Asked Questions
          </h1>
          <p className="font-body mt-6 text-lg leading-relaxed text-white/70">
            Common questions about working with Revelate Operations. If you don&apos;t see your question here,{' '}
            <a
              href="mailto:drew@revelateops.com"
              className="text-cyan hover:underline"
            >
              send me an email
            </a>{' '}
            and I&apos;ll reply within a day.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="relative pb-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="border-t border-white/10">
            {faqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pb-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 sm:p-12 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-white mb-4">
              Still have questions?
            </h2>
            <p className="font-body text-base text-white/70 mb-8 max-w-lg mx-auto">
              Book a free 15-minute call. No sales pitch -- just an honest assessment of whether we&apos;re a fit and tactical next steps you can use immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-3.5 text-base font-semibold text-navy-ink shadow-[0_8px_16px_rgba(0,217,255,0.25)] transition-all duration-200 hover:bg-blue hover:shadow-[0_8px_16px_rgba(0,217,255,0.35)]"
              >
                Schedule a call
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="mailto:drew@revelateops.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:border-cyan hover:text-cyan"
              >
                Email me instead
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
