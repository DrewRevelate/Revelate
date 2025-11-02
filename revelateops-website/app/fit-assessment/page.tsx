'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function FitAssessmentPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('https://formspree.io/f/xanyyvbp', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);

        // Track form submission in analytics
        if (typeof window !== 'undefined' && (window as any).plausible) {
          (window as any).plausible('Form Submitted', {
            props: { form: 'fit-assessment' }
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again or email drew@revelateops.com directly.');
    }
  };

  if (submitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan/10">
            <svg className="h-8 w-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-navy">Thanks for your interest!</h1>
          <p className="mt-4 text-base text-[#64748b]">
            I&apos;ll review your responses and get back to you within 24 hours with a personalized recommendation.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:text-navy"
            >
              ← Back to homepage
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy pt-36 pb-20 text-white">
        <div className="relative mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Quick Assessment
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-[1.2] sm:text-4xl md:text-5xl">
              Check If We&apos;re A Fit
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
              Answer a few quick questions about your revenue operations. I&apos;ll review and send you a personalized recommendation within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8 rounded-xl border border-[#dbe3f0] bg-white p-8 shadow-sm"
          >
            {/* Company Stage */}
            <div>
              <label htmlFor="stage" className="block text-sm font-semibold text-navy">
                What stage is your company? *
              </label>
              <select
                id="stage"
                name="stage"
                required
                className="mt-2 block w-full rounded-lg border border-[#dbe3f0] bg-white px-4 py-3 text-navy focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
              >
                <option value="">Select stage...</option>
                <option value="pre-a">Pre-Series A (&lt;$2M ARR)</option>
                <option value="series-a">Series A ($2-10M ARR)</option>
                <option value="series-b">Series B ($10-50M ARR)</option>
                <option value="series-c">Series C+ ($50M+ ARR)</option>
              </select>
            </div>

            {/* Current Systems */}
            <div>
              <label htmlFor="systems" className="block text-sm font-semibold text-navy">
                Which revenue systems are you currently using? *
              </label>
              <p className="mt-1 text-xs text-[#64748b]">Select all that apply</p>
              <div className="mt-3 space-y-2">
                {[
                  'Salesforce',
                  'HubSpot',
                  'NetSuite',
                  'Spreadsheets (primary)',
                  'Other CRM',
                  'Integration platform (Workato, Zapier, etc.)',
                ].map((system) => (
                  <label key={system} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="systems"
                      value={system}
                      className="h-4 w-4 rounded border-[#dbe3f0] text-cyan focus:ring-cyan"
                    />
                    <span className="text-sm text-[#334155]">{system}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Biggest Pain Point */}
            <div>
              <label htmlFor="pain" className="block text-sm font-semibold text-navy">
                What&apos;s the biggest pain point right now? *
              </label>
              <textarea
                id="pain"
                name="pain"
                required
                rows={4}
                placeholder="e.g., Forecast accuracy is terrible, data is inconsistent, integrations keep breaking..."
                className="mt-2 block w-full rounded-lg border border-[#dbe3f0] bg-white px-4 py-3 text-navy placeholder:text-[#94a3b8] focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-semibold text-navy">
                How urgent is this? *
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                className="mt-2 block w-full rounded-lg border border-[#dbe3f0] bg-white px-4 py-3 text-navy focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
              >
                <option value="">Select timeline...</option>
                <option value="now">Urgent - Need help now</option>
                <option value="month">Within the next month</option>
                <option value="quarter">This quarter</option>
                <option value="exploring">Just exploring options</option>
              </select>
            </div>

            {/* Contact Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-navy">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-2 block w-full rounded-lg border border-[#dbe3f0] bg-white px-4 py-3 text-navy focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-2 block w-full rounded-lg border border-[#dbe3f0] bg-white px-4 py-3 text-navy focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full rounded-lg bg-magenta px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#c235d9] hover:shadow-xl"
              >
                Get My Personalized Recommendation
              </button>
              <p className="mt-3 text-center text-xs text-[#64748b]">
                I&apos;ll review your responses and get back to you within 24 hours
              </p>
            </div>
          </motion.form>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-[#64748b]">
              Prefer to talk first?{' '}
              <Link href="/book" className="font-semibold text-blue hover:text-navy">
                Book a 15-minute call instead
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
