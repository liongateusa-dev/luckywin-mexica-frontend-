// ---------------------------------------------------------------------------
// LuckyWin Mexica — site configuration
// Edit the values below to update prize counts, WhatsApp number, etc.
// This is the ONLY file that should need editing for basic content changes.
// ---------------------------------------------------------------------------

// Replace with the real WhatsApp number in international format, no spaces,
// no leading "+". Example: "5215512345678" for a Mexico mobile number.
export const WHATSAPP_NUMBER_PLACEHOLDER = "521XXXXXXXXXX";

export function getWhatsAppLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

// Prize tiers for the current cycle. Keys match the translation dictionaries
// in /messages/es.json and /messages/en.json (prizes.<key>, prizes.<key>Winners).
export const PRIZE_TIERS = [
  { key: "cash", winners: 5 },
  { key: "iphone", winners: 5 },
  { key: "ps5", winners: 10 },
  { key: "laptop", winners: 10 },
  { key: "giftcard", winners: 10 },
];

export const TOTAL_WINNERS_PER_CYCLE = PRIZE_TIERS.reduce(
  (sum, tier) => sum + tier.winners,
  0
); // 40

export const CYCLE_LENGTH_LABEL = "monthly"; // informational only in this phase

// NOTE: the real draw, odds, and inventory tracking live entirely in the
// Part 2 backend (see drawService.js there). This frontend no longer runs
// any win/lose logic of its own — /jugar calls the backend API and
// displays whatever it returns.
