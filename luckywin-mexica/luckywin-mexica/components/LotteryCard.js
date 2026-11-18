"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

// Lottery Card mini-game: the player picks 3 of 6 face-down cards, the
// "house" reveals its own 3. Whoever's revealed total is higher wins the
// round. This is a PRESENTATION layer only — the server has already
// decided the real outcome (see /jugar page.js) before this component
// ever renders; the numbers shown here are generated client-side purely
// to animate toward whatever outcome the server already returned, never
// to decide it. No odds live in this file.
const CARD_FACES = ["🂡", "🂱", "🃁", "🃑", "🂫", "🂻"];

export default function LotteryCard({ serverOutcome, onRevealed }) {
  const { t } = useLanguage();
  const [picked, setPicked] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [playerCards, setPlayerCards] = useState([]);
  const [houseCards, setHouseCards] = useState([]);

  function pickCard(idx) {
    if (revealed || picked.length >= 3 || picked.includes(idx)) return;
    const next = [...picked, idx];
    setPicked(next);
    if (next.length === 3) {
      runReveal(next);
    }
  }

  function runReveal(chosenIdxs) {
    // Build a believable pair of hands whose relative outcome matches
    // serverOutcome ("won" means the player's hand must score higher).
    const won = serverOutcome === "won";
    const playerVals = randomHand(3, won ? [28, 33] : [10, 18]);
    const houseVals = randomHand(3, won ? [10, 18] : [28, 33]);

    setPlayerCards(chosenIdxs.map((idx, i) => ({ face: CARD_FACES[idx], val: playerVals[i] })));
    setHouseCards(houseVals.map((v, i) => ({ face: CARD_FACES[(i + 3) % 6], val: v })));

    setTimeout(() => {
      setRevealed(true);
      onRevealed?.();
    }, 900);
  }

  function randomHand(count, totalRange) {
    const [min, max] = totalRange;
    const total = Math.floor(min + Math.random() * (max - min));
    const parts = [];
    let remaining = total;
    for (let i = 0; i < count - 1; i++) {
      const share = Math.max(1, Math.floor(remaining / (count - i)) + (Math.random() > 0.5 ? 1 : -1));
      parts.push(share);
      remaining -= share;
    }
    parts.push(Math.max(1, remaining));
    return parts;
  }

  const playerTotal = playerCards.reduce((s, c) => s + c.val, 0);
  const houseTotal = houseCards.reduce((s, c) => s + c.val, 0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-400">
        {revealed ? t("games.lotteryCard.resultHint") : t("games.lotteryCard.instructions")}
      </p>

      {!revealed && (
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {CARD_FACES.map((face, idx) => (
            <button
              key={idx}
              onClick={() => pickCard(idx)}
              disabled={picked.includes(idx) || picked.length >= 3}
              className={`aspect-[2/3] rounded-xl border-2 flex items-center justify-center text-3xl transition
                ${picked.includes(idx)
                  ? "border-gold bg-gold/20 scale-95"
                  : "border-white/15 bg-neutral-800 hover:border-gold/60"}`}
            >
              {picked.includes(idx) ? face : "🂠"}
            </button>
          ))}
        </div>
      )}

      {picked.length > 0 && picked.length < 3 && !revealed && (
        <p className="text-center text-sm text-neutral-500">
          {t("games.lotteryCard.pickMore", { count: 3 - picked.length })}
        </p>
      )}

      {picked.length === 3 && !revealed && (
        <div className="py-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-4 border-gold/30 border-t-gold animate-spin mb-4" />
          <p className="text-neutral-400">{t("games.lotteryCard.dealing")}</p>
        </div>
      )}

      {revealed && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gold/40 bg-neutral-900/70 p-4 text-center">
            <p className="text-xs text-neutral-400 mb-2">{t("games.lotteryCard.you")}</p>
            <div className="flex justify-center gap-1 text-2xl mb-2">
              {playerCards.map((c, i) => <span key={i}>{c.face}</span>)}
            </div>
            <p className="font-bold text-gold text-lg">{playerTotal}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-center">
            <p className="text-xs text-neutral-400 mb-2">{t("games.lotteryCard.house")}</p>
            <div className="flex justify-center gap-1 text-2xl mb-2">
              {houseCards.map((c, i) => <span key={i}>{c.face}</span>)}
            </div>
            <p className="font-bold text-neutral-300 text-lg">{houseTotal}</p>
          </div>
        </div>
      )}
    </div>
  );
}
