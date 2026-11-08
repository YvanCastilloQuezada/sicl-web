/**
 * ARKI Identity — rutas HTTP de introspección.
 *
 * Loopback-only + X-Internal-Key (timing-safe).
 * NUNCA exponer a red externa. El Bridge llama esto en 127.0.0.1.
 *
 * Respuestas:
 *   200 { valid: true, subject, client_id, scopes, expires_at }
 *   200 { valid: false }                       — token inválido/expirado/revocado
 *   400 { error: "INVALID_BODY" }              — body malformado
 *   403 { error: "FORBIDDEN" }                 — no loopback o key incorrecta
 *   503 { error: "IDENTITY_DISABLED" }         — ARKI_IDENTITY_ENABLE != 1
 */
import type { Express, Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";
import { jwtVerify } from "jose";
import { identityEnabled, introspect, verifyCredential, createSessionJwt, createCredential, issueToken, KNOWN_SCOPES } from "./index";
import { getDb } from "./storage";

export const INTERNAL_KEY_HEADER = "x-internal-key";

function isLoopback(req: Request): boolean {
  // Express puede darnos req.socket.remoteAddress o req.ip.
  // Aceptamos 127.0.0.1, ::1, ::ffff:127.0.0.1.
  const raw = req.socket?.remoteAddress ?? req.ip ?? "";
  const addr = raw.replace(/^::ffff:/, "");
  return addr === "127.0.0.1" || addr === "::1";
}

function keyMatches(provided: unknown): boolean {
  const expected = process.env.ARKI_IDENTITY_INTERNAL_KEY ?? "";
  if (expected.length === 0) return false;
  if (typeof provided !== "string" || provided.length === 0) return false;
  // timing-safe: comparar buffers de igual longitud
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function registerArkiIdentityRoutes(app: Express): void {

  // F5.1 — Login local (cookie JWT HS256)
  app.post("/api/identity/login", async (req: Request, res: Response) => {
    if (!identityEnabled()) {
      res.status(503).json({ error: "IDENTITY_DISABLED" });
      return;
    }
    const body = req.body as { username?: unknown; password?: unknown } | undefined;
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!username || !password) {
      res.status(400).json({ error: "INVALID_BODY" });
      return;
    }
    // F7.3: lockout persistente en SQLite (3 fallos en 15 min → bloqueo)
    const db = getDb();
    // Importante: SQLite datetime('now') devuelve "YYYY-MM-DD HH:MM:SS" (espacio, no T),
    // y toISOString() devuelve "YYYY-MM-DDTHH:MM:SS.sssZ" (T). Comparar strings
    // con formatos distintos falla (espacio < T en ASCII). Usar el mismo formato.
    const since = new Date(Date.now() - 15 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const recentFailures = db
      .prepare(
        "SELECT COUNT(*) AS n FROM arki_identity_login_attempts WHERE username = ? AND success = 0 AND ts > ?",
      )
      .get(username, since) as { n: number } | undefined;
    if ((recentFailures?.n ?? 0) >= 3) {
      db.prepare("INSERT INTO arki_identity_login_attempts (username, success) VALUES (?, 0)").run(username);
      res.status(429).json({ error: "TOO_MANY_ATTEMPTS" });
      return;
    }

    const userId = await verifyCredential(username, password);
    if (!userId) {
      db.prepare("INSERT INTO arki_identity_login_attempts (username, success) VALUES (?, 0)").run(username);
      res.status(401).json({ error: "INVALID_CREDENTIALS" });
      return;
    }
    db.prepare("INSERT INTO arki_identity_login_attempts (username, success) VALUES (?, 1)").run(username);
    const appId = process.env.ARKI_IDENTITY_APP_ID || "arki-local";
    const sessionJwt = await createSessionJwt({ openId: `arki-local:${username}`, appId, name: username });
    res.cookie("arki_identity_session", sessionJwt, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ ok: true, username });
  });

  // F2.5 — Emisión de token opaco (máquina-a-máquina)
  // Requiere cookie JWT del login local. Devuelve token 43-char con scopes
  // explícitos, revocable y auditable. Bridge lo consume vía F3 doble camino.
  app.post("/api/identity/token", async (req: Request, res: Response) => {
    if (!identityEnabled()) {
      res.status(503).json({ error: "IDENTITY_DISABLED" });
      return;
    }

    const cookie = req.cookies?.["arki_identity_session"];
    if (typeof cookie !== "string" || cookie.length === 0) {
      res.status(401).json({ error: "NO_SESSION" });
      return;
    }

    const secret = process.env.JWT_SECRET ?? "";
    if (!secret) {
      res.status(503).json({ error: "JWT_SECRET_MISSING" });
      return;
    }

    let openId: string;
    try {
      const { payload } = await jwtVerify(cookie, new TextEncoder().encode(secret), {
        algorithms: ["HS256"],
      });
      const rawOpenId = payload["openId"];
      if (typeof rawOpenId !== "string") {
        res.status(401).json({ error: "INVALID_SESSION" });
        return;
      }
      openId = rawOpenId;
    } catch {
      res.status(401).json({ error: "INVALID_SESSION" });
      return;
    }

    // Dos prefijos válidos:
    //   arki-local:<username>          → login local (password)
    //   arki-oidc-gitea:<sub>          → login OIDC (Gitea)
    const LOCAL_PREFIX = "arki-local:";
    const OIDC_PREFIX = "arki-oidc-gitea:";

    let cred: { user_id: string } | undefined;
    const db = getDb();

    if (openId.startsWith(LOCAL_PREFIX)) {
      const username = openId.slice(LOCAL_PREFIX.length);
      cred = db
        .prepare(
          "SELECT user_id FROM arki_identity_credentials WHERE username = ? AND enabled = 1 LIMIT 1",
        )
        .get(username) as { user_id: string } | undefined;
    } else if (openId.startsWith(OIDC_PREFIX)) {
      // Para OIDC, el `sub` no coincide con username. Resolvemos por
      // auditoría: el callback OIDC registró oidc_login=<username>.
      // Como no tenemos un mapeo directo sub→username, resolvemos por
      // la sesión más reciente con detalle que empiece por oidc_login=.
      // Mejor solución: re-emitir sesión con openId=arki-local:<username>
      // en el callback OIDC. Lo hacemos aquí para no tocar el callback:
      //   - leemos el último audit oidc_login=<username>
      //   - verificamos que la credencial exista y enabled=1
      // Esto es un workaround; en una fase futura, el JWT OIDC debería
      // incluir username en el payload. Documentado como deuda.
      const rows = db
        .prepare(
          "SELECT detail FROM arki_identity_audit WHERE action = 'login' AND detail LIKE 'oidc_login=%' ORDER BY ts DESC LIMIT 50",
        )
        .all() as Array<{ detail: string }>;
      let username: string | undefined;
      for (const r of rows) {
        const m = /^oidc_login=([^ ]+)/.exec(r.detail);
        if (m) { username = m[1]; break; }
      }
      if (username) {
        cred = db
          .prepare(
            "SELECT user_id FROM arki_identity_credentials WHERE username = ? AND enabled = 1 LIMIT 1",
          )
          .get(username) as { user_id: string } | undefined;
      }
    } else {
      res.status(401).json({ error: "INVALID_SESSION_SUBJECT" });
      return;
    }

    if (!cred) {
      res.status(401).json({ error: "INVALID_SESSION_SUBJECT" });
      return;
    }

    const body = req.body as {
      client_id?: unknown;
      scopes?: unknown;
      ttl_seconds?: unknown;
    } | undefined;

    const clientId =
      typeof body?.client_id === "string" ? body.client_id.trim() : "";
    if (!clientId) {
      res.status(400).json({ error: "INVALID_CLIENT_ID" });
      return;
    }

    const scopesRaw = body?.scopes;
    if (!Array.isArray(scopesRaw) || scopesRaw.length === 0) {
      res.status(400).json({ error: "INVALID_SCOPES" });
      return;
    }
    const scopes: string[] = [];
    for (const s of scopesRaw) {
      if (typeof s !== "string" || !(KNOWN_SCOPES as readonly string[]).includes(s)) {
        res.status(400).json({ error: "INVALID_SCOPES" });
        return;
      }
      scopes.push(s);
    }

    let ttlSeconds = 3600;
    if (body?.ttl_seconds !== undefined) {
      const n = body.ttl_seconds;
      if (
        typeof n !== "number" ||
        !Number.isInteger(n) ||
        n < 60 ||
        n > 86400
      ) {
        res.status(400).json({ error: "INVALID_TTL" });
        return;
      }
      ttlSeconds = n;
    }

    try {
      const issued = issueToken({
        userId: cred.user_id,
        clientId,
        scopes,
        ttlSeconds,
      });
      res.status(200).json({
        token: issued.token,
        session_id: issued.sessionId,
        expires_at: issued.expiresAt,
        scopes: issued.scopes,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("IDENTITY_UNKNOWN_CLIENT") || msg.includes("IDENTITY_CLIENT_REVOKED")) {
        res.status(403).json({ error: msg });
        return;
      }
      res.status(400).json({ error: msg });
    }
  });

  // F5.2 — Logout
  app.post("/api/identity/logout", (_req: Request, res: Response) => {
    res.clearCookie("arki_identity_session", { path: "/" });
    res.status(200).json({ ok: true });
  });

  // (Rate limit simple en memoria para login, F7 endurecerá)
  

  // F5.5 — Crear credencial (loopback-only + X-Internal-Key, mismo guard que introspect)
  // NUNCA expuesto a red externa. Solo para bootstrap y automatización local.
  app.post("/api/internal/identity/credential", async (req: Request, res: Response) => {
    if (!identityEnabled()) {
      res.status(503).json({ error: "IDENTITY_DISABLED" });
      return;
    }
    if (!isLoopback(req)) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    if (!keyMatches(req.header(INTERNAL_KEY_HEADER))) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    const body = req.body as { username?: unknown; password?: unknown } | undefined;
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!username || !password) {
      res.status(400).json({ error: "INVALID_BODY" });
      return;
    }
    try {
      const { userId } = await createCredential({ username, password });
      res.status(200).json({ ok: true, userId });
    } catch (e) {
      const msg = String(e);
      if (msg.includes("IDENTITY_USERNAME_TAKEN")) {
        res.status(409).json({ error: "USERNAME_TAKEN" });
      } else if (msg.includes("IDENTITY_INVALID_PASSWORD")) {
        res.status(400).json({ error: "INVALID_PASSWORD" });
      } else if (msg.includes("IDENTITY_INVALID_USERNAME")) {
        res.status(400).json({ error: "INVALID_USERNAME" });
      } else {
        res.status(500).json({ error: "INTERNAL_ERROR" });
      }
    }
  });

  // F2 — Introspección loopback (sin cambios)
  app.post("/api/internal/identity/introspect", (req: Request, res: Response) => {
    if (!identityEnabled()) {
      res.status(503).json({ error: "IDENTITY_DISABLED" });
      return;
    }
    if (!isLoopback(req)) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    if (!keyMatches(req.header(INTERNAL_KEY_HEADER))) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    const token = (req.body as { token?: unknown } | undefined)?.token;
    if (typeof token !== "string" || token.length === 0) {
      res.status(400).json({ error: "INVALID_BODY" });
      return;
    }
    res.status(200).json(introspect(token));
  });
}
