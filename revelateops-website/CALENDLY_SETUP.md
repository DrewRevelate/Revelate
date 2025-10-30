# Calendly Setup Instructions

## 🚨 IMPORTANT: Update Your Calendly URL

The Calendly integration requires a **complete event URL**, not just your username.

### ❌ Wrong Format
```
https://calendly.com/drew-revelateops
```

### ✅ Correct Format
```
https://calendly.com/drew-revelateops/15min
https://calendly.com/drew-revelateops/discovery-call
https://calendly.com/drew-revelateops/30min-consultation
```

---

## How to Find Your Calendly Event URL

### Step 1: Log into Calendly
Go to [calendly.com](https://calendly.com) and sign in.

### Step 2: Go to Event Types
Click on "Event Types" in the left sidebar.

### Step 3: Copy Your Event Link
1. Find the event you want to use (e.g., "15 Minute Meeting")
2. Click the "Copy Link" button
3. This is your full event URL!

Example: `https://calendly.com/your-username/15min`

### Step 4: Update the Code

Replace the URL in these files:

#### File 1: `components/CalendlyWidget.tsx`
```tsx
// Line 47
url = 'https://calendly.com/YOUR-USERNAME/YOUR-EVENT-SLUG',
```

#### File 2: `components/BookingPageClient.tsx`
```tsx
// Line 125
url="https://calendly.com/YOUR-USERNAME/YOUR-EVENT-SLUG"
```

#### File 3: `components/CalendlyPopupButton.tsx`
```tsx
// Line 33 (if created)
url = 'https://calendly.com/YOUR-USERNAME/YOUR-EVENT-SLUG',
```

#### File 4: `components/CalendlyBadgeWidget.tsx`
```tsx
// Line 30 (if created)
url = 'https://calendly.com/YOUR-USERNAME/YOUR-EVENT-SLUG',
```

---

## Testing Your Integration

### Step 1: Start Dev Server
```bash
cd revelateops-website
npm run dev
```

### Step 2: Open Browser
Navigate to: `http://localhost:3001/book`

### Step 3: Check Console
Open browser DevTools (F12) and look for these console logs:
- ✅ "Calendly not ready: { isScriptLoaded: true, hasContainer: true, hasCalendly: true }"
- ✅ "Initializing Calendly with URL: https://calendly.com/..."
- ✅ "Calendly widget initialized"
- ✅ "Hiding loading state"

### Step 4: Verify Calendar Appears
The calendar should load within 2-3 seconds. If it's still loading:
1. Check the URL format is correct
2. Verify the event exists in your Calendly account
3. Check browser console for errors

---

## Troubleshooting

### Issue: Calendar never loads (stuck on "Loading calendar...")

**Solution 1: Check URL Format**
- URL must include the event type slug
- Format: `https://calendly.com/username/event-slug`
- NOT: `https://calendly.com/username`

**Solution 2: Verify Event is Active**
1. Log into Calendly
2. Go to Event Types
3. Ensure the event is not paused or deleted

**Solution 3: Check Console Errors**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. If you see CORS errors, check your Calendly embed settings

### Issue: "Unable to Load Calendar" error appears

**Solution:**
1. Check browser console for specific error message
2. Verify Calendly URL is accessible in a new tab
3. Clear browser cache and reload
4. Check if Calendly service is operational

### Issue: Calendar loads but looks unstyled

**Solution:**
1. Ensure stylesheet is loading (check Network tab)
2. Check for CSS conflicts with existing styles
3. Verify `widget.css` is loaded from Calendly CDN

---

## Common Event URL Patterns

Calendly automatically creates event URLs based on your event name:

| Event Name | URL Slug |
|------------|----------|
| 15 Minute Meeting | `/15min` |
| 30 Minute Meeting | `/30min` |
| Discovery Call | `/discovery-call` |
| Free Consultation | `/free-consultation` |
| Coffee Chat | `/coffee-chat` |

You can also customize the URL slug in Calendly settings.

---

## Quick Fix Commands

If you know your Calendly username and event slug, run these commands:

```bash
# Replace in all files at once (Mac/Linux)
cd revelateops-website
find components -type f -name "Calendly*.tsx" -exec sed -i '' 's|drew-revelateops/15min|YOUR-USERNAME/YOUR-EVENT-SLUG|g' {} +

# Replace in all files at once (Windows PowerShell)
cd revelateops-website
Get-ChildItem -Path components -Filter "Calendly*.tsx" -Recurse | ForEach-Object { (Get-Content $_.FullName) -replace 'drew-revelateops/15min', 'YOUR-USERNAME/YOUR-EVENT-SLUG' | Set-Content $_.FullName }
```

Replace `YOUR-USERNAME/YOUR-EVENT-SLUG` with your actual values.

---

## Verification Checklist

- [ ] Found your Calendly event URL
- [ ] Updated `CalendlyWidget.tsx`
- [ ] Updated `BookingPageClient.tsx`
- [ ] Updated `CalendlyPopupButton.tsx` (if using)
- [ ] Updated `CalendlyBadgeWidget.tsx` (if using)
- [ ] Started dev server
- [ ] Opened `/book` page
- [ ] Calendar loads successfully
- [ ] Can select a date
- [ ] Can select a time
- [ ] Form appears correctly
- [ ] Can complete a test booking

---

## Next Steps

Once the calendar is loading:
1. Test the full booking flow
2. Schedule a test meeting
3. Verify email confirmation arrives
4. Check analytics tracking (if configured)
5. Test on mobile devices
6. Deploy to production

---

## Support

If you're still having issues:
1. Check the [Calendly Integration documentation](./CALENDLY_INTEGRATION.md)
2. Review [Calendly's help center](https://help.calendly.com)
3. Check browser console for specific error messages
4. Verify Calendly account is active and event is published

---

**TIP:** You can test if your URL works by pasting it directly in your browser. If it loads the Calendly booking page, it's the correct format!
