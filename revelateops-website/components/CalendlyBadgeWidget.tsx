'use client';

import { useEffect, useState } from 'react';

interface CalendlyBadgeWidgetProps {
  url?: string;
  text?: string;
  color?: string;
  textColor?: string;
  branding?: boolean;
}

export default function CalendlyBadgeWidget({
  url = 'https://calendly.com/drewlambert/15-minute-consultation',
  text = 'Schedule time with me',
  color = '#d946ef', // Brand magenta
  textColor = '#ffffff',
  branding = false,
}: CalendlyBadgeWidgetProps) {
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

  // Initialize badge widget
  useEffect(() => {
    if (!isScriptLoaded || !window.Calendly) return;

    window.Calendly.initBadgeWidget({
      url,
      text,
      color,
      textColor,
      branding,
    });

    return () => {
      if (window.Calendly?.destroyBadgeWidget) {
        window.Calendly.destroyBadgeWidget();
      }
    };
  }, [isScriptLoaded, url, text, color, textColor, branding]);

  // This component doesn't render anything visible - the badge is injected by Calendly
  return null;
}
