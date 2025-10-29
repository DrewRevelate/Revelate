import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy py-14 text-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-[2px] border-white/60 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-[0_0_32px_rgba(0,217,255,0.4),0_0_16px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-1 ring-white/20 backdrop-blur-sm">
                <Image src="/revelate-logo.png" alt="Revelate logo" width={36} height={36} className="h-full w-full object-contain relative z-10" />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tl from-cyan/10 via-transparent to-transparent" />
              </span>
              <span className="text-lg font-semibold">Revelate Operations</span>
            </div>
            <p className="text-sm text-white/90">
              Legacy Salesforce modernization for GTM teams who need trustworthy pipeline data—without pausing the
              business.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.05em] text-cyan">Navigate</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <Link href="/services" className="transition hover:text-white">
                  Services & pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Drew
                </Link>
              </li>
              <li>
                <Link href="/book" className="transition hover:text-white">
                  Book a working session
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.05em] text-cyan">Stay in touch</h4>
            <p className="text-sm text-white/90">
              drew@revelateops.com<br />
              Boston, MA · Remote-first
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-sm font-semibold text-navy shadow-[0_6px_12px_rgba(0,217,255,0.4)] transition hover:bg-blue hover:text-white"
            >
              Schedule discovery call
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center text-sm text-white/90">
          <p>&copy; {new Date().getFullYear()} Revelate Operations LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
