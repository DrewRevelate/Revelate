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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // On mobile, always show compact mode
      // On desktop homepage, show compact after scrolling 200px
      // On other pages, always stay compact
      if (isMobile) {
        setShowCompact(true);
      } else if (isHomepage) {
        setShowCompact(window.scrollY > 200);
      } else {
        setShowCompact(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage, isMobile]);

  useEffect(() => {
    if (!showCompact) {
      setIsOpen(false);
    }
  }, [showCompact]);

  return (
    <>
      {isHomepage && (
        <Link
          href="/"
          className={`group fixed left-1/2 top-12 z-40 hidden -translate-x-1/2 flex-col items-center gap-4 transition-all duration-500 ease-out md:flex ${
            showCompact ? 'pointer-events-none -translate-y-12 scale-75 opacity-0' : 'scale-100 opacity-100'
          }`}
          aria-label="Revelate home"
        >
        <span className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/60 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-[0_0_80px_rgba(0,217,255,0.4),0_0_40px_rgba(255,255,255,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)] ring-1 ring-white/20 backdrop-blur-sm transition-all duration-500 group-hover:border-white/80 group-hover:shadow-[0_0_120px_rgba(0,217,255,0.6),0_0_60px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.5)]">
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
        <span className="text-center text-sm font-semibold uppercase tracking-[0.5em] text-white/90 drop-shadow group-hover:text-cyan">
          Revelate Operations
        </span>
      </Link>
      )}

      <nav className="fixed inset-x-0 top-0 z-50 py-4 transition-all duration-500 lg:py-6" aria-label="Primary navigation">
        <div
          className={`mx-auto max-w-[1280px] rounded-2xl border px-6 py-3 transition-all duration-500 lg:px-8 ${
            showCompact
              ? 'border-white/30 bg-gradient-to-b from-navy/95 via-navy/90 to-navy/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-white/10'
              : 'border-transparent bg-transparent shadow-none backdrop-blur-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3.5">
              <span
                className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition-all ${
                  showCompact
                    ? 'border-[2px] border-white/60 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-[0_0_32px_rgba(0,217,255,0.4),0_0_16px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-1 ring-white/20 backdrop-blur-sm group-hover:border-white/80 group-hover:shadow-[0_0_48px_rgba(0,217,255,0.6),0_0_24px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)]'
                    : 'border border-transparent bg-transparent shadow-none opacity-0'
                }`}
              >
                {showCompact && (
                  <>
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
                  </>
                )}
              </span>
              {showCompact && (
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
              className={`rounded-lg border p-2 text-white transition md:hidden ${
                showCompact
                  ? 'border-cyan/30 bg-navy/60 backdrop-blur-sm hover:border-cyan hover:bg-navy/80'
                  : 'border-white/40 bg-white/10 backdrop-blur-sm hover:border-white hover:bg-white/20'
              }`}
              aria-label="Toggle navigation menu"
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
            <div className="mt-4 space-y-2 border-t border-cyan/30 bg-gradient-to-b from-navy/40 to-transparent pt-4 md:hidden">
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
