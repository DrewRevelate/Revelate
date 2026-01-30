'use client';

import { useState, useEffect } from 'react';
import CalendlyWidgetSimple from './CalendlyWidgetSimple';

// Extend Window interface for analytics tracking
interface WindowWithAnalytics extends Window {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
}

declare const window: WindowWithAnalytics;

export default function BookingPageClient() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      // Auto-hide success message after 10 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowConfetti(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleEventScheduled = (event: { uri: string }) => {
    setShowSuccess(true);
    setShowConfetti(true);

    // Track with analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
        event_category: 'booking',
        event_label: 'discovery_call_scheduled',
      });
    }

    // Track with Facebook Pixel if available
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Schedule', {
        content_name: 'Discovery Call',
        content_category: 'Booking',
      });
    }
  };

  return (
    <>
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="relative overflow-hidden rounded-xl border border-cyan/40 bg-white/95 backdrop-blur-xl shadow-[0_12px_24px_rgba(0,217,255,0.3)] max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-magenta/10" />
            <div className="relative p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10 flex-shrink-0">
                  <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-heading text-lg font-bold text-navy mb-1">
                    You&apos;re All Set! 🎉
                  </h4>
                  <p className="text-sm text-[#334155] leading-relaxed mb-3">
                    Your discovery call is confirmed. Check your email for the calendar invite and meeting link.
                  </p>
                  <div className="space-y-2 text-xs text-[#64748b]">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan">→</span>
                      <span>Calendar invite sent to your email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan">→</span>
                      <span>You&apos;ll receive a reminder 24 hours before</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan">→</span>
                      <span>Meeting link included in the invite</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setShowConfetti(false);
                  }}
                  className="text-[#64748b] hover:text-navy transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                width: '10px',
                height: '10px',
                backgroundColor: i % 2 === 0 ? '#00d9ff' : '#d946ef',
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Booking Widget */}
      <div className="relative overflow-hidden rounded-xl border border-[#dbe3f0] bg-white shadow-[0_6px_12px_rgba(17,27,58,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,217,255,0.06)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />
        <div className="relative">
          <CalendlyWidgetSimple url="https://calendly.com/drewlambert/15-minute-consultation" />
        </div>
      </div>

      <p className="text-center text-white/70 text-sm mt-4">
        All times shown in your local timezone
      </p>

      {/* Confetti Animation CSS */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        @keyframes slide-in-from-top {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .animate-in {
          animation: slide-in-from-top 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
