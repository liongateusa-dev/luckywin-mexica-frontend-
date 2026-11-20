"use client";

import { useEffect, useRef } from "react";

// Premium "fireworks + gold shimmer" celebration — canvas-based, no
// external dependency, same lightweight pattern as Confetti.js. Fires
// several firework bursts in sequence at randomized positions across
// the top half of the screen, each burst exploding into gold/white
// sparks that drift down and fade, plus a soft shimmering gold
// particle field that drifts the whole duration for a premium feel.
// trigger changes (e.g. a counter) re-fire it without remounting.
const GOLD_SHADES = ["#FFD700", "#FFE880", "#FFF4B8", "#FFFFFF", "#F5C518"];

function makeBurst(x, y) {
  const sparkCount = 46 + Math.floor(Math.random() * 20);
  return Array.from({ length: sparkCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5.5 + 2;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.6 + 1.4,
      color: GOLD_SHADES[Math.floor(Math.random() * GOLD_SHADES.length)],
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      gravity: 0.045,
      trail: [],
    };
  });
}

export default function Fireworks({ trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    // Schedule a handful of bursts at staggered times/positions so it
    // reads as "fireworks show" rather than one single pop.
    const burstPlan = [0, 280, 560, 900, 1250, 1650].map((delay) => ({
      delay,
      x: width * (0.2 + Math.random() * 0.6),
      y: height * (0.18 + Math.random() * 0.3),
    }));

    let sparks = [];
    const shimmer = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let animationId;
    const start = performance.now();
    const duration = 3400;
    let firedCount = 0;

    function tick(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      // Fire any bursts whose delay has passed.
      while (firedCount < burstPlan.length && elapsed >= burstPlan[firedCount].delay) {
        const b = burstPlan[firedCount];
        sparks = sparks.concat(makeBurst(b.x, b.y));
        firedCount++;
      }

      // Gold shimmer field — subtle upward-drifting twinkle, whole duration.
      shimmer.forEach((s) => {
        s.twinkle += 0.05;
        s.y -= s.speed;
        if (s.y < 0) s.y = height;
        const alpha = 0.25 + 0.25 * Math.sin(s.twinkle);
        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#FFD700";
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Firework sparks.
      sparks.forEach((p) => {
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        ctx.beginPath();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      sparks = sparks.filter((p) => p.life > 0);

      if (elapsed < duration || sparks.length > 0) {
        animationId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    />
  );
}
