import { writeFile } from "node:fs/promises";

const base = process.env.VITE_PROBE_BASE ?? "http://127.0.0.1:3001";
const queue = ["/src/main.tsx"];
const seen = new Set();
const failures = [];
const modulePattern = /(?:from|import)\s*["'](\/[^"']+)["']/g;

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const response = await fetch(`${base}${path}`);
  const body = await response.text();
  if (!response.ok || /Internal server error|Failed to resolve|Parse error|Pre-transform error/.test(body)) {
    failures.push({ path, status: response.status, body: body.slice(0, 500) });
    continue;
  }
  for (const match of body.matchAll(modulePattern)) {
    const child = match[1].split("?")[0];
    if (!seen.has(child)) queue.push(child);
  }
}

const report = { base, modulesChecked: seen.size, failures };
await writeFile("/tmp/arki-vite-import-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(failures.length ? 1 : 0);
