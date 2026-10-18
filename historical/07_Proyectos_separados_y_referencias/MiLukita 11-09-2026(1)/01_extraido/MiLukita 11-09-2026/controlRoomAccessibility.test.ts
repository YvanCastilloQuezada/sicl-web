import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const controlRoomSource = readFileSync(resolve(process.cwd(), "client/src/pages/ControlRoom.tsx"), "utf8");
const globalStyles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const identityPanelSource = readFileSync(resolve(process.cwd(), "client/src/components/IdentityParticipationPanel.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const constitutionalReviewSource = readFileSync(resolve(process.cwd(), "client/src/components/ConstitutionalContractReviewPanel.tsx"), "utf8");
const constitutionalContractServiceSource = readFileSync(resolve(process.cwd(), "server/constitutionalContract.ts"), "utf8");
const tvRemoteSource = readFileSync(resolve(process.cwd(), "client/src/components/TvRemoteNeon.tsx"), "utf8");
const tvModeStartSource = readFileSync(resolve(process.cwd(), "client/src/components/TvModeStartScreen.tsx"), "utf8");

describe("Control Room accessibility contract", () => {
  it("exposes an accessible search and reset control", () => {
    expect(controlRoomSource).toContain('aria-label="Buscar en Control Room"');
    expect(controlRoomSource).toContain('aria-label="Limpiar búsqueda"');
    expect(controlRoomSource).toContain("No hay coincidencias para esta búsqueda.");
  });

  it("announces deferred loading and exposes a machine-readable panel state", () => {
    expect(controlRoomSource).toContain("data-panel-state={shouldLoad ? \"loaded\" : \"deferred\"}");
    expect(controlRoomSource).toContain('role="status" aria-live="polite"');
    expect(controlRoomSource).toContain("aria-label={`${label} pendiente de carga`}");
  });

  it("exposes the neon remote without changing the protected experience contract", () => {
    expect(tvRemoteSource).toContain("Math.random() * NEON_COLORS.length");
    expect(tvRemoteSource).toContain("Color de sesión");
    expect(tvRemoteSource).not.toContain("Cambiar color neón del control remoto");
    expect(tvModeStartSource).toContain('import TvRemoteNeon from "@/components/TvRemoteNeon";');
    expect(tvModeStartSource).toContain("rootRef.current?.dispatchEvent(new KeyboardEvent(\"keydown\"");
  });

  it("keeps the loading transition disabled for reduced-motion users", () => {
    expect(globalStyles).toContain(".control-room-deferred-panel.is-loaded");
    expect(globalStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalStyles).toContain("animation: none");
  });

  it("exposes constitutional review, quality gates and interactive state map", () => {
    expect(controlRoomSource).toContain('label="contrato constitucional y quality gates"');
    expect(constitutionalReviewSource).toContain('aria-labelledby="constitutional-review-title"');
    expect(constitutionalReviewSource).toContain('aria-label="Estado de quality gates"');
    expect(constitutionalReviewSource).toContain('aria-label="Mapa interactivo de estados constitucionales"');
    expect(constitutionalReviewSource).toContain('aria-pressed={selectedLayer === group.layer}');
    expect(constitutionalReviewSource).toContain('aria-label="Filtrar quality gates por estado"');
    expect(constitutionalReviewSource).toContain('aria-label="Buscar quality gates por nombre"');
    expect(controlRoomSource).toContain('const IdentityParticipationPanel = lazy(() => import("@/components/IdentityParticipationPanel"));');
    expect(constitutionalReviewSource).toContain('aria-label="Limpiar búsqueda de quality gates"');
    expect(constitutionalReviewSource).toContain("disabled={!gateQuery}");
    expect(constitutionalReviewSource).toContain('aria-label="Resultados de quality gates"');
    expect(constitutionalReviewSource).toContain("handleGateResultKeyDown");
    expect(constitutionalReviewSource).toContain('event.key === "ArrowDown" || event.key === "ArrowRight"');
    expect(constitutionalReviewSource).toContain('event.key === "ArrowUp" || event.key === "ArrowLeft"');
    expect(constitutionalReviewSource).toContain("Usa ↑ ↓ ← →, Inicio o Fin");
    expect(constitutionalReviewSource).toContain('aria-describedby={hoveredLayer === group.layer ? `constitutional-layer-tooltip-${index}` : undefined}');
    expect(constitutionalReviewSource).toContain('role="tooltip"');
    expect(constitutionalReviewSource).toContain('aria-label={`Expandir detalles de ${group.layer}`}');
    expect(constitutionalReviewSource).toContain('aria-label={`Detalles de la capa ${details.layer}`}');
    expect(constitutionalReviewSource).toContain('aria-modal="true"');
    expect(constitutionalReviewSource).toContain('aria-label="Cerrar panel de detalle"');
    expect(constitutionalReviewSource).toContain('event.key === "Escape"');
    expect(constitutionalReviewSource).toContain("detailCloseButtonRef.current?.focus()");
    expect(constitutionalReviewSource).toContain("lastFocusedElementRef.current?.focus()");
    expect(constitutionalReviewSource).toContain("detailPanelRef.current?.querySelectorAll");
    expect(constitutionalReviewSource).toContain("constitutional-details-panel");
    expect(constitutionalReviewSource).toContain('window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220');
    expect(constitutionalReviewSource).toContain("Confirmar {pendingDecision === \"HUMAN_APPROVED\" ? \"aprobación\" : \"rechazo\"} documental");
    expect(constitutionalReviewSource).toContain("`Confirmar ${pendingDecision === \"HUMAN_APPROVED\" ? \"aprobación\" : \"rechazo\"}`");
    expect(constitutionalReviewSource).toContain("reviewConstitutionalContract.useMutation");
    expect(constitutionalReviewSource).toContain("exportConstitutionalDecisionPdf.useMutation");
    expect(constitutionalReviewSource).toContain("Descargar resumen PDF");
    expect(constitutionalReviewSource).toContain('aria-busy={pdfMutation.isPending}');
    expect(constitutionalReviewSource).toContain('role="status" aria-live="polite"');
    expect(constitutionalReviewSource).toContain("Generando PDF…");
    expect(constitutionalReviewSource).toContain("Resumen PDF generado correctamente");
    expect(constitutionalReviewSource).toContain("Error al generar el resumen PDF");
    expect(constitutionalContractServiceSource).toContain("authorityGranted: false");
    expect(globalStyles).toContain(".constitutional-details-panel.is-open");
    expect(globalStyles).toContain(".constitutional-details-backdrop.is-open");
    expect(globalStyles).toContain(".constitutional-details-panel { opacity: 1; transform: none; transition: none; }");
  });

  it("mounts the global toast provider used by export actions", () => {
    expect(appSource).toContain("import { Toaster } from \"@/components/ui/sonner\";");
    expect(appSource).toContain("<Toaster />");
  });

  it("exposes exact chart values and safe export actions", () => {
    expect(identityPanelSource).toContain("function DeviceTooltip");
    expect(identityPanelSource).toContain("toFixed(1)");
    expect(identityPanelSource).toContain('aria-label="Exportar distribución de dispositivos como PNG"');
    expect(identityPanelSource).toContain('aria-label="Preparar distribución de dispositivos como PDF"');
    expect(identityPanelSource).toContain("exportDeviceChartPng");
    expect(identityPanelSource).toContain("openDeviceChartPdf");
    expect(identityPanelSource).toContain("disabled={!analyticsFrom && !analyticsTo && !compareFrom && !compareTo}");
    expect(identityPanelSource).toContain('aria-label="Fecha inicial del rango comparado"');
    expect(identityPanelSource).toContain('aria-label="Exportar datos de dispositivos como CSV"');
    expect(identityPanelSource).toContain('aria-label="Detalle táctil de dispositivos"');
    expect(identityPanelSource).toContain('role="status" aria-live="polite"');
  });
});
