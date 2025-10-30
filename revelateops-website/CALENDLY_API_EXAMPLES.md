# Calendly API Usage Examples

Practical examples for using the Calendly API in your Next.js application.

---

## Quick Start

### Test the API (Browser Console)

Open your booking page and run in the console:

```javascript
// 1. Get your Calendly user info
fetch('/api/calendly/user')
  .then(r => r.json())
  .then(console.log);

// 2. Get your event types
fetch('/api/calendly/event-types')
  .then(r => r.json())
  .then(console.log);

// 3. Get availability for next 7 days
const eventTypeUri = 'YOUR_EVENT_TYPE_URI_FROM_STEP_2';
const start = new Date().toISOString();
const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

fetch(`/api/calendly/availability?event_type_uri=${eventTypeUri}&start_time=${start}&end_time=${end}`)
  .then(r => r.json())
  .then(console.log);
```

---

## Example 1: Simple "Book Now" Button

Creates a single-use Calendly link and redirects user:

```tsx
// components/SimpleBookButton.tsx
'use client';

import { useState } from 'react';

export default function SimpleBookButton() {
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);

    try {
      // Get event types
      const eventTypesRes = await fetch('/api/calendly/event-types');
      const { collection } = await eventTypesRes.json();

      // Use first active event type
      const eventType = collection[0];

      // Create single-use scheduling link
      const linkRes = await fetch('/api/calendly/scheduling-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type_uri: eventType.uri
        })
      });

      const { resource } = await linkRes.json();

      // Redirect to Calendly
      window.location.href = resource.booking_url;
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking link. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBook}
      disabled={loading}
      className="rounded-xl bg-magenta px-8 py-4 text-white font-semibold hover:bg-[#c235d9] disabled:opacity-50"
    >
      {loading ? 'Creating link...' : 'Book Discovery Call'}
    </button>
  );
}
```

---

## Example 2: Display Event Types

Show available meeting types for user to choose from:

```tsx
// components/EventTypeSelector.tsx
'use client';

import { useState, useEffect } from 'react';

interface EventType {
  uri: string;
  name: string;
  slug: string;
  duration: number;
  scheduling_url: string;
  description: { content: string } | null;
}

export default function EventTypeSelector() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendly/event-types')
      .then(r => r.json())
      .then(data => {
        setEventTypes(data.collection);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching event types:', err);
        setLoading(false);
      });
  }, []);

  const handleSelect = async (eventType: EventType) => {
    try {
      const res = await fetch('/api/calendly/scheduling-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type_uri: eventType.uri })
      });

      const { resource } = await res.json();
      window.location.href = resource.booking_url;
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading meeting types...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {eventTypes.map(type => (
        <button
          key={type.uri}
          onClick={() => handleSelect(type)}
          className="p-6 border border-gray-200 rounded-xl hover:border-magenta hover:shadow-lg transition-all text-left"
        >
          <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{type.duration} minutes</p>
          {type.description && (
            <p className="text-sm text-gray-500">{type.description.content}</p>
          )}
        </button>
      ))}
    </div>
  );
}
```

---

## Example 3: Show Next Available Times

Display upcoming available slots:

```tsx
// components/NextAvailableTimes.tsx
'use client';

import { useState, useEffect } from 'react';

interface TimeSlot {
  start_time: string;
  invitees_remaining: number;
  status: string;
}

export default function NextAvailableTimes({ eventTypeUri }: { eventTypeUri: string }) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 30); // Next 30 days

      const params = new URLSearchParams({
        event_type_uri: eventTypeUri,
        start_time: start.toISOString(),
        end_time: end.toISOString()
      });

      try {
        const res = await fetch(`/api/calendly/availability?${params}`);
        const data = await res.json();
        setSlots(data.collection.slice(0, 5)); // Show first 5 slots
        setLoading(false);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [eventTypeUri]);

  if (loading) {
    return <div className="text-sm text-gray-500">Checking availability...</div>;
  }

  if (slots.length === 0) {
    return <div className="text-sm text-gray-500">No slots available in the next 30 days</div>;
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-gray-700">Next Available Times:</h4>
      <ul className="space-y-1">
        {slots.map((slot, idx) => (
          <li key={idx} className="text-sm text-gray-600">
            {new Date(slot.start_time).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Example 4: Custom Date Picker with Availability

Build a custom calendar showing only available dates:

```tsx
// components/CustomCalendar.tsx
'use client';

import { useState, useEffect } from 'react';

interface AvailabilityMap {
  [date: string]: string[]; // date -> array of available times
}

export default function CustomCalendar({ eventTypeUri }: { eventTypeUri: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMonthAvailability();
  }, [currentMonth, eventTypeUri]);

  const loadMonthAvailability = async () => {
    setLoading(true);

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const params = new URLSearchParams({
      event_type_uri: eventTypeUri,
      start_time: startOfMonth.toISOString(),
      end_time: endOfMonth.toISOString()
    });

    try {
      const res = await fetch(`/api/calendly/availability?${params}`);
      const data = await res.json();

      // Group times by date
      const map: AvailabilityMap = {};
      data.collection.forEach((slot: any) => {
        const date = new Date(slot.start_time).toISOString().split('T')[0];
        if (!map[date]) map[date] = [];
        map[date].push(slot.start_time);
      });

      setAvailability(map);
      setLoading(false);
    } catch (error) {
      console.error('Error loading availability:', error);
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Pad start
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleDateClick = async (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const times = availability[dateKey];

    if (!times || times.length === 0) {
      alert('No availability on this date');
      return;
    }

    // Create booking link for this date (simplified)
    const res = await fetch('/api/calendly/scheduling-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type_uri: eventTypeUri })
    });

    const { resource } = await res.json();
    window.location.href = resource.booking_url;
  };

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {getDaysInMonth().map((date, idx) => {
          if (!date) {
            return <div key={idx} />;
          }

          const dateKey = date.toISOString().split('T')[0];
          const hasAvailability = availability[dateKey]?.length > 0;
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <button
              key={idx}
              onClick={() => !isPast && hasAvailability && handleDateClick(date)}
              disabled={isPast || !hasAvailability || loading}
              className={`
                aspect-square p-2 rounded-lg text-sm
                ${hasAvailability && !isPast ? 'bg-cyan/10 hover:bg-cyan/20 text-navy font-semibold' : ''}
                ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!hasAvailability && !isPast ? 'text-gray-400' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Loading availability...
        </div>
      )}
    </div>
  );
}
```

---

## Example 5: Pre-fill User Information

Pass known user data to Calendly:

```tsx
// components/PersonalizedBookButton.tsx
'use client';

import { useState } from 'react';

interface UserInfo {
  name: string;
  email: string;
  company?: string;
}

export default function PersonalizedBookButton({ user }: { user: UserInfo }) {
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);

    try {
      const eventTypesRes = await fetch('/api/calendly/event-types');
      const { collection } = await eventTypesRes.json();

      const linkRes = await fetch('/api/calendly/scheduling-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type_uri: collection[0].uri
        })
      });

      const { resource } = await linkRes.json();

      // Add pre-fill parameters to URL
      const url = new URL(resource.booking_url);
      url.searchParams.set('name', user.name);
      url.searchParams.set('email', user.email);
      if (user.company) {
        url.searchParams.set('a1', user.company); // Custom answer 1
      }

      window.location.href = url.toString();
    } catch (error) {
      console.error('Booking error:', error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBook}
      disabled={loading}
      className="rounded-xl bg-magenta px-8 py-4 text-white font-semibold"
    >
      {loading ? 'Creating your personalized link...' : `Book as ${user.name}`}
    </button>
  );
}
```

---

## Example 6: Track Booking Analytics

Log booking events to your analytics:

```tsx
// components/AnalyticsBookButton.tsx
'use client';

import { useState } from 'react';

export default function AnalyticsBookButton() {
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    // Track booking start
    if (window.gtag) {
      window.gtag('event', 'booking_started', {
        event_category: 'engagement',
        event_label: 'discovery_call'
      });
    }

    setLoading(true);

    try {
      const eventTypesRes = await fetch('/api/calendly/event-types');
      const { collection } = await eventTypesRes.json();
      const eventType = collection[0];

      // Track event type selection
      if (window.gtag) {
        window.gtag('event', 'event_type_selected', {
          event_category: 'booking',
          event_label: eventType.name,
          value: eventType.duration
        });
      }

      const linkRes = await fetch('/api/calendly/scheduling-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type_uri: eventType.uri })
      });

      const { resource } = await linkRes.json();

      // Track link creation success
      if (window.gtag) {
        window.gtag('event', 'scheduling_link_created', {
          event_category: 'booking',
          event_label: 'success'
        });
      }

      // Store booking start time to measure conversion later
      sessionStorage.setItem('booking_started_at', new Date().toISOString());

      window.location.href = resource.booking_url;
    } catch (error) {
      console.error('Booking error:', error);

      // Track error
      if (window.gtag) {
        window.gtag('event', 'booking_error', {
          event_category: 'error',
          event_label: error instanceof Error ? error.message : 'unknown_error'
        });
      }

      setLoading(false);
    }
  };

  return (
    <button onClick={handleBook} disabled={loading}>
      Book Discovery Call
    </button>
  );
}
```

---

## Using in Your App

### Add to Homepage

```tsx
// app/page.tsx
import SimpleBookButton from '@/components/SimpleBookButton';

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Ready to fix your Salesforce challenges?</h1>
      <SimpleBookButton />
    </section>
  );
}
```

### Add to Services Page

```tsx
// app/services/page.tsx
import EventTypeSelector from '@/components/EventTypeSelector';

export default function ServicesPage() {
  return (
    <div>
      <h1>Book a Service</h1>
      <EventTypeSelector />
    </div>
  );
}
```

---

## Testing

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3001

# Test components
# Click buttons and verify Calendly links open
# Check console for any errors
# Verify analytics events fire (if configured)
```

---

## Next Steps

1. **Choose an approach** - Simple links, event selector, or custom calendar
2. **Implement component** - Copy/paste example code
3. **Test thoroughly** - Try booking a meeting
4. **Add styling** - Match your brand
5. **Deploy** - Push to production

---

For full API documentation, see [CALENDLY_API_SETUP.md](./CALENDLY_API_SETUP.md)
