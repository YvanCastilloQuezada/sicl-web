import { useEffect, useRef } from "react";

type Options = {
  enabled?: boolean;
  onBack?: () => void;
  onInfo?: () => void;
  soundEnabled?: boolean;
};

const FOCUSABLE = [
  "button:not(:disabled)",
  "a[href]",
  "[role=button]:not([aria-disabled=true])",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function playTvRemoteTone(kind: "move" | "select") {
  if (window.localStorage.getItem("milukita-tv-remote-sound") === "off") return;
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = kind === "select" ? 660 : 420;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(kind === "select" ? 0.035 : 0.018, context.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.075);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.08);
  oscillator.addEventListener("ended", () => void context.close(), { once: true });
}

export function useTvRemoteNavigation({ enabled = true, onBack, onInfo, soundEnabled = true }: Options = {}) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const getItems = () => Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((item) => item.offsetParent !== null);
    const focusNearest = (direction: "left" | "right" | "up" | "down") => {
      const items = getItems();
      const current = document.activeElement as HTMLElement | null;
      if (!current || !items.includes(current)) {
        items[0]?.focus();
        return;
      }
      const currentRect = current.getBoundingClientRect();
      const candidates = items.filter((item) => item !== current).map((item) => {
        const rect = item.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - (currentRect.left + currentRect.width / 2);
        const dy = rect.top + rect.height / 2 - (currentRect.top + currentRect.height / 2);
        const valid = direction === "left" ? dx < -4 : direction === "right" ? dx > 4 : direction === "up" ? dy < -4 : dy > 4;
        return { item, distance: Math.hypot(dx, dy), axis: Math.abs(direction === "left" || direction === "right" ? dx : dy) };
      }).filter(({ item, distance }) => item !== current && distance > 0);
      const directional = candidates.filter(({ item }) => {
        const rect = item.getBoundingClientRect();
        if (direction === "left") return rect.right <= currentRect.left + 8;
        if (direction === "right") return rect.left >= currentRect.right - 8;
        if (direction === "up") return rect.bottom <= currentRect.top + 8;
        return rect.top >= currentRect.bottom - 8;
      });
      (directional.length ? directional : candidates).sort((a, b) => a.distance - b.distance)[0]?.item.focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
        event.preventDefault();
        focusNearest(key.slice(5).toLowerCase() as "left" | "right" | "up" | "down");
        if (soundEnabled) playTvRemoteTone("move");
      } else if (key === "Enter" || key === "OK") {
        if (soundEnabled) playTvRemoteTone("select");
      } else if (key === "Escape" || key === "BrowserBack" || key === "GoBack") {
        event.preventDefault();
        onBack?.();
      } else if (key === "i" || key === "I" || key === "Info") {
        event.preventDefault();
        onInfo?.();
      }
    };
    root?.addEventListener("keydown", onKeyDown);
    return () => root?.removeEventListener("keydown", onKeyDown);
  }, [enabled, onBack, onInfo, soundEnabled]);

  return rootRef;
}

export function setTvRemoteSoundEnabled(enabled: boolean) {
  window.localStorage.setItem("milukita-tv-remote-sound", enabled ? "on" : "off");
}

export function isTvRemoteSoundEnabled() {
  return window.localStorage.getItem("milukita-tv-remote-sound") !== "off";
}
