"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../lib/AuthContext";
import PrizeCard from "../components/PrizeCard";
import { PRIZE_TIERS, TOTAL_WINNERS_PER_CYCLE } from "../lib/config";

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const ctaHref = user ? "/jugar" : "/registro";

  const steps = [1, 2, 3, 4];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-mxgreen/10 via-transparent to-neutral-950 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase text-gold/90 border border-gold/30 rounded-full px-3 py-1 mb-6">
            🇲🇽 {t("trust.monthly")} · {TOTAL_WINNERS_PER_CYCLE} {t("prizes.subheading").split(" ").slice(1).join(" ")}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Lucky</span>
            <span className="text-gradient-gold">Win</span>{" "}
            <span className="text-mxgreen">Mexica</span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-neutral-200 mb-3">
            {t("hero.tagline")}
          </p>
          <p className="text-neutral-400 max-w-xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold px-8 py-4 text-lg shadow-lg shadow-gold/20 hover:scale-[1.02] transition"
          >
            {t("hero.cta")}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>

          {/* trust bar */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-sm text-neutral-400">
            <TrustItem label={t("trust.free")} />
            <TrustItem label={t("trust.noPurchase")} />
            <TrustItem label={t("trust.secure")} />
            <TrustItem label={t("trust.monthly")} />
          </div>
        </div>
      </section>

      {/* PRIZES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{t("prizes.heading")}</h2>
          <p className="text-neutral-400">{t("prizes.subheading")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {PRIZE_TIERS.map((tier) => (
            <PrizeCard key={tier.key} tierKey={tier.key} winners={tier.winners} />
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-6 text-center max-w-2xl mx-auto">
          {t("prizes.disclaimer")}
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-neutral-900/40 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t("howItWorks.heading")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-white/10 bg-neutral-950 p-6 relative"
              >
                <div className="w-9 h-9 rounded-full bg-gold text-black font-bold flex items-center justify-center mb-4">
                  {n}
                </div>
                <h3 className="font-bold mb-1">{t(`howItWorks.step${n}Title`)}</h3>
                <p className="text-sm text-neutral-400">
                  {t(`howItWorks.step${n}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WINNERS EMPTY STATE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{t("winnersSection.heading")}</h2>
          <Link href="/ganadores" className="text-sm font-semibold text-gold hover:underline">
            {t("winnersSection.viewAll")} →
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900/40 p-12 text-center text-neutral-500">
          {t("winnersSection.empty")}
        </div>
      </section>
    </div>
  );
}

function TrustItem({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-mxgreen" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {label}
    </span>
  );
}
