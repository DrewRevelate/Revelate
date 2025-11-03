'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [showCompact, setShowCompact] = useState(!isHomepage);

  useEffect(() => {
    const handleScroll = () => {
      // Responsive scroll thresholds for smooth transitions
      const getScrollThreshold = () => {
        const width = window.innerWidth;
        if (width < 640) return 100;  // Mobile: tighter threshold
        if (width < 1024) return 150; // Tablet: medium threshold
        return 200;                    // Desktop: generous threshold
      };

      if (isHomepage) {
        setShowCompact(window.scrollY > getScrollThreshold());
      } else {
        setShowCompact(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  useEffect(() => {
    if (!showCompact) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [showCompact]);

  // Determine if compact logo should be visible
  // Show compact logo when: scrolled, not homepage, OR homepage on screens < xl
  const showCompactLogo = showCompact || !isHomepage;

  return (
    <>
      {isHomepage && (
        <Link
          href="/"
          className={`group fixed left-1/2 z-40 hidden xl:flex -translate-x-1/2 flex-col items-center gap-2 sm:gap-3 lg:gap-4 transition-all duration-500 ease-out top-12 sm:top-14 md:top-16 lg:top-20 xl:top-24 2xl:top-28 ${
            showCompact ? 'pointer-events-none -translate-y-12 scale-75 opacity-0' : 'scale-100 opacity-100'
          }`}
          aria-label="Revelate home"
        >
        <span className="relative flex items-center justify-center overflow-hidden rounded-full border-[3px] border-white/60 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-[0_0_80px_rgba(0,217,255,0.4),0_0_40px_rgba(255,255,255,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)] ring-1 ring-white/20 backdrop-blur-sm transition-all duration-500 group-hover:border-white/80 group-hover:shadow-[0_0_120px_rgba(0,217,255,0.6),0_0_60px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.5)] h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 2xl:h-40 2xl:w-40">
          <Image
            src="/revelate-logo.png"
            alt="Revelate"
            width={160}
            height={160}
            className="h-full w-full object-contain relative z-10"
            priority
          />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tl from-cyan/10 via-transparent to-transparent" />
        </span>
        <span className="text-center font-semibold uppercase tracking-[0.5em] text-white/90 drop-shadow transition-colors duration-500 group-hover:text-cyan text-xs sm:text-sm">
          Revelate Operations
        </span>
      </Link>
      )}

      <nav className="fixed inset-x-0 top-[28px] z-50 py-4 transition-all duration-500 lg:py-6" aria-label="Primary navigation">
        <div
          className={`mx-auto max-w-[1280px] rounded-2xl border px-6 py-3 transition-all duration-500 lg:px-8 ${
            showCompactLogo
              ? 'border-white/30 bg-gradient-to-b from-navy/95 via-navy/90 to-navy/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-white/10'
              : 'border-transparent bg-transparent shadow-none backdrop-blur-0 ring-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className={`group flex items-center gap-3.5 transition-opacity duration-500 ${
              showCompactLogo ? 'opacity-100' : 'xl:opacity-0 xl:pointer-events-none'
            }`}>
              <span
                className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition-all ${
                  showCompactLogo
                    ? 'border-[2px] border-white/60 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-[0_0_32px_rgba(0,217,255,0.4),0_0_16px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-1 ring-white/20 backdrop-blur-sm group-hover:border-white/80 group-hover:shadow-[0_0_48px_rgba(0,217,255,0.6),0_0_24px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)]'
                    : 'border-[2px] border-white/60 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-[0_0_32px_rgba(0,217,255,0.4),0_0_16px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-1 ring-white/20 backdrop-blur-sm group-hover:border-white/80 group-hover:shadow-[0_0_48px_rgba(0,217,255,0.6),0_0_24px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)]'
                }`}
              >
                <Image
                  src="/revelate-logo.png"
                  alt="Revelate"
                  width={52}
                  height={52}
                  className="h-full w-full object-contain relative z-10"
                  priority
                />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tl from-cyan/10 via-transparent to-transparent" />
              </span>
              {showCompactLogo ? (
                <>
                  <span className="hidden md:inline text-lg font-semibold uppercase tracking-[0.24em] text-white transition group-hover:text-cyan">
                    Revelate Operations
                  </span>
                  <span className="md:hidden text-lg font-semibold uppercase tracking-[0.24em] text-white transition group-hover:text-cyan">
                    RevOps
                  </span>
                </>
              ) : (
                <>
                  <span className="hidden md:inline text-lg font-semibold uppercase tracking-[0.24em] text-white transition group-hover:text-cyan">
                    Revelate Operations
                  </span>
                  <span className="md:hidden text-lg font-semibold uppercase tracking-[0.24em] text-white transition group-hover:text-cyan">
                    RevOps
                  </span>
                </>
              )}
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:bg-cyan/10 hover:text-cyan"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="ml-2 rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-navy shadow-[0_4px_12px_rgba(0,217,255,0.2)] transition hover:bg-blue hover:shadow-[0_6px_12px_rgba(0,217,255,0.4)]"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={`rounded-lg border p-2 text-white transition md:hidden focus:outline-none focus:ring-2 focus:ring-cyan ${
                showCompactLogo
                  ? 'border-cyan/30 bg-navy/60 backdrop-blur-sm hover:border-cyan hover:bg-navy/80'
                  : 'xl:border-white/40 xl:bg-white/10 xl:hover:border-white xl:hover:bg-white/20 border-cyan/30 bg-navy/60 hover:border-cyan hover:bg-navy/80 backdrop-blur-sm'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {isOpen && (
            <div id="mobile-menu" className="mt-4 space-y-2 border-t border-cyan/30 bg-gradient-to-b from-navy via-navy/95 to-navy/90 pt-4 md:hidden">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-white transition hover:bg-cyan/10 hover:text-cyan"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="block rounded-lg bg-cyan px-4 py-4 text-center text-base font-semibold text-navy shadow-[0_6px_12px_rgba(0,217,255,0.3)] transition hover:bg-blue"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
