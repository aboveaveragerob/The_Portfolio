// Structured employment data for the Career Orbit. The prose source of truth
// stays in src/lib/data.js (each role links to its full volume via bookId);
// the summary blocks here are short distillations for the orbit's role panel.
//
// AS_OF is a hardcoded build-era stamp, never `new Date()` — a runtime clock
// would make server and client compute different tenures and break hydration.
export const AS_OF = '2026-07';

// Start months: Brinker is exact (book subtitle "Feb 2021"); the other roles
// are recorded year-only in data.js, so their months are mid-year estimates
// that only affect planet sizing, never displayed text (display uses `dates`).
export const roles = [
  {
    id: 'brinker',
    bookId: 'book-brinker',
    org: 'Brinker Capital',
    accent: '#fcd34d',
    title: 'UMA Trading & Operations',
    dates: 'Feb 2021 – Present',
    start: '2021-02',
    end: null,
    summary: [
      'Executes daily equity trades across multi-sleeve UMA portfolios under a 24-hour SLA — rebalancing, liquidity events, tax-sensitive transitions, and custom blends for high-net-worth accounts.',
      'Built the firm’s first trading KPI dashboard in Power BI, credited with cutting Docupace processing time 25%+ firm-wide, and is extending it into real-time monitoring for AI-agent-driven workflow automation.',
      'Caught a $500M share-quantity error at the auction stage — after it had cleared every upstream check — while covering the Director of Trading’s desk.',
      'Designed and ran the cross-training program that scaled the desk from one UMA trader to six.',
    ],
  },
  {
    id: 'pnc-wm',
    bookId: 'book-pnc-wm',
    org: 'PNC Wealth Management',
    accent: '#4a7cf7',
    title: 'Portfolio & Trust Administrator',
    dates: '2019 – 2021',
    start: '2019-06',
    end: '2021-02',
    summary: [
      'Administered irrevocable trust portfolios in the Irrevocable Trust Specialty Group — tax-loss harvesting, liquidity management, and Reg 9 compliance workflows.',
      'Presented Reg 9 exceptions biannually to the Investment Committee in support of regulatory and internal-risk assessments.',
      'Produced ad hoc performance reporting and asset-allocation analysis for portfolio reviews.',
    ],
  },
  {
    id: 'pnc-bank',
    bookId: 'book-pnc-bank',
    org: 'PNC Bank',
    accent: '#8b5cf6',
    title: 'Financial Services Associate',
    dates: '2017 – 2019',
    start: '2017-06',
    end: '2019-06',
    summary: [
      'Supported advisors across personal banking, lending, and account maintenance at a high-volume retail branch.',
      'Partnered with Mortgage, Investments, Business Banking, and Wealth Management on integrated client financial plans.',
    ],
  },
  {
    id: 'eddie-bauer',
    bookId: 'book-eddie-bauer',
    org: 'Eddie Bauer',
    accent: '#e8a87c',
    title: 'Visual Merchandising Lead',
    dates: '2013 – 2017',
    start: '2013-06',
    end: '2017-06',
    summary: [
      'Ran visual merchandising at the King of Prussia store — one of the highest-volume locations in the country — executing every monthly corporate reset to a proving-ground standard.',
      'Hired and trained a visual team from the ground up, and helped open two additional stores.',
      'Closed out one year as the top salesperson in the Northeast region, on the way to promotion into assistant manager.',
    ],
  },
];

// Whole-month tenure from 'YYYY-MM' strings; open roles run to AS_OF.
export function tenureMonths(role) {
  const [sy, sm] = role.start.split('-').map(Number);
  const [ey, em] = (role.end ?? AS_OF).split('-').map(Number);
  return (ey - sy) * 12 + (em - sm);
}

export function roleById(id) {
  return roles.find((r) => r.id === id);
}
