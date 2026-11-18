"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLanguage } from "../lib/LanguageContext";

// Scratch Card reveal: shown after a WIN from either mini-game. The
// prize underneath is whatever prizeTierKey the server already drew
// (randomly, weighted by remaining inventory, across every prize tier —
// cash or physical) — this component only lets the player "scratch" to
// reveal it. Nothing here decides the prize; it is purely the reveal
// animation for a result the backend returned in /jugar page.js.
export default function ScratchCard({ prizeLabel, onFullyRevealed }) {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [cleared, setCleared] = useState(false);
  const isDrawing = useRef(false);

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
  }, [drawOverlay]);

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
      <div className="relative w-64 h-40 mx-auto rounded-xl overflow-hidden border-2 border-gold/50 bg-neutral-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            {t("games.scratchCard.youWon")}
          </span>
          <span className="text-xl font-extrabold text-gold text-center">{prizeLabel}</span>
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
