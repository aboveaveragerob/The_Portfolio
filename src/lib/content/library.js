// Library wall model: wings, their shelved books, and URL slugs.
// data.js remains the untouched prose source of truth — but the library
// SHELVES differently than the prose is filed: omnibus volumes that really
// contain many works (Woodworking's projects and guides, the Technology
// collection) are exploded into their individual books at this layer. Each
// derived book carries one chapter of the parent and opens as its own folio.
import { wings } from '$lib/data.js';

// chapterId → its own shelf book. Title comes from the chapter itself.
const EXPLODE = {
  'book-woodworking': {
    'ch-wood-furniture': { slug: 'furniture', subtitle: 'A woodworking project', coverColor: '#5a4632' },
    'ch-wood-restorations': { slug: 'restorations', subtitle: 'Second lives for old pieces', coverColor: '#4f3a28' },
    'ch-wood-builtins': { slug: 'built-ins', subtitle: 'Carpentry that stays', coverColor: '#61452c' },
    'ch-wood-renovations': { slug: 'renovations', subtitle: 'Rooms remade', coverColor: '#54402f' },
    'ch-wood-outdoor': { slug: 'outdoor-builds', subtitle: 'Weathered work', coverColor: '#4a3a2a' },
    'ch-wood-enclosure': { slug: 'weatherproof-enclosure', subtitle: 'A woodworking field guide', coverColor: '#6b4f31' },
    'ch-wood-pony-wall': { slug: 'pony-wall', subtitle: 'A woodworking field guide', coverColor: '#5e4630' },
    'ch-wood-non-load-bearing-wall': { slug: 'non-load-bearing-wall', subtitle: 'A woodworking field guide', coverColor: '#57422d' },
    'ch-wood-route-edges': { slug: 'routing-a-finished-edge', subtitle: 'A woodworking field guide', coverColor: '#634a2f' },
    'ch-wood-ottoman-table': { slug: 'c-shaped-ottoman-table', subtitle: 'A woodworking field guide', coverColor: '#59452e' },
    'ch-wood-drywall-repair': { slug: 'drywall-repair', subtitle: 'A woodworking field guide', coverColor: '#4d3c2b' },
  },
  'book-technology': {
    'ch-tech-builds': { slug: 'pc-builds', subtitle: 'Machines from parts', coverColor: '#26436b' },
    'ch-tech-repairs': { slug: 'repairs-and-mods', subtitle: 'Opened, fixed, improved', coverColor: '#203a5e' },
    'ch-tech-homelab': { slug: 'home-lab', subtitle: 'Services under the stairs', coverColor: '#2b4a75' },
    'ch-tech-apps': { slug: 'apps', subtitle: 'Small software, real uses', coverColor: '#1d3556' },
    'ch-tech-data': { slug: 'data', subtitle: 'Numbers put to work', coverColor: '#294367' },
    'ch-tech-router-hardening': { slug: 'router-hardening', subtitle: 'A technology field guide', coverColor: '#22406a' },
    'ch-tech-android-dev': { slug: 'android-development', subtitle: 'A technology field guide', coverColor: '#1f3a60' },
    'ch-tech-data-privacy': { slug: 'data-privacy', subtitle: 'A technology field guide', coverColor: '#25406e' },
  },
};

// Slugs for books shelved whole.
const WHOLE_SLUGS = {
  'book-brinker': 'brinker-capital',
  'book-pnc-wm': 'pnc-wealth-management',
  'book-pnc-bank': 'pnc-bank',
  'book-eddie-bauer': 'eddie-bauer',
  'book-education': 'education-licensing',
  'book-skillset': 'skillset-technologies',
  'book-phs': 'phs-flower-show',
  'book-composting': 'community-composting',
  'book-upholstery': 'upholstery',
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

function shelfBooks(wing) {
  return wing.books.flatMap((book) => {
    const defs = EXPLODE[book.id];
    if (!defs) return [book];
    return book.chapters.map((ch) => {
      const def = defs[ch.id];
      return {
        id: `x-${ch.id}`,
        title: ch.title,
        subtitle: def?.subtitle ?? book.subtitle,
        coverColor: def?.coverColor ?? book.coverColor,
        chapters: [ch],
        _slug: def?.slug ?? ch.id,
      };
    });
  });
}

// One shelf per wing, in data.js order, with exploded books in place.
export const shelves = wings.map((w) => ({
  wingId: w.id,
  title: w.title,
  accent: w.accent,
  theme: w.theme,
  books: shelfBooks(w),
}));

// bookId → slug across whole and derived books.
export const slugFor = Object.fromEntries(
  shelves.flatMap((s) => s.books.map((b) => [b.id, b._slug ?? WHOLE_SLUGS[b.id]]))
);

export const allSlugs = Object.values(slugFor);

const bySlug = new Map(
  shelves.flatMap((s) => s.books.map((b) => [slugFor[b.id], { wing: s, book: b }]))
);

export function bookBySlug(slug) {
  return bySlug.get(slug) ?? null;
}
