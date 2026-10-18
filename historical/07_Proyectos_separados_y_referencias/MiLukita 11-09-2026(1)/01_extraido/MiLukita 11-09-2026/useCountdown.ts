import { useEffect, useMemo, useState } from "react";

export function useCountdown(targetDate: Date | string | null | undefined) {
  const targetMs = useMemo(() => {
    if (!targetDate) return 0;
    const value = targetDate instanceof Date ? targetDate.getTime() : Date.parse(targetDate);
    return Number.isFinite(value) ? value : 0;
  }, [targetDate]);
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((targetMs - Date.now()) / 1000)));

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, Math.floor((targetMs - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [targetMs]);

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return { remaining, days, hours, minutes, seconds, isComplete: remaining === 0 };
}

export function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
