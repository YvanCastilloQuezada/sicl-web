import { chromium, type Browser, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const describeBrowser = describe.skipIf(process.env.RUN_BROWSER_E2E !== "1");
const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
let browser: Browser;
let page: Page;

async function getPublicRoundId() {
  const input = encodeURIComponent(JSON.stringify({ 0: { json: null } }));
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`${baseUrl}/api/trpc/broadcast.rounds?batch=1&input=${input}`, { headers: { "x-milukita-e2e": "1" } });
    if (response.status === 200) {
      const payload = await response.json() as Array<{ result?: { data?: { json?: Array<{ roundId?: string }> } } }>;
      const rounds = payload[0]?.result?.data?.json ?? [];
      return rounds.find((round) => round.roundId)?.roundId ?? null;
    }
    if (response.status !== 429) expect(response.status).toBe(200);
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }
  throw new Error("broadcast.rounds permaneció limitado por rate limit durante el E2E");
}

async function enterMode(target: Page, mode: "live" | "online") {
  await target.goto(`${baseUrl}/tv`, { waitUntil: "domcontentloaded" });
  const heading = target.locator("h1").first();
  await heading.waitFor({ state: "visible", timeout: 15_000 });
  await target.getByRole("button", { name: mode === "live" ? /Entrar al modo en vivo/ : /Entrar al modo en línea/ }).click();
  await target.locator('p:has-text("Modo seleccionado:")').waitFor({ state: "visible", timeout: 15_000 });
  await closeTouchGuideIfVisible(target);
}

async function closeTouchGuideIfVisible(target: Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const closes = target.getByRole("button", { name: "Cerrar" });
    let closed = false;
    for (let index = 0; index < await closes.count(); index += 1) {
      const close = closes.nth(index);
      if (await close.isVisible().catch(() => false)) {
        await close.click();
        closed = true;
      }
    }
    if (!closed) return;
  }
}

async function assertVisible(target: Page, selector: string, label: string) {
  const locator = target.locator(selector).first();
  if (!(await locator.isVisible())) throw new Error(`${label} no es visible`);
  return locator;
}

async function assertContainsText(target: Page, selector: string, expected: string, label: string) {
  const text = await target.locator(selector).first().textContent();
  if (!text?.includes(expected)) throw new Error(`${label} no contiene «${expected}»: ${text ?? ""}`);
}

describeBrowser("E2E navegador del canal TV y overlay", () => {
  beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    page = await browser.newPage({ viewport: { width: 1280, height: 720 }, acceptDownloads: true, extraHTTPHeaders: { "x-milukita-e2e": "1" } });
    await page.addInitScript(() => {
      localStorage.setItem("mjp-touch-guide-seen", "1");
    });
  });

  afterAll(async () => {
    await browser?.close();
  });

  it("permite elegir en vivo/en línea, cambiar de modo y salir al portal", async () => {
    await page.goto(`${baseUrl}/tv`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15_000 });
    await page.getByRole("button", { name: /Entrar al modo en línea/ }).click();
    await closeTouchGuideIfVisible(page);
    await assertContainsText(page, 'p:has-text("Modo seleccionado:")', "Ver en línea", "Modo TV");
    await page.locator('main button', { hasText: "Cambiar modo" }).click();
    await assertVisible(page, 'h1', "Selector de modo TV tras cambio");
    await page.getByRole("button", { name: /Entrar al modo en vivo/ }).click();
    await closeTouchGuideIfVisible(page);
    await assertContainsText(page, 'p:has-text("Modo seleccionado:")', "Ver transmisión en vivo", "Modo TV en vivo");
    await page.locator('main button', { hasText: "Salir" }).last().click();
    if (!new URL(page.url()).pathname.endsWith("/")) throw new Error(`Salir no llevó al portal: ${page.url()}`);
  }, 30_000);

  it("persiste el tema de notificaciones entre recargas de la vista TV", async () => {
    await enterMode(page, "online");
    const themeSelect = page.getByLabel("Seleccionar tema de notificaciones");
    await themeSelect.waitFor({ state: "visible", timeout: 15_000 });
    await themeSelect.selectOption("contrast");
    await page.waitForFunction(() => localStorage.getItem("mjp-tv-notification-theme") === "contrast");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15_000 });
    await page.getByRole("button", { name: /Entrar al modo en línea/ }).click();
    const reloadedTheme = page.getByLabel("Seleccionar tema de notificaciones");
    await reloadedTheme.waitFor({ state: "visible", timeout: 15_000 });
    if (await reloadedTheme.inputValue() !== "contrast") throw new Error("El tema no persistió tras la recarga");
  }, 30_000);

  it("mantiene el selector TV usable en escritorio, tablet y celular", async () => {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto(`${baseUrl}/tv`, { waitUntil: "domcontentloaded" });
      await page.locator("h1").first().waitFor({ state: "visible", timeout: 15_000 });
      await closeTouchGuideIfVisible(page);
      const online = page.getByRole("button", { name: /Entrar al modo en línea/ });
      if (!(await online.isVisible())) throw new Error(`Modo en línea no visible en ${viewport.width}px`);
      await online.click();
      await assertContainsText(page, 'p:has-text("Modo seleccionado:")', "Ver en línea", `Modo responsive en ${viewport.width}px`);
    }
  }, 30_000);

  it("exporta las estadísticas del manifest como PNG con marca configurable", async () => {
    const roundId = await getPublicRoundId();
    expect(roundId, "Se necesita una ronda pública para validar el overlay").toBeTruthy();
    await page.goto(`${baseUrl}/overlay/${roundId}`, { waitUntil: "domcontentloaded" });
    const exportButton = page.getByRole("button", { name: "Exportar PNG" });
    await exportButton.waitFor({ state: "visible", timeout: 15_000 });
    const brandInput = page.getByLabel("Marca de agua o logotipo textual");
    await brandInput.fill("MJP QA TV");
    await page.getByRole("checkbox", { name: "Incluir marca de agua" }).check();
    await page.waitForFunction(() => localStorage.getItem("mjp-export-brand-name") === "MJP QA TV");
    const downloadPromise = page.waitForEvent("download");
    await exportButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^milukita-event-.*\.png$/);
  }, 30_000);
});
