import { useState } from "react";
import type { SceneModel } from "@shared/arkiSceneModel";
import { exportIFC4 } from "@shared/ifc4/arkiIfc4";
import { parseIFC4WithWebIfc } from "@shared/ifc4/webIfcAdapter";

export default function Ifc4Panel({ scene }: { scene: SceneModel }) {
  const [message, setMessage] = useState("IFC4 listo");
  const [lossCount, setLossCount] = useState(0);
  const download = (text: string, filename: string) => { const url = URL.createObjectURL(new Blob([text], { type: "application/octet-stream" })); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); };
  const exportScene = async () => { const result = await exportIFC4(scene, 1); download(result.text, `arki-${scene.projectId}.ifc`); setLossCount(result.lossReport.lost.length + result.lossReport.degraded.length); setMessage(`Exportado IFC4 · ${result.identities.length} identidades`); };
  const importFile = async (file: File) => { try { const parsed = await parseIFC4WithWebIfc(new Uint8Array(await file.arrayBuffer())); setLossCount(parsed.lossReport.lost.length + parsed.lossReport.degraded.length); setMessage(`IFC cargado · ${parsed.schema} · ${parsed.entities.length} entidades`); } catch (error) { setMessage(`IFC no cargado · ${error instanceof Error ? error.message : "error desconocido"}`); } };
  return <div className="ifc4-panel"><div><strong>IFC4 · Interoperabilidad</strong><small>{message}</small>{lossCount > 0 && <small className="ifc-loss">Pérdidas/degradaciones: {lossCount}</small>}</div><div className="ifc4-actions"><label className="ifc-file-button">Cargar IFC4<input type="file" accept=".ifc" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); }} /></label><button onClick={() => void exportScene()}>Exportar IFC4</button></div></div>;
}
