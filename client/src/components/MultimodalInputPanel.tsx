import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siclClient, apiErrorMessage } from "@/api/sicl-client";

type Props = { projectId: string; spatialScope?: string };
type Candidate = Record<string, unknown>;
type Point = { x: number; y: number };

export default function MultimodalInputPanel({ projectId }: Props) {
  const [mode, setMode] = useState<"LANGUAGE" | "SKETCH" | "REFERENCE_IMAGE" | "GRAPHICAL_SELECTION" | "DIRECT_MANIPULATION">("LANGUAGE");
  const [text, setText] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [hint, setHint] = useState("PRESERVE_REGION");
  const [targetId, setTargetId] = useState("SpatialZone:select");
  const [operation, setOperation] = useState("MOVE");
  const [points, setPoints] = useState<Point[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [confirmed, setConfirmed] = useState<Candidate | null>(null);
  const [child, setChild] = useState<Candidate | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const modes = ["LANGUAGE", "SKETCH", "REFERENCE_IMAGE", "GRAPHICAL_SELECTION", "DIRECT_MANIPULATION"] as const;
  const payload = useMemo(() => {
    if (mode === "LANGUAGE") return { text };
    if (mode === "SKETCH") return { semantic_hint: hint, primitives: [{ type: "polyline", points }] };
    if (mode === "REFERENCE_IMAGE") return { annotation, image_ref: imageUrl ?? "local://pending" };
    if (mode === "GRAPHICAL_SELECTION") return { target_id: targetId, action: "CHANGE_THAT" };
    return { target_id: targetId, operation, preview: { points } };
  }, [annotation, hint, imageUrl, mode, operation, points, targetId, text]);
  const interpret = async () => { setBusy(true); setError(""); setConfirmed(null); try { setCandidate(await siclClient.interpretMultimodal(projectId, mode, payload)); } catch (reason) { setError(apiErrorMessage(reason)); } finally { setBusy(false); } };
  const confirm = async () => { if (!candidate) return; setBusy(true); setError(""); try { const result = await siclClient.confirmMultimodal(projectId, candidate, "architect-1"); setConfirmed((result.adopted_input as Candidate) ?? result); setChild(null); } catch (reason) { setError(apiErrorMessage(reason)); } finally { setBusy(false); } };
  const generateChild = async () => { if (!confirmed) return; setBusy(true); setError(""); try { const adopted = { adoption: "HUMAN_CONFIRMED", actor: "architect-1", adopted_intents: [confirmed.candidate_intent], provenance: confirmed.provenance, decision_created: false }; setChild(await siclClient.exploreGdi(projectId, "UPAO-001-A", adopted, {})); } catch (reason) { setError(apiErrorMessage(reason)); } finally { setBusy(false); } };
  return <section className="rounded border border-[#385348] bg-[#fbfaf6] p-4 text-[#1d2925]" aria-label="Multimodal design input">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a94524]">GDI-P4</p><h3 className="font-serif text-xl text-[#385348]">Multimodal design input</h3><p className="mt-1 text-xs text-[#718078]">All inputs converge to the same Human Intent and GDI pipeline.</p></div><span className="rounded bg-[#dce8df] px-2 py-1 text-xs font-semibold text-[#385348]">Mode: {mode}</span></div>
    <div className="mt-3 flex flex-wrap gap-2">{modes.map((item) => <Button key={item} type="button" size="sm" variant={mode === item ? "default" : "outline"} onClick={() => { setMode(item); setCandidate(null); }}>{item}</Button>)}</div>
    <div className="mt-3 space-y-2">{mode === "LANGUAGE" && <Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Conserva este espacio pero hazlo más grande." aria-label="Language design intent" />}{mode === "SKETCH" && <><div className="rounded border border-[#b9c4bd] bg-white p-2"><svg viewBox="0 0 320 150" className="h-36 w-full" role="img" aria-label="Bounded sketch input" onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPoints((items) => [...items, { x: Math.round((event.clientX - rect.left) / rect.width * 320), y: Math.round((event.clientY - rect.top) / rect.height * 150) }]); }}><rect x="1" y="1" width="318" height="148" fill="#f8faf7" stroke="#b9c4bd" /><polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#a94524" strokeWidth="3" />{points.map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r="4" fill="#385348" />)}</svg></div><Input value={hint} onChange={(event) => setHint(event.target.value)} placeholder="PRESERVE_REGION / GENERATIVE_REGION" aria-label="Sketch semantic hint" /><p className="text-xs text-[#718078]">Sketch strokes remain graphical context; they are not walls, rooms or legal boundaries.</p></>}{mode === "REFERENCE_IMAGE" && <><Input type="file" accept="image/*" aria-label="Reference image" onChange={(event) => { const file = event.target.files?.[0]; if (file) setImageUrl(URL.createObjectURL(file)); }} /><Textarea value={annotation} onChange={(event) => setAnnotation(event.target.value)} placeholder="Me interesa la organización alrededor de un patio." aria-label="Reference image annotation" />{imageUrl && <img src={imageUrl} alt="Local reference preview" className="max-h-40 rounded border border-[#b9c4bd] object-contain" />}<p className="text-xs text-[#718078]">The image is context. The human annotation supplies the candidate characteristic.</p></>}{(mode === "GRAPHICAL_SELECTION" || mode === "DIRECT_MANIPULATION") && <><Input value={targetId} onChange={(event) => setTargetId(event.target.value)} placeholder="SpatialZone:..." aria-label="Selected spatial element" />{mode === "DIRECT_MANIPULATION" && <select value={operation} onChange={(event) => setOperation(event.target.value)} className="h-10 w-full rounded border border-[#b9c4bd] bg-white px-3 text-sm" aria-label="Direct manipulation operation"><option value="MOVE">MOVE</option><option value="RESIZE">RESIZE</option><option value="ROTATE">ROTATE</option><option value="SCALE">SCALE</option></select>}<p className="text-xs text-[#718078]">Target identity is preserved as operation context; it is not a new design object.</p></>}</div>
    <div className="mt-3 flex flex-wrap gap-2"><Button type="button" onClick={interpret} disabled={busy}>{busy ? "Interpreting…" : "Preview interpretation"}</Button>{candidate && <Button type="button" variant="outline" onClick={confirm} disabled={busy}>Confirm interpretation</Button>}</div>
    {error && <p role="alert" className="mt-2 text-sm text-[#a94524]">{error}</p>}{candidate && <div className="mt-3 rounded border border-[#d7d8cf] bg-white p-3 text-xs"><p className="font-semibold text-[#385348]">INTERPRETATION PREVIEW · {String(candidate.modality)}</p><p className="mt-1">{String(candidate.interpretation)}</p><p className="mt-1 text-[#718078]">Status: {String(candidate.status)} · decision_created: {String(candidate.decision_created)}</p></div>}{confirmed && <div className="mt-2 rounded bg-[#dce8df] p-2 text-xs text-[#385348]" role="status"><p>HUMAN_CONFIRMED · linked to the existing GDI pipeline · no decision created.</p><Button type="button" size="sm" className="mt-2" onClick={generateChild} disabled={busy}>Generate bounded child with GDI</Button></div>}{child && <div className="mt-2 rounded border border-[#385348] bg-white p-3 text-xs"><p className="font-semibold text-[#385348]">MULTIMODAL CHILD GENERATED</p><p className="mt-1">{String(child.parent_alternative_id ?? "UPAO-001-A")} → {String((child.derived_alternative as Candidate | undefined)?.alternative_id ?? "candidate")}</p><a className="mt-1 inline-block font-semibold underline" href="/spatial-comparison">Open 2D / 3D comparison</a></div>}
  </section>;
}
