import { useEffect, useState } from "react";
import { Moon, Radio } from "lucide-react";

const INACTIVITY_MS = 5 * 60 * 1000;

export default function TvScreensaver() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let timer = window.setTimeout(() => setActive(true), INACTIVITY_MS);
    const wake = () => { setActive(false); window.clearTimeout(timer); timer = window.setTimeout(() => setActive(true), INACTIVITY_MS); };
    window.addEventListener("keydown", wake, { passive: true });
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("touchstart", wake, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", wake); window.removeEventListener("pointerdown", wake); window.removeEventListener("touchstart", wake); };
  }, []);
  if (!active) return null;
  return <button type="button" className="tv-screensaver" onClick={() => setActive(false)} aria-label="Reactivar pantalla TV"><span className="tv-screensaver__mark"><Moon className="h-8 w-8" /></span><span className="tv-screensaver__brand"><Radio className="h-5 w-5" /> MiLukita TV</span><span className="tv-screensaver__hint">Presiona cualquier tecla o toca la pantalla para continuar</span></button>;
}
