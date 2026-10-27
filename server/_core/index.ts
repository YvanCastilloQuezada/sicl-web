import "dotenv/config";
import express from "express";
import compression from "compression";
import { createServer } from "http";
import net from "net";
import { randomUUID } from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerArkiLocalRoutes } from "./arkiMo08LocalAuth";
import { registerStorageProxy } from "./storageProxy";
import { registerArkiMo22 } from "./arkiMo22Bridge";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { checkCoreHealth, classifyCoreError, proxyCoreRequest } from "../coreHttpClient";
import { attachParametricWebSocket } from "../parametricRealtime";
import { rateLimit, recordSecurityEvent, securityHeaders, writeRequestGuard } from "../security";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  const server = createServer(app);
  app.use(securityHeaders());

  // Platform health check: verifies the Web process independently of Core availability.
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "sicl-web" });
  });

  // ARKI_DEV_OPEN_API_GUARD_V4
  app.use("/api", (req, res, next) => {
    if (process.env.ARKI_DEV_OPEN !== "1") {
      next();
      return;
    }

    if (
      req.method === "GET" &&
      req.path === "/core/health"
    ) {
      res.status(200).json({
        status: "DEV_OPEN_LOCKED",
        coreAccess: false,
        databaseAccess: false,
        writes: false
      });
      return;
    }

    res.status(403).json({
      error: "ARKI_DEV_OPEN_LOCKED_V4"
    });
  });

  // ARKI_DEV_OPEN_WRITE_GATE_V1
  // Development instance: fail closed for API writes.
  // Production behavior is unchanged.
  app.use("/api", (req, res, next) => {
    if (
      process.env.ARKI_DEV_OPEN === "1" &&
      !["GET", "HEAD", "OPTIONS"].includes(req.method)
    ) {
      res.status(403).json({
        error: "ARKI_DEV_OPEN_READ_ONLY",
        message: "Development access cannot perform API writes or approvals.",
      });
      return;
    }
    next();
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(compression({ threshold: 1024 }));
  app.use(writeRequestGuard);
  app.post("/api/security/csp-report", rateLimit({ name: "csp-report", max: 60 }), (req, res) => {
    const report = (req.body?.["csp-report"] ?? req.body) as Record<string, unknown>;
    recordSecurityEvent({
      kind: "CSP_REPORT",
      path: String(report["document-uri"] ?? req.path),
      method: req.method,
      ip: req.ip || req.socket.remoteAddress || "unknown",
      status: 200,
      detail: JSON.stringify({ blockedUri: report["blocked-uri"] ?? "unknown", violatedDirective: report["violated-directive"] ?? "unknown", sourceFile: report["source-file"] ?? "unknown" }).slice(0, 1000),
    });
    res.status(204).end();
  });
  app.use("/api/oauth", rateLimit({ name: "oauth", max: 30 }));
  app.use("/api/core", rateLimit({ name: "core", max: 90 }));
  app.use("/api/trpc", rateLimit({ name: "trpc", max: 180 }));
  registerArkiMo22(app);
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerArkiLocalRoutes(app);
  app.get("/api/core/health", async (_req, res) => {
    const correlationId = randomUUID();
    res.setHeader("x-correlation-id", correlationId);
    try {
      const health = await checkCoreHealth();
      res.status(200).json({ ...health, correlation_id: correlationId });
    } catch (error) {
      const code = classifyCoreError(error);
      const message = error instanceof Error && error.message === "SICL_CORE_URL is required" ? "Core no configurado. Contacta al administrador." : "Core remoto no disponible";
      res.status(code === "CORE_UNAUTHORIZED" ? 502 : 503).json({ status: "error", code, message, correlation_id: correlationId });
    }
  });
  app.use("/api/core", async (req, res) => {
    const correlationId = randomUUID();
    res.setHeader("x-correlation-id", correlationId);
    try {
      const path = req.originalUrl.slice("/api/core".length) || "/";
      const result = await proxyCoreRequest(path, {
        method: req.method,
        headers: req.headers["content-type"] ? { "content-type": String(req.headers["content-type"]) } : undefined,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
      });
      res.status(result.status).type(result.contentType).send(result.body);
    } catch (error) {
      const code = classifyCoreError(error);
      const message = error instanceof Error && error.message === "SICL_CORE_URL is required" ? "Core no configurado. Contacta al administrador." : error instanceof Error && error.message === "SICL_CORE_SERVICE_TOKEN is required" ? "Core no autenticado. Contacta al administrador." : error instanceof Error && error.name === "AbortError" ? "Core remoto no respondió a tiempo." : "Core remoto no disponible";
      res.status(code === "CORE_UNAUTHORIZED" ? 502 : 503).json({ status: "error", code, message, correlation_id: correlationId });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  // Managed production platforms require binding to their assigned PORT exactly.
  const port = process.env.NODE_ENV === "production" || process.env.ARKI_DEV_SOCKET
    ? preferredPort
    : await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  const devSocket = process.env.ARKI_DEV_SOCKET;
  if (devSocket) {
    if (process.env.ARKI_DEV_OPEN !== "1" || process.env.NODE_ENV !== "production") {
      throw new Error("ARKI_DEV_SOCKET requires ARKI_DEV_OPEN=1 and NODE_ENV=production");
    }
    if (!devSocket.startsWith("/run/user/") || !devSocket.endsWith("/arki-dev-open.sock")) {
      throw new Error("ARKI_DEV_SOCKET must be under /run/user/<uid>/arki-dev-open.sock");
    }
    const fs = await import("node:fs");
    if (fs.existsSync(devSocket)) throw new Error("Socket path already exists; refusing to overwrite");
    server.listen(devSocket, () => {
      fs.chmodSync(devSocket, 0o600);
      console.log("ARKI isolated development socket ready");
    });
  } else {
    server.listen(port, "0.0.0.0", () => {
      if (process.env.ARKI_DEV_OPEN !== "1") attachParametricWebSocket(server);
      console.log(`Server running on http://localhost:${port}/`);
    });
  }
}

startServer().catch(console.error);
