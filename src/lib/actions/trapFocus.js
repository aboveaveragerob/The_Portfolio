// Focus trap for the Folio dialog: Tab cycles within the node. Escape is
// handled by the dialog itself (navigation), not here.
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, audio[controls], [tabindex]:not([tabindex="-1"])';

export function trapFocus(node) {
  function onKeydown(e) {
    if (e.key !== 'Tab') return;
    const els = [...node.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
    );
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !node.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !node.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }
  node.addEventListener('keydown', onKeydown);
  return {
    destroy() {
      node.removeEventListener('keydown', onKeydown);
    },
  };
}
