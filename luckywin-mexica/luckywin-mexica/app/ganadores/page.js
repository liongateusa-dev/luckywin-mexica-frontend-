"use client";

import { useLanguage } from "../../lib/LanguageContext";
import { PRIZE_TIERS } from "../../lib/config";

export default function WinnersPage() {
  const { t } = useLanguage();

  // Placeholder rows only — structural layout for when the backend (Part 2)
  // provides real winner data. No fabricated names, photos, or testimonials.
  const placeholderRows = PRIZE_TIERS.flatMap((tier) =>
    Array.from({ length: tier.winners }).map((_, i) => ({
      id: `${tier.key}-${i}`,
      prizeKey: tier.key,
    }))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-1">{t("winnersPage.heading")}</h1>
      <p className="text-neutral-400 mb-8">{t("winnersPage.subheading")}</p>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/70 text-neutral-400">
            <tr>
              <th className="text-left px-5 py-3 font-medium">
                {t("winnersPage.tableName")}
              </th>
              <th className="text-left px-5 py-3 font-medium">
                {t("winnersPage.tablePrize")}
              </th>
              <th className="text-left px-5 py-3 font-medium">
                {t("winnersPage.tableDate")}
              </th>
            </tr>
          </thead>
          <tbody>
            {placeholderRows.map((row, idx) => (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-neutral-950" : "bg-neutral-900/30"}
              >
                <td className="px-5 py-3 text-neutral-500">
                  {t("winnersPage.tbd")}
                </td>
                <td className="px-5 py-3">{t(`prizes.${row.prizeKey}`)}</td>
                <td className="px-5 py-3 text-neutral-500">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-500 mt-6 text-center">
        {t("winnersPage.placeholderNote")}
      </p>
    </div>
  );
}
