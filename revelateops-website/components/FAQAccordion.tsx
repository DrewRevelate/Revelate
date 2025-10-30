'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  showSearch?: boolean;
}

export default function FAQAccordion({ items, className = '', showSearch = true }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const questionMatch = item.question.toLowerCase().includes(query);
      const answerMatch = typeof item.answer === 'string'
        ? item.answer.toLowerCase().includes(query)
        : false;
      return questionMatch || answerMatch;
    });
  }, [items, searchQuery]);

  return (
    <div className={className}>
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full rounded-xl border border-[#dbe3f0] bg-white px-5 py-3.5 pl-12 text-sm text-navy placeholder:text-[#94a3b8] shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan"
              aria-label="Search frequently asked questions"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-navy transition-colors"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-xs text-[#64748b]">
              {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-sm font-medium text-navy">No FAQs found</p>
          <p className="mt-1 text-xs text-[#64748b]">Try adjusting your search terms</p>
        </div>
      ) : (
        <dl className="space-y-4">
      {filteredItems.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#dbe3f0] bg-[#f8fafc] shadow-[0_6px_12px_rgba(17,27,58,0.12)] overflow-hidden transition-shadow duration-200 hover:shadow-[0_8px_16px_rgba(17,27,58,0.16)]"
        >
          <dt>
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors duration-200 hover:bg-[#f1f5f9]"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.05em] text-navy">
                {item.question}
              </span>
              <motion.svg
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="h-5 w-5 flex-shrink-0 text-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
          </dt>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.dd
                id={`faq-answer-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0 text-sm leading-7 text-[#334155]">
                  {item.answer}
                </div>
              </motion.dd>
            )}
          </AnimatePresence>
        </div>
      ))}
    </dl>
      )}
    </div>
  );
}
