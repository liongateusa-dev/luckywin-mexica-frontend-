"use client";

import Image from "next/image";
import { useLanguage } from "../lib/LanguageContext";

const CASH_TIERS = ["cash5k", "cash10k", "cash15k"];

export default function PrizeCard({ tierKey, winners, image }) {
  const { t } = useLanguage();
  const hasDesc = [...CASH_TIERS, "giftcard"].includes(tierKey);

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 flex flex-col items-start gap-3 hover:border-gold/50 transition">
      <div className="relative w-full aspect-[4/3] rounded-xl bg-white overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={t(`prizes.${tierKey}`)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        )}
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
