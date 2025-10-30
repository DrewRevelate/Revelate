'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ContactChat from '@/components/ContactChat';
import { Phone, Mail, Linkedin } from 'lucide-react';

export default function ContactPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-navy text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="font-heading text-5xl font-bold mb-6 leading-tight">
              Let's uncover what's hiding in your data
            </h1>
            <p className="font-body text-lg text-slate-gray max-w-2xl mx-auto leading-relaxed">
              Whether you're dealing with CRM chaos, integration debt, or need a trusted operator to help you scale—let's talk about what's possible.
            </p>
          </motion.div>

          {/* Contact Options - Asymmetric Layout */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto"
          >
            {/* Quick Call - Primary CTA */}
            <div className="group relative bg-gradient-to-br from-navy-light/60 to-navy-light/40 border border-cyan/30 rounded-lg p-8 hover:border-cyan transition-all duration-200 md:col-span-2 shadow-[0_4px_12px_rgba(26,31,58,0.3)] hover:shadow-[0_8px_24px_rgba(0,217,255,0.15)] overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Phone className="w-6 h-6 text-cyan group-hover:rotate-12 transition-transform duration-200" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl font-semibold mb-2 group-hover:text-cyan transition-colors duration-200">Book a discovery call</h3>
                  <p className="font-body text-slate-gray mb-4 leading-relaxed">
                    15-minute consultation to discuss your revenue operations challenges and identify immediate opportunities
                  </p>
                  <a
                    href="/book"
                    className="inline-block px-6 py-3 bg-magenta hover:bg-magenta/90 rounded-lg font-semibold transition-all duration-200 transform hover:translate-y-[-2px] shadow-[0_4px_12px_rgba(217,70,239,0.3)]"
                  >
                    See what you're missing
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="group relative bg-gradient-to-br from-navy-light/50 to-navy-light/30 border border-cyan/20 rounded-lg p-6 hover:border-cyan/60 transition-all duration-200 shadow-[0_4px_12px_rgba(26,31,58,0.2)] hover:shadow-[0_8px_20px_rgba(0,217,255,0.1)] hover:translate-y-[-4px] overflow-hidden">
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Mail className="w-5 h-5 text-cyan group-hover:rotate-[-5deg] transition-transform duration-200" strokeWidth={2} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-cyan transition-colors duration-200">Email directly</h3>
                <p className="font-body text-slate-gray text-sm mb-4 leading-relaxed">
                  Prefer to start async? Send me a note
                </p>
                <a
                  href="mailto:drew@revelateops.com"
                  className="inline-block text-cyan hover:text-cyan/80 transition-colors duration-200 font-medium"
                >
                  drew@revelateops.com
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="group relative bg-gradient-to-br from-navy-light/50 to-navy-light/30 border border-cyan/20 rounded-lg p-6 hover:border-cyan/60 transition-all duration-200 shadow-[0_4px_12px_rgba(26,31,58,0.2)] hover:shadow-[0_8px_20px_rgba(0,217,255,0.1)] hover:translate-y-[-4px] overflow-hidden">
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Linkedin className="w-5 h-5 text-cyan group-hover:rotate-12 transition-transform duration-200" strokeWidth={2} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-cyan transition-colors duration-200">Connect on LinkedIn</h3>
                <p className="font-body text-slate-gray text-sm mb-4 leading-relaxed">
                  Let's connect and stay in touch
                </p>
                <a
                  href="https://linkedin.com/in/drewlambert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-cyan hover:text-cyan/80 transition-colors duration-200 font-medium"
                >
                  View profile
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="relative bg-gradient-to-br from-navy-light/60 to-navy-light/40 border border-cyan/20 rounded-lg p-8 md:p-12 shadow-[0_4px_16px_rgba(26,31,58,0.3)] overflow-hidden"
          >
            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-transparent rounded-bl-full" />

            <div className="relative">
              <h2 className="font-heading text-4xl font-bold mb-4 leading-tight">Start a conversation</h2>
              <p className="font-body text-slate-gray mb-8 leading-relaxed">
                Send me a message and we can chat in real-time. I typically reply within a few hours.
              </p>
              <ContactChat />
            </div>
          </motion.div>

          {/* What to Expect - Improved Layout */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="mt-16"
          >
            <h3 className="font-heading text-3xl font-bold mb-8 text-center leading-tight">What to expect</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="group relative bg-gradient-to-br from-navy-light/50 to-navy-light/30 border border-cyan/20 rounded-lg p-6 hover:border-cyan/50 transition-all duration-200 shadow-[0_4px_12px_rgba(26,31,58,0.2)] hover:shadow-[0_6px_16px_rgba(0,217,255,0.08)] overflow-hidden">
                {/* Number background glow */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-cyan/5 rounded-full blur-xl" />

                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <span className="font-heading text-lg font-bold text-cyan">1</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-semibold mb-2 leading-tight group-hover:text-cyan transition-colors duration-200">Response within 24 hours</h4>
                    <p className="font-body text-slate-gray leading-relaxed">
                      I respond to all inquiries within one business day, typically much faster
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-navy-light/50 to-navy-light/30 border border-cyan/20 rounded-lg p-6 hover:border-cyan/50 transition-all duration-200 shadow-[0_4px_12px_rgba(26,31,58,0.2)] hover:shadow-[0_6px_16px_rgba(0,217,255,0.08)] overflow-hidden">
                {/* Number background glow */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-cyan/5 rounded-full blur-xl" />

                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <span className="font-heading text-lg font-bold text-cyan">2</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-semibold mb-2 leading-tight group-hover:text-cyan transition-colors duration-200">Discovery call scheduled</h4>
                    <p className="font-body text-slate-gray leading-relaxed">
                      We'll discuss your revenue operations challenges and identify immediate opportunities
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-navy-light/50 to-navy-light/30 border border-cyan/20 rounded-lg p-6 md:col-span-2 hover:border-cyan/50 transition-all duration-200 shadow-[0_4px_12px_rgba(26,31,58,0.2)] hover:shadow-[0_6px_16px_rgba(0,217,255,0.08)] overflow-hidden">
                {/* Number background glow */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-cyan/5 rounded-full blur-xl" />

                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <span className="font-heading text-lg font-bold text-cyan">3</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-semibold mb-2 leading-tight group-hover:text-cyan transition-colors duration-200">Tailored proposal with clear scope</h4>
                    <p className="font-body text-slate-gray leading-relaxed">
                      You'll receive a custom proposal with specific deliverables, timeline, and transparent pricing based on your needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-navy-dark">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-heading text-4xl font-bold mb-6 leading-tight">
            Uncover hidden revenue opportunities
          </h2>
          <p className="font-body text-lg text-slate-gray mb-8 leading-relaxed">
            Let's build revenue operations systems that reveal what's possible.
          </p>
          <a
            href="/services"
            className="inline-block px-8 py-4 bg-cyan hover:bg-cyan/90 text-navy rounded-lg font-semibold transition-all duration-200 transform hover:translate-y-[-2px]"
          >
            Explore services
          </a>
        </motion.div>
      </section>
    </main>
  );
}
