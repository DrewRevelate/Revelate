# Calendly Integration - Quick Reference

## ✅ What's Configured

### Your Calendly Information
- **Username:** `drewlambert`
- **Email:** drew@revelateops.com
- **Timezone:** America/New_York
- **Profile URL:** https://calendly.com/drewlambert

### Default Event for Booking Page
- **Name:** 15 Minute Consultation
- **Duration:** 15 minutes
- **URL:** https://calendly.com/drewlambert/15-minute-consultation

### API Status
- ✅ Personal Access Token configured
- ✅ API client working
- ✅ All endpoints tested
- ✅ Components updated with correct URLs

---

## 🎯 Available Event Types

You have **12 active event types** in your Calendly account:

| Event Name | Duration | URL Slug |
|------------|----------|----------|
| **15 Minute Consultation** | 15 min | `15-minute-consultation` |
| 15-Minute Intro Call | 15 min | `15-minute-intro-call` |
| 30 Minute Consultation | 30 min | `30-minute-consultation` |
| 30 Minute Discussion | 30 min | `30-minute-discussion` |
| 30 Minute Salesforce Training | 30 min | `salesforce-training-30-mins` |
| 45 Minute Salesforce Training | 45 min | `salesforce-training-45-min` |
| 60 Minute Consultation | 60 min | `60-minute-consultation` |
| 60 Minute Salesforce Training | 60 min | `salesforce-training-60-minutes` |
| Working Session | 45 min | `working-session` |
| 22Q - Revelate Operations | 45 min | `22q-revelate` |
| Debticate - Revelate Operations | 45 min | `debticate-revelate-operations` |
| Rockbot Working Session | 45 min | `rockbot-revelate-working-session` |

---

## 🚀 Quick Testing

### Test the Booking Page (Embed Widget)

1. **Open in browser:**
   ```
   http://localhost:3001/book
   ```

2. **Expected result:**
   - Calendar should load within 2-3 seconds
   - Shows "15 Minute Consultation" event
   - Can select dates and times
   - Can complete booking

### Test the API Endpoints

```bash
# 1. Get your user info
curl http://localhost:3001/api/calendly/user | jq

# 2. Get all event types
curl http://localhost:3001/api/calendly/event-types | jq

# 3. Get availability (next 7 days)
EVENT_URI="https://api.calendly.com/event_types/YOUR_UUID_FROM_STEP_2"
START=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
END=$(date -u -v+7d +"%Y-%m-%dT%H:%M:%SZ")

curl "http://localhost:3001/api/calendly/availability?event_type_uri=$EVENT_URI&start_time=$START&end_time=$END" | jq

# 4. Create a scheduling link
curl -X POST http://localhost:3001/api/calendly/scheduling-link \
  -H "Content-Type: application/json" \
  -d '{"event_type_uri": "YOUR_EVENT_URI"}' | jq
```

---

## 📝 Common Tasks

### Change the Default Event Type

Edit these files:

**1. components/CalendlyWidget.tsx** (line 47)
```tsx
url = 'https://calendly.com/drewlambert/YOUR-EVENT-SLUG',
```

**2. components/BookingPageClient.tsx** (line 125)
```tsx
url="https://calendly.com/drewlambert/YOUR-EVENT-SLUG"
```

**3. components/CalendlyPopupButton.tsx** (line 46)
```tsx
url = 'https://calendly.com/drewlambert/YOUR-EVENT-SLUG',
```

**4. components/CalendlyBadgeWidget.tsx** (line 29)
```tsx
url = 'https://calendly.com/drewlambert/YOUR-EVENT-SLUG',
```

Replace `YOUR-EVENT-SLUG` with one from the table above (e.g., `30-minute-consultation`).

---

### Use Different Event Types on Different Pages

**Homepage - 15 min intro:**
```tsx
<CalendlyPopupButton
  url="https://calendly.com/drewlambert/15-minute-intro-call"
  text="Quick 15-Min Chat"
/>
```

**Services Page - 30 min consultation:**
```tsx
<CalendlyPopupButton
  url="https://calendly.com/drewlambert/30-minute-consultation"
  text="Book 30-Minute Consultation"
/>
```

**Training Page - 60 min training:**
```tsx
<CalendlyPopupButton
  url="https://calendly.com/drewlambert/salesforce-training-60-minutes"
  text="Book Training Session"
/>
```

---

### Build Custom UI with API

**Example: Event Type Selector**

```tsx
// Shows all your event types and creates booking links
import { useEffect, useState } from 'react';

export default function EventSelector() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/calendly/event-types')
      .then(r => r.json())
      .then(data => setEvents(data.collection));
  }, []);

  const handleBook = async (eventUri) => {
    const res = await fetch('/api/calendly/scheduling-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type_uri: eventUri })
    });
    const { resource } = await res.json();
    window.location.href = resource.booking_url;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {events.map(event => (
        <button
          key={event.uri}
          onClick={() => handleBook(event.uri)}
          className="p-4 border rounded-lg hover:border-magenta"
        >
          <h3 className="font-bold">{event.name}</h3>
          <p className="text-sm text-gray-600">{event.duration} minutes</p>
        </button>
      ))}
    </div>
  );
}
```

See [CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md) for more examples!

---

## 🔧 Current Configuration

### Environment Variables (.env.local)
```env
# OAuth credentials (existing)
NEXT_PUBLIC_CALENDLY_CLIENT_ID=pPIkttAjyS42CBhMKcpyZWYjoigHDmpivG5_Vl33IY0
CALENDLY_CLIENT_SECRET=DKHmA1Tr-ufft6K5n5PW8C8X2XzfA-y2lhudD89x7mc
CALENDLY_SIGNING_KEY=ho7LV8OQTMfl-o8linC-flAuy-_WUWgklVcx1h7A2j0

# Personal Access Token (new - for API)
CALENDLY_API_TOKEN=eyJraWQiOi... [configured]
CALENDLY_USERNAME=drewlambert
CALENDLY_EVENT_SLUG=15-minute-consultation
```

### Components Status
- ✅ CalendlyWidget.tsx - Updated to use `drewlambert/15-minute-consultation`
- ✅ CalendlyPopupButton.tsx - Updated
- ✅ CalendlyBadgeWidget.tsx - Updated
- ✅ BookingPageClient.tsx - Updated

### API Routes Status
- ✅ GET /api/calendly/user - Working
- ✅ GET /api/calendly/event-types - Working
- ✅ GET /api/calendly/availability - Working
- ✅ POST /api/calendly/scheduling-link - Working

---

## 🎨 Integration Options

### Option 1: Embed Widget (Currently on /book page)
**Pros:**
- Already working
- No extra code needed
- Calendly manages UI

**How to use:**
```tsx
import CalendlyWidget from '@/components/CalendlyWidget';

<CalendlyWidget url="https://calendly.com/drewlambert/15-minute-consultation" />
```

### Option 2: Popup Button (Great for CTAs)
**Pros:**
- Opens in modal
- Better for hero sections
- Less page space

**How to use:**
```tsx
import CalendlyPopupButton from '@/components/CalendlyPopupButton';

<CalendlyPopupButton
  text="Schedule Discovery Call"
  url="https://calendly.com/drewlambert/15-minute-consultation"
/>
```

### Option 3: API-Based Custom UI
**Pros:**
- Full control
- Your branding
- Custom workflows

**How to use:**
See [CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md)

---

## 📊 Analytics

All integrations support:
- ✅ Google Analytics event tracking
- ✅ Google Ads conversion tracking
- ✅ Facebook Pixel tracking
- ✅ UTM parameter preservation

**Events automatically tracked:**
- `calendly_event_scheduled` - Meeting booked
- `calendly_date_selected` - Date chosen
- `calendly_popup_scheduled` - Popup booking

---

## 🐛 Troubleshooting

### Calendar Not Loading?
1. Check browser console for errors
2. Verify URL format: `https://calendly.com/drewlambert/EVENT-SLUG`
3. Ensure event is active in Calendly dashboard
4. Try clearing browser cache

### API Endpoint Returns Error?
1. Check `.env.local` has `CALENDLY_API_TOKEN`
2. Restart dev server after adding token
3. Verify token hasn't expired
4. Check Calendly service status

### Want to Change Event Type?
1. Pick slug from table above
2. Update component URLs
3. Refresh browser

---

## 📚 Documentation

- **[CALENDLY_README.md](./CALENDLY_README.md)** - Complete overview
- **[CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md)** - API setup guide
- **[CALENDLY_API_EXAMPLES.md](./CALENDLY_API_EXAMPLES.md)** - Code examples
- **[CALENDLY_INTEGRATION.md](./CALENDLY_INTEGRATION.md)** - Embed widget docs

---

## ✅ You're All Set!

Your Calendly integration is **100% configured and working**:

1. ✅ API token configured
2. ✅ Correct username and URLs
3. ✅ All components updated
4. ✅ All endpoints tested
5. ✅ Ready for production

**Next steps:**
1. Visit http://localhost:3001/book to test
2. Try booking a meeting
3. Check your Calendly dashboard
4. Deploy to production!

**Questions?** Check the documentation files above or test the API endpoints!
