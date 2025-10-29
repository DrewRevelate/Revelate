'use client';

import { useState } from 'react';

type BookingStep = 'date' | 'time' | 'details' | 'confirmation';

interface TimeSlot {
  time: string;
  available: boolean;
}

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
      for (let minutes of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: Math.random() > 0.3, // Simulate availability
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

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="mb-6 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${step === 'date' ? 'text-magenta' : 'text-gray-400'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === 'date' ? 'border-magenta bg-magenta/10' : 'border-gray-300'}`}>
            1
          </div>
          <span className="text-sm font-medium hidden sm:inline">Date</span>
        </div>
        <div className="h-0.5 flex-1 bg-gray-200 mx-2" />
        <div className={`flex items-center gap-2 ${step === 'time' ? 'text-magenta' : step === 'details' || step === 'confirmation' ? 'text-gray-400' : 'text-gray-300'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === 'time' ? 'border-magenta bg-magenta/10' : step === 'details' || step === 'confirmation' ? 'border-gray-300' : 'border-gray-200'}`}>
            2
          </div>
          <span className="text-sm font-medium hidden sm:inline">Time</span>
        </div>
        <div className="h-0.5 flex-1 bg-gray-200 mx-2" />
        <div className={`flex items-center gap-2 ${step === 'details' || step === 'confirmation' ? 'text-magenta' : 'text-gray-300'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === 'details' || step === 'confirmation' ? 'border-magenta bg-magenta/10' : 'border-gray-200'}`}>
            3
          </div>
          <span className="text-sm font-medium hidden sm:inline">Details</span>
        </div>
      </div>

      {/* Date Selection */}
      {step === 'date' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Date</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className="group p-3.5 border-2 border-gray-200 rounded-xl hover:border-magenta hover:bg-magenta/5 hover:shadow-sm transition-all duration-200 text-left"
              >
                <div className="text-sm font-semibold text-gray-900 group-hover:text-magenta transition-colors">{formatDate(date)}</div>
                <div className="text-xs text-gray-500 mt-1">Available</div>
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
              <h3 className="text-lg font-semibold text-gray-900">Select a Time</h3>
              <p className="text-sm text-gray-500 mt-1">{formatDate(selectedDate)}</p>
            </div>
            <button
              onClick={handleBack}
              className="text-sm text-magenta hover:text-magenta/80 font-medium"
            >
              ← Change Date
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`group p-3.5 border-2 rounded-xl transition-all duration-200 ${
                  slot.available
                    ? 'border-gray-200 hover:border-magenta hover:bg-magenta/5 hover:shadow-sm text-gray-900'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className={`text-sm font-semibold ${slot.available ? 'group-hover:text-magenta transition-colors' : ''}`}>{formatTime(slot.time)}</div>
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
              <h3 className="text-lg font-semibold text-gray-900">Your Details</h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(selectedDate)} at {formatTime(selectedTime)}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="text-sm text-magenta hover:text-magenta/80 font-medium"
            >
              ← Change Time
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-colors"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-colors"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-colors"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to discuss? (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-colors resize-none"
                placeholder="Brief description of your Salesforce challenges..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-magenta hover:bg-[#c235d9] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-magenta/25 hover:shadow-magenta/35 transition-all duration-200"
            >
              Schedule Meeting
            </button>
          </form>
        </div>
      )}

      {/* Confirmation */}
      {step === 'confirmation' && selectedDate && selectedTime && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
          <p className="text-gray-600 mb-1">Your meeting is scheduled for:</p>
          <p className="text-lg font-semibold text-magenta mb-4">
            {formatDate(selectedDate)} at {formatTime(selectedTime)}
          </p>
          <div className="bg-cyan/10 border border-cyan/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              <strong>What's Next:</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
              <li>• Calendar invite sent to {formData.email}</li>
              <li>• You'll receive a reminder 24 hours before</li>
              <li>• Meeting link included in the calendar invite</li>
            </ul>
          </div>
          <button
            onClick={handleStartOver}
            className="text-magenta hover:text-magenta/80 font-medium text-sm"
          >
            Schedule Another Meeting
          </button>
        </div>
      )}
    </div>
  );
}
