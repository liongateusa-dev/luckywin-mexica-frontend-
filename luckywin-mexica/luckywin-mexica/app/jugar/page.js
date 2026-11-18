"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { useAuth } from "../../lib/AuthContext";
import { apiFetch } from "../../lib/api";
import { getWhatsAppLink } from "../../lib/config";
import LotteryCard from "../../components/LotteryCard";
import SlotMachine from "../../components/SlotMachine";
import ScratchCard from "../../components/ScratchCard";

// This page calls the REAL backend — no client-side win/lose logic lives
// here. The server already decided `result.outcome` (and, if a win, which
// prize) before this page renders a single card or reel; LotteryCard /
// SlotMachine / ScratchCard only animate toward that already-decided
// outcome. See drawService.js on the backend for the actual odds.
export default function PlayPage() {
  const { t } = useLanguage();
  const { user, loading, getAccessToken } = useAuth();
  const router = useRouter();

  // loading | needs-profile | choose-game | playing | revealed-pending-scratch | scratched | no-attempts | error
  const [stage, setStage] = useState("loading");
  const [gameType, setGameType] = useState(null); // "LOTTERY_CARD" | "SLOT_MACHINE"
  const [cycleEntry, setCycleEntry] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/registro");
      return;
    }
    setStage("choose-game");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function playAttempt(chosenGameType) {
    setGameType(chosenGameType);
    setErrorMsg("");
    try {
      const accessToken = getAccessToken();
      let data;
      if (!hasEntered) {
        data = await apiFetch("/entries", {
          accessToken,
          method: "POST",
          body: { gameType: chosenGameType },
        });
        setHasEntered(true);
      } else {
        data = await apiFetch(`/entries/${cycleEntry.id}/retry`, {
          accessToken,
          method: "POST",
          body: { gameType: chosenGameType },
        });
      }
      if (data.cycleEntry) setCycleEntry(data.cycleEntry);
      setResult(data.result);

      if (data.result.outcome === "no_attempts_left") {
        setStage("no-attempts");
      } else {
        setStage("playing"); // mini-game animates, then calls onRevealed below
      }
    } catch (err) {
      if (err.data?.error === "profile_required") {
        setStage("needs-profile");
        return;
      }
      if (err.data?.error === "already_entered") {
        setCycleEntry(err.data.cycleEntry);
        setHasEntered(true);
        setStage("choose-game");
        return;
      }
      setErrorMsg(err.message || "Something went wrong.");
      setStage("error");
    }
  }

  function handleGameRevealed() {
    if (result?.outcome === "won") {
      setStage("revealed-pending-scratch");
    } else {
      setStage("no-win-shown");
    }
  }

  const whatsappMsg = useMemo(() => {
    if (result?.outcome !== "won" || !cycleEntry) return "";
    const prizeLabel = t(`prizes.${result.prizeTierKey}`);
    return `Hola, gané ${prizeLabel} en LuckyWin Mexica. Mi número de entrada es ${cycleEntry.entryNumber}.`;
  }, [result, cycleEntry, t]);

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

      {stage === "error" && (
        <div className="rounded-2xl border border-mxred/40 bg-mxred/10 p-6">
          <p className="text-neutral-200">{errorMsg}</p>
        </div>
      )}

      {stage === "choose-game" && (
        <div className="space-y-4">
          <p className="text-neutral-400">{t("play.chooseGameHint")}</p>
          <button
            onClick={() => playAttempt("LOTTERY_CARD")}
            className="w-full rounded-2xl border border-gold/40 bg-neutral-900/70 p-5 text-left hover:border-gold transition"
          >
            <p className="font-bold text-lg">🃏 {t("games.lotteryCard.title")}</p>
            <p className="text-sm text-neutral-400">{t("games.lotteryCard.tagline")}</p>
          </button>
          <button
            onClick={() => playAttempt("SLOT_MACHINE")}
            className="w-full rounded-2xl border border-gold/40 bg-neutral-900/70 p-5 text-left hover:border-gold transition"
          >
            <p className="font-bold text-lg">🎰 {t("games.slotMachine.title")}</p>
            <p className="text-sm text-neutral-400">{t("games.slotMachine.tagline")}</p>
          </button>
          {cycleEntry && (
            <p className="text-xs text-neutral-500">
              {t("play.attemptsUsedLabel", {
                used: cycleEntry.attemptsUsed,
                max: 5,
              })}
            </p>
          )}
        </div>
      )}

      {stage === "playing" && gameType === "LOTTERY_CARD" && (
        <LotteryCard serverOutcome={result?.outcome} onRevealed={handleGameRevealed} />
      )}
      {stage === "playing" && gameType === "SLOT_MACHINE" && (
        <SlotMachine serverOutcome={result?.outcome} onRevealed={handleGameRevealed} />
      )}

      {stage === "revealed-pending-scratch" && result?.outcome === "won" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-mxgreen">{t("play.winTitle")}</h2>
          <ScratchCard
            prizeLabel={t(`prizes.${result.prizeTierKey}`)}
            onFullyRevealed={() => setStage("scratched")}
          />
        </div>
      )}

      {stage === "scratched" && result?.outcome === "won" && (
        <div className="rounded-2xl border border-mxgreen/40 bg-mxgreen/10 p-6 space-y-5">
          <h2 className="text-2xl font-bold text-mxgreen">
            {t("play.winTitle")}
          </h2>
          <p className="text-neutral-200">
            {t("play.winBody", { prize: t(`prizes.${result.prizeTierKey}`) })}
          </p>
          <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-4 text-sm text-neutral-400 text-left">
            <p className="font-semibold text-neutral-200 mb-1">{t("play.noticeTitle")}</p>
            <p>{t("play.noticeBody")}</p>
          </div>
          <a
            href={getWhatsAppLink(whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-black font-bold px-6 py-3 hover:scale-[1.02] transition"
          >
            {t("play.contactWhatsapp")}
          </a>
        </div>
      )}

      {stage === "no-win-shown" && (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 space-y-5">
          <h2 className="text-xl font-bold mb-2">{t("play.noWinTitle")}</h2>
          <p className="text-neutral-400">{t("play.noWinBody")}</p>
          {cycleEntry && cycleEntry.attemptsUsed < 5 ? (
            <div className="space-y-3">
              <button
                onClick={() => setStage("choose-game")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold px-6 py-3 hover:scale-[1.02] transition"
              >
                {t("play.retryButton")}
              </button>
              <p className="text-xs text-neutral-500">
                {t("play.attemptsUsedLabel", { used: cycleEntry.attemptsUsed, max: 5 })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">{t("play.noAttemptsBody")}</p>
          )}
        </div>
      )}

      {stage === "no-attempts" && (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
          <h2 className="text-xl font-bold mb-2">{t("play.noAttemptsTitle")}</h2>
          <p className="text-neutral-400">{t("play.noAttemptsBody")}</p>
        </div>
      )}
    </div>
  );
}
