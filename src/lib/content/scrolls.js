// Structured credential facts for the Scrolls view. The narrative version
// lives in data.js (book-education); tabs need fields, so the facts are
// restructured here — same content, no inventions.
export const scrolls = {
  degrees: [
    {
      credential: 'Bachelor of Science in Accounting',
      distinction: 'magna cum laude',
      institution: 'Maryville University',
      place: 'St. Louis',
      date: 'May 2021',
      note: 'The foundation for a career that turned out to be less about the numbers themselves and more about the systems that produce them.',
    },
  ],
  licenses: [
    {
      credential: 'Series 65',
      detail: 'Uniform Investment Adviser Law Examination',
      note: 'Held alongside daily trade execution and Reg 9 compliance work.',
    },
  ],
  certificates: [
    {
      credential: 'Python in Excel',
      issuer: 'LinkedIn',
      note: 'With working Python built through continued self-study.',
    },
  ],
};

export const TABS = [
  { id: 'degrees', label: 'Degrees' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'certificates', label: 'Certificates' },
];
