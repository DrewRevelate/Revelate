# Calendly API Integration Setup Guide

This guide will help you set up the Calendly API integration for complete control over the booking experience.

---

## 🎯 Benefits of API Integration

**vs. Embed Widget:**
- ✅ Full UI/UX control
- ✅ Custom branding
- ✅ Server-side data access
- ✅ Programmatic scheduling
- ✅ Advanced analytics
- ✅ Custom workflows

**Trade-offs:**
- ❌ More complex setup
- ❌ Requires Calendly paid plan
- ❌ Need to manage API token
- ❌ More code to maintain

---

## 📋 Prerequisites

### 1. Calendly Account Requirements
- ✅ Active Calendly account
- ✅ **Professional plan or higher** (required for API access)
- ✅ At least one active event type

### 2. Development Environment
- ✅ Node.js 18+ installed
- ✅ Next.js project setup
- ✅ Environment variables configured

---

## 🔑 Step 1: Get Your Personal Access Token

### A. Navigate to API & Webhooks

1. Log into [Calendly](https://calendly.com)
2. Click your profile picture → **Account**
3. Go to **Integrations** → **API & Webhooks**
4. Or visit directly: https://calendly.com/integrations/api_webhooks

### B. Generate Token

1. Scroll to **Personal Access Tokens** section
2. Click **"Get a token now"** (or **"Generate new token"** if you have existing tokens)
3. Enter a descriptive name: `revelateops-website-production`
4. Click **Create Token**
5. **⚠️ IMPORTANT**: Copy the token immediately!
   - Calendly will NOT show it again
   - Store it securely

### C. Store Token Securely

**Never commit tokens to Git!**

```bash
# Add to .gitignore (should already be there)
.env.local
.env*.local
```

---

## 🛠️ Step 2: Configure Environment Variables

### A. Create .env.local

```bash
cd revelateops-website
cp .env.local.example .env.local
```

### B. Edit .env.local

```env
# Calendly API Configuration
CALENDLY_API_TOKEN=your_actual_token_here_eyJraWQiOiIxY2UxZTEzNjE3ZGNm...

# Your Calendly username (from your Calendly URL)
CALENDLY_USERNAME=drew-revelateops

# Your preferred event type slug
CALENDLY_EVENT_SLUG=15min
```

**How to find your values:**

| Variable | Where to Find It | Example |
|----------|------------------|---------|
| `CALENDLY_API_TOKEN` | From Step 1 above | `eyJraWQiOiIxY2UxZTEz...` |
| `CALENDLY_USERNAME` | Your Calendly URL: `calendly.com/USERNAME` | `drew-revelateops` |
| `CALENDLY_EVENT_SLUG` | Event URL: `calendly.com/user/EVENT_SLUG` | `15min` |

---

## 🧪 Step 3: Test the API Connection

### A. Start Dev Server

```bash
npm run dev
```

### B. Test User Endpoint

Open your browser or use curl:

```bash
# Browser
http://localhost:3001/api/calendly/user

# Or with curl
curl http://localhost:3001/api/calendly/user
```

**Expected Response:**
```json
{
  "resource": {
    "uri": "https://api.calendly.com/users/XXXXXXXX",
    "name": "Drew Lambert",
    "slug": "drew-revelateops",
    "email": "drew@revelateops.com",
    "scheduling_url": "https://calendly.com/drew-revelateops",
    "timezone": "America/New_York",
    ...
  }
}
```

**If you get an error:**
- Check token is correct in `.env.local`
- Verify token has not expired
- Confirm you have a paid Calendly plan

### C. Test Event Types Endpoint

```bash
curl http://localhost:3001/api/calendly/event-types
```

**Expected Response:**
```json
{
  "collection": [
    {
      "uri": "https://api.calendly.com/event_types/XXXXXXXX",
      "name": "15 Minute Meeting",
      "slug": "15min",
      "scheduling_url": "https://calendly.com/drew-revelateops/15min",
      "duration": 15,
      "active": true,
      ...
    }
  ]
}
```

### D. Test Availability Endpoint

```bash
curl "http://localhost:3001/api/calendly/availability?event_type_uri=https://api.calendly.com/event_types/YOUR_EVENT_UUID&start_time=2025-01-30T00:00:00Z&end_time=2025-02-06T23:59:59Z"
```

**Expected Response:**
```json
{
  "collection": [
    {
      "start_time": "2025-01-30T14:00:00Z",
      "invitees_remaining": 1,
      "status": "available"
    },
    {
      "start_time": "2025-01-30T14:30:00Z",
      "invitees_remaining": 1,
      "status": "available"
    },
    ...
  ]
}
```

---

## 🏗️ Step 4: Architecture Overview

### API Routes Created

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/calendly/user` | GET | Get current user info |
| `/api/calendly/event-types` | GET | List active event types |
| `/api/calendly/availability` | GET | Get available time slots |
| `/api/calendly/scheduling-link` | POST | Create single-use booking link |

### File Structure

```
revelateops-website/
├── lib/
│   └── calendly-api.ts          # Calendly API client
├── app/api/calendly/
│   ├── user/route.ts            # User endpoint
│   ├── event-types/route.ts     # Event types endpoint
│   ├── availability/route.ts    # Availability endpoint
│   └── scheduling-link/route.ts # Scheduling link endpoint
├── components/
│   └── (custom booking UI - coming soon)
└── .env.local                    # Your API token (gitignored)
```

---

## 🎨 Step 5: Build Custom Booking UI (Next Steps)

With the API infrastructure in place, you can now:

### Option A: Use Scheduling Links
Simplest approach - generate single-use Calendly links via API:

```typescript
// Frontend code
const response = await fetch('/api/calendly/scheduling-link', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_type_uri: 'https://api.calendly.com/event_types/YOUR_UUID'
  })
});

const { resource } = await response.json();
// Redirect to resource.booking_url
window.location.href = resource.booking_url;
```

### Option B: Build Fully Custom UI
Full control - fetch availability and build your own calendar:

```typescript
// 1. Get event types
const eventTypes = await fetch('/api/calendly/event-types').then(r => r.json());

// 2. Get availability for a date range
const availability = await fetch(
  `/api/calendly/availability?` +
  `event_type_uri=${eventTypeUri}&` +
  `start_time=2025-01-30T00:00:00Z&` +
  `end_time=2025-02-06T23:59:59Z`
).then(r => r.json());

// 3. Display in custom calendar UI
// 4. User selects time
// 5. Create scheduling link for that specific time
// 6. Redirect to Calendly to complete booking
```

### Option C: Hybrid Approach (Recommended)
- Use Calendly embed for actual booking
- Use API to pre-select date/time
- Best of both worlds!

---

## 🔐 Security Best Practices

### 1. Environment Variables
```bash
# ✅ GOOD - Server-side only
# In .env.local
CALENDLY_API_TOKEN=eyJraWQiOiIxY2UxZTEz...

# ❌ BAD - Never expose to client
# Don't use NEXT_PUBLIC_ prefix for secrets!
```

### 2. API Routes
```typescript
// ✅ GOOD - Token only on server
export async function GET() {
  const api = getCalendlyAPI(); // Uses process.env.CALENDLY_API_TOKEN
  ...
}

// ❌ BAD - Never send token to client
export async function GET() {
  return NextResponse.json({ token: process.env.CALENDLY_API_TOKEN });
}
```

### 3. Rate Limiting
Calendly API has rate limits. Consider implementing:
- Caching responses
- Request throttling
- Error retry logic

---

## 📊 API Endpoints Reference

### GET /api/calendly/user

**Response:**
```typescript
{
  resource: {
    uri: string;
    name: string;
    slug: string;
    email: string;
    scheduling_url: string;
    timezone: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
  }
}
```

### GET /api/calendly/event-types

**Response:**
```typescript
{
  collection: Array<{
    uri: string;
    name: string;
    slug: string;
    scheduling_url: string;
    duration: number;
    kind: string;
    active: boolean;
    booking_method: string;
    color: string;
    created_at: string;
    updated_at: string;
  }>;
  pagination: {
    count: number;
    next_page: string | null;
  };
}
```

### GET /api/calendly/availability

**Query Parameters:**
- `event_type_uri` (required): Full URI of event type
- `start_time` (required): ISO 8601 datetime
- `end_time` (required): ISO 8601 datetime

**Response:**
```typescript
{
  collection: Array<{
    start_time: string; // ISO 8601
    invitees_remaining: number;
    status: 'available';
  }>;
}
```

### POST /api/calendly/scheduling-link

**Request Body:**
```json
{
  "event_type_uri": "https://api.calendly.com/event_types/XXXXXXXX"
}
```

**Response:**
```typescript
{
  resource: {
    booking_url: string; // Calendly URL to redirect user to
    owner: string;
    owner_type: 'EventType';
    created_at: string;
  };
}
```

---

## 🐛 Troubleshooting

### Error: "CALENDLY_API_TOKEN environment variable is not set"

**Solution:**
1. Ensure `.env.local` exists
2. Verify token is set correctly (no quotes needed)
3. Restart dev server after changing `.env.local`

```bash
# Restart server
# Press Ctrl+C to stop, then:
npm run dev
```

### Error: "Calendly API error (401): Unauthorized"

**Causes:**
- Token is incorrect or expired
- Token was deleted from Calendly dashboard
- You don't have a paid Calendly plan

**Solution:**
1. Generate a new token (Step 1)
2. Update `.env.local` with new token
3. Restart dev server

### Error: "Calendly API error (403): Forbidden"

**Cause:** You're on a free Calendly plan

**Solution:** Upgrade to Professional, Standard, Teams, or Enterprise plan

### Error: "Calendly API error (404): Not Found"

**Cause:** Event type UUID is incorrect or event is inactive

**Solution:**
1. Check event types: `curl http://localhost:3001/api/calendly/event-types`
2. Copy correct URI from response
3. Ensure event is active in Calendly dashboard

### Error: "Failed to fetch" from browser

**Cause:** Dev server not running or wrong port

**Solution:**
```bash
# Check if server is running
lsof -i :3001

# Start server if not running
npm run dev
```

---

## 🚀 Next Steps

### Immediate
- [ ] Get Calendly Personal Access Token
- [ ] Add token to `.env.local`
- [ ] Test all API endpoints
- [ ] Verify responses are correct

### Short-term
- [ ] Decide on UI approach (Links vs Custom vs Hybrid)
- [ ] Build booking component
- [ ] Test full booking flow
- [ ] Add error handling

### Long-term
- [ ] Add caching for API responses
- [ ] Implement webhook listeners
- [ ] Add booking confirmation emails
- [ ] Track analytics

---

## 📚 Resources

- **Calendly API Docs**: https://developer.calendly.com/api-docs
- **Getting Started Guide**: https://developer.calendly.com/getting-started
- **API Use Cases**: https://developer.calendly.com/api-use-cases
- **Rate Limits**: https://developer.calendly.com/frequently-asked-questions

---

## 🆘 Need Help?

If you run into issues:

1. **Check the console** for detailed error messages
2. **Verify token** is active in Calendly dashboard
3. **Test endpoints** individually to isolate issue
4. **Review Calendly docs** for API changes
5. **Check Calendly status**: https://status.calendly.com

---

**Status**: ✅ API Infrastructure Complete

**What's Working**:
- ✅ API client created
- ✅ Four API routes implemented
- ✅ Environment variable setup
- ✅ Error handling
- ✅ TypeScript types

**What's Next**:
- Build custom booking UI component
- Integrate with booking page
- Add loading states and animations
- Test full user flow

---

*For the original embed-based integration, see [CALENDLY_INTEGRATION.md](./CALENDLY_INTEGRATION.md)*
