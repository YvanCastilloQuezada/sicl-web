import fs from "node:fs";
const manifest = JSON.parse(fs.readFileSync("client/public/manifest.webmanifest", "utf8"));
if (manifest.start_url !== "/arki" || manifest.display !== "standalone" || manifest.scope !== "/") throw new Error("Invalid PWA manifest");
const serviceWorker = fs.readFileSync("client/public/sw.js", "utf8");
for (const marker of ["/api/", "/trpc/", "/oauth/", "/offline.html", "SKIP_WAITING"]) {
  if (!serviceWorker.includes(marker)) throw new Error(`Missing service-worker guard: ${marker}`);
}
for (const file of ["client/public/offline.html", "client/public/arki-icon.svg", "client/src/components/PwaInstallPrompt.tsx"]) {
  if (!fs.statSync(file).size) throw new Error(`Empty PWA artifact: ${file}`);
}
console.log("PWA_STATIC_VALIDATION_PASS");
