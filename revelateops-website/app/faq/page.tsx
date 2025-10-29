import Link from 'next/link';

export default function FAQ() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white py-28 text-navy">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[6%] top-[15%] h-[420px] w-[420px] rounded-full bg-cyan/15 blur-[150px]" />
          <div className="absolute bottom-[-30%] right-[12%] h-[500px] w-[500px] rounded-full bg-[#f1f5f9] blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Questions & Answers
            </span>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.2]">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#334155]">
              More FAQs coming soon. For now, email{' '}
              <a
                href="mailto:drew@revelateops.com"
                className="text-cyan underline decoration-cyan/40 underline-offset-4"
              >
                drew@revelateops.com
              </a>{' '}
              and I'll reply within a day.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:text-blue"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
