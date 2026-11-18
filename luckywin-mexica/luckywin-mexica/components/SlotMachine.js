"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../lib/LanguageContext";

// Slot Machine mini-game: 3 reels spin and land on a combo that matches
// whatever outcome the server already decided. Same presentation-only
// rule as LotteryCard — no odds live here, this only animates a result
// the backend has already returned (see /jugar page.js).
const SYMBOLS = ["🍋", "🍒", "⭐", "💎", "🔔", "🍀"];
const WIN_SYMBOL = "💎";

export default function SlotMachine({ serverOutcome, onRevealed }) {
  const { t } = useLanguage();
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const [reels, setReels] = useState([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]);
  const intervalsRef = useRef([]);

  useEffect(() => {
    return () => intervalsRef.current.forEach(clearInterval);
  }, []);

  function spin() {
    if (spinning || done) return;
    setSpinning(true);

    const won = serverOutcome === "won";
    const finalReels = won
      ? [WIN_SYMBOL, WIN_SYMBOL, WIN_SYMBOL]
      : randomLosingCombo();

    const stopDelays = [900, 1400, 1900];
    finalReels.forEach((symbol, i) => {
      const spinInterval = setInterval(() => {
        setReels((prev) => {
          const next = [...prev];
          next[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return next;
        });
      }, 80);
      intervalsRef.current.push(spinInterval);

      setTimeout(() => {
        clearInterval(spinInterval);
        setReels((prev) => {
          const next = [...prev];
          next[i] = symbol;
          return next;
        });
        if (i === 2) {
          setTimeout(() => {
            setSpinning(false);
            setDone(true);
            onRevealed?.();
          }, 300);
        }
      }, stopDelays[i]);
    });
  }

  function randomLosingCombo() {
    let combo;
    do {
      combo = [0, 1, 2].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    } while (combo[0] === combo[1] && combo[1] === combo[2]);
    return combo;
  }

  return (
    <div className="space-y-6 text-center">
      <p className="text-sm text-neutral-400">
        {done ? t("games.slotMachine.resultHint") : t("games.slotMachine.instructions")}
      </p>

      <div className="flex justify-center gap-3">
        {reels.map((symbol, i) => (
          <div
            key={i}
            className="w-20 h-24 rounded-xl border-2 border-gold/40 bg-neutral-800 flex items-center justify-center text-4xl shadow-inner"
          >
            {symbol}
          </div>
        ))}
      </div>

      {!done && (
        <button
          onClick={spin}
          disabled={spinning}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-goldlight text-black font-bold px-8 py-3 hover:scale-[1.02] transition disabled:opacity-60"
        >
          {spinning ? t("games.slotMachine.spinning") : t("games.slotMachine.spinButton")}
        </button>
      )}
    </div>
  );
}
