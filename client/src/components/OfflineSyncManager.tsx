import { useCallback, useEffect, useState } from "react";
import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { flushOfflineQueue, listOfflineQueue, type OfflineQueueItem } from "@/lib/offlineQueue";

type SyncState = "IDLE" | "SYNCING" | "OFFLINE" | "ERROR";

function requestBackgroundSync() {
  if (!("serviceWorker" in navigator)) return;
  void navigator.serviceWorker.ready.then((registration) => {
    const sync = (registration as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } }).sync;
    return sync?.register("arki-offline-sync");
  }).catch(() => undefined);
}

export default function OfflineSyncManager() {
  const createProject = trpc.projects.create.useMutation();
  const saveInitialIntake = trpc.projects.saveInitialIntake.useMutation();
  const [state, setState] = useState<SyncState>(() => typeof navigator !== "undefined" && !navigator.onLine ? "OFFLINE" : "IDLE");
  const [pending, setPending] = useState(0);
  const [message, setMessage] = useState("");

  const handleItem = useCallback(async (item: OfflineQueueItem) => {
    if (item.operation !== "projects.createWithInitialIntake") return;
    const project = item.payload.project as { name: string; location?: string; spatialScale: "PROJECT"; temporalHorizon: "PRESENT" };
    const intake = item.payload.intake as { intent: string; location: string; site: string; dimensions: string; occupants: string; budget: string };
    const created = await createProject.mutateAsync(project);
    await saveInitialIntake.mutateAsync({ projectId: created.projectId, expectedVersion: created.version, ...intake });
  }, [createProject, saveInitialIntake]);

  const flush = useCallback(async () => {
    if (!navigator.onLine) { setState("OFFLINE"); setPending((await listOfflineQueue()).length); return; }
    setState("SYNCING");
    const result = await flushOfflineQueue(handleItem);
    setPending(result.pending);
    if (result.failed > 0) { setState("ERROR"); setMessage(`${result.failed} operación(es) esperan otro intento.`); }
    else { setState("IDLE"); setMessage(result.sent > 0 ? `${result.sent} operación(es) sincronizada(s).` : ""); }
  }, [handleItem]);

  useEffect(() => {
    void flush();
    requestBackgroundSync();
    const onOnline = () => { void flush(); requestBackgroundSync(); };
    const onOffline = () => setState("OFFLINE");
    const onMessage = (event: MessageEvent) => { if (event.data?.type === "ARKI_SYNC_REQUEST") void flush(); };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); navigator.serviceWorker?.removeEventListener("message", onMessage); };
  }, [flush]);

  if (state === "IDLE" && pending === 0 && !message) return null;
  const offline = state === "OFFLINE";
  return <div role="status" aria-live="polite" className={`fixed bottom-4 left-4 z-[70] flex max-w-sm items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-lg ${offline ? "border-amber-400/50 bg-amber-950 text-amber-100" : "border-[#557da5] bg-[#071a30] text-[#edf4ff]"}`}>
    {offline ? <CloudOff className="h-4 w-4 text-amber-300" /> : state === "SYNCING" ? <Loader2 className="h-4 w-4 animate-spin text-[#f0a35b]" /> : <Cloud className="h-4 w-4 text-[#f0a35b]" />}
    <span>{offline ? `Sin conexión · ${pending} pendiente(s)` : state === "SYNCING" ? "Sincronizando…" : message || `${pending} pendiente(s)`}</span>
  </div>;
}
