"use strict";
/**
 * ARKI Maqueta Viva Server
 * Sirve `maqueta-viva.template.html` (10 etapas F1-F10) en el puerto 8769.
 * Inyecta 2 tokens: __ARKI_STATE_JSON__ y __ARKI_ASSEMBLY_JSON__.
 * Read-only: no escribe en el repo ni en la DB.
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATE = path.join(__dirname, "maqueta-viva.template.html");
const STATE = path.join(ROOT, "docs", "arki-master-map", "ARKI_MASTER_MAP_STATE.json");
const REGISTRY = path.join(__dirname, "assembly-registry.json");
const PORT = Number(process.env.ARKI_MAQUETA_VIVA_PORT || 8769);

function safeData(raw) {
  return raw
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildPage() {
  if (!fs.existsSync(TEMPLATE)) throw new Error("TEMPLATE_MISSING: " + TEMPLATE);
  if (!fs.existsSync(STATE)) throw new Error("STATE_MISSING: " + STATE);
  if (!fs.existsSync(REGISTRY)) throw new Error("REGISTRY_MISSING: " + REGISTRY);

  const template = fs.readFileSync(TEMPLATE, "utf8");
  const stateJson = fs.readFileSync(STATE, "utf8");
  const registryJson = fs.readFileSync(REGISTRY, "utf8");

  if (!template.includes("__ARKI_STATE_JSON__")) throw new Error("TOKEN_STATE_MISSING");
  if (!template.includes("__ARKI_ASSEMBLY_JSON__")) throw new Error("TOKEN_REGISTRY_MISSING");

  return template
    .replace(/__ARKI_STATE_JSON__/g, safeData(stateJson))
    .replace(/__ARKI_ASSEMBLY_JSON__/g, safeData(registryJson));
}

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (req.method !== "GET") {
    res.writeHead(405, { Allow: "GET" });
    res.end("Method Not Allowed");
    return;
  }
  if (pathname === "/") {
    try {
      const page = buildPage();
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(page);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("ARKI_MAQUETA_VIVA_ERROR: " + err.message);
    }
    return;
  }
  if (pathname === "/api/state") {
    try {
      json(res, 200, JSON.parse(fs.readFileSync(STATE, "utf8")));
    } catch (err) {
      json(res, 500, { error: err.message });
    }
    return;
  }
  if (pathname === "/api/registry") {
    try {
      json(res, 200, JSON.parse(fs.readFileSync(REGISTRY, "utf8")));
    } catch (err) {
      json(res, 500, { error: err.message });
    }
    return;
  }
  if (pathname === "/health") {
    json(res, 200, {
      status: "ok",
      schema: "ARKI-MAQUETA-VIVA-SERVER-1",
      port: PORT,
      template: TEMPLATE,
      tokens: ["__ARKI_STATE_JSON__", "__ARKI_ASSEMBLY_JSON__"],
    });
    return;
  }
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  process.stdout.write("ARKI_MAQUETA_VIVA_READY http://0.0.0.0:" + PORT + "\n");
});

server.on("error", (err) => {
  process.stderr.write("ARKI_MAQUETA_VIVA_FAIL " + err.message + "\n");
  process.exitCode = 1;
});
