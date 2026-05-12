// ═══════════════════════════════════════════════════════════
//  East Coaster Tracker — Cloudflare Worker Backend
//
//  SETUP:
//  1. In Cloudflare Dashboard → Workers & Pages → your worker
//  2. Settings → Bindings → KV Namespace
//  3. Variable name: RIDE_TRACKER  (exact, case-sensitive)
//  4. Select or create a KV namespace
// ═══════════════════════════════════════════════════════════

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function makeToken(username) {
  const raw = `${username}:${Date.now()}:${Math.random()}`;
  return btoa(raw).replace(/=/g, "");
}

// ── Route handlers ──────────────────────────────────────────

async function handleRegister(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { username, password } = body;

  if (!username || typeof username !== "string" || username.trim().length < 1) {
    return jsonResponse({ error: "Username is required" }, 400);
  }
  if (!password || typeof password !== "string" || password.length < 4) {
    return jsonResponse({ error: "Password must be at least 4 characters" }, 400);
  }

  const safeUser = username.trim().toLowerCase();

  // Check if username already exists
  const existing = await env.RIDE_TRACKER.get(`user:${safeUser}`);
  if (existing !== null) {
    return jsonResponse({ error: "Username already taken. Please choose another." }, 409);
  }

  // Hash password and store user
  const hash = await hashPassword(password);
  const userRecord = JSON.stringify({
    username: safeUser,
    hash,
    createdAt: Date.now(),
  });

  await env.RIDE_TRACKER.put(`user:${safeUser}`, userRecord);

  // Create session token
  const token = makeToken(safeUser);
  await env.RIDE_TRACKER.put(`token:${token}`, safeUser, {
    expirationTtl: 60 * 60 * 24 * 30, // 30 days
  });

  return jsonResponse({ ok: true, username: safeUser, token });
}

async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { username, password } = body;

  if (!username || !password) {
    return jsonResponse({ error: "Username and password are required" }, 400);
  }

  const safeUser = username.trim().toLowerCase();
  const raw = await env.RIDE_TRACKER.get(`user:${safeUser}`);

  if (raw === null) {
    return jsonResponse({ error: "Invalid username or password" }, 401);
  }

  const record = JSON.parse(raw);
  const hash = await hashPassword(password);

  if (hash !== record.hash) {
    return jsonResponse({ error: "Invalid username or password" }, 401);
  }

  const token = makeToken(safeUser);
  await env.RIDE_TRACKER.put(`token:${token}`, safeUser, {
    expirationTtl: 60 * 60 * 24 * 30,
  });

  return jsonResponse({ ok: true, username: safeUser, token });
}

async function handleGetCounts(request, env) {
  const url = new URL(request.url);
  const user = url.searchParams.get("user");

  if (!user) {
    return jsonResponse({ error: "Missing user query parameter" }, 400);
  }

  const safeUser = user.trim().toLowerCase();
  const raw = await env.RIDE_TRACKER.get(`counts:${safeUser}`);
  const counts = raw ? JSON.parse(raw) : {};

  return jsonResponse({ ok: true, counts });
}

async function handlePostCounts(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { username, token, rideId, count } = body;

  if (!token || !username) {
    return jsonResponse({ error: "Not authenticated" }, 401);
  }

  // Validate token
  const safeUser = username.trim().toLowerCase();
  const tokenOwner = await env.RIDE_TRACKER.get(`token:${token}`);

  if (tokenOwner === null || tokenOwner !== safeUser) {
    return jsonResponse({ error: "Invalid or expired session. Please log in again." }, 401);
  }

  if (!rideId || typeof rideId !== "string") {
    return jsonResponse({ error: "Invalid rideId" }, 400);
  }
  if (typeof count !== "number" || count < 0 || !Number.isInteger(count)) {
    return jsonResponse({ error: "Count must be a non-negative integer" }, 400);
  }

  // Load existing counts and update
  const raw = await env.RIDE_TRACKER.get(`counts:${safeUser}`);
  const counts = raw ? JSON.parse(raw) : {};
  counts[rideId] = count;

  await env.RIDE_TRACKER.put(`counts:${safeUser}`, JSON.stringify(counts));

  return jsonResponse({ ok: true });
}

// ── Main entry point ────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // Route matching
    try {
      if (path === "/register" && method === "POST") {
        return await handleRegister(request, env);
      }

      if (path === "/login" && method === "POST") {
        return await handleLogin(request, env);
      }

      if (path === "/counts" && method === "GET") {
        return await handleGetCounts(request, env);
      }

      if (path === "/counts" && method === "POST") {
        return await handlePostCounts(request, env);
      }

      // Health check — visiting the URL in browser hits this
      if (path === "/" && method === "GET") {
        return jsonResponse({
          ok: true,
          service: "East Coaster Tracker API",
          version: "1.0",
          endpoints: [
            "POST /register",
            "POST /login",
            "GET  /counts?user=USERNAME",
            "POST /counts",
          ],
        });
      }

      return jsonResponse({ error: "Not found" }, 404);

    } catch (err) {
      return jsonResponse({ error: "Internal server error", detail: err.message }, 500);
    }
  },
};
