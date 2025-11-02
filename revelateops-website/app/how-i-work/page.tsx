'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HowIWorkPage() {
  return (
    <main className="relative bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy pt-36 pb-20 text-white">
        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Methodology
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-[1.2] sm:text-4xl md:text-5xl">
              How I Work With Clients
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
              Embedded partnership that stabilizes your revenue stack in 8-16 weeks—without freezing revenue for months.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3-Phase Process */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
              Three-Phase Approach
            </h2>
            <p className="mt-4 text-base text-[#64748b] md:text-lg">
              From discovery to production deployment with regular cadence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Phase 1 */}
            <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10 text-lg font-semibold text-navy">
                1
              </span>
              <h3 className="mt-4 text-xl font-semibold text-navy">Diagnose</h3>
              <p className="mt-3 text-sm text-[#64748b]">
                Deep-dive audit of your revenue stack. I map automations, integrations, data flows, and surface what&apos;s broken.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>15-minute intro call with executive recap</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Prioritized modernization backlog ranked by revenue risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Aligned budget, owners, and success metrics</span>
                </li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="relative overflow-hidden rounded-xl border-2 border-cyan bg-white p-8 shadow-md">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10 text-lg font-semibold text-navy">
                2
              </span>
              <h3 className="mt-4 text-xl font-semibold text-navy">Rebuild</h3>
              <p className="mt-3 text-sm text-[#64748b]">
                Ship regular improvements to routing, forecasting, attribution, and integrations with regression tests and rollback plans.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Version-controlled automations with reviewers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Live health dashboards for SLA, pipeline, and ARR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Change log committed to your repo with Loom walkthroughs</span>
                </li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10 text-lg font-semibold text-navy">
                3
              </span>
              <h3 className="mt-4 text-xl font-semibold text-navy">Stabilize</h3>
              <p className="mt-3 text-sm text-[#64748b]">
                Wire observability, documentation, and enablement so the internal team owns the system without vendor hand-holding.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Leadership scorecards wired to trusted data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>Runbooks and enablement sessions for admins and GTM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <span>30-day follow-up window for edge cases</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section - PLACEHOLDER */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
              Client Results
            </h2>
            <p className="mt-4 text-base text-[#64748b] md:text-lg">
              Real outcomes from recent engagements
            </p>
          </div>

          {/* PLACEHOLDER: Drew to provide case studies */}
          <div className="rounded-xl border-2 border-dashed border-[#dbe3f0] bg-[#f8fafc] p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-navy">Case Studies Coming Soon</h3>
            <p className="mt-2 text-sm text-[#64748b]">
              Drew will provide 3 detailed case studies with client context, problems solved, and quantified results.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to discuss your situation?
          </h2>
          <p className="mt-4 text-base text-white/90 md:text-lg">
            Let&apos;s map what&apos;s broken and outline the fix together.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-magenta px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#c235d9]"
            >
              Book A Diagnostic Call
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/fit-assessment"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              Check If We&apos;re A Fit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
