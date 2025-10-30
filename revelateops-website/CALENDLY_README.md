# Calendly Integration - Complete Guide

This repository now includes **two powerful ways** to integrate Calendly into your website:

1. **🎨 Embed Widgets** - Quick setup, Calendly-hosted UI
2. **⚙️ API Integration** - Full control, custom UI, programmatic scheduling

---

## 📦 What's Included

### Embed Widget Components

Located in `components/`:
- `CalendlyWidget.tsx` - Inline calendar embed
- `CalendlyPopupButton.tsx` - Popup button trigger
- `CalendlyBadgeWidget.tsx` - Floating sticky button
- `BookingPageClient.tsx` - Enhanced booking with success animations

**Pros:**
- ✅ Quick to implement (5 minutes)
- ✅ No API token needed
- ✅ Works on free Calendly plans
- ✅ Calendly maintains the UI
- ✅ Automatic updates

**Cons:**
- ❌ Limited customization
- ❌ Calendly branding visible
- ❌ Can't programmatically schedule
- ❌ No server-side data access

### API Integration

Located in `lib/` and `app/api/calendly/`:
- `lib/calendly-api.ts` - API client
- `app/api/calendly/user/route.ts` - User endpoint
- `app/api/calendly/event-types/route.ts` - Event types endpoint
- `app/api/calendly/availability/route.ts` - Availability endpoint
- `app/api/calendly/scheduling-link/route.ts` - Scheduling link creation

**Pros:**
- ✅ Full UI/UX control
- ✅ Custom branding
- ✅ Server-side data access
- ✅ Programmatic scheduling
- ✅ Advanced workflows

**Cons:**
- ❌ **Requires paid Calendly plan**
- ❌ More complex setup
- ❌ Need to manage API token
- ❌ More code to maintain

---

## 🚀 Quick Start Guide

### Option 1: Embed Widgets (Easiest)

**1. Update Calendly URL**

Find your Calendly event URL:
1. Log into [calendly.com](https://calendly.com)
2. Go to Event Types
3. Copy link for desired event (e.g., `https://calendly.com/drew-revelateops/15min`)

**2. Update Components**

Search for `drew-revelateops/15min` and replace with your URL in:
- `components/CalendlyWidget.tsx`
- `components/CalendlyPopupButton.tsx`
- `components/CalendlyBadgeWidget.tsx`
- `components/BookingPageClient.tsx`

**3. Use in Your App**

```tsx
import CalendlyWidget from '@/components/CalendlyWidget';

<CalendlyWidget url="https://calendly.com/YOUR-USERNAME/YOUR-EVENT" />
```

**Done!** See [CALENDLY_INTEGRATION.md](./CALENDLY_INTEGRATION.md) for full docs.

---

### Option 2: API Integration (Advanced)

**Requirements:**
- ✅ Paid Calendly plan (Professional or higher)
- ✅ Personal Access Token

**1. Get API Token**

1. Visit https://calendly.com/integrations/api_webhooks
2. Generate Personal Access Token
3. Copy token (shown once!)

**2. Configure Environment**

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
CALENDLY_API_TOKEN=your_token_here
CALENDLY_USERNAME=your-username
CALENDLY_EVENT_SLUG=15min
```

**3. Test API**

```bash
npm run dev

# Test in browser
open http://localhost:3001/api/calendly/user
```

**4. Build Custom UI**

See [CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md) for code examples.

**Full Setup:** [CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md)

---

## 📊 Comparison Table

| Feature | Embed Widgets | API Integration |
|---------|---------------|-----------------|
| **Setup Time** | 5 minutes | 30-60 minutes |
| **Calendly Plan** | Free or Paid | **Paid only** |
| **API Token** | Not needed | Required |
| **UI Customization** | Limited | Complete |
| **Branding** | Calendly logo | Your brand |
| **Programmatic Booking** | ❌ | ✅ |
| **Server-side Access** | ❌ | ✅ |
| **Availability API** | ❌ | ✅ |
| **Custom Workflows** | ❌ | ✅ |
| **Maintenance** | Low | Medium |

---

## 📁 File Structure

```
revelateops-website/
├── components/
│   ├── CalendlyWidget.tsx           # Inline embed
│   ├── CalendlyPopupButton.tsx      # Popup button
│   ├── CalendlyBadgeWidget.tsx      # Floating badge
│   └── BookingPageClient.tsx        # Booking page wrapper
├── lib/
│   └── calendly-api.ts              # API client
├── app/
│   ├── api/calendly/
│   │   ├── user/route.ts            # User endpoint
│   │   ├── event-types/route.ts     # Event types endpoint
│   │   ├── availability/route.ts    # Availability endpoint
│   │   └── scheduling-link/route.ts # Scheduling link endpoint
│   └── book/page.tsx                # Booking page
├── docs/
│   ├── CALENDLY_INTEGRATION.md      # Embed widget docs
│   ├── CALENDLY_API_SETUP.md        # API setup guide
│   ├── CALENDLY_API_EXAMPLES.md     # Code examples
│   ├── CALENDLY_SETUP.md            # Quick setup
│   ├── BOOKING_PAGE_IMPROVEMENTS.md # Summary of improvements
│   └── QUICK_START_EXAMPLES.md      # Embed examples
└── .env.local.example               # Environment template
```

---

## 🎯 Use Cases

### Use Embed Widgets When:
- You want quick implementation
- You're on a free Calendly plan
- You're okay with Calendly branding
- You don't need programmatic access
- You want Calendly to maintain the UI

### Use API Integration When:
- You need full UI customization
- You want your own branding
- You need to schedule programmatically
- You want server-side data access
- You're building AI agents or automation
- You need custom booking workflows

---

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

### Test Embed Widget

1. Visit: http://localhost:3001/book
2. Calendar should load
3. Try booking a meeting

### Test API

```bash
# Test user endpoint
curl http://localhost:3001/api/calendly/user

# Test event types
curl http://localhost:3001/api/calendly/event-types

# Test availability
curl "http://localhost:3001/api/calendly/availability?event_type_uri=YOUR_URI&start_time=2025-01-30T00:00:00Z&end_time=2025-02-06T23:59:59Z"
```

---

## 📚 Documentation Index

### For Embed Widgets:
1. **[CALENDLY_INTEGRATION.md](./CALENDLY_INTEGRATION.md)** - Complete embed widget documentation
2. **[QUICK_START_EXAMPLES.md](./QUICK_START_EXAMPLES.md)** - Copy-paste embed examples
3. **[CALENDLY_SETUP.md](./CALENDLY_SETUP.md)** - Quick setup for embed
4. **[BOOKING_PAGE_IMPROVEMENTS.md](./BOOKING_PAGE_IMPROVEMENTS.md)** - What changed on booking page

### For API Integration:
1. **[CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md)** - Complete API setup guide
2. **[CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md)** - Code examples and patterns

---

## 🔐 Security Notes

### Embed Widgets
- No sensitive data exposed
- Safe to use on client-side
- No authentication needed

### API Integration
- **NEVER expose API token to client**
- Token should only be in `.env.local` (server-side)
- Don't commit `.env.local` to Git
- Use environment variables for production
- Rotate tokens periodically

**Good:**
```typescript
// Server-side API route
export async function GET() {
  const api = getCalendlyAPI(); // Uses process.env.CALENDLY_API_TOKEN
  return NextResponse.json(await api.getCurrentUser());
}
```

**Bad:**
```typescript
// ❌ NEVER DO THIS
export async function GET() {
  return NextResponse.json({ token: process.env.CALENDLY_API_TOKEN });
}
```

---

## 🐛 Troubleshooting

### Embed Widget Issues

**Problem:** Calendar stuck on "Loading calendar..."

**Solutions:**
1. Check URL format: `https://calendly.com/username/event-slug`
2. Verify event exists and is active in Calendly
3. Clear browser cache
4. Check browser console for errors

See: [CALENDLY_SETUP.md](./CALENDLY_SETUP.md#troubleshooting)

### API Issues

**Problem:** "CALENDLY_API_TOKEN environment variable is not set"

**Solutions:**
1. Create `.env.local` file
2. Add `CALENDLY_API_TOKEN=your_token`
3. Restart dev server

**Problem:** "Calendly API error (401): Unauthorized"

**Solutions:**
1. Verify token is correct
2. Check token hasn't been deleted
3. Confirm you have paid Calendly plan

See: [CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md#troubleshooting)

---

## 🚢 Deployment

### Environment Variables

Add to your hosting platform:

```env
CALENDLY_API_TOKEN=your_token_here
CALENDLY_USERNAME=your-username
CALENDLY_EVENT_SLUG=15min
```

**Vercel:**
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add variables
4. Redeploy

**Netlify:**
1. Go to Site Settings
2. Navigate to Environment
3. Add variables
4. Redeploy

### Pre-deployment Checklist

- [ ] Update all Calendly URLs to your username/event
- [ ] Add API token to production environment (if using API)
- [ ] Test booking flow end-to-end
- [ ] Verify analytics tracking (if configured)
- [ ] Test on mobile devices
- [ ] Check all CTAs work
- [ ] Confirm email notifications arrive

---

## 📈 Analytics

Both integrations support analytics tracking:

### Google Analytics

```javascript
// Automatically tracked by CalendlyWidget
gtag('event', 'calendly_event_scheduled', {
  event_category: 'booking',
  event_label: 'discovery_call'
});
```

### Google Ads Conversion

```javascript
// Configure in BookingPageClient.tsx
gtag('event', 'conversion', {
  send_to: 'AW-YOUR_CONVERSION_ID/LABEL'
});
```

### Facebook Pixel

```javascript
// Automatically tracked
fbq('track', 'Schedule', {
  content_name: 'Discovery Call'
});
```

---

## 🎨 Customization

### Embed Widget Styling

```tsx
<CalendlyWidget
  url="https://calendly.com/your-event"
  // Prefill form data
  prefill={{
    name: "John Doe",
    email: "john@example.com"
  }}
  // UTM tracking
  utm={{
    utmSource: "website",
    utmMedium: "organic",
    utmCampaign: "homepage"
  }}
  // Event callbacks
  onEventScheduled={(event) => {
    console.log('Booked!', event);
    // Custom logic here
  }}
/>
```

### API Custom UI

See [CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md) for:
- Custom calendar components
- Event type selectors
- Availability displays
- Personalized booking buttons
- Analytics integration

---

## 🆘 Getting Help

### Documentation
- **Embed Widgets**: [CALENDLY_INTEGRATION.md](./CALENDLY_INTEGRATION.md)
- **API Integration**: [CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md)
- **Code Examples**: [CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md)

### Official Resources
- **Calendly Help Center**: https://help.calendly.com
- **API Documentation**: https://developer.calendly.com/api-docs
- **Developer Portal**: https://developer.calendly.com
- **Status Page**: https://status.calendly.com

### Community
- **Calendly Community**: https://community.calendly.com
- **API & Webhook Help**: https://community.calendly.com/api-webhook-help-61

---

## 📝 Summary

You now have **two complete Calendly integrations** to choose from:

### 🎨 Embed Widgets
- **Best for:** Quick setup, free plans, simple use cases
- **Time to implement:** 5 minutes
- **Documentation:** [CALENDLY_INTEGRATION.md](./CALENDLY_INTEGRATION.md)

### ⚙️ API Integration
- **Best for:** Custom UI, advanced features, programmatic booking
- **Time to implement:** 30-60 minutes
- **Documentation:** [CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md)

**Both are production-ready!** Choose based on your needs and budget.

---

**Questions?** Check the documentation or test the endpoints yourself!

**Ready to deploy?** Follow the deployment checklist above.

**Happy scheduling!** 🎉
