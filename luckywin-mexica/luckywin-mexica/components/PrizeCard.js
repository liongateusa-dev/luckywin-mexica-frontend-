"use client";

import Image from "next/image";
import { useLanguage } from "../lib/LanguageContext";
import { CASH_TIERS, PRIZE_IMAGES } from "../lib/prizeImages";

// tier is one entry from the live GET /api/cycle/current response:
// { key, label, totalThisCycle, remainingThisCycle, cashValueUsd, cashValueMxn }
// Winner counts and MXN values are never hardcoded here — they come
// straight from the database via that endpoint (see usePrizeData.js),
// which is what keeps every prize count on the site in sync.
export default function PrizeCard({ tier }) {
  const { t } = useLanguage();
  const isCash = CASH_TIERS.includes(tier.key);
  const hasDesc = isCash || tier.key === "giftcard";
  const image = PRIZE_IMAGES[tier.key];

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 flex flex-col items-start gap-3 hover:border-gold/50 transition">
      <div className="w-20 h-20 rounded-xl bg-gold/10 flex items-center justify-center overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={t(`prizes.${tier.key}`)}
            width={80}
            height={80}
            className="object-contain w-full h-full"
          />
        )}
      </div>
      <div>
        <h3 className="font-bold text-lg">{t(`prizes.${tier.key}`)}</h3>
        {hasDesc && (
          <p className="text-sm text-neutral-400">
            {t(`prizes.${tier.key}Desc`)}
            {isCash && tier.cashValueMxn != null && (
              <span className="block text-xs text-neutral-500 mt-0.5">
                ≈ ${tier.cashValueMxn.toLocaleString("es-MX")} MXN
              </span>
            )}
          </p>
        )}
      </div>
      <span className="mt-auto inline-flex items-center rounded-full bg-mxgreen/20 text-mxgreen text-xs font-semibold px-3 py-1">
        {tier.totalThisCycle === 1
          ? t("prizes.oneWinner")
          : t("prizes.winnersCount", { count: tier.totalThisCycle })}
      </span>
    </div>
  );
}
