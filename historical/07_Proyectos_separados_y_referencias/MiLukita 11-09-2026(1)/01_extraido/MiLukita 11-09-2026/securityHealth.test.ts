import express from "express";
import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { registerHealthRoutes } from "./health";
import { createRequestRateLimiters, securityHeaders } from "./security";

const servers: ReturnType<typeof createServer>[] = [];

async function start(app: express.Express) {
  const server = createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo abrir el servidor de prueba.");
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});

describe("controles HTTP del piloto", () => {
  it("publica cabeceras de seguridad y un identificador de solicitud", async () => {
    const app = express();
    app.use((req, res, next) => { res.setHeader("x-request-id", req.headers["x-request-id"] ?? "generated-for-test"); next(); });
    app.use(securityHeaders());
    app.get("/probe", (_req, res) => res.status(200).json({ ok: true }));
    const base = await start(app);

    const response = await fetch(`${base}/probe`);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(response.headers.get("x-request-id")).toBe("generated-for-test");
  });

  it("limita solicitudes repetidas y permite lecturas en el límite de mutaciones", async () => {
    const app = express();
    const { apiLimiter, mutationLimiter } = createRequestRateLimiters({ windowMs: 60_000, apiLimit: 1, mutationLimit: 1 });
    app.use("/api", apiLimiter, mutationLimiter);
    app.get("/api/read", (_req, res) => res.status(200).json({ ok: true }));
    const base = await start(app);

    expect((await fetch(`${base}/api/read`)).status).toBe(200);
    const blocked = await fetch(`${base}/api/read`);
    expect(blocked.status).toBe(429);
    await expect(blocked.json()).resolves.toEqual({ error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." });
  });

  it("distingue disponibilidad del servicio y de la base de datos", async () => {
    const healthy = express();
    registerHealthRoutes(healthy, async () => true);
    const healthyBase = await start(healthy);
    expect((await fetch(`${healthyBase}/health`)).status).toBe(200);
    expect(await (await fetch(`${healthyBase}/health/db`)).json()).toEqual({ ok: true, service: "database" });

    const unavailable = express();
    registerHealthRoutes(unavailable, async () => false);
    const unavailableBase = await start(unavailable);
    const response = await fetch(`${unavailableBase}/health/db`);
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ ok: false, service: "database", reason: "unavailable" });
  });
});
