import { error } from '@sveltejs/kit';
import { roles } from '$lib/content/roles.js';

export function load({ params }) {
  const idx = roles.findIndex((r) => r.id === params.role);
  if (idx === -1) error(404, 'No such body in this orbit');
  return {
    role: roles[idx],
    // roles are ordered most-recent first: "earlier" walks down the array,
    // "later" walks up.
    prev: roles[idx + 1] ?? null,
    next: roles[idx - 1] ?? null,
  };
}

// Belt-and-braces for the prerender crawler: every role page is emitted even
// if a link were missed.
export function entries() {
  return roles.map((r) => ({ role: r.id }));
}
