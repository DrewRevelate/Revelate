'use client';

import { useEffect } from 'react';

interface CalcomEmbedSimpleProps {
  calLink?: string; // e.g., "revelate-ops/consultation"

  // Layout options: 'month_view' | 'week_view' | 'column_view'
  layout?: 'month_view' | 'week_view' | 'column_view';

  // Theme: 'light' | 'dark' | 'auto'
  theme?: 'light' | 'dark' | 'auto';

  // Primary brand color (hex without #, e.g., 'd946ef')
  primaryColor?: string;

  // Hide event type details (title, description, duration)
  hideEventTypeDetails?: boolean;

  // Custom height
  height?: string;
}

export default function CalcomEmbedSimple({
  calLink = 'revelate-ops/consultation',
  layout = 'month_view',
  theme = 'light',
  primaryColor = 'd946ef', // Magenta brand color
  hideEventTypeDetails = false,
  height = '700px'
}: CalcomEmbedSimpleProps) {
  useEffect(() => {
    // Load Cal.com embed script only once
    if (typeof window !== 'undefined' && !(window as any).Cal) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Build config object
  const config = {
    layout,
    theme,
    styles: {
      branding: {
        brandColor: `#${primaryColor}`
      }
    }
  };

  if (hideEventTypeDetails) {
    (config as any).hideEventTypeDetails = true;
  }

  return (
    <div className="relative w-full" style={{ minHeight: height }}>
      {/* Cal.com Inline Embed */}
      <div
        data-cal-namespace=""
        data-cal-link={calLink}
        data-cal-config={JSON.stringify(config)}
        style={{ width: '100%', height: height }}
      />
    </div>
  );
}
