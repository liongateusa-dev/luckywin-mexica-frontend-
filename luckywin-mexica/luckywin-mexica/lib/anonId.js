// Generates and persists a random, opaque id for anonymous play — no
// signup/login involved. Stored in localStorage so repeat visits from
// the same browser map back to the same CycleEntry (so retries/attempt
// counts work); a cleared browser or a different device is simply seen
// as a new player, same as before when a new account would've been
// required.
const STORAGE_KEY = "lwm_anon_id";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  // Fallback for environments without crypto.randomUUID.
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

export function getAnonId() {
  if (typeof window === "undefined") return null; // SSR guard
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = randomId();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
