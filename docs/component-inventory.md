# Component Inventory - Revelate Website

## Overview
21 React/TypeScript components built with Next.js 16, Material-UI, and Tailwind CSS.

---

## Layout Components

### Navigation.tsx
**Purpose:** Main site navigation bar
**Size:** 8.8 KB
**Dependencies:** Next.js Link, Material-UI
**Key Features:**
- Responsive mobile/desktop navigation
- Sticky positioning
- Active route highlighting
- Mobile hamburger menu

### Footer.tsx
**Purpose:** Site footer with links and branding
**Size:** 3.0 KB
**Type:** Static layout component

### StickyNav.tsx
**Purpose:** Alternative sticky navigation implementation
**Size:** 3.9 KB
**Features:** Scroll-aware sticky behavior

### BetaBanner.tsx
**Purpose:** Beta/announcement banner
**Size:** 473 B
**Type:** Informational banner component

---

## Hero & Landing Components

### Hero.tsx
**Purpose:** Homepage hero section
**Size:** 12.0 KB
**Dependencies:** Framer Motion
**Features:**
- Animated hero section
- Founder portrait integration
- Brand-compliant styling
- Call-to-action buttons

---

## Booking & Scheduling Components

### Calendly Integration (5 Components)

#### CalendlyWidget.tsx
**Purpose:** Full Calendly embed widget
**Size:** 8.7 KB
**Type:** Complete Calendly scheduling interface
**Features:**
- Widget script loading
- Brand color integration (magenta #d946ef, navy #1a1f3a)
- Proper cleanup on unmount
- Dynamic styling

#### CalendlyPopupButton.tsx
**Purpose:** Button that opens Calendly in popup
**Size:** 4.2 KB
**Features:**
- On-click popup trigger
- Prefill data support
- UTM tracking

#### CalendlyEmbed.tsx
**Purpose:** Simple inline Calendly embed
**Size:** 1.1 KB
**Type:** Lightweight embed component

#### CalendlyBadgeWidget.tsx
**Purpose:** Floating Calendly badge
**Size:** 1.9 KB
**Type:** Sticky badge widget

#### CalendlyWidgetSimple.tsx
**Purpose:** Simplified Calendly widget
**Size:** 1.5 KB
**Type:** Minimal implementation

### Cal.com Integration (2 Components)

#### CalcomBooking.tsx
**Purpose:** Cal.com booking interface
**Size:** 11.3 KB
**Features:**
- Custom booking flow
- API integration with `/api/calcom/availability`
- Availability display
- Time slot selection

#### CalcomEmbedSimple.tsx
**Purpose:** Simple Cal.com embed
**Size:** 1.7 KB
**Type:** Lightweight embed

### Custom Booking Components

#### CustomBooking.tsx
**Purpose:** Custom-built booking interface
**Size:** 14.8 KB
**Features:**
- Custom UI/UX for bookings
- Multi-step booking flow
- Form validation
- Date/time selection

#### BookingPageClient.tsx
**Purpose:** Client-side booking page logic
**Size:** 6.2 KB
**Type:** Page-level booking coordinator

#### FloatingBookingButton.tsx
**Purpose:** Floating action button for booking
**Size:** 43.9 KB (⚠️ Largest component)
**Features:**
- Sticky floating button
- Multi-state button behavior
- Mobile optimization
- Integration with multiple booking systems

---

## Contact & Communication Components

### ContactForm.tsx
**Purpose:** Main contact form
**Size:** 6.6 KB
**Features:**
- Form validation
- API integration (`/api/contact`)
- Success/error handling
- Database conversation creation

### Chat Components (3 Components)

#### ChatWidget.tsx
**Purpose:** Chat widget interface
**Size:** 6.5 KB
**Features:**
- Real-time messaging UI
- Message history
- Typing indicators
- Auto-scroll

#### ContactChat.tsx
**Purpose:** Contact-initiated chat
**Size:** 8.9 KB
**Features:**
- Post-contact-form chat
- Conversation threading
- Message persistence
- Slack integration backend

#### FloatingChat.tsx
**Purpose:** Floating chat button/widget
**Size:** 2.6 KB
**Type:** Sticky chat launcher

---

## Interactive UI Components

### FAQAccordion.tsx
**Purpose:** FAQ section with accordion
**Size:** 5.6 KB
**Dependencies:** Material-UI Accordion
**Features:**
- Expandable/collapsible FAQ items
- Smooth animations
- Keyboard accessible

### UserInfoModal.tsx
**Purpose:** User information modal dialog
**Size:** 14.4 KB
**Dependencies:** Material-UI Modal/Dialog
**Features:**
- Form capture modal
- User data collection
- Validation
- Multi-step flow

---

## Component Architecture Patterns

### State Management
**Pattern:** React hooks (useState, useEffect, useCallback)
**No Global State:** Components are self-contained or prop-drilled
**External State:** API calls for data fetching

### Styling Approach
1. **Tailwind CSS** - Utility classes for layout and custom styling
2. **Material-UI** - Pre-built components (Accordion, Modal, Icons)
3. **Emotion** - Styled components via MUI
4. **Framer Motion** - Animations (Hero, transitions)

### API Integration Pattern
Components use Next.js API routes for backend calls:
```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### Component Categories by Function

| Category | Components | Count |
|----------|-----------|-------|
| **Layout** | Navigation, Footer, StickyNav, BetaBanner | 4 |
| **Hero/Landing** | Hero | 1 |
| **Booking (Calendly)** | 5 Calendly variants | 5 |
| **Booking (Cal.com)** | 2 Cal.com components | 2 |
| **Booking (Custom)** | CustomBooking, BookingPageClient, FloatingBookingButton | 3 |
| **Contact/Chat** | ContactForm, ChatWidget, ContactChat, FloatingChat | 4 |
| **Interactive UI** | FAQAccordion, UserInfoModal | 2 |

---

## Component Dependencies Map

### External Libraries Used
- **Next.js** - All components (Link, Image, routing)
- **React** - All components (hooks, JSX)
- **Material-UI** - Navigation, FAQAccordion, UserInfoModal
- **Framer Motion** - Hero (animations)
- **Lucide React** - Icon components (inferred from dependencies)
- **Calendly** - Calendly components (widget.js, widget.css)
- **Cal.com** - Cal.com embed scripts

### Internal Dependencies
- `@/lib/calendly-api` - Calendly API client
- `@/lib/db/conversations` - Database operations
- API routes in `/app/api/*`

---

## Component Size Analysis

### Largest Components (Potential Refactoring Candidates)
1. **FloatingBookingButton.tsx** - 43.9 KB ⚠️
2. **UserInfoModal.tsx** - 14.4 KB
3. **CustomBooking.tsx** - 14.8 KB
4. **Hero.tsx** - 12.0 KB
5. **CalcomBooking.tsx** - 11.3 KB

### Smallest Components
1. **BetaBanner.tsx** - 473 B
2. **CalendlyEmbed.tsx** - 1.1 KB
3. **CalendlyWidgetSimple.tsx** - 1.5 KB

---

## Accessibility Considerations

### Components with A11y Features
- **FAQAccordion** - Keyboard navigation via MUI
- **UserInfoModal** - Focus trap, ARIA labels via MUI
- **Navigation** - Semantic nav element, keyboard accessible

### Components Needing A11y Audit
- Custom booking flows
- Chat widgets
- Floating buttons

---

## Mobile Responsiveness

### Mobile-Optimized Components
- Navigation (hamburger menu)
- FloatingBookingButton (mobile-specific behavior)
- Hero (responsive layout)
- All forms (responsive inputs)

---

## Performance Notes

### Code Splitting
- All components use ES modules
- Next.js automatically code-splits by route
- Dynamic imports recommended for:
  - CalendlyWidget (heavy external script)
  - CalcomBooking (API-dependent)
  - ChatWidget (not needed on initial load)

### Script Loading
- **Calendly:** Loads external widget.js and widget.css
- **Cal.com:** May load embed scripts

### Optimization Opportunities
1. Lazy load booking components
2. Split FloatingBookingButton into smaller components
3. Implement React.memo for static components
4. Use Next.js Image for hero portraits

---

*Last Updated: 2025-10-30*
*Total Components: 21*
*Scan Level: Deep*
