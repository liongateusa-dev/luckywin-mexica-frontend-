"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLanguage } from "../lib/LanguageContext";

// Scratch Card reveal: shown after a WIN from either mini-game, or after
// an admin-issued AwardedLink claim. The prize(s) underneath are
// whatever the server already decided (prizeTierKey(s) drawn in
// drawService.js, or the 3 fixed prizes from awardedLinkService.js) —
// this component only lets the player "scratch" to reveal them. Nothing
// here decides the prize; it is purely the reveal animation.
//
// Accepts EITHER a single `prizeLabel` string (used by the regular
// /jugar game flow, which reveals one prize) OR a `prizeLabels` array
// (used by the admin-awarded-link flow, which always reveals 3 prizes
// together per spec). Exactly one of the two should be passed.
export default function ScratchCard({ prizeLabel, prizeLabels, onFullyRevealed }) {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [cleared, setCleared] = useState(false);
  const isDrawing = useRef(false);

  const labels = prizeLabels && prizeLabels.length > 0 ? prizeLabels : prizeLabel ? [prizeLabel] : [];
  const isMultiple = labels.length > 1;

  const drawOverlay = useCallback((canvas) => {
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#b8b8bc");
    grad.addColorStop(1, "#7d7d82");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2c2c2f";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t("games.scratchCard.scratchHere"), canvas.width / 2, canvas.height / 2);
  }, [t]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawOverlay(canvas);
  }, [drawOverlay, isMultiple]);

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function scratchAt(e) {
    const canvas = canvasRef.current;
    if (!canvas || cleared) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    checkCleared(canvas, ctx);
  }

  function checkCleared(canvas, ctx) {
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4 * 20) {
      if (data[i] === 0) transparent++;
    }
    const sampled = Math.ceil(data.length / (4 * 20));
    if (transparent / sampled > 0.55) {
      setCleared(true);
      onFullyRevealed?.();
    }
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-neutral-400">{t("games.scratchCard.instructions")}</p>
      <div
        className={`relative w-72 mx-auto rounded-xl overflow-hidden border-2 border-gold/50 bg-neutral-900 ${
          isMultiple ? "h-56" : "h-40"
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            {isMultiple ? t("games.scratchCard.youWonMultiple") : t("games.scratchCard.youWon")}
          </span>
          {isMultiple ? (
            <ul className="space-y-1">
              {labels.map((label, i) => (
                <li key={i} className="text-lg font-extrabold text-gold text-center">
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xl font-extrabold text-gold text-center">{labels[0]}</span>
          )}
        </div>
        {!cleared && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
            onMouseDown={(e) => { isDrawing.current = true; scratchAt(e); }}
            onMouseUp={() => { isDrawing.current = false; }}
            onMouseLeave={() => { isDrawing.current = false; }}
            onMouseMove={(e) => { if (isDrawing.current) scratchAt(e); }}
            onTouchStart={(e) => { isDrawing.current = true; scratchAt(e); }}
            onTouchEnd={() => { isDrawing.current = false; }}
            onTouchMove={scratchAt}
          />
        )}
      </div>
    </div>
  );
}
