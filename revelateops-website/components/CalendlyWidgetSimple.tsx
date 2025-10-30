'use client';

import { useState } from 'react';

interface CalendlyWidgetSimpleProps {
  url?: string;
}

export default function CalendlyWidgetSimple({
  url = 'https://calendly.com/drewlambert/15-minute-consultation',
}: CalendlyWidgetSimpleProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const embedUrl = `${url}?embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&embed_type=Inline`;

  return (
    <div className="relative w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-magenta/20 border-t-magenta mb-4"></div>
            <p className="text-sm font-medium text-navy">Loading calendar...</p>
          </div>
        </div>
      )}

      {/* Calendly Iframe Embed */}
      <iframe
        src={embedUrl}
        width="100%"
        height="700"
        frameBorder="0"
        onLoad={handleLoad}
        title="Schedule a meeting"
        style={{
          minHeight: '700px',
          borderRadius: '12px',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}
