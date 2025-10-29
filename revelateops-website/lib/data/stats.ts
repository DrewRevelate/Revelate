export interface IndustryStat {
  number: string;
  label: string;
  source: string;
  year: string;
  url: string;
  tooltip: string;
}

export const industryStats: readonly IndustryStat[] = [
  {
    number: '91%',
    label: 'of CRM data is incomplete or missing critical fields',
    source: 'Salesforce/Validity',
    year: '2024',
    url: 'https://www.validity.com/resource-center/the-state-of-crm-data-management-in-2024/',
    tooltip: "Source: 'The State of CRM Data Management in 2024' - Validity, 2024. Salesforce estimates 91% of CRM data is incomplete.",
  },
  {
    number: '$12.9M',
    label: 'average annual cost of poor data quality per organization',
    source: 'Gartner',
    year: '2021',
    url: 'https://www.gartner.com/smarterwithgartner/how-to-improve-your-data-quality',
    tooltip: "Source: 'How to Improve Your Data Quality' - Gartner Research, 2021. Organizations lose $12.9M annually on average due to poor data quality.",
  },
  {
    number: '70%',
    label: 'of sales rep time spent on non-selling activities',
    source: 'Salesforce',
    year: '2024',
    url: 'https://www.salesforce.com/content/dam/web/en_us/www/documents/research/salesforce-state-of-sales-report-6-ed.pdf',
    tooltip: "Source: 'State of Sales Report, 6th Edition' - Salesforce Research, 2024. Sales reps spend only 30% of their time actually selling.",
  },
  {
    number: '$18M',
    label: 'average wasted annually on unused SaaS licenses',
    source: 'Zylo',
    year: '2024',
    url: 'https://zylo.com/news/2024-saas-management-index/',
    tooltip: "Source: '2024 SaaS Management Index' - Zylo. Companies waste $18M on average annually, with 53% of licenses going unused.",
  },
] as const;

export interface SignalStat {
  title: string;
  detail: string;
  stat: string;
  source: string;
  sourceUrl: string;
}

export interface RebuildCostStat {
  range: string;
  description: string;
  source: string;
  year: string;
  url: string;
}

export const rebuildCostStat: RebuildCostStat = {
  range: '$150K-$200K+',
  description: 'Complex Salesforce implementations and rebuilds',
  source: 'Peergenics',
  year: '2024-2025',
  url: 'https://www.peergenics.com/post/salesforce-consulting-services-cost-in-the-usa-2024-2025',
} as const;

export const signalsWithStats: readonly SignalStat[] = [
  {
    title: 'Forecast drift every Monday',
    detail:
      'Board deck and Salesforce drift by double digits. Leadership exports to spreadsheets to get "real" numbers.',
    stat: 'Only 20% of orgs forecast within 5% accuracy',
    source: '(Xactly, 2024)',
    sourceUrl: 'https://www.xactlycorp.com/resources/guides/2024-sales-forecasting-benchmark-report',
  },
  {
    title: 'Automations cascade unpredictably',
    detail:
      'Legacy Flow, Apex, Pardot, and middleware jobs collide. A routing tweak ripples into entitlement or marketing SLAs.',
    stat: '20% of IT budget consumed by tech debt maintenance',
    source: '(Forrester, 2024)',
    sourceUrl: 'https://www.forrester.com/blogs/manage-tech-debt-urgently-to-prevent-tech-bankruptcy/',
  },
  {
    title: 'Integrations play the blame game',
    detail:
      'Product telemetry, marketing ops, and finance sync on different cadences so duplicates and stale ARR figures linger for days.',
    stat: '81% cite integration as barrier to transformation',
    source: '(MuleSoft, 2024)',
    sourceUrl: 'https://www.mulesoft.com/lp/reports/connectivity-benchmark',
  },
  {
    title: 'RevOps backlog balloons',
    detail:
      'Hundreds of Jira tickets need tribal knowledge from vendors who already left. Teams wait because production feels brittle.',
    stat: '32.7 hours/month wasted on manual CRM data entry',
    source: '(ProcessMaker, 2024)',
    sourceUrl: 'https://www.processmaker.com/blog/repetitive-tasks-at-work-research-and-statistics-2024/',
  },
] as const;
