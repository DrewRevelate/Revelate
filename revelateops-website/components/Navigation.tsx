'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/how-i-work', label: 'How I Work' },
  { href: '/blog', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [showCompact, setShowCompact] = useState(!isHomepage);
  const [isOverLightBg, setIsOverLightBg] = useState(false);

  // Detect background color behind navbar using scroll position
  const detectBackgroundColor = useCallback(() => {
    const navHeight = 100; // Approximate nav position from top
    const sections = document.querySelectorAll('[data-nav-theme]');

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      // Check if nav overlaps with this section
      if (rect.top <= navHeight && rect.bottom >= navHeight) {
        const theme = section.getAttribute('data-nav-theme');
        setIsOverLightBg(theme === 'light');
        return;
      }
    }
    // Default to dark theme (white text) if no section found
    setIsOverLightBg(false);
  }, []);

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

      // Detect background on scroll
      detectBackgroundColor();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage, detectBackgroundColor]);

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
          className={`group fixed left-1/2 z-40 hidden xl:flex -translate-x-1/2 flex-col items-center transition-all duration-500 ease-out top-24 sm:top-28 md:top-32 lg:top-36 xl:top-40 2xl:top-44 ${
            showCompact ? 'pointer-events-none -translate-y-8 opacity-0' : 'opacity-100'
          }`}
          aria-label="Revelate home"
        >
        <span className="text-center font-bold uppercase tracking-[0.4em] text-white drop-shadow-lg transition-colors duration-500 group-hover:text-cyan text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Revelate Operations
        </span>
      </Link>
      )}

      <nav className="fixed inset-x-0 top-[28px] z-50 py-4 transition-all duration-500 lg:py-6" aria-label="Primary navigation">
        <div
          className={`mx-auto max-w-[1280px] rounded-2xl border px-6 py-3 transition-all duration-500 lg:px-8 ${
            showCompactLogo
              ? isOverLightBg
                ? 'border-navy/20 bg-gradient-to-b from-navy/90 via-navy/85 to-navy/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(17,27,58,0.1)] ring-1 ring-navy/10'
                : 'border-white/40 bg-gradient-to-b from-white/15 via-white/10 to-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)] ring-1 ring-white/20'
              : 'border-transparent bg-transparent shadow-none backdrop-blur-0 ring-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className={`group flex items-center gap-3.5 transition-opacity duration-500 ${
              showCompactLogo ? 'opacity-100' : 'xl:opacity-0 xl:pointer-events-none'
            }`}>
              <Image
                src="https://oecbrp40z4wonuql.public.blob.vercel-storage.com/Logo_no_words.png"
                alt="Revelate"
                width={44}
                height={44}
                className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
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
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-cyan/15 text-cyan font-semibold'
                      : 'text-white hover:bg-cyan/10 hover:text-cyan'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="ml-2 rounded-lg bg-magenta px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(217,70,239,0.3)] transition hover:bg-magenta/90 hover:shadow-[0_6px_12px_rgba(217,70,239,0.4)]"
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
                  className={`block rounded-lg px-4 py-3 text-base font-medium transition ${
                    pathname === link.href
                      ? 'bg-cyan/15 text-cyan font-semibold'
                      : 'text-white hover:bg-cyan/10 hover:text-cyan'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="block rounded-lg bg-magenta px-4 py-4 text-center text-base font-semibold text-white shadow-[0_6px_12px_rgba(217,70,239,0.3)] transition hover:bg-magenta/90"
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
