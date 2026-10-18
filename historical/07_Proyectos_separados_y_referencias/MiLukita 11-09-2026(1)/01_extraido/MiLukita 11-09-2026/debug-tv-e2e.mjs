import { chromium } from "playwright-core";
const base = "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("console", message => console.log("console", message.type(), message.text()));
page.on("pageerror", error => console.log("pageerror", error.message));
for (const step of [
  ["goto", () => page.goto(`${base}/tv`, { waitUntil: "domcontentloaded", timeout: 8000 })],
  ["start", () => page.locator("h1").waitFor({ state: "visible", timeout: 5000 })],
  ["online", () => page.getByRole("button", { name: /Entrar al modo en línea/ }).click({ timeout: 5000 })],
  ["close guide", async () => { for (let attempt = 0; attempt < 4; attempt += 1) { const closes = page.getByRole("button", { name: "Cerrar" }); let closed = false; for (let index = 0; index < await closes.count(); index += 1) { const close = closes.nth(index); if (await close.isVisible().catch(() => false)) { await close.click(); closed = true; } } if (!closed) break; } }],
  ["mode text", () => page.locator('p:has-text("Modo seleccionado:")').waitFor({ state: "visible", timeout: 5000 })],
  ["change", () => page.locator('main button', { hasText: "Cambiar modo" }).click({ timeout: 5000 })],
  ["start2", () => page.locator("h1").waitFor({ state: "visible", timeout: 5000 })],
  ["live", () => page.getByRole("button", { name: /Entrar al modo en vivo/ }).click({ timeout: 5000 })],
  ["exit", () => page.locator('main button', { hasText: "Salir" }).last().click({ timeout: 5000 })],
]) {
  try { await step[1](); console.log("OK", step[0], page.url());   } catch (error) { console.log("FAIL", step[0], error.message); console.log((await page.locator("body").innerText()).slice(0, 1000)); console.log(await page.locator("button").evaluateAll(buttons => buttons.map(button => ({ text: button.textContent?.trim(), aria: button.getAttribute("aria-label"), html: button.outerHTML.slice(0, 180) })))); break; }
}
await browser.close();
