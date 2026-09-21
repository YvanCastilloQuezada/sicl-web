const base = process.env.ARKI_STRESS_BASE_URL ?? "http://127.0.0.1:3000";
const total = Number(process.env.ARKI_STRESS_TOTAL ?? 80);
const concurrency = Number(process.env.ARKI_STRESS_CONCURRENCY ?? 20);

if (!Number.isInteger(total) || total < 1 || total > 200) throw new Error("ARKI_STRESS_TOTAL must be 1..200");
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 40) throw new Error("ARKI_STRESS_CONCURRENCY must be 1..40");

async function request(path, init = {}) {
  const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(5000) });
  const text = await response.text();
  return { status: response.status, body: text.slice(0, 500), headers: Object.fromEntries(response.headers.entries()) };
}

const results = [];
const paths = [
  ["GET", "/api/core/health"],
  ["GET", "/api/core/v1/scales"],
  ["POST", "/api/trpc/projects.create", { headers: { "content-type": "application/json" }, body: JSON.stringify({ json: { name: "stress-no-auth" } }) }],
];

for (let start = 0; start < total; start += concurrency) {
  const batch = Array.from({ length: Math.min(concurrency, total - start) }, async (_, offset) => {
    const [method, path, init] = paths[(start + offset) % paths.length];
    try {
      return { method, path, ...(await request(path, { method, ...(init ?? {}) })) };
    } catch (error) {
      return { method, path, error: String(error) };
    }
  });
  results.push(...(await Promise.all(batch)));
}

const cspResults = [];
for (let start = 0; start < 70; start += concurrency) {
  const batch = Array.from({ length: Math.min(concurrency, 70 - start) }, async () => {
    try {
      return await request("/api/security/csp-report", {
        method: "POST",
        headers: { "content-type": "application/csp-report", origin: base },
        body: JSON.stringify({ "csp-report": { "blocked-uri": "stress-test", "violated-directive": "script-src" } }),
      });
    } catch (error) {
      return { error: String(error) };
    }
  });
  cspResults.push(...(await Promise.all(batch)));
}

const statusCounts = (items) => items.reduce((acc, item) => {
  const key = item.error ? "ERROR" : String(item.status);
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

const summary = {
  base,
  boundedRequests: total,
  concurrency,
  coreAndAuthStatusCounts: statusCounts(results),
  cspReportStatusCounts: statusCounts(cspResults),
  expectedCoreUnavailable: results.filter((item) => item.path.startsWith("/api/core/") && item.status === 503).length,
  unexpected5xx: [...results, ...cspResults].filter((item) => item.status >= 500 && !(item.path?.startsWith("/api/core/") && item.status === 503)),
  noUnexpected5xx: [...results, ...cspResults].every((item) => item.status < 500 || (item.path?.startsWith("/api/core/") && item.status === 503)),
  unauthorizedProtectedCalls: results.filter((item) => item.path === "/api/trpc/projects.create" && [401, 403].includes(item.status)).length,
  rateLimitedCspCalls: cspResults.filter((item) => item.status === 429).length,
  securityHeadersSample: results.find((item) => item.path === "/api/core/health")?.headers ?? {},
};
console.log(JSON.stringify(summary, null, 2));
if (!summary.noUnexpected5xx) process.exitCode = 1;
