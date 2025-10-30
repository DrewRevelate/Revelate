'use client';

import { useState } from 'react';

type BookingStep = 'date' | 'time' | 'details' | 'confirmation';

interface TimeSlot {
  time: string;
  available: boolean;
}

type StepId = Exclude<BookingStep, 'confirmation'>;

const STEP_META: { id: StepId; label: string; number: number }[] = [
  { id: 'date', label: 'Date', number: 1 },
  { id: 'time', label: 'Time', number: 2 },
  { id: 'details', label: 'Details', number: 3 },
];

const STEP_RANK: Record<BookingStep, number> = {
  date: 0,
  time: 1,
  details: 2,
  confirmation: 3,
};

export default function CustomBooking() {
  const [step, setStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  // Generate next 30 days for date selection
  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Generate time slots for a given date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minutes of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${timeString}`;
        const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

        slots.push({
          time: timeString,
          available: hash % 5 !== 0,
        });
      }
    }
    return slots;
  };

  const dates = generateDates();
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with Calendly API or your booking backend
    setStep('confirmation');
  };

  const handleBack = () => {
    if (step === 'time') setStep('date');
    if (step === 'details') setStep('time');
  };

  const handleStartOver = () => {
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const getStepStatus = (target: StepId): 'complete' | 'current' | 'upcoming' => {
    const currentRank = STEP_RANK[step];
    const targetRank = STEP_RANK[target];

    if (currentRank > targetRank) return 'complete';
    if (currentRank === targetRank) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan/20 bg-cyan/5 px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-navy backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-cyan animate-pulse" />
          No credit card required
        </span>
        <span className="flex items-center gap-2 text-[#64748b]">
          <svg className="h-3.5 w-3.5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
          Real humans, not bots
        </span>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center gap-3">
        {STEP_META.map((meta, index) => {
          const status = getStepStatus(meta.id);
          const isLast = index === STEP_META.length - 1;
          const connectorActive = STEP_RANK[step] > STEP_RANK[meta.id];

          return (
            <div key={meta.id} className="flex items-center gap-2">
              <div
                className={`font-heading flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-200 ${
                  status === 'current'
                    ? 'border-magenta bg-magenta/10 text-navy shadow-[0_6px_16px_rgba(217,70,239,0.25)]'
                    : status === 'complete'
                      ? 'border-cyan bg-cyan/10 text-navy shadow-[0_4px_12px_rgba(0,217,255,0.2)]'
                      : 'border-[#dbe3f0] bg-white text-[#64748b]'
                }`}
              >
                {meta.number}
              </div>
              <span
                className={`hidden text-xs font-medium uppercase tracking-wide sm:inline ${
                  status === 'current' ? 'text-navy' : 'text-[#64748b]'
                }`}
              >
                {meta.label}
              </span>
              {!isLast && (
                <span
                  className={`h-px w-8 sm:w-12 transition-all duration-200 ${
                    connectorActive
                      ? 'bg-cyan'
                      : 'bg-[#dbe3f0]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Date Selection */}
      {step === 'date' && (
        <div>
          <h3 className="font-heading text-lg font-semibold text-navy mb-4">Select a Date</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-2">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className="group rounded-xl border border-[#dbe3f0] bg-white p-4 text-left transition-all duration-200 hover:border-magenta hover:bg-magenta/5 hover:shadow-[0_6px_16px_rgba(217,70,239,0.2)]"
              >
                <div className="font-heading text-sm font-semibold text-navy transition-colors group-hover:text-magenta">
                  {formatDate(date)}
                </div>
                <div className="mt-1 text-xs text-[#64748b]">Available</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {step === 'time' && selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg font-semibold text-navy">Select a Time</h3>
              <p className="text-sm text-[#64748b] mt-1">{formatDate(selectedDate)}</p>
            </div>
            <button
              onClick={handleBack}
              className="text-sm font-medium text-magenta hover:text-[#c235d9] transition-colors duration-200"
            >
              ← Change Date
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`group p-4 rounded-xl border transition-all duration-200 ${
                  slot.available
                    ? 'border-[#dbe3f0] bg-white text-navy hover:border-magenta hover:bg-magenta/5 hover:shadow-[0_6px_16px_rgba(217,70,239,0.2)]'
                    : 'cursor-not-allowed border-[#dbe3f0] bg-[#f8fafc] text-[#cbd5e1]'
                }`}
              >
                <div
                  className={`font-heading text-sm font-semibold ${
                    slot.available ? 'transition-colors group-hover:text-magenta' : ''
                  }`}
                >
                  {formatTime(slot.time)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Details Form */}
      {step === 'details' && selectedDate && selectedTime && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg font-semibold text-navy">Your Details</h3>
              <p className="text-sm text-[#64748b] mt-1">
                {formatDate(selectedDate)} at {formatTime(selectedTime)}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="text-sm font-medium text-magenta hover:text-[#c235d9] transition-colors duration-200"
            >
              ← Change Time
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-sm text-navy placeholder:text-[#94a3b8] focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20 transition-all duration-200"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-sm text-navy placeholder:text-[#94a3b8] focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20 transition-all duration-200"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-navy mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-sm text-navy placeholder:text-[#94a3b8] focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20 transition-all duration-200"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-navy mb-2">
                What would you like to discuss? (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-[#dbe3f0] bg-white px-4 py-3 text-sm text-navy placeholder:text-[#94a3b8] focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20 transition-all duration-200"
                placeholder="Brief description of your Salesforce challenges..."
              />
            </div>

            <button
              type="submit"
              className="font-heading w-full rounded-xl bg-magenta py-4 px-6 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_6px_16px_rgba(217,70,239,0.3)] transition-all duration-200 hover:bg-[#c235d9] hover:shadow-[0_8px_20px_rgba(217,70,239,0.4)] hover:-translate-y-0.5"
            >
              Schedule Meeting
            </button>
          </form>
        </div>
      )}

      {/* Confirmation */}
      {step === 'confirmation' && selectedDate && selectedTime && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan bg-cyan/10">
            <svg className="h-8 w-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-heading mb-3 text-2xl font-bold text-navy">You&apos;re All Set!</h3>
          <p className="text-[#64748b] mb-2">Your meeting is scheduled for:</p>
          <p className="text-xl font-semibold text-magenta mb-6">
            {formatDate(selectedDate)} at {formatTime(selectedTime)}
          </p>
          <div className="mb-6 rounded-xl border border-cyan/30 bg-cyan/5 p-5 text-left text-sm text-[#334155]">
            <p className="font-semibold text-navy mb-3">
              What&apos;s Next:
            </p>
            <ul className="ml-4 space-y-2 text-[#64748b]">
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">→</span>
                <span>Calendar invite sent to {formData.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">→</span>
                <span>You&apos;ll receive a reminder 24 hours before</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">→</span>
                <span>Meeting link included in the calendar invite</span>
              </li>
            </ul>
          </div>
          <button
            onClick={handleStartOver}
            className="text-sm font-medium text-magenta hover:text-[#c235d9] transition-colors duration-200"
          >
            Schedule Another Meeting →
          </button>
        </div>
      )}
    </div>
  );
}
