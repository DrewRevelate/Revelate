'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CalendlyWidgetSimple from './CalendlyWidgetSimple';
import UserInfoModal from './UserInfoModal';
import ContactChat from './ContactChat';
import { generateCustomPackagePDF } from '@/utils/generateCustomPackagePDF';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  comments: string;
}

// Service capabilities - matching services/page.tsx
const capabilities = [
  {
    id: 'architecture',
    title: 'Salesforce Architecture & Design',
    description: 'Custom object modeling, data architecture, and scalable system design',
    detailedDescription: 'Design a scalable Salesforce architecture from the ground up. We analyze your revenue operations, map data flows, design custom objects, and create a system architecture that supports growth from $10M to $50M ARR without requiring a rebuild. Includes ERD diagrams, field-level design, relationship modeling, and scalability planning.',
    deliverables: ['System architecture diagram', 'Custom object specifications', 'Data model documentation', 'Scalability roadmap'],
  },
  {
    id: 'forecasting',
    title: 'Revenue Forecasting Setup',
    description: 'Predictive analytics, pipeline management, and board-ready reporting',
    detailedDescription: 'Build a forecasting system that gives your board confidence in your revenue projections. We configure opportunity stages, probability models, forecast categories, and create custom reports that show pipeline health, win rates, and revenue predictions. Includes historical data analysis and forecast accuracy tracking.',
    deliverables: ['Forecast configuration', 'Pipeline reports', 'Board presentation dashboards', 'Forecast accuracy metrics'],
  },
  {
    id: 'cleanup',
    title: 'Technical Debt Cleanup',
    description: 'Remove unused fields, workflows, and redundant automation',
    detailedDescription: 'Clean up years of organic growth and technical debt. We audit your Salesforce instance, identify unused fields/objects/workflows, document dependencies, and systematically remove or consolidate redundant automation. Includes data migration for consolidated fields and validation rule cleanup.',
    deliverables: ['Technical debt audit report', 'Cleanup execution plan', 'Dependency mapping', 'Post-cleanup validation'],
  },
  {
    id: 'automation',
    title: 'Process Automation',
    description: 'Flows, approval processes, and workflow rules that eliminate manual work',
    detailedDescription: 'Automate repetitive tasks that waste your team\'s time. We design and build Flows, approval processes, and workflow rules that handle everything from lead assignment to contract approvals. Includes process mapping, automation design, testing, and user training.',
    deliverables: ['Process automation flows', 'Approval process configuration', 'Automation documentation', 'User training materials'],
  },
  {
    id: 'integrations',
    title: 'Third-Party Integrations',
    description: 'Connect Salesforce to your revenue stack: HubSpot, Stripe, AWS, and more',
    detailedDescription: 'Create a unified revenue stack by connecting Salesforce to your other tools. We build integrations with marketing automation (HubSpot, Marketo), billing systems (Stripe, Chargebee), data warehouses (AWS, Snowflake), and customer success platforms. Includes API development, data sync configuration, and error handling.',
    deliverables: ['Integration architecture', 'API connections', 'Data sync configuration', 'Monitoring setup'],
  },
  {
    id: 'ai',
    title: 'AI & AgentForce Implementation',
    description: 'Deploy Salesforce AI agents for predictive insights and automation',
    detailedDescription: 'Deploy Salesforce AI and AgentForce to automate revenue operations with artificial intelligence. We configure Einstein Forecasting, implement AgentForce for lead scoring and opportunity insights, and build custom AI models for your specific use cases. Includes training data preparation and accuracy monitoring.',
    deliverables: ['AI agent configuration', 'Einstein setup', 'Custom AI models', 'Performance monitoring'],
  },
  {
    id: 'datacloud',
    title: 'Data Cloud Integration',
    description: 'AWS Data Cloud, real-time data sync, and unified customer profiles',
    detailedDescription: 'Integrate Salesforce with AWS Data Cloud or Salesforce Data Cloud to create a unified view of your customers. We connect data sources, configure real-time sync, build unified customer profiles, and create analytics dashboards. Includes data mapping, identity resolution, and data quality monitoring.',
    deliverables: ['Data Cloud setup', 'Unified customer profiles', 'Real-time sync configuration', 'Analytics dashboards'],
  },
  {
    id: 'cpq',
    title: 'CPQ & Quote Configuration',
    description: 'Configure-Price-Quote setup for complex product catalogs',
    detailedDescription: 'Implement Salesforce CPQ for complex product catalogs and pricing models. We configure product bundles, pricing rules, discount schedules, approval workflows, and quote templates. Includes subscription pricing, usage-based billing, and multi-currency support for global sales teams.',
    deliverables: ['CPQ configuration', 'Product catalog setup', 'Pricing rules', 'Quote templates'],
  },
  {
    id: 'training',
    title: 'Sales Team Training',
    description: 'User adoption, best practices, and change management',
    detailedDescription: 'Drive user adoption with comprehensive training programs. We create role-based training materials, conduct hands-on workshops, and provide ongoing support during the transition period. Includes admin training, end-user training, and change management strategies to ensure your team actually uses the new system.',
    deliverables: ['Training materials', 'Hands-on workshops', 'Quick reference guides', 'Admin certification'],
  },
];

export default function FloatingBookingButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasCustomPackage, setHasCustomPackage] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [showDiscountPromo, setShowDiscountPromo] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Button always visible
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check for custom package in localStorage
  useEffect(() => {
    const checkCustomPackage = () => {
      // Defer state updates to avoid updating during another component's render
      setTimeout(() => {
        const selectedServices = localStorage.getItem('selectedServices');
        if (selectedServices) {
          try {
            const services = JSON.parse(selectedServices);
            if (Array.isArray(services) && services.length > 0) {
              setHasCustomPackage(true);
              setSelectedServiceIds(services);
            } else {
              setHasCustomPackage(false);
              setSelectedServiceIds([]);
            }
          } catch {
            setHasCustomPackage(false);
            setSelectedServiceIds([]);
          }
        } else {
          setHasCustomPackage(false);
          setSelectedServiceIds([]);
        }
      }, 0);
    };

    checkCustomPackage();

    // Listen for storage changes
    window.addEventListener('storage', checkCustomPackage);
    // Custom event for same-page updates
    window.addEventListener('customPackageUpdated', checkCustomPackage);

    return () => {
      window.removeEventListener('storage', checkCustomPackage);
      window.removeEventListener('customPackageUpdated', checkCustomPackage);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false);
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-menu-container]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Handle PDF generation after user submits info
  const handlePDFGeneration = (userInfo: UserInfo) => {
    // Get full service details from selected IDs
    const selectedServices = selectedServiceIds
      .map(id => capabilities.find(cap => cap.id === id))
      .filter(Boolean) as typeof capabilities;

    // Generate the PDF
    generateCustomPackagePDF(userInfo, selectedServices);

    // Close user info modal
    setIsUserInfoModalOpen(false);

    // Show discount promo modal
    setShowDiscountPromo(true);
  };

  return (
    <>
      {/* Floating Menu Container */}
      <div data-menu-container className="fixed z-40 bottom-6 left-6 sm:bottom-6 sm:left-auto sm:right-6">
        {/* Floating Button - Circular Logo Style with Calendar Badge */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`
            group
            relative
            flex h-16 w-16 items-center justify-center
            overflow-visible rounded-full
            border-[2px] border-white/60
            bg-gradient-to-br from-white/5 via-transparent to-transparent
            shadow-[0_0_32px_rgba(0,217,255,0.4),0_0_16px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)]
            ring-1 ring-white/20
            backdrop-blur-sm
            transition-all duration-200 ease-in-out
            hover:border-white/80
            hover:shadow-[0_0_48px_rgba(0,217,255,0.6),0_0_24px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)]
            hover:scale-110
            active:scale-105
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          `}
          aria-label="Open menu"
        >
        {/* Logo Image */}
        <Image
          src="/revelate-logo.png"
          alt="Book a call"
          width={64}
          height={64}
          className="h-full w-full object-contain relative z-10 overflow-hidden rounded-full"
        />

        {/* Badge - Shows Calendar or Package Count */}
        {hasCustomPackage ? (
          /* Package Indicator Badge */
          <span className="absolute -top-1 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-magenta border-2 border-white shadow-[0_4px_12px_rgba(217,70,239,0.5)] transition-all duration-200 group-hover:scale-110 animate-in zoom-in">
            <span className="text-xs font-bold text-white">{selectedServiceIds.length}</span>
          </span>
        ) : (
          /* Calendar Badge */
          <span className="absolute -top-1 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-cyan border-2 border-white shadow-[0_4px_12px_rgba(0,217,255,0.5)] transition-all duration-200 group-hover:scale-110">
            <svg className="h-4 w-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
        )}

        {/* Hover Glow Effect */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tl from-cyan/10 via-transparent to-transparent" />

        {/* Pulse Animation Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-cyan/40 animate-ping opacity-20" />
      </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-20 left-0 sm:left-auto sm:right-0 w-64 rounded-xl border border-cyan/30 bg-navy/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,217,255,0.3)] overflow-hidden">
            {/* Book a Meeting */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsOpen(true);
              }}
              className="w-full flex items-center gap-3 px-5 py-4 text-left text-white hover:bg-cyan/10 transition-colors duration-200 border-b border-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/20">
                <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">Book a Meeting</div>
                <div className="text-xs text-white/60">Schedule a consultation</div>
              </div>
            </button>

            {/* Chat with Drew */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsChatOpen(true);
              }}
              className="w-full flex items-center gap-3 px-5 py-4 text-left text-white hover:bg-white/10 transition-colors duration-200 border-b border-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">Chat with Drew</div>
                <div className="text-xs text-white/60">Start a conversation</div>
              </div>
            </button>

            {/* Custom Package - Conditional */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (hasCustomPackage) {
                  setIsPackageModalOpen(true);
                } else {
                  router.push('/services');
                }
              }}
              className="w-full flex items-center gap-3 px-5 py-4 text-left text-white hover:bg-cyan/10 transition-colors duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-magenta/20">
                <svg className="h-5 w-5 text-magenta" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {hasCustomPackage ? 'View Custom Package' : 'Create Custom Package'}
                </div>
                <div className="text-xs text-white/60">
                  {hasCustomPackage ? 'Review your selections' : 'Build your solution'}
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Modal - Compact Popup Style */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-20 pb-20 px-4 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Panel - Compact and Centered */}
          <div
            className="relative w-full max-w-xl my-auto transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="relative border-b border-gray-200 bg-gradient-to-r from-navy to-navy/95 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      id="modal-title"
                      className="text-2xl font-bold text-white font-heading"
                    >
                      Schedule Your Discovery Call
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Pick a time that works for you
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close modal"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <CalendlyWidgetSimple url="https://calendly.com/drewlambert/15-minute-consultation" />
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Free 15-minute consultation</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Custom Package Modal */}
      {isPackageModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          aria-labelledby="package-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsPackageModalOpen(false)}
          />

          {/* Modal Panel */}
          <div
            className="relative w-full max-w-2xl my-auto transform overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(26,31,58,0.15)] border border-navy/10 transition-all animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient background */}
            <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-navy via-navy to-navy/95">
              <div className="relative flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/15 border border-cyan/20">
                      <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2
                        id="package-modal-title"
                        className="text-3xl font-bold text-white font-heading"
                      >
                        Your Custom Package
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/15 border border-cyan/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan"></div>
                          <span className="text-sm font-semibold text-cyan">{selectedServiceIds.length} {selectedServiceIds.length === 1 ? 'service' : 'services'}</span>
                        </div>
                        <span className="text-sm text-white/70">• Ready to download</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsPackageModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-all hover:bg-white/10 hover:text-white flex-shrink-0"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Selected Services List */}
            <div className="px-8 py-6 max-h-96 overflow-y-auto">
              <div className="grid gap-3">
                {selectedServiceIds.length > 0 ? (
                  selectedServiceIds.map((serviceId, index) => (
                    <div
                      key={serviceId}
                      className="relative flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-navy/10 hover:border-cyan/30 hover:bg-white transition-all duration-200 group"
                    >
                      {/* Magenta accent bar - small accent only */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-magenta rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-blue flex-shrink-0">
                        <span className="text-base font-bold text-navy">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-navy capitalize leading-tight">
                          {capabilities.find(c => c.id === serviceId)?.title || serviceId.replace(/-/g, ' ')}
                        </h3>
                        <p className="text-sm text-navy/60 mt-0.5">
                          {capabilities.find(c => c.id === serviceId)?.description || 'Custom service'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = selectedServiceIds.filter(id => id !== serviceId);
                          setSelectedServiceIds(updated);
                          localStorage.setItem('selectedServices', JSON.stringify(updated));
                          window.dispatchEvent(new Event('customPackageUpdated'));
                          if (updated.length === 0) {
                            setHasCustomPackage(false);
                            setIsPackageModalOpen(false);
                          }
                        }}
                        className="flex-shrink-0 p-2 rounded-lg text-navy/40 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Remove service"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-navy/50">
                    <p>No services selected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Action Buttons */}
            <div className="border-t border-navy/10 px-8 py-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsPackageModalOpen(false);
                    setIsUserInfoModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-cyan to-blue text-navy font-bold text-lg rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => {
                    setIsPackageModalOpen(false);
                    router.push('/services');
                  }}
                  className="sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white border border-navy/20 text-navy font-semibold text-base rounded-lg hover:border-cyan/30 hover:bg-gray-50 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Package</span>
                </button>
              </div>
              {selectedServiceIds.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all selected services?')) {
                      setSelectedServiceIds([]);
                      localStorage.removeItem('selectedServices');
                      window.dispatchEvent(new Event('customPackageUpdated'));
                      setHasCustomPackage(false);
                      setIsPackageModalOpen(false);
                    }
                  }}
                  className="w-full mt-4 px-6 py-2.5 text-sm text-navy/50 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  Clear all services
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Info Modal for PDF Generation */}
      <UserInfoModal
        isOpen={isUserInfoModalOpen}
        onClose={() => setIsUserInfoModalOpen(false)}
        onSubmit={handlePDFGeneration}
        selectedServicesCount={selectedServiceIds.length}
      />

      {/* Chat Modal */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          aria-labelledby="chat-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsChatOpen(false)}
          />

          {/* Chat Panel - Bottom Right Positioning */}
          <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] sm:h-auto sm:max-h-[85vh] bg-white border border-gray-200 sm:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 z-[61] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-navy/95 px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10">
              <div>
                <h3 id="chat-modal-title" className="font-heading text-lg font-bold text-white">Chat with Drew</h3>
                <p className="text-sm text-white/80">Typically replies within a few hours</p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-white/80 transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto bg-white min-h-[500px] max-h-[calc(85vh-80px)] p-6">
              <ContactChat />
            </div>
          </div>
        </div>
      )}

      {/* Discount Promo Modal - Shows after PDF is generated */}
      {showDiscountPromo && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          aria-labelledby="promo-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => {
              setShowDiscountPromo(false);
              setIsOpen(true);
            }}
          />

          {/* Modal Panel */}
          <div
            className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-navy/95 border-2 border-cyan/50 shadow-[0_20px_60px_rgba(0,217,255,0.4)] transition-all animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Animation */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-blue to-magenta animate-pulse"></div>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Checkmark Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan/20 ring-4 ring-cyan/30">
                <svg className="h-10 w-10 text-cyan animate-in zoom-in duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Title */}
              <h2
                id="promo-modal-title"
                className="text-3xl font-bold text-white mb-3 font-heading"
              >
                PDF Downloaded!
              </h2>

              <p className="text-lg text-white/90 mb-6">
                Your custom package proposal is ready.
              </p>

              {/* Discount Offer Box */}
              <div className="mb-8 rounded-xl border-2 border-cyan/60 bg-cyan/10 p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg className="h-8 w-8 text-cyan flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-cyan uppercase tracking-wide">Limited Time Offer</p>
                    <p className="text-2xl font-bold text-white">10% OFF</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">
                  Schedule your consultation within <span className="font-bold text-cyan">10 days</span> to claim your discount on your first contract
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  setShowDiscountPromo(false);
                  setIsOpen(true);
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan to-blue text-navy text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/40 transition-all duration-200 transform hover:scale-105"
              >
                Book Your Meeting Now
              </button>

              {/* Close link */}
              <button
                onClick={() => setShowDiscountPromo(false)}
                className="mt-4 text-sm text-white/60 hover:text-white transition-colors"
              >
                I'll schedule later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
