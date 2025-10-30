# Contact Form with Slack Integration

A fully functional contact form that sends submissions **directly to you as private DMs in Slack** using the Slack API. Each submission is completely private - users cannot see each other's messages.

## What Was Implemented

### 1. API Route: `/api/contact`
**Location**: [app/api/contact/route.ts](app/api/contact/route.ts)

- Handles POST requests from the contact form
- Validates required fields (name, email, phone, message)
- Formats messages with Slack Block Kit for rich formatting
- Sends messages as **direct messages to you** via `chat.postMessage` API
- Returns appropriate success/error responses

### 2. Contact Form Component
**Location**: [components/ContactForm.tsx](components/ContactForm.tsx)

Features:
- Required fields: Name, Email, Phone, Message
- Optional fields: Company
- Real-time form validation
- Loading states during submission
- Success/error message display
- Responsive design matching brand styles
- Accessibility-compliant form elements

### 3. Contact Page
**Location**: [app/contact/page.tsx](app/contact/page.tsx)

A dedicated contact page featuring:
- Contact form integration
- Multiple contact options (Call, Email, LinkedIn)
- "What to Expect" section
- Consistent brand styling with animations
- Responsive design

### 4. Navigation Integration
The contact page has been added to the main navigation menu in [components/Navigation.tsx](components/Navigation.tsx:12).

## Configuration Required

### Environment Variables

Add these to your `.env.local` file:

```env
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here
SLACK_USER_ID=U1234567890
```

### Setup Steps

Follow the complete setup guide in [SLACK_SETUP.md](SLACK_SETUP.md):

1. Create a Slack App
2. Add required OAuth scopes (`chat:write`)
3. Install app to your workspace
4. Get your Bot User OAuth Token
5. Add the bot to your desired channel
6. Configure environment variables
7. Test the integration

## Usage

### Using the Contact Form Component

The component can be used anywhere in your app:

```tsx
import ContactForm from '@/components/ContactForm';

export default function MyPage() {
  return (
    <div>
      <ContactForm />
    </div>
  );
}
```

### Testing Locally

1. Complete the Slack setup (see [SLACK_SETUP.md](SLACK_SETUP.md))
2. Add environment variables to `.env.local`
3. Restart your development server:
   ```bash
   npm run dev
   ```
4. Navigate to `/contact` or any page with the form
5. Submit a test message
6. Check your Slack channel

## Message Format in Slack

Messages appear **as direct messages to you** in Slack with:

```
📬 New Contact Form Message

Name: John Doe        Email: john@example.com
Phone: +1 555-0100    Company: Acme Corp

Message:
Hi, I'd like to discuss your services...

Submitted via contact form • Oct 29, 2025, 3:45 PM
```

- Clean, structured layout using Slack Block Kit
- All required fields clearly labeled (name, email, phone)
- Optional company field only shown if provided
- Clickable email addresses
- Timestamp of submission
- **Privacy:** Each submission is a separate private DM - users cannot see each other's messages

## Security Considerations

✅ **Implemented:**
- Server-side validation of required fields
- Environment variables for sensitive tokens
- Error handling without exposing internal details
- HTTPS for API communication

⚠️ **Recommended Additions:**
- Rate limiting to prevent abuse
- CAPTCHA or honeypot fields for bot protection
- Email validation beyond HTML5
- Content sanitization

## API Details

### Endpoint
```
POST /api/contact
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-0100",       // REQUIRED
  "company": "Acme Corp",       // optional
  "message": "Your message here"
}
```

### Success Response
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

## Rate Limits

Slack API limits:
- 1 message per second to a specific channel
- Several hundred messages per minute workspace-wide
- Burst behavior supported

This is sufficient for a contact form.

## Troubleshooting

### "Slack integration not configured"
- Verify `SLACK_BOT_TOKEN` and `SLACK_USER_ID` are in `.env.local`
- Restart your development server

### Messages not appearing in your Slack DMs
- Check the bot has `chat:write` scope
- Verify your User ID is correct (should start with `U`)
- Check your Slack **direct messages** (not channels)
- Check server logs for API errors

### Form submission errors
- Open browser console for client-side errors
- Check server logs for API route errors
- Verify all required fields are filled

## Production Deployment

### Vercel (Recommended)

1. Go to Project Settings → Environment Variables
2. Add:
   - `SLACK_BOT_TOKEN`
   - `SLACK_USER_ID`
3. Redeploy your application

### Other Platforms

Add the environment variables according to your platform's documentation. Ensure they're available to the Edge Runtime.

## File Structure

```
revelateops-website/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # API endpoint
│   └── contact/
│       └── page.tsx               # Contact page
├── components/
│   ├── ContactForm.tsx            # Form component
│   └── Navigation.tsx             # Updated with contact link
├── .env.local                     # Environment variables (not committed)
├── .env.example                   # Template for env vars
├── SLACK_SETUP.md                 # Detailed setup guide
└── CONTACT_FORM_README.md         # This file
```

## Further Customization

### Change Message Format

Edit [app/api/contact/route.ts](app/api/contact/route.ts:36-75) to modify the Slack message blocks.

### Add More Form Fields

1. Update the `ContactFormData` interface in [app/api/contact/route.ts](app/api/contact/route.ts:7-12)
2. Add fields to [components/ContactForm.tsx](components/ContactForm.tsx)
3. Update the Slack message blocks to include new fields

### Style Customization

The form uses Tailwind CSS classes matching your brand:
- Colors: `magenta`, `navy`, `navy-dark`
- Border radius: `rounded-lg` (12px max per brand guidelines)
- Transitions: 200ms duration

## Resources

- [Slack API Documentation](https://api.slack.com/docs)
- [chat.postMessage Reference](https://api.slack.com/methods/chat.postMessage)
- [Block Kit Builder](https://app.slack.com/block-kit-builder) - Design custom messages
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
