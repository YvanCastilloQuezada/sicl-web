import { useEffect, useRef } from "react";
import {
  CapsuleGeometry,
  CircleGeometry,
  Clock,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PointLight,
  SRGBColorSpace,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clampCameraAzimuth, clampCameraElevation, clampCameraPan, clampCameraZoom } from "../../../shared/lukita3dSpec";

type ViewerProps = {
  modelUrl?: string;
  pose: "neutral" | "welcome" | "present" | "celebrate" | "contingency";
  expression: "neutral" | "smile" | "focus" | "celebrate" | "contingency";
  silhouette?: boolean;
  lightIntensity?: number;
  lightAzimuth?: number;
  wireframe?: boolean;
  cameraPreset?: "reset" | "front" | "side" | "top";
  cameraAzimuth?: number;
  zoom?: number;
  clipping?: boolean;
  cameraElevation?: number;
  cameraPanX?: number;
  cameraPanY?: number;
  clipHeight?: number;
  proportionVariant?: "standard" | "athletic";
  mockMode?: boolean;
  retryToken?: number;
  backgroundColor?: string;
  onModelStateChange?: (state: "loading" | "ready" | "mock" | "fallback") => void;
  onStats?: (stats: { vertices: number; polygons: number }) => void;
};

function createBlockout(proportionVariant: "standard" | "athletic" = "athletic") {
  const root = new Group();
  const navy = new MeshStandardMaterial({ color: 0x0a1628, roughness: 0.68, metalness: 0.05 });
  const gold = new MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.65 });
  const skin = new MeshStandardMaterial({ color: 0xb87558, roughness: 0.72 });
  const hair = new MeshStandardMaterial({ color: 0x211913, roughness: 0.82 });
  const white = new MeshStandardMaterial({ color: 0xf8f6ee, roughness: 0.6 });
  const dark = new MeshStandardMaterial({ color: 0x080b12, roughness: 0.35, metalness: 0.45 });

  // Silueta de presentadora adulta: torso definido, cintura contenida y piernas más largas.
  // Es una aproximación de blockout, no una copia de ningún personaje existente.
  const athletic = proportionVariant === "athletic";
  const torso = new Mesh(new CylinderGeometry(athletic ? 0.31 : 0.34, athletic ? 0.39 : 0.43, athletic ? 1.14 : 1.18, 16, 1, false), navy);
  torso.position.y = athletic ? 1.15 : 1.12;
  torso.scale.set(1.0, 1.0, 0.62);
  root.add(torso);

  const waist = new Mesh(new CylinderGeometry(athletic ? 0.24 : 0.27, athletic ? 0.31 : 0.34, 0.32, 16, 1, false), navy);
  waist.position.y = athletic ? 0.58 : 0.55;
  waist.scale.z = 0.62;
  root.add(waist);

  const skirt = new Mesh(new ConeGeometry(athletic ? 0.57 : 0.62, athletic ? 0.86 : 0.92, 20, 1, false), navy);
  skirt.position.y = athletic ? 0.2 : 0.18;
  skirt.scale.z = 0.58;
  root.add(skirt);

  const neck = new Mesh(new CylinderGeometry(0.14, 0.16, 0.25, 16), skin);
  neck.position.y = 1.9;
  root.add(neck);
  const head = new Mesh(new SphereGeometry(0.37, 24, 18), skin);
  head.position.y = 2.28;
  head.scale.set(0.9, 1.08, 0.88);
  root.add(head);

  const hairCap = new Mesh(new SphereGeometry(0.43, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.68), hair);
  hairCap.position.set(0, 2.39, -0.02);
  hairCap.scale.set(1, 1.05, 0.98);
  root.add(hairCap);
  const hairBack = new Mesh(new CapsuleGeometry(0.32, 1.25, 8, 14), hair);
  hairBack.position.set(0, 1.55, -0.26);
  hairBack.scale.set(1.05, 1, 0.42);
  root.add(hairBack);
  // Mechones laterales y marco facial para que la identidad se lea también en 3/4.
  const hairLock = new Mesh(new CapsuleGeometry(0.075, 0.54, 6, 10), hair);
  const hairLockL = hairLock.clone(); hairLockL.position.set(-0.31, 2.05, 0.08); hairLockL.rotation.z = -0.12; root.add(hairLockL);
  const hairLockR = hairLock.clone(); hairLockR.position.set(0.31, 2.05, 0.08); hairLockR.rotation.z = 0.12; root.add(hairLockR);
  const hairFront = new Mesh(new CapsuleGeometry(0.07, 0.34, 6, 10), hair);
  hairFront.position.set(-0.25, 2.28, 0.28); hairFront.rotation.z = -0.28; root.add(hairFront);
  const hairFrontR = hairFront.clone(); hairFrontR.position.x = 0.25; hairFrontR.rotation.z = 0.28; root.add(hairFrontR);

  const eyeWhite = new Mesh(new SphereGeometry(0.065, 12, 8), white);
  const eyeL = eyeWhite.clone(); eyeL.position.set(-0.13, 2.31, 0.315); root.add(eyeL);
  const eyeR = eyeWhite.clone(); eyeR.position.set(0.13, 2.31, 0.315); root.add(eyeR);
  const pupil = new Mesh(new SphereGeometry(0.028, 10, 8), dark);
  const pupilL = pupil.clone(); pupilL.position.set(-0.13, 2.31, 0.375); root.add(pupilL);
  const pupilR = pupil.clone(); pupilR.position.set(0.13, 2.31, 0.375); root.add(pupilR);
  const brow = new Mesh(new CapsuleGeometry(0.018, 0.12, 4, 8), dark);
  const browL = brow.clone(); browL.position.set(-0.13, 2.43, 0.34); browL.rotation.z = 0.08; root.add(browL);
  const browR = brow.clone(); browR.position.set(0.13, 2.43, 0.34); browR.rotation.z = -0.08; root.add(browR);
  const nose = new Mesh(new SphereGeometry(0.052, 10, 8), skin);
  nose.position.set(0, 2.23, 0.37); nose.scale.set(0.72, 1.18, 0.7); root.add(nose);

  const mouth = new Mesh(new TorusGeometry(0.085, 0.018, 8, 16, Math.PI), dark);
  mouth.position.set(0, 2.16, 0.34); mouth.rotation.x = Math.PI; root.add(mouth);

  const collar = new Mesh(new TorusGeometry(0.24, 0.045, 8, 24), gold);
  collar.position.y = 1.84; collar.rotation.x = Math.PI / 2; root.add(collar);
  const insignia = new Mesh(new CircleGeometry(0.105, 20), gold);
  insignia.position.set(0.34, 1.25, 0.18); insignia.rotation.y = -0.35; root.add(insignia);
  const belt = new Mesh(new TorusGeometry(0.275, 0.026, 8, 24), gold);
  belt.position.y = 0.64; belt.rotation.x = Math.PI / 2; belt.scale.z = 0.62; root.add(belt);
  const shoulder = new Mesh(new SphereGeometry(0.16, 12, 8), navy);
  const shoulderL = shoulder.clone(); shoulderL.position.set(-0.35, 1.62, 0); shoulderL.scale.set(1.2, 0.58, 0.72); root.add(shoulderL);
  const shoulderR = shoulder.clone(); shoulderR.position.set(0.35, 1.62, 0); shoulderR.scale.set(1.2, 0.58, 0.72); root.add(shoulderR);

  const armL = new Mesh(new CapsuleGeometry(0.105, 0.56, 6, 12), navy);
  armL.position.set(-0.52, 1.28, 0); armL.rotation.z = -0.18; root.add(armL);
  const armR = armL.clone(); armR.position.x = 0.52; armR.rotation.z = 0.18; root.add(armR);
  const hand = new Mesh(new SphereGeometry(0.12, 12, 8), skin);
  const handL = hand.clone(); handL.position.set(-0.62, 0.94, 0); root.add(handL);
  const handR = hand.clone(); handR.position.set(0.62, 0.94, 0); root.add(handR);
  const finger = new Mesh(new CapsuleGeometry(0.025, 0.09, 4, 6), skin);
  [-0.65, -0.62, -0.59].forEach((x, index) => { const item = finger.clone(); item.position.set(x, 0.86 - index * 0.012, 0.035); item.rotation.z = -0.12; root.add(item); });
  [0.59, 0.62, 0.65].forEach((x, index) => { const item = finger.clone(); item.position.set(x, 0.86 - index * 0.012, 0.035); item.rotation.z = 0.12; root.add(item); });

  const leg = new Mesh(new CapsuleGeometry(athletic ? 0.11 : 0.115, athletic ? 1.05 : 0.92, 6, 10), skin);
  const legL = leg.clone(); legL.position.set(athletic ? -0.16 : -0.17, athletic ? -0.39 : -0.35, 0); root.add(legL);
  const legR = leg.clone(); legR.position.set(athletic ? 0.16 : 0.17, athletic ? -0.39 : -0.35, 0); root.add(legR);
  const shoe = new Mesh(new SphereGeometry(0.16, 14, 10), dark);
  const shoeL = shoe.clone(); shoeL.position.set(athletic ? -0.17 : -0.18, athletic ? -1.0 : -0.91, 0.08); shoeL.scale.set(1.15, 0.46, 1.45); root.add(shoeL);
  const shoeR = shoe.clone(); shoeR.position.set(athletic ? 0.17 : 0.18, athletic ? -1.0 : -0.91, 0.08); shoeR.scale.set(1.15, 0.46, 1.45); root.add(shoeR);
  const shoeAccent = new Mesh(new TorusGeometry(0.11, 0.018, 6, 16), gold);
  const shoeAccentL = shoeAccent.clone(); shoeAccentL.position.set(athletic ? -0.17 : -0.18, athletic ? -0.99 : -0.9, 0.19); shoeAccentL.rotation.x = Math.PI / 2; shoeAccentL.scale.z = 0.55; root.add(shoeAccentL);
  const shoeAccentR = shoeAccent.clone(); shoeAccentR.position.set(athletic ? 0.17 : 0.18, athletic ? -0.99 : -0.9, 0.19); shoeAccentR.rotation.x = Math.PI / 2; shoeAccentR.scale.z = 0.55; root.add(shoeAccentR);

  const mic = new Group();
  const micBody = new Mesh(new CylinderGeometry(0.045, 0.055, 0.48, 12), dark);
  micBody.rotation.z = -0.35; mic.add(micBody);
  const micHead = new Mesh(new SphereGeometry(0.09, 14, 10), gold);
  micHead.position.set(0.08, 0.22, 0); mic.add(micHead);
  mic.position.set(0.48, 1.04, 0.22); root.add(mic);

  root.userData = { torso, armL, armR, handL, handR, mouth, mic };
  root.scale.setScalar(1.15);
  return root;
}

export default function LukitaBlockoutViewer({ modelUrl, pose, expression, silhouette = false, lightIntensity = 3.2, lightAzimuth = 45, wireframe = false, cameraPreset = "reset", cameraAzimuth = 0, zoom = 1, clipping = false, clipHeight = 0, proportionVariant = "athletic", cameraElevation = 0.02, cameraPanX = 0, cameraPanY = 0, mockMode = false, retryToken = 0, backgroundColor = "#07131b", onModelStateChange, onStats }: ViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new Scene();
    const safeBackground = /^#[0-9a-fA-F]{6}$/.test(backgroundColor) ? backgroundColor : "#07131b";
    scene.background = new Color(safeBackground);
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.25, 6.8);
    camera.lookAt(0, 1.05, 0);
    const renderer = new WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.localClippingEnabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.domElement.setAttribute("aria-label", "Visor 3D del blockout de Lukita");
    renderer.domElement.style.touchAction = "none";
    host.appendChild(renderer.domElement);
    let isDragging = false;
    let panMode = false;
    let lastX = 0;
    let lastY = 0;
    let azimuth = clampCameraAzimuth(cameraPreset === "side" ? Math.PI / 2 : MathUtils.degToRad(cameraAzimuth));
    let elevation = clampCameraElevation(cameraElevation);
    let panX = clampCameraPan(cameraPanX);
    let panY = clampCameraPan(cameraPanY);
    let radius = 6.8 / clampCameraZoom(zoom ?? 1);
    const onPointerDown = (event: PointerEvent) => { isDragging = true; panMode = event.button === 2 || event.shiftKey || event.altKey; lastX = event.clientX; lastY = event.clientY; renderer.domElement.setPointerCapture(event.pointerId); };
    const onPointerMove = (event: PointerEvent) => { if (!isDragging) return; const dx = event.clientX - lastX; const dy = event.clientY - lastY; if (panMode) { panX = clampCameraPan(panX + dx * 0.006); panY = clampCameraPan(panY - dy * 0.006); } else { azimuth = clampCameraAzimuth(azimuth + dx * 0.012); elevation = clampCameraElevation(elevation + dy * 0.008); } lastX = event.clientX; lastY = event.clientY; };
    const onPointerUp = () => { isDragging = false; panMode = false; };
    const onWheel = (event: WheelEvent) => { event.preventDefault(); radius = MathUtils.clamp(radius + event.deltaY * 0.006, 4.8, 9); };
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("contextmenu", onContextMenu);

    const hemi = new HemisphereLight(0xd8f3ff, 0x142115, 2.4); scene.add(hemi);
    const key = new DirectionalLight(0xfff2d1, lightIntensity); const radians = MathUtils.degToRad(lightAzimuth); key.position.set(Math.sin(radians) * 4, 5, Math.cos(radians) * 4); key.castShadow = true; scene.add(key);
    const rim = new PointLight(0x3dd8c0, 12, 8); rim.position.set(-3, 2, -1); scene.add(rim);
    const floor = new Mesh(new CircleGeometry(2.25, 48), new MeshStandardMaterial({ color: 0x0f2930, roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.77; floor.receiveShadow = true; scene.add(floor);

    const clippingPlane = new Plane(new Vector3(0, -1, 0), clipHeight);
    const reportStats = (object: Object3D) => { let vertices = 0; let polygons = 0; object.traverse((node) => { const mesh = node as Mesh; if (!mesh.isMesh || !mesh.geometry?.attributes?.position) return; const position = mesh.geometry.attributes.position; vertices += position.count; polygons += mesh.geometry.index ? Math.floor(mesh.geometry.index.count / 3) : Math.floor(position.count / 3); }); onStats?.({ vertices, polygons }); };
    const applyWireframe = (object: Object3D) => { object.traverse((node) => { const mesh = node as Mesh; if (!mesh.isMesh) return; const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]; materials.forEach((material) => { if ("wireframe" in material) { const standard = material as MeshStandardMaterial; standard.wireframe = wireframe; standard.clippingPlanes = clipping ? [clippingPlane] : []; } }); }); };
    let subject: Object3D = createBlockout(proportionVariant);
    applyWireframe(subject);
    onModelStateChange?.(mockMode || !modelUrl ? "mock" : "loading");
    reportStats(subject);
    scene.add(subject);
    let cancelled = false;
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => { if (!cancelled) { scene.remove(subject); subject = gltf.scene; subject.position.y = -0.72; subject.scale.setScalar(1.65); applyWireframe(subject); reportStats(subject); scene.add(subject); onModelStateChange?.("ready"); } }, undefined, () => { if (!cancelled) onModelStateChange?.("fallback"); });
    }

    const resize = () => { const width = host.clientWidth || 420; const height = host.clientHeight || 520; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(host);
    const clock = new Clock();
    const animate = () => {
      if (cancelled) return;
      const delta = clock.getDelta();
      const data = subject.userData as Record<string, Object3D>;
      if (cameraPreset === "top") { camera.position.set(panX, 6.8, 0.01 + panY); } else { const horizontal = Math.cos(elevation) * radius; camera.position.x = panX + Math.sin(azimuth) * horizontal; camera.position.y = 1.25 + Math.sin(elevation) * radius; camera.position.z = Math.cos(azimuth) * horizontal; }
      camera.lookAt(panX, 1.05 + panY, 0);
      if (!modelUrl && data.torso) {
        const targetArm = pose === "welcome" ? -0.85 : pose === "present" ? -0.45 : pose === "celebrate" ? -1.18 : pose === "contingency" ? -0.22 : -0.18;
        data.armL.rotation.z = MathUtils.damp(data.armL.rotation.z, targetArm, 5, delta);
        data.armR.rotation.z = MathUtils.damp(data.armR.rotation.z, pose === "celebrate" ? 1.18 : pose === "present" ? 0.42 : 0.18, 5, delta);
        data.mouth.scale.x = expression === "smile" || expression === "celebrate" ? 1.25 : expression === "contingency" ? 0.72 : 1;
        subject.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.12;
      }
      if (silhouette) { scene.background = new Color(0x020508); } else { scene.background = new Color(safeBackground); }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelled = true; observer.disconnect(); renderer.domElement.removeEventListener("pointerdown", onPointerDown); renderer.domElement.removeEventListener("pointermove", onPointerMove); renderer.domElement.removeEventListener("pointerup", onPointerUp); renderer.domElement.removeEventListener("pointercancel", onPointerUp); renderer.domElement.removeEventListener("wheel", onWheel); renderer.domElement.removeEventListener("contextmenu", onContextMenu); renderer.dispose(); host.removeChild(renderer.domElement); };
  }, [modelUrl, pose, expression, silhouette, lightIntensity, lightAzimuth, wireframe, cameraPreset, cameraAzimuth, clipping, clipHeight, zoom, proportionVariant, cameraElevation, cameraPanX, cameraPanY, mockMode, retryToken, backgroundColor, onModelStateChange, onStats]);

  return <div ref={hostRef} className="h-full min-h-[360px] w-full" />;
}
