const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

/**
 * Calls the backend API, attaching the Supabase access token as a Bearer
 * token when provided. Throws an Error with a `.data` property containing
 * the parsed error body on non-2xx responses, so callers can inspect
 * `err.data.error` (e.g. "already_entered", "profile_required").
 */
export async function apiFetch(path, { accessToken, method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || data.error || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
