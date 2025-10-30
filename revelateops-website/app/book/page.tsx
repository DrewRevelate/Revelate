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
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Book a 15-Minute Call
          </h1>

          <p className="text-lg leading-8 text-white/80 sm:text-xl max-w-2xl mx-auto">
            Share what's breaking. Get actionable next steps—whether we work together or not.
          </p>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="relative pb-20 sm:pb-28 lg:pb-32">
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:gap-16 lg:grid-cols-[1fr_1.2fr]">
            {/* Left Column - Simple reasons */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-white mb-1">No sales pitch</p>
                    <p className="text-sm text-white/70">Honest assessment of whether we're a fit</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-white mb-1">Walk away with value</p>
                    <p className="text-sm text-white/70">Tactical next steps you can use immediately</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-white mb-1">Clear pricing upfront</p>
                    <p className="text-sm text-white/70">Know exactly what it costs if we move forward</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-white/60 leading-relaxed">
                  I work with 2-3 clients at a time. If my calendar is full, I'll point you to other qualified consultants.
                </p>
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
