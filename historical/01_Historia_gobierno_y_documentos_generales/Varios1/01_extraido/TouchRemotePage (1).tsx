import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  Camera,
  CameraOff,
  ArrowRight,
  ArrowUp,
  Check,
  CircleUserRound,
  Copy,
  CornerDownLeft,
  Delete,
  Download,
  HelpCircle,
  Home,
  Image,
  Keyboard,
  Lock,
  LockKeyhole,
  Loader2,
  LogOut,
  MousePointer2,
  Moon,
  Palette,
  Power,
  Play,
  RotateCcw,
  Save,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Unlock,
  Undo2,
  Video,
  Volume1,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import QRCode from "qrcode";
import { canSubmitLukitaPointForReview } from "@/../../shared/lukitaPointPublication";
import { AGENT_AUTONOMY_BACKLOG } from "@/../../shared/agentAutonomyBacklog";

type NeonColor = { name: string; hex: string };

function downloadAgentStatusVisualReport() {
  const totals = AGENT_AUTONOMY_BACKLOG.reduce((summary, item) => ({ ...summary, [item.currentState]: (summary[item.currentState as keyof typeof summary] ?? 0) + 1 }), { IMPLEMENTED: 0, PARTIAL: 0, PREPARED: 0, PLANNED: 0 });
  const humanGateCount = AGENT_AUTONOMY_BACKLOG.filter((item) => item.humanGates.length > 0).length;
  const rows = AGENT_AUTONOMY_BACKLOG.map((item, index) => {
    const y = 160 + index * 34;
    const stateColor = item.currentState === "IMPLEMENTED" ? "#53e6ad" : item.currentState === "PARTIAL" ? "#ffd36a" : item.currentState === "PREPARED" ? "#7de9ff" : "#c8a8ff";
    return `<g><rect x="32" y="${y - 20}" width="1036" height="28" rx="8" fill="#ffffff" fill-opacity=".045"/><text x="48" y="${y - 2}" fill="#ffffff" font-size="13" font-weight="700">${index + 1}. ${item.agentId}</text><text x="330" y="${y - 2}" fill="${stateColor}" font-size="11" font-weight="700">${item.currentState}</text><text x="480" y="${y - 2}" fill="#cbd5e1" font-size="10">Puede avanzar: ${item.safeDeliverables.join(" · ")}</text><text x="48" y="${y + 14}" fill="#94a3b8" font-size="9">Gate humano: ${item.humanGates.join(" · ")}</text></g>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="760" viewBox="0 0 1100 760"><rect width="1100" height="760" fill="#07131a"/><text x="32" y="34" fill="#82f5d0" font-size="12" font-weight="700" letter-spacing="2">MILUKITA · CONTROL LAB · COMPLIANCE OS</text><text x="32" y="60" fill="#ffffff" font-size="24" font-weight="800">Estado y capacidades seguras de agentes</text><text x="32" y="76" fill="#94a3b8" font-size="10">Reporte visual local · ${new Date().toISOString()} · no certifica producción ni concede autoridad</text><text x="32" y="105" fill="#cbd5e1" font-size="11">Total: 16 agentes · IMPLEMENTED: ${totals.IMPLEMENTED} · PARTIAL: ${totals.PARTIAL} · PREPARED: ${totals.PREPARED} · PLANNED: ${totals.PLANNED}</text><text x="32" y="123" fill="#ffd36a" font-size="10">Gates humanos: ${humanGateCount}/16 (${Math.round((humanGateCount / AGENT_AUTONOMY_BACKLOG.length) * 100)}%) · publicación y autoridad de CORE permanecen bloqueadas</text>${rows}</svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = "milukita-agent-status-report.svg"; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type ControllerMode = "remote" | "trackpad" | "keyboard" | "ar" | "universal";
type GestureAction =
  | "up"
  | "left"
  | "select"
  | "right"
  | "down"
  | "scroll-up"
  | "scroll-down"
  | "tap"
  | "back"
  | "home"
  | "exit"
  | "text"
  | "playback"
  | "qr"
  | "volume-down"
  | "volume-up"
  | "channel-down"
  | "channel-up";
type ControlPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
type ControllerChrome = {
  modePosition: ControlPosition;
  modeColor: string;
  lockPosition: ControlPosition;
  lockColor: string;
  returnPosition: ControlPosition;
  returnColor: string;
  connectionPosition: ControlPosition;
  connectionColor: string;
};
type OrientationMode = "horizontal" | "vertical" | "auto";
type ProfileIcon = "sparkles" | "pointer" | "keyboard" | "ar";
type DeviceKind = "phone" | "tablet" | "desktop";
type ThemeMode = "dark" | "midnight";
type HapticIntensity = "soft" | "medium" | "strong";
type SoundEffect = "soft" | "spark" | "chime";
type PointerStarSize = "small" | "medium" | "large";
type ToolbarIconId = "back" | "home" | "exit" | "rewind";
type FavoriteScene = {
  id: number;
  name: string;
  mode: ControllerMode;
  color: string;
  layout: Profile["layout"];
  orientation: OrientationMode;
  trackpadPercent: number;
  createdAt: number;
};
type PreviewPresetId =
  | "native"
  | "phone-tall"
  | "phone-classic"
  | "foldable"
  | "tv"
  | "laptop";
type Profile = {
  name: string;
  color: string;
  layout: "compact" | "spacious";
  vibration: boolean;
  sound?: boolean;
  soundEffect?: SoundEffect;
  mode?: ControllerMode;
  chrome?: ControllerChrome;
  orientation?: OrientationMode;
  trackpadPercent?: number;
  sensitivity?: number;
  traceColor?: string;
  traceWidth?: number;
  hapticIntensity?: HapticIntensity;
  pointerColor?: string;
  pointerSize?: PointerStarSize;
  trailEnabled?: boolean;
  trailDuration?: number;
  volumeColor?: string;
  muted?: boolean;
  volumeHideDelay?: number;
  icon?: ProfileIcon;
  source?: "local" | "imported";
  shareCode?: string;
  deviceKind?: DeviceKind;
  favorite?: boolean;
  tags?: string[];
  updatedAt: number;
};

const NEON_PALETTE: readonly NeonColor[] = [
  { name: "Cian eléctrico", hex: "#27f5d0" },
  { name: "Fucsia láser", hex: "#ff3cac" },
  { name: "Lima sintética", hex: "#c5ff38" },
  { name: "Naranja plasma", hex: "#ff8a25" },
  { name: "Violeta neón", hex: "#ad7aff" },
] as const;
const PROFILE_ICONS: Record<
  ProfileIcon,
  { label: string; Icon: typeof Sparkles }
> = {
  sparkles: { label: "Brillo", Icon: Sparkles },
  pointer: { label: "Puntero", Icon: MousePointer2 },
  keyboard: { label: "Teclado", Icon: Keyboard },
  ar: { label: "AR Stage", Icon: Sparkles },
};
const PREVIEW_PRESETS: Record<
  PreviewPresetId,
  { label: string; width: number; height: number; deviceKind: DeviceKind }
> = {
  native: {
    label: "Este dispositivo",
    width: 0,
    height: 0,
    deviceKind: "phone",
  },
  "phone-tall": {
    label: "Móvil 20:9",
    width: 360,
    height: 800,
    deviceKind: "phone",
  },
  "phone-classic": {
    label: "Móvil 16:9",
    width: 360,
    height: 640,
    deviceKind: "phone",
  },
  foldable: {
    label: "Plegable 4:3",
    width: 640,
    height: 854,
    deviceKind: "tablet",
  },
  tv: { label: "TV 16:9", width: 1280, height: 720, deviceKind: "desktop" },
  laptop: {
    label: "Laptop 16:10",
    width: 1280,
    height: 800,
    deviceKind: "desktop",
  },
};
const KEYBOARD_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const GAMEPAD_TOP_KEYS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "*",
  "#",
];
const PROFILE_KEY = "milukita-touch-remote-profiles";
const SCENE_KEY = "milukita-touch-remote-scenes";
const THEME_KEY = "milukita-touch-remote-theme";
const TOOLBAR_ORDER_KEY = "milukita-touch-remote-toolbar-order";
const TOUCH_SENSITIVITY_KEY = "milukita-touch-remote-sensitivity";
const DEFAULT_TOOLBAR_ORDER: ToolbarIconId[] = [
  "back",
  "home",
  "exit",
  "rewind",
];
const CHROME_POSITIONS: Array<{ value: ControlPosition; label: string }> = [
  { value: "top-left", label: "Superior izquierda" },
  { value: "top-right", label: "Superior derecha" },
  { value: "bottom-left", label: "Inferior izquierda" },
  { value: "bottom-right", label: "Inferior derecha" },
];
const POSITION_CLASS: Record<ControlPosition, string> = {
  "top-left": "left-3 top-3",
  "top-right": "right-3 top-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
};
function loadToolbarOrder(): ToolbarIconId[] {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(TOOLBAR_ORDER_KEY) ?? "null"
    );
    return Array.isArray(parsed) &&
      parsed.length === DEFAULT_TOOLBAR_ORDER.length &&
      parsed.every(item => DEFAULT_TOOLBAR_ORDER.includes(item))
      ? (Array.from(new Set(parsed)) as ToolbarIconId[])
      : DEFAULT_TOOLBAR_ORDER;
  } catch {
    return DEFAULT_TOOLBAR_ORDER;
  }
}
const DEFAULT_CHROME: ControllerChrome = {
  modePosition: "top-left",
  modeColor: "#c5ff38",
  lockPosition: "top-right",
  lockColor: "#ff3cac",
  returnPosition: "bottom-left",
  returnColor: "#27f5d0",
  connectionPosition: "bottom-right",
  connectionColor: "#27f5d0",
};
const MODE_CONFIG = [
  {
    id: "remote",
    label: "Game Pad",
    icon: Wifi,
    detail: "Navega menús y confirma acciones.",
  },
  {
    id: "trackpad",
    label: "Track Pad",
    icon: MousePointer2,
    detail: "Desliza y toca sobre una superficie continua.",
  },
  {
    id: "keyboard",
    label: "Teclado",
    icon: Keyboard,
    detail: "Escribe búsquedas, códigos y mensajes.",
  },
  {
    id: "ar",
    label: "AR Stage",
    icon: Sparkles,
    detail: "Controla una escena Lukita con una superficie trackpad continua.",
  },
  {
    id: "universal",
    label: "Universal Control",
    icon: Smartphone,
    detail: "Control contextual que adapta TV, presentación y escenas.",
  },
] as const;

function randomColor(): NeonColor {
  return NEON_PALETTE[Math.floor(Math.random() * NEON_PALETTE.length)];
}
function loadProfiles(): Profile[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(item => {
      const legacy = item as Omit<Profile, "mode" | "icon"> & {
        mode?: string;
        icon?: string;
      };
      return {
        ...legacy,
        mode: legacy.mode === "gamepad" ? "remote" : legacy.mode,
        icon: legacy.icon === "gamepad" ? "sparkles" : legacy.icon,
      } as Profile;
    });
  } catch {
    return [];
  }
}
function loadFavoriteScenes(): FavoriteScene[] {
  try {
    const value = JSON.parse(localStorage.getItem(SCENE_KEY) ?? "[]");
    return Array.isArray(value) ? (value as FavoriteScene[]).slice(0, 8) : [];
  } catch {
    return [];
  }
}
function loadTheme(): ThemeMode {
  return localStorage.getItem(THEME_KEY) === "midnight" ? "midnight" : "dark";
}
function loadTouchSensitivity() {
  try {
    const value = Number(localStorage.getItem(TOUCH_SENSITIVITY_KEY));
    return Number.isFinite(value) ? Math.max(1, Math.min(10, value)) : 7;
  } catch {
    return 7;
  }
}
function loadTraceColor() {
  try {
    const value = localStorage.getItem("milukita-touch-remote-trace-color");
    return value && /^#[0-9a-f]{6}$/i.test(value) ? value : "#27f5d0";
  } catch {
    return "#27f5d0";
  }
}
function loadVolumeColor(): string {
  try {
    const value = localStorage.getItem("milukita-touch-remote-volume-color");
    return value && /^#[0-9a-f]{6}$/i.test(value) ? value : "#27f5d0";
  } catch {
    return "#27f5d0";
  }
}
function loadVolumeHideDelay(): number {
  try {
    const value = Number(
      localStorage.getItem("milukita-touch-remote-volume-hide-delay")
    );
    return Number.isFinite(value) ? Math.max(2, Math.min(12, value)) : 4;
  } catch {
    return 4;
  }
}
function loadSoundEffect(): SoundEffect {
  try {
    const value = localStorage.getItem("milukita-touch-remote-sound-effect");
    return value === "spark" || value === "chime" ? value : "soft";
  } catch {
    return "soft";
  }
}
function loadHapticIntensity(): HapticIntensity {
  try {
    const value = localStorage.getItem(
      "milukita-touch-remote-haptic-intensity"
    );
    return value === "soft" || value === "strong" ? value : "medium";
  } catch {
    return "medium";
  }
}
function loadPointerColor() {
  try {
    const value = localStorage.getItem("milukita-touch-remote-pointer-color");
    return value && /^#[0-9a-f]{6}$/i.test(value) ? value : "#facc15";
  } catch {
    return "#facc15";
  }
}
function loadPointerSize(): PointerStarSize {
  try {
    const value = localStorage.getItem("milukita-touch-remote-pointer-size");
    return value === "small" || value === "large" ? value : "medium";
  } catch {
    return "medium";
  }
}
function loadTrailEnabled() {
  try {
    return (
      localStorage.getItem("milukita-touch-remote-trail-enabled") !== "false"
    );
  } catch {
    return true;
  }
}
function loadTrailDuration() {
  try {
    const value = Number(
      localStorage.getItem("milukita-touch-remote-trail-duration")
    );
    return Number.isFinite(value) ? Math.max(180, Math.min(1400, value)) : 420;
  } catch {
    return 420;
  }
}
function loadTraceWidth() {
  try {
    const value = Number(
      localStorage.getItem("milukita-touch-remote-trace-width")
    );
    return Number.isFinite(value) ? Math.max(1, Math.min(8, value)) : 3;
  } catch {
    return 3;
  }
}
function readDeviceViewport() {
  const width = typeof window === "undefined" ? 390 : window.innerWidth;
  const height = typeof window === "undefined" ? 844 : window.innerHeight;
  const longest = Math.max(width, height);
  const shortest = Math.min(width, height);
  const deviceKind: DeviceKind =
    shortest < 600 ? "phone" : shortest < 900 ? "tablet" : "desktop";
  return {
    width,
    height,
    ratio: Math.round((longest / shortest) * 10) / 10,
    deviceKind,
  };
}
function suggestedProfileMeta(deviceKind: DeviceKind, mode: ControllerMode) {
  const deviceName =
    deviceKind === "phone"
      ? "Móvil"
      : deviceKind === "tablet"
        ? "Tablet"
        : "Escritorio";
  const icon: ProfileIcon =
    mode === "keyboard"
      ? "keyboard"
      : mode === "trackpad"
        ? "pointer"
        : "sparkles";
  return { deviceName, icon };
}
function interpolateHex(from: string, to: string, ratio: number) {
  const amount = Math.max(0, Math.min(1, ratio));
  const left = from
    .slice(1)
    .match(/.{2}/g)
    ?.map(value => Number.parseInt(value, 16)) ?? [0, 0, 0];
  const right = to
    .slice(1)
    .match(/.{2}/g)
    ?.map(value => Number.parseInt(value, 16)) ?? [0, 0, 0];
  return `#${left
    .map((value, index) =>
      Math.round(value + (right[index] - value) * amount)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}
function latencyGradientColor(latencyMs: number) {
  const normalized = Math.max(0, Math.min(1, (latencyMs - 40) / 460));
  return normalized <= 0.5
    ? interpolateHex("#6ee7b7", "#fbbf24", normalized * 2)
    : interpolateHex("#fbbf24", "#fb7185", (normalized - 0.5) * 2);
}
function sanitizeDevicePreset(raw: unknown, index: number): Profile | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const hex = (candidate: unknown) =>
    typeof candidate === "string" && /^#[0-9A-Fa-f]{6}$/.test(candidate);
  const position = (candidate: unknown): candidate is ControlPosition =>
    candidate === "top-left" ||
    candidate === "top-right" ||
    candidate === "bottom-left" ||
    candidate === "bottom-right";
  const chrome = value.chrome as Record<string, unknown> | undefined;
  const normalizedMode = value.mode === "gamepad" ? "remote" : value.mode;
  if (
    typeof value.name !== "string" ||
    !hex(value.color) ||
    (value.layout !== "compact" && value.layout !== "spacious") ||
    typeof value.vibration !== "boolean" ||
    (normalizedMode !== "remote" &&
      normalizedMode !== "trackpad" &&
      normalizedMode !== "keyboard") ||
    (value.orientation !== "horizontal" &&
      value.orientation !== "vertical" &&
      value.orientation !== "auto") ||
    !Number.isInteger(value.trackpadPercent) ||
    Number(value.trackpadPercent) < 20 ||
    Number(value.trackpadPercent) > 45 ||
    !chrome ||
    !position(chrome.modePosition) ||
    !position(chrome.lockPosition) ||
    !position(chrome.returnPosition) ||
    !position(chrome.connectionPosition) ||
    !hex(chrome.modeColor) ||
    !hex(chrome.lockColor) ||
    !hex(chrome.returnColor) ||
    !hex(chrome.connectionColor)
  )
    return null;
  const icon: ProfileIcon =
    value.icon === "pointer" || value.icon === "keyboard"
      ? value.icon
      : "sparkles";
  const deviceKind: DeviceKind =
    value.deviceKind === "tablet" || value.deviceKind === "desktop"
      ? value.deviceKind
      : "phone";
  const tags = Array.isArray(value.tags)
    ? Array.from(
        new Set(
          value.tags
            .filter((tag): tag is string => typeof tag === "string")
            .map(tag => tag.trim().toLocaleLowerCase().slice(0, 20))
            .filter(Boolean)
        )
      ).slice(0, 8)
    : [];
  return {
    name: value.name.trim().slice(0, 30) || "Preset importado",
    color: value.color as string,
    layout: value.layout as Profile["layout"],
    vibration: value.vibration as boolean,
    sound: typeof value.sound === "boolean" ? value.sound : true,
    mode: normalizedMode as ControllerMode,
    chrome: chrome as unknown as ControllerChrome,
    orientation: value.orientation as OrientationMode,
    trackpadPercent: Number(value.trackpadPercent),
    sensitivity: Number.isFinite(Number(value.sensitivity))
      ? Math.max(1, Math.min(10, Number(value.sensitivity)))
      : 7,
    traceColor:
      typeof value.traceColor === "string" &&
      /^#[0-9a-f]{6}$/i.test(value.traceColor)
        ? value.traceColor
        : "#27f5d0",
    traceWidth: Number.isFinite(Number(value.traceWidth))
      ? Math.max(1, Math.min(8, Number(value.traceWidth)))
      : 3,
    hapticIntensity:
      value.hapticIntensity === "soft" || value.hapticIntensity === "strong"
        ? value.hapticIntensity
        : "medium",
    pointerColor:
      typeof value.pointerColor === "string" &&
      /^#[0-9a-f]{6}$/i.test(value.pointerColor)
        ? value.pointerColor
        : "#facc15",
    pointerSize:
      value.pointerSize === "small" || value.pointerSize === "large"
        ? value.pointerSize
        : "medium",
    trailEnabled: value.trailEnabled !== false,
    trailDuration: Number.isFinite(Number(value.trailDuration))
      ? Math.max(180, Math.min(1400, Number(value.trailDuration)))
      : 420,
    volumeColor:
      typeof value.volumeColor === "string" &&
      /^#[0-9a-f]{6}$/i.test(value.volumeColor)
        ? value.volumeColor
        : "#27f5d0",
    muted: value.muted === true,
    volumeHideDelay: Number.isFinite(Number(value.volumeHideDelay))
      ? Math.max(2, Math.min(12, Number(value.volumeHideDelay)))
      : 4,
    icon,
    source: "imported",
    deviceKind,
    tags,
    updatedAt: Date.now() + index,
  };
}
function suggestedPreviewPresetId(
  viewport: ReturnType<typeof readDeviceViewport>
): PreviewPresetId {
  const portrait = viewport.height >= viewport.width;
  const candidates = (
    Object.entries(PREVIEW_PRESETS) as Array<
      [PreviewPresetId, (typeof PREVIEW_PRESETS)[PreviewPresetId]]
    >
  ).filter(
    ([id, preset]) =>
      id !== "native" && preset.height >= preset.width === portrait
  );
  const target = viewport.width / viewport.height;
  return candidates.reduce((best, candidate) =>
    Math.abs(candidate[1].width / candidate[1].height - target) <
    Math.abs(best[1].width / best[1].height - target)
      ? candidate
      : best
  )[0];
}
function apiMode(
  mode: ControllerMode
): "REMOTE" | "GAMEPAD" | "TRACKPAD" | "KEYBOARD" {
  return mode === "remote"
    ? "REMOTE"
    : mode === "keyboard"
      ? "KEYBOARD"
      : "TRACKPAD";
}
function apiCommand(
  action: GestureAction
):
  | "NAVIGATE"
  | "SELECT"
  | "BACK"
  | "HOME"
  | "EXIT"
  | "TEXT"
  | "PLAYBACK"
  | "QR_VISIBILITY" {
  return action === "back"
    ? "BACK"
    : action === "home"
      ? "HOME"
      : action === "exit"
        ? "EXIT"
        : action === "text"
          ? "TEXT"
          : action === "playback"
            ? "PLAYBACK"
            : action === "qr"
              ? "QR_VISIBILITY"
              : action === "select" || action === "tap"
                ? "SELECT"
                : "NAVIGATE";
}

export default function TouchRemotePage() {
  const auth = useAuth();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const urlSession = params.get("controllerSession");
  const urlToken = params.get("controllerToken");
  const isPreviewFrame = params.get("preview") === "1";
  const isFocusedExperience = params.get("focus") === "controller" || params.get("focused") === "1";
  const requestedMode = params.get("mode");
  const initialControllerMode: ControllerMode = requestedMode === "trackpad" || requestedMode === "keyboard" || requestedMode === "ar" || requestedMode === "universal" ? requestedMode : "remote";
  const [color, setColor] = useState<NeonColor>(() => randomColor());
  const [palettePulse, setPalettePulse] = useState(false);
  const [neonIntensity, setNeonIntensity] = useState(() => {
    const saved = Number(
      window.localStorage.getItem("milukita-touch-remote-neon-intensity")
    );
    return Number.isFinite(saved) ? Math.min(1.4, Math.max(0.55, saved)) : 1;
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(loadTheme);
  const [favoriteScenes, setFavoriteScenes] =
    useState<FavoriteScene[]>(loadFavoriteScenes);
  const [sceneName, setSceneName] = useState("Escena favorita");
  const [feedbackAction, setFeedbackAction] = useState<GestureAction | null>(
    null
  );
  const feedbackTimerRef = useRef<number | null>(null);
  const [layout, setLayout] = useState<Profile["layout"]>("spacious");
  const [orientation, setOrientation] = useState<OrientationMode>("horizontal");
  const [trackpadPercent, setTrackpadPercent] = useState(34);
  const [touchSensitivity, setTouchSensitivity] =
    useState(loadTouchSensitivity);
  const [traceColor, setTraceColor] = useState(loadTraceColor);
  const [traceWidth, setTraceWidth] = useState(loadTraceWidth);
  const [vibration, setVibration] = useState(true);
  const [hapticIntensity, setHapticIntensity] =
    useState<HapticIntensity>(loadHapticIntensity);
  const [pointerColor, setPointerColor] = useState(loadPointerColor);
  const [pointerSize, setPointerSize] =
    useState<PointerStarSize>(loadPointerSize);
  const [trailEnabled, setTrailEnabled] = useState(loadTrailEnabled);
  const [trailDuration, setTrailDuration] = useState(loadTrailDuration);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundEffect, setSoundEffect] = useState<SoundEffect>(loadSoundEffect);
  const [volumeColor, setVolumeColor] = useState(loadVolumeColor);
  const [volumeMuted, setVolumeMuted] = useState(() => {
    try {
      return localStorage.getItem("milukita-touch-remote-muted") === "true";
    } catch {
      return false;
    }
  });
  const [volumeHideDelay, setVolumeHideDelay] = useState(loadVolumeHideDelay);
  const [volume, setVolume] = useState(() => {
    try {
      const value = Number(
        localStorage.getItem("milukita-touch-remote-volume")
      );
      return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 50;
    } catch {
      return 50;
    }
  });
  const [toolbarOrder, setToolbarOrder] =
    useState<ToolbarIconId[]>(loadToolbarOrder);
  const [label, setLabel] = useState("MiLukita Controller Lab");
  const [profileName, setProfileName] = useState("Mi control neón");
  const [profileIcon, setProfileIcon] = useState<ProfileIcon>("sparkles");
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [presetDeviceKind, setPresetDeviceKind] = useState<DeviceKind>("phone");
  const [showProportionPreview, setShowProportionPreview] = useState(false);
  const [previewPreset, setPreviewPreset] =
    useState<PreviewPresetId>("phone-tall");
  const [presetTransferStatus, setPresetTransferStatus] = useState("");
  const presetImportRef = useRef<HTMLInputElement | null>(null);
  const [profileSearch, setProfileSearch] = useState("");
  const [profileFilter, setProfileFilter] = useState<
    "all" | "local" | "imported"
  >("all");
  const [profileTagFilter, setProfileTagFilter] = useState("all");
  const [selectedProfileIds, setSelectedProfileIds] = useState<number[]>([]);
  const [tagDraftByProfile, setTagDraftByProfile] = useState<
    Record<number, string>
  >({});
  const [pendingPresetImport, setPendingPresetImport] = useState<
    Profile[] | null
  >(null);
  const [pendingPresetFileName, setPendingPresetFileName] = useState("");
  const [isDraggingPreset, setIsDraggingPreset] = useState(false);
  const [mode, setMode] = useState<ControllerMode>(initialControllerMode);
  const [chrome, setChrome] = useState<ControllerChrome>(DEFAULT_CHROME);
  const [locked, setLocked] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQrGuide, setShowQrGuide] = useState(false);
  const [testQrType, setTestQrType] = useState<"experience" | "point">("experience");
  const [testQrLabel, setTestQrLabel] = useState("Lukita Live · Prueba física");
  const [testQrExpiryMinutes, setTestQrExpiryMinutes] = useState(10);
  const [testQrDataUrl, setTestQrDataUrl] = useState<string | null>(null);
  const [testQrStatus, setTestQrStatus] = useState("");
  const [pointName, setPointName] = useState("Lukita Point · Demo");
  const [pointPrivacy, setPointPrivacy] = useState<"PRIVATE" | "UNLISTED" | "PUBLIC">("PRIVATE");
  const [pointVisibility, setPointVisibility] = useState<"DRAFT" | "REVIEW">("DRAFT");
  const [pointConsent, setPointConsent] = useState(false);
  const [pointStatus, setPointStatus] = useState("");
  const [foundationView, setFoundationView] = useState<"front" | "three-quarter" | "side">("front");
  const [foundationAnchors, setFoundationAnchors] = useState<Record<string, boolean>>({
    face: false,
    hair: false,
    star: false,
    silhouette: false,
    palette: false,
  });
  const [showOnboarding, setShowOnboarding] = useState(
    () =>
      !isPreviewFrame &&
      !isFocusedExperience &&
      localStorage.getItem("milukita-controller-onboarding") !== "seen"
  );
  const [deviceViewport, setDeviceViewport] = useState(readDeviceViewport);
  const [connectionAlert, setConnectionAlert] = useState<string | null>(null);
  const [autoVertical, setAutoVertical] = useState(
    () =>
      typeof window !== "undefined" && window.innerHeight > window.innerWidth
  );
  const [lastAction, setLastAction] = useState<GestureAction | null>(null);
  const [keyboardText, setKeyboardText] = useState("");
  const [copied, setCopied] = useState(false);
  const [createdSession, setCreatedSession] = useState<{
    publicId: string;
    mobileToken: string;
    mobileUrl: string;
    screenUrl: string;
    qrDataUrl: string;
    expiresAt: string;
    status: string;
    manualCode?: string;
  } | null>(null);
  const [connected, setConnected] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRole, setAssignRole] = useState<
    "USER" | "PRESENTER" | "OPERATOR"
  >("PRESENTER");
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [shareQrDataUrl, setShareQrDataUrl] = useState<string | null>(null);
  const shareLink =
    shareCode && typeof window !== "undefined"
      ? `${window.location.origin}/touch-remote?profile=${encodeURIComponent(shareCode)}`
      : null;
  const [importCode, setImportCode] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const [socketStatus, setSocketStatus] = useState<
    "connecting" | "connected" | "fallback" | "offline"
  >("offline");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [latencyHistory, setLatencyHistory] = useState<
    Array<{ value: number; at: number }>
  >([]);
  const [manualLinkCode, setManualLinkCode] = useState("");
  const [reconnectSeconds, setReconnectSeconds] = useState<number | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const roleQuery = trpc.controller.myRole.useQuery(undefined, {
    enabled: auth.isAuthenticated,
    retry: false,
  });
  const createSession = trpc.controller.createSession.useMutation();
  const connectSession = trpc.controller.connect.useMutation();
  const connectWithManualCode =
    trpc.controller.connectWithManualCode.useMutation();
  const sendCommand = trpc.controller.sendCommand.useMutation();
  const closeSession = trpc.controller.closeSession.useMutation();
  const assignRoleMutation = trpc.controller.assignRole.useMutation();
  const shareProfileMutation = trpc.controller.shareProfile.useMutation();
  const importProfileMutation = trpc.controller.importProfile.useMutation();
  const activeSession = createdSession?.publicId ?? urlSession;
  const activeToken = createdSession?.mobileToken ?? urlToken;
  const role = roleQuery.data ?? "USER";
  const activeMode =
    MODE_CONFIG.find(item => item.id === mode) ?? MODE_CONFIG[0];
  const glow = {
    borderColor: `${color.hex}99`,
    boxShadow: `0 0 32px ${color.hex}25, inset 0 0 32px ${color.hex}10`,
  };
  const profileSnapshot = {
    name: profileName.trim() || "Perfil neón",
    color: color.hex,
    layout,
    vibration,
    sound: soundEnabled,
    soundEffect,
    mode,
    chrome,
    orientation,
    trackpadPercent,
    sensitivity: touchSensitivity,
    traceColor,
    traceWidth,
    hapticIntensity,
    pointerColor,
    pointerSize,
    trailEnabled,
    trailDuration,
    volumeColor,
    muted: volumeMuted,
    volumeHideDelay,
    icon: profileIcon,
    source: "local" as const,
    deviceKind: presetDeviceKind,
    favorite: false,
    tags: [],
    updatedAt: Date.now(),
  };
  // La maqueta maestra conserva 8 × 18 cm (4:9); solo rota con el viewport.
  const displayVertical = mode === "remote" ? false : autoVertical;
  useEffect(() => {
    localStorage.setItem(TOUCH_SENSITIVITY_KEY, String(touchSensitivity));
  }, [touchSensitivity]);
  useEffect(() => {
    if (!shareLink) {
      setShareQrDataUrl(null);
      return;
    }
    void QRCode.toDataURL(shareLink, {
      width: 220,
      margin: 1,
      color: { dark: "#073b2a", light: "#f4fff9" },
    })
      .then(setShareQrDataUrl)
      .catch(() => setShareQrDataUrl(null));
  }, [shareLink]);
  useEffect(() => {
    localStorage.setItem(
      "milukita-touch-remote-haptic-intensity",
      hapticIntensity
    );
    localStorage.setItem("milukita-touch-remote-sound-effect", soundEffect);
    localStorage.setItem("milukita-touch-remote-volume", String(volume));
    localStorage.setItem("milukita-touch-remote-volume-color", volumeColor);
    localStorage.setItem("milukita-touch-remote-muted", String(volumeMuted));
    localStorage.setItem(
      "milukita-touch-remote-volume-hide-delay",
      String(volumeHideDelay)
    );
    localStorage.setItem("milukita-touch-remote-pointer-color", pointerColor);
    localStorage.setItem("milukita-touch-remote-pointer-size", pointerSize);
    localStorage.setItem(
      "milukita-touch-remote-trail-enabled",
      String(trailEnabled)
    );
    localStorage.setItem(
      "milukita-touch-remote-trail-duration",
      String(trailDuration)
    );
  }, [
    hapticIntensity,
    pointerColor,
    pointerSize,
    trailEnabled,
    trailDuration,
    soundEffect,
    volume,
    volumeColor,
    volumeMuted,
    volumeHideDelay,
  ]);
  useEffect(() => {
    localStorage.setItem("milukita-touch-remote-trace-color", traceColor);
    localStorage.setItem(
      "milukita-touch-remote-trace-width",
      String(traceWidth)
    );
  }, [traceColor, traceWidth]);
  const profileSuggestion = suggestedProfileMeta(
    deviceViewport.deviceKind,
    mode
  );
  const connectionQuality = !connected
    ? { label: "Sin sesión", level: 0, color: "#64748b" }
    : socketStatus !== "connected"
      ? { label: "Respaldo", level: 1, color: "#fbbf24" }
      : latencyMs === null
        ? { label: "Midiendo", level: 1, color: "#67e8f9" }
        : latencyMs <= 80
          ? {
              label: "Excelente",
              level: 4,
              color: latencyGradientColor(latencyMs),
            }
          : latencyMs <= 160
            ? {
                label: "Buena",
                level: 3,
                color: latencyGradientColor(latencyMs),
              }
            : latencyMs <= 300
              ? {
                  label: "Variable",
                  level: 2,
                  color: latencyGradientColor(latencyMs),
                }
              : {
                  label: "Alta",
                  level: 1,
                  color: latencyGradientColor(latencyMs),
                };
  const activePreview =
    previewPreset === "native"
      ? { ...deviceViewport, label: "Este dispositivo" }
      : PREVIEW_PRESETS[previewPreset];
  const recommendedPreviewPreset = suggestedPreviewPresetId(deviceViewport);
  const allProfileTags = Array.from(
    new Set(profiles.flatMap(profile => profile.tags ?? []))
  ).sort((left, right) => left.localeCompare(right));
  const visibleProfiles = profiles
    .filter(
      profile =>
        (profileFilter === "all" || profile.source === profileFilter) &&
        (profileTagFilter === "all" ||
          (profile.tags ?? []).includes(profileTagFilter)) &&
        `${profile.name} ${profile.mode ?? ""} ${profile.deviceKind ?? ""} ${(profile.tags ?? []).join(" ")}`
          .toLocaleLowerCase()
          .includes(profileSearch.trim().toLocaleLowerCase())
    )
    .sort(
      (left, right) =>
        Number(Boolean(right.favorite)) - Number(Boolean(left.favorite))
    );

  useEffect(() => {
    const syncOrientation = () => {
      setAutoVertical(window.innerHeight > window.innerWidth);
      setDeviceViewport(readDeviceViewport());
    };
    syncOrientation();
    window.addEventListener("resize", syncOrientation);
    window.screen.orientation?.addEventListener?.("change", syncOrientation);
    return () => {
      window.removeEventListener("resize", syncOrientation);
      window.screen.orientation?.removeEventListener?.(
        "change",
        syncOrientation
      );
    };
  }, []);

  useEffect(() => {
    if (!connected) {
      setConnectionAlert(null);
      return;
    }
    if (socketStatus !== "connected")
      setConnectionAlert(
        "Conexión en respaldo: la pantalla consulta los comandos persistidos."
      );
    else if (latencyMs !== null && latencyMs > 300)
      setConnectionAlert(`Conexión deficiente: ${latencyMs} ms de latencia.`);
    else if (latencyMs !== null && latencyMs > 160)
      setConnectionAlert(`Conexión inestable: ${latencyMs} ms de latencia.`);
    else setConnectionAlert(null);
  }, [connected, socketStatus, latencyMs]);

  useEffect(() => {
    if (socketStatus !== "connected" || latencyMs === null) return;
    setLatencyHistory(history => [
      ...history.slice(-119),
      { value: latencyMs, at: Date.now() },
    ]);
  }, [latencyMs, socketStatus]);

  useEffect(() => {
    if (!activeSession || !activeToken || !connected) {
      socketRef.current?.close();
      socketRef.current = null;
      setSocketStatus("offline");
      setLatencyMs(null);
      return;
    }
    let cancelled = false;
    let retry: number | undefined;
    let ping: number | undefined;
    let countdown: number | undefined;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const endpoint = `${protocol}//${window.location.host}/controller-realtime`;
    const scheduleReconnect = () => {
      if (retry || cancelled) return;
      let remaining = 3;
      setSocketStatus("fallback");
      setReconnectSeconds(remaining);
      countdown = window.setInterval(() => {
        remaining -= 1;
        setReconnectSeconds(Math.max(0, remaining));
      }, 1000);
      retry = window.setTimeout(() => {
        if (countdown) window.clearInterval(countdown);
        setReconnectSeconds(null);
        retry = undefined;
        connectSocket();
      }, 3000);
    };
    const connectSocket = () => {
      if (cancelled) return;
      setSocketStatus("connecting");
      const socket = new WebSocket(endpoint);
      socketRef.current = socket;
      socket.onopen = () =>
        socket.send(
          JSON.stringify({
            type: "CONTROLLER_AUTH",
            publicId: activeSession,
            token: activeToken,
            channel: "mobile",
          })
        );
      socket.onmessage = event => {
        try {
          const message = JSON.parse(event.data) as {
            type?: string;
            payload?: { sentAt?: number };
          };
          if (message.type === "CONTROLLER_READY") {
            setSocketStatus("connected");
            setReconnectSeconds(null);
            ping = window.setInterval(
              () =>
                socket.readyState === WebSocket.OPEN &&
                socket.send(
                  JSON.stringify({
                    type: "CONTROLLER_PING",
                    sentAt: Date.now(),
                  })
                ),
              3000
            );
          } else if (
            message.type === "CONTROLLER_PONG" &&
            message.payload?.sentAt
          )
            setLatencyMs(Math.max(0, Date.now() - message.payload.sentAt));
          else if (message.type === "CONTROLLER_ERROR") socket.close();
        } catch {
          socket.close();
        }
      };
      socket.onerror = () => socket.close();
      socket.onclose = () => {
        if (ping) window.clearInterval(ping);
        if (!cancelled) scheduleReconnect();
      };
    };
    connectSocket();
    return () => {
      cancelled = true;
      if (retry) window.clearTimeout(retry);
      if (ping) window.clearInterval(ping);
      if (countdown) window.clearInterval(countdown);
      setReconnectSeconds(null);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [activeSession, activeToken, connected, reconnectAttempt]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(TOOLBAR_ORDER_KEY, JSON.stringify(toolbarOrder));
  }, [toolbarOrder]);

  useEffect(() => {
    localStorage.setItem(SCENE_KEY, JSON.stringify(favoriteScenes));
  }, [favoriteScenes]);

  function triggerFeedback(action: GestureAction) {
    setFeedbackAction(action);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(
      () => setFeedbackAction(null),
      180
    );
  }

  function applyNeonColor(nextColor: NeonColor) {
    setColor(nextColor);
    setPalettePulse(true);
    window.setTimeout(() => setPalettePulse(false), 220);
  }

  function randomizeColor() {
    setColor(current => {
      const choices = NEON_PALETTE.filter(item => item.hex !== current.hex);
      return choices[Math.floor(Math.random() * choices.length)];
    });
    setPalettePulse(true);
    window.setTimeout(() => setPalettePulse(false), 220);
  }

  function changeNeonIntensity(value: number) {
    const next = Math.min(1.4, Math.max(0.55, value));
    setNeonIntensity(next);
    window.localStorage.setItem(
      "milukita-touch-remote-neon-intensity",
      String(next)
    );
  }
  function playFeedback(action: GestureAction) {
    if (!soundEnabled || typeof AudioContext === "undefined") return;
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type =
        soundEffect === "spark"
          ? "triangle"
          : soundEffect === "chime"
            ? "sine"
            : "sine";
      oscillator.frequency.value =
        soundEffect === "spark"
          ? 820
          : soundEffect === "chime"
            ? 560
            : action === "select" || action === "tap"
              ? 660
              : action === "back" || action === "exit"
                ? 260
                : 420;
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.065);
    } catch {
      /* el feedback visual y háptico se mantiene cuando el navegador bloquea audio */
    }
  }
  function touchpadHaptic(kind: "double-tap" | "swipe") {
    if (
      !vibration ||
      typeof navigator === "undefined" ||
      !("vibrate" in navigator)
    )
      return;
    const scale =
      hapticIntensity === "soft" ? 0.6 : hapticIntensity === "strong" ? 1.7 : 1;
    const pulse = Math.max(
      6,
      Math.round((kind === "double-tap" ? 18 : 12) * scale)
    );
    navigator.vibrate?.(
      kind === "double-tap"
        ? [Math.round(10 * scale), pulse, Math.round(10 * scale)]
        : pulse
    );
  }
  function send(action: GestureAction, payload: Record<string, string> = {}) {
    if (locked) return;
    if (action === "volume-down" || action === "volume-up")
      setVolume(current =>
        Math.max(0, Math.min(100, current + (action === "volume-up" ? 5 : -5)))
      );
    setLastAction(action);
    triggerFeedback(action);
    playFeedback(action);
    if (
      vibration &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      const scale =
        hapticIntensity === "soft"
          ? 0.6
          : hapticIntensity === "strong"
            ? 1.7
            : 1;
      navigator.vibrate?.(
        action === "tap" || action === "select"
          ? [
              Math.round(12 * scale),
              Math.round(18 * scale),
              Math.round(12 * scale),
            ]
          : Math.round(16 * scale)
      );
    }
    if (!activeSession || !activeToken || !connected) return;
    const command = {
      type: "CONTROLLER_COMMAND",
      publicId: activeSession,
      requestId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      mode: apiMode(mode),
      commandType: apiCommand(action),
      payload: { action, ...payload },
    };
    if (
      socketRef.current?.readyState === WebSocket.OPEN &&
      socketStatus === "connected"
    )
      socketRef.current.send(JSON.stringify(command));
    else
      void sendCommand.mutateAsync({
        publicId: activeSession,
        mobileToken: activeToken,
        requestId: command.requestId,
        mode: command.mode,
        commandType: command.commandType,
        payload: command.payload,
      });
  }
  function saveFavoriteScene() {
    const nextScene: FavoriteScene = {
      id: Date.now(),
      name: sceneName.trim().slice(0, 28) || "Escena favorita",
      mode,
      color: color.hex,
      layout,
      orientation,
      trackpadPercent,
      createdAt: Date.now(),
    };
    setFavoriteScenes(current => [nextScene, ...current].slice(0, 8));
    setSceneName("");
    toast.success("Escena guardada localmente");
  }
  function applyFavoriteScene(scene: FavoriteScene) {
    setControllerMode(scene.mode);
    setColor(
      NEON_PALETTE.find(item => item.hex === scene.color) ?? {
        name: "Color personalizado",
        hex: scene.color,
      }
    );
    setLayout(scene.layout);
    setOrientation(scene.mode === "remote" ? "horizontal" : scene.orientation);
    setTrackpadPercent(scene.trackpadPercent);
    toast.success(`Escena aplicada: ${scene.name}`);
  }
  function removeFavoriteScene(id: number) {
    setFavoriteScenes(current => current.filter(scene => scene.id !== id));
  }
  function setControllerMode(nextMode: ControllerMode) {
    setMode(nextMode);
    if (nextMode === "remote") setOrientation("horizontal");
    if (nextMode === "ar") setOrientation("auto");
  }
  function changeControllerModeFromToolbar(nextMode: ControllerMode) {
    setControllerMode(nextMode);
    triggerFeedback("select");
    playFeedback("select");
    if (vibration && typeof navigator !== "undefined" && "vibrate" in navigator)
      navigator.vibrate?.(18);
  }
  function saveProfile() {
    const next = [
      profileSnapshot,
      ...profiles.filter(item => item.name !== profileName.trim()),
    ].slice(0, 6);
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }
  function applyProfile(profile: Profile) {
    setColor(
      NEON_PALETTE.find(item => item.hex === profile.color) ?? {
        name: "Color personalizado",
        hex: profile.color,
      }
    );
    setLayout(profile.layout);
    setVibration(profile.vibration);
    setSoundEnabled(profile.sound ?? true);
    setSoundEffect(profile.soundEffect ?? "soft");
    setVolumeColor(profile.volumeColor ?? "#27f5d0");
    setVolumeMuted(profile.muted ?? false);
    setVolumeHideDelay(profile.volumeHideDelay ?? 4);
    setControllerMode(profile.mode ?? "remote");
    setChrome(profile.chrome ?? DEFAULT_CHROME);
    setOrientation(
      profile.mode === "remote"
        ? "horizontal"
        : (profile.orientation ?? "horizontal")
    );
    setTrackpadPercent(profile.trackpadPercent ?? 34);
    setTouchSensitivity(profile.sensitivity ?? 7);
    setTraceColor(profile.traceColor ?? "#27f5d0");
    setTraceWidth(profile.traceWidth ?? 3);
    setHapticIntensity(profile.hapticIntensity ?? "medium");
    setPointerColor(profile.pointerColor ?? "#facc15");
    setPointerSize(profile.pointerSize ?? "medium");
    setTrailEnabled(profile.trailEnabled !== false);
    setTrailDuration(profile.trailDuration ?? 420);
    setProfileName(profile.name);
    setProfileIcon(profile.icon ?? "sparkles");
    setPresetDeviceKind(profile.deviceKind ?? deviceViewport.deviceKind);
  }
  async function generateDynamicTestQr() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const expiresAt = Date.now() + testQrExpiryMinutes * 60_000;
    const token = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const path = testQrType === "point" ? "/lukita-ar-stage" : "/lukita-ar-stage";
    const payload = `${origin}${path}?testQr=1&type=${testQrType}&label=${encodeURIComponent(testQrLabel.trim() || "Lukita Live")}&expiresAt=${expiresAt}&nonce=${token}`;
    try {
      const dataUrl = await QRCode.toDataURL(payload, { width: 280, margin: 2, color: { dark: "#06120e", light: "#effff8" } });
      setTestQrDataUrl(dataUrl);
      setTestQrStatus(`QR de prueba generado · expira en ${testQrExpiryMinutes} min · no es Control QR`);
    } catch {
      setTestQrDataUrl(null);
      setTestQrStatus("No se pudo generar el QR de prueba");
    }
  }

  function savePointReview() {
    if (!pointName.trim()) {
      setPointStatus("Escribe un nombre para el LukitaPoint");
      return;
    }
    if (!pointConsent) {
      setPointStatus("Confirma que este punto es privado y está pendiente de aprobación");
      return;
    }
    if (!canSubmitLukitaPointForReview({ name: pointName, privacy: pointPrivacy, status: pointVisibility, consent: pointConsent, assetVersion: "character-foundation-reference" })) {
      setPointStatus("El borrador no cumple las reglas de revisión");
      return;
    }
    setPointVisibility("REVIEW");
    setPointStatus(`Borrador de “${pointName.trim()}” enviado a revisión · privacidad ${pointPrivacy.toLowerCase()}`);
  }

  async function shareCurrentProfile() {
    try {
      const {
        updatedAt: _updatedAt,
        source: _source,
        deviceKind: _deviceKind,
        favorite: _favorite,
        tags: _tags,
        ...safeProfile
      } = profileSnapshot;
      const result = await shareProfileMutation.mutateAsync({
        profile: {
          ...safeProfile,
          mode: safeProfile.mode === "ar" || safeProfile.mode === "universal" ? "trackpad" : safeProfile.mode,
          icon: safeProfile.icon === "ar" ? "pointer" : safeProfile.icon,
        },
      });
      setShareCode(result.shareCode);
    } catch {
      setShareCode(null);
    }
  }
  async function importProfileByCode() {
    try {
      const result = await importProfileMutation.mutateAsync({
        shareCode: importCode.trim().toUpperCase(),
      });
      const imported = {
        ...(result.profile as Profile),
        name: `${profileSuggestion.deviceName} · ${(result.profile as Profile).name || `Importado ${result.shareCode}`}`,
        icon: profileSuggestion.icon,
        source: "imported" as const,
        shareCode: result.shareCode,
        updatedAt: Date.now(),
      };
      const next = [imported, ...profiles].slice(0, 12);
      setProfiles(next);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      applyProfile(imported);
    } catch {
      /* la interfaz conserva el código para que se corrija sin perderlo */
    }
  }
  function applyProfileSuggestion() {
    setProfileName(
      `${profileSuggestion.deviceName} · ${MODE_CONFIG.find(item => item.id === mode)?.label ?? "Control"}`
    );
    setProfileIcon(profileSuggestion.icon);
  }
  function updateProfileMeta(
    profile: Profile,
    name: string,
    icon: ProfileIcon
  ) {
    const next = profiles.map(item =>
      item.updatedAt === profile.updatedAt
        ? { ...item, name: name.trim() || item.name, icon }
        : item
    );
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }
  function removeProfile(profile: Profile) {
    const next = profiles.filter(item => item.updatedAt !== profile.updatedAt);
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }
  function toggleProfileFavorite(profile: Profile) {
    const next = profiles.map(item =>
      item.updatedAt === profile.updatedAt
        ? { ...item, favorite: !item.favorite }
        : item
    );
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }
  function addProfileTag(profile: Profile) {
    const tag = (tagDraftByProfile[profile.updatedAt] ?? "")
      .trim()
      .toLocaleLowerCase()
      .slice(0, 20);
    if (
      !tag ||
      (profile.tags ?? []).includes(tag) ||
      (profile.tags?.length ?? 0) >= 8
    )
      return;
    const next = profiles.map(item =>
      item.updatedAt === profile.updatedAt
        ? { ...item, tags: [...(item.tags ?? []), tag] }
        : item
    );
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setTagDraftByProfile(current => ({ ...current, [profile.updatedAt]: "" }));
  }
  function removeProfileTag(profile: Profile, tag: string) {
    const next = profiles.map(item =>
      item.updatedAt === profile.updatedAt
        ? {
            ...item,
            tags: (item.tags ?? []).filter(itemTag => itemTag !== tag),
          }
        : item
    );
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }
  function exportDevicePresets(profilesToExport = profiles) {
    const presets = profilesToExport.map(
      ({
        name,
        color,
        layout,
        vibration,
        sound,
        mode,
        chrome,
        orientation,
        trackpadPercent,
        icon,
        deviceKind,
        tags,
      }) => ({
        name,
        color,
        layout,
        vibration,
        sound,
        mode,
        chrome,
        orientation,
        trackpadPercent,
        icon,
        deviceKind,
        tags,
      })
    );
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "milukita-controller-presets",
            version: 1,
            exportedAt: new Date().toISOString(),
            presets,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "milukita-controller-presets.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setPresetTransferStatus(
      `${presets.length} preset(s) exportado(s) sin sesión ni tokens.`
    );
  }
  function toggleProfileSelection(profile: Profile) {
    setSelectedProfileIds(current =>
      current.includes(profile.updatedAt)
        ? current.filter(id => id !== profile.updatedAt)
        : [...current, profile.updatedAt]
    );
  }
  async function importDevicePresetFile(
    file?: File,
    source: "picker" | "drop" = "picker"
  ) {
    if (!file) return;
    try {
      if (file.size > 512_000)
        throw new Error("El archivo supera el tamaño permitido.");
      const parsed = JSON.parse(await file.text()) as {
        format?: string;
        version?: number;
        presets?: unknown[];
      };
      if (
        parsed.format !== "milukita-controller-presets" ||
        parsed.version !== 1 ||
        !Array.isArray(parsed.presets)
      )
        throw new Error("El archivo no es un paquete de presets compatible.");
      const imported = parsed.presets
        .map(sanitizeDevicePreset)
        .filter((preset): preset is Profile => preset !== null)
        .slice(0, 12);
      if (!imported.length)
        throw new Error("No se encontraron presets válidos.");
      setPendingPresetImport(imported);
      setPendingPresetFileName(file.name);
      setPresetTransferStatus("");
      if (source === "drop")
        toast.success("Archivo JSON validado", {
          description: "Revisa los presets antes de confirmar la importación.",
        });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo importar el archivo.";
      setPresetTransferStatus(message);
      if (source === "drop")
        toast.error("No se pudo cargar el JSON", { description: message });
    } finally {
      if (presetImportRef.current) presetImportRef.current.value = "";
    }
  }
  function confirmPresetImport() {
    if (!pendingPresetImport) return;
    const available = Math.max(0, 12 - profiles.length);
    const accepted = pendingPresetImport.slice(0, available);
    if (!accepted.length) {
      setPresetTransferStatus(
        "No se importó nada: alcanza el límite de 12 presets sin reemplazar los existentes."
      );
      setPendingPresetImport(null);
      setPendingPresetFileName("");
      return;
    }
    const next = [...accepted, ...profiles];
    setProfiles(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setPresetTransferStatus(
      `${accepted.length} preset(s) importado(s) sin datos de sesión.`
    );
    setPendingPresetImport(null);
    setPendingPresetFileName("");
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard?.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  async function createLinkedSession() {
    try {
      const result = await createSession.mutateAsync({
        origin: window.location.origin,
        expiresInSeconds: 600,
      });
      setCreatedSession(result);
      setConnected(true);
      setShowQrGuide(true);
      await connectSession.mutateAsync({
        publicId: result.publicId,
        mobileToken: result.mobileToken,
      });
    } catch {
      setConnected(false);
    }
  }
  async function connectFromQr() {
    if (!activeSession || !activeToken) return;
    try {
      await connectSession.mutateAsync({
        publicId: activeSession,
        mobileToken: activeToken,
      });
      setConnected(true);
      setShowQrGuide(true);
    } catch {
      setConnected(false);
    }
  }
  function reconnectWebSocket() {
    if (!activeSession || !activeToken || !connected) return;
    setReconnectSeconds(null);
    setReconnectAttempt(current => current + 1);
  }
  async function connectFromManualCode() {
    const normalizedCode = manualLinkCode.replace(/\D/g, "");
    if (normalizedCode.length !== 8) {
      toast.error("Código incompleto", {
        description: "Ingresa los 8 dígitos mostrados junto al QR.",
      });
      return;
    }
    try {
      const result = await connectWithManualCode.mutateAsync({
        manualCode: normalizedCode,
      });
      setCreatedSession({
        publicId: result.publicId,
        mobileToken: result.mobileToken,
        mobileUrl: "",
        screenUrl: "",
        qrDataUrl: "",
        expiresAt: result.expiresAt,
        status: result.status,
      });
      setManualLinkCode("");
      setConnected(true);
      setShowQrGuide(true);
      toast.success("Celular vinculado", {
        description: "El control queda limitado a comandos de presentación.",
      });
    } catch (error) {
      toast.error("No se pudo vincular el celular", {
        description:
          error instanceof Error ? error.message : "Revisa el código temporal.",
      });
    }
  }
  function typeKey(key: string) {
    setKeyboardText(current => `${current}${key}`);
    send("text", { key });
  }
  function keyboardAction(action: "backspace" | "space" | "enter" | "clear") {
    setKeyboardText(current =>
      action === "backspace"
        ? current.slice(0, -1)
        : action === "space"
          ? `${current} `
          : action === "clear"
            ? ""
            : current
    );
    send(action === "enter" ? "select" : "text", { key: action });
  }

  return (
    <main
      data-theme={themeMode}
      className={`min-h-screen px-4 py-6 text-white transition-colors duration-300 sm:px-8 lg:px-12 ${themeMode === "midnight" ? "bg-[#030711]" : "bg-[#07110e]"}`}
    >
      <Dialog
        open={Boolean(pendingPresetImport)}
        onOpenChange={open => {
          if (!open) {
            setPendingPresetImport(null);
            setPendingPresetFileName("");
          }
        }}
      >
        <DialogContent className="border-cyan-100/30 bg-[#07110e]/85 text-white shadow-2xl shadow-cyan-950/30 backdrop-blur-xl supports-[backdrop-filter]:bg-[#07110e]/70 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Revisar presets antes de importar</DialogTitle>
            <DialogDescription className="text-slate-300">
              {pendingPresetFileName} contiene{" "}
              {pendingPresetImport?.length ?? 0} preset(s) válido(s). Los{" "}
              {profiles.length} preset(s) actuales no se reemplazarán.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-52 space-y-2 overflow-auto border border-white/10 p-3 text-sm">
            {pendingPresetImport?.map(preset => (
              <div
                key={preset.updatedAt}
                className="flex items-center justify-between gap-3"
              >
                <span>{preset.name}</span>
                <span className="text-xs text-slate-400">
                  {preset.deviceKind} · {preset.mode}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPendingPresetImport(null);
                setPendingPresetFileName("");
              }}
              className="controller-neon-button border-white/15 bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmPresetImport}
              className="controller-neon-button bg-cyan-200 text-black"
            >
              Importar sin reemplazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mx-auto max-w-7xl">
        <header className={`${isFocusedExperience ? "hidden" : "flex"} flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-emerald-200">
              MiLukita · Controller Lab
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-6xl">
              Tu celular, tu mando.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Un solo control para navegar, jugar, deslizar y escribir en la
              experiencia TV. Solo transmite comandos de presentación
              permitidos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setThemeMode(current =>
                  current === "dark" ? "midnight" : "dark"
                )
              }
              className="controller-neon-button border-white/15 bg-white/5 text-xs"
              aria-label={`Cambiar a tema ${themeMode === "dark" ? "medianoche" : "oscuro"}`}
            >
              {themeMode === "dark" ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              {themeMode === "dark" ? "Medianoche" : "Oscuro"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHelp(value => !value)}
              className="controller-neon-button border-white/15 bg-white/5 text-xs"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Ayuda
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOnboarding(true)}
              className="controller-neon-button border-cyan-200/30 bg-cyan-200/5 text-xs text-cyan-50"
            >
              Guía 30 s
            </Button>
            {!isPreviewFrame ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProportionPreview(value => !value)}
                className="controller-neon-button border-violet-200/30 bg-violet-200/5 text-xs text-violet-50"
              >
                {showProportionPreview
                  ? "Cerrar simulador"
                  : "Vista por proporción"}
              </Button>
            ) : null}
            <div
              className={`flex items-center gap-2 border px-3 py-2 text-xs ${connected ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-white/15 bg-white/5 text-slate-300"}`}
            >
              <Wifi className="h-4 w-4" />
              {connected
                ? `Sesión ${socketStatus === "connected" ? "WebSocket activa" : "con respaldo seguro"}`
                : "Sesión no vinculada · sin autoridad de juego"}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 border border-white/10 bg-black/20 px-3 py-2 text-xs transition-colors duration-300"
                  aria-live="polite"
                  aria-label={`Calidad de conexión: ${connectionQuality.label}${latencyMs === null ? "" : `, ${latencyMs} milisegundos`}`}
                >
                  <span
                    className="flex h-4 items-end gap-0.5"
                    aria-hidden="true"
                  >
                    {[1, 2, 3, 4].map(level => (
                      <i
                        key={level}
                        className="w-1"
                        style={{
                          height: `${level * 4}px`,
                          backgroundColor:
                            level <= connectionQuality.level
                              ? connectionQuality.color
                              : "#334155",
                          boxShadow:
                            level <= connectionQuality.level
                              ? `0 0 5px ${connectionQuality.color}`
                              : undefined,
                        }}
                      />
                    ))}
                  </span>
                  <span style={{ color: connectionQuality.color }}>
                    {connectionQuality.label}
                  </span>
                  <span className="text-slate-400">
                    {socketStatus === "connected" && latencyMs !== null
                      ? `${latencyMs} ms`
                      : "WS"}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-64 bg-slate-950 text-slate-100"
              >
                <p className="font-semibold">
                  {socketStatus === "connected" && latencyMs !== null
                    ? `Ping: ${latencyMs} ms`
                    : "Ping aún no disponible"}
                </p>
                <p className="mt-1 leading-5">
                  {socketStatus !== "connected"
                    ? "Se usa respaldo persistido. Revisa la red local de ambos dispositivos."
                    : latencyMs !== null && latencyMs > 300
                      ? "Acerca ambos equipos al router o cambia a una red Wi‑Fi menos saturada."
                      : latencyMs !== null && latencyMs > 160
                        ? "La conexión es variable; evita descargas y verifica señal Wi‑Fi."
                        : "Conexión adecuada para comandos de presentación."}
                </p>
                <LatencySparkline points={latencyHistory} />
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        {connectionAlert ? (
          <div
            role="alert"
            className="controller-mode-stage mt-4 flex flex-wrap items-center gap-3 border bg-black/30 px-4 py-3 text-sm transition-colors duration-300"
            aria-live="assertive"
            style={{
              borderColor: connectionQuality.color,
              color: connectionQuality.color,
            }}
          >
            <WifiOff className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">{connectionAlert}</span>
            {connected && socketStatus !== "connected" ? (
              <Button
                type="button"
                variant="outline"
                onClick={reconnectWebSocket}
                disabled={socketStatus === "connecting"}
                className="controller-neon-button h-8 border-current bg-transparent px-2 text-xs"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                {reconnectSeconds !== null
                  ? `Reconectar ahora · ${reconnectSeconds}s`
                  : "Reconectar ahora"}
              </Button>
            ) : null}
          </div>
        ) : null}
        {showHelp ? (
          <ControllerHelp onClose={() => setShowHelp(false)} />
        ) : null}
        {showQrGuide ? (
          <QrLinkGuide
            qrDataUrl={createdSession?.qrDataUrl}
            connected={connected}
            onClose={() => setShowQrGuide(false)}
          />
        ) : null}
        {showOnboarding ? (
          <ControllerOnboarding
            onClose={() => {
              localStorage.setItem("milukita-controller-onboarding", "seen");
              setShowOnboarding(false);
            }}
          />
        ) : null}
        {showProportionPreview ? (
          <ProportionPreview
            presetId={previewPreset}
            onPreset={setPreviewPreset}
            activePreview={activePreview}
            recommendedPreset={recommendedPreviewPreset}
          />
        ) : null}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section
            className="border border-white/10 bg-black/20 p-5 sm:p-8"
            aria-labelledby="remote-preview-title"
          >
            <div className="flex flex-col gap-4">
              <div className={`${isFocusedExperience ? "hidden" : "flex"} flex-wrap items-start justify-between gap-3`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                    Vista previa
                  </p>
                  <h2
                    id="remote-preview-title"
                    className="mt-1 font-display text-3xl"
                  >
                    {label}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Smartphone className="h-4 w-4" />
                  {role} · {layout === "spacious" ? "espacioso" : "compacto"}
                </div>
              </div>
              <div
                className={`${isFocusedExperience ? "hidden" : "grid"} grid-cols-2 gap-2 sm:grid-cols-4`}
                role="tablist"
                aria-label="Modo del controlador"
              >
                {MODE_CONFIG.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={mode === item.id}
                      onClick={() => setControllerMode(item.id)}
                      className={`controller-neon-button flex items-center justify-center gap-2 border px-2 py-2 text-xs font-bold ${mode === item.id ? "text-black" : "border-white/15 bg-white/5 text-slate-300"}`}
                      style={
                        mode === item.id
                          ? {
                              borderColor: color.hex,
                              backgroundColor: color.hex,
                              boxShadow: `0 0 12px ${color.hex}66`,
                            }
                          : undefined
                      }
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className={`${isFocusedExperience ? "hidden" : "block"} text-xs text-slate-400`}>{activeMode.detail}</p>
              <p className={`${isFocusedExperience ? "hidden" : "block"} text-[11px] text-slate-500`}>
                Viewport detectado: {deviceViewport.width} ×{" "}
                {deviceViewport.height} CSS px · proporción aproximada{" "}
                {deviceViewport.ratio}:1 · {profileSuggestion.deviceName}
              </p>
              <p className={`${isFocusedExperience ? "hidden" : "block"} mt-1 text-[11px] text-emerald-200/70`}>
                Maqueta maestra 8 × 18 cm (4:9):{" "}
                {displayVertical
                  ? "vertical 4:9"
                  : "horizontal apaisada 9:4"}
                . La vista se corrige automáticamente al girar el celular.
              </p>
            </div>
            <div
              className={`mt-6 grid place-items-center border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.08),transparent_34%),#0b1713] p-5 ${displayVertical ? "aspect-[4/9] max-w-[360px]" : "aspect-[9/4]"}`}
              style={glow}
            >
              <div
                className={`prism-controller-shell controller-mode-stage relative w-full border p-5 ${displayVertical ? "aspect-[4/9] max-w-[280px]" : "aspect-[9/4] max-w-[760px]"} ${layout === "spacious" ? "rounded-[2rem]" : "rounded-2xl"} ${feedbackAction ? "prism-feedback-pulse" : ""}`}
                style={
                  {
                    borderColor: color.hex,
                    boxShadow: `0 0 ${Math.round(28 * neonIntensity)}px ${color.hex}${Math.round(
                      85 * neonIntensity
                    )
                      .toString(16)
                      .padStart(
                        2,
                        "0"
                      )}, inset 0 0 0 1px ${color.hex}${Math.round(
                      68 * neonIntensity
                    )
                      .toString(16)
                      .padStart(2, "0")}`,
                    filter: `brightness(${neonIntensity})`,
                    "--prism-accent": color.hex,
                    "--prism-glow": `${color.hex}24`,
                  } as CSSProperties
                }
                key={`${mode}-${orientation}`}
              >
                <DeviceChrome
                  chrome={chrome}
                  mode={mode}
                  color={color.hex}
                  locked={locked}
                  connected={connected}
                  socketStatus={socketStatus}
                  latencyMs={latencyMs}
                  onMode={setControllerMode}
                  onLock={() => setLocked(value => !value)}
                  onReturn={() => send("back")}
                  hideReturnAndConnection={true}
                />
                <div className="flex items-center justify-between border-b border-white/10 pb-3 pt-9">
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[.2em]"
                      style={{ color: color.hex }}
                    >
                      MiLukita
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {activeMode.label} ·{" "}
                      {displayVertical
                        ? "Vertical · rotada"
                        : "Horizontal · apaisada"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {locked ? "BLOQUEADO" : "ACTIVO"}
                  </span>
                </div>
                <PresentationToolbar
                  color={color.hex}
                  signalColor={connectionQuality.color}
                  signalLabel={connectionQuality.label}
                  mode={mode}
                  locked={locked}
                  onAction={send}
                  onMode={changeControllerModeFromToolbar}
                  vibrationEnabled={vibration}
                  onToggleVibration={() => setVibration(value => !value)}
                  onFeedback={playFeedback}
                  toolbarOrder={toolbarOrder}
                  onToolbarOrder={setToolbarOrder}
                  showActions={true}
                  volume={volume}
                  volumeColor={volumeColor}
                  muted={volumeMuted}
                  onToggleMute={() => setVolumeMuted(value => !value)}
                  volumeHideDelay={volumeHideDelay}
                />
                {mode === "ar" ? (
                  <ARStagePad
                    color={color.hex}
                    horizontal={!displayVertical}
                    locked={locked}
                    sensitivity={touchSensitivity}
                    traceColor={traceColor}
                    traceWidth={traceWidth}
                    pointerColor={pointerColor}
                    pointerSize={pointerSize}
                    trailEnabled={trailEnabled}
                    trailDuration={trailDuration}
                    volume={volume}
                    muted={volumeMuted}
                    onVolumeChange={setVolume}
                    onMute={() => setVolumeMuted(value => !value)}
                    onFeedback={playFeedback}
                    onReset={() => {
                      playFeedback("select");
                      toast.success("Escena AR restablecida");
                    }}
                  />
                ) : mode === "trackpad" ? (
                  <TouchSurface
                    color={color.hex}
                    onGesture={send}
                    sensitivity={touchSensitivity}
                    traceColor={traceColor}
                    traceWidth={traceWidth}
                    pointerColor={pointerColor}
                    pointerSize={pointerSize}
                    trailEnabled={trailEnabled}
                    trailDuration={trailDuration}
                    onHaptic={touchpadHaptic}
                  />
                ) : mode === "keyboard" ? (
                  <MiniKeyboard
                    value={keyboardText}
                    color={color.hex}
                    trackpadPercent={trackpadPercent}
                    horizontal={!displayVertical}
                    onKey={typeKey}
                    onAction={keyboardAction}
                    onTrackpad={send}
                    sensitivity={touchSensitivity}
                    traceColor={traceColor}
                    traceWidth={traceWidth}
                    pointerColor={pointerColor}
                    pointerSize={pointerSize}
                    trailEnabled={trailEnabled}
                    trailDuration={trailDuration}
                    onHaptic={touchpadHaptic}
                  />
                ) : (
                  <RemotePad
                    color={color.hex}
                    layout={layout}
                    onAction={send}
                  />
                )}
                {shareQrDataUrl && shareLink ? (
                  <div className="mt-4 flex items-center gap-2 border border-cyan-200/20 bg-black/20 p-2" aria-label="QR circular de perfil activo">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-cyan-300/70 bg-white p-1">
                      <img src={shareQrDataUrl} alt="QR de perfil" className="h-9 w-9 object-contain" />
                    </div>
                    <span className="text-[10px] text-cyan-100">Perfil compartible · marco L★</span>
                  </div>
                ) : null}
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-slate-500">
                  <span aria-live="polite">
                    {feedbackAction
                      ? `Respuesta táctil: ${feedbackAction}`
                      : locked
                        ? "Controles bloqueados"
                        : socketStatus === "connected"
                          ? `WebSocket · ${latencyMs === null ? "midiendo…" : `${latencyMs} ms`}`
                          : sendCommand.isPending
                            ? "Enviando a la TV…"
                            : lastAction
                              ? `Último: ${lastAction}`
                              : "Listo para controlar"}
                  </span>
                  {mode === "remote" ? null : (
                    <Sparkles
                      className="h-3.5 w-3.5"
                      style={{ color: color.hex }}
                    />
                  )}
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Los botones responden visualmente al toque. Si hay sesión
              vinculada, los comandos se guardan y la pantalla vinculada los
              recibe mediante sincronización segura.
            </p>
          </section>
          <aside
            className={isFocusedExperience ? "hidden" : "space-y-5"}
            aria-label="Personalización y sesión del controlador"
          >
            <section className="border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                    Identidad
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    Personaliza tu control
                  </h2>
                </div>
                <Palette className="h-5 w-5" style={{ color: color.hex }} />
              </div>
              <label className="mt-5 block text-xs font-bold text-slate-300">
                Nombre visible
                <input
                  value={label}
                  onChange={event => setLabel(event.target.value)}
                  maxLength={36}
                  className="mt-2 w-full border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300"
                />
              </label>
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-300">
                  Iluminación del control: {""}
                  <span style={{ color: color.hex }}>{color.name}</span>
                </p>
                <div
                  className={`mt-3 h-2 w-full origin-left bg-gradient-to-r from-transparent via-current to-transparent transition-transform duration-200 ${palettePulse ? "scale-x-100 opacity-100" : "scale-x-95 opacity-70"}`}
                  style={{
                    color: color.hex,
                    boxShadow: `0 0 18px ${color.hex}`,
                  }}
                  aria-hidden="true"
                />
                <p
                  className="mt-2 text-[10px] text-slate-500"
                  role="status"
                  aria-live="polite"
                >
                  Preset activo: {color.name}. El brillo se actualiza suavemente
                  en toda la maqueta.
                </p>
                <label className="mt-3 block text-[10px] font-bold text-slate-300">
                  Intensidad lumínica: {Math.round(neonIntensity * 100)}%
                  <input
                    type="range"
                    min="0.55"
                    max="1.4"
                    step="0.05"
                    value={neonIntensity}
                    onChange={event =>
                      changeNeonIntensity(Number(event.target.value))
                    }
                    className="mt-2 w-full accent-emerald-300"
                    aria-label="Intensidad lumínica del color neón"
                  />
                  <span className="mt-1 block font-normal text-slate-500">
                    Ajusta el brillo del acento en tiempo real.
                  </span>
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {NEON_PALETTE.map(item => (
                    <button
                      key={item.hex}
                      type="button"
                      onClick={() => applyNeonColor(item)}
                      className="controller-neon-button h-8 w-8 rounded-full border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                      style={{
                        backgroundColor: item.hex,
                        boxShadow:
                          item.hex === color.hex
                            ? `0 0 16px ${item.hex}`
                            : undefined,
                      }}
                      aria-label={`Usar color ${item.name}`}
                      aria-pressed={item.hex === color.hex}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={randomizeColor}
                    className="controller-neon-button ml-1 h-8 border-white/15 bg-white/5 px-2 text-xs"
                  >
                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                    Aleatorio
                  </Button>
                  <label className="ml-1 flex h-8 items-center gap-1 border border-white/15 bg-white/5 px-2 text-[10px] text-slate-300">
                    <span className="sr-only">Color personalizado</span>
                    <input
                      type="color"
                      value={color.hex}
                      onChange={event =>
                        applyNeonColor({
                          name: "Color personalizado",
                          hex: event.target.value,
                        })
                      }
                      className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                      aria-label="Elegir color neón personalizado"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={layout === "spacious" ? "default" : "outline"}
                  onClick={() => setLayout("spacious")}
                  className={
                    layout === "spacious"
                      ? "controller-neon-button bg-emerald-300 text-black hover:bg-emerald-200"
                      : "controller-neon-button border-white/15 bg-white/5"
                  }
                >
                  Espacioso
                </Button>
                <Button
                  type="button"
                  variant={layout === "compact" ? "default" : "outline"}
                  onClick={() => setLayout("compact")}
                  className={
                    layout === "compact"
                      ? "controller-neon-button bg-emerald-300 text-black hover:bg-emerald-200"
                      : "controller-neon-button border-white/15 bg-white/5"
                  }
                >
                  Compacto
                </Button>
              </div>
              <div
                className="mt-4 border border-emerald-200/15 bg-emerald-300/[.08] px-3 py-2 text-xs text-slate-300 shadow-lg shadow-emerald-950/10 backdrop-blur-lg supports-[backdrop-filter]:bg-emerald-300/[.05]"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-emerald-100">
                    Rotación automática
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[.12em] text-emerald-200">
                    {displayVertical ? "Vertical" : "Horizontal"}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Gira el celular; la maqueta 8 × 18 cm se corrige sin
                  seleccionar orientación.
                </p>
              </div>
              {mode === "keyboard" || mode === "trackpad" ? (
                <>
                  <label className="mt-4 block text-xs font-bold text-slate-300">
                    Sensibilidad táctil: {touchSensitivity}/10
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={touchSensitivity}
                      onChange={event =>
                        setTouchSensitivity(Number(event.target.value))
                      }
                      className="mt-3 w-full accent-emerald-300"
                      aria-label="Sensibilidad del touchpad"
                    />
                    <span className="mt-1 block text-[10px] font-normal text-slate-500">
                      Más alto = gestos más sensibles y menor recorrido
                      necesario.
                    </span>
                    <button
                      type="button"
                      onClick={() => setTouchSensitivity(7)}
                      className="mt-2 text-[10px] font-bold text-emerald-200 underline underline-offset-2"
                    >
                      Restablecer sensibilidad predeterminada
                    </button>
                  </label>
                  <div
                    className="mt-4 border border-white/10 bg-black/10 px-3 py-2 text-[10px] text-slate-400"
                    title="Doble toque selecciona; un deslizamiento rápido cambia el foco o desplaza."
                  >
                    <p className="font-bold uppercase tracking-[.14em] text-emerald-100">
                      Guía de gestos
                    </p>
                    <p className="mt-1">
                      Toque: seleccionar · doble toque: confirmar con háptica ·
                      deslizamiento rápido: mover con señal háptica.
                    </p>
                  </div>
                  <div className="mt-4 border border-white/10 bg-black/10 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-300">
                      Rastro de contacto
                    </p>
                    <label className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                      Color{" "}
                      <input
                        aria-label="Color del rastro de contacto"
                        type="color"
                        value={traceColor}
                        onChange={event => setTraceColor(event.target.value)}
                        className="h-7 w-10 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
                      />
                    </label>
                    <label className="mt-2 block text-[10px] text-slate-400">
                      Grosor: {traceWidth}px
                      <input
                        aria-label="Grosor del rastro de contacto"
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={traceWidth}
                        onChange={event =>
                          setTraceWidth(Number(event.target.value))
                        }
                        className="mt-2 w-full accent-emerald-300"
                      />
                    </label>
                    <label className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                      Mostrar estela{" "}
                      <input
                        aria-label="Mostrar estela de Lukita Star Trail"
                        type="checkbox"
                        checked={trailEnabled}
                        onChange={event =>
                          setTrailEnabled(event.target.checked)
                        }
                      />
                    </label>
                    <label className="mt-2 block text-[10px] text-slate-400">
                      Duración: {trailDuration} ms
                      <input
                        aria-label="Duración de la estela de Lukita Star Trail"
                        type="range"
                        min="180"
                        max="1400"
                        step="20"
                        value={trailDuration}
                        onChange={event =>
                          setTrailDuration(Number(event.target.value))
                        }
                        className="mt-2 w-full accent-emerald-300"
                      />
                    </label>
                  </div>
                  <div className="mt-4 border border-white/10 bg-black/10 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-yellow-200">
                      Lukita Star Trail
                    </p>
                    <label className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                      Color de estrella{" "}
                      <input
                        aria-label="Color del puntero Lukita Star Trail"
                        type="color"
                        value={pointerColor}
                        onChange={event => setPointerColor(event.target.value)}
                        className="h-7 w-10 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
                      />
                    </label>
                    <label className="mt-2 block text-[10px] text-slate-400">
                      Tamaño:{" "}
                      {pointerSize === "large"
                        ? "Grande"
                        : pointerSize === "small"
                          ? "Pequeña"
                          : "Mediana"}
                      <select
                        aria-label="Tamaño del puntero Lukita Star Trail"
                        value={pointerSize}
                        onChange={event =>
                          setPointerSize(event.target.value as PointerStarSize)
                        }
                        className="mt-2 w-full border border-white/15 bg-white/5 px-2 py-2 text-xs text-white"
                      >
                        <option value="small">Pequeña</option>
                        <option value="medium">Mediana</option>
                        <option value="large">Grande</option>
                      </select>
                    </label>
                  </div>
                  {mode === "keyboard" ? (
                    <label className="mt-4 block text-xs font-bold text-slate-300">
                      Altura del puntero: {trackpadPercent}%
                      <input
                        type="range"
                        min="20"
                        max="45"
                        step="1"
                        value={trackpadPercent}
                        onChange={event =>
                          setTrackpadPercent(Number(event.target.value))
                        }
                        className="mt-3 w-full accent-emerald-300"
                        aria-label="Altura del área de trackpad del Mini Teclado"
                      />
                    </label>
                  ) : null}
                </>
              ) : null}
              <label className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-300">
                <span>Vibración al tocar</span>
                <input
                  type="checkbox"
                  checked={vibration}
                  onChange={event => setVibration(event.target.checked)}
                  className="h-4 w-4 accent-emerald-300"
                />
              </label>
              <label className="mt-3 block text-sm text-slate-300">
                Intensidad háptica
                <select
                  aria-label="Intensidad háptica"
                  value={hapticIntensity}
                  onChange={event =>
                    setHapticIntensity(event.target.value as HapticIntensity)
                  }
                  className="mt-2 w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-slate-200"
                >
                  <option value="soft">Suave</option>
                  <option value="medium">Media</option>
                  <option value="strong">Fuerte</option>
                </select>
              </label>
              <label className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>Sonido sutil</span>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={event => setSoundEnabled(event.target.checked)}
                  className="h-4 w-4 accent-emerald-300"
                />
              </label>
              <label className="mt-3 block text-sm text-slate-300">
                Efecto de toque
                <select
                  aria-label="Efecto de sonido del toque"
                  value={soundEffect}
                  onChange={event =>
                    setSoundEffect(event.target.value as SoundEffect)
                  }
                  className="mt-2 w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-slate-200"
                >
                  <option value="soft">Pulso suave</option>
                  <option value="spark">Destello</option>
                  <option value="chime">Campanilla</option>
                </select>
              </label>
              <label className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>Color de barra de volumen</span>
                <input
                  type="color"
                  value={volumeColor}
                  onChange={event => setVolumeColor(event.target.value)}
                  className="h-9 w-14 cursor-pointer border border-white/20 bg-transparent"
                  aria-label="Color de barra de volumen"
                />
              </label>
              <label className="mt-3 block text-sm text-slate-300">
                Ocultar barra tras {volumeHideDelay} s
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={volumeHideDelay}
                  onChange={event =>
                    setVolumeHideDelay(Number(event.target.value))
                  }
                  className="mt-2 w-full accent-emerald-300"
                  aria-label="Tiempo de ocultación de barra de volumen"
                />
              </label>
            </section>
            <section
              className="border border-white/10 bg-black/20 p-5"
              aria-labelledby="favorite-scenes-title"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                    Acceso rápido
                  </p>
                  <h2
                    id="favorite-scenes-title"
                    className="mt-1 text-xl font-bold"
                  >
                    Escenas favoritas
                  </h2>
                </div>
                <Star className="h-4 w-4 text-amber-300" />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Guarda una combinación de modo, color, orientación y proporción
                del puntero para recuperarla en un toque.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={sceneName}
                  onChange={event => setSceneName(event.target.value)}
                  maxLength={28}
                  placeholder="Nombre de escena"
                  className="min-w-0 flex-1 border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white"
                  aria-label="Nombre de la escena favorita"
                />
                <Button
                  type="button"
                  onClick={saveFavoriteScene}
                  className="controller-neon-button bg-amber-200 text-black hover:bg-amber-100"
                  aria-label="Guardar escena favorita"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
              {favoriteScenes.length ? (
                <div className="mt-3 space-y-2">
                  {favoriteScenes.map(scene => (
                    <div
                      key={scene.id}
                      className="flex items-center gap-2 border border-white/10 bg-white/[.03] px-2 py-2"
                    >
                      <button
                        type="button"
                        onClick={() => applyFavoriteScene(scene)}
                        className="controller-neon-button min-w-0 flex-1 truncate text-left text-xs font-semibold text-white"
                        aria-label={`Aplicar escena ${scene.name}`}
                      >
                        <span className="block truncate">{scene.name}</span>
                        <span className="block text-[10px] font-normal text-slate-500">
                          {MODE_CONFIG.find(item => item.id === scene.mode)
                            ?.label ?? scene.mode}{" "}
                          · {scene.orientation}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFavoriteScene(scene.id)}
                        className="controller-neon-button grid h-7 w-7 place-items-center text-xs text-slate-400 hover:text-rose-200"
                        aria-label={`Eliminar escena ${scene.name}`}
                      >
                        <Delete className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 border border-dashed border-white/15 px-3 py-3 text-xs text-slate-500">
                  Todavía no tienes escenas guardadas.
                </p>
              )}
            </section>
            <ChromeConfigurator chrome={chrome} onChange={setChrome} />
            <section className="border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                Sesión QR en tiempo real
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Presentador u operador crean un QR temporal. El celular requiere
                inicio de sesión y la TV recibe solo comandos de presentación.
              </p>
              {!auth.isAuthenticated ? (
                <p className="mt-3 border border-amber-200/20 bg-amber-200/5 p-3 text-xs text-amber-100">
                  Inicia sesión para crear o vincular una sesión de control.
                </p>
              ) : urlSession && !connected ? (
                <Button
                  type="button"
                  onClick={connectFromQr}
                  disabled={connectSession.isPending}
                  className="controller-neon-button mt-3 w-full bg-emerald-300 text-black"
                >
                  {connectSession.isPending
                    ? "Vinculando…"
                    : "Vincular este celular"}
                </Button>
              ) : !activeSession ? (
                <div className="mt-3 space-y-3">
                  <Button
                    type="button"
                    onClick={createLinkedSession}
                    aria-busy={createSession.isPending}
                    disabled={
                      createSession.isPending ||
                      (role !== "PRESENTER" && role !== "OPERATOR")
                    }
                    className="controller-neon-button w-full bg-emerald-300 text-black"
                  >
                    {createSession.isPending ? (
                      <>
                        <Loader2
                          className="mr-2 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Generando QR seguro…
                      </>
                    ) : role === "USER" ? (
                      "Requiere rol presentador u operador"
                    ) : (
                      "Crear sesión QR de 10 minutos"
                    )}
                  </Button>
                  <div className="border border-white/10 bg-black/20 p-3">
                    <p className="text-xs font-bold text-slate-200">
                      ¿No puedes escanear el QR?
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Ingresa los 8 dígitos temporales que muestra la pantalla.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={manualLinkCode}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]*"
                        maxLength={8}
                        onChange={event =>
                          setManualLinkCode(
                            event.target.value.replace(/\D/g, "").slice(0, 8)
                          )
                        }
                        placeholder="12345678"
                        className="min-w-0 flex-1 border border-white/15 bg-black/30 px-3 py-2 font-mono text-sm tracking-[.18em] text-white"
                        aria-label="Código manual de vínculo de ocho dígitos"
                      />
                      <Button
                        type="button"
                        onClick={() => void connectFromManualCode()}
                        disabled={
                          connectWithManualCode.isPending ||
                          manualLinkCode.length !== 8
                        }
                        className="controller-neon-button bg-cyan-200 px-3 text-xs text-black"
                      >
                        {connectWithManualCode.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Vincular"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2 border border-emerald-300/20 bg-emerald-300/5 p-3 text-xs text-emerald-100">
                    <Check className="h-4 w-4" />
                    Sesión vinculada hasta{" "}
                    {createdSession
                      ? new Date(createdSession.expiresAt).toLocaleTimeString()
                      : "su vencimiento"}
                  </div>
                  {createdSession?.qrDataUrl ? (
                    <img
                      src={createdSession.qrDataUrl}
                      alt="Código QR para vincular MiLukita Controller"
                      className="mx-auto h-40 w-40 bg-white p-2"
                    />
                  ) : null}
                  {createdSession?.manualCode ? (
                    <div className="border border-cyan-200/25 bg-cyan-200/5 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-100">
                        Código alternativo de 8 dígitos
                      </p>
                      <p className="mt-1 font-mono text-xl font-black tracking-[.24em] text-white">
                        {createdSession.manualCode.slice(0, 4)}{" "}
                        {createdSession.manualCode.slice(4)}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Solo vincula un celular autenticado antes del
                        vencimiento.
                      </p>
                    </div>
                  ) : null}
                  {createdSession?.screenUrl ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => copy(createdSession.screenUrl)}
                        className="controller-neon-button w-full border-white/15 bg-white/5"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {copied
                          ? "Enlace TV copiado"
                          : "Copiar enlace de pantalla"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          void closeSession
                            .mutateAsync({ publicId: activeSession! })
                            .then(() => {
                              setConnected(false);
                              setCreatedSession(null);
                            });
                        }}
                        className="controller-neon-button w-full border-amber-200/30 bg-amber-200/10 text-amber-100"
                      >
                        <WifiOff className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : null}
                </div>
              )}
            </section>
            <section className="border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                  Guardar perfil
                </p>
                <CircleUserRound
                  className="h-4 w-4"
                  style={{ color: color.hex }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-slate-300">
                <span>
                  Sugerido para {profileSuggestion.deviceName}:{" "}
                  <strong className="text-white">
                    {profileSuggestion.deviceName} · {activeMode.label}
                  </strong>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={applyProfileSuggestion}
                  className="controller-neon-button h-7 px-2 text-xs"
                  style={{ color: color.hex }}
                >
                  Usar
                </Button>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={profileName}
                  onChange={event => setProfileName(event.target.value)}
                  maxLength={30}
                  className="min-w-0 flex-1 border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white"
                />
                <Button
                  type="button"
                  onClick={saveProfile}
                  className="controller-neon-button bg-white text-black hover:bg-emerald-200"
                  aria-label="Guardar perfil"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <label className="mt-3 block text-xs text-slate-300">
                Guardar como preset para
                <select
                  value={presetDeviceKind}
                  onChange={event =>
                    setPresetDeviceKind(event.target.value as DeviceKind)
                  }
                  className="mt-2 w-full border border-white/15 bg-black/20 px-3 py-2 text-xs text-white"
                >
                  <option value="phone">Celular</option>
                  <option value="tablet">Tablet o plegable</option>
                  <option value="desktop">TV, laptop o escritorio</option>
                </select>
              </label>
              <div
                className="mt-3 grid grid-cols-2 gap-2"
                aria-label="Intercambio de presets"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => exportDevicePresets()}
                  disabled={!profiles.length}
                  className="controller-neon-button border-cyan-200/30 bg-cyan-200/5 text-xs text-cyan-50"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Exportar JSON
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => presetImportRef.current?.click()}
                  className="controller-neon-button border-cyan-200/30 bg-cyan-200/5 text-xs text-cyan-50"
                >
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Importar JSON
                </Button>
                <input
                  ref={presetImportRef}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={event =>
                    void importDevicePresetFile(event.target.files?.[0])
                  }
                />
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => presetImportRef.current?.click()}
                onKeyDown={event => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    presetImportRef.current?.click();
                  }
                }}
                onDragOver={event => {
                  event.preventDefault();
                  setIsDraggingPreset(true);
                }}
                onDragLeave={() => setIsDraggingPreset(false)}
                onDrop={event => {
                  event.preventDefault();
                  setIsDraggingPreset(false);
                  void importDevicePresetFile(
                    event.dataTransfer.files?.[0],
                    "drop"
                  );
                }}
                className={`controller-neon-button mt-2 border border-dashed px-3 py-3 text-center text-xs ${isDraggingPreset ? "border-cyan-200 bg-cyan-200/15 text-cyan-50" : "border-white/20 bg-black/20 text-slate-300"}`}
                aria-label="Arrastra un archivo JSON de presets o actívalo para seleccionarlo"
              >
                Arrastra un archivo JSON aquí o selecciónalo
              </div>
              {presetTransferStatus ? (
                <p className="mt-2 text-xs text-cyan-100" aria-live="polite">
                  {presetTransferStatus}
                </p>
              ) : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_132px_132px]">
                <input
                  value={profileSearch}
                  onChange={event => setProfileSearch(event.target.value)}
                  placeholder="Buscar perfil, modo o dispositivo"
                  className="min-w-0 border border-white/15 bg-black/20 px-3 py-2 text-xs text-white"
                  aria-label="Buscar perfiles"
                />
                <select
                  value={profileFilter}
                  onChange={event =>
                    setProfileFilter(
                      event.target.value as "all" | "local" | "imported"
                    )
                  }
                  className="border border-white/15 bg-black/20 px-2 py-2 text-xs text-white"
                  aria-label="Filtrar perfiles"
                >
                  <option value="all">Todos</option>
                  <option value="local">Presets locales</option>
                  <option value="imported">Importados</option>
                </select>
                <select
                  value={profileTagFilter}
                  onChange={event => setProfileTagFilter(event.target.value)}
                  className="border border-white/15 bg-black/20 px-2 py-2 text-xs text-white"
                  aria-label="Filtrar por etiqueta"
                >
                  <option value="all">Etiquetas</option>
                  {allProfileTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              {profiles.length ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 border-y border-white/10 py-2 text-xs text-slate-300">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          visibleProfiles.length > 0 &&
                          visibleProfiles.every(profile =>
                            selectedProfileIds.includes(profile.updatedAt)
                          )
                        }
                        onChange={event =>
                          setSelectedProfileIds(
                            event.target.checked
                              ? visibleProfiles.map(
                                  profile => profile.updatedAt
                                )
                              : []
                          )
                        }
                        className="accent-cyan-200"
                      />{" "}
                      Seleccionar visibles
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        exportDevicePresets(
                          profiles.filter(profile =>
                            selectedProfileIds.includes(profile.updatedAt)
                          )
                        )
                      }
                      disabled={!selectedProfileIds.length}
                      className="controller-neon-button h-7 border-cyan-200/30 px-2 text-[10px] text-cyan-50"
                    >
                      Exportar {selectedProfileIds.length}
                    </Button>
                  </div>
                  {visibleProfiles.map(profile => {
                    const Icon = PROFILE_ICONS[profile.icon ?? "sparkles"].Icon;
                    return (
                      <div
                        key={`${profile.name}-${profile.updatedAt}`}
                        className="border border-white/10 bg-white/[.03] p-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedProfileIds.includes(
                              profile.updatedAt
                            )}
                            onChange={() => toggleProfileSelection(profile)}
                            className="h-3.5 w-3.5 shrink-0 accent-cyan-200"
                            aria-label={`Seleccionar perfil ${profile.name} para exportar`}
                          />
                          <button
                            type="button"
                            onClick={() => applyProfile(profile)}
                            className="controller-neon-button grid h-8 w-8 place-items-center border border-white/10 bg-black/20"
                            aria-label={`Cargar perfil ${profile.name}`}
                          >
                            <Icon
                              className="h-4 w-4"
                              style={{ color: profile.color }}
                            />
                          </button>
                          <input
                            defaultValue={profile.name}
                            maxLength={30}
                            onBlur={event =>
                              updateProfileMeta(
                                profile,
                                event.target.value,
                                profile.icon ?? "sparkles"
                              )
                            }
                            className="min-w-0 flex-1 bg-transparent text-xs font-medium text-white outline-none focus:ring-1 focus:ring-emerald-300"
                            aria-label={`Nombre del perfil ${profile.name}`}
                          />
                          <select
                            defaultValue={profile.icon ?? "sparkles"}
                            onChange={event =>
                              updateProfileMeta(
                                profile,
                                profile.name,
                                event.target.value as ProfileIcon
                              )
                            }
                            className="border border-white/10 bg-black/20 px-1 py-1 text-[10px] text-slate-200"
                            aria-label={`Icono del perfil ${profile.name}`}
                          >
                            {Object.entries(PROFILE_ICONS).map(
                              ([value, item]) => (
                                <option key={value} value={value}>
                                  {item.label}
                                </option>
                              )
                            )}
                          </select>
                          <button
                            type="button"
                            onClick={() => toggleProfileFavorite(profile)}
                            className="controller-neon-button grid h-7 w-7 place-items-center"
                            aria-pressed={Boolean(profile.favorite)}
                            aria-label={`${profile.favorite ? "Quitar de" : "Marcar como"} favoritos: ${profile.name}`}
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${profile.favorite ? "fill-amber-300 text-amber-300" : "text-slate-400"}`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProfile(profile)}
                            className="controller-neon-button h-7 px-2 text-xs text-rose-200"
                            aria-label={`Eliminar perfil ${profile.name}`}
                          >
                            ×
                          </button>
                        </div>
                        <div className="mt-1 flex items-center justify-between pl-10 text-[9px] uppercase tracking-[.1em] text-slate-500">
                          <span>
                            {profile.source === "imported"
                              ? `Importado · ${profile.shareCode ?? "código"}`
                              : `Preset · ${profile.deviceKind ?? "phone"}`}
                          </span>
                          {profile.favorite ? (
                            <span className="text-amber-200">Favorito</span>
                          ) : null}
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: profile.color }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-10">
                          {(profile.tags ?? []).map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => removeProfileTag(profile, tag)}
                              className="controller-neon-button border border-cyan-200/25 bg-cyan-200/5 px-1.5 py-0.5 text-[10px] text-cyan-50"
                              aria-label={`Quitar etiqueta ${tag}`}
                            >
                              {tag} ×
                            </button>
                          ))}
                          <input
                            value={tagDraftByProfile[profile.updatedAt] ?? ""}
                            onChange={event =>
                              setTagDraftByProfile(current => ({
                                ...current,
                                [profile.updatedAt]: event.target.value,
                              }))
                            }
                            onKeyDown={event => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addProfileTag(profile);
                              }
                            }}
                            maxLength={20}
                            placeholder="Nueva etiqueta"
                            className="min-w-24 flex-1 bg-transparent text-[10px] text-slate-200 outline-none placeholder:text-slate-600"
                            aria-label={`Nueva etiqueta para ${profile.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => addProfileTag(profile)}
                            className="controller-neon-button px-1.5 py-0.5 text-[10px] text-cyan-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {!visibleProfiles.length ? (
                    <p className="border border-dashed border-white/15 p-3 text-xs text-slate-400">
                      No hay perfiles que coincidan con la búsqueda o filtro.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  Tus perfiles guardados aparecerán aquí.
                </p>
              )}
              <div
                className="mt-5 border-t border-white/10 pt-4"
                aria-live="polite"
              >
                <p className="text-xs font-bold text-slate-300">
                  Compartir sin sesión
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Envía solo ajustes visuales. No incluye QR, tokens ni datos de
                  conexión; vence en 7 días.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void shareCurrentProfile()}
                  disabled={
                    !auth.isAuthenticated || shareProfileMutation.isPending
                  }
                  className="controller-neon-button mt-3 w-full border-cyan-200/30 bg-cyan-200/5 text-cyan-50"
                >
                  {shareProfileMutation.isPending
                    ? "Generando…"
                    : "Generar código corto"}
                </Button>
                {shareCode ? (
                  <div className="mt-2 flex items-center justify-between border border-cyan-200/30 bg-cyan-200/5 px-3 py-2 text-sm font-bold text-cyan-50">
                    <span>{shareCode}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => void copy(shareCode)}
                        className="h-7 px-2 text-cyan-50"
                      >
                        Copiar código
                      </Button>
                      {shareLink ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => void copy(shareLink)}
                          className="h-7 px-2 text-cyan-50"
                        >
                          Copiar enlace
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {shareQrDataUrl && shareLink ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3 border border-cyan-200/20 bg-white/5 p-3">
                    <div className="relative grid h-32 w-32 place-items-center rounded-full border-2 border-cyan-300/70 bg-[radial-gradient(circle_at_50%_35%,rgba(95,255,204,.22),transparent_58%),#f7fffb] p-2 shadow-[0_0_26px_rgba(83,230,173,.22)]">
                      <img
                        src={shareQrDataUrl}
                        alt="Código QR para compartir la configuración del perfil"
                        className="h-24 w-24 rounded-sm bg-white p-1 object-contain"
                      />
                      <span className="pointer-events-none absolute -bottom-1 rounded-full border border-cyan-200/40 bg-[#07131a] px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-cyan-100">L★</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-cyan-50">
                        Compartir perfil actual
                      </p>
                      <p className="mt-1 break-all text-[10px] leading-4 text-slate-400">
                        {shareLink}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            void (navigator.share
                              ? navigator.share({
                                  title: "Perfil MiLukita Controller Lab",
                                  text: "Importa este perfil visual",
                                  url: shareLink,
                                })
                              : copy(shareLink))
                          }
                          className="controller-neon-button border-cyan-200/30 bg-cyan-200/5 text-cyan-50"
                        >
                          Compartir enlace o QR
                        </Button>
                        <a
                          href={shareQrDataUrl}
                          download="milukita-perfil-qr.png"
                          className="controller-neon-button inline-flex min-h-9 items-center border border-cyan-200/30 bg-cyan-200/5 px-3 text-xs text-cyan-50"
                        >
                          Descargar QR
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <input
                    value={importCode}
                    onChange={event =>
                      setImportCode(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="MLXXXXXXXX"
                    className="min-w-0 flex-1 border border-white/15 bg-white/5 px-3 py-2 text-xs text-white"
                    aria-label="Código corto de perfil"
                  />
                  <Button
                    type="button"
                    onClick={() => void importProfileByCode()}
                    disabled={
                      !auth.isAuthenticated ||
                      importCode.length !== 10 ||
                      importProfileMutation.isPending
                    }
                    className="controller-neon-button bg-white text-black"
                  >
                    {importProfileMutation.isPending ? "…" : "Cargar"}
                  </Button>
                </div>
              </div>
            </section>
            {auth.user?.role === "admin" ? (
              <section className="border border-cyan-200/20 bg-cyan-200/5 p-5">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-100">
                  Permisos Controller Lab
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  ADMIN puede asignar roles de presentación, sin otorgar acceso
                  al núcleo protegido.
                </p>
                <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
                  <input
                    value={assignUserId}
                    onChange={event =>
                      setAssignUserId(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="ID usuario"
                    inputMode="numeric"
                    className="min-w-0 border border-white/15 bg-black/20 px-2 py-2 text-xs text-white"
                  />
                  <select
                    value={assignRole}
                    onChange={event =>
                      setAssignRole(event.target.value as typeof assignRole)
                    }
                    className="border border-white/15 bg-black/20 px-2 text-xs text-white"
                  >
                    <option value="USER">Usuario</option>
                    <option value="PRESENTER">Presentador</option>
                    <option value="OPERATOR">Operador</option>
                  </select>
                  <Button
                    type="button"
                    disabled={!assignUserId || assignRoleMutation.isPending}
                    onClick={() =>
                      void assignRoleMutation.mutateAsync({
                        targetUserId: Number(assignUserId),
                        controllerRole: assignRole,
                      })
                    }
                    className="controller-neon-button bg-cyan-200 px-2 text-xs text-black"
                  >
                    Asignar
                  </Button>
                </div>
              </section>
            ) : null}
            <section className="border border-cyan-200/15 bg-cyan-200/[.04] p-5" aria-labelledby="test-qr-title">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">Pruebas físicas · Experience QR</p>
              <h2 id="test-qr-title" className="mt-1 text-xl font-bold">Generador QR dinámico</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">Crea un enlace temporal para probar la experiencia en otro móvil. Este QR no vincula Controller Lab ni contiene autoridad de juego.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <label className="text-xs text-slate-300">Tipo
                  <select value={testQrType} onChange={event => setTestQrType(event.target.value as "experience" | "point")} className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"><option value="experience">Experience QR</option><option value="point">LukitaPoint · prueba</option></select>
                </label>
                <label className="text-xs text-slate-300">Duración (minutos)
                  <input type="number" min="1" max="30" value={testQrExpiryMinutes} onChange={event => setTestQrExpiryMinutes(Math.min(30, Math.max(1, Number(event.target.value) || 1)))} className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white" />
                </label>
              </div>
              <label className="mt-3 block text-xs text-slate-300">Etiqueta de prueba
                <input value={testQrLabel} onChange={event => setTestQrLabel(event.target.value)} maxLength={48} className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white" />
              </label>
              <Button type="button" onClick={() => void generateDynamicTestQr()} className="mt-4 w-full bg-cyan-200 text-[#06120e] hover:bg-cyan-100">Generar QR dinámico</Button>
              {testQrDataUrl ? <div className="mt-4 grid place-items-center border border-cyan-200/20 bg-white p-3"><img src={testQrDataUrl} alt="QR dinámico de prueba de Experience QR" className="h-44 w-44 object-contain" /><a href={testQrDataUrl} download="milukita-experience-qr-test.png" className="mt-2 text-xs font-bold text-[#06120e] underline">Descargar QR de prueba</a></div> : null}
              {testQrStatus ? <p className="mt-3 text-xs text-cyan-100" role="status">{testQrStatus}</p> : null}
            </section>
            <section className="border border-amber-200/15 bg-amber-200/[.04] p-5" aria-labelledby="point-review-title">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-200">LukitaPoint · revisión</p>
              <h2 id="point-review-title" className="mt-1 text-xl font-bold">Borrador de publicación</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">Prepara un punto espacial sin publicarlo. El estado local solo simula el envío a revisión y exige privacidad explícita.</p>
              <label className="mt-4 block text-xs text-slate-300">Nombre del punto
                <input value={pointName} onChange={event => setPointName(event.target.value)} className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white" />
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2"><label className="text-xs text-slate-300">Privacidad<select value={pointPrivacy} onChange={event => setPointPrivacy(event.target.value as "PRIVATE" | "UNLISTED" | "PUBLIC")} className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"><option value="PRIVATE">Privado</option><option value="UNLISTED">No listado</option><option value="PUBLIC">Público · requiere aprobación</option></select></label><label className="text-xs text-slate-300">Estado<input value={pointVisibility} readOnly className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-slate-400" /></label></div>
              <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-300"><input type="checkbox" checked={pointConsent} onChange={event => setPointConsent(event.target.checked)} className="mt-1" />Confirmo que este es un borrador privado y que la activación requiere aprobación humana.</label>
              <Button type="button" onClick={savePointReview} className="mt-4 w-full border border-amber-200/30 bg-transparent text-amber-100 hover:bg-amber-200/10">Enviar a revisión</Button>
              {pointStatus ? <p className="mt-3 text-xs text-amber-100" role="status">{pointStatus}</p> : null}
            </section>
            <section className="border border-emerald-200/15 bg-emerald-200/[.04] p-5" aria-labelledby="compliance-agent-report-title">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Compliance OS · solo lectura</p>
              <h2 id="compliance-agent-report-title" className="mt-1 text-xl font-bold">Estado de agentes y gates humanos</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">Identifica qué capacidades requieren validación humana. El reporte es local, visual y no certifica operación productiva.</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4"><div className="border border-emerald-200/20 bg-emerald-200/5 p-3"><span className="block text-slate-400">Implementados</span><strong className="text-emerald-100">{AGENT_AUTONOMY_BACKLOG.filter(item => item.currentState === "IMPLEMENTED").length}</strong></div><div className="border border-amber-200/20 bg-amber-200/5 p-3"><span className="block text-slate-400">Parciales</span><strong className="text-amber-100">{AGENT_AUTONOMY_BACKLOG.filter(item => item.currentState === "PARTIAL").length}</strong></div><div className="border border-cyan-200/20 bg-cyan-200/5 p-3"><span className="block text-slate-400">Preparados</span><strong className="text-cyan-100">{AGENT_AUTONOMY_BACKLOG.filter(item => item.currentState === "PREPARED").length}</strong></div><div className="border border-violet-200/20 bg-violet-200/5 p-3"><span className="block text-slate-400">Gates humanos</span><strong className="text-violet-100">{AGENT_AUTONOMY_BACKLOG.filter(item => item.humanGates.length > 0).length}</strong></div></div>
              <Button type="button" onClick={downloadAgentStatusVisualReport} className="mt-4 w-full border border-emerald-200/30 bg-emerald-200/10 text-emerald-100 hover:bg-emerald-200/20"><Download className="mr-2 h-4 w-4" /> Exportar reporte visual SVG</Button>
            </section>
            <section className="border border-fuchsia-200/15 bg-fuchsia-200/[.04] p-5" aria-labelledby="foundation-preview-title">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-fuchsia-200">Character Foundation · validación</p>
              <h2 id="foundation-preview-title" className="mt-1 text-xl font-bold">Vista previa de anchors</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">Revisión visual del concepto antes del GLB definitivo. Esta vista no aprueba ni publica el personaje.</p>
              <div className="mt-4 flex flex-wrap gap-2">{(["front", "three-quarter", "side"] as const).map(view => <button key={view} type="button" onClick={() => setFoundationView(view)} className={`border px-3 py-2 text-xs ${foundationView === view ? "border-fuchsia-200 bg-fuchsia-200/15 text-fuchsia-100" : "border-white/15 text-slate-400"}`}>{view === "front" ? "Frontal" : view === "three-quarter" ? "Tres cuartos" : "Lateral"}</button>)}</div>
              <div className="relative mt-4 grid min-h-[240px] place-items-center border border-fuchsia-200/20 bg-[#071018] p-3"><img src="/manus-storage/lukita-character-foundation-reference_0f52a9ed.png" alt={`Referencia visual de Lukita · vista ${foundationView}`} className="h-64 w-full object-contain object-top" /><span className="absolute bottom-2 left-2 border border-fuchsia-200/30 bg-[#071018]/90 px-2 py-1 text-[10px] text-fuchsia-100">Referencia conceptual · no asset final</span></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">{([ ["face", "Rostro adulto"], ["hair", "Cabello y silueta"], ["star", "Estrella dorada"], ["silhouette", "Proporción"], ["palette", "Paleta maestra"] ] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={foundationAnchors[key]} onChange={event => setFoundationAnchors(current => ({ ...current, [key]: event.target.checked }))} />{label}</label>)}</div>
              <p className="mt-3 text-xs text-fuchsia-100" role="status">Anchors validados: {Object.values(foundationAnchors).filter(Boolean).length}/5 · aprobación humana pendiente.</p>
            </section>
          </aside>
        </div>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-500">
          <span>
            <Play className="mr-1 inline h-3.5 w-3.5" />
            Modo laboratorio · comandos limitados y auditables
          </span>
          <span>MJP CORE permanece protegido</span>
        </footer>
      </div>
    </main>
  );
}

function RemotePad({
  color,
  layout,
  onAction,
}: {
  color: string;
  layout: Profile["layout"];
  onAction: (action: GestureAction, payload?: Record<string, string>) => void;
}) {
  return (
    <div className="mt-5 space-y-4" aria-label="Game Pad horizontal">
      <div className="flex items-center justify-between border border-white/10 bg-black/20 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[.2em]" style={{ color }}>GAME PAD · HORIZONTAL</span>
        <span className="text-[10px] text-slate-400">8 × 18 cm · maqueta apaisada</span>
      </div>
      <section className="prism-zone p-4">
        <p className="prism-zone-label mb-3">Teclas y símbolos</p>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {GAMEPAD_TOP_KEYS.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => onAction("text", { key })}
              className="controller-neon-button prism-control min-h-12 text-sm font-bold text-white sm:min-h-14"
              aria-label={`Tecla de presentación ${key}`}
            >
              {key}
            </button>
          ))}
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-[1.05fr_1.2fr_.9fr]">
        <section className="prism-zone p-3">
          <p className="prism-zone-label">Navegar</p>
          <DirectionalPad color={color} layout={layout} onAction={onAction} />
        </section>
        <PrismSceneActions color={color} onAction={onAction} />
        <FocusDisc color={color} onAction={onAction} />
      </div>
    </div>
  );
}
function PrismSceneActions({
  color,
  onAction,
}: {
  color: string;
  onAction: (action: GestureAction) => void;
}) {
  return (
    <section className="prism-zone flex min-h-[194px] flex-col justify-between p-3">
      <p className="prism-zone-label">Escena</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="grid gap-1">
          <button
            type="button"
            onClick={() => onAction("volume-down")}
            className="controller-neon-button prism-control-muted min-h-10 text-[9px] font-bold text-white"
            aria-label="Volumen menos"
          >
            VOL −
          </button>
          <button
            type="button"
            onClick={() => onAction("volume-up")}
            className="controller-neon-button prism-control-muted min-h-10 text-[9px] font-bold text-white"
            aria-label="Volumen más"
          >
            VOL +
          </button>
        </div>
        <div className="grid gap-1">
          <button
            type="button"
            onClick={() => onAction("back")}
            className="controller-neon-button prism-control min-h-10 text-white"
            aria-label="Retroceder"
          >
            <Undo2 className="mx-auto h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onAction("exit")}
            className="controller-neon-button prism-control-muted min-h-10 text-[9px] font-bold text-white"
          >
            EXIT
          </button>
        </div>
        <div className="grid gap-1">
          <button
            type="button"
            onClick={() => onAction("channel-down")}
            className="controller-neon-button prism-control-muted min-h-10 text-[9px] font-bold text-white"
            aria-label="Canal menos"
          >
            CH −
          </button>
          <button
            type="button"
            onClick={() => onAction("channel-up")}
            className="controller-neon-button prism-control-muted min-h-10 text-[9px] font-bold text-white"
            aria-label="Canal más"
          >
            CH +
          </button>
        </div>
      </div>
      <p className="text-[9px] leading-4 text-slate-500">
        Acciones de presentación, no de hardware ni de juego.
      </p>
    </section>
  );
}
function FocusDisc({
  color,
  onAction,
}: {
  color: string;
  onAction: (action: GestureAction) => void;
}) {
  return (
    <section className="prism-zone flex min-h-[230px] flex-col p-4">
      <p className="prism-zone-label">Foco</p>
      <div className="mt-2 flex flex-1 items-center justify-center">
        <div className="prism-focus-disc grid h-44 w-44 place-items-center rounded-full border border-white/10">
          <button
            type="button"
            onClick={() => onAction("select")}
            className="controller-neon-button z-[1] grid h-24 w-24 place-items-center rounded-full border text-xl font-black text-black"
            style={{
              borderColor: color,
              backgroundColor: color,
              boxShadow: `0 0 22px ${color}99`,
            }}
            aria-label="Confirmar foco"
          >
            OK
          </button>
        </div>
      </div>
    </section>
  );
}
function PresentationToolbar({
  color,
  signalColor,
  signalLabel,
  mode,
  locked,
  onAction,
  onMode,
  vibrationEnabled,
  onToggleVibration,
  onFeedback,
  toolbarOrder,
  onToolbarOrder,
  showActions,
  volume,
  volumeColor,
  muted,
  onToggleMute,
  volumeHideDelay,
}: {
  color: string;
  signalColor: string;
  signalLabel: string;
  mode: ControllerMode;
  locked: boolean;
  onAction: (action: GestureAction) => void;
  onMode: (mode: ControllerMode) => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  onFeedback: (action: GestureAction) => void;
  toolbarOrder: ToolbarIconId[];
  onToolbarOrder: (order: ToolbarIconId[]) => void;
  showActions: boolean;
  volume: number;
  volumeColor: string;
  muted: boolean;
  onToggleMute: () => void;
  volumeHideDelay: number;
}) {
  const [volumeVisible, setVolumeVisible] = useState(true);
  useEffect(() => {
    setVolumeVisible(true);
    const timer = window.setTimeout(
      () => setVolumeVisible(false),
      volumeHideDelay * 1000
    );
    return () => window.clearTimeout(timer);
  }, [volume, muted, volumeHideDelay]);
  const press = (action: GestureAction) => {
    if (
      vibrationEnabled &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    )
      navigator.vibrate?.(18);
    onAction(action);
  };
  const changeMode = (nextMode: ControllerMode) => onMode(nextMode);
  const toolbarButtons = [
    {
      id: "back" as ToolbarIconId,
      action: "back" as GestureAction,
      label: "Atrás",
      Icon: Undo2,
    },
    {
      id: "home" as ToolbarIconId,
      action: "home" as GestureAction,
      label: "Inicio",
      Icon: Home,
    },
    {
      id: "exit" as ToolbarIconId,
      action: "exit" as GestureAction,
      label: "Salir",
      Icon: LogOut,
    },
    {
      id: "rewind" as ToolbarIconId,
      action: "back" as GestureAction,
      label: "Retroceder",
      Icon: RotateCcw,
    },
  ];
  const moveToolbarIcon = (id: ToolbarIconId, direction: -1 | 1) => {
    const index = toolbarOrder.indexOf(id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= toolbarOrder.length) return;
    const nextOrder = [...toolbarOrder];
    [nextOrder[index], nextOrder[nextIndex]] = [
      nextOrder[nextIndex],
      nextOrder[index],
    ];
    onToolbarOrder(nextOrder);
    onFeedback("tap");
    if (
      vibrationEnabled &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    )
      navigator.vibrate?.(12);
  };
  return (
    <div
      className="mt-3 border border-white/15 bg-white/[.06] py-2 shadow-xl shadow-black/20 backdrop-blur-lg supports-[backdrop-filter]:bg-white/[.04]"
      aria-label="Controles superiores de presentación"
    >
      {showActions ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {toolbarOrder.map(id => {
            const item = toolbarButtons.find(button => button.id === id);
            if (!item) return null;
            const Icon = item.Icon;
            return (
              <button
                key={id}
                type="button"
                disabled={locked}
                onClick={() => press(item.action)}
                className={`controller-neon-button grid min-h-12 place-items-center px-2 disabled:opacity-35 ${item.id === "home" ? "text-black" : "prism-control-muted text-white"}`}
                style={
                  item.id === "home"
                    ? { borderColor: color, backgroundColor: color }
                    : undefined
                }
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
          <button
            type="button"
            disabled={locked}
            onClick={() => press("volume-down")}
            className="controller-neon-button prism-control-muted grid min-h-12 place-items-center px-2 text-white disabled:opacity-35"
            aria-label="Bajar volumen"
            title="Bajar volumen"
          >
            <Volume1 className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={() => press("volume-up")}
            className="controller-neon-button prism-control-muted grid min-h-12 place-items-center px-2 text-white disabled:opacity-35"
            aria-label="Subir volumen"
            title="Subir volumen"
          >
            <Volume2 className="h-5 w-5" />
          </button>
          <div
            className={`col-span-2 flex min-h-10 items-center gap-2 border border-white/10 bg-black/20 px-2 transition-opacity duration-300 sm:col-span-1 ${volumeVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-label={`Volumen actual: ${muted ? "silenciado" : `${volume}%`}`}
          >
            <button
              type="button"
              onClick={() => {
                onToggleMute();
                onFeedback("tap");
              }}
              className="controller-neon-button grid h-9 w-9 place-items-center text-white"
              aria-label={muted ? "Activar sonido" : "Silenciar volumen"}
              title={muted ? "Activar sonido" : "Silenciar volumen"}
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-[width] duration-200"
                style={{
                  width: `${muted ? 0 : volume}%`,
                  backgroundColor: volumeColor,
                }}
              />
            </div>
            <span
              className="w-8 text-right text-[10px] font-bold"
              style={{ color: volumeColor }}
            >
              {muted ? "OFF" : `${volume}%`}
            </span>
          </div>
        </div>
      ) : null}
      <span
        className="grid min-h-12 place-items-center gap-0.5 border px-2 text-center text-[9px] font-bold leading-3"
        style={{ borderColor: `${signalColor}88`, color: signalColor }}
        aria-label={`Intensidad de señal: ${signalLabel}`}
      >
        <Wifi className="h-4 w-4" />
        {signalLabel}
      </span>
      <div
        className={`${showActions ? "mt-2" : "mt-0"} grid gap-2 sm:grid-cols-[1fr_auto]`}
      >
        <label className="flex min-h-11 items-center gap-2 border border-white/10 bg-white/[.03] px-3 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
          Acceso rápido
          <select
            value={mode}
            onChange={event => changeMode(event.target.value as ControllerMode)}
            className="min-h-9 flex-1 border border-white/15 bg-black/40 px-2 text-xs font-bold normal-case tracking-normal text-white outline-none focus:border-white/50"
            aria-label="Cambiar modo rápidamente"
          >
            {MODE_CONFIG.map(item => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <span
            className="prism-active-mode hidden items-center gap-1 text-[9px] font-bold uppercase tracking-[.1em] sm:flex"
            style={{ color }}
            aria-live="polite"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            Activo
          </span>
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={vibrationEnabled}
          onClick={onToggleVibration}
          className={`controller-neon-button flex min-h-11 items-center justify-center gap-2 border px-3 text-[10px] font-bold uppercase tracking-[.1em] ${vibrationEnabled ? "text-black" : "bg-white/[.03] text-slate-300"}`}
          style={
            vibrationEnabled
              ? { borderColor: color, backgroundColor: color }
              : { borderColor: `${color}55` }
          }
          aria-label={
            vibrationEnabled ? "Desactivar vibración" : "Activar vibración"
          }
          title={
            vibrationEnabled ? "Desactivar vibración" : "Activar vibración"
          }
        >
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Vibración</span>
        </button>
      </div>
      <div
        className="mt-2 flex flex-wrap items-center gap-1 border border-white/10 bg-white/[.02] px-2 py-1.5"
        aria-label="Orden de iconos superiores"
      >
        <span className="mr-1 text-[9px] font-bold uppercase tracking-[.1em] text-slate-500">
          Orden
        </span>
        {toolbarOrder.map((id, index) => {
          const item = toolbarButtons.find(button => button.id === id);
          if (!item) return null;
          const Icon = item.Icon;
          return (
            <span key={id} className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => moveToolbarIcon(id, -1)}
                disabled={index === 0}
                className="controller-neon-button grid h-6 w-5 place-items-center text-slate-500 disabled:opacity-25"
                aria-label={`Mover ${item.label} a la izquierda`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => moveToolbarIcon(id, 1)}
                disabled={index === toolbarOrder.length - 1}
                className="controller-neon-button grid h-6 w-5 place-items-center text-slate-500 disabled:opacity-25"
                aria-label={`Mover ${item.label} a la derecha`}
              >
                ›
              </button>
              <span
                className="grid h-7 w-7 place-items-center border text-slate-300"
                style={{ borderColor: `${color}55` }}
                title={item.label}
                aria-label={item.label}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
function DirectionalPad({
  color,
  layout,
  onAction,
}: {
  color: string;
  layout: Profile["layout"];
  onAction: (action: GestureAction) => void;
}) {
  return (
    <div
      className={`mt-3 grid grid-cols-3 ${layout === "spacious" ? "gap-2" : "gap-1.5"}`}
    >
      <span />
      <PadButton action="up" onAction={onAction} color={color} layout={layout}>
        <ArrowUp />
      </PadButton>
      <span />
      <PadButton
        action="left"
        onAction={onAction}
        color={color}
        layout={layout}
      >
        <ArrowLeft />
      </PadButton>
      <span aria-hidden="true" />
      <PadButton
        action="right"
        onAction={onAction}
        color={color}
        layout={layout}
      >
        <ArrowRight />
      </PadButton>
      <span />
      <PadButton
        action="down"
        onAction={onAction}
        color={color}
        layout={layout}
      >
        <ArrowDown />
      </PadButton>
      <span />
    </div>
  );
}
function TouchSurface({
  color,
  onGesture,
  compact = false,
  className = "",
  style,
  sensitivity = 7,
  traceColor = color,
  traceWidth = 3,
  pointerColor = "#facc15",
  pointerSize = "medium",
  trailEnabled = true,
  trailDuration = 420,
  onHaptic,
}: {
  color: string;
  onGesture: (action: GestureAction) => void;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
  sensitivity?: number;
  traceColor?: string;
  traceWidth?: number;
  pointerColor?: string;
  pointerSize?: PointerStarSize;
  trailEnabled?: boolean;
  trailDuration?: number;
  onHaptic?: (kind: "double-tap" | "swipe") => void;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef<number | null>(null);
  const twoFingerOrigin = useRef<{ x: number; y: number } | null>(null);
  const lastMultiScroll = useRef<GestureAction | null>(null);
  const lastPinchAction = useRef<GestureAction | null>(null);
  const [contact, setContact] = useState<{ x: number; y: number } | null>(null);
  const [contacts, setContacts] = useState<Array<{ x: number; y: number }>>([]);
  const [contactTrails, setContactTrails] = useState<
    Record<number, Array<{ x: number; y: number }>>
  >({});
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);
  const [burstPoint, setBurstPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const contactTimer = useRef<number | null>(null);
  const burstTimer = useRef<number | null>(null);
  const lastTapAt = useRef(0);
  const gestureStartedAt = useRef(0);
  function recordContact(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: Math.max(
        0,
        Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)
      ),
      y: Math.max(
        0,
        Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)
      ),
    };
    setContact(point);
    if (trailEnabled) setTrail(current => [...current, point].slice(-8));
  }
  function syncContacts(element: HTMLDivElement) {
    const rect = element.getBoundingClientRect();
    const points = Array.from(pointers.current.entries()).map(
      ([id, point]) => ({
        id,
        value: {
          x: Math.max(
            0,
            Math.min(100, ((point.x - rect.left) / rect.width) * 100)
          ),
          y: Math.max(
            0,
            Math.min(100, ((point.y - rect.top) / rect.height) * 100)
          ),
        },
      })
    );
    setContacts(points.map(point => point.value));
    if (trailEnabled) {
      setContactTrails(current =>
        Object.fromEntries(
          points.map(point => [
            point.id,
            [...(current[point.id] ?? []), point.value].slice(-8),
          ])
        )
      );
    }
  }
  function clearContactSoon() {
    if (contactTimer.current) window.clearTimeout(contactTimer.current);
    contactTimer.current = window.setTimeout(
      () => {
        setContact(null);
        setTrail([]);
      },
      trailEnabled ? trailDuration : 120
    );
  }
  function down(event: PointerEvent<HTMLDivElement>) {
    gestureStartedAt.current = Date.now();
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    syncContacts(event.currentTarget);
    if (pointers.current.size === 1)
      start.current = { x: event.clientX, y: event.clientY };
    if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      pinchDistance.current = Math.hypot(
        second.x - first.x,
        second.y - first.y
      );
      twoFingerOrigin.current = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
      };
      lastMultiScroll.current = null;
      lastPinchAction.current = null;
      start.current = null;
    }
    recordContact(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    syncContacts(event.currentTarget);
    if (pointers.current.size >= 2) {
      const [first, second] = Array.from(pointers.current.values());
      const averageX = (first.x + second.x) / 2;
      const averageY = (first.y + second.y) / 2;
      const origin = twoFingerOrigin.current ?? { x: averageX, y: averageY };
      const averageDeltaY = averageY - origin.y;
      if (Math.abs(averageDeltaY) >= 18) {
        const action: GestureAction =
          averageDeltaY > 0 ? "scroll-down" : "scroll-up";
        if (lastMultiScroll.current !== action) {
          onHaptic?.("swipe");
          onGesture(action);
          lastMultiScroll.current = action;
        }
        twoFingerOrigin.current = { x: averageX, y: averageY };
      }
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const previous = pinchDistance.current ?? distance;
      const delta = distance - previous;
      if (Math.abs(delta) >= 12) {
        const action: GestureAction = delta > 0 ? "scroll-up" : "scroll-down";
        if (lastPinchAction.current !== action) {
          onHaptic?.("swipe");
          onGesture(action);
          lastPinchAction.current = action;
        }
        pinchDistance.current = distance;
      }
      const average = {
        clientX: (first.x + second.x) / 2,
        clientY: (first.y + second.y) / 2,
      } as PointerEvent<HTMLDivElement>;
      recordContact(average);
      return;
    }
    recordContact(event);
  }
  function up(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    syncContacts(event.currentTarget);
    if (!start.current) return;
    recordContact(event);
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));
    const duration = Date.now() - gestureStartedAt.current;
    start.current = null;
    pinchDistance.current = null;
    twoFingerOrigin.current = null;
    lastMultiScroll.current = null;
    lastPinchAction.current = null;
    clearContactSoon();
    const gestureThreshold = Math.max(
      4,
      Math.round(18 - (sensitivity ?? 7) * 1.5)
    );
    if (distance < gestureThreshold) {
      const rect = event.currentTarget.getBoundingClientRect();
      setBurstPoint({
        x: Math.max(
          0,
          Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)
        ),
        y: Math.max(
          0,
          Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)
        ),
      });
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBurstPoint(null), 520);
      const now = Date.now();
      const doubleTap = now - lastTapAt.current < 280;
      lastTapAt.current = now;
      if (doubleTap) onHaptic?.("double-tap");
      onGesture(doubleTap ? "select" : "tap");
      return;
    }
    if (distance >= 80 && duration <= 260) onHaptic?.("swipe");
    if (Math.abs(dx) > Math.abs(dy)) onGesture(dx > 0 ? "right" : "left");
    else onGesture(dy > 0 ? "scroll-down" : "scroll-up");
  }
  return (
    <div
      className={`prism-track-surface relative border ${compact ? "min-h-[184px] p-2" : "mt-5 min-h-[230px] p-4 sm:min-h-[300px]"} ${className}`}
      style={{ borderColor: `${color}66`, touchAction: "none", ...style }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => {
        pointers.current.clear();
        setContacts([]);
        start.current = null;
        pinchDistance.current = null;
        lastPinchAction.current = null;
        clearContactSoon();
      }}
      onWheel={event =>
        onGesture(event.deltaY > 0 ? "scroll-down" : "scroll-up")
      }
      aria-label={
        compact
          ? "Puntero sensible del teclado: desliza, desplaza o toca para seleccionar"
          : "Superficie táctil: desliza, desplaza o toca para seleccionar"
      }
    >
      <div className="relative z-[1] flex items-center justify-between text-[10px] uppercase tracking-[.16em] text-slate-500">
        <span>{compact ? "Puntero sensible" : "Prism Track Pad"}</span>
        <span style={{ color }}>Toca · 2 dedos · pellizca</span>
      </div>
      <div
        className={`relative z-[1] mt-4 grid place-items-center border border-white/5 ${compact ? "min-h-[96px] flex-1" : "h-36 sm:h-48"}`}
        aria-hidden="true"
      >
        {trailEnabled
          ? trail.map((point, index) => (
              <span
                key={`${point.x}-${point.y}-${index}`}
                className="pointer-events-none absolute select-none leading-none"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  color: pointerColor,
                  fontSize: `${Math.max(8, traceWidth * 4)}px`,
                  opacity: 0.18 + index * 0.08,
                  transform: "translate(-50%, -50%)",
                }}
                aria-hidden="true"
              >
                ★
              </span>
            ))
          : null}
        {trailEnabled &&
          Object.entries(contactTrails).map(([id, points]) =>
            points.map((point, index) => (
              <span
                key={`multi-${id}-${index}`}
                className="pointer-events-none absolute select-none leading-none"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  color: pointerColor,
                  fontSize: `${Math.max(8, traceWidth * 4)}px`,
                  opacity: 0.2 + index * 0.07,
                  transform: "translate(-50%, -50%)",
                }}
                aria-hidden="true"
              >
                ★
              </span>
            ))
          )}
        {contacts.map((point, index) => (
          <span
            key={`contact-${index}`}
            className="pointer-events-none absolute rounded-full border-2 opacity-90"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              borderColor: traceColor,
              boxShadow: `0 0 14px ${traceColor}`,
              width: `${traceWidth * 4 + 8}px`,
              height: `${traceWidth * 4 + 8}px`,
              transform: "translate(-50%, -50%)",
            }}
            aria-label={`Punto de contacto ${index + 1}`}
          />
        ))}
        {contact && contacts.length === 0 ? (
          <span
            className="pointer-events-none absolute rounded-full border-2 opacity-90"
            style={{
              left: `${contact.x}%`,
              top: `${contact.y}%`,
              borderColor: traceColor,
              boxShadow: `0 0 14px ${traceColor}`,
              width: `${traceWidth * 4 + 8}px`,
              height: `${traceWidth * 4 + 8}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : null}
        {contacts.map((point, index) => (
          <Star
            key={`pointer-${index}`}
            className={`${pointerSize === "large" ? "h-10 w-10" : pointerSize === "small" ? "h-5 w-5" : "h-7 w-7"} pointer-events-none drop-shadow-[0_0_8px_rgba(250,204,21,.95)]`}
            style={{
              color: pointerColor,
              position: "absolute",
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            aria-label={`Puntero Lukita Star Trail ${index + 1}`}
          />
        ))}
        {burstPoint
          ? Array.from({ length: 8 }, (_, index) => (
              <span
                key={`burst-${index}`}
                className="star-trail-burst pointer-events-none absolute"
                style={{
                  left: `${burstPoint.x}%`,
                  top: `${burstPoint.y}%`,
                  color: pointerColor,
                  ["--burst-angle" as string]: `${index * 45}deg`,
                }}
                aria-hidden="true"
              >
                ✦
              </span>
            ))
          : null}
        <Star
          className={`${pointerSize === "large" ? "h-10 w-10" : pointerSize === "small" ? "h-5 w-5" : "h-7 w-7"} pointer-events-none drop-shadow-[0_0_8px_rgba(250,204,21,.95)]`}
          style={{
            color: pointerColor,
            position: "absolute",
            left: `${contact?.x ?? 50}%`,
            top: `${contact?.y ?? 50}%`,
            transform: "translate(-50%, -50%)",
          }}
          aria-label="Puntero Lukita Star Trail"
        />
      </div>
      <div className="relative z-[1] mt-3 flex items-center justify-between text-[9px] uppercase tracking-[.14em] text-slate-500">
        <span>Bordes seguros</span>
        <span>Toque breve: seleccionar</span>
      </div>
    </div>
  );
}
function MiniKeyboard({
  value,
  color,
  trackpadPercent,
  horizontal,
  onKey,
  onAction,
  onTrackpad,
  sensitivity,
  traceColor,
  traceWidth,
  pointerColor,
  pointerSize,
  onHaptic,
}: {
  value: string;
  color: string;
  trackpadPercent: number;
  horizontal: boolean;
  onKey: (key: string) => void;
  onAction: (action: "backspace" | "space" | "enter" | "clear") => void;
  onTrackpad: (action: GestureAction) => void;
  sensitivity: number;
  traceColor: string;
  traceWidth: number;
  pointerColor?: string;
  pointerSize?: PointerStarSize;
  trailEnabled?: boolean;
  trailDuration?: number;
  onHaptic?: (kind: "double-tap" | "swipe") => void;
}) {
  return (
    <div
      className={`mt-5 flex gap-3 ${horizontal ? "flex-row" : "flex-col"}`}
      aria-label={
        horizontal
          ? "Mini teclado y puntero en horizontal"
          : "Mini teclado y puntero en vertical"
      }
    >
      <div
        className="prism-zone p-2"
        style={horizontal ? { width: `${100 - trackpadPercent}%` } : undefined}
      >
        <p className="prism-zone-label mb-2">Escritura</p>
        <div
          className="min-h-10 border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-200"
          aria-live="polite"
        >
          {value || "Escribe en la TV…"}
        </div>
        {KEYBOARD_ROWS.map((row, index) => (
          <div key={index} className="grid grid-cols-10 gap-1">
            {row.map(key => (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                className="controller-neon-button prism-control h-7 text-[9px] font-bold text-white"
                aria-label={`Tecla ${key}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => onAction("space")}
            className="controller-neon-button prism-control col-span-2 h-7 text-[9px] font-bold text-white"
          >
            Espacio
          </button>
          <button
            type="button"
            onClick={() => onAction("backspace")}
            className="controller-neon-button prism-control flex h-7 items-center justify-center text-white"
            aria-label="Borrar última tecla"
          >
            <Delete className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAction("enter")}
            className="controller-neon-button flex h-7 items-center justify-center border text-[9px] font-bold text-black"
            style={{ backgroundColor: color, borderColor: color }}
            aria-label="Entrar o enviar"
          >
            Enter
          </button>
        </div>
      </div>
      <TouchSurface
        color={color}
        onGesture={onTrackpad}
        sensitivity={sensitivity}
        traceColor={traceColor}
        traceWidth={traceWidth}
        onHaptic={onHaptic}
        compact
        className={horizontal ? "flex-1" : "w-full"}
        style={
          horizontal
            ? { width: `${trackpadPercent}%` }
            : { minHeight: `${Math.round(trackpadPercent * 4.8)}px` }
        }
      />
    </div>
  );
}
type ARStagePadProps = {
  color: string;
  horizontal: boolean;
  locked: boolean;
  sensitivity: number;
  traceColor: string;
  traceWidth: number;
  pointerColor: string;
  pointerSize: PointerStarSize;
  trailEnabled: boolean;
  trailDuration: number;
  volume: number;
  muted: boolean;
  onVolumeChange: (value: number) => void;
  onMute: () => void;
  onFeedback: (action: GestureAction) => void;
  onReset: () => void;
};

type ARContact = { x: number; y: number; id: number; at: number };

function ARStagePad({
  color,
  horizontal,
  locked,
  sensitivity,
  traceColor,
  traceWidth,
  pointerColor,
  pointerSize,
  trailEnabled,
  trailDuration,
  volume,
  muted,
  onVolumeChange,
  onMute,
  onFeedback,
  onReset,
}: ARStagePadProps) {
  const contactsRef = useRef(new Map<number, ARContact>());
  const [contacts, setContacts] = useState<ARContact[]>([]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 50, y: 52 });
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  const [status, setStatus] = useState("Superficie AR lista");
  const [locationActive, setLocationActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"rear" | "front">("rear");
  const pointerSizePx = pointerSize === "large" ? 42 : pointerSize === "small" ? 26 : 34;
  const scalePercent = Math.round(scale * 100);

  function syncContacts() {
    setContacts(Array.from(contactsRef.current.values()));
  }
  function pointFromEvent(event: PointerEvent<HTMLDivElement>): ARContact {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      id: event.pointerId,
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
      at: Date.now(),
    };
  }
  function distanceBetween(points: ARContact[]) {
    return points.length < 2 ? 0 : Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (locked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    contactsRef.current.set(event.pointerId, pointFromEvent(event));
    syncContacts();
    setStatus(contactsRef.current.size > 1 ? "Pellizco activo · redimensiona Lukita" : "Arrastre activo · mueve Lukita");
    const points = Array.from(contactsRef.current.values());
    if (points.length === 2) pinchRef.current = { distance: distanceBetween(points), scale };
  }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (locked || !contactsRef.current.has(event.pointerId)) return;
    const next = pointFromEvent(event);
    contactsRef.current.set(event.pointerId, next);
    const points = Array.from(contactsRef.current.values());
    if (points.length >= 2 && pinchRef.current) {
      const distance = distanceBetween(points);
      const ratio = pinchRef.current.distance ? distance / pinchRef.current.distance : 1;
      const nextScale = Math.max(0.72, Math.min(1.6, pinchRef.current.scale * ratio));
      setScale(nextScale);
      setStatus(`Escala ${Math.round(nextScale * 100)}%`);
    } else if (points.length === 1) {
      setOffset({ x: points[0].x, y: points[0].y });
    }
    syncContacts();
  }
  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    contactsRef.current.delete(event.pointerId);
    if (contactsRef.current.size < 2) pinchRef.current = null;
    syncContacts();
    if (contactsRef.current.size === 0) setStatus("Superficie AR lista");
  }
  function action(label: string, feedback: GestureAction = "select") {
    setStatus(label);
    onFeedback(feedback);
  }
  function toggleLocation() {
    setLocationActive(value => {
      const next = !value;
      setStatus(next ? "Ubicación AR activa · Lukita lista" : "Ubicación pendiente · muestra la guía");
      onFeedback("select");
      return next;
    });
  }
  function toggleCamera() {
    setCameraFacing(value => {
      const next = value === "rear" ? "front" : "rear";
      setStatus(next === "rear" ? "Cámara trasera activa" : "Cámara frontal activa");
      onFeedback("select");
      return next;
    });
  }
  function openARStage() {
    window.location.assign("/lukita-ar-stage");
  }
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3" aria-label="Acciones AR">
        <button type="button" className="ar-action-button" onClick={openARStage}><Sparkles className="h-4 w-4" /> AR Stage</button>
        <button type="button" className={`ar-action-button ${locationActive ? "is-active" : ""}`} onClick={toggleLocation}><Smartphone className="h-4 w-4" /> {locationActive ? "Ubicación activa" : "Activar ubicación"}</button>
        <button type="button" className="ar-action-button" onClick={toggleCamera}><Camera className="h-4 w-4" /> {cameraFacing === "rear" ? "Trasera" : "Frontal"}</button>
        <button type="button" className="ar-action-button" onClick={() => action(locationActive ? "Captura de foto preparada" : "Activa ubicación para capturar")}><Image className="h-4 w-4" /> Foto</button>
        <button type="button" className="ar-action-button" onClick={() => action(locationActive ? "Grabación preparada" : "Activa ubicación para grabar", "playback")}><Video className="h-4 w-4" /> Video</button>
        <button type="button" className="ar-action-button" onClick={() => action(locationActive ? "Compartir requiere revisión" : "Activa ubicación antes de compartir")}><Share2 className="h-4 w-4" /> Compartir</button>
        <button type="button" className="ar-action-button" onClick={onReset}><RotateCcw className="h-4 w-4" /> Reset</button>
      </div>
      <div
        className={`relative touch-none select-none overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_48%,rgba(39,245,208,.16),transparent_38%),linear-gradient(145deg,rgba(7,24,20,.96),rgba(5,11,19,.96))] ${horizontal ? "aspect-[9/4]" : "aspect-[4/9]"}`}
        style={{ minHeight: horizontal ? 210 : 340, borderColor: `${color}88`, boxShadow: `inset 0 0 34px ${color}16, 0 0 22px ${color}22` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="pointer-events-none absolute inset-4 border border-dashed" style={{ borderColor: `${color}45` }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ transform: `translate(-50%, -50%) translate(${offset.x - 50}px, ${offset.y - 50}px) scale(${scale})` }}>
          <div className="mx-auto grid h-28 w-24 place-items-center rounded-[2rem] border border-white/20 bg-white/[.06] text-center shadow-[0_0_32px_rgba(39,245,208,.16)]">
            <div><Sparkles className="mx-auto h-8 w-8" style={{ color: pointerColor }} /><p className="mt-2 text-[10px] font-bold uppercase tracking-[.18em]" style={{ color }}>Lukita AR</p><p className="mt-1 text-[9px] text-slate-400">{locationActive ? "lista para cámara" : "guía de ubicación"}</p></div>
          </div>
        </div>
        {!locationActive && <div className="pointer-events-none absolute inset-x-8 bottom-10 border border-dashed border-amber-300/50 bg-black/25 px-3 py-2 text-center text-[10px] font-semibold text-amber-100">Activa ubicación para colocar a Lukita sobre una superficie y preparar foto, video o compartir.</div>}
        {contacts.map(contact => <span key={contact.id} className="pointer-events-none absolute rounded-full" style={{ left: `${contact.x}%`, top: `${contact.y}%`, width: pointerSizePx, height: pointerSizePx, transform: "translate(-50%, -50%)", border: `${Math.max(2, traceWidth)}px solid ${traceColor}`, boxShadow: trailEnabled ? `0 0 ${Math.max(8, trailDuration / 35)}px ${traceColor}` : undefined }} />)}
        <span className="pointer-events-none absolute bottom-3 left-3 text-[10px] font-semibold text-slate-400">{status} · {scalePercent}% · {cameraFacing === "rear" ? "trasera" : "frontal"} · {horizontal ? "auto horizontal" : "auto vertical"}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
        <label className="flex items-center gap-2">Volumen <input aria-label="Volumen AR" type="range" min="0" max="100" value={muted ? 0 : volume} onChange={event => onVolumeChange(Number(event.target.value))} style={{ accentColor: color }} /></label>
        <button type="button" className="ar-action-button" onClick={onMute}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />} {muted ? "Activar" : "Silenciar"}</button>
        <span>Gestos: arrastrar · pellizcar · Star Trail</span>
      </div>
    </div>
  );
}

function DeviceChrome({
  chrome,
  mode,
  color,
  locked,
  connected,
  socketStatus,
  latencyMs,
  onMode,
  onLock,
  onReturn,
  hideReturnAndConnection = false,
}: {
  chrome: ControllerChrome;
  mode: ControllerMode;
  color: string;
  locked: boolean;
  connected: boolean;
  socketStatus: string;
  latencyMs: number | null;
  onMode: (mode: ControllerMode) => void;
  onLock: () => void;
  onReturn: () => void;
  hideReturnAndConnection?: boolean;
}) {
  const connectionText = !connected
    ? "SIN SESIÓN"
    : socketStatus === "connected"
      ? `WS ${latencyMs === null ? "…" : `${latencyMs} ms`}`
      : "RESPALDO";
  return (
    <>
      <div
        className="absolute left-3 top-3 z-10 flex items-center gap-1.5"
        aria-label="Modos y candado"
      >
        {MODE_CONFIG.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onMode(item.id)}
            className="controller-neon-button grid h-8 w-8 place-items-center rounded-md border"
            style={{
              borderColor: mode === item.id ? "#34d399" : "#94a3b8",
              backgroundColor: mode === item.id ? "#34d399" : "#1f2937",
              color: mode === item.id ? "#06130d" : "#94a3b8",
              boxShadow: mode === item.id ? "0 0 12px #34d39988" : undefined,
            }}
            aria-label={`Cambiar a ${item.label}`}
            aria-pressed={mode === item.id}
            title={`${item.label}: ${item.detail}`}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          onClick={onLock}
          className="controller-neon-button grid h-8 w-8 place-items-center rounded-md border"
          style={{
            borderColor: locked ? "#34d399" : "#94a3b8",
            backgroundColor: locked ? "#34d399" : "#1f2937",
            color: locked ? "#06130d" : "#94a3b8",
            boxShadow: locked ? "0 0 12px #34d39988" : undefined,
          }}
          aria-label={locked ? "Desbloquear controles" : "Bloquear controles"}
          title={locked ? "Desbloquear" : "Bloquear"}
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4" />
          )}
        </button>
      </div>
      {mode === "remote" ? (
        <div
          className="absolute left-3 top-14 z-10 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.12em]"
          style={{ color: connected ? "#34d399" : "#94a3b8" }}
          aria-label={`Estado de encendido y conexión: ${connected ? connectionText : "sin sesión"}`}
        >
          <span className="inline-flex items-center gap-1">
            <Power className="h-3 w-3" />
            {connected ? "ON" : "OFF"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            {connected ? connectionText : "SIN SESIÓN"}
          </span>
        </div>
      ) : null}
      {mode === "remote" ? (
        <Sparkles
          className="absolute right-3 top-3 z-10 h-5 w-5"
          style={{ color: "#34d399" }}
          aria-label="Escena favorita"
        />
      ) : null}
      {!hideReturnAndConnection ? (
        <button
          type="button"
          onClick={onReturn}
          disabled={locked}
          className={`controller-neon-button absolute ${POSITION_CLASS[chrome.returnPosition]} z-10 grid h-7 w-7 place-items-center border disabled:opacity-35`}
          style={{ borderColor: chrome.returnColor, color: chrome.returnColor }}
          aria-label="Regresar"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
      {!hideReturnAndConnection ? (
        <div
          className={`absolute ${POSITION_CLASS[chrome.connectionPosition]} z-10 flex items-center gap-1 text-[8px] font-bold`}
          style={{ color: chrome.connectionColor }}
          aria-label={`Conexión ${connected ? socketStatus : "sin sesión"}${latencyMs === null ? "" : `, ${latencyMs} milisegundos`}`}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: chrome.connectionColor,
              boxShadow: `0 0 7px ${chrome.connectionColor}`,
            }}
          />
          {connected ? (
            socketStatus === "connected" ? (
              <Zap className="h-3 w-3" />
            ) : (
              <Wifi className="h-3 w-3" />
            )
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{connectionText}</span>
        </div>
      ) : null}
    </>
  );
}
function ChromeConfigurator({
  chrome,
  onChange,
}: {
  chrome: ControllerChrome;
  onChange: (next: ControllerChrome) => void;
}) {
  const fields: Array<{ key: keyof ControllerChrome; label: string }> = [
    { key: "modePosition", label: "Modos" },
    { key: "lockPosition", label: "Candado" },
    { key: "returnPosition", label: "Regresar" },
    { key: "connectionPosition", label: "Luz conexión" },
  ];
  return (
    <section className="border border-white/10 bg-black/20 p-5">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
        Posición y color
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Solo este laboratorio cambia los controles de la sesión.
      </p>
      <div className="mt-3 space-y-2">
        {fields.map(field => {
          const colorKey = field.key.replace(
            "Position",
            "Color"
          ) as keyof ControllerChrome;
          return (
            <div
              key={field.key}
              className="grid grid-cols-[96px_1fr_34px] items-center gap-2 text-xs"
            >
              <span>{field.label}</span>
              <select
                value={chrome[field.key]}
                onChange={event =>
                  onChange({
                    ...chrome,
                    [field.key]: event.target.value as ControlPosition,
                  })
                }
                className="border border-white/15 bg-black/20 px-2 py-1.5 text-xs text-white"
              >
                {CHROME_POSITIONS.map(position => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
              <input
                type="color"
                value={chrome[colorKey]}
                onChange={event =>
                  onChange({ ...chrome, [colorKey]: event.target.value })
                }
                className="h-8 w-8 border border-white/15 bg-transparent p-0"
                aria-label={`Color de ${field.label}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
function ProportionPreview({
  presetId,
  onPreset,
  activePreview,
  recommendedPreset,
}: {
  presetId: PreviewPresetId;
  onPreset: (preset: PreviewPresetId) => void;
  activePreview: {
    label: string;
    width: number;
    height: number;
    deviceKind: DeviceKind;
  };
  recommendedPreset: PreviewPresetId;
}) {
  const width = activePreview.width || 390;
  const height = activePreview.height || 844;
  const scale = Math.min(1, 780 / width, 420 / height);
  return (
    <section
      className="controller-mode-stage mt-5 border border-violet-200/30 bg-violet-200/[.06] p-5"
      aria-label="Vista previa por proporción"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-100">
            Simulador de proporción
          </p>
          <h2 className="mt-1 text-xl font-bold">
            Comprueba el reflow antes de guardar
          </h2>
        </div>
        <span className="text-xs text-slate-300">
          {activePreview.label} · {width} × {height}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(PREVIEW_PRESETS).map(([id, preset]) => (
          <button
            type="button"
            key={id}
            onClick={() => onPreset(id as PreviewPresetId)}
            aria-pressed={presetId === id}
            className={`controller-neon-button border px-2 py-1.5 text-[11px] ${presetId === id ? "border-violet-200 bg-violet-200 text-black" : "border-white/15 bg-black/20 text-slate-200"}`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-violet-200/25 bg-black/20 px-3 py-2 text-xs text-violet-50">
        <span>
          Recomendado por la proporción actual:{" "}
          <strong>{PREVIEW_PRESETS[recommendedPreset].label}</strong>
        </span>
        <Button
          type="button"
          onClick={() => onPreset(recommendedPreset)}
          className="controller-neon-button h-8 bg-violet-200 px-3 text-xs text-black"
        >
          Aplicar sugerencia
        </Button>
      </div>
      <div className="mt-4 overflow-auto border border-white/10 bg-black/30 p-3">
        <div
          className="mx-auto"
          style={{ width: `${width * scale}px`, height: `${height * scale}px` }}
        >
          <iframe
            title={`Vista previa ${activePreview.label}`}
            src="/touch-remote?preview=1"
            width={width}
            height={height}
            className="origin-top-left border border-violet-200/45 bg-[#07110e]"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-300">
        Esta es una simulación visual aislada: no crea sesiones ni modifica la
        orientación física ni la resolución del teléfono.
      </p>
    </section>
  );
}
function LatencySparkline({
  points,
}: {
  points: Array<{ value: number; at: number }>;
}) {
  const [hoveredSampleIndex, setHoveredSampleIndex] = useState<number | null>(
    null
  );
  const samples = points.slice(-120);
  if (!samples.length)
    return (
      <p className="mt-3 border-t border-white/10 pt-2 text-[10px] text-slate-400">
        El historial de los últimos minutos aparecerá tras los primeros pings.
      </p>
    );
  const maximum = Math.max(500, ...samples.map(sample => sample.value));
  const polyline = samples
    .map(
      (sample, index) =>
        `${(index / Math.max(1, samples.length - 1)) * 116},${38 - (Math.min(sample.value, maximum) / maximum) * 32}`
    )
    .join(" ");
  const hoveredSample =
    hoveredSampleIndex === null ? null : samples[hoveredSampleIndex];
  return (
    <div className="mt-3 border-t border-white/10 pt-2">
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>
          Tendencia · últimos {Math.ceil((samples.length * 3) / 60)} min
        </span>
        <span>{samples[samples.length - 1].value} ms</span>
      </div>
      <svg
        viewBox="0 0 120 40"
        className="mt-1 h-10 w-full"
        role="img"
        aria-label={`Tendencia de ${samples.length} pings de conexión`}
      >
        <defs>
          <linearGradient
            id="latency-history-gradient"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            {samples.map((sample, index) => (
              <stop
                key={`${sample.at}-${index}`}
                offset={`${(index / Math.max(1, samples.length - 1)) * 100}%`}
                stopColor={latencyGradientColor(sample.value)}
              />
            ))}
          </linearGradient>
        </defs>
        <path d="M2 38H118" stroke="#334155" strokeWidth="1" />
        <polyline
          points={polyline}
          fill="none"
          stroke="url(#latency-history-gradient)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {samples.map((sample, index) => {
          const x = (index / Math.max(1, samples.length - 1)) * 116;
          const y = 38 - (Math.min(sample.value, maximum) / maximum) * 32;
          return (
            <circle
              key={`${sample.at}-${index}`}
              cx={x}
              cy={y}
              r="3"
              fill="transparent"
              tabIndex={0}
              onPointerEnter={() => setHoveredSampleIndex(index)}
              onPointerLeave={() => setHoveredSampleIndex(null)}
              onFocus={() => setHoveredSampleIndex(index)}
              onBlur={() => setHoveredSampleIndex(null)}
            >
              <title>Ping exacto: {sample.value} ms</title>
            </circle>
          );
        })}
      </svg>
      <p className="min-h-4 text-[10px] text-cyan-100" aria-live="polite">
        {hoveredSample
          ? `Pico seleccionado: ${hoveredSample.value} ms`
          : "Pasa sobre un pico para ver el ping exacto."}
      </p>
    </div>
  );
}
function ControllerHelp({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="controller-mode-stage mt-5 border border-cyan-200/25 bg-cyan-200/[.06] p-5"
      aria-label="Ayuda de MiLukita Controller Lab"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-100">
            Guía de uso
          </p>
          <h2 className="mt-1 text-xl font-bold">
            Elige un modo y mantén el control seguro
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-8 px-2 text-cyan-100"
        >
          Cerrar
        </Button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODE_CONFIG.map(item => (
          <div key={item.id} className="border border-white/10 bg-black/20 p-3">
            <p className="font-bold text-white">{item.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-300">
        <strong className="text-cyan-100">Candado:</strong> bloquea cualquier
        acción accidental. <strong className="text-cyan-100">Regresar:</strong>{" "}
        vuelve al paso anterior de presentación.{" "}
        <strong className="text-cyan-100">Luz:</strong> confirma conexión; el
        rayo indica WebSocket activo y la lectura en milisegundos muestra
        latencia. Configura ubicación y color únicamente en esta consola antes
        de usar una sesión.
      </p>
    </section>
  );
}
function ControllerOnboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "1. Crea o abre un vínculo QR solo cuando necesites controlar una pantalla.",
    "2. Alterna entre Game Pad, Track Pad y Mini Teclado según la actividad.",
    "3. Ajusta posición, color y orientación exclusivamente desde este laboratorio.",
    "4. Activa el candado antes de guardar el celular; Regresar e Inicio son comandos de presentación.",
    "5. En Mini Teclado, usa el slider para dar más espacio al puntero derecho.",
  ];
  return (
    <section
      className="controller-mode-stage mt-5 border border-cyan-200/25 bg-cyan-200/[.06] p-5"
      role="dialog"
      aria-modal="false"
      aria-label="Onboarding de 30 segundos"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-100">
            Onboarding · 30 segundos
          </p>
          <h2 className="mt-1 text-xl font-bold">Aprende los cuatro modos</h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-cyan-100"
        >
          Saltar
        </Button>
      </div>
      <p
        className="mt-4 min-h-12 text-sm leading-6 text-slate-200"
        aria-live="polite"
      >
        {steps[step]}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Paso {step + 1} de {steps.length}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!step}
            onClick={() => setStep(value => value - 1)}
            className="controller-neon-button border-white/15 bg-white/5"
          >
            Anterior
          </Button>
          <Button
            type="button"
            onClick={() =>
              step === steps.length - 1
                ? onClose()
                : setStep(value => value + 1)
            }
            className="controller-neon-button bg-cyan-200 text-black"
          >
            {step === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </section>
  );
}
function QrLinkGuide({
  qrDataUrl,
  connected,
  onClose,
}: {
  qrDataUrl?: string;
  connected: boolean;
  onClose: () => void;
}) {
  return (
    <section
      className="controller-mode-stage mt-5 border border-emerald-300/25 bg-emerald-300/[.06] p-5"
      role="status"
      aria-live="polite"
      aria-label="Guía de vinculación QR"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-100">
            Vincula tu celular
          </p>
          <h2 className="mt-1 text-xl font-bold">
            Escanea, confirma y controla
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-8 px-2 text-emerald-100"
        >
          Cerrar
        </Button>
      </div>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[140px_1fr]">
        <div className="grid min-h-[140px] place-items-center border border-white/10 bg-white p-2">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Código QR temporal para vincular MiLukita Controller Lab"
              className="h-32 w-32"
            />
          ) : (
            <Smartphone className="h-8 w-8 text-slate-600" />
          )}
        </div>
        <div>
          <ol className="space-y-2 text-xs leading-5 text-slate-300">
            <li>
              <strong className="text-emerald-100">1.</strong> Abre la cámara de
              tu celular y escanea el código.
            </li>
            <li>
              <strong className="text-emerald-100">2.</strong> Confirma el
              vínculo con tu sesión de MiLukita.
            </li>
            <li>
              <strong className="text-emerald-100">3.</strong> Revisa la luz de
              conexión antes de enviar controles.
            </li>
          </ol>
          <div
            className={`mt-4 flex items-center gap-2 border p-3 text-xs font-bold ${connected ? "controller-link-success border-emerald-300/40 bg-emerald-300/15 text-emerald-50" : "border-white/10 bg-black/20 text-slate-300"}`}
          >
            {connected ? (
              <>
                <Check className="h-4 w-4" />
                Celular vinculado correctamente
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                Esperando vínculo seguro…
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
function PadButton({
  action,
  onAction,
  color,
  layout,
  primary = false,
  children,
}: {
  action: GestureAction;
  onAction: (action: GestureAction) => void;
  color: string;
  layout: Profile["layout"];
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onAction(action)}
      aria-label={`Control táctil: ${action}`}
      className={`controller-neon-button grid place-items-center border text-base focus:outline-none focus:ring-2 focus:ring-white ${layout === "spacious" ? "h-16" : "h-14"} ${primary ? "text-black" : "bg-white/5 text-white"}`}
      style={
        primary
          ? {
              borderColor: color,
              backgroundColor: color,
              boxShadow: `0 0 14px ${color}99`,
            }
          : { borderColor: `${color}55` }
      }
    >
      {children}
    </button>
  );
}
