/**
 * Calendly Widget Type Definitions
 * Comprehensive type definitions for all Calendly widget methods
 */

declare global {
  interface Window {
    Calendly?: {
      // Inline Widget (embedded)
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;

      // Popup Widget
      initPopupWidget: (options: {
        url: string;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
      showPopupWidget: (url: string) => void;

      // Badge Widget (floating button)
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding: boolean;
      }) => void;
      destroyBadgeWidget: () => void;
    };
  }
}

export {};
