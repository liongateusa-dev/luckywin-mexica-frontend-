"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { useAuth } from "../../lib/AuthContext";
import { apiFetch } from "../../lib/api";
import { getWhatsAppLink } from "../../lib/config";

// This page now calls the REAL backend (Part 2) — no client-side mock
// logic. The draw happens server-side; this page only displays whatever
// the backend returns.
export default function PlayPage() {
  const { t } = useLanguage();
  const { user, loading, getAccessToken } = useAuth();
  const router = useRouter();

  const [stage, setStage] = useState("loading"); // loading | needs-profile | revealing | result
  const [cycleEntry, setCycleEntry] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/registro");
      return;
    }
    enterCycle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function enterCycle() {
    setStage("revealing");
    setErrorMsg("");
    try {
      const accessToken = getAccessToken();
      const data = await apiFetch("/entries", { accessToken, method: "POST" });
      setCycleEntry(data.cycleEntry);
      setResult(data.result);
      setStage("result");
    } catch (err) {
      if (err.data?.error === "profile_required") {
        setStage("needs-profile");
        return;
      }
      if (err.data?.error === "already_entered") {
        // They already have an entry this cycle — show it instead of
        // erroring. We don't have the prior result here, so just surface
        // the existing entry number and let them retry if eligible.
        setCycleEntry(err.data.cycleEntry);
        setResult({ outcome: "no_win" });
        setStage("result");
        return;
      }
      setErrorMsg(err.message || "Something went wrong.");
      setStage("result");
    }
  }

  async function handleRetry() {
    if (!cycleEntry) return;
    setStage("revealing");
    setErrorMsg("");
    try {
      const accessToken = getAccessToken();
      const data = await apiFetch(`/entries/${cycleEntry.id}/retry`, {
        accessToken,
        method: "POST",
      });
      setResult(data.result);
      setStage("result");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setStage("result");
    }
  }

  const whatsappMsg = useMemo(() => {
    if (result?.outcome !== "won" || !cycleEntry) return "";
    return `Hola, gané un premio en LuckyWin Mexica. Mi número de entrada es ${cycleEntry.entryNumber}.`;
  }, [result, cycleEntry]);

  if (loading || stage === "loading") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }

  if (stage === "needs-profile") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">
          Completa tu perfil / Complete your profile
        </h1>
        <p className="text-neutral-400 mb-6">
          Necesitamos algunos datos más antes de jugar.
          <br />
          We need a few more details before you can play.
        </p>
        <Link
          href="/registro"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold px-6 py-3"
        >
          Continuar / Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-8">{t("play.heading")}</h1>

      {stage === "revealing" && (
        <div className="py-16">
          <div className="mx-auto w-16 h-16 rounded-full border-4 border-gold/30 border-t-gold animate-spin mb-6" />
          <p className="text-neutral-400">{t("play.revealing")}</p>
        </div>
      )}

      {stage === "result" && errorMsg && (
        <div className="rounded-2xl border border-mxred/40 bg-mxred/10 p-6">
          <p className="text-neutral-200">{errorMsg}</p>
        </div>
      )}

      {stage === "result" && !errorMsg && cycleEntry && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
            <p className="text-sm text-neutral-400 mb-1">{t("play.entryLabel")}</p>
            <p className="text-3xl font-mono font-bold tracking-widest text-gold">
              {cycleEntry.entryNumber}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-4 text-sm text-neutral-400 text-left">
            <p className="font-semibold text-neutral-200 mb-1">
              {t("play.noticeTitle")}
            </p>
            <p>{t("play.noticeBody")}</p>
          </div>

          {result?.outcome === "won" ? (
            <div className="rounded-2xl border border-mxgreen/40 bg-mxgreen/10 p-6">
              <h2 className="text-2xl font-bold text-mxgreen mb-2">
                {t("play.winTitle")}
              </h2>
              <p className="text-neutral-200 mb-5">
                {t("play.winBody", { prize: t(`prizes.${result.prizeTierKey}`) })}
              </p>
              <a
                href={getWhatsAppLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-black font-bold px-6 py-3 hover:scale-[1.02] transition"
              >
                {t("play.contactWhatsapp")}
              </a>
            </div>
          ) : cycleEntry.attemptsUsed < 2 ? (
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-bold mb-2">{t("play.noWinTitle")}</h2>
              <p className="text-neutral-400 mb-5">{t("play.noWinBody")}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold px-6 py-3 hover:scale-[1.02] transition"
              >
                {t("play.retryButton")}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-bold mb-2">
                {t("play.noAttemptsTitle")}
              </h2>
              <p className="text-neutral-400">{t("play.noAttemptsBody")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
