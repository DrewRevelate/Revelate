'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const executivePainPoints = [
  "Your board deck doesn't match Salesforce. Again.",
  "Revenue forecasts are guesswork dressed up as strategy.",
  "Your RevOps team is drowning in Salesforce chaos.",
  "Pipeline reports take 40 hours. Decisions take 40 seconds.",
  "You're paying for Salesforce. But trusting spreadsheets.",
  "Every quarter, same question: Where did the revenue go?"
];

const platforms = [
  { name: 'Salesforce', logo: '/logos/salesforce.png' },
  { name: 'HubSpot', logo: '/logos/hubspot.svg' },
  { name: 'Slack', logo: '/logos/slack.png' },
  { name: 'GitHub', logo: '/logos/github.png' },
  { name: 'Notion', logo: '/logos/notion.png' },
  { name: 'Figma', logo: '/logos/figma.svg' },
  { name: 'Atlassian', logo: '/logos/atlassian.svg' },
  { name: 'Datadog', logo: '/logos/datadog.svg' },
  { name: 'Pipedrive', logo: '/logos/pipedrive.png' },
  { name: 'Snowflake', logo: '/logos/snowflake.svg' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const withMotion = (value: string) => (prefersReducedMotion ? '0%' : value);

  // Rotating pain points
  const [currentPainIndex, setCurrentPainIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPainIndex((prev) => (prev + 1) % executivePainPoints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effects - disabled if user prefers reduced motion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', withMotion('35%')]);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', withMotion('22%')]);
  const svgY = useTransform(scrollYProgress, [0, 1], ['0%', withMotion('28%')]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate z-0 flex h-full min-h-[100dvh] items-center justify-center overflow-hidden bg-navy text-white pt-36 pb-24 md:pt-40 lg:pt-44 xl:pt-48 lg:pb-32"
    >
      {/* Deep parallax backdrop */}
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Signature Cyan Gradient - Top Right */}
        <div className="absolute right-[6%] top-[-14%] h-[40vh] w-[40vh] md:h-[50vh] md:w-[50vh] lg:h-[700px] lg:w-[700px] rounded-full bg-cyan/12 blur-[70px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
      </motion.div>

      {/* Data field texture */}
      <motion.div style={{ y: gridY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_-6%,rgba(0,217,255,0.2)_0%,rgba(17,20,45,0)_65%)]" />
        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:34px_34px]" />
      </motion.div>

      {/* Constellation connecting lines */}
      <motion.svg
        style={{ y: svgY }}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.line
          x1="65%"
          y1="34%"
          x2="80%"
          y2="34%"
          stroke="#00d9ff"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.45 }}
          transition={{ duration: 1.4, delay: 0.8 }}
        />
        <motion.line
          x1="80%"
          y1="34%"
          x2="80%"
          y2="58%"
          stroke="#00d9ff"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.45 }}
          transition={{ duration: 1.4, delay: 1 }}
        />
        <motion.line
          x1="80%"
          y1="58%"
          x2="65%"
          y2="60%"
          stroke="#00d9ff"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.45 }}
          transition={{ duration: 1.4, delay: 1.2 }}
        />
      </motion.svg>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <article>
          {/* Rotating pain points as main headline */}
          <motion.h1
            key={currentPainIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-2xl font-bold leading-[1.2] tracking-[-0.02em] text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {executivePainPoints[currentPainIndex]}
          </motion.h1>

          {/* Subtle accent line - centered */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-1 w-24 rounded-full bg-cyan"
          />

          {/* NEW: Cause Diagnosis - Why the pain exists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-8 max-w-2xl text-left"
          >
            <p className="font-body text-base leading-relaxed text-white/95 sm:text-lg">
              That&apos;s not a training problem. Your revenue stack is <strong className="text-white">misconfigured</strong>, your data pipelines are <strong className="text-white">broken</strong>, and your team routed around the system because it slowed them down. Agencies audit and leave. You need someone who stays and fixes it in production.
            </p>
          </motion.div>

          {/* Solution Statement - Outcome focused */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-left"
          >
            <p className="font-body text-base leading-relaxed text-white/90 sm:text-lg">
              I embed in your team for <strong className="text-cyan">8-16 weeks</strong>, diagnose what&apos;s actually broken, rebuild your revenue architecture, and stay until your team trusts the system again. Two clients max. Principal-only delivery.
            </p>
          </motion.div>

          {/* NEW: Proof Banner with Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white/5 p-5">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-white/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-white leading-relaxed">
                    <strong className="text-white">94% forecast accuracy</strong> · 8 weeks · $47M Series B SaaS
                  </p>
                  <p className="text-xs text-white/60 mt-1">— VP Revenue Operations</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Segmented CTAs - Three paths for different buyers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12"
          >
            <div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-3">
              {/* Path A: See How I Work - For VP RevOps */}
              <Link
                href="/how-i-work"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).plausible) {
                    (window as any).plausible('CTA Click', {
                      props: { path: 'how-i-work', persona: 'vp-revops' }
                    });
                  }
                }}
                className="group relative overflow-hidden rounded-xl border-2 border-white/20 bg-white/5 p-6 text-left transition-all hover:border-white/40 hover:bg-white/10"
              >
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-heading text-base font-semibold text-white">See How I Work</h3>
                    <p className="font-body mt-1 text-sm text-white/70">Case studies, process, and results</p>
                  </div>
                </div>
              </Link>

              {/* Path B: Book A Diagnostic - For Founders/CROs (Primary CTA) */}
              <Link
                href="/book"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).plausible) {
                    (window as any).plausible('CTA Click', {
                      props: { path: 'book-diagnostic', persona: 'founder-cro' }
                    });
                  }
                }}
                className="group relative overflow-hidden rounded-xl border-2 border-magenta bg-magenta p-6 text-left transition-all hover:bg-[#c235d9]"
              >
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-heading text-base font-semibold text-white">Book A Diagnostic</h3>
                    <p className="font-body mt-1 text-sm text-white/90">Schedule a 45-min strategy call</p>
                  </div>
                </div>
              </Link>

              {/* Path C: Check If We're A Fit - For CFOs/Cautious buyers */}
              <Link
                href="/fit-assessment"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).plausible) {
                    (window as any).plausible('CTA Click', {
                      props: { path: 'fit-assessment', persona: 'cfo-cautious' }
                    });
                  }
                }}
                className="group relative overflow-hidden rounded-xl border-2 border-white/20 bg-white/5 p-6 text-left transition-all hover:border-white/40 hover:bg-white/10"
              >
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-heading text-base font-semibold text-white">Check If We&apos;re A Fit</h3>
                    <p className="font-body mt-1 text-sm text-white/70">Take the 5-min assessment</p>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Platform Logo Showcase - Infinite Scroll Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-white/60 mb-6 text-center">
              Trusted expertise across 30+ enterprise platforms
            </p>

            {/* Marquee Container */}
            <div className="relative overflow-hidden">
              {/* Gradient Overlays for fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-navy to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-navy to-transparent z-10 pointer-events-none" />

              {/* Scrolling Track - Pauses on hover */}
              <div className="group relative">
                <div className="flex animate-marquee hover:pause-animation group-hover:[animation-play-state:paused]">
                  {/* First set of logos */}
                  {platforms.map((platform) => (
                    <div
                      key={`${platform.name}-1`}
                      className="flex-shrink-0 mx-6"
                      title={platform.name}
                    >
                      <div className="relative h-12 w-32 flex items-center justify-center transition-all duration-300 hover:scale-110">
                        <div className="absolute inset-0 bg-white rounded-lg shadow-lg" />
                        <Image
                          src={platform.logo}
                          alt={`${platform.name} logo`}
                          width={128}
                          height={48}
                          className="relative object-contain max-h-10 w-auto transition-all duration-300 px-2"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Duplicate set for seamless loop */}
                  {platforms.map((platform) => (
                    <div
                      key={`${platform.name}-2`}
                      className="flex-shrink-0 mx-6"
                      title={platform.name}
                    >
                      <div className="relative h-12 w-32 flex items-center justify-center transition-all duration-300 hover:scale-110">
                        <div className="absolute inset-0 bg-white rounded-lg shadow-lg" />
                        <Image
                          src={platform.logo}
                          alt={`${platform.name} logo`}
                          width={128}
                          height={48}
                          className="relative object-contain max-h-10 w-auto transition-all duration-300 px-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional platforms indicator */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/50">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                20+ additional integrations
              </span>
            </div>
          </motion.div>
        </article>
      </div>

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.15) translate(-15px, 15px);
            opacity: 0.25;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .pause-animation {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
