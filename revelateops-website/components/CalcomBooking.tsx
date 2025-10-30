'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: Date;
  slots: TimeSlot[];
}

interface CalcomBookingProps {
  eventTypeId?: string;
  onBookingComplete?: (booking: any) => void;
}

export default function CalcomBooking({
  eventTypeId = '3779836', // Drew's 15-minute consultation event
  onBookingComplete
}: CalcomBookingProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [availableSlots, setAvailableSlots] = useState<DaySlots[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
  });

  // Fetch available slots for the current week
  useEffect(() => {
    fetchAvailability();
  }, [currentWeekStart]);

  const fetchAvailability = async () => {
    setIsLoading(true);
    try {
      const startTime = currentWeekStart.toISOString();
      const endTime = addDays(currentWeekStart, 7).toISOString();

      console.log('Fetching availability:', { startTime, endTime, eventTypeId });

      const response = await fetch(
        `/api/calcom/availability?startTime=${startTime}&endTime=${endTime}&eventTypeId=${eventTypeId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to fetch availability: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Cal.com API Response:', data);

      // Transform API response into our format
      // Cal.com API returns { slots: { "2024-01-01": ["09:00:00", "10:00:00"] } }
      const slots: DaySlots[] = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentWeekStart, i);
        const dateKey = format(date, 'yyyy-MM-dd');

        // Get slots for this date from the API response
        const timeSlotsForDay = data.slots?.[dateKey] || [];

        const daySlots = timeSlotsForDay.map((time: string) => ({
          time: `${dateKey}T${time}`,
          available: true,
        }));

        slots.push({ date, slots: daySlots });
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Show empty slots on error so UI doesn't break
      const emptySlots: DaySlots[] = [];
      for (let i = 0; i < 7; i++) {
        emptySlots.push({ date: addDays(currentWeekStart, i), slots: [] });
      }
      setAvailableSlots(emptySlots);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
    setShowBookingForm(true);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const response = await fetch('/api/calcom/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventTypeId,
          start: selectedSlot.time,
          responses: {
            name: formData.name,
            email: formData.email,
            notes: formData.notes,
          },
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const booking = await response.json();
      onBookingComplete?.(booking);

      // Reset form
      setShowBookingForm(false);
      setSelectedSlot(null);
      setFormData({ name: '', email: '', notes: '' });

    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  if (showBookingForm && selectedSlot) {
    return (
      <div className="space-y-6">
        {/* Selected Time Summary */}
        <div className="bg-cyan/10 border border-cyan/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="font-semibold text-navy">
                {format(selectedSlot.date, 'EEEE, MMMM d')}
              </div>
              <div className="text-sm text-gray-600">
                {format(parseISO(selectedSlot.time), 'h:mm a')}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-cyan"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-cyan"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-cyan resize-none"
              placeholder="Tell us what you'd like to discuss..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowBookingForm(false);
                setSelectedSlot(null);
              }}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isBooking}
              className="flex-1 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous week"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <div className="font-semibold text-navy">
            {format(currentWeekStart, 'MMMM yyyy')}
          </div>
          <div className="text-sm text-gray-600">
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d')}
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Next week"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-cyan/20 border-t-cyan mb-3"></div>
            <p className="text-sm text-gray-600">Loading availability...</p>
          </div>
        </div>
      ) : (
        /* Time Grid */
        <div className="grid grid-cols-7 gap-2">
          {availableSlots.map((day) => (
            <div key={day.date.toISOString()} className="space-y-2">
              {/* Day Header */}
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 uppercase">
                  {format(day.date, 'EEE')}
                </div>
                <div className={`text-sm font-bold mt-1 ${
                  isSameDay(day.date, new Date()) ? 'text-cyan' : 'text-navy'
                }`}>
                  {format(day.date, 'd')}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-1">
                {day.slots.length > 0 ? (
                  day.slots.slice(0, 6).map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleSlotSelect(day.date, slot.time)}
                      className="w-full px-2 py-1.5 text-xs font-medium rounded border border-gray-200 hover:border-cyan hover:bg-cyan/5 hover:text-cyan transition-all"
                    >
                      {format(parseISO(slot.time), 'h:mm a')}
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 text-center py-2">
                    No slots
                  </div>
                )}
                {day.slots.length > 6 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.slots.length - 6} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
