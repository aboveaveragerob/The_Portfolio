import { error } from '@sveltejs/kit';
import { bookBySlug, allSlugs } from '$lib/content/archive.js';

export function load({ params }) {
  const found = bookBySlug(params.slug);
  if (!found) error(404, 'No such volume in the archive');
  return { wing: found.wing, book: found.book };
}

// Every volume page is emitted even if a link were missed by the crawler.
export function entries() {
  return allSlugs.map((slug) => ({ slug }));
}
