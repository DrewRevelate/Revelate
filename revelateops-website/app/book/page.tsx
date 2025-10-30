import BookingPageClient from '@/components/BookingPageClient';

export const metadata = {
  title: 'Book a Discovery Call | Revelate Operations',
  description: 'Schedule a discovery call with Drew Lambert to discuss your Salesforce challenges and see if modernizing your existing org is the right move.',
};

export default function BookPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Signature Magenta Gradient - Top Center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[580px] w-[580px] rounded-full bg-magenta/14 blur-[70px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.005] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-cyan mb-6 backdrop-blur">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Free 15-Minute Discovery Call
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Let&apos;s Fix What&apos;s Breaking
            </h1>

            <p className="text-lg leading-8 text-white/80 sm:text-xl max-w-3xl mx-auto mb-12">
              No pressure, no sales pitch—just an honest conversation about your Salesforce challenges. I take 2-3 clients at a time, so if we're a fit, we'll map out next steps together.
            </p>

            {/* Inline Stats - More Breathable */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10">
                  <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">45+</p>
                  <p className="text-sm text-white/70">Orgs Stabilized</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10">
                  <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">24 hrs</p>
                  <p className="text-sm text-white/70">Response Time</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10">
                  <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">93%</p>
                  <p className="text-sm text-white/70">Convert to Retainer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:gap-14 lg:grid-cols-2">
            {/* Left Column - Info Cards */}
            <div className="space-y-8">
              {/* Combined Session Flow & What to Expect */}
              <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-[0_6px_12px_rgba(17,27,58,0.12)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,217,255,0.06)_0%,rgba(255,255,255,0)_70%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3 mb-8">
                    <h2 className="font-heading text-2xl font-semibold text-navy">How the Call Works</h2>
                    <span className="inline-flex items-center gap-2 rounded-full border border-magenta/20 bg-magenta/5 px-3 py-1.5 text-xs uppercase text-[#64748b] tracking-wide font-medium">
                      <span className="inline-block h-2 w-2 rounded-full bg-magenta animate-pulse" />
                      15 Minutes
                    </span>
                  </div>

                  <ol className="space-y-6 mb-8">
                    <li className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/10 text-sm font-bold text-navy flex-shrink-0">
                        01
                      </div>
                      <div>
                        <p className="font-semibold text-navy mb-1.5">Context Download</p>
                        <p className="text-sm text-[#334155] leading-relaxed">You share where things are breaking and what success should look like.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-magenta/10 text-sm font-bold text-navy flex-shrink-0">
                        02
                      </div>
                      <div>
                        <p className="font-semibold text-navy mb-1.5">Quick Assessment</p>
                        <p className="text-sm text-[#334155] leading-relaxed">I outline immediate wins and structural fixes based on similar scaling teams.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/10 text-sm font-bold text-navy flex-shrink-0">
                        03
                      </div>
                      <div>
                        <p className="font-semibold text-navy mb-1.5">Next-Step Playbook</p>
                        <p className="text-sm text-[#334155] leading-relaxed">If we&apos;re aligned, you leave with a delivery plan, engagement model, and timeline.</p>
                      </div>
                    </li>
                  </ol>

                  <div className="pt-6 border-t border-[#dbe3f0]">
                    <p className="text-sm text-[#64748b] mb-4 font-medium">What to expect:</p>
                    <ul className="space-y-3 text-sm text-[#334155]">
                      <li className="flex items-start gap-3">
                        <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                        <span className="leading-relaxed">No sales pressure—honest assessment of fit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                        <span className="leading-relaxed">Clear pricing and engagement model if we align</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                        <span className="leading-relaxed">Recommended next steps you can act on immediately</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Come Prepared - Streamlined */}
              <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-[0_6px_12px_rgba(17,27,58,0.12)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.06)_0%,rgba(255,255,255,0)_70%)]" />
                <div className="relative">
                  <h2 className="font-heading text-2xl font-semibold text-navy mb-6">Come Prepared</h2>

                  <p className="text-sm text-[#334155] mb-5 leading-relaxed">
                    To make the most of our time, briefly think through:
                  </p>

                  <ul className="space-y-3 text-sm text-[#334155]">
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5 font-bold">→</span>
                      <span className="leading-relaxed">Your current Salesforce challenges (what&apos;s breaking as you scale?)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5 font-bold">→</span>
                      <span className="leading-relaxed">What vendors or consultants have recommended (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5 font-bold">→</span>
                      <span className="leading-relaxed">Your current tech stack and key integrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5 font-bold">→</span>
                      <span className="leading-relaxed">Timeline and budget constraints</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-6 border-t border-[#dbe3f0]">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-magenta flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-[#334155] leading-relaxed">
                        <strong className="text-navy">Note:</strong> I manage 2-3 active projects at a time to ensure quality and deep focus. If my calendar is full, I&apos;ll recommend other qualified Salesforce consultants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:sticky lg:top-24">
              <BookingPageClient />
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Section */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10 mb-6">
            <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">
            Prefer Email?
          </h3>

          <p className="text-white/80 mb-6 leading-relaxed">
            Not ready to schedule a call yet? Have questions first? Send me an email and I&apos;ll get back to you within 24 hours.
          </p>

          <a
            href="mailto:drew@revelateops.com"
            className="inline-flex items-center gap-2 rounded-xl bg-magenta px-8 py-4 text-base font-semibold text-white transition hover:bg-[#c235d9] hover:shadow-[0_6px_12px_rgba(217,70,239,0.4)] hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            drew@revelateops.com
          </a>
        </div>
      </section>
    </div>
  );
}
