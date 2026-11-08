/**
 * ARKI Identity — OIDC/OAuth2 con Gitea (Camino A: OAuth2 puro).
 *
 * Flujo:
 *   GET  /api/identity/oidc/login    → 302 a Gitea /login/oauth/authorize
 *   GET  /api/identity/oidc/callback → intercambia code, lee userinfo,
 *                                      emite cookie JWT ARKI (HS256)
 *   POST /api/identity/oidc/logout   → limpia cookies OIDC y ARKI
 *
 * Modelo:
 *   - state + nonce en cookie httpOnly (TTL 5 min, single-use)
 *   - code → access_token (POST server-side con client_secret)
 *   - access_token → GET /api/v1/user (userinfo)
 *   - username = email de Gitea (decisión: estable y único)
 *   - Si el usuario no existe en arki_identity_credentials, se crea con
 *     enabled=0 (provisión pendiente de admin).
 *   - openId del JWT = "arki-oidc-gitea:<sub>" (distinto de arki-local:*)
 *
 * Config (env vars):
 *   ARKI_OIDC_GITEA_URL            base de Gitea (ej. http://localhost:3000)
 *   ARKI_OIDC_GITEA_CLIENT_ID
 *   ARKI_OIDC_GITEA_CLIENT_SECRET
 *   ARKI_OIDC_GITEA_REDIRECT_URI   exacto al registrado en Gitea
 *   ARKI_OIDC_STATE_COOKIE_MAX_MS  opcional, default 300000 (5 min)
 *
 * Sin dependencias nuevas. Usa fetch global de Node.
 */
import type { Express, Request, Response } from "express";
import { randomBytes, randomUUID } from "node:crypto";
import { getDb } from "./storage";
import { createSessionJwt } from "./auth";

const STATE_COOKIE = "arki_oidc_state";
const NONCE_COOKIE = "arki_oidc_nonce";
const SESSION_COOKIE = "arki_identity_session";
const DEFAULT_STATE_TTL_MS = 5 * 60 * 1000;

interface GiteaConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

function readConfig(): GiteaConfig | null {
  const baseUrl = process.env.ARKI_OIDC_GITEA_URL?.replace(/\/+$/, "");
  const clientId = process.env.ARKI_OIDC_GITEA_CLIENT_ID;
  const clientSecret = process.env.ARKI_OIDC_GITEA_CLIENT_SECRET;
  const redirectUri = process.env.ARKI_OIDC_GITEA_REDIRECT_URI;
  if (!baseUrl || !clientId || !clientSecret || !redirectUri) return null;
  return { baseUrl, clientId, clientSecret, redirectUri };
}

function isSecureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

function setStateCookie(res: Response, value: string, maxAgeMs: number) {
  res.cookie(STATE_COOKIE, value, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  });
}

function setNonceCookie(res: Response, value: string, maxAgeMs: number) {
  res.cookie(NONCE_COOKIE, value, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  });
}

function clearOidcCookies(res: Response) {
  res.clearCookie(STATE_COOKIE, { path: "/" });
  res.clearCookie(NONCE_COOKIE, { path: "/" });
}

export function registerArkiOidcRoutes(app: Express): void {

  // -------------------------------------------------------------
  // GET /api/identity/oidc/login
  // Genera state + nonce, los guarda en cookies, redirige a Gitea.
  // -------------------------------------------------------------
  app.get("/api/identity/oidc/login", (_req: Request, res: Response) => {
    const cfg = readConfig();
    if (!cfg) {
      res.status(503).json({ error: "OIDC_DISABLED" });
      return;
    }
    const state = randomBytes(24).toString("base64url");
    const nonce = randomBytes(16).toString("base64url");
    const ttl = Number(process.env.ARKI_OIDC_STATE_COOKIE_MAX_MS || DEFAULT_STATE_TTL_MS);
    setStateCookie(res, state, ttl);
    setNonceCookie(res, nonce, ttl);

    const authorize = new URL(`${cfg.baseUrl}/login/oauth/authorize`);
    authorize.searchParams.set("client_id", cfg.clientId);
    authorize.searchParams.set("redirect_uri", cfg.redirectUri);
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("scope", "openid email profile");
    authorize.searchParams.set("state", state);
    authorize.searchParams.set("nonce", nonce);

    res.redirect(302, authorize.toString());
  });

  // -------------------------------------------------------------
  // GET /api/identity/oidc/callback?code=...&state=...
  // Valida state, intercambia code, lee userinfo, emite cookie ARKI.
  // -------------------------------------------------------------
  app.get("/api/identity/oidc/callback", async (req: Request, res: Response) => {
    const cfg = readConfig();
    if (!cfg) {
      res.status(503).json({ error: "OIDC_DISABLED" });
      return;
    }

    const code = typeof req.query.code === "string" ? req.query.code : "";
    const stateFromQuery = typeof req.query.state === "string" ? req.query.state : "";
    const stateFromCookie = (req.cookies as Record<string, string> | undefined)?.[STATE_COOKIE] ?? "";

    if (!code) {
      res.status(400).json({ error: "MISSING_CODE" });
      return;
    }
    if (!stateFromQuery || !stateFromCookie || stateFromQuery !== stateFromCookie) {
      res.status(400).json({ error: "INVALID_STATE" });
      return;
    }
    clearOidcCookies(res);

    // Intercambio code → access_token (server-side)
    let accessToken: string;
    let idTokenClaims: Record<string, unknown>;
    try {
      const tokenRes = await fetch(`${cfg.baseUrl}/login/oauth/access_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: cfg.clientId,
          client_secret: cfg.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: cfg.redirectUri,
        }).toString(),
      });
      if (!tokenRes.ok) {
        res.status(502).json({ error: "TOKEN_EXCHANGE_FAILED" });
        return;
      }
      const tokenJson = (await tokenRes.json()) as {
        access_token?: string;
        id_token?: string;
        error?: string;
      };
      if (!tokenJson.access_token) {
        res.status(502).json({ error: tokenJson.error ?? "NO_ACCESS_TOKEN" });
        return;
      }
      accessToken = tokenJson.access_token;

      // En Camino A (OAuth2 puro) no validamos id_token con JWKS.
      // Usamos id_token solo para extraer claims informativos (email, sub).
      // La confianza está en que Gitea autenticó vía HTTPS y nos da el
      // access_token server-side con client_secret.
      idTokenClaims = {};
      if (typeof tokenJson.id_token === "string" && tokenJson.id_token.length > 0) {
        const parts = tokenJson.id_token.split(".");
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
            if (payload && typeof payload === "object") {
              idTokenClaims = payload as Record<string, unknown>;
            }
          } catch {
            // ignorar id_token malformado; usaremos /api/v1/user igual
          }
        }
      }
    } catch {
      res.status(502).json({ error: "TOKEN_EXCHANGE_ERROR" });
      return;
    }

    // Userinfo: fuente de verdad para username/email
    let userInfo: { id?: number; login?: string; email?: string; full_name?: string };
    try {
      const userRes = await fetch(`${cfg.baseUrl}/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      if (!userRes.ok) {
        res.status(502).json({ error: "USERINFO_FAILED" });
        return;
      }
      userInfo = (await userRes.json()) as typeof userInfo;
    } catch {
      res.status(502).json({ error: "USERINFO_ERROR" });
      return;
    }

    const email = typeof userInfo.email === "string" ? userInfo.email.trim() : "";
    const login = typeof userInfo.login === "string" ? userInfo.login.trim() : "";
    if (!email && !login) {
      res.status(502).json({ error: "NO_EMAIL_OR_LOGIN" });
      return;
    }

    // Username ARKI = email (decisión); fallback a login si no hay email.
    const username = email || login;
    const giteaSub = String(userInfo.id ?? idTokenClaims.sub ?? login);

    const db = getDb();
    let cred = db
      .prepare("SELECT user_id, enabled FROM arki_identity_credentials WHERE username = ? LIMIT 1")
      .get(username) as { user_id: string; enabled: number } | undefined;

    if (!cred) {
      // Autoregistro: enabled=0, pendiente de activación por admin.
      const userId = randomUUID();
      try {
        db.prepare(
          `INSERT INTO arki_identity_credentials
             (user_id, username, password_salt, password_hash, enabled)
           VALUES (?, ?, x'00', x'00', 0)`,
        ).run(userId, username);
      } catch {
        // Colisión improbable; releer
        cred = db
          .prepare("SELECT user_id, enabled FROM arki_identity_credentials WHERE username = ? LIMIT 1")
          .get(username) as { user_id: string; enabled: number } | undefined;
        if (!cred) {
          res.status(500).json({ error: "PROVISION_FAILED" });
          return;
        }
      }
      db.prepare(
        `INSERT INTO arki_identity_audit (action, detail) VALUES ('login', ?)`,
      ).run(`oidc_provisioned=${username} enabled=0`);
      if (!cred) {
        const created = db
          .prepare("SELECT user_id, enabled FROM arki_identity_credentials WHERE username = ? LIMIT 1")
          .get(username) as { user_id: string; enabled: number } | undefined;
        cred = created;
      }
    } else {
      db.prepare(
        `INSERT INTO arki_identity_audit (action, detail) VALUES ('login', ?)`,
      ).run(`oidc_login=${username} enabled=${cred.enabled}`);
    }

    if (!cred) {
      res.status(500).json({ error: "PROVISION_FAILED" });
      return;
    }

    // Emitir cookie JWT ARKI.
    // openId = "arki-oidc-gitea:<username>" (email), no <sub>.
    // El sub numérico de Gitea no es útil en ARKI: identificamos por email.
    // Esto permite que /api/identity/token resuelva userId directamente
    // con SELECT user_id WHERE username = ?.
    const appId = process.env.ARKI_IDENTITY_APP_ID || "arki-local";
    const sessionJwt = await createSessionJwt({
      openId: `arki-oidc-gitea:${username}`,
      appId,
      name: login || username,
    });

    res.cookie(SESSION_COOKIE, sessionJwt, {
      httpOnly: true,
      secure: isSecureCookie(),
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 302 al frontend si hay URL configurada; si no, JSON.
    const postLogin = process.env.ARKI_OIDC_POST_LOGIN_REDIRECT;
    if (postLogin) {
      res.redirect(302, postLogin);
      return;
    }
    res.status(200).json({
      ok: true,
      username,
      enabled: cred.enabled === 1,
    });
  });

  // -------------------------------------------------------------
  // POST /api/identity/oidc/logout
  // Limpia cookies OIDC (la cookie ARKI la limpia /api/identity/logout).
  // -------------------------------------------------------------
  app.post("/api/identity/oidc/logout", (_req: Request, res: Response) => {
    clearOidcCookies(res);
    res.status(200).json({ ok: true });
  });
}
