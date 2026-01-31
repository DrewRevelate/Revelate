import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-navy py-20 text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      {/* Background visual elements */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-64 w-64 rounded-full bg-cyan/8 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-[5%] h-48 w-48 rounded-full bg-magenta/5 blur-[60px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="group flex items-center gap-3">
              <Image src="https://oecbrp40z4wonuql.public.blob.vercel-storage.com/Logo_no_words.png" alt="Revelate logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-lg font-semibold group-hover:text-cyan transition-colors">Revelate Operations</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Legacy Salesforce modernization for GTM teams who need trustworthy pipeline data—without pausing the business.
            </p>
            {/* Trust indicator */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
              US-based · Principal-led
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-cyan">Navigate</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services" className="text-white/70 transition-colors hover:text-cyan">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/how-i-work" className="text-white/70 transition-colors hover:text-cyan">
                  How I Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 transition-colors hover:text-cyan">
                  About Drew
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 transition-colors hover:text-cyan">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 transition-colors hover:text-cyan">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-cyan">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services#packages" className="text-white/70 transition-colors hover:text-cyan">
                  Pre-built Packages
                </Link>
              </li>
              <li>
                <Link href="/fit-assessment" className="text-white/70 transition-colors hover:text-cyan">
                  Fit Assessment
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-white/70 transition-colors hover:text-cyan">
                  Discovery Call
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-cyan">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-white/70 transition-colors hover:text-cyan">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/eula" className="text-white/70 transition-colors hover:text-cyan">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-cyan">Get Started</h4>
            <div className="space-y-3 text-sm text-white/70">
              <p>
                <a href="mailto:drew@revelateops.com" className="transition-colors hover:text-cyan">
                  drew@revelateops.com
                </a>
              </p>
              <p>Boston, MA · Remote-first</p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-magenta px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_12px_rgba(217,70,239,0.3)] transition-all duration-300 hover:bg-magenta/90 hover:shadow-[0_8px_16px_rgba(217,70,239,0.4)] hover:scale-[1.02]"
            >
              Schedule Call
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Revelate Operations LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              2-3 clients max
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
