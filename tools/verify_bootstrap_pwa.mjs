import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("client/public/manifest.webmanifest", "utf8"));
const worker = fs.readFileSync("client/public/sw.js", "utf8");
const builtIndex = fs.readFileSync("dist/public/index.html", "utf8");

const checks = {
  manifestName: manifest.name === "ARKI Web App",
  manifestStart: manifest.start_url === "/arki",
  workerExists: worker.includes("CACHE_NAME") && worker.includes("offline.html"),
  workerDoesNotCacheApi: worker.includes('url.pathname.startsWith("/api/")') && worker.includes('url.pathname.startsWith("/trpc/")') && worker.includes('url.pathname.startsWith("/oauth/")'),
  builtEntry: /<script type="module" crossorigin src="\/assets\/index-[^"]+\.js">/.test(builtIndex),
  noDynamicMainProxy: !builtIndex.includes("html-proxy") && !builtIndex.includes('import("/src/main.tsx')
};

for (const [name, pass] of Object.entries(checks)) console.log(`${name}=${pass ? "PASS" : "FAIL"}`);
if (!Object.values(checks).every(Boolean)) process.exit(1);
console.log("BOOTSTRAP_PWA_STATIC_VALIDATION=PASS");
