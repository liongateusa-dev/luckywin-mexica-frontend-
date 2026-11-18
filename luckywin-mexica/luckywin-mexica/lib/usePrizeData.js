"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "./api";

// Single source of truth for anything winner-count or prize-related on
// the frontend. Previously the hero banner computed its number from a
// hardcoded frontend constant (TOTAL_WINNERS_PER_CYCLE in config.js)
// while the prize cards showed a different hardcoded number via static
// translation strings — the two drifted out of sync (38 vs 42). Every
// place that shows a winner count or prize detail must read from THIS
// hook, which always reflects the live database via GET /api/cycle/current,
// so there is exactly one number in the whole app, not two.
export function usePrizeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cycle = await apiFetch("/cycle/current");
        if (!cancelled) setData(cycle);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

// Winner spotlight photos for the homepage's side-scrolling gallery.
// Admin-uploaded via Supabase Storage (see winnerSpotlightService.js on
// the backend) — just images, no name/prize metadata attached.
export function useWinnerSpotlights() {
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/winner-spotlights");
        if (!cancelled) setSpotlights(data.spotlights || []);
      } catch (err) {
        console.error("Failed to load winner spotlights:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { spotlights, loading };
}
