/**
 * Analytics tracking utility for conversion events
 * Supports Google Analytics 4 and can be extended for other providers
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type ConversionEvent =
  | 'quiz_started'
  | 'quiz_completed'
  | 'package_selected'
  | 'custom_package_requested'
  | 'discovery_call_booked'
  | 'contact_form_submitted'
  | 'chat_opened'
  | 'phone_clicked'
  | 'email_clicked'
  | 'service_viewed'
  | 'pricing_viewed'
  | 'cta_clicked';

interface EventProperties {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track a conversion event with Google Analytics
 */
export function trackEvent(
  eventName: ConversionEvent,
  properties?: EventProperties
): void {
  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: properties?.event_category || 'conversion',
        event_label: properties?.event_label,
        value: properties?.value,
        ...properties,
      });

      console.log(`[Analytics] Tracked: ${eventName}`, properties);
    } else {
      console.warn(
        '[Analytics] Google Analytics not loaded. Event not tracked:',
        eventName
      );
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

/**
 * Track quiz events
 */
export const quiz = {
  started: () => {
    trackEvent('quiz_started', {
      event_category: 'engagement',
      event_label: 'fit_assessment_quiz',
    });
  },

  completed: (recommendedPackage: string) => {
    trackEvent('quiz_completed', {
      event_category: 'lead_generation',
      event_label: recommendedPackage,
      value: 50, // Lead score value
    });
  },
};

/**
 * Track package/service selection events
 */
export const packages = {
  viewed: (packageName: string) => {
    trackEvent('service_viewed', {
      event_category: 'engagement',
      event_label: packageName,
    });
  },

  selected: (packageName: string, value?: number) => {
    trackEvent('package_selected', {
      event_category: 'conversion',
      event_label: packageName,
      value: value || 100, // Lead score value
    });
  },

  customRequested: (details?: string) => {
    trackEvent('custom_package_requested', {
      event_category: 'high_intent',
      event_label: details || 'custom_consultation',
      value: 150, // High-value lead
    });
  },
};

/**
 * Track booking events
 */
export const booking = {
  started: (source: string) => {
    trackEvent('cta_clicked', {
      event_category: 'engagement',
      event_label: `book_call_${source}`,
    });
  },

  completed: (source: string) => {
    trackEvent('discovery_call_booked', {
      event_category: 'conversion',
      event_label: source,
      value: 200, // Highest value conversion
    });
  },

  dateSelected: () => {
    trackEvent('cta_clicked', {
      event_category: 'engagement',
      event_label: 'date_selected',
    });
  },
};

/**
 * Track contact/communication events
 */
export const contact = {
  formSubmitted: (formType: string) => {
    trackEvent('contact_form_submitted', {
      event_category: 'lead_generation',
      event_label: formType,
      value: 75,
    });
  },

  chatOpened: () => {
    trackEvent('chat_opened', {
      event_category: 'engagement',
      event_label: 'chat_widget',
    });
  },

  phoneClicked: () => {
    trackEvent('phone_clicked', {
      event_category: 'high_intent',
      event_label: 'phone_number',
      value: 100,
    });
  },

  emailClicked: () => {
    trackEvent('email_clicked', {
      event_category: 'engagement',
      event_label: 'email_address',
    });
  },
};

/**
 * Track page-specific engagement
 */
export const engagement = {
  pricingViewed: () => {
    trackEvent('pricing_viewed', {
      event_category: 'engagement',
      event_label: 'services_page',
    });
  },

  ctaClicked: (ctaLocation: string) => {
    trackEvent('cta_clicked', {
      event_category: 'engagement',
      event_label: ctaLocation,
    });
  },
};

/**
 * Lead scoring values for reference:
 * - Quiz completed: 50 points
 * - Contact form: 75 points
 * - Package selected: 100 points
 * - Phone clicked: 100 points
 * - Custom package: 150 points
 * - Discovery call booked: 200 points
 */

export const analytics = {
  trackEvent,
  quiz,
  packages,
  booking,
  contact,
  engagement,
};

export default analytics;
