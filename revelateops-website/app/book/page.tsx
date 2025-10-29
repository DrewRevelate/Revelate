import CustomBooking from '@/components/CustomBooking';

export const metadata = {
  title: 'Book a Discovery Call | Revelate Operations',
  description: 'Schedule a discovery call with Drew Lambert to discuss your Salesforce challenges and see if modernizing your existing org is the right move.',
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(0,217,255,0.12),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan/10 px-4 py-1.5 text-sm font-medium text-cyan mb-8">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Free 15-Minute Consultation
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-8">
              Let's Fix What's Breaking
            </h1>

            <p className="text-lg leading-8 text-white/80 sm:text-xl">
              No pressure, no sales pitch—just an honest conversation about your Salesforce challenges and whether modernizing your existing org is the right move.
            </p>
          </div>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* Left Column - Info Cards */}
            <div className="space-y-6">
              {/* What to Expect Card */}
              <div className="relative rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1)_0%,rgba(26,31,58,0)_70%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">What to Expect</h2>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan mt-2" />
                      <div>
                        <p className="font-medium text-white mb-1">15-Minute Consultation</p>
                        <p className="text-sm text-white/70">Quick but thorough discussion of your current challenges and goals</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan mt-2" />
                      <div>
                        <p className="font-medium text-white mb-1">No Sales Pressure</p>
                        <p className="text-sm text-white/70">Honest assessment of whether I can help. If we're not a fit, I'll tell you upfront</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan mt-2" />
                      <div>
                        <p className="font-medium text-white mb-1">Clear Next Steps</p>
                        <p className="text-sm text-white/70">If we decide to work together, I'll outline recommended approach and pricing</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Come Prepared Card */}
              <div className="relative rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1)_0%,rgba(26,31,58,0)_70%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20">
                      <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">Come Prepared</h2>
                  </div>

                  <p className="text-sm text-white/70 mb-4">
                    To make the most of our time together, it's helpful if you can briefly describe:
                  </p>

                  <ul className="space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="text-cyan mt-0.5">→</span>
                      <span>Your current Salesforce challenges (what's breaking as you scale?)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan mt-0.5">→</span>
                      <span>What vendors or consultants have recommended (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan mt-0.5">→</span>
                      <span>Your current tech stack and integrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan mt-0.5">→</span>
                      <span>Timeline and budget constraints</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Note Card */}
              <div className="relative rounded-xl border border-cyan/20 bg-cyan/5 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-white/80">
                    <strong className="text-white">Note:</strong> I manage 2-3 active projects at a time to ensure quality and deep focus. If my calendar is full, I'll recommend other qualified Salesforce consultants.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:sticky lg:top-24">
              <div className="relative rounded-xl border border-white/10 bg-white p-6 shadow-2xl">
                <CustomBooking />
              </div>
              <p className="text-center text-white/60 text-sm mt-4">
                All times shown in your local timezone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Section */}
      <section className="relative py-16 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-6">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">
            Prefer Email?
          </h3>

          <p className="text-white/70 mb-6">
            Not ready to schedule a call yet? Have questions first? Send me an email and I'll get back to you within 24 hours.
          </p>

          <a
            href="mailto:drew@revelateops.com"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/5 hover:border-white/30"
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
