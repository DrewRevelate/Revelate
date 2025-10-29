'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
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
      className="relative isolate z-0 flex h-full min-h-screen items-center justify-center overflow-hidden bg-navy/95 text-white backdrop-blur-lg"
    >
      {/* Deep parallax backdrop */}
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[6%] top-[-14%] h-[700px] w-[700px] rounded-full bg-cyan/24 blur-[170px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="absolute left-[-4%] bottom-[-12%] h-[600px] w-[600px] rounded-full bg-magenta/18 blur-[170px] animate-[pulse-glow_11s_ease-in-out_infinite_reverse]" />
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
            className="text-5xl font-bold leading-[1.2] tracking-[-0.02em] text-white"
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

          {/* Subhead - proper sizing */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl"
          >
            Hi, I'm Drew. I work as your embedded RevOps partner—not an agency, not a full-time hire. I'm a principal consultant who joins your team, maps what's broken, and ships production fixes weekly. Across 153+ tech stacks, most clients stabilize in 8 weeks and save $200K vs. agency quotes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
          >
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-magenta px-8 py-4 text-base font-semibold text-white shadow-[0_4px_12px_rgba(217,70,239,0.2)] transition hover:bg-[#c235d9] hover:shadow-[0_6px_12px_rgba(217,70,239,0.4)] hover:-translate-y-0.5"
            >
              See What You're Missing
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              How We Work
            </Link>
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
      `}</style>
    </section>
  );
}
