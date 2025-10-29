'use client';

import { useRef, RefObject } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

interface ParallaxOptions {
  speed?: number; // Multiplier for parallax effect (0.5 = slow, 1.5 = fast)
  offset?: ['start end' | 'end start', 'start end' | 'end start']; // Scroll position range
}

interface ParallaxResult {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
  progress: MotionValue<number>;
}

/**
 * Custom hook for creating parallax scroll effects
 * @param options - Configuration for parallax behavior
 * @returns ref to attach to element and y motion value for transform
 */
export function useParallax({ speed = 0.5, offset = ['start end', 'end start'] }: ParallaxOptions = {}): ParallaxResult {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Transform scroll progress to Y translation
  // Speed determines how much the element moves relative to scroll
  const range = 100 * (1 - speed);
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return { ref, y, progress: scrollYProgress };
}

/**
 * Hook for parallax that only affects elements when in viewport
 * Better performance for multiple parallax elements
 */
export function useViewportParallax({ speed = 0.5 }: { speed?: number } = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = 50 * (1 - speed);
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return { ref, y };
}
