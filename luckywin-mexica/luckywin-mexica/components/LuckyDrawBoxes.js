"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "../lib/LanguageContext";

// A 6-box "lucky draw" grid shown BEFORE the prize is actually claimed
// from the server. This is purely a presentation layer, same spirit as
// the existing mini-games (see drawService.js design notes): the
// player taps exactly one box, the rest lock immediately, and tapping
// triggers onPick — the parent then calls the real claim endpoint,
// which is what actually decides/returns the prizes. No randomness or
// prize logic lives in this component; it only lets the box art vary
// cosmetically per box so the grid doesn't look like 6 identical tiles.
//
// Box art: 6 branded gift-box renders in /public/boxes (gold, blue,
// red, purple, green, black) — purely cosmetic, every box secretly
// leads to the same server-decided prize set.
const BOX_COUNT = 6;
const BOX_IMAGES = [
  "/boxes/gold.png",
  "/boxes/blue.png",
  "/boxes/red.png",
  "/boxes/purple.png",
  "/boxes/green.png",
  "/boxes/black.png",
];

export default function LuckyDrawBoxes({ onPick, disabled }) {
  const { t } = useLanguage();
  const [pickedIndex, setPickedIndex] = useState(null);
  const [locking, setLocking] = useState(false);

  const boxes = useMemo(() => Array.from({ length: BOX_COUNT }, (_, i) => i), []);

  function handleTap(index) {
    if (disabled || locking || pickedIndex !== null) return;
    setPickedIndex(index);
    setLocking(true);
    onPick?.(index);
  }

  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-bold text-gold">{t("awarded.boxHeading")}</h1>
      <p className="text-neutral-400">{t("awarded.boxSubheading")}</p>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {boxes.map((index) => {
          const isPicked = pickedIndex === index;
          const isLockedOut = pickedIndex !== null && !isPicked;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleTap(index)}
              disabled={disabled || pickedIndex !== null}
              aria-label={`Box ${index + 1}`}
              className={`
                relative aspect-square rounded-2xl border-2 flex items-center justify-center p-2
                transition-all duration-300 select-none bg-neutral-950
                ${
                  isPicked
                    ? "border-gold scale-110 shadow-[0_0_25px_rgba(255,215,0,0.5)]"
                    : isLockedOut
                    ? "border-white/5 opacity-30 grayscale cursor-not-allowed"
                    : "border-gold/40 hover:border-gold hover:scale-105 active:scale-95 cursor-pointer"
                }
              `}
            >
              <Image
                src={BOX_IMAGES[index]}
                alt={`Box ${index + 1}`}
                fill
                sizes="(max-width: 384px) 33vw, 128px"
                className={`object-contain p-2 ${isPicked ? "animate-bounce" : ""}`}
              />
              {isPicked && (
                <span className="absolute inset-0 rounded-2xl border-2 border-gold animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {pickedIndex !== null && (
        <p className="text-gold font-semibold animate-pulse">{t("awarded.boxPicked")}</p>
      )}
    </div>
  );
}
