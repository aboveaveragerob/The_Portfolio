// Library wall model: wing-paged shelves and URL slugs for every volume.
// data.js remains the single source of truth for books/chapters/pages —
// this module only maps ids to routes and groups books for the carousel.
import { wings } from '$lib/data.js';

export const slugFor = {
  'book-brinker': 'brinker-capital',
  'book-pnc-wm': 'pnc-wealth-management',
  'book-pnc-bank': 'pnc-bank',
  'book-eddie-bauer': 'eddie-bauer',
  'book-education': 'education-licensing',
  'book-skillset': 'skillset-technologies',
  'book-phs': 'phs-flower-show',
  'book-composting': 'community-composting',
  'book-woodworking': 'woodworking',
  'book-upholstery': 'upholstery',
  'book-technology': 'technology',
  'book-stromboli': 'stromboli',
  'book-windows-recovery': 'windows-data-recovery',
  'book-linux': 'linux',
  'book-arboriculture': 'arboriculture',
  'book-horticulture': 'horticulture',
  'book-hydroponics': 'hydroponics',
  'book-cognitive-playbook': 'cognitive-playbook',
  'book-philosophy': 'philosophy',
  'book-alices-guide': 'alices-guide',
  'book-master-watershed': 'master-watershed',
  'book-seeds': 'seeds',
  'book-music': 'music-audio-production',
  'book-wedding-vows': 'wedding-vows',
  'book-celebrations': 'celebrations',
  'book-birth-chart': 'birth-chart',
  'book-rpdr-draft': 'rpdr-draft',
  'book-concerts': 'concerts',
  'book-movies': 'movies',
  'book-date-nights': 'date-nights',
};

const bookForSlug = Object.fromEntries(
  Object.entries(slugFor).map(([bookId, slug]) => [slug, bookId])
);

export const allSlugs = Object.values(slugFor);

// One carousel page per wing, in data.js order.
export const shelves = wings.map((w) => ({
  wingId: w.id,
  title: w.title,
  accent: w.accent,
  theme: w.theme,
  books: w.books,
}));

export function bookBySlug(slug) {
  const bookId = bookForSlug[slug];
  if (!bookId) return null;
  for (const wing of wings) {
    const book = wing.books.find((b) => b.id === bookId);
    if (book) return { wing, book };
  }
  return null;
}

export function bookById(bookId) {
  const slug = slugFor[bookId];
  return slug ? bookBySlug(slug) : null;
}
