# Calendly Integration - Quick Start Examples

Quick copy-paste examples for implementing Calendly across your site.

---

## Example 1: Hero Section CTA

Replace static booking links in your hero section:

```tsx
// app/page.tsx or any page component
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Fix Your Salesforce Challenges</h1>
      <p>No pressure, no sales pitch—just honest solutions.</p>

      {/* Replace this: */}
      {/* <a href="/book">Schedule a Call</a> */}

      {/* With this: */}
      <CalendlyPopupButton
        text="Schedule Free Discovery Call"
        className="inline-flex items-center gap-2 rounded-xl bg-magenta px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#c235d9] hover:shadow-[0_6px_12px_rgba(217,70,239,0.4)] hover:-translate-y-0.5"
      />
    </section>
  );
}
```

---

## Example 2: Service Page with Prefill

Pre-fill the form with service-specific information:

```tsx
// app/services/salesforce-audit/page.tsx
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function SalesforceAuditPage() {
  return (
    <div>
      <h1>Salesforce Health Audit</h1>
      <p>Get a comprehensive review of your Salesforce org...</p>

      <CalendlyPopupButton
        text="Book Your Audit Call"
        prefill={{
          customAnswers: {
            a1: "Salesforce Health Audit", // Service interested in
          }
        }}
        utm={{
          utmSource: "website",
          utmMedium: "service_page",
          utmCampaign: "salesforce_audit"
        }}
        onEventScheduled={(event) => {
          // Redirect to service-specific thank you page
          window.location.href = '/thank-you/audit';
        }}
      />
    </div>
  );
}
```

---

## Example 3: Floating Badge on All Pages

Add to your root layout for site-wide access:

```tsx
// app/layout.tsx
import CalendlyBadgeWidget from '@/components/CalendlyBadgeWidget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Floating badge appears on all pages */}
        <CalendlyBadgeWidget
          text="💬 Schedule a call"
          color="#d946ef"
          textColor="#ffffff"
        />
      </body>
    </html>
  );
}
```

---

## Example 4: Navigation Menu CTA

Add booking CTA to your navigation:

```tsx
// components/Navigation.tsx
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>

        {/* CTA in navigation */}
        <li>
          <CalendlyPopupButton
            text="Book Call"
            className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-sm font-semibold text-navy hover:bg-cyan/80 transition-all"
          />
        </li>
      </ul>
    </nav>
  );
}
```

---

## Example 5: Footer Quick Action

Add to footer for easy access:

```tsx
// components/Footer.tsx
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Ready to Get Started?</h3>
          <p>Schedule a free 15-minute discovery call</p>

          <CalendlyPopupButton
            text="Schedule Now"
            onEventScheduled={() => {
              // Track footer conversion
              if (window.gtag) {
                gtag('event', 'conversion_footer', {
                  event_category: 'booking',
                  event_label: 'footer_cta'
                });
              }
            }}
          />
        </div>

        {/* Rest of footer */}
      </div>
    </footer>
  );
}
```

---

## Example 6: Blog Post CTA

Add contextual booking CTAs in blog posts:

```tsx
// app/blog/[slug]/page.tsx
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function BlogPost() {
  return (
    <article>
      <h1>5 Signs Your Salesforce Org Needs Help</h1>

      <p>Content about Salesforce challenges...</p>

      {/* Inline CTA in content */}
      <div className="cta-box">
        <h3>Sound Familiar?</h3>
        <p>Let's discuss how to fix these issues in your org.</p>

        <CalendlyPopupButton
          text="Schedule Free Consultation"
          prefill={{
            customAnswers: {
              a1: "Read blog post: 5 Signs Your Salesforce Org Needs Help"
            }
          }}
          utm={{
            utmSource: "blog",
            utmMedium: "inline_cta",
            utmContent: "5-signs-salesforce-help"
          }}
        />
      </div>

      <p>More content...</p>
    </article>
  );
}
```

---

## Example 7: Campaign Landing Page with Tracking

Full tracking for marketing campaigns:

```tsx
// app/landing/salesforce-rescue/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import CalendlyWidget from '@/components/CalendlyWidget';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // From campaign
  const company = searchParams.get('company'); // From campaign

  return (
    <div className="landing-page">
      <h1>Rescue Your Salesforce Org</h1>

      {/* Inline widget with prefill from URL params */}
      <CalendlyWidget
        prefill={{
          email: email || undefined,
          customAnswers: {
            a1: company || undefined,
            a2: "Salesforce Rescue Campaign"
          }
        }}
        onEventScheduled={(event) => {
          // Track campaign conversion
          if (window.gtag) {
            gtag('event', 'conversion', {
              send_to: 'AW-CONVERSION_ID/CAMPAIGN_LABEL',
              value: 500,
              currency: 'USD'
            });
          }

          // Redirect to custom thank you page
          setTimeout(() => {
            window.location.href = '/thank-you/campaign';
          }, 3000);
        }}
      />
    </div>
  );
}
```

---

## Example 8: Exit Intent Popup

Show booking popup when user is about to leave:

```tsx
// components/ExitIntentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function ExitIntentModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showModal) {
        setShowModal(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md">
        <h2>Wait! Before You Go...</h2>
        <p>Schedule a free 15-minute call to discuss your Salesforce challenges.</p>

        <CalendlyPopupButton
          text="Yes, Let's Talk"
          onEventScheduled={() => setShowModal(false)}
        />

        <button
          onClick={() => setShowModal(false)}
          className="mt-4 text-sm text-gray-500"
        >
          No thanks, I'll figure it out myself
        </button>
      </div>
    </div>
  );
}
```

---

## Example 9: Mobile App Bar

Sticky CTA for mobile users:

```tsx
// components/MobileBookingBar.tsx
'use client';

import { useState, useEffect } from 'react';
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

export default function MobileBookingBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <CalendlyPopupButton
        text="📅 Schedule Free Call"
        className="w-full rounded-xl bg-magenta px-6 py-4 text-base font-semibold text-white"
      />
    </div>
  );
}
```

---

## Example 10: Email Signature Link

For email signatures, use a direct Calendly link:

```html
<!-- Email Signature HTML -->
<a href="https://calendly.com/drew-revelateops?utm_source=email&utm_medium=signature"
   style="display: inline-block; background: #d946ef; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600;">
  📅 Schedule Time With Me
</a>
```

---

## Testing Your Implementation

After implementing any example above:

1. **Click the button/link** - Verify Calendly opens
2. **Check prefill data** - Ensure form fields are pre-populated
3. **Complete a test booking** - Book a fake meeting
4. **Verify email received** - Check for calendar invite
5. **Check analytics** - Verify events fire in GA/GTM
6. **Test on mobile** - Ensure responsive design works
7. **Verify UTM tracking** - Check Calendly webhook data

---

## Pro Tips

### 1. Use Different UTM Tags
Track which CTAs convert best:

```tsx
// Homepage hero
utm={{ utmSource: "website", utmContent: "hero_cta" }}

// Blog post
utm={{ utmSource: "blog", utmContent: "inline_cta" }}

// Footer
utm={{ utmSource: "website", utmContent: "footer_cta" }}
```

### 2. Prefill Custom Questions
Reduce friction by pre-answering questions:

```tsx
prefill={{
  customAnswers: {
    a1: "Current Salesforce Edition: Enterprise",
    a2: "Number of users: 100-500",
    a3: "Primary challenge: Data quality"
  }
}}
```

### 3. Custom Success Actions
Take action after booking:

```tsx
onEventScheduled={(event) => {
  // 1. Track conversion
  gtag('event', 'conversion', {...});

  // 2. Show custom thank you message
  showThankYouModal();

  // 3. Redirect to next step
  setTimeout(() => {
    window.location.href = '/onboarding';
  }, 3000);

  // 4. Trigger email sequence
  fetch('/api/trigger-welcome-email', {
    method: 'POST',
    body: JSON.stringify({ eventUri: event.uri })
  });
}}
```

### 4. A/B Test Button Text
Try different CTAs:

```tsx
// Option A: Direct
<CalendlyPopupButton text="Book Now" />

// Option B: Benefit-focused
<CalendlyPopupButton text="Get Free Consultation" />

// Option C: Curiosity-driven
<CalendlyPopupButton text="See If We're a Fit" />

// Option D: Action-oriented
<CalendlyPopupButton text="Schedule Discovery Call" />
```

---

## Common Patterns

### Pattern: Service-Specific Booking
```tsx
// Different URLs for different services
<CalendlyPopupButton
  url={`https://calendly.com/drew-revelateops/${serviceSlug}`}
  text={`Book ${serviceName} Call`}
/>
```

### Pattern: Conditional Rendering
```tsx
// Only show after user scrolls
{scrolled && <CalendlyPopupButton text="Ready to Talk?" />}

// Only show to first-time visitors
{!hasVisitedBefore && <CalendlyBadgeWidget />}

// Only show on mobile
{isMobile && <MobileBookingBar />}
```

### Pattern: Multi-Step Form
```tsx
// After user completes a form
<form onSubmit={(e) => {
  e.preventDefault();
  // Process form...

  // Then show Calendly with prefilled data
  showCalendly({
    prefill: {
      name: formData.name,
      email: formData.email,
      customAnswers: {
        a1: formData.company,
        a2: formData.challenge
      }
    }
  });
}}>
```

---

Need more examples? Check the [full documentation](./CALENDLY_INTEGRATION.md).
