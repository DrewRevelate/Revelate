'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserInfo) => void;
  selectedServicesCount: number;
}

export default function UserInfoModal({
  isOpen,
  onClose,
  onSubmit,
  selectedServicesCount,
}: UserInfoModalProps) {
  const [formData, setFormData] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate a brief processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof UserInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-[0_20px_60px_rgba(26,31,58,0.15)] border border-navy/10 sm:p-8 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg text-navy/40 transition-all hover:bg-navy/10 hover:text-navy"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-blue flex-shrink-0">
              <svg className="h-7 w-7 text-navy" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-navy font-heading mb-1">Get Your Custom Package</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan"></div>
                  <span className="text-sm font-semibold text-cyan">{selectedServicesCount} service{selectedServicesCount !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-sm text-navy/60">• Ready for download</span>
              </div>
            </div>
          </div>

          {/* Limited Time Offer Banner */}
          <div className="rounded-lg border border-cyan/30 bg-cyan/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan flex-shrink-0">
                <svg className="h-6 w-6 text-navy" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-bold text-navy uppercase tracking-wide">Limited Time Offer</p>
                  <span className="w-1 h-1 rounded-full bg-magenta"></span>
                </div>
                <p className="text-base text-navy/90 font-medium">
                  Book within <span className="font-bold text-cyan">10 days</span> and get <span className="font-bold text-cyan text-lg">10% off</span> your first contract
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-navy mb-2">
                First name <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-navy placeholder-navy/40 transition-all focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-navy/20 focus:border-cyan focus:ring-cyan/20'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-navy mb-2">
                Last name <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-navy placeholder-navy/40 transition-all focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-navy/20 focus:border-cyan focus:ring-cyan/20'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
              Email <span className="text-cyan">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-4 py-2.5 text-navy placeholder-navy/40 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-navy/20 focus:border-cyan focus:ring-cyan/20'
              }`}
              placeholder="john.doe@company.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-navy mb-2">
              Company name <span className="text-cyan">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-4 py-2.5 text-navy placeholder-navy/40 transition-all focus:outline-none focus:ring-2 ${
                errors.company
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-navy/20 focus:border-cyan focus:ring-cyan/20'
              }`}
              placeholder="Acme Corp"
            />
            {errors.company && (
              <p className="mt-1.5 text-xs text-red-600">{errors.company}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-navy mb-2">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy placeholder-navy/40 transition-all focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="sm:flex-1 rounded-lg border border-navy/20 bg-white px-6 py-3.5 text-base font-semibold text-navy transition-all hover:border-cyan/30 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="sm:flex-1 flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan to-blue px-6 py-3.5 text-base font-bold text-navy transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
