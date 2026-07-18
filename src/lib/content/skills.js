// The Constellation Map — five skill areas as hand-authored constellations.
// Hand-authored coordinates (not force layout): deterministic, art-directable,
// and positions are permanent. Each constellation is loosely framed on a
// Platonic-solid wireframe; `bookId` deep-links a node to its Archive volume.
// `bright` marks the civic-work stars (PHS, Community Composting) — sustained
// commitments that shine inside Horticulture rather than orbiting as jobs.
export const MAP_W = 1600, MAP_H = 1000;
export const ZOOM_SCALE = 2.2;

export const constellations = [
  {
    id: 'finops',
    label: 'Financial Operations',
    solid: 'cube',
    accent: 'var(--sapphire)',
    nodes: [
      { id: 'workflow', label: 'Workflow & Automation', x: 240, y: 180, bookId: 'book-skillset' },
      { id: 'analytics', label: 'Analytics & Oversight', x: 425, y: 150, bookId: 'book-skillset' },
      { id: 'execution', label: 'Trade Execution', x: 205, y: 330, bookId: 'book-skillset' },
      { id: 'risk', label: 'Risk & Compliance', x: 395, y: 315, bookId: 'book-skillset' },
      { id: 'platforms', label: 'Platforms & Tools', x: 315, y: 240, bookId: 'book-skillset' },
    ],
    edges: [
      ['workflow', 'analytics'], ['analytics', 'risk'], ['risk', 'execution'],
      ['execution', 'workflow'], ['workflow', 'platforms'], ['analytics', 'platforms'],
      ['execution', 'platforms'], ['risk', 'platforms'],
    ],
  },
  {
    id: 'tech',
    label: 'Technology',
    solid: 'octa',
    accent: 'var(--violet)',
    nodes: [
      { id: 'builds', label: 'Builds', x: 1280, y: 125, bookId: 'book-technology' },
      { id: 'repairs', label: 'Repairs & Mods', x: 1400, y: 195, bookId: 'book-technology' },
      { id: 'privacy', label: 'Data Privacy', x: 1400, y: 330, bookId: 'book-technology' },
      { id: 'homelab', label: 'Home Lab', x: 1280, y: 400, bookId: 'book-technology' },
      { id: 'apps', label: 'Apps', x: 1160, y: 330, bookId: 'book-technology' },
      { id: 'data', label: 'Data', x: 1160, y: 195, bookId: 'book-technology' },
    ],
    edges: [
      ['builds', 'repairs'], ['repairs', 'privacy'], ['privacy', 'homelab'],
      ['homelab', 'apps'], ['apps', 'data'], ['data', 'builds'],
      ['builds', 'homelab'], ['data', 'privacy'], ['apps', 'repairs'],
    ],
  },
  {
    id: 'wood',
    label: 'Woodworking',
    solid: 'tetra',
    accent: 'var(--rose)',
    // Top-center — the map's center belongs to the always-visible sun.
    nodes: [
      { id: 'furniture', label: 'Furniture', x: 800, y: 95, bookId: 'book-woodworking' },
      { id: 'restorations', label: 'Restorations', x: 690, y: 265, bookId: 'book-woodworking' },
      { id: 'builtins', label: 'Built-Ins', x: 910, y: 265, bookId: 'book-woodworking' },
      { id: 'guides', label: 'Build Guides', x: 800, y: 195, bookId: 'book-woodworking' },
    ],
    edges: [
      ['furniture', 'restorations'], ['restorations', 'builtins'], ['builtins', 'furniture'],
      ['furniture', 'guides'], ['restorations', 'guides'], ['builtins', 'guides'],
    ],
  },
  {
    id: 'hort',
    label: 'Horticulture',
    solid: 'icosa',
    accent: '#5ef2a0',
    nodes: [
      { id: 'arboriculture', label: 'Arboriculture', x: 245, y: 635, bookId: 'book-arboriculture' },
      { id: 'tropicals', label: 'Tropicals', x: 390, y: 595, bookId: 'book-horticulture' },
      { id: 'phs', label: 'PHS Flower Show', x: 505, y: 655, bookId: 'book-phs', bright: true },
      { id: 'gardening', label: 'Gardening', x: 350, y: 725, bookId: 'book-horticulture' },
      { id: 'composting', label: 'Community Composting', x: 470, y: 800, bookId: 'book-composting', bright: true },
      { id: 'hydroponics', label: 'Hydroponics', x: 205, y: 780, bookId: 'book-hydroponics' },
    ],
    edges: [
      ['arboriculture', 'tropicals'], ['tropicals', 'phs'], ['phs', 'composting'],
      ['composting', 'gardening'], ['gardening', 'hydroponics'], ['hydroponics', 'arboriculture'],
      ['gardening', 'tropicals'], ['gardening', 'arboriculture'],
    ],
  },
  {
    id: 'music',
    label: 'Music',
    solid: 'dodeca',
    accent: '#e58fb1',
    nodes: [
      { id: 'production', label: 'Production', x: 1270, y: 640, bookId: 'book-music' },
      { id: 'signal', label: 'Signal Flow', x: 1165, y: 725, bookId: 'book-music' },
      { id: 'gain', label: 'Gain Staging', x: 1215, y: 845, bookId: 'book-music' },
      { id: 'arrangement', label: 'Effects & Arrangement', x: 1345, y: 845, bookId: 'book-music' },
      { id: 'discography', label: 'Discography', x: 1385, y: 715, bookId: 'book-music', bright: true },
    ],
    edges: [
      ['production', 'signal'], ['signal', 'gain'], ['gain', 'arrangement'],
      ['arrangement', 'discography'], ['discography', 'production'],
      ['production', 'gain'], ['production', 'arrangement'],
    ],
  },
];

// Cross-disciplinary ties — rendered as dashed gold lines with a legend so
// the meaning is never carried by color alone.
export const crossLinks = [
  { from: 'finops.analytics', to: 'tech.data', why: 'Power BI & Python analytics' },
  { from: 'tech.apps', to: 'music.production', why: 'audio tooling' },
  { from: 'hort.gardening', to: 'wood.guides', why: 'garden build projects' },
];

// Precomputed centroids (zoom targets), module scope for SSR determinism.
export const centroids = Object.fromEntries(
  constellations.map((c) => {
    const cx = c.nodes.reduce((a, n) => a + n.x, 0) / c.nodes.length;
    const cy = c.nodes.reduce((a, n) => a + n.y, 0) / c.nodes.length;
    return [c.id, { x: +cx.toFixed(1), y: +cy.toFixed(1) }];
  })
);

export function nodeByPath(path) {
  const [cid, nid] = path.split('.');
  const c = constellations.find((k) => k.id === cid);
  return c?.nodes.find((n) => n.id === nid);
}
