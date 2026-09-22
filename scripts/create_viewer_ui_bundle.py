from pathlib import Path

ROOT = Path('/home/ubuntu/sicl-web')
OUT = ROOT / 'outputs' / 'ARKI_VISOR_3D_UI_PAQUETE_COMPLETO.md'

FILES = {}
FILES['package.json'] = '''{
  "name": "arki-3d-viewer-standalone",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": {
    "@react-three/fiber": "^9.7.0",
    "@vitejs/plugin-react": "^5.0.4",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "three": "^0.186.0",
    "vite": "^7.1.7"
  },
  "devDependencies": { "typescript": "^5.9.3" }
}'''

FILES['index.html'] = '''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ARKI · Visor 3D independiente</title>
  </head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>'''

FILES['src/main.tsx'] = '''import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);'''

FILES['src/demoBuilding.ts'] = '''export type ViewMode = "PLAN" | "SECTION" | "MODEL_3D";
export type Quality = "baja" | "media" | "alta" | "ultra";
export type Resolution = "hd" | "fullhd" | "2k" | "4k" | "8k" | "16k";

export type DemoBuilding = {
  name: string;
  family: string;
  variant: string;
  city: string;
  areaM2: number;
  capacity: number;
  floors: number;
  floorHeightM: number;
  widthM: number;
  depthM: number;
  courtyardRatio: number;
  primarySpaces: string[];
  alerts: string[];
};

export const RESOLUTIONS: Record<Resolution, { width: number; height: number; label: string }> = {
  hd: { width: 1280, height: 720, label: "HD 720p" },
  fullhd: { width: 1920, height: 1080, label: "Full HD" },
  "2k": { width: 2560, height: 1440, label: "2K QHD" },
  "4k": { width: 3840, height: 2160, label: "4K UHD" },
  "8k": { width: 7680, height: 4320, label: "8K UHD" },
  "16k": { width: 15360, height: 8640, label: "16K" },
};

export const FAMILY_OPTIONS = [
  { id: "FAM-HEALTH", name: "Salud", variants: ["Hospital general", "Clínica ambulatoria", "Centro rural"] },
  { id: "FAM-EDUCATION", name: "Educación", variants: ["Colegio", "Universidad", "Inicial"] },
  { id: "FAM-CULTURE", name: "Cultura", variants: ["Museo", "Biblioteca", "Teatro"] },
  { id: "FAM-HOSPITALITY", name: "Hospedaje", variants: ["Hotel", "Hostal", "Resort"] },
  { id: "FAM-RESIDENTIAL", name: "Residencial", variants: ["Casa", "Multifamiliar", "Conjunto"] },
];

export function makeDemoBuilding(input: Partial<DemoBuilding> = {}): DemoBuilding {
  const floors = Math.max(1, Math.min(30, Number(input.floors ?? 4)));
  const areaM2 = Math.max(100, Number(input.areaM2 ?? 20000));
  const widthM = Math.max(20, Math.sqrt(areaM2 * 1.25));
  const depthM = Math.max(20, areaM2 / widthM);
  return {
    name: input.name ?? "Hospital general · Trujillo",
    family: input.family ?? "Salud",
    variant: input.variant ?? "Hospital general",
    city: input.city ?? "Trujillo",
    areaM2,
    capacity: Math.max(1, Number(input.capacity ?? 400)),
    floors,
    floorHeightM: Number(input.floorHeightM ?? 4.2),
    widthM,
    depthM,
    courtyardRatio: Math.max(0, Math.min(0.6, Number(input.courtyardRatio ?? 0.18))),
    primarySpaces: input.primarySpaces ?? ["admisión", "consultorios", "hospitalización", "emergencia", "diagnóstico", "circulación pública", "circulación técnica"],
    alerts: input.alerts ?? ["Propuesta conceptual: requiere validación normativa y profesional.", "La geometría no es una familia nativa de Revit."]
  };
}'''

FILES['src/ProfessionalFamilyViewer.tsx'] = '''import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RESOLUTIONS, type DemoBuilding, type Quality, type Resolution, type ViewMode } from "./demoBuilding";

export default function ProfessionalFamilyViewer({ building, mode = "MODEL_3D", quality = "alta", resolution = "2k" }: { building: DemoBuilding; mode?: ViewMode; quality?: Quality; resolution?: Resolution }) {
  const dpr = quality === "ultra" ? 2 : quality === "alta" ? 1.5 : quality === "media" ? 1.2 : 1;
  return <div className="viewer-shell">
    <Canvas shadows dpr={dpr} camera={{ position: [180, 150, 220], fov: 42, near: 0.1, far: 20000 }} gl={{ antialias: true, logarithmicDepthBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1, preserveDrawingBuffer: true }}>
      <ProfessionalScene building={building} mode={mode} quality={quality} />
    </Canvas>
    <div className="viewer-hud">{RESOLUTIONS[resolution].label} · PBR · sombras suaves · {quality}</div>
  </div>;
}

function ProfessionalScene({ building, mode, quality }: { building: DemoBuilding; mode: ViewMode; quality: Quality }) {
  const { camera } = useThree();
  const box = useMemo(() => ({ width: Math.max(8, building.widthM / 5), depth: Math.max(8, building.depthM / 5), height: Math.max(4, building.floors * building.floorHeightM / 5) }), [building]);
  useEffect(() => {
    if (mode === "PLAN") { camera.position.set(0, 260, 0.01); camera.lookAt(0, 0, 0); }
    else if (mode === "SECTION") { camera.position.set(180, 90, 0); camera.lookAt(0, box.height / 2, 0); }
    else { camera.position.set(180, 140, 220); camera.lookAt(0, box.height / 2, 0); }
  }, [box.height, camera, mode]);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: mode === "PLAN" ? "#f0a35b" : "#6ea8ff", roughness: quality === "ultra" ? 0.38 : 0.55, metalness: 0.15, transparent: true, opacity: 0.9 }), [mode, quality]);
  return <><color attach="background" args={["#090e14"]} /><hemisphereLight args={["#cfe8ff", "#25251f", 0.7]} /><directionalLight castShadow position={[300, 500, 200]} intensity={2.2} shadow-mapSize-width={quality === "ultra" ? 4096 : 2048} shadow-mapSize-height={quality === "ultra" ? 4096 : 2048} /><directionalLight position={[-200, 300, -300]} color="#8ab4f8" intensity={0.45} /><gridHelper args={[Math.max(box.width, box.depth) * 8, 48, "#2a2a35", "#151c25"]} position={[0, -0.05, 0]} /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow><planeGeometry args={[Math.max(box.width, box.depth) * 10, Math.max(box.width, box.depth) * 10]} /><meshStandardMaterial color="#161b22" roughness={0.95} /></mesh>{mode === "PLAN" ? <PlanMass box={box} material={material} courtyardRatio={building.courtyardRatio} /> : <BuildingMass box={box} material={material} floors={building.floors} section={mode === "SECTION"} />}{mode !== "PLAN" && <NativeOrbitControls />}</>;
}
function NativeOrbitControls() { const { camera, gl } = useThree(); const ref = useRef<OrbitControls | null>(null); useEffect(() => { const controls = new OrbitControls(camera, gl.domElement); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 20; controls.maxDistance = 5000; controls.maxPolarAngle = Math.PI / 2.05; controls.screenSpacePanning = true; ref.current = controls; return () => controls.dispose(); }, [camera, gl]); return null; }
function BuildingMass({ box, material, floors, section }: { box: { width: number; depth: number; height: number }; material: THREE.Material; floors: number; section: boolean }) { return <group>{Array.from({ length: Math.max(1, Math.min(floors, 20)) }, (_, index) => <mesh key={index} castShadow receiveShadow position={[0, (index + 0.5) * (box.height / Math.max(floors, 1)), 0]} material={material}><boxGeometry args={[box.width, box.height / Math.max(floors, 1) * 0.92, box.depth]} /><Edges /></mesh>)}{section && <mesh position={[0, box.height / 2, box.depth / 2 + 0.02]}><planeGeometry args={[box.width, box.height]} /><meshBasicMaterial color="#f0a35b" wireframe transparent opacity={0.6} /></mesh>}</group>; }
function PlanMass({ box, material, courtyardRatio }: { box: { width: number; depth: number; height: number }; material: THREE.Material; courtyardRatio: number }) { return <group rotation={[-Math.PI / 2, 0, 0]}><mesh castShadow receiveShadow material={material}><planeGeometry args={[box.width, box.depth]} /><Edges /></mesh>{courtyardRatio > 0 && <mesh position={[0, 0, 0.02]}><planeGeometry args={[box.width * courtyardRatio, box.depth * courtyardRatio]} /><meshBasicMaterial color="#39b86a" wireframe transparent opacity={0.85} /></mesh>}</group>; }
function Edges() { return <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} /><lineBasicMaterial color="#ffffff" transparent opacity={0.12} /></lineSegments>; }'''

FILES['src/App.tsx'] = '''import { useMemo, useState } from "react";
import ProfessionalFamilyViewer from "./ProfessionalFamilyViewer";
import { FAMILY_OPTIONS, RESOLUTIONS, makeDemoBuilding, type Quality, type Resolution, type ViewMode } from "./demoBuilding";

export default function App() {
  const [familyId, setFamilyId] = useState("FAM-HEALTH");
  const [variant, setVariant] = useState("Hospital general");
  const [city, setCity] = useState("Trujillo");
  const [area, setArea] = useState("20000");
  const [capacity, setCapacity] = useState("400");
  const [floors, setFloors] = useState("4");
  const [quality, setQuality] = useState<Quality>("alta");
  const [resolution, setResolution] = useState<Resolution>("2k");
  const [mode, setMode] = useState<ViewMode>("MODEL_3D");
  const [saved, setSaved] = useState(0);
  const family = FAMILY_OPTIONS.find((item) => item.id === familyId) ?? FAMILY_OPTIONS[0];
  const building = useMemo(() => makeDemoBuilding({ family: family.name, variant, city, areaM2: Number(area), capacity: Number(capacity), floors: Number(floors) }), [family.name, variant, city, area, capacity, floors]);
  const download = (format: "json" | "svg" | "csv") => {
    const content = format === "json" ? JSON.stringify(building, null, 2) : format === "csv" ? `name,areaM2,capacity,floors,city\\n${building.name},${building.areaM2},${building.capacity},${building.floors},${building.city}\\n` : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${building.widthM} ${building.depthM}"><rect width="100%" height="100%" fill="#f0a35b" fill-opacity=".2" stroke="#f0a35b"/><text x="2" y="6">${building.name}</text></svg>`;
    const blob = new Blob([content], { type: format === "json" ? "application/json" : format === "csv" ? "text/csv" : "image/svg+xml" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `arki-demo.${format}`; a.click(); URL.revokeObjectURL(url);
  };
  return <main className="app"><header className="topbar"><div><div className="eyebrow">ARKI · INDEPENDENT VIEWER</div><h1>Family Studio <span>3D</span></h1><p>Visor paramétrico externo para probar familias, variantes y geometría conceptual.</p></div><div className="status">MANIAC · PROPOSAL ONLY</div></header><div className="workspace"><aside className="panel left-panel"><h2>Family & parameters</h2><label>Family<select value={familyId} onChange={(e) => { setFamilyId(e.target.value); setVariant(FAMILY_OPTIONS.find((f) => f.id === e.target.value)?.variants[0] ?? ""); }}>{FAMILY_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Variant<select value={variant} onChange={(e) => setVariant(e.target.value)}>{family.variants.map((item) => <option key={item}>{item}</option>)}</select></label><div className="two-cols"><label>Área m²<input value={area} onChange={(e) => setArea(e.target.value)} /></label><label>Aforo<input value={capacity} onChange={(e) => setCapacity(e.target.value)} /></label></div><label>Niveles<input value={floors} onChange={(e) => setFloors(e.target.value)} /></label><label>Ciudad<input value={city} onChange={(e) => setCity(e.target.value)} /></label><button className="primary" onClick={() => setSaved((value) => value + 1)}>Guardar versión {saved > 0 ? `(${saved})` : ""}</button><div className="divider" /><h3>Render profesional</h3><div className="two-cols"><label>Calidad<select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}>{["baja", "media", "alta", "ultra"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Resolución<select value={resolution} onChange={(e) => setResolution(e.target.value as Resolution)}>{Object.entries(RESOLUTIONS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label></div><p className="hint">{RESOLUTIONS[resolution].width} × {RESOLUTIONS[resolution].height} · PBR · ACES</p></aside><section className="center"><div className="mode-tabs">{([["PLAN", "Planta 2D"], ["SECTION", "Corte"], ["MODEL_3D", "Modelo 3D"]] as const).map(([key, label]) => <button key={key} className={mode === key ? "active" : ""} onClick={() => setMode(key)}>{label}</button>)}</div><div className="viewer-main"><ProfessionalFamilyViewer building={building} mode={mode} quality={quality} resolution={resolution} /></div><div className="viewer-caption"><strong>{building.name}</strong><span>{building.city} · {building.areaM2.toLocaleString()} m² · {building.capacity.toLocaleString()} usuarios · {building.floors} niveles</span></div></section><aside className="panel right-panel"><h2>Design summary</h2><div className="metric-grid"><Metric label="Area" value={`${building.areaM2.toLocaleString()} m²`} /><Metric label="Capacity" value={building.capacity.toLocaleString()} /><Metric label="Floors" value={building.floors} /><Metric label="Height" value={`${(building.floors * building.floorHeightM).toFixed(1)} m`} /></div><h3>Program</h3><div className="chips">{building.primarySpaces.map((space) => <span key={space}>{space}</span>)}</div><h3>Alerts</h3><div className="alerts">{building.alerts.map((alert) => <p key={alert}>{alert}</p>)}</div><div className="exports"><button onClick={() => download("json")}>JSON</button><button onClick={() => download("svg")}>SVG</button><button onClick={() => download("csv")}>CSV</button></div></aside></div></main>;
}
function Metric({ label, value }: { label: string; value: string | number }) { return <div className="metric"><span>{label}</span><strong>{value}</strong></div>; }'''

FILES['src/styles.css'] = ''':root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #d7e5f4; background: #0b1016; font-synthesis: none; }
* { box-sizing: border-box; } body { margin: 0; min-width: 1180px; background: #0b1016; } button, input, select { font: inherit; } button { cursor: pointer; }
.app { min-height: 100vh; padding: 24px; background: radial-gradient(circle at 50% -20%, #14283b, #0b1016 55%); } .topbar { max-width: 1700px; margin: 0 auto 22px; display: flex; align-items: end; justify-content: space-between; gap: 20px; } .eyebrow { color: #f0a35b; font-size: 11px; letter-spacing: .22em; font-weight: 700; } h1 { margin: 8px 0 4px; font-size: 32px; } h1 span { color: #f0a35b; } p { margin: 0; color: #91a4b8; font-size: 13px; } .status { border: 1px solid #f0a35b66; color: #ffd5a8; background: #f0a35b12; padding: 9px 12px; border-radius: 5px; font-size: 11px; letter-spacing: .08em; }
.workspace { max-width: 1700px; margin: auto; display: grid; grid-template-columns: 290px minmax(550px, 1fr) 310px; gap: 16px; } .panel, .center { border: 1px solid #273445; background: #151d27; border-radius: 7px; } .panel { padding: 18px; } .center { padding: 12px; background: #101720; } h2 { font-size: 14px; margin: 0 0 18px; } h3 { margin: 18px 0 10px; color: #71859b; text-transform: uppercase; letter-spacing: .12em; font-size: 10px; } label { display: block; color: #91a4b8; font-size: 11px; margin: 12px 0; } input, select { width: 100%; margin-top: 6px; padding: 9px 10px; border: 1px solid #34485e; border-radius: 4px; color: #d7e5f4; background: #0d1117; outline: none; } input:focus, select:focus { border-color: #f0a35b; } .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .primary { width: 100%; margin-top: 12px; padding: 11px; border: 0; border-radius: 4px; color: #080b0e; background: #f0a35b; font-weight: 700; } .primary:hover { background: #ffc17d; } .divider { border-top: 1px solid #273445; margin: 20px 0; } .hint { color: #71859b; font-size: 10px; line-height: 1.5; }
.mode-tabs { display: flex; gap: 5px; border-bottom: 1px solid #273445; padding: 0 0 10px; } .mode-tabs button, .exports button { border: 1px solid #34485e; border-radius: 4px; background: #0d1117; color: #91a4b8; padding: 9px 12px; font-size: 11px; } .mode-tabs button.active { color: #0b1016; background: #f0a35b; border-color: #f0a35b; } .viewer-main { height: 650px; margin-top: 12px; } .viewer-shell { position: relative; width: 100%; height: 100%; min-height: 220px; overflow: hidden; border-radius: 5px; background: #090e14; } .viewer-hud { pointer-events: none; position: absolute; left: 10px; bottom: 10px; padding: 6px 9px; border: 1px solid #ffffff1a; border-radius: 4px; background: #0008; color: #b7c8d9; font-size: 10px; } .viewer-caption { display: flex; justify-content: space-between; gap: 16px; padding: 12px 3px 2px; font-size: 12px; } .viewer-caption span { color: #71859b; }
.metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .metric { border: 1px solid #34485e; background: #0d1117; border-radius: 4px; padding: 10px; } .metric span { display: block; color: #71859b; font-size: 10px; } .metric strong { display: block; margin-top: 5px; color: #ffd5a8; font-size: 14px; } .chips { display: flex; flex-wrap: wrap; gap: 5px; } .chips span { border: 1px solid #34485e; border-radius: 3px; padding: 5px 7px; color: #b7c8d9; font-size: 10px; } .alerts p { margin: 8px 0; padding: 8px; border-left: 2px solid #f0a35b; background: #f0a35b0d; color: #b7c8d9; font-size: 11px; line-height: 1.4; } .exports { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 22px; } .exports button:hover { border-color: #f0a35b; color: #ffd5a8; }
@media (max-width: 1200px) { body { min-width: 0; } .app { padding: 14px; } .workspace { grid-template-columns: 1fr; } .viewer-main { height: 520px; } }
'''

sections = ['# ARKI — Visor 3D independiente con UI completa\n', '> Paquete autocontenido para crear un proyecto nuevo dentro de Manus y abrir el visor externamente, sin autenticación, tRPC, base de datos ni conexión al Core.\n', '## Cómo usarlo\n\nCrea un proyecto React/Vite vacío. Copia cada bloque en la ruta indicada. Ejecuta `pnpm install` y luego `pnpm dev`. Para producción usa `pnpm build` y `pnpm preview`.\n\nLa página muestra controles reales para familia, variante, área, aforo, niveles, ciudad, calidad, resolución, planta, corte, 3D y exportación JSON/SVG/CSV. La geometría demo se calcula localmente para que la pantalla funcione desde el primer arranque.\n', '## Archivos del proyecto\n\n```text\npackage.json\nindex.html\nsrc/main.tsx\nsrc/App.tsx\nsrc/demoBuilding.ts\nsrc/ProfessionalFamilyViewer.tsx\nsrc/styles.css\n```\n']
for path, content in FILES.items():
    lang = 'json' if path.endswith('.json') else 'tsx' if path.endswith('.tsx') else 'ts' if path.endswith('.ts') else 'css' if path.endswith('.css') else 'html'
    sections.append(f'## `{path}`\n\n```{lang}\n{content.rstrip()}\n```\n')
sections += ['## Qué queda preparado\n\nEl visor es una versión independiente de demostración. No requiere login y no llama al backend. El modelo se genera localmente y es conceptual. Para usarlo como ARKI productivo, el siguiente paso es reemplazar `makeDemoBuilding` por el motor dinámico real y conectar sus endpoints protegidos, manteniendo la revisión humana y el estado `PROPOSAL_ONLY`.\n', '## Verificación\n\nDespués de arrancar, cambia entre **Planta 2D**, **Corte** y **Modelo 3D**. Modifica el área, aforo, niveles y ciudad. Cambia calidad y resolución. Usa el ratón para orbitar el modelo 3D. Pulsa JSON, SVG y CSV para comprobar las descargas. La interfaz no depende de recursos externos ni de autenticación.\n']
OUT.write_text('\n'.join(sections), encoding='utf-8')
print(OUT)
print(f'bytes={OUT.stat().st_size}')
