// Motion durations (ms) — the single source of truth shared by components AND
// the Playwright suite (tests import this module directly). Changing a value
// here retunes both the UI and the test wait windows together, ending the era
// of hand-synced OPEN_MS/SWITCH_MS constants.
//
// Components must gate every use behind prefers-reduced-motion (0ms path).
export const DUR = {
  view: 400,      // compass view swap (scene cross-fade)
  folioTurn: 520, // folio "turn page" vesica cross-fade
  panel: 380,     // role panel / overlay in-out
};
