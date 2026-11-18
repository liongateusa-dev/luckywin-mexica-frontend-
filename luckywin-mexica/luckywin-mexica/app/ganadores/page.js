"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import { apiFetch } from "../../lib/api";

// Shows REAL winner data from GET /api/winners (masked name, real prize,
// real date) — this used to render fabricated placeholder rows generated
// from the frontend's hardcoded prize-tier config, which is exactly the
// kind of hardcoded/fake data this whole rebuild moved away from.
export default function WinnersPage() {
  const { t } = useLanguage();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/winners");
        if (!cancelled) setWinners(data.winners || []);
      } catch (err) {
        console.error("Failed to load winners:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-1">{t("winnersPage.heading")}</h1>
      <p className="text-neutral-400 mb-8">{t("winnersPage.subheading")}</p>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
        </div>
      )}

      {!loading && winners.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900/40 p-12 text-center text-neutral-500">
          {t("winnersSection.empty")}
        </div>
      )}

      {!loading && winners.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/70 text-neutral-400">
              <tr>
                <th className="text-left px-5 py-3 font-medium">{t("winnersPage.tableName")}</th>
                <th className="text-left px-5 py-3 font-medium">{t("winnersPage.tablePrize")}</th>
                <th className="text-left px-5 py-3 font-medium">{t("winnersPage.tableDate")}</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((w, idx) => (
                <tr key={w.id} className={idx % 2 === 0 ? "bg-neutral-950" : "bg-neutral-900/30"}>
                  <td className="px-5 py-3 text-neutral-300">{w.maskedName}</td>
                  <td className="px-5 py-3">{t(`prizes.${w.prizeKey}`)}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(w.wonAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
