"use client";

import { useLanguage } from "../lib/LanguageContext";

const ICONS = {
  cash: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 9v6M18 9v6" />
    </svg>
  ),
  iphone: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 19h2" />
    </svg>
  ),
  ps5: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="18" height="12" rx="3" />
      <circle cx="16" cy="11" r="1" />
      <circle cx="18" cy="13" r="1" />
      <path d="M7 11h2M8 10v2" />
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </svg>
  ),
  giftcard: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 5v14" />
    </svg>
  ),
};

export default function PrizeCard({ tierKey, winners }) {
  const { t } = useLanguage();
  const hasDesc = ["cash", "giftcard"].includes(tierKey);

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 flex flex-col items-start gap-3 hover:border-gold/50 transition">
      <div className="w-14 h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
        {ICONS[tierKey]}
      </div>
      <div>
        <h3 className="font-bold text-lg">{t(`prizes.${tierKey}`)}</h3>
        {hasDesc && (
          <p className="text-sm text-neutral-400">{t(`prizes.${tierKey}Desc`)}</p>
        )}
      </div>
      <span className="mt-auto inline-flex items-center rounded-full bg-mxgreen/20 text-mxgreen text-xs font-semibold px-3 py-1">
        {t(`prizes.${tierKey}Winners`)}
      </span>
    </div>
  );
}
