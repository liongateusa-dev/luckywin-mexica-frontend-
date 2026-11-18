// ---------------------------------------------------------------------------
// LuckyWin Mexica — site configuration
// Edit the values below to update WhatsApp number, cycle label, etc.
// This is the ONLY file that should need editing for basic content changes.
// ---------------------------------------------------------------------------
// Prize counts, winner totals, and cash USD/MXN values are NO LONGER
// configured here — they come live from the backend database via
// GET /api/cycle/current (see lib/usePrizeData.js), which is what keeps
// every number on the site in sync with the admin dashboard's
// PrizeTier.totalPerCycle values instead of drifting out of sync with a
// hardcoded frontend constant (the earlier 38-vs-42 mismatch bug).
//
// This file now only holds things that are genuinely static config, not
// live data.

// Replace with the real WhatsApp number in international format, no spaces,
// no leading "+". Example: "5215512345678" for a Mexico mobile number.
export const WHATSAPP_NUMBER_PLACEHOLDER = "521XXXXXXXXXX";

export function getWhatsAppLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const CYCLE_LENGTH_LABEL = "monthly"; // informational only in this phase

// NOTE: the real draw, odds, and inventory tracking live entirely in the
// Part 2 backend (see drawService.js there). This frontend no longer runs
// any win/lose logic of its own — /jugar calls the backend API and
// displays whatever it returns.
