#!/usr/bin/env node
"use strict";
/**
 * ARKI Live Pulse: read-only observation, NEVER a second canonical store.
 * No automatic approval, promotion, repair, mutation or claims of architectural readiness.
 */
const DEFAULT_TIMEOUT_MS = 5000;
function classify(results) {
  if (!results.length) return "UNCONFIGURED";
  if (results.some(r => r.state === "DOWN")) return "DEGRADED";
  if (results.some(r => r.state !== "UP")) return "UNKNOWN";
  return "OBSERVED_UP";
}
function sanitizeUrl(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP(S) allowed");
  if (url.username || url.password || url.search || url.hash) throw new Error("No credentials, query or fragment in URL");
  return url;
}
async function observe(name, rawUrl, options = {}) {
  const started = Date.now();
  let url;
  try { url = sanitizeUrl(rawUrl); }
  catch { return {name, state:"UNKNOWN", reason:"INVALID_URL", latencyMs:0}; }
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await (options.fetchFn ?? fetch)(url.toString(), {
      method:"GET", signal:controller.signal, redirect:"manual",
      headers:{"accept":"application/json"}
    });
    return {name, state:response.ok?"UP":"DOWN",
      reason:response.ok?"HTTP_OK":"HTTP_"+response.status,
      latencyMs:Date.now()-started};
  } catch(e) {
    return {name, state:"DOWN",
      reason:e?.name==="AbortError"?"TIMEOUT":"NETWORK_ERROR",
      latencyMs:Date.now()-started};
  } finally { clearTimeout(timer); }
}
async function run(config = process.env) {
  const targets = [
    ["core",config.ARKI_CORE_HEALTH_URL],
    ["web",config.ARKI_WEB_HEALTH_URL]
  ].filter(([,url]) => typeof url==="string" && url.trim());
  const results = await Promise.all(targets.map(([name,url])=>observe(name,url)));
  return {
    schema:"arki-live-pulse/v1",
    observedAt:new Date().toISOString(),
    state:classify(results),
    observations:results,
    architecturalState:"UNKNOWN",
    d2CanonicalState:"NOT_INSPECTED",
    agkCanonicalState:"NOT_INSPECTED",
    eventLog:"NOT_MODIFIED",
    note:"Read-only HTTP reachability; UP does not mean architecture, reasoning or E2E is verified."
  };
}
module.exports = {classify,sanitizeUrl,observe,run};
if (require.main === module) {
  run().then(report=>{
    process.stdout.write(JSON.stringify(report,null,2)+"\n");
    if (report.state==="DEGRADED") process.exitCode=1;
    if (report.state==="UNCONFIGURED"||report.state==="UNKNOWN") process.exitCode=2;
  }).catch(()=>{process.stderr.write("ARKI pulse failed\n");process.exitCode=2;});
}
