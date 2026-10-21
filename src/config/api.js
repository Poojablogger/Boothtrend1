// Social9 API config used by the AI Prompts page
export const SOCIAL9_BASE_URL = "https://social9.in/api";

// Social9 authorization key
export const SOCIAL9_AUTH_KEY = "A6iWq]M}Z3bHtnn{kyS9";

// POST with x-www-form-urlencoded body + authorizationKey header (same as social9 project)
export async function social9Post(endpoint, params = {}) {
  const body = new URLSearchParams({ authorizationKey: SOCIAL9_AUTH_KEY, ...params });

  const res = await fetch(`${SOCIAL9_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authorizationKey: SOCIAL9_AUTH_KEY,
    },
    body,
  });

  if (!res.ok) {
    // Include the server's own message so the console shows WHY it failed
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(`${endpoint} failed (${res.status}) ${detail.slice(0, 300)}`);
  }
  return res.json();
}      