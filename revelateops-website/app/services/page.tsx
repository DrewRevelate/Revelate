'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import UserInfoModal from '@/components/UserInfoModal';
import PackageQuiz from '@/components/PackageQuiz';
import PackageRecommendation from '@/components/PackageRecommendation';
import Constellations from '@/components/Constellations';
import { generateCustomPackagePDF } from '@/utils/generateCustomPackagePDF';

interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  icon?: string;
  basePrice: number;
  estimatedHours?: number;
  deliverables?: string[];
  isActive: boolean;
  isFeatured: boolean;
}

interface Package {
  id: string;
  name: string;
  slug: string;
  type: 'stage' | 'targeted' | 'custom';
  stage?: string;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice: number;
  discountPercentage?: number;
  timelineWeeksMin?: number;
  timelineWeeksMax?: number;
  icon?: string;
  badge?: string;
  isFeatured: boolean;
  packageServices?: Array<{
    service: Service;
  }>;
}

interface PackageRecommendation {
  packageType: 'stage' | 'targeted' | 'custom';
  packageName: string;
  packageSlug: string;
  reason: string;
  recommendedServices: string[];
}

// Service categories with color themes
const categories = [
  { id: 'all', label: 'All Services', color: 'cyan', iconColor: 'text-cyan', bgColor: 'bg-cyan' },
  { id: 'revenue', label: 'Revenue Growth', color: 'cyan', iconColor: 'text-cyan', bgColor: 'bg-cyan' },
  { id: 'data', label: 'Data & Analytics', color: 'blue', iconColor: 'text-blue', bgColor: 'bg-blue' },
  { id: 'system', label: 'System Health', color: 'magenta', iconColor: 'text-magenta', bgColor: 'bg-magenta' },
  { id: 'automation', label: 'Automation', color: 'cyan', iconColor: 'text-[#00d9ff]', bgColor: 'bg-[#00d9ff]' },
  { id: 'architecture', label: 'Architecture', color: 'blue', iconColor: 'text-[#0084ff]', bgColor: 'bg-[#0084ff]' },
  { id: 'experience', label: 'User Experience', color: 'magenta', iconColor: 'text-[#d946ef]', bgColor: 'bg-[#d946ef]' },
];

export default function ServicesPage() {
  const prefersReducedMotion = useReducedMotion();

  // State
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendation, setRecommendation] = useState<PackageRecommendation | null>(null);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch services and packages in parallel
        const [servicesRes, packagesRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/packages?include_services=true')
        ]);

        if (!servicesRes.ok || !packagesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const packagesData = await packagesRes.json();

        if (servicesData.success && servicesData.data) {
          setServices(servicesData.data);
        }

        if (packagesData.success && packagesData.data) {
          setPackages(packagesData.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load services and packages');
        setLoading(false);
      }
    }

    fetchData();
    // Note: Selected services are restored in a separate useEffect after services load
  }, []);

  // Restore selected services from localStorage after services are loaded
  useEffect(() => {
    if (services.length === 0) return; // Wait for services to load

    const saved = localStorage.getItem('selectedServices');
    if (saved) {
      try {
        const savedSlugs = JSON.parse(saved);
        // Convert slugs back to IDs
        const serviceIds = savedSlugs
          .map((slug: string) => services.find((s) => s.slug === slug)?.id)
          .filter((id: string | undefined): id is string => !!id);

        if (serviceIds.length > 0) {
          setSelectedServices(new Set(serviceIds));
          console.log('Restored', serviceIds.length, 'selected services from localStorage');
        }
      } catch (e) {
        console.error('Failed to restore selected services:', e);
      }
    }
  }, [services]); // Only run when services are loaded

  // Save selected services to localStorage (as slugs for FloatingBookingButton)
  useEffect(() => {
    // Convert service IDs to slugs for localStorage
    const slugs = Array.from(selectedServices)
      .map((id) => services.find((s) => s.id === id)?.slug)
      .filter((slug): slug is string => !!slug);

    localStorage.setItem('selectedServices', JSON.stringify(slugs));
    // Dispatch custom event for FloatingBookingButton
    window.dispatchEvent(new Event('customPackageUpdated'));
  }, [selectedServices, services]);

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') {
      return services;
    }
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);


  // Handle service toggle
  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  // Handle package selection
  const selectPackage = (pkg: Package) => {
    if (pkg.packageServices && pkg.packageServices.length > 0) {
      const serviceIds = pkg.packageServices.map((ps) => ps.service.id);
      setSelectedServices(new Set(serviceIds));
      // Store the package ID in localStorage for quote generation
      localStorage.setItem('selectedPackageId', pkg.id);
    }
  };

  // Handle package expansion toggle
  const togglePackageExpansion = (pkgId: string) => {
    if (expandedPackageId === pkgId) {
      // Collapse if already expanded
      setExpandedPackageId(null);
    } else {
      // Expand and select the package
      setExpandedPackageId(pkgId);
      const pkg = packages.find((p) => p.id === pkgId);
      if (pkg) {
        selectPackage(pkg);
      }
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (rec: PackageRecommendation) => {
    setRecommendation(rec);
    setQuizCompleted(true);

    // Auto-select recommended services
    const recommendedServiceIds = rec.recommendedServices
      .map((slug) => services.find((s) => s.slug === slug)?.id)
      .filter((id): id is string => !!id);

    setSelectedServices(new Set(recommendedServiceIds));

    // Find and store the recommended package ID
    const recommendedPackage = packages.find((p) => p.slug === rec.packageSlug);
    if (recommendedPackage) {
      localStorage.setItem('selectedPackageId', recommendedPackage.id);
    }
  };

  // Handle proceeding from recommendation
  const handleProceedFromRecommendation = () => {
    setRecommendation(null);
    // If it's a custom package recommendation, show the custom builder
    if (recommendation?.packageType === 'custom') {
      setShowCustomBuilder(true);
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Handle starting over
  const handleStartOver = () => {
    setQuizCompleted(false);
    setRecommendation(null);
    setSelectedServices(new Set());
    localStorage.removeItem('selectedPackageId');
    setShowQuiz(true);
  };

  // Handle user info submission
  const handleUserInfoSubmit = async (userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone?: string;
  }) => {
    try {
      const selectedServicesList = Array.from(selectedServices)
        .map((id) => services.find((s) => s.id === id))
        .filter((s): s is Service => !!s);

      await generateCustomPackagePDF({
        services: selectedServicesList,
        userInfo,
      });

      setShowUserModal(false);
      alert('Quote generated successfully! Check your downloads folder.');
      setSelectedServices(new Set());
    } catch (error) {
      console.error('Error generating quote:', error);
      alert('Failed to generate quote. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0F1E] via-[#1a1f3a] to-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d9ff] mb-4"></div>
          <p className="text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0F1E] via-[#1a1f3a] to-[#0A0F1E] flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Services</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0A0F1E] via-[#1a1f3a] to-[#0A0F1E]">
      {/* Subtle Constellation Background */}
      <Constellations density="medium" />

      {/* Hero Section - Salesforce Focused */}
      <section className="relative z-10 pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#00d9ff]">
              Salesforce Expertise for Series B SaaS
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.2] tracking-[-0.02em] text-white">
              Fix Your Salesforce, Close More Deals
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg md:text-xl leading-[1.6] text-white/80">
              Stop losing revenue to broken forecasting, manual data entry, and disconnected systems. Get your revenue operations fixed in 6-16 weeks—no full rebuild required.
            </p>

            {/* Primary CTA */}
            <div className="mt-10">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d9ff] px-10 py-4 text-base font-semibold text-[#0A0F1E] shadow-[0_8px_16px_rgba(0,217,255,0.25)] transition-all duration-200 hover:bg-[#00c4e6] hover:shadow-[0_8px_16px_rgba(0,217,255,0.35)]"
              >
                Audit my revenue leaks
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-white/80"
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#00d9ff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Week 1 insights
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#00d9ff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                46% backlog reduction
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#00d9ff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                $35K-70K vs $150K+ agency rebuild
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Three Breaking Points Section */}
      <section className="relative z-10 py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl text-center mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#00d9ff]">
              Three breaking points
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.2] text-white">
              Your Salesforce instance is the bottleneck preventing $50M ARR
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              These are the symptoms that signal it's time for intervention
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Problem 01 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex h-1 w-14 rounded-full bg-[#00d9ff]" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <svg className="h-6 w-6 text-[#00d9ff]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                  Problem 01
                </div>
                <h3 className="text-lg font-semibold leading-snug text-white">
                  Your board wants forecast accuracy. Your CRM gives you guesses.
                </h3>
              </div>
            </motion.div>

            {/* Problem 02 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex h-1 w-14 rounded-full bg-[#00d9ff]" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <svg className="h-6 w-6 text-[#0084ff]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                  Problem 02
                </div>
                <h3 className="text-lg font-semibold leading-snug text-white">
                  Your sales team spends 4 hours/day on manual data entry.
                </h3>
              </div>
            </motion.div>

            {/* Problem 03 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
              <div className="relative space-y-3">
                <span className="inline-flex h-1 w-14 rounded-full bg-[#00d9ff]" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="stackIcon" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0084ff" />
                        <stop offset="100%" stopColor="#00d9ff" />
                      </linearGradient>
                    </defs>
                    <path stroke="url(#stackIcon)" d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path stroke="url(#stackIcon)" d="M2 17l10 5 10-5" />
                    <path stroke="url(#stackIcon)" d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                  Problem 03
                </div>
                <h3 className="text-lg font-semibold leading-snug text-white">
                  Your revenue stack doesn't talk to itself.
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Package Selection Section */}
      <section className="relative z-10 py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-white/60">
              Our Expertise
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Build Your Custom Package
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose a pre-built package tailored to your stage, take our quiz for a personalized recommendation, or design your own custom solution
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#packages"
                className="px-8 py-4 bg-[#00d9ff] text-[#0A0F1E] font-semibold rounded-lg hover:bg-[#00b8db] transition-colors shadow-lg"
              >
                Choose a Package
              </Link>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                Take the Quiz
              </button>
              <button
                onClick={() => {
                  setShowCustomBuilder(true);
                  localStorage.removeItem('selectedPackageId');
                  setTimeout(() => {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors"
              >
                Design Custom Package
              </button>
            </div>
          </motion.div>

          {/* Pre-Built Packages */}
          {packages.length > 0 && (
            <motion.div
              id="packages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Pre-Built Packages
              </h2>
              <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                Each package is designed for a specific stage of business growth and includes the essential services you need to scale your revenue operations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.filter((p) => p.isFeatured).map((pkg, index) => {
                  const isExpanded = expandedPackageId === pkg.id;
                  return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className={`rounded-xl p-6 transition-all cursor-pointer ${
                      isExpanded
                        ? 'bg-[#0A0F1E] border-2 border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20'
                        : 'bg-[#0A0F1E] border border-gray-600 hover:border-[#00d9ff]'
                    }`}
                    onClick={() => togglePackageExpansion(pkg.id)}
                  >
                    {pkg.badge && (
                      <span className="inline-block px-3 py-1 bg-[#00d9ff]/20 text-[#00d9ff] text-xs font-semibold rounded-full mb-3">
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                    {pkg.tagline && <p className="text-sm text-white/70 mb-3">{pkg.tagline}</p>}
                    <p className="text-white/90 mb-4 text-sm">{pkg.shortDescription}</p>

                    {pkg.timelineWeeksMin && pkg.timelineWeeksMax && (
                      <p className="text-sm text-white/60 mb-4">
                        Timeline: {pkg.timelineWeeksMin}-{pkg.timelineWeeksMax} weeks
                      </p>
                    )}

                    {pkg.packageServices && pkg.packageServices.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-white/70 mb-2">Includes:</p>
                        <ul className="space-y-1">
                          {pkg.packageServices.slice(0, 3).map((ps) => (
                            <li key={ps.service.id} className="text-sm text-white/90 flex items-start gap-2">
                              <svg className="w-4 h-4 text-[#00d9ff] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>{ps.service.name}</span>
                            </li>
                          ))}
                          {pkg.packageServices.length > 3 && (
                            <li className="text-sm text-white/60">
                              +{pkg.packageServices.length - 3} more services
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                  );
                })}
              </div>

              {/* Expanded Package Services Display */}
              <AnimatePresence>
                {expandedPackageId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                  >
                    {(() => {
                      const expandedPkg = packages.find((p) => p.id === expandedPackageId);
                      if (!expandedPkg || !expandedPkg.packageServices) return null;

                      return (
                        <div className="bg-gradient-to-b from-[#1a1f3a] to-[#0A0F1E] border-2 border-[#00d9ff]/30 rounded-2xl p-8">
                          {/* Header with Collapse Button */}
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {expandedPkg.name} - Included Services
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {expandedPkg.packageServices.length} service{expandedPkg.packageServices.length !== 1 ? 's' : ''} included in this package
                              </p>
                            </div>
                            <button
                              onClick={() => setExpandedPackageId(null)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 text-[#00d9ff] rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                              </svg>
                              Collapse
                            </button>
                          </div>

                          {/* Services Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {expandedPkg.packageServices.map((ps, idx) => (
                              <motion.div
                                key={ps.service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#00d9ff]/50 transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00d9ff]/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#00d9ff]" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-white font-semibold mb-2 text-sm">
                                      {ps.service.name}
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                      {ps.service.shortDescription}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Client Transformations Section */}
      <section className="relative z-10 py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#00d9ff]">
              Client Transformations
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-semibold leading-[1.2] text-white">
              Real results from real organizations
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Revenue operations improvements across SaaS, enterprise, and nonprofit organizations
            </p>
          </div>

          {/* Transformation Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Transformation 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-8"
            >
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-[#00d9ff] mb-2">46%</div>
                <div className="text-sm font-semibold text-white/90">backlog reduction</div>
              </div>
              <p className="text-sm leading-relaxed text-white/70 mb-6">
                Reduced operational backlog by 46% while maintaining 100% system uptime during brownfield redesign. Sales team productivity increased throughout the transition.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60">
                  Series B SaaS Company | $25M ARR | 120 Employees
                </p>
              </div>
            </motion.div>

            {/* Transformation 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-8"
            >
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-[#0084ff] mb-2">3</div>
                <div className="text-sm font-semibold text-white/90">systems integrated</div>
              </div>
              <p className="text-sm leading-relaxed text-white/70 mb-6">
                Unified Salesforce, NetSuite, and product analytics into single source of truth. Board now receives consistent, real-time revenue reporting across all systems.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60">
                  Series B SaaS Company | $18M ARR | 85 Employees
                </p>
              </div>
            </motion.div>

            {/* Transformation 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-8"
            >
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-[#d946ef] mb-2">100%</div>
                <div className="text-sm font-semibold text-white/90">lead automation</div>
              </div>
              <p className="text-sm leading-relaxed text-white/70 mb-6">
                Deployed AgentForce AI for automated lead routing and qualification. Sales team now focuses on high-value activities with AI-powered lead scoring.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/60">
                  Series B SaaS Company | $32M ARR | 150 Employees
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two Paths Forward - Comparison Table */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#00d9ff]">
              Two paths forward
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-semibold leading-[1.2] text-white">
              The real cost of your Salesforce decision
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Compare your options for fixing revenue operations architecture
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-white/80">Solution</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-white/80">Cost</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-white/80">Time to Value</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-white/80">Risk</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-white/80">Ongoing Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-white">Hire RevOps Manager</td>
                  <td className="py-4 px-4 text-sm text-white/70">$160K/yr</td>
                  <td className="py-4 px-4 text-sm text-white/70">6-9 months</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      High
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/70">$180K+ annually</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-white">Salesforce Partner</td>
                  <td className="py-4 px-4 text-sm text-white/70">$150K-300K</td>
                  <td className="py-4 px-4 text-sm text-white/70">6-12 months</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                      Medium
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/70">$50K+ maintenance</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-white">DIY with Internal Team</td>
                  <td className="py-4 px-4 text-sm text-white/70">$0 upfront</td>
                  <td className="py-4 px-4 text-sm text-white/70">12-18+ months</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Very High
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/70">Opportunity cost</td>
                </tr>
                <tr className="border-b-2 border-[#00d9ff]/30 hover:bg-white/5 transition-colors bg-[#00d9ff]/5">
                  <td className="py-4 px-4 text-sm font-bold text-[#00d9ff]">Revelate (6-16 week engagement)</td>
                  <td className="py-4 px-4 text-sm font-semibold text-white">$35K-70K</td>
                  <td className="py-4 px-4 text-sm font-semibold text-white">Week 1 insights</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                      Low
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-white">Flexible hourly</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {/* Card 1 */}
            <div className="rounded-xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Hire RevOps Manager</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Cost:</span>
                  <span className="text-sm text-white">$160K/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Time to Value:</span>
                  <span className="text-sm text-white">6-9 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Risk:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    High
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Ongoing Cost:</span>
                  <span className="text-sm text-white">$180K+ annually</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Salesforce Partner</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Cost:</span>
                  <span className="text-sm text-white">$150K-300K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Time to Value:</span>
                  <span className="text-sm text-white">6-12 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Risk:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                    Medium
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Ongoing Cost:</span>
                  <span className="text-sm text-white">$50K+ maintenance</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-4">DIY with Internal Team</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Cost:</span>
                  <span className="text-sm text-white">$0 upfront</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Time to Value:</span>
                  <span className="text-sm text-white">12-18+ months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Risk:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    Very High
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Ongoing Cost:</span>
                  <span className="text-sm text-white">Opportunity cost</span>
                </div>
              </div>
            </div>

            {/* Card 4 - Revelate (Highlighted) */}
            <div className="rounded-xl border-2 border-[#00d9ff]/50 bg-[#00d9ff]/5 p-6">
              <h3 className="text-lg font-bold text-[#00d9ff] mb-4">Revelate (6-16 week engagement)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Cost:</span>
                  <span className="text-sm font-semibold text-white">$35K-70K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Time to Value:</span>
                  <span className="text-sm font-semibold text-white">Week 1 insights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Risk:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                    Low
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Ongoing Cost:</span>
                  <span className="text-sm font-semibold text-white">Flexible hourly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-white/60 text-center">
              Note: Revelate pricing represents typical engagement ranges. All figures are estimates and non-binding.
              Actual project costs are determined through consultation and tailored to your specific requirements, scope, and organizational context.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#00d9ff]">
              Next step
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.2] text-white">
              Stop losing revenue to broken systems
            </h2>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl mx-auto">
              Free 15-minute diagnostic call for Series B SaaS leaders. We'll expose revenue leaks, map your GTM breaking points, and prioritize fixes by business impact.
            </p>
            <div className="mt-10">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d9ff] px-10 py-4 text-base font-semibold text-[#0A0F1E] shadow-[0_8px_16px_rgba(0,217,255,0.25)] transition-all duration-200 hover:bg-[#00c4e6] hover:shadow-[0_8px_16px_rgba(0,217,255,0.35)]"
              >
                Diagnose my GTM systems
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/60">
              No obligation. No sales pitch. Just insights.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Package Builder - Individual Services Section */}
      {showCustomBuilder && (
        <section id="services" className="relative z-10 py-16 px-4 border-t border-gray-800">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Design Your Custom Package
              </h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Select the specific services you need. Your custom package will be generated based on your selections.
              </p>
              <button
                onClick={() => setShowCustomBuilder(false)}
                className="text-sm text-gray-400 hover:text-[#00d9ff] transition-colors"
              >
                ← Back to Packages
              </button>
            </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00d9ff] text-[#0A0F1E]'
                    : 'bg-[#1a1f3a] text-gray-300 hover:bg-[#1a1f3a]/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredServices.map((service) => {
              const isSelected = selectedServices.has(service.id);

              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-[#1a1f3a] border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    isSelected ? 'border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{service.shortDescription}</p>
                    </div>
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                      isSelected ? 'bg-[#00d9ff] border-[#00d9ff]' : 'border-gray-600'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-[#0A0F1E]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailService(service);
                      }}
                      className="text-sm text-[#00d9ff] hover:text-[#00b8db]"
                    >
                      View Details →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Modals */}
      {showQuiz && !quizCompleted && (
        <PackageQuiz
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {recommendation && (
        <PackageRecommendation
          recommendation={recommendation}
          onStartOver={handleStartOver}
          onProceed={handleProceedFromRecommendation}
        />
      )}

      {showUserModal && (
        <UserInfoModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSubmit={handleUserInfoSubmit}
          selectedServicesCount={selectedServices.size}
        />
      )}

      {/* Service Detail Modal */}
      {detailService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setDetailService(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-[#0A0F1E] to-[#1a1f3a] border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{detailService.name}</h2>
              <button
                onClick={() => setDetailService(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-300 mb-6">{detailService.fullDescription || detailService.shortDescription}</p>

            {detailService.deliverables && detailService.deliverables.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Deliverables</h3>
                <ul className="space-y-2">
                  {detailService.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#00d9ff] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end pt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  toggleService(detailService.id);
                  setDetailService(null);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedServices.has(detailService.id)
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#00d9ff] hover:bg-[#00b8db] text-[#0A0F1E]'
                }`}
              >
                {selectedServices.has(detailService.id) ? 'Remove' : 'Add to Quote'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
