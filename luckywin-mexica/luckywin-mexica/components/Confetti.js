"use client";

import { useEffect, useRef } from "react";

// Lightweight canvas confetti burst, no external dependency. Fires once
// on mount for ~2.5s then stops and removes itself. trigger changes
// (e.g. a counter) re-fire it without remounting the page.
const COLORS = ["#FFD700", "#FFF4B8", "#22C55E", "#FFFFFF", "#F59E0B"];

export default function Confetti({ trigger }) {
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

    const particleCount = 140;
    const particles = Array.from({ length: particleCount }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 120,
      y: height * 0.3 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 7 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.5 ? "rect" : "circle",
      gravity: 0.35 + Math.random() * 0.15,
      drag: 0.994,
    }));

    let animationId;
    const start = performance.now();
    const duration = 2600;

    function tick(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < duration) {
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
