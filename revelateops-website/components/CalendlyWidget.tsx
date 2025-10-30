'use client';

import { useEffect, useRef, useState } from 'react';

interface CalendlyWidgetProps {
  url?: string;
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
  onEventScheduled?: (event: { uri: string }) => void;
  onDateSelected?: () => void;
  onEventTypeViewed?: () => void;
  onProfilePageViewed?: () => void;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

export default function CalendlyWidget({
  url = 'https://calendly.com/drewlambert/15-minute-consultation',
  prefill,
  utm,
  onEventScheduled,
  onDateSelected,
  onEventTypeViewed,
  onProfilePageViewed,
}: CalendlyWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract UTM parameters from URL if not provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoUtm = {
      utmCampaign: urlParams.get('utm_campaign') || utm?.utmCampaign,
      utmSource: urlParams.get('utm_source') || utm?.utmSource,
      utmMedium: urlParams.get('utm_medium') || utm?.utmMedium,
      utmContent: urlParams.get('utm_content') || utm?.utmContent,
      utmTerm: urlParams.get('utm_term') || utm?.utmTerm,
    };

    // Store UTM in sessionStorage for tracking
    if (Object.values(autoUtm).some(Boolean)) {
      sessionStorage.setItem('calendly_utm', JSON.stringify(autoUtm));
    }
  }, [utm]);

  // Load Calendly script and stylesheet
  useEffect(() => {
    // Check if script is already loaded
    if (window.Calendly) {
      console.log('Calendly already loaded');
      setIsScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (existingScript) {
      console.log('Calendly script tag exists, waiting for load...');
      const checkCalendly = setInterval(() => {
        if (window.Calendly) {
          console.log('Calendly loaded from existing script');
          setIsScriptLoaded(true);
          clearInterval(checkCalendly);
        }
      }, 100);
      return () => clearInterval(checkCalendly);
    }

    console.log('Loading Calendly script...');

    // Load stylesheet
    const existingLink = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      console.log('Calendly script loaded successfully');
      setIsScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Calendly script:', error);
      setError('Failed to load Calendly. Please refresh the page.');
      setIsLoading(false);
    };
    document.head.appendChild(script);

    // Don't remove scripts on cleanup - they can be reused
  }, []);

  // Initialize Calendly widget
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !window.Calendly) {
      console.log('Calendly not ready:', { isScriptLoaded, hasContainer: !!containerRef.current, hasCalendly: !!window.Calendly });
      return;
    }

    console.log('Initializing Calendly with URL:', url);

    // Get UTM from sessionStorage or props
    const storedUtm = sessionStorage.getItem('calendly_utm');
    const finalUtm = storedUtm ? JSON.parse(storedUtm) : utm;

    // Initialize the inline widget
    try {
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
        prefill: prefill || {},
        utm: finalUtm || {},
      });

      console.log('Calendly widget initialized');

      // Hide loading state after a short delay to ensure widget starts rendering
      const timer = setTimeout(() => {
        console.log('Hiding loading state');
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Calendly';
      console.error('Calendly initialization error:', err);
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [isScriptLoaded, url, prefill, utm]);

  // Event listeners for Calendly events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;

      const data = e.data;

      // Hide loading state when Calendly widget is ready
      if (data.event === 'calendly.event_type_viewed' || data.event === 'calendly.profile_page_viewed') {
        setIsLoading(false);
      }

      if (data.event === 'calendly.event_scheduled') {
        onEventScheduled?.(data.payload);
        // Track with analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'calendly_event_scheduled', {
            event_category: 'booking',
            event_label: 'discovery_call',
          });
        }
      } else if (data.event === 'calendly.date_and_time_selected') {
        onDateSelected?.();
        // Track date selection
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'calendly_date_selected', {
            event_category: 'booking',
          });
        }
      } else if (data.event === 'calendly.event_type_viewed') {
        onEventTypeViewed?.();
      } else if (data.event === 'calendly.profile_page_viewed') {
        onProfilePageViewed?.();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEventScheduled, onDateSelected, onEventTypeViewed, onProfilePageViewed]);

  return (
    <div className="relative w-full">
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-xl z-10 p-8">
          <div className="text-center max-w-md">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-navy mb-2">Unable to Load Calendar</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <p className="text-xs text-gray-500">
              Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-magenta/20 border-t-magenta mb-4"></div>
            <p className="text-sm font-medium text-navy">Loading calendar...</p>
            <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}

      {/* Calendly Embed Container */}
      <div
        ref={containerRef}
        className="calendly-inline-widget"
        style={{
          minHeight: '700px',
          height: '100%',
          width: '100%',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoading || error ? 0 : 1,
        }}
      />

      {/* Custom Styling for Calendly iframe */}
      <style jsx global>{`
        .calendly-inline-widget iframe {
          border-radius: 12px;
        }

        /* Hide Calendly branding if needed (requires premium Calendly account) */
        .calendly-badge-widget {
          right: 20px !important;
          bottom: 20px !important;
        }
      `}</style>
    </div>
  );
}
