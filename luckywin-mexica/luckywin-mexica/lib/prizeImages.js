// Single source of truth mapping a PrizeTier.key (from the backend) to
// its static box/reveal image under /public/prizes/. Add a new prize
// on the backend (POST /api/admin/prize-tiers) with a matching key,
// drop the image file in /public/prizes/<key>.jpg (or .png/.webp), and
// add one line here — that's the whole "new prize" workflow on the
// frontend side.
export const CASH_TIERS = ["cash5k", "cash10k", "cash15k"];

export const PRIZE_IMAGES = {
  cash5k: "/prizes/cash.jpg",
  cash10k: "/prizes/cash.jpg",
  cash15k: "/prizes/cash.jpg",
  iphone: "/prizes/iphone.jpg",
  ps5: "/prizes/ps5.jpg",
  laptop: "/prizes/laptop.jpg",
  giftcard: "/prizes/giftcard.jpg",
  // New prizes (7 -> 10):
  samsung_tv: "/prizes/samsung_tv.jpg",
  luxury_villa: "/prizes/luxury_villa.jpg",
  mg_suv: "/prizes/mg_suv.jpg",
};

export function prizeImageFor(key) {
  return PRIZE_IMAGES[key] || null;
}
