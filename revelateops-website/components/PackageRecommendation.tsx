'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PackageRecommendation {
  packageType: 'stage' | 'targeted' | 'custom';
  packageName: string;
  packageSlug: string;
  reason: string;
  recommendedServices: string[];
}

interface PackageRecommendationProps {
  recommendation: PackageRecommendation;
  onStartOver?: () => void;
  onProceed?: () => void;
}

const serviceLabels: Record<string, string> = {
  'crm-setup': 'CRM Setup & Optimization',
  'analytics': 'Revenue Analytics & Reporting',
  'automation': 'Workflow Automation',
  'data-cleanup': 'Data Cleanup & Enrichment',
  'integrations': 'System Integrations',
  'ai-tools': 'AI-Powered Tools',
  'strategy': 'RevOps Strategy & Planning',
};

const packageIcons: Record<string, string> = {
  stage: '🎯',
  targeted: '🔧',
  custom: '✨',
};

const packageColors: Record<string, { bg: string; border: string; text: string }> = {
  stage: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    text: 'text-blue-400',
  },
  targeted: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    text: 'text-green-400',
  },
  custom: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500',
    text: 'text-purple-400',
  },
};

export default function PackageRecommendation({
  recommendation,
  onStartOver,
  onProceed,
}: PackageRecommendationProps) {
  const colors = packageColors[recommendation.packageType];
  const icon = packageIcons[recommendation.packageType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-b from-[#0A0F1E] to-[#1a1f3a] border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className={`p-8 border-b border-gray-700 ${colors.bg}`}>
          <div className="flex items-start gap-4">
            <div className="text-5xl">{icon}</div>
            <div className="flex-1">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${colors.bg} ${colors.text} border ${colors.border}`}>
                Recommended Package
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{recommendation.packageName}</h2>
              <p className="text-gray-300 text-lg">{recommendation.reason}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-400px)]">
          {/* Recommended Services */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#00d9ff]"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Recommended Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendation.recommendedServices.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 p-3 bg-[#1a1f3a]/50 border border-gray-700 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-[#00d9ff]" />
                  <span className="text-gray-300">{serviceLabels[service] || service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-[#1a1f3a]/30 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#00d9ff]"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What happens next?
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d9ff]/20 text-[#00d9ff] flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>
                  Review the recommended services and customize your selection on the next page
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d9ff]/20 text-[#00d9ff] flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>Submit your requirements and we'll prepare a detailed proposal</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d9ff]/20 text-[#00d9ff] flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>Schedule a consultation to discuss your specific needs and timeline</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 flex justify-between gap-4">
          {onStartOver && (
            <button
              onClick={onStartOver}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Start Over
            </button>
          )}
          <div className="flex gap-4 ml-auto">
            <Link
              href="/services"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Browse All Services
            </Link>
            {onProceed ? (
              <button
                onClick={onProceed}
                className="px-6 py-3 bg-[#00d9ff] text-[#0A0F1E] font-semibold rounded-lg hover:bg-[#00b8db] transition-colors"
              >
                Customize Selection
              </button>
            ) : (
              <Link
                href="/services"
                className="px-6 py-3 bg-[#00d9ff] text-[#0A0F1E] font-semibold rounded-lg hover:bg-[#00b8db] transition-colors"
              >
                Customize Selection
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
