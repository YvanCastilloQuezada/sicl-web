import { AlertTriangle, Boxes, CheckCircle2, Copy, ExternalLink, FileCode2, FileText, LockKeyhole, Search, ShieldCheck, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";

const ACCEPTED = ".dyn,.dyf,.gh,.ghx,.blend,.ark,.json";
type Manifest = { artifactId: string; fileName: string; format: string; sizeBytes: number; checksum: string; parsed: boolean; declaredDependencies: string[]; capabilities: string[]; hostRequired: string | null; status: string; storageUrl?: string; storageKey?: string; uploadedAt?: string; humanReviewRequired?: boolean };

function normalizeManifest(value: Record<string, unknown>): Manifest {
  const parseArray = (candidate: unknown) => { if (Array.isArray(candidate)) return candidate.filter((item): item is string => typeof item === "string"); if (typeof candidate === "string") { try { return parseArray(JSON.parse(candidate)); } catch { return []; } } return []; };
  return { artifactId: String(value.artifactId), fileName: String(value.fileName), format: String(value.format), sizeBytes: Number(value.sizeBytes), checksum: String(value.checksum), parsed: Boolean(value.parsed), declaredDependencies: parseArray(value.declaredDependencies), capabilities: parseArray(value.capabilities), hostRequired: typeof value.hostRequired === "string" ? value.hostRequired : null, status: String(value.status), storageUrl: typeof value.storageUrl === "string" ? value.storageUrl : undefined, storageKey: typeof value.storageKey === "string" ? value.storageKey : undefined, uploadedAt: value.uploadedAt instanceof Date ? value.uploadedAt.toISOString() : typeof value.uploadedAt === "string" ? value.uploadedAt : undefined, humanReviewRequired: Boolean(value.humanReviewRequired) };
}

const formatLabel: Record<string, string> = { DYN: "Dynamo graph", DYF: "Dynamo custom node", GH: "Grasshopper binary", GHX: "Grasshopper XML", BLEND: "Blender project", ARKI_GRAPH: "ARKI graph", ARK: "ARKI volumetric proposal" };

function statusTone(status: string) {
  if (status === "INSPECTED") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "OPAQUE_HOST_REQUIRED") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-rose-400/30 bg-rose-400/10 text-rose-200";
}

function prettyBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ParametricFilesPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Manifest[]>([]);
  const [projectId, setProjectId] = useState(() => localStorage.getItem("arki-active-project-id") || "UPAO-001");
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<Manifest | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "connected" | "offline">("connecting");
  const [realtimeMessage, setRealtimeMessage] = useState("Esperando eventos gobernados");
  const utils = trpc.useUtils();
  const library = trpc.parametricRuntime.list.useQuery({ projectId }, { enabled: projectId.trim().length >= 3 });
  const hostWorkers = trpc.parametricRuntime.hostWorkers.catalog.useQuery();
  const archive = trpc.parametricRuntime.archive.useMutation({ onSuccess: async () => { await utils.parametricRuntime.list.invalidate({ projectId }); toast.info("Archivo archivado para este proyecto"); } });
  const upload = trpc.parametricRuntime.upload.useMutation({
    onSuccess: (manifest) => { const normalized = normalizeManifest(manifest as unknown as Record<string, unknown>); setFiles((current) => [normalized, ...current.filter((item) => item.artifactId !== normalized.artifactId)]); setSelected(normalized); setProgress(100); void utils.parametricRuntime.list.invalidate({ projectId }); toast.success(`${normalized.fileName} validado y almacenado en ${projectId}`); },
    onError: (error) => { toast.error(error.message || "No se pudo subir el archivo"); setProgress(0); },
    onSettled: () => setUploadingName(null),
  });
  useEffect(() => { localStorage.setItem("arki-active-project-id", projectId); }, [projectId]);
  useEffect(() => { if (library.data) setFiles(library.data.map((item) => normalizeManifest(item as unknown as Record<string, unknown>))); }, [library.data]);
  useEffect(() => {
    if (projectId.trim().length < 3) return;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/parametric`);
    socket.onopen = () => { setRealtimeStatus("connected"); socket.send(JSON.stringify({ type: "subscribe", channel: `project:${projectId}` })); };
    socket.onmessage = (event) => { try { const message = JSON.parse(event.data) as { progress?: number; message?: string; type?: string }; if (typeof message.progress === "number") setProgress(message.progress); if (message.message) setRealtimeMessage(message.message); } catch { setRealtimeMessage("Evento WebSocket no interpretable"); } };
    socket.onerror = () => setRealtimeStatus("offline");
    socket.onclose = () => setRealtimeStatus("offline");
    return () => socket.close();
  }, [projectId]);
  const filtered = useMemo(() => files.filter((file) => `${file.fileName} ${file.format} ${file.status}`.toLowerCase().includes(query.toLowerCase())), [files, query]);

  async function uploadFile(file: File) {
    setUploadingName(file.name); setProgress(12);
    const reader = new FileReader();
    reader.onprogress = (event) => { if (event.lengthComputable) setProgress(Math.max(12, Math.round((event.loaded / event.total) * 55))); };
    reader.onload = () => { setProgress(70); upload.mutate({ projectId, fileName: file.name, mimeType: file.type || "application/octet-stream", dataUrl: String(reader.result) }); };
    reader.onerror = () => { setUploadingName(null); setProgress(0); toast.error("El navegador no pudo leer el archivo"); };
    reader.readAsDataURL(file);
  }

  function acceptFiles(list: FileList | File[]) {
    const candidates = Array.from(list).filter((file) => /\.(dyn|dyf|gh|ghx|blend|ark|json)$/i.test(file.name));
    if (!candidates.length) { toast.error("Usa .dyn, .dyf, .gh, .ghx, .blend, .ark o .json"); return; }
    if (candidates.length > 1) toast.info("Se procesa un archivo por vez para conservar trazabilidad");
    void uploadFile(candidates[0]);
  }

  async function copy(value: string) { await navigator.clipboard.writeText(value); toast.success("Copiado"); }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#081a31] px-4 py-6 text-[#edf4ff] sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#f0a35b]"><Boxes className="h-4 w-4" /> Parametric runtime</div>
            <h1 className="font-serif text-3xl sm:text-4xl">Dynamo · Grasshopper · Blender</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#b8cbe0]">Sube grafos y proyectos, valida su manifiesto antes de ejecutarlos y conserva checksum, dependencias, host requerido y revisión humana. ARKI no ejecuta código arbitrario ni finge que un host externo está disponible.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#294765] bg-[#0d223d] p-3 text-xs text-[#b8cbe0]"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Control gobernado · soft-realtime <span className={`ml-auto h-2 w-2 rounded-full ${realtimeStatus === "connected" ? "bg-emerald-300" : realtimeStatus === "connecting" ? "bg-amber-300" : "bg-rose-300"}`} /></div><label className="text-[10px] uppercase tracking-[0.14em] text-[#7893af]" htmlFor="parametric-project">Proyecto activo</label><Input id="parametric-project" value={projectId} onChange={(event) => setProjectId(event.target.value.toUpperCase())} className="h-8 border-[#557da5] bg-[#0b203a] font-mono text-xs text-[#edf4ff]" placeholder="XXX-XXX-XXX-XXX" /><p className="truncate text-[11px] text-[#7893af]">{realtimeStatus === "connected" ? "WebSocket conectado" : realtimeStatus === "connecting" ? "Conectando progreso…" : "WebSocket offline · se conserva persistencia"}</p></div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[{ label: "Archivos en esta sesión", value: files.length, icon: FileText }, { label: "Validados", value: files.filter((file) => file.status === "INSPECTED").length, icon: CheckCircle2 }, { label: "Requieren host", value: files.filter((file) => file.hostRequired).length, icon: LockKeyhole }].map(({ label, value, icon: Icon }) => <Card key={label} className="border-[#294765] bg-[#0d223d]"><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs uppercase tracking-[0.14em] text-[#7893af]">{label}</p><p className="mt-2 text-2xl font-semibold text-[#edf4ff]">{value}</p></div><Icon className="h-5 w-5 text-[#f0a35b]" /></CardContent></Card>)}
        </section>
        <Card className="border-[#294765] bg-[#0d223d]"><CardContent className="flex flex-wrap items-center gap-3 p-4 text-xs text-[#b8cbe0]"><span className="uppercase tracking-[0.14em] text-[#7893af]">Workers externos</span>{hostWorkers.data?.map((worker) => <span key={worker.kind} className={`rounded-full border px-2.5 py-1 ${worker.status === "READY" ? "border-emerald-400/30 text-emerald-200" : "border-amber-400/30 text-amber-200"}`}>{worker.kind.replace("_", " ")} · {worker.status}</span>)}</CardContent></Card>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className={`border-[#557da5] bg-[#102947] ${dragging ? "ring-2 ring-[#f0a35b]" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFiles(event.dataTransfer.files); }}>
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><UploadCloud className="h-5 w-5 text-[#f0a35b]" /> Subir archivo paramétrico</CardTitle></CardHeader>
            <CardContent>
              <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#557da5] bg-[#0b203a] px-6 text-center transition hover:border-[#f0a35b] hover:bg-[#122f50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a35b]">
                <UploadCloud className="mb-4 h-10 w-10 text-[#f0a35b]" /><span className="text-lg font-medium">Arrastra o selecciona un archivo</span><span className="mt-2 text-sm text-[#9eb6ce]">.dyn · .dyf · .gh · .ghx · .blend · .ark · .json</span><span className="mt-4 rounded-lg bg-[#6ea8ff] px-4 py-2 text-sm font-medium text-[#081a31]">Seleccionar archivo</span>
              </button>
              <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={(event) => { if (event.target.files) acceptFiles(event.target.files); event.currentTarget.value = ""; }} />
              {uploadingName && <div className="mt-4 rounded-xl border border-[#294765] bg-[#0b203a] p-3"><div className="flex justify-between text-sm"><span>Validando {uploadingName}</span><span>{progress}%</span></div><Progress value={progress} className="mt-2 h-2" /><p className="mt-2 text-xs text-[#9eb6ce]">{realtimeMessage}</p></div>}
              <div className="mt-4 flex gap-2 text-xs text-[#7893af]"><LockKeyhole className="h-4 w-4 shrink-0" />El archivo original se preserva y queda asociado a <span className="font-mono text-[#d7e5f4]">{projectId}</span>; la validación no lo ejecuta ni modifica.</div>
            </CardContent>
          </Card>

          <Card className="border-[#294765] bg-[#0d223d]"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><FileCode2 className="h-5 w-5 text-[#f0a35b]" /> Flujo de control</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-[#b8cbe0]">{[["01", "Inspect", "Detecta formato, checksum y dependencias declaradas."], ["02", "Validate", "Revisa esquema y separa archivo opaco de grafo legible."], ["03", "Host gate", "Dynamo, Rhino o Blender sólo se ejecutan si el host existe."], ["04", "Human review", "Toda escritura o exportación requiere aprobación." ]].map(([num, title, detail]) => <div key={num} className="flex gap-3"><span className="font-mono text-[#f0a35b]">{num}</span><div><p className="font-medium text-[#edf4ff]">{title}</p><p className="mt-1 leading-5">{detail}</p></div></div>)}</CardContent></Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-[#294765] bg-[#0d223d]"><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-xl">Biblioteca de {projectId}</CardTitle><Badge variant="outline" className="border-[#557da5] text-[#b8cbe0]">{filtered.length}</Badge></div><div className="relative mt-3"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7893af]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, formato o estado…" className="border-[#294765] bg-[#0b203a] pl-9 text-[#edf4ff] placeholder:text-[#7893af]" /></div></CardHeader><CardContent className="space-y-2">{library.isLoading ? <div className="rounded-xl border border-dashed border-[#294765] p-8 text-center text-sm text-[#7893af]">Cargando biblioteca persistente…</div> : filtered.length ? filtered.map((file) => <button key={file.artifactId} type="button" onClick={() => setSelected(file)} className={`w-full rounded-xl border p-3 text-left transition hover:border-[#f0a35b] ${selected?.artifactId === file.artifactId ? "border-[#f0a35b] bg-[#172f4d]" : "border-[#294765] bg-[#0b203a]"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-medium text-[#edf4ff]">{file.fileName}</p><p className="mt-1 text-xs text-[#7893af]">{formatLabel[file.format] ?? file.format} · {prettyBytes(file.sizeBytes)}</p></div><Badge className={statusTone(file.status)}>{file.status}</Badge></div></button>) : <div className="rounded-xl border border-dashed border-[#294765] p-8 text-center text-sm text-[#7893af]">Aún no hay archivos persistidos en este proyecto.</div>}</CardContent></Card>

          <Card className="border-[#294765] bg-[#0d223d]"><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-xl">Manifiesto de validación {selected && <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar detalle"><X className="h-4 w-4 text-[#7893af]" /></button>}</CardTitle></CardHeader><CardContent>{selected ? <div className="space-y-5"><div className="flex flex-wrap items-center gap-2"><Badge className={statusTone(selected.status)}>{selected.status}</Badge><span className="text-xs text-[#7893af]">{formatLabel[selected.format] ?? selected.format}</span></div><div><p className="text-lg font-medium">{selected.fileName}</p><p className="mt-1 break-all font-mono text-xs text-[#7893af]">{selected.artifactId}</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-[#0b203a] p-3"><p className="text-xs text-[#7893af]">Checksum</p><p className="mt-1 break-all font-mono text-xs text-[#d7e5f4]">{selected.checksum}</p><Button variant="ghost" size="sm" className="mt-2 h-7 px-0 text-[#6ea8ff]" onClick={() => copy(selected.checksum)}><Copy className="mr-1 h-3.5 w-3.5" />Copiar</Button></div><div className="rounded-lg bg-[#0b203a] p-3"><p className="text-xs text-[#7893af]">Dependencias declaradas</p><p className="mt-1 text-sm text-[#d7e5f4]">{selected.declaredDependencies.length ? selected.declaredDependencies.join(", ") : "Ninguna detectada"}</p></div></div><div className="rounded-lg border border-[#294765] p-3"><p className="text-xs uppercase tracking-[0.12em] text-[#7893af]">Host requerido</p><p className="mt-2 text-sm text-[#edf4ff]">{selected.hostRequired ?? "Ninguno: puede validarse en el runtime ARKI"}</p></div><Separator className="bg-[#294765]" /><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" className="border-[#557da5]" disabled={!selected.storageUrl} onClick={() => selected.storageUrl && window.open(selected.storageUrl, "_blank", "noopener,noreferrer")}><ExternalLink className="mr-1.5 h-4 w-4" />Abrir original</Button><Button size="sm" variant="outline" className="border-[#557da5]" disabled={archive.isPending} onClick={() => { archive.mutate({ projectId, artifactId: selected.artifactId }); setFiles((current) => current.filter((file) => file.artifactId !== selected.artifactId)); setSelected(null); }}><Trash2 className="mr-1.5 h-4 w-4" />Archivar del proyecto</Button></div><p className="flex gap-2 text-xs leading-5 text-[#f0c98a]"><AlertTriangle className="h-4 w-4 shrink-0" />{selected.hostRequired ? "La inspección fue segura y no ejecutó el host externo. La ejecución queda bloqueada hasta provisionar y validar el entorno." : "La ejecución queda gobernada por el contrato ARKI y requiere revisión humana."}</p></div> : <div className="flex min-h-72 flex-col items-center justify-center text-center text-[#7893af]"><FileText className="mb-3 h-10 w-10 text-[#557da5]" /><p>Selecciona un archivo para inspeccionar su manifiesto.</p><p className="mt-2 max-w-sm text-xs leading-5">El navegador nunca ejecuta el contenido; sólo lo envía al endpoint protegido para validación y almacenamiento.</p></div>}</CardContent></Card>
        </section>
      </div>
    </main>
  );
}
