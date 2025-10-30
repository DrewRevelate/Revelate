'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'differentiators', label: 'Why Drew' },
  { id: 'approach', label: 'Approach' },
  { id: 'process', label: 'Process' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'Book Call' },
];

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling past hero (roughly 100vh)
      const heroHeight = window.innerHeight;
      setIsVisible(window.scrollY > heroHeight * 0.8);

      // Determine which section is currently in view
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      // Find the section that's currently most visible
      let currentSection = '';
      for (const { id, element } of sectionElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          // Section is considered active if its top is in the upper half of viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = id;
            break;
          }
        }
      }

      // Fallback: if no section in middle, check which one is closest to top
      if (!currentSection) {
        let closestDistance = Infinity;
        for (const { id, element } of sectionElements) {
          if (element) {
            const rect = element.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < closestDistance && rect.bottom > 0) {
              closestDistance = distance;
              currentSection = id;
            }
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for nav height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-20 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ul className="flex items-center justify-center gap-1 py-3 overflow-x-auto">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                aria-label={`Navigate to ${section.label} section`}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan/50 ${
                  activeSection === section.id
                    ? 'text-cyan'
                    : 'text-[#64748b] hover:text-navy'
                }`}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-cyan/10 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
