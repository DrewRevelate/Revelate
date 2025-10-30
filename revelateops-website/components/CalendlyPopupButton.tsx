'use client';

import { useEffect, useState } from 'react';

interface CalendlyPopupButtonProps {
  url?: string;
  text?: string;
  prefill?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    customAnswers?: {
      a1?: string;
      a2?: string;
      a3?: string;
      a4?: string;
      a5?: string;
    };
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  className?: string;
  onEventScheduled?: (event: { uri: string }) => void;
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

export default function CalendlyPopupButton({
  url = 'https://calendly.com/drewlambert/15-minute-consultation',
  text = 'Schedule a Call',
  prefill,
  utm,
  className,
  onEventScheduled,
}: CalendlyPopupButtonProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Calendly script and stylesheet
  useEffect(() => {
    // Check if script is already loaded
    if (window.Calendly) {
      setIsScriptLoaded(true);
      return;
    }

    // Load stylesheet
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // Event listener for scheduled events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;

      if (e.data.event === 'calendly.event_scheduled') {
        onEventScheduled?.(e.data.payload);

        // Track with analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'calendly_popup_scheduled', {
            event_category: 'booking',
            event_label: 'popup_button',
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEventScheduled]);

  const handleClick = () => {
    if (!isScriptLoaded || !window.Calendly) {
      console.warn('Calendly script not loaded yet');
      return;
    }

    // Extract UTM from URL if not provided
    const urlParams = new URLSearchParams(window.location.search);
    const autoUtm = {
      utmCampaign: urlParams.get('utm_campaign') || utm?.utmCampaign,
      utmSource: urlParams.get('utm_source') || utm?.utmSource,
      utmMedium: urlParams.get('utm_medium') || utm?.utmMedium,
      utmContent: urlParams.get('utm_content') || utm?.utmContent,
      utmTerm: urlParams.get('utm_term') || utm?.utmTerm,
    };

    window.Calendly.initPopupWidget({
      url,
      prefill: prefill || {},
      utm: Object.values(autoUtm).some(Boolean) ? autoUtm : (utm || {}),
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isScriptLoaded}
      className={
        className ||
        'inline-flex items-center gap-2 rounded-xl bg-magenta px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#c235d9] hover:shadow-[0_6px_12px_rgba(217,70,239,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
      }
    >
      {!isScriptLoaded ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
          Loading...
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {text}
        </>
      )}
    </button>
  );
}
