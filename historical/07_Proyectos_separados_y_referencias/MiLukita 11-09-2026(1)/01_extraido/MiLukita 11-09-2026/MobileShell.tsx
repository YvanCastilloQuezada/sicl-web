import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { QrCode } from "lucide-react";
import { trpc } from "@/lib/trpc";

const EMBLEM_ART = "/manus-storage/luka-emblema-circular-dorado_dcebdf58.png";

type MobileShellProps = { children: ReactNode };

function PersistentNetworkStatus() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return <div className={`fixed right-3 top-3 z-[100] flex items-center gap-2 border px-3 py-2 text-[11px] font-bold uppercase tracking-[.12em] backdrop-blur ${online ? "border-emerald-300/30 bg-emerald-950/80 text-emerald-100" : "border-amber-300/40 bg-amber-950/90 text-amber-100"}`} role="status" aria-live="polite"><span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-300" : "bg-amber-300"}`} />{online ? "Online" : "Offline"}</div>;
}

export default function MobileShell({ children }: MobileShellProps) {
  const [location, navigate] = useLocation();
  const logoHoldRef = useRef<number | null>(null);
  const logoLongPressRef = useRef(false);
  const activeShare = trpc.share.resolveActive.useQuery({}, { enabled: location !== "/luka-context-qr", retry: false, staleTime: 30_000 });

  const openContextQr = () => {
    if (logoLongPressRef.current) return;
    navigate(`/luka-context-qr?return=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`);
  };
  const startLogoHold = () => {
    logoLongPressRef.current = false;
    logoHoldRef.current = window.setTimeout(() => {
      logoLongPressRef.current = true;
      if (typeof navigator.share === "function") {
        void navigator.share({ title: "L★ · MiLukita", text: "Comparte el acceso contextual de MiLukita", url: window.location.href }).catch(() => undefined);
      } else {
        openContextQr();
      }
    }, 650);
  };
  const cancelLogoHold = () => {
    if (logoHoldRef.current !== null) window.clearTimeout(logoHoldRef.current);
    logoHoldRef.current = null;
  };

  useEffect(() => () => cancelLogoHold(), []);

  const showGlobalStar = location !== "/luka-context-qr";
  return <div data-mobile-shell="true" className="min-h-screen">
    <PersistentNetworkStatus />
    {showGlobalStar ? <button type="button" aria-label="L★ · abrir QR contextual" onClick={openContextQr} onPointerDown={startLogoHold} onPointerUp={cancelLogoHold} onPointerCancel={cancelLogoHold} onPointerLeave={cancelLogoHold} className="group fixed left-5 top-5 z-[101] grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-amber-100/60 bg-black/55 p-1 shadow-[0_0_18px_rgba(255,213,102,.22)] backdrop-blur-md transition duration-200 hover:scale-105 hover:border-amber-100 hover:shadow-[0_0_12px_rgba(255,219,119,.7),0_0_32px_rgba(34,240,225,.35)] focus:outline-none focus:ring-2 focus:ring-amber-100">
      <img src={EMBLEM_ART} alt="Emblema circular dorado L★" className="h-full w-full rounded-full object-cover transition duration-200 group-hover:brightness-125" />
      {activeShare.data?.resolution ? <span className="sr-only">Contexto {activeShare.data.resolution}</span> : null}
    </button> : <div className="sr-only"><QrCode aria-hidden="true" /></div>}
    {children}
  </div>;
}
