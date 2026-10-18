import { chromium } from "playwright-core";
const base = "http://127.0.0.1:3000";
const input = encodeURIComponent(JSON.stringify({ 0: { json: null } }));
const response = await fetch(`${base}/api/trpc/broadcast.rounds?batch=1&input=${input}`);
const payload = await response.json();
const roundId = payload[0]?.result?.data?.json?.[0]?.roundId;
console.log("round", roundId);
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ acceptDownloads: true });
page.on("console", message => console.log("console", message.type(), message.text()));
page.on("pageerror", error => console.log("pageerror", error.message));
page.on("requestfailed", request => console.log("requestfailed", request.url(), request.failure()?.errorText));
try {
  console.log("goto");
  await page.goto(`${base}/overlay/${roundId}`, { waitUntil: "domcontentloaded", timeout: 8000 });
  console.log("loaded", page.url());
  console.log("body", (await page.locator("body").innerText()).slice(0, 1200));
  const button = page.getByRole("button", { name: "Exportar PNG" });
  console.log("count", await button.count(), "visible", await button.isVisible().catch(() => false));
  await button.waitFor({ state: "visible", timeout: 8000 });
  console.log("button visible");
  const promise = page.waitForEvent("download", { timeout: 8000 });
  await button.click({ timeout: 8000 });
  console.log("clicked");
  const download = await promise;
  console.log("download", download.suggestedFilename());
} catch (error) { console.log("FAIL", error.message); }
await browser.close();
