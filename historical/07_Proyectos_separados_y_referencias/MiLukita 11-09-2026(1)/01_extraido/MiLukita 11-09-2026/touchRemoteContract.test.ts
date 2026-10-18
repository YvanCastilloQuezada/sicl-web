import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/TouchRemotePage.tsx"),
  "utf8"
);
const appSource = readFileSync(
  resolve(process.cwd(), "client/src/App.tsx"),
  "utf8"
);
const remoteSource = readFileSync(
  resolve(process.cwd(), "client/src/components/TvRemoteNeon.tsx"),
  "utf8"
);
const routerSource = readFileSync(
  resolve(process.cwd(), "server/routers.ts"),
  "utf8"
);
const styleSource = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8"
);
const conceptSource = readFileSync(
  resolve(process.cwd(), "docs/MILUKITA_CONTROLLER_PRODUCT_CONCEPT.md"),
  "utf8"
);

describe("MiLukita Touch Remote contract", () => {
  it("is exposed as an independent lazy route", () => {
    expect(appSource).toContain(
      'const TouchRemotePage = lazy(() => import("@/pages/TouchRemotePage"));'
    );
    expect(appSource).toContain(
      '<Route path={"/touch-remote"} component={TouchRemotePage} />'
    );
  });

  it("supports randomized neon colors and saved local profiles", () => {
    expect(pageSource).toContain("Math.random() * NEON_PALETTE.length");
    expect(pageSource).toContain(
      "localStorage.setItem(PROFILE_KEY, JSON.stringify(next))"
    );
    expect(pageSource).toContain("aria-label={`Usar color ${item.name}`}");
    expect(remoteSource).toContain("Math.random() * NEON_COLORS.length");
  });

  it("keeps the MVP presentation-only and labels the temporary session", () => {
    expect(pageSource).toContain("sin autoridad de juego");
    expect(pageSource).toMatch(
      /Solo transmite comandos de presentación\s+permitidos/
    );
    expect(pageSource).toContain("Sesión QR en tiempo real");
    expect(pageSource).toContain("MJP CORE permanece protegido");
    expect(pageSource).toMatch(
      /<TouchSurface\s+color=\{color.hex\}\s+onGesture=\{send\}/
    );
    expect(pageSource).toContain("onPointerDown={down}");
    expect(pageSource).toMatch(
      /onWheel=\{event =>\s+onGesture\(\s*event.deltaY > 0/
    );
    expect(pageSource).toMatch(/const gestureThreshold = Math\.max\(\s*4,\s*Math\.round\(18 - \(sensitivity \?\? 7\) \* 1\.5\)\s*\)/);
    expect(pageSource).toContain('label: "Track Pad"');
    expect(pageSource).toContain('label: "Teclado"');
    expect(pageSource).toContain("MiniKeyboard");
    expect(pageSource).toContain("Borrar última tecla");
    expect(pageSource).toContain("Sesión QR en tiempo real");
    expect(pageSource).toContain("Crear sesión QR de 10 minutos");
    expect(pageSource).toContain("Permisos Controller Lab");
    expect(pageSource).toContain("controller-neon-button");
    expect(pageSource).toContain("Maqueta maestra 8 × 18 cm (4:9)");
    expect(pageSource).toContain("Rotación automática");
    expect(pageSource).toContain('aria-label="Color del rastro de contacto"');
    expect(pageSource).toContain('aria-label="Grosor del rastro de contacto"');
    expect(pageSource).toContain("Restablecer sensibilidad predeterminada");
    expect(pageSource).toContain("Guía de gestos");
    expect(pageSource).toContain("Lukita Star Trail");
    expect(pageSource).toContain("Puntero Lukita Star Trail");
    expect(pageSource).toContain("pointerColor");
    expect(pageSource).toContain("pointerSize");
    expect(pageSource).toContain("const [contacts, setContacts]");
    expect(pageSource).toContain("contactTrails");
    expect(pageSource).toContain("star-trail-burst");
    expect(pageSource).toContain("Compartir enlace o QR");
    expect(pageSource).toContain('aria-label="Bajar volumen"');
    expect(pageSource).toContain('aria-label="Subir volumen"');
    expect(pageSource).toContain('aria-label="Color de barra de volumen"');
    expect(pageSource).toContain("Silenciar volumen");
    expect(pageSource).toContain("volumeVisible");
    expect(pageSource).toContain("volumeColor");
    expect(pageSource).toContain("volumeHideDelay");
    expect(pageSource).toContain("Activar sonido");
    expect(pageSource).toContain("transition-opacity duration-300");
    expect(pageSource).toContain('aria-label="Tiempo de ocultación de barra de volumen"');
    expect(pageSource).toContain('aria-label="Mostrar estela de Lukita Star Trail"');
    expect(pageSource).toContain('aria-label="Duración de la estela de Lukita Star Trail"');
    expect(styleSource).toContain("@keyframes star-trail-burst");
  });

  it("centralizes configurable chrome and provides safe trackpad-plus-keyboard controls", () => {
    expect(pageSource).toContain("ChromeConfigurator");
    expect(pageSource).toContain(
      "Solo este laboratorio cambia los controles de la sesión."
    );
    expect(pageSource).toContain("Bloquear controles");
    expect(pageSource).toContain("Desbloquear controles");
    expect(pageSource).toContain("Luz conexión");
    expect(pageSource).toContain("Mini teclado y puntero");
    expect(pageSource).toContain("Puntero sensible del teclado");
    expect(pageSource).toContain('aria-label="Sensibilidad del touchpad"');
    expect(pageSource).toContain('const [contact, setContact]');
    expect(pageSource).toContain('const [trail, setTrail]');
    expect(pageSource).toContain('onHaptic?.("double-tap")');
    expect(pageSource).toContain('onHaptic?.("swipe")');
    expect(pageSource).toContain("pointers = useRef");
    expect(pageSource).toContain("pinchDistance");
    expect(pageSource).toContain("Intensidad háptica");
    expect(pageSource).toContain('value="soft"');
    expect(pageSource).toContain('value="strong"');
    expect(pageSource).toContain("backdrop-blur-lg");
    expect(pageSource).toContain("Guía de uso");
  });

  it("persists sound alongside layout, color and positions, and guides QR pairing", () => {
    expect(pageSource).toContain("sound: soundEnabled");
    expect(pageSource).toContain("setSoundEnabled(profile.sound ?? true)");
    expect(pageSource).toContain("new AudioContext()");
    expect(pageSource).toContain("Sonido sutil");
    expect(pageSource).toContain("QrLinkGuide");
    expect(pageSource).toContain("Escanea, confirma y controla");
    expect(pageSource).toContain("Celular vinculado correctamente");
  });

  it("uses WebSocket with a safe persisted-command fallback and visible latency state", () => {
    expect(pageSource).toContain("/controller-realtime");
    expect(pageSource).toContain("CONTROLLER_AUTH");
    expect(pageSource).toContain("CONTROLLER_PING");
    expect(pageSource).toContain("WebSocket ·");
    expect(pageSource).toContain("con respaldo seguro");
    expect(pageSource).toContain("connectionQuality");
    expect(pageSource).toContain("Calidad de conexión:");
    expect(pageSource).toContain("Excelente");
    expect(pageSource).toContain("Variable");
  });

  it("keeps imported profiles locally manageable and shows QR generation progress", () => {
    expect(pageSource).toContain('source: "imported"');
    expect(pageSource).toContain("updateProfileMeta");
    expect(pageSource).toContain("removeProfile");
    expect(pageSource).toContain("PROFILE_ICONS");
    expect(pageSource).toContain("Importado ·");
    expect(routerSource).toContain(
      'icon: z.enum(["sparkles", "gamepad", "pointer", "keyboard"])'
    );
    expect(pageSource).toContain("Generando QR seguro…");
    expect(pageSource).toContain("aria-busy={createSession.isPending}");
    expect(pageSource).toContain("animate-spin");
  });

  it("uses a fixed 16x8 cm master mockup and adapts by viewport rotation", () => {
    expect(pageSource).toContain("readDeviceViewport");
    expect(pageSource).toContain("Viewport detectado:");
    expect(pageSource).toContain("deviceViewport.width");
    expect(pageSource).toContain("suggestedProfileMeta");
    expect(pageSource).toContain("profileSuggestion.deviceName");
    expect(pageSource).toContain("connectionAlert");
    expect(pageSource).toContain('role="alert"');
    expect(pageSource).toContain("Conexión inestable:");
    expect(pageSource).toContain("Conexión deficiente:");
  });

  it("offers isolated ratio previews, device presets and a continuous latency color scale", () => {
    expect(pageSource).toContain("PREVIEW_PRESETS");
    expect(pageSource).toContain("ProportionPreview");
    expect(pageSource).toContain("Vista por proporción");
    expect(pageSource).toContain("Esta es una simulación visual aislada");
    expect(pageSource).toContain("Guardar como preset para");
    expect(pageSource).toContain("deviceKind: presetDeviceKind");
    expect(pageSource).toContain("latencyGradientColor");
    expect(pageSource).toContain("interpolateHex");
  });

  it("recommends a preset for the detected ratio and exchanges only safe local preset JSON", () => {
    expect(pageSource).toContain("suggestedPreviewPresetId");
    expect(pageSource).toContain("Recomendado por la proporción actual:");
    expect(pageSource).toContain("Aplicar sugerencia");
    expect(pageSource).toContain("sanitizeDevicePreset");
    expect(pageSource).toContain('format: "milukita-controller-presets"');
    expect(pageSource).toContain("Exportar JSON");
    expect(pageSource).toContain("Importar JSON");
    expect(pageSource).toContain("Ping:");
    expect(pageSource).toContain("Revisa la red local de ambos dispositivos.");
  });

  it("filters stored profiles, confirms JSON imports, and exposes recent latency trend", () => {
    expect(pageSource).toContain("profileSearch");
    expect(pageSource).toContain("profileFilter");
    expect(pageSource).toContain("Buscar perfiles");
    expect(pageSource).toContain("Presets locales");
    expect(pageSource).toContain("Revisar presets antes de importar");
    expect(pageSource).toContain("Importar sin reemplazar");
    expect(pageSource).toContain("pendingPresetImport");
    expect(pageSource).toContain("latencyHistory");
    expect(pageSource).toContain("LatencySparkline");
    expect(pageSource).toContain("Tendencia · últimos");
  });

  it("supports drag-and-drop preset import, grouped favorites, and colored latency peaks", () => {
    expect(pageSource).toContain(
      "Arrastra un archivo JSON aquí o selecciónalo"
    );
    expect(pageSource).toContain("isDraggingPreset");
    expect(pageSource).toContain("onDrop={event =>");
    expect(pageSource).toContain("toggleProfileFavorite");
    expect(pageSource).toContain("Favorito");
    expect(pageSource).toContain('id="latency-history-gradient"');
    expect(pageSource).toContain('stroke="url(#latency-history-gradient)"');
  });

  it("manages profile tags, reveals exact peak pings, and reports JSON drop outcomes", () => {
    expect(pageSource).toContain("profileTagFilter");
    expect(pageSource).toContain("Filtrar por etiqueta");
    expect(pageSource).toContain("addProfileTag");
    expect(pageSource).toContain("removeProfileTag");
    expect(pageSource).toContain("Pico seleccionado:");
    expect(pageSource).toContain("Ping exacto:");
    expect(pageSource).toContain('toast.success("Archivo JSON validado"');
    expect(pageSource).toContain('toast.error("No se pudo cargar el JSON"');
  });

  it("provides orientation, keyboard trackpad sizing, sharing and an accessible 30-second onboarding", () => {
    expect(pageSource).toContain(
      'type OrientationMode = "horizontal" | "vertical" | "auto"'
    );
    expect(routerSource).toContain(
      'orientation: z.enum(["horizontal", "vertical", "auto"])'
    );
    expect(pageSource).toContain('min="20"');
    expect(pageSource).toContain('max="45"');
    expect(pageSource).toContain("trackpadPercent");
    expect(pageSource).toContain("shareProfileMutation");
    expect(pageSource).toContain("importProfileMutation");
    expect(pageSource).toMatch(/No incluye QR, tokens ni datos de\s+conexión/);
    expect(pageSource).toContain("Onboarding · 30 segundos");
    expect(pageSource).toMatch(/role="dialog"/);
    expect(pageSource).toContain(
      'localStorage.setItem("milukita-controller-onboarding", "seen")'
    );
  });

  it("exposes keyboard-sized, labeled control actions", () => {
    expect(pageSource).toContain("aria-label={`Control táctil: ${action}`}");
    expect(remoteSource).toContain('aria-label="Control remoto: arriba"');
    expect(remoteSource).toContain('aria-label="Control remoto: seleccionar"');
  });

  it("supports controlled reconnection, multi-profile export, and manual QR alternative", () => {
    expect(pageSource).toContain("reconnectWebSocket");
    expect(pageSource).toContain("Reconectar ahora");
    expect(pageSource).toContain("reconnectSeconds");
    expect(pageSource).toContain("selectedProfileIds");
    expect(pageSource).toContain("Seleccionar visibles");
    expect(pageSource).toContain("Código manual de vínculo de ocho dígitos");
    expect(pageSource).toContain("Código alternativo de 8 dígitos");
    expect(pageSource).toContain("connectWithManualCode");
  });

  it("supports local theme, custom color and favorite scene controls", () => {
    expect(pageSource).toContain('const [themeMode, setThemeMode]');
    expect(pageSource).toContain('type="color"');
    expect(pageSource).toContain("SCENE_KEY");
    expect(pageSource).toContain("saveFavoriteScene");
    expect(pageSource).toContain("navigator.vibrate");
    expect(styleSource).toContain(".prism-feedback-pulse");
  });

  it("labels the existing directional mode as Game Pad and preserves Mini Teclado orientations", () => {
    expect(pageSource).toContain('id: "remote"');
    expect(pageSource).toContain('label: "Game Pad"');
    expect(pageSource).toContain('const displayVertical = mode === "remote" ? false : autoVertical');
    expect(pageSource).toContain('horizontal ? "flex-row" : "flex-col"');
    expect(pageSource).toContain('Mini teclado y puntero en vertical');
    expect(pageSource).toContain('Mini teclado y puntero en horizontal');
  });

  it("puts presentation controls and signal at the top of Track Pad and Mini Teclado", () => {
    expect(pageSource).toContain("PresentationToolbar");
    expect(pageSource).toContain("Controles superiores de presentación");
    expect(pageSource).toContain("Intensidad de señal:");
    expect(pageSource).toContain("hideReturnAndConnection={true}");
    expect(pageSource).toContain("Modos y candado");
    expect(pageSource).toContain("Estado de encendido y conexión");
    expect(pageSource).toContain("Acceso rápido");
    expect(pageSource).toContain("Cambiar modo rápidamente");
    expect(pageSource).toContain("min-h-12");
    expect(pageSource).toContain("navigator.vibrate?.(18)");
    expect(pageSource).toContain('role="switch"');
    expect(pageSource).toContain("prism-active-mode");
    expect(pageSource).toContain('aria-label={item.label}');
    expect(pageSource).toContain('label: "Atrás"');
    expect(pageSource).toContain('aria-label="Cambiar modo rápidamente"');
    expect(pageSource).toContain("TOOLBAR_ORDER_KEY");
    expect(pageSource).toContain("onToolbarOrder");
  });

  it("keeps Game Pad controls and its 8x18 cm master mockup", () => {
    expect(pageSource).toContain("GAMEPAD_TOP_KEYS");
    expect(pageSource).toContain("Game Pad horizontal");
    expect(pageSource).toContain("Maqueta maestra 8 × 18 cm (4:9)");
    expect(pageSource).toContain('aspect-[9/4]');
    expect(pageSource).toContain('aspect-[4/9]');
    expect(pageSource).toContain("Rotación automática");
    expect(pageSource).toContain("Volumen menos");
    expect(pageSource).toContain("Canal más");
    expect(pageSource).toContain('aria-label="Confirmar foco"');
    expect(pageSource).toContain('mode === "remote"');
    expect(pageSource).toContain('<span aria-hidden="true" />');
  });

  it("exposes the approved AR Stage as a fourth trackpad-first mode", () => {
    expect(pageSource).toContain('id: "ar"');
    expect(pageSource).toContain('label: "AR Stage"');
    expect(pageSource).toContain("ARStagePad");
    expect(pageSource).toContain("Superficie AR lista");
    expect(pageSource).toContain("Pellizco activo · redimensiona Lukita");
    expect(pageSource).toContain("Arrastre activo · mueve Lukita");
    expect(pageSource).toContain('mode === "ar"');
    expect(pageSource).toContain('setOrientation("auto")');
    expect(pageSource).toContain('"Cámara trasera activa"');
    expect(pageSource).toContain('"Captura de foto preparada"');
    expect(pageSource).toContain("Compartir requiere revisión");
    expect(pageSource).toContain("Activar ubicación");
    expect(pageSource).toContain("Ubicación AR activa · Lukita lista");
    expect(pageSource).toContain("Activa ubicación para capturar");
    expect(pageSource).toContain("Cámara frontal activa");
    expect(pageSource).toContain("lista para cámara");
    expect(pageSource).toContain('safeProfile.mode === "ar" || safeProfile.mode === "universal" ? "trackpad"');
  });

  it("preserves the original Prism wireframe without importing third-party trade dress", () => {
    expect(pageSource).toContain("prism-controller-shell");
    expect(pageSource).toContain("PrismSceneActions");
    expect(pageSource).toContain("FocusDisc");
    expect(pageSource).toContain("Prism Track Pad");
    expect(styleSource).toContain(".prism-focus-disc");
    expect(styleSource).toContain(".prism-track-surface");
    expect(conceptSource).toContain("por un porcentaje visual");
    expect(conceptSource).toContain("capacidades genéricas");
    expect(conceptSource).toContain("No se adopta");
  });
});
