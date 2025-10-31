'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import UserInfoModal from '@/components/UserInfoModal';
import { generateCustomPackagePDF } from '@/utils/generateCustomPackagePDF';

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

// Individual capabilities and services
const capabilities = [
  {
    id: 'architecture',
    title: 'Salesforce Architecture & Design',
    description: 'Custom object modeling, data architecture, and scalable system design',
    category: 'architecture',
    detailedDescription: 'Design a scalable Salesforce architecture from the ground up. We analyze your revenue operations, map data flows, design custom objects, and create a system architecture that supports growth from $10M to $50M ARR without requiring a rebuild. Includes ERD diagrams, field-level design, relationship modeling, and scalability planning.',
    deliverables: ['System architecture diagram', 'Custom object specifications', 'Data model documentation', 'Scalability roadmap'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'forecasting',
    title: 'Revenue Forecasting Setup',
    description: 'Predictive analytics, pipeline management, and board-ready reporting',
    category: 'revenue',
    detailedDescription: 'Build a forecasting system that gives your board confidence in your revenue projections. We configure opportunity stages, probability models, forecast categories, and create custom reports that show pipeline health, win rates, and revenue predictions. Includes historical data analysis and forecast accuracy tracking.',
    deliverables: ['Forecast configuration', 'Pipeline reports', 'Board presentation dashboards', 'Forecast accuracy metrics'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    ),
  },
  {
    id: 'cleanup',
    title: 'Technical Debt Cleanup',
    description: 'Remove unused fields, workflows, and redundant automation',
    category: 'system',
    detailedDescription: 'Clean up years of organic growth and technical debt. We audit your Salesforce instance, identify unused fields/objects/workflows, document dependencies, and systematically remove or consolidate redundant automation. Includes data migration for consolidated fields and validation rule cleanup.',
    deliverables: ['Technical debt audit report', 'Cleanup execution plan', 'Dependency mapping', 'Post-cleanup validation'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 'automation',
    title: 'Process Automation',
    description: 'Flows, approval processes, and workflow rules that eliminate manual work',
    category: 'automation',
    detailedDescription: 'Automate repetitive tasks that waste your team\'s time. We design and build Flows, approval processes, and workflow rules that handle everything from lead assignment to contract approvals. Includes process mapping, automation design, testing, and user training.',
    deliverables: ['Process automation flows', 'Approval process configuration', 'Automation documentation', 'User training materials'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 'integrations',
    title: 'Third-Party Integrations',
    description: 'Connect Salesforce to your revenue stack: HubSpot, Stripe, AWS, and more',
    category: 'automation',
    detailedDescription: 'Create a unified revenue stack by connecting Salesforce to your other tools. We build integrations with marketing automation (HubSpot, Marketo), billing systems (Stripe, Chargebee), data warehouses (AWS, Snowflake), and customer success platforms. Includes API development, data sync configuration, and error handling.',
    deliverables: ['Integration architecture', 'API connections', 'Data sync configuration', 'Monitoring setup'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'AI & AgentForce Implementation',
    description: 'Deploy Salesforce AI agents for predictive insights and automation',
    category: 'architecture',
    detailedDescription: 'Deploy Salesforce AI and AgentForce to automate revenue operations with artificial intelligence. We configure Einstein Forecasting, implement AgentForce for lead scoring and opportunity insights, and build custom AI models for your specific use cases. Includes training data preparation and accuracy monitoring.',
    deliverables: ['AI agent configuration', 'Einstein setup', 'Custom AI models', 'Performance monitoring'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'datacloud',
    title: 'Data Cloud Integration',
    description: 'AWS Data Cloud, real-time data sync, and unified customer profiles',
    category: 'data',
    detailedDescription: 'Integrate Salesforce with AWS Data Cloud or Salesforce Data Cloud to create a unified view of your customers. We connect data sources, configure real-time sync, build unified customer profiles, and create analytics dashboards. Includes data mapping, identity resolution, and data quality monitoring.',
    deliverables: ['Data Cloud setup', 'Unified customer profiles', 'Real-time sync configuration', 'Analytics dashboards'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    id: 'cpq',
    title: 'CPQ & Quote Configuration',
    description: 'Configure-Price-Quote setup for complex product catalogs',
    category: 'revenue',
    detailedDescription: 'Implement Salesforce CPQ for complex product catalogs and pricing models. We configure product bundles, pricing rules, discount schedules, approval workflows, and quote templates. Includes subscription pricing, usage-based billing, and multi-currency support for global sales teams.',
    deliverables: ['CPQ configuration', 'Product catalog setup', 'Pricing rules', 'Quote templates'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M12 18v-6" />
        <path d="M9 15h6" />
      </svg>
    ),
  },
  {
    id: 'training',
    title: 'Sales Team Training',
    description: 'User adoption, best practices, and change management',
    category: 'experience',
    detailedDescription: 'Drive user adoption with comprehensive training programs. We create role-based training materials, conduct hands-on workshops, and provide ongoing support during the transition period. Includes admin training, end-user training, and change management strategies to ensure your team actually uses the new system.',
    deliverables: ['Training materials', 'Hands-on workshops', 'Quick reference guides', 'Admin certification'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'migration',
    title: 'Migration & Data Import',
    description: 'Brownfield migrations, legacy system data cleanup, and validation',
    category: 'architecture',
    detailedDescription: 'Migrate data from legacy systems or consolidate multiple Salesforce orgs. We handle data extraction, transformation, deduplication, validation, and import with zero data loss. Includes data quality checks, rollback planning, and post-migration validation to ensure accuracy.',
    deliverables: ['Migration strategy', 'Data transformation scripts', 'Quality validation', 'Rollback plan'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    id: 'lightning',
    title: 'Custom Lightning Components',
    description: 'Bespoke UI components for unique business processes',
    category: 'architecture',
    detailedDescription: 'Build custom Lightning Web Components for business processes that don\'t fit standard Salesforce UI. We design and develop custom interfaces, interactive dashboards, and specialized tools tailored to your workflows. Includes responsive design, accessibility compliance, and performance optimization.',
    deliverables: ['Custom component development', 'UI/UX design', 'Testing suite', 'Documentation'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Role hierarchies, field-level security, and audit trail setup',
    category: 'system',
    detailedDescription: 'Secure your Salesforce instance with proper role hierarchies, profiles, permission sets, and field-level security. We audit existing permissions, design a security model aligned with your org structure, and implement compliance controls for SOC 2, GDPR, or industry regulations. Includes audit trail setup and security testing.',
    deliverables: ['Security model design', 'Role hierarchy configuration', 'Compliance documentation', 'Security audit report'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'reporting',
    title: 'Custom Reports & Dashboards',
    description: 'Executive dashboards, pipeline reports, and board-ready analytics',
    category: 'data',
    detailedDescription: 'Build custom reports and dashboards that give leadership real-time visibility into revenue operations. We design executive dashboards, pipeline reports, forecast analytics, and board presentations that tell your revenue story. Includes chart optimization, scheduled reports, and mobile dashboard configuration.',
    deliverables: ['Custom report library', 'Executive dashboards', 'Scheduled report automation', 'Mobile dashboard setup'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M9 3v18" />
        <path d="M9 11h6" />
        <path d="M9 15h6" />
      </svg>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Error Troubleshooting & Bug Fixes',
    description: 'Debug broken workflows, fix integration errors, and resolve system issues',
    category: 'system',
    detailedDescription: 'Fix what\'s broken. We troubleshoot and resolve errors in workflows, process builder, flows, integrations, and custom code. Includes root cause analysis, bug fixes, testing, and documentation to prevent future issues. Perfect for inherited Salesforce instances with mysterious errors.',
    deliverables: ['Error diagnosis report', 'Bug fixes and patches', 'Testing documentation', 'Prevention recommendations'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 9v4" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
  },
  {
    id: 'dataquality',
    title: 'Data Quality & Deduplication',
    description: 'Clean duplicate records, standardize data, and enforce quality rules',
    category: 'data',
    detailedDescription: 'Clean up messy data that undermines trust in your CRM. We identify and merge duplicate records, standardize data formats, set up matching rules to prevent future duplicates, and create validation rules to enforce data quality standards. Includes mass data updates and ongoing quality monitoring.',
    deliverables: ['Data quality audit', 'Duplicate merging strategy', 'Matching rule configuration', 'Validation rule setup'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 'leadrouting',
    title: 'Lead Routing & Assignment',
    description: 'Automated lead distribution, round-robin assignment, and territory rules',
    category: 'revenue',
    detailedDescription: 'Get leads to the right rep at the right time. We design and implement automated lead routing based on geography, industry, company size, or custom criteria. Includes round-robin distribution, territory-based assignment, overflow rules, and SLA monitoring to ensure no lead falls through the cracks.',
    deliverables: ['Lead routing strategy', 'Assignment rule configuration', 'Territory mapping', 'Performance monitoring'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    id: 'pagelayouts',
    title: 'Page Layout & UI Optimization',
    description: 'Streamline layouts, optimize mobile experience, and improve usability',
    category: 'experience',
    detailedDescription: 'Make Salesforce easier to use. We streamline page layouts to show only what matters, optimize for mobile devices, redesign record pages for better workflow, and improve overall user experience. Includes field reordering, section organization, related list optimization, and mobile layout configuration.',
    deliverables: ['UI/UX audit', 'Optimized page layouts', 'Mobile configuration', 'User testing feedback'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'healthcheck',
    title: 'Salesforce Health Check & Audit',
    description: 'Comprehensive org assessment, best practice review, and optimization plan',
    category: 'system',
    detailedDescription: 'Get a complete picture of your Salesforce health. We audit your entire org against best practices, identify technical debt, assess security risks, evaluate data quality, and create a prioritized roadmap for improvements. Perfect for new leadership inheriting an existing instance or preparing for growth.',
    deliverables: ['Health check report', 'Technical debt assessment', 'Security audit', 'Optimization roadmap'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'emailtemplates',
    title: 'Email Templates & Communication',
    description: 'Professional email templates, auto-responses, and drip campaigns',
    category: 'experience',
    detailedDescription: 'Professionalize your Salesforce communications. We design branded email templates for sales outreach, customer service responses, and automated notifications. Includes HTML email design, merge field configuration, template folders, and integration with email marketing tools.',
    deliverables: ['Branded email templates', 'Auto-response setup', 'Template library organization', 'Testing across email clients'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
  {
    id: 'document',
    title: 'Document & Contract Automation',
    description: 'DocuSign, PandaDoc, and automated document generation',
    category: 'automation',
    detailedDescription: 'Eliminate manual document creation. We integrate document generation tools (DocuSign, PandaDoc, Conga) with Salesforce to auto-populate contracts, proposals, and agreements from your CRM data. Includes template design, merge field mapping, approval workflows, and e-signature automation.',
    deliverables: ['Document template design', 'Integration setup', 'Approval workflow', 'E-signature automation'],
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
];

// Package offerings
const packages = [
  {
    id: 'revops',
    title: 'Revenue Operations Architecture',
    subtitle: 'For Series B SaaS scaling from $10M to $50M ARR',
    description: 'Building RevOps from scratch or scaling from $10M to $50M ARR',
    includedServices: [
      'Salesforce Architecture & Design',
      'Revenue Forecasting Setup',
      'Process Automation',
      'Third-Party Integrations',
      'Sales Team Training',
    ],
    serviceIds: ['architecture', 'forecasting', 'automation', 'integrations', 'training'],
    youNeedThisIf: [
      'No single source of truth for revenue data',
      'Board wants forecast accuracy',
      'Revenue stack doesn\'t talk to itself',
    ],
    timeline: '8-16 weeks',
    investment: '$35K-70K',
    roi: '571% in year one',
    gradient: 'from-white/10 to-white/5',
    icon: (
      <svg className="h-8 w-8 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'cleanup',
    title: 'Salesforce Cleanup & Repair',
    subtitle: 'For Series B SaaS with technical debt from rapid growth',
    description: 'Fixing broken Salesforce instances that grew organically without a plan',
    includedServices: [
      'Technical Debt Cleanup',
      'Process Automation',
      'Migration & Data Import',
      'Sales Team Training',
      'Security & Compliance',
    ],
    serviceIds: ['cleanup', 'automation', 'migration', 'training', 'security'],
    youNeedThisIf: [
      'Sales team spends 4+ hours/day on data entry',
      'Inherited a Salesforce disaster',
      'Previous consultant made it worse',
    ],
    timeline: '6-12 weeks',
    investment: '$25K-50K',
    roi: 'Save $150K+ rebuild costs',
    gradient: 'from-white/10 to-white/5',
    icon: (
      <svg className="h-8 w-8 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'AI & Data Cloud Integration',
    subtitle: 'For Series B SaaS competing with enterprise players',
    description: 'Competing with enterprise players using AI-powered revenue operations',
    includedServices: [
      'AI & AgentForce Implementation',
      'Data Cloud Integration',
      'Revenue Forecasting Setup',
      'Third-Party Integrations',
      'Custom Lightning Components',
    ],
    serviceIds: ['ai', 'datacloud', 'forecasting', 'integrations', 'lightning'],
    youNeedThisIf: [
      'Competitors use AI, you\'re still manual',
      'Need AgentForce or Data Cloud',
      'Want predictive analytics for revenue',
    ],
    timeline: '10-16 weeks',
    investment: '$40K-70K',
    roi: 'Competitive advantage + efficiency gains',
    gradient: 'from-white/10 to-white/5',
    icon: (
      <svg className="h-8 w-8 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

const comparisonData = [
  {
    solution: 'Hire RevOps Manager',
    cost: '$160K/yr',
    timeToValue: '6-9 months',
    risk: 'High',
    ongoingCost: '$180K+ annually',
  },
  {
    solution: 'Salesforce Partner',
    cost: '$150K-300K',
    timeToValue: '6-12 months',
    risk: 'Medium',
    ongoingCost: '$50K+ maintenance',
  },
  {
    solution: 'DIY with Internal Team',
    cost: '$0 upfront',
    timeToValue: '12-18+ months',
    risk: 'Very High',
    ongoingCost: 'Opportunity cost',
  },
  {
    solution: 'Revelate (6-16 week engagement)',
    cost: '$35K-70K',
    timeToValue: 'Week 1 insights',
    risk: 'Low',
    ongoingCost: 'Flexible hourly',
    highlight: true,
  },
];

const caseStudies = [
  {
    company: 'Series B SaaS Company | $25M ARR | 120 Employees',
    result:
      'Reduced operational backlog by 46% while maintaining 100% system uptime during brownfield redesign. Sales team productivity increased throughout the transition.',
    metric: '46%',
    metricLabel: 'backlog reduction',
  },
  {
    company: 'Series B SaaS Company | $18M ARR | 85 Employees',
    result:
      'Unified Salesforce, NetSuite, and product analytics into single source of truth. Board now receives consistent, real-time revenue reporting across all systems.',
    metric: '3 systems',
    metricLabel: 'integrated',
  },
  {
    company: 'Series B SaaS Company | $32M ARR | 150 Employees',
    result:
      'Deployed AgentForce AI for automated lead routing and qualification. Sales team now focuses on high-value activities with AI-powered lead scoring.',
    metric: '100%',
    metricLabel: 'lead automation',
  },
];

export default function ServicesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [motionEnabled, setMotionEnabled] = useState(true);
  const motionDisabled = useMemo(
    () => prefersReducedMotion || !motionEnabled,
    [prefersReducedMotion, motionEnabled]
  );

  // Package builder state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<typeof capabilities[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [userInfoModalOpen, setUserInfoModalOpen] = useState(false);


  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const updated = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];

      // Persist to localStorage
      localStorage.setItem('selectedServices', JSON.stringify(updated));
      // Dispatch custom event for same-page updates
      window.dispatchEvent(new Event('customPackageUpdated'));

      return updated;
    });
  };

  const togglePackage = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    // Check if package is currently expanded
    if (expandedPackage === packageId) {
      // Close the package and uncheck its services
      setExpandedPackage(null);
      setSelectedServices(prev => {
        const updated = prev.filter(id => !pkg.serviceIds.includes(id));
        localStorage.setItem('selectedServices', JSON.stringify(updated));
        window.dispatchEvent(new Event('customPackageUpdated'));
        return updated;
      });
    } else {
      // Open the package and check its services
      setExpandedPackage(packageId);
      setSelectedServices(prev => {
        const newServices = [...prev];
        pkg.serviceIds.forEach(id => {
          if (!newServices.includes(id)) {
            newServices.push(id);
          }
        });
        localStorage.setItem('selectedServices', JSON.stringify(newServices));
        window.dispatchEvent(new Event('customPackageUpdated'));
        return newServices;
      });
    }
  };

  // Load selected services from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedServices');
    if (stored) {
      try {
        const services = JSON.parse(stored);
        if (Array.isArray(services)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedServices(services);
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  const openDetailModal = (capability: typeof capabilities[0]) => {
    setSelectedCapability(capability);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedCapability(null);
  };

  const handleUserInfoSubmit = (userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    title: string;
    comments: string;
  }) => {
    // Get selected services details
    const selectedServicesData = capabilities.filter(c =>
      selectedServices.includes(c.id)
    );

    // Generate PDF
    generateCustomPackagePDF(userInfo, selectedServicesData);

    // Close modal
    setUserInfoModalOpen(false);

    // Optional: Show success message or redirect
    // You could add a toast notification here in the future
  };


  return (
    <main className="relative bg-navy">
      {/* Unified Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-[15%] top-[5%] h-[500px] w-[500px] rounded-full bg-cyan/15 blur-[180px]" />
        <div className="absolute left-[10%] top-[40%] h-[600px] w-[600px] rounded-full bg-blue/10 blur-[200px]" />
        <div className="absolute right-[20%] bottom-[20%] h-[450px] w-[450px] rounded-full bg-magenta/12 blur-[180px]" />

        {/* Constellation Effect */}
        <svg className="absolute inset-0 h-full w-full opacity-50" xmlns="http://www.w3.org/2000/svg">
          {/* Connecting lines - form gradually over 45 seconds */}
          <motion.line
            x1="15%" y1="12%" x2="28%" y2="18%"
            stroke="#00d9ff" strokeWidth="1.2" strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 2, ease: "easeInOut" }}
          />
          <motion.line
            x1="28%" y1="18%" x2="35%" y2="25%"
            stroke="#00d9ff" strokeWidth="1.2" strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 8, ease: "easeInOut" }}
          />
          <motion.line
            x1="35%" y1="25%" x2="45%" y2="35%"
            stroke="#5AB3FF" strokeWidth="1" strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3, delay: 14, ease: "easeInOut" }}
          />
          <motion.line
            x1="72%" y1="15%" x2="85%" y2="22%"
            stroke="#5AB3FF" strokeWidth="1.2" strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 20, ease: "easeInOut" }}
          />
          <motion.line
            x1="85%" y1="22%" x2="82%" y2="55%"
            stroke="#00d9ff" strokeWidth="1" strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3, delay: 26, ease: "easeInOut" }}
          />
          <motion.line
            x1="62%" y1="65%" x2="75%" y2="72%"
            stroke="#00d9ff" strokeWidth="1.2" strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 32, ease: "easeInOut" }}
          />
          <motion.line
            x1="18%" y1="78%" x2="32%" y2="85%"
            stroke="#5AB3FF" strokeWidth="1.2" strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 38, ease: "easeInOut" }}
          />
          <motion.line
            x1="12%" y1="48%" x2="18%" y2="78%"
            stroke="#00d9ff" strokeWidth="1" strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3, delay: 44, ease: "easeInOut" }}
          />

          {/* Stars/nodes - appear then pulse */}
          <motion.circle cx="15%" cy="12%" r="2.5" fill="#00d9ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 1, 0.6], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity, repeatDelay: 0, times: [0, 0.33, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="28%" cy="18%" r="2.5" fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0.9, 0.5], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4, delay: 5, repeat: Infinity, repeatDelay: 0, times: [0, 0.25, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="35%" cy="25%" r="2" fill="#5AB3FF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0.85, 0.5], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3.5, delay: 11, repeat: Infinity, repeatDelay: 0, times: [0, 0.29, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="72%" cy="15%" r="2.5" fill="#00d9ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 1, 0.6], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3.2, delay: 17, repeat: Infinity, repeatDelay: 0, times: [0, 0.31, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="85%" cy="22%" r="2" fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0.9, 0.5], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3.8, delay: 23, repeat: Infinity, repeatDelay: 0, times: [0, 0.26, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="62%" cy="65%" r="2.5" fill="#5AB3FF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 1, 0.6], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3.3, delay: 29, repeat: Infinity, repeatDelay: 0, times: [0, 0.30, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="75%" cy="72%" r="2" fill="#00d9ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0.85, 0.5], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.2, delay: 35, repeat: Infinity, repeatDelay: 0, times: [0, 0.24, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="18%" cy="78%" r="2.5" fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0.95, 0.6], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3.6, delay: 41, repeat: Infinity, repeatDelay: 0, times: [0, 0.28, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="32%" cy="85%" r="2" fill="#5AB3FF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0.85, 0.5], scale: [0, 1, 1, 1] }}
            transition={{ duration: 3.9, delay: 47, repeat: Infinity, repeatDelay: 0, times: [0, 0.26, 0.5, 1], ease: "easeInOut" }}
          />

          {/* Additional scattered stars - appear later */}
          <motion.circle cx="45%" cy="35%" r="1.5" fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0.7, 0.4], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.5, delay: 10, repeat: Infinity, repeatDelay: 0, times: [0, 0.22, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="58%" cy="42%" r="1.5" fill="#00d9ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0.75, 0.4], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.1, delay: 18, repeat: Infinity, repeatDelay: 0, times: [0, 0.24, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="82%" cy="55%" r="1.5" fill="#5AB3FF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0.75, 0.4], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.3, delay: 25, repeat: Infinity, repeatDelay: 0, times: [0, 0.23, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="12%" cy="48%" r="1.5" fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0.7, 0.4], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.7, delay: 33, repeat: Infinity, repeatDelay: 0, times: [0, 0.21, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="50%" cy="55%" r="1.2" fill="#00d9ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0.65, 0.3], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.4, delay: 40, repeat: Infinity, repeatDelay: 0, times: [0, 0.23, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="38%" cy="48%" r="1.2" fill="#5AB3FF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0.6, 0.3], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.6, delay: 48, repeat: Infinity, repeatDelay: 0, times: [0, 0.22, 0.5, 1], ease: "easeInOut" }}
          />
          <motion.circle cx="65%" cy="38%" r="1.2" fill="#ffffff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0.65, 0.3], scale: [0, 1, 1, 1] }}
            transition={{ duration: 4.2, delay: 55, repeat: Infinity, repeatDelay: 0, times: [0, 0.24, 0.5, 1], ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 sm:pt-40 sm:pb-20 md:pt-44 lg:pt-48 text-white z-10">
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.span
            className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan"
            initial={motionDisabled ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: motionDisabled ? 0 : 0.1 }}
          >
            Salesforce Expertise for Series B SaaS
          </motion.span>

          <motion.h1
            className="mt-5 text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl"
            initial={motionDisabled ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: motionDisabled ? 0 : 0.2 }}
          >
            Fix Your Salesforce, Close More Deals
          </motion.h1>

          <motion.p
            className="mt-6 mx-auto max-w-2xl text-lg leading-[1.6] text-white/80 md:text-xl"
            initial={motionDisabled ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: motionDisabled ? 0 : 0.3 }}
          >
            Stop losing revenue to broken forecasting, manual data entry, and disconnected systems. Get your revenue operations fixed in 6-16 weeks—no full rebuild required.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={motionDisabled ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: motionDisabled ? 0 : 0.4 }}
          >
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-10 py-4 text-base font-semibold text-navy shadow-[0_8px_16px_rgba(0,217,255,0.25)] transition-all duration-200 hover:bg-[#00c4e6] hover:shadow-[0_8px_16px_rgba(0,217,255,0.35)]"
            >
              Get Your Free Assessment
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-white/80"
            initial={motionDisabled ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: motionDisabled ? 0 : 0.5 }}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Week 1 insights
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              46% backlog reduction
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              $35K-70K vs $150K+ agency rebuild
            </span>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="relative py-28 text-white z-10">
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl text-center mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
              Three breaking points
            </span>
            <h2 className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl">
              Your Salesforce instance is the bottleneck preventing $50M ARR
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              These are the symptoms that signal it&apos;s time for intervention
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Your board wants forecast accuracy. Your CRM gives you guesses.',
                label: 'Problem 01',
                icon: (
                  <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                ),
              },
              {
                title: 'Your sales team spends 4 hours/day on manual data entry.',
                label: 'Problem 02',
                icon: (
                  <svg className="h-6 w-6 text-blue" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
              },
              {
                title: 'Your revenue stack doesn\'t talk to itself.',
                label: 'Problem 03',
                icon: (
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
                ),
              },
            ].map((problem, index) => (
              <motion.div
                key={problem.label}
                className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                initial={motionDisabled ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: motionDisabled ? 0 : index * 0.1 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
                <div className="relative space-y-3">
                  <span className="inline-flex h-1 w-14 rounded-full bg-cyan" />
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                    {problem.icon}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                    {problem.label}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-white">{problem.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative py-20 text-white z-10">
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8">
          <div className="mb-16 max-w-3xl text-center mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-white/60">
              Our Expertise
            </span>
            <h2 className="mt-5 text-xl font-semibold leading-[1.2] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              Build Your Custom Package
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Choose a pre-built package or select individual services. Click a package to automatically select its services, or build your own combination.
            </p>
          </div>

          {/* Two Column Layout: Packages Left, Services Right */}
          <div className="grid gap-8 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
            {/* Left Column: Packages */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.05em] text-white/60 mb-4">
                Popular Packages
              </h3>
              {packages.map((pkg, index) => {
                const isExpanded = expandedPackage === pkg.id;
                const accentColors = [
                  { border: 'border-white/30', bg: 'bg-white', text: 'text-white/90', gradient: 'from-white/10 to-white/5' },
                  { border: 'border-white/30', bg: 'bg-white', text: 'text-white/90', gradient: 'from-white/10 to-white/5' },
                  { border: 'border-white/30', bg: 'bg-white', text: 'text-white/90', gradient: 'from-white/10 to-white/5' },
                ];
                const accent = accentColors[index];

                return (
                  <motion.div
                    key={pkg.id}
                    className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 ${
                      isExpanded
                        ? 'border-white/50 bg-white/25 shadow-lg'
                        : 'border-white/30 bg-white/15 hover:border-white/40 hover:bg-white/20'
                    }`}
                    onClick={() => togglePackage(pkg.id)}
                    initial={motionDisabled ? false : { opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: motionDisabled ? 0 : index * 0.1 }}
                  >

                    <div className="p-6">
                      {/* Icon, Title, and Checkbox */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 ${
                          isExpanded ? 'bg-white/10' : 'bg-white/5'
                        }`}>
                          {pkg.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-white leading-tight">
                            {pkg.title}
                          </h4>
                          <p className="text-xs text-white/60 mt-1">{pkg.subtitle}</p>
                        </div>
                        {/* Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePackage(pkg.id);
                          }}
                          className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-300 flex-shrink-0 ${
                            isExpanded
                              ? 'bg-white border-white'
                              : 'border-white/30 hover:border-white/50'
                          }`}
                          aria-label={isExpanded ? `Deselect ${pkg.title}` : `Select ${pkg.title}`}
                        >
                          {isExpanded && (
                            <svg className="h-3 w-3 text-navy" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 pt-3 border-t border-white/10"
                        >
                          <div>
                            <p className="text-sm text-white/80 leading-relaxed">{pkg.description}</p>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-[0.05em] text-white/60">
                              Includes {pkg.serviceIds.length} services:
                            </p>
                            <ul className="space-y-1">
                              {pkg.includedServices.map((service) => (
                                <li key={service} className="flex items-start gap-2 text-xs text-white/80">
                                  <svg className="mt-0.5 h-3.5 w-3.5 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 text-xs">
                            <span className="font-semibold text-white/80">{pkg.roi}</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Collapsed Hint */}
                      {!isExpanded && (
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-medium text-white/60">
                            {pkg.serviceIds.length} services included
                          </span>
                          <span className="text-xs font-semibold text-white/70">
                            Select →
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Individual Services */}
            <div className="space-y-6">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-white/25 text-white border border-white/50'
                        : 'bg-white/15 border border-white/30 text-white/80 hover:border-white/40 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Services Grid */}
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {capabilities
                  .filter(c => activeCategory === 'all' || c.category === activeCategory)
                  .map((capability, index) => {
                  const isSelected = selectedServices.includes(capability.id);

                  return (
                    <motion.div
                      key={capability.id}
                      className="group relative h-full"
                      initial={motionDisabled ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: motionDisabled ? 0 : index * 0.03 }}
                    >
                      <div
                        onClick={() => openDetailModal(capability)}
                        className={`relative h-full flex flex-col overflow-hidden rounded-lg border p-4 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-white/50 bg-white/25'
                            : 'border-white/30 bg-white/15 hover:border-white/40 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/60 transition-all duration-200 ${
                            isSelected ? 'bg-white/10' : 'bg-white/5'
                          }`}>
                            {capability.icon}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(capability.id);
                            }}
                            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all duration-200 ml-auto ${
                              isSelected
                                ? 'bg-white border-white'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            {isSelected && (
                              <svg className="h-2.5 w-2.5 text-navy" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white leading-snug mb-3">
                            {capability.title}
                          </h3>
                          <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-200 flex items-center gap-1">
                            Learn more
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Results - Case Studies */}
      <section className="relative py-28 text-white z-10">

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-magenta">
              Client transformations
            </span>
            <h2 className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl">
              Real results from real organizations
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Revenue operations improvements across SaaS, enterprise, and nonprofit organizations
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study, index) => {
              const accentColors = [
                { text: 'text-cyan', bar: 'bg-cyan' },
                { text: 'text-magenta', bar: 'bg-magenta' },
                { text: 'text-blue', bar: 'bg-blue' },
              ];
              const accent = accentColors[index];

              return (
                <motion.div
                  key={study.company}
                  className="relative flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  initial={motionDisabled ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: motionDisabled ? 0 : index * 0.1 }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14)_0%,rgba(26,31,58,0)_70%)]" />
                  <div className="relative space-y-3">
                    <span className={`inline-flex h-1 w-14 rounded-full ${accent.bar}`} />
                    <div className="space-y-1.5">
                      <p className={`text-[1.85rem] font-semibold leading-tight ${accent.text} md:text-[2.1rem]`}>
                        {study.metric}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                        {study.metricLabel}
                      </p>
                      <p className="text-xs leading-5 text-white/75">
                        {study.result}
                      </p>
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-xs font-medium text-white/60">{study.company}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-20 text-white z-10">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-blue">
              Two paths forward
            </span>
            <h2 className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl">
              The real cost of your Salesforce decision
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Compare your options for fixing revenue operations architecture
            </p>
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="relative hidden md:block overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/20">
                    <th className="pb-4 pr-6 text-left text-xs font-semibold uppercase tracking-[0.05em] text-white/80">
                      Solution
                    </th>
                    <th className="pb-4 pr-6 text-left text-xs font-semibold uppercase tracking-[0.05em] text-white/80">
                      Cost
                    </th>
                    <th className="pb-4 pr-6 text-left text-xs font-semibold uppercase tracking-[0.05em] text-white/80">
                      Time to Value
                    </th>
                    <th className="pb-4 pr-6 text-left text-xs font-semibold uppercase tracking-[0.05em] text-white/80">
                      Risk
                    </th>
                    <th className="pb-4 text-left text-xs font-semibold uppercase tracking-[0.05em] text-white/80">
                      Ongoing Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr
                      key={row.solution}
                      className={`border-b border-white/10 transition-colors ${
                        row.highlight ? 'bg-cyan/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-4 pr-6 font-semibold text-white">{row.solution}</td>
                      <td className="py-4 pr-6 text-white/80">{row.cost}</td>
                      <td className="py-4 pr-6 text-white/80">{row.timeToValue}</td>
                      <td className="py-4 pr-6 text-white/80">{row.risk}</td>
                      <td className="py-4 text-white/80">{row.ongoingCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex items-start gap-2 text-xs text-white/60">
              <svg className="h-4 w-4 flex-shrink-0 mt-0.5 text-cyan/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <circle cx="12" cy="8" r="0.5" fill="currentColor" />
              </svg>
              <p className="leading-relaxed">
                <span className="font-medium">Note:</span> Revelate pricing represents typical engagement ranges. All figures are estimates and non-binding. Actual project costs are determined through consultation and tailored to your specific requirements, scope, and organizational context.
              </p>
            </div>
          </div>

          {/* Mobile Card View (visible only on mobile) */}
          <div className="md:hidden space-y-4">
            {comparisonData.map((row, index) => (
              <motion.div
                key={row.solution}
                className={`relative overflow-hidden rounded-xl border p-5 shadow-lg ${
                  row.highlight
                    ? 'border-cyan/40 bg-cyan/15'
                    : 'border-white/15 bg-white/10'
                }`}
                initial={motionDisabled ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: motionDisabled ? 0 : index * 0.1 }}
              >
                {row.highlight && (
                  <div className="absolute top-0 right-0 bg-cyan px-3 py-1 text-xs font-bold text-navy rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white pr-20">
                    {row.solution}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Cost
                      </p>
                      <p className="text-sm font-medium text-white/90">
                        {row.cost}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Risk
                      </p>
                      <p className="text-sm font-medium text-white/90">
                        {row.risk}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Time to Value
                      </p>
                      <p className="text-sm font-medium text-white/90">
                        {row.timeToValue}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Ongoing Cost
                      </p>
                      <p className="text-sm font-medium text-white/90">
                        {row.ongoingCost}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="mt-6 flex items-start gap-2 text-xs text-white/60 bg-white/5 rounded-lg p-4 border border-white/10">
              <svg className="h-4 w-4 flex-shrink-0 mt-0.5 text-cyan/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <circle cx="12" cy="8" r="0.5" fill="currentColor" />
              </svg>
              <p className="leading-relaxed">
                <span className="font-medium">Note:</span> Revelate pricing represents typical engagement ranges. All figures are estimates and non-binding. Actual project costs are determined through consultation and tailored to your specific requirements, scope, and organizational context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 text-white z-10">

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="overflow-hidden rounded-xl border border-white/30 bg-white/10 px-6 py-10 shadow-[0_8px_12px_rgba(8,13,40,0.6)] backdrop-blur-xl sm:px-8 sm:py-12">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan">
              Next step
            </span>
            <h2 className="mt-6 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl">
              See what&apos;s hiding in your Salesforce instance
            </h2>
            <p className="mt-6 text-base leading-7 text-white/90 md:text-lg md:leading-8">
              Free 15-minute consultation for Series B SaaS leaders. We&apos;ll identify concrete opportunities to optimize your revenue operations in your first call.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-10 py-4 text-base font-semibold text-navy shadow-[0_8px_16px_rgba(0,217,255,0.25)] transition-all duration-200 hover:bg-[#00c4e6] hover:shadow-[0_8px_16px_rgba(0,217,255,0.35)]"
              >
                Book Your Free Assessment
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <p className="mt-6 text-sm text-white/90">
              No obligation. No sales pitch. Just insights.
            </p>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {detailModalOpen && selectedCapability && (() => {
        const categoryTheme = categories.find(cat => cat.id === selectedCapability.category) || categories[0];
        const iconColor = categoryTheme.iconColor;
        const bgColor = categoryTheme.bgColor;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeDetailModal}>
            <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#dbe3f0] bg-white p-6 shadow-[0_20px_60px_rgba(17,27,58,0.3)] sm:p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeDetailModal}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] text-navy transition-colors hover:bg-[#e2e8f0]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${bgColor}/10 ${iconColor}`}>
                {selectedCapability.icon}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-semibold text-navy">{selectedCapability.title}</h2>

              {/* Detailed Description */}
              <p className="mt-4 text-base leading-relaxed text-[#334155]">
                {selectedCapability.detailedDescription}
              </p>

              {/* Deliverables */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.05em] text-[#64748b]">
                  Deliverables
                </h3>
                <ul className="mt-3 space-y-2">
                  {selectedCapability.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-navy">
                      <svg className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Package Button */}
              <button
                onClick={() => {
                  toggleService(selectedCapability.id);
                }}
                className={`mt-6 w-full rounded-lg px-6 py-3 text-base font-semibold transition-all duration-300 ${
                  selectedServices.includes(selectedCapability.id)
                    ? 'bg-cyan/10 text-cyan border border-cyan/40'
                    : 'bg-gradient-to-r from-cyan to-blue text-navy hover:shadow-lg'
                }`}
              >
                {selectedServices.includes(selectedCapability.id) ? 'Remove from Package' : 'Add to Package'}
              </button>
            </motion.div>
          </div>
        );
      })()}


      {/* User Info Modal */}
      <UserInfoModal
        isOpen={userInfoModalOpen}
        onClose={() => setUserInfoModalOpen(false)}
        onSubmit={handleUserInfoSubmit}
        selectedServicesCount={selectedServices.length}
      />
    </main>
  );
}
