import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import type * as THREE from "three";
import { arFallbackLabel, distanceMeters, isPublishedPoi, normalizePublishedPoi, type ArAvailability, type GpsState, type PublishedPoi } from "../../../shared/arProductive";

type ThreeModule = typeof import("three");

const DEFAULT_MODEL_URL =
  "/manus-storage/lukita-ar-stage-candidate-blockout-fixed_e1d5ceed.glb";
const CHARACTER_REFERENCE_URL =
  "/manus-storage/lukita-character-foundation-reference_0f52a9ed.png";
const steps = [
  [
    "Explora Lukita",
    "Este espacio prueba la presencia espacial de Lukita sin modificar el juego.",
  ],
  [
    "Encuentra una superficie",
    "Mueve suavemente el celular hasta que el visor esté listo para colocarla.",
  ],
  [
    "Coloca y ajusta",
    "Con un dedo rota la figura; con dos dedos pellizca para escalar y arrastra para desplazar.",
  ],
  [
    "Controla la escena",
    "Usa volumen, mute y Lukita Star Trail para una presentación más expresiva.",
  ],
];

type Point = { x: number; y: number };
type VideoReview = {
  url: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
};

export default function LukitaARStagePage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<ThreeModule | null>(null);
  const gltfLoaderRef = useRef<{ load: (url: string, onLoad: (gltf: { scene: THREE.Object3D }) => void, onProgress?: (event: unknown) => void, onError?: (error: unknown) => void) => void } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const candidateRootRef = useRef<THREE.Group | null>(null);
  const starRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemisphereRef = useRef<THREE.HemisphereLight | null>(null);
  const placementHelperRef = useRef<THREE.BoxHelper | null>(null);
  const burstRef = useRef<THREE.Mesh[]>([]);
  const appearanceRef = useRef({ startedAt: 0, duration: 650 });
  const performanceRef = useRef({ frames: 0, lastSample: 0 });
  const originalTransformRef = useRef<{ position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 } | null>(null);
  const trailRef = useRef<THREE.Mesh[]>([]);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef({ lastX: 0, lastY: 0, pinchDistance: 0 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(0);
  const [volume, setVolume] = useState(58);
  const [muted, setMuted] = useState(false);
  const [trailColor, setTrailColor] = useState("#ffe34d");
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL_URL);
  const [modelLocation, setModelLocation] = useState("center");
  const [modelElement, setModelElement] = useState("full");
  const [modelStatus, setModelStatus] = useState(
    "Candidato GLB de demostración listo"
  );
  const [lightIntensity, setLightIntensity] = useState(2.5);
  const [lightColor, setLightColor] = useState("#fff1cf");
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    memoryMb: null as number | null,
  });
  const [arReady, setArReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState<number | null>(
    null
  );
  const [captureStatus, setCaptureStatus] = useState("");
  const [lightPresetName, setLightPresetName] = useState("");
  const [lightPresets, setLightPresets] = useState<
    Array<{ name: string; intensity: number; color: string }>
  >([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingMimeRef = useRef("video/webm");
  const recordingChunksRef = useRef<Blob[]>([]);
  const [showPlacementBox, setShowPlacementBox] = useState(true);
  const [videoReview, setVideoReview] = useState<VideoReview | null>(null);
  const [showCharacterReference, setShowCharacterReference] = useState(false);
  const [arAvailability, setArAvailability] = useState<ArAvailability>("CHECKING");
  const [gpsState, setGpsState] = useState<GpsState>("UNKNOWN");
  const [position, setPosition] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [poiError, setPoiError] = useState("");
  const [, navigate] = useLocation();
  const publishedWorld = trpc.territorial.getPublishedWorld.useQuery();
  const publishedPois = (publishedWorld.data ?? []).filter(isPublishedPoi).slice(0, 24).map(normalizePublishedPoi) as PublishedPoi[];
  const nearbyPois = position ? publishedPois.map(poi => ({ ...poi, distance: distanceMeters(position, poi) })).sort((a, b) => a.distance - b.distance).slice(0, 4) : [];
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [referenceImageError, setReferenceImageError] = useState("");
  const [placeholderTransform, setPlaceholderTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const placeholderPointersRef = useRef(new Map<number, Point>());
  const placeholderGestureRef = useRef({ x: 0, y: 0, distance: 0, scale: 1 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [THREE, controlsModule, gltfModule, arModule] = await Promise.all([
        import("three"),
        import("three/addons/controls/OrbitControls.js"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/webxr/ARButton.js"),
      ]);
      if (disposed) return;
      setIsInitializing(false);
      const { OrbitControls } = controlsModule;
      const { GLTFLoader } = gltfModule;
      const { ARButton } = arModule;
      threeRef.current = THREE;
      gltfLoaderRef.current = new GLTFLoader();
      const scene = new THREE.Scene();
    scene.background = new THREE.Color("#06120e");
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.01,
      100
    );
    camera.position.set(0, 1.25, 3.8);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.xr.enabled = true;
    mount.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);
    const hemisphere = new THREE.HemisphereLight(0xb9ffe8, 0x10251e, 2.2);
    scene.add(hemisphere);
    hemisphereRef.current = hemisphere;
    const key = new THREE.DirectionalLight(lightColor, lightIntensity);
    key.position.set(2, 4, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    keyLightRef.current = key;
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 64),
      new THREE.MeshBasicMaterial({
        color: 0x0d2b23,
        transparent: true,
        opacity: 0.72,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const modelRoot = new THREE.Group();
    modelRoot.position.set(0, 0, 0);
    scene.add(modelRoot);
    modelRootRef.current = modelRoot;
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.38, 1.05, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0xd9fff1,
        roughness: 0.62,
        metalness: 0.08,
      })
    );
    body.position.y = 0.85;
    body.castShadow = true;
    body.receiveShadow = true;
    modelRoot.add(body);
    const referenceTexture = new THREE.TextureLoader().load(CHARACTER_REFERENCE_URL);
    const referenceSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: referenceTexture,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      }),
    );
    referenceSprite.position.set(0, 1.05, 0.2);
    referenceSprite.scale.set(1.35, 1.85, 1);
    modelRoot.add(referenceSprite);
    setModelStatus("Placeholder visual de Lukita activo · GLB candidato en validación");
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16, 0),
      new THREE.MeshBasicMaterial({ color: trailColor })
    );
    star.position.set(0, 1.45, 0.34);
    modelRoot.add(star);
    starRef.current = star;
    const trail: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i += 1) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.025 + (8 - i) * 0.003, 8, 8),
        new THREE.MeshBasicMaterial({
          color: trailColor,
          transparent: true,
          opacity: (8 - i) / 16,
        })
      );
      modelRoot.add(dot);
      trail.push(dot);
    }
    trailRef.current = trail;
    const loader = new GLTFLoader();
    loader.load(
      DEFAULT_MODEL_URL,
      gltf => {
        gltf.scene.scale.setScalar(0.8);
        gltf.scene.position.set(0, 0, 0);
        attachCandidate(gltf.scene);
        setModelStatus(
          "GLB candidato cargado por defecto · no sustituye al maestro"
        );
      },
      undefined,
      () =>
        setModelStatus(
          "Placeholder visual activo · el GLB por defecto no pudo cargarse; puedes reintentar o cargar otro candidato"
        )
    );
    const animate = () => {
      performanceRef.current.frames += 1;
      const now = performance.now();
      if (now - performanceRef.current.lastSample >= 500) {
        const elapsed = Math.max(1, now - performanceRef.current.lastSample);
        const fps = Math.round(
          (performanceRef.current.frames * 1000) / elapsed
        );
        const memory = (
          performance as Performance & { memory?: { usedJSHeapSize: number } }
        ).memory;
        setPerformanceStats({
          fps,
          memoryMb: memory
            ? Math.round(memory.usedJSHeapSize / 1024 / 1024)
            : null,
        });
        performanceRef.current = { frames: 0, lastSample: now };
      }
      star.rotation.y += 0.02;
      trail.forEach((dot, i) => {
        dot.position.x = star.position.x - 0.06 * (i + 1);
        dot.position.y = star.position.y - 0.018 * (i + 1);
        dot.position.z = star.position.z + 0.015 * (i + 1);
      });
      const candidateRoot = candidateRootRef.current;
      if (placementHelperRef.current) {
        placementHelperRef.current.visible = showPlacementBox;
        placementHelperRef.current.update();
      }
      if (candidateRoot && appearanceRef.current.startedAt) {
        const progress = Math.min(
          1,
          (performance.now() - appearanceRef.current.startedAt) /
            appearanceRef.current.duration
        );
        candidateRoot.scale.setScalar(
          THREE.MathUtils.smoothstep(progress, 0, 1)
        );
        if (progress >= 1) appearanceRef.current.startedAt = 0;
      }
      burstRef.current.forEach((particle, index) => {
        const material = particle.material as THREE.MeshBasicMaterial;
        const progress = Math.min(
          1,
          (performance.now() - appearanceRef.current.startedAt) / 650
        );
        const angle =
          (index / Math.max(1, burstRef.current.length)) * Math.PI * 2;
        particle.position.x += Math.cos(angle) * 0.004;
        particle.position.y += Math.sin(angle) * 0.003;
        material.opacity = appearanceRef.current.startedAt
          ? Math.max(0, 0.9 - progress)
          : 0;
      });
      controls.update();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);
    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const onPointerDown = (event: PointerEvent) => {
      mount.setPointerCapture?.(event.pointerId);
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      if (pointersRef.current.size === 2) {
        const points = Array.from(pointersRef.current.values());
        gestureRef.current.pinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
      } else {
        gestureRef.current.lastX = event.clientX;
        gestureRef.current.lastY = event.clientY;
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      const root = modelRootRef.current;
      if (!root) return;
      if (pointersRef.current.size === 2) {
        const points = Array.from(pointersRef.current.values());
        const distance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
        if (gestureRef.current.pinchDistance > 0)
          root.scale.multiplyScalar(
            THREE.MathUtils.clamp(
              distance / gestureRef.current.pinchDistance,
              0.96,
              1.04
            )
          );
        gestureRef.current.pinchDistance = distance;
      } else {
        root.rotation.y += (event.clientX - gestureRef.current.lastX) * 0.008;
        root.position.x += (event.clientX - gestureRef.current.lastX) * 0.002;
        root.position.y -= (event.clientY - gestureRef.current.lastY) * 0.002;
        gestureRef.current.lastX = event.clientX;
        gestureRef.current.lastY = event.clientY;
      }
      event.preventDefault();
    };
    const onPointerUp = (event: PointerEvent) => {
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size < 2) gestureRef.current.pinchDistance = 0;
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", resize);
    if ("xr" in navigator) {
      try {
        const button = ARButton.createButton(renderer, {
          optionalFeatures: ["dom-overlay"],
          domOverlay: { root: mount },
        });
        button.className =
          "absolute bottom-4 left-4 z-20 border border-[#6dffd0] bg-[#06261e]/90 px-4 py-2 text-xs font-semibold text-[#baffea]";
        mount.appendChild(button);
        setArReady(true);
        setArAvailability("AVAILABLE");
      } catch {
        setArReady(false);
        setArAvailability("UNAVAILABLE");
      }
    } else {
      setArReady(false);
      setArAvailability("UNAVAILABLE");
    }
    cleanup = () => {
      renderer.setAnimationLoop(null);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      threeRef.current = null;
      gltfLoaderRef.current = null;
    };
    })();
    return () => { disposed = true; cleanup?.(); };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsState("UNAVAILABLE");
      return;
    }
    setGpsState("REQUESTING");
    const watchId = navigator.geolocation.watchPosition(
      value => {
        setPosition({ latitude: value.coords.latitude, longitude: value.coords.longitude, accuracy: value.coords.accuracy });
        setGpsState("READY");
        setPoiError("");
      },
      error => {
        setGpsState(error.code === error.PERMISSION_DENIED ? "DENIED" : "UNAVAILABLE");
        setPoiError(error.code === error.PERMISSION_DENIED ? "Permiso de ubicación denegado; los POIs publicados permanecen disponibles al reintentar." : "No se pudo obtener la ubicación del dispositivo.");
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const three = threeRef.current;
    if (!three) return;
    const color = new three.Color(trailColor);
    if (starRef.current)
      (starRef.current.material as THREE.MeshBasicMaterial).color.copy(color);
    trailRef.current.forEach(dot =>
      (dot.material as THREE.MeshBasicMaterial).color.copy(color)
    );
  }, [trailColor]);

  useEffect(() => {
    if (keyLightRef.current) {
      keyLightRef.current.intensity = lightIntensity;
      keyLightRef.current.color.set(lightColor);
    }
  }, [lightIntensity, lightColor]);

  useEffect(() => {
    if (placementHelperRef.current)
      placementHelperRef.current.visible = showPlacementBox;
  }, [showPlacementBox]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("lukita-ar-stage-light-presets") ?? "[]"
      );
      if (Array.isArray(saved))
        setLightPresets(
          saved
            .filter(
              preset =>
                typeof preset?.name === "string" &&
                typeof preset?.intensity === "number"
            )
            .map(preset => ({
              name: preset.name,
              intensity: preset.intensity,
              color:
                typeof preset.color === "string" ? preset.color : "#fff1cf",
            }))
        );
    } catch {
      setLightPresets([]);
    }
  }, []);

  const attachCandidate = (candidate: THREE.Object3D) => {
    const THREE = threeRef.current;
    const root = modelRootRef.current;
    if (!THREE) return;
    if (!root) return;
    if (candidateRootRef.current) root.remove(candidateRootRef.current);
    if (placementHelperRef.current && sceneRef.current)
      sceneRef.current.remove(placementHelperRef.current);
    const candidateRoot = new THREE.Group();
    const placement: Record<string, [number, number, number]> = {
      center: [0, 0, 0],
      left: [-0.75, 0, 0],
      right: [0.75, 0, 0],
      elevated: [0, 0.35, 0],
    };
    candidateRoot.position.set(
      ...(placement[modelLocation] ?? placement.center)
    );
    const scale =
      modelElement === "face" ? 1.25 : modelElement === "prop" ? 0.55 : 0.8;
    candidateRoot.scale.setScalar(0.04);
    candidate.scale.setScalar(scale);
    candidate.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    candidateRoot.add(candidate);
    root.add(candidateRoot);
    candidateRootRef.current = candidateRoot;
    const placementHelper = new THREE.BoxHelper(candidateRoot, 0x6dffd0);
    placementHelper.visible = showPlacementBox;
    sceneRef.current?.add(placementHelper);
    placementHelperRef.current = placementHelper;
    originalTransformRef.current = {
      position: candidateRoot.position.clone(),
      rotation: candidateRoot.rotation.clone(),
      scale: new THREE.Vector3(1, 1, 1),
    };
    appearanceRef.current.startedAt = performance.now();
    const burst = Array.from({ length: 12 }, (_, index) => {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 6, 6),
        new THREE.MeshBasicMaterial({
          color: trailColor,
          transparent: true,
          opacity: 0.9,
        })
      );
      const angle = (index / 12) * Math.PI * 2;
      particle.position.set(
        candidateRoot.position.x,
        0.85 + Math.sin(angle) * 0.15,
        Math.cos(angle) * 0.15
      );
      sceneRef.current?.add(particle);
      return particle;
    });
    burstRef.current = burst;
    setModelStatus(
      "GLB candidato cargado · ubicación y elemento seleccionados"
    );
  };

  const resetModelTransform = () => {
    const candidateRoot = candidateRootRef.current;
    const original = originalTransformRef.current;
    if (!candidateRoot || !original) return;
    candidateRoot.position.copy(original.position);
    candidateRoot.rotation.copy(original.rotation);
    candidateRoot.scale.copy(original.scale);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  const captureScene = () => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return;
      downloadBlob(blob, `lukita-ar-stage-${Date.now()}.png`);
      setCaptureStatus("Captura PNG descargada");
    }, "image/png");
  };

  const startRecording = () => {
    const canvas = rendererRef.current?.domElement;
    if (
      !canvas ||
      typeof MediaRecorder === "undefined" ||
      !(canvas as HTMLCanvasElement).captureStream
    ) {
      setCaptureStatus("La grabación no está disponible en este navegador");
      return;
    }
    if (recorderRef.current) {
      recorderRef.current.stop();
      return;
    }
    const stream = canvas.captureStream(30);
    const supportedMimeTypes = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm",
    ];
    const mimeType = supportedMimeTypes.find(candidate =>
      MediaRecorder.isTypeSupported(candidate)
    );
    if (!mimeType) {
      setCaptureStatus(
        "Este navegador no expone un codificador de video compatible"
      );
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    const isMp4 = mimeType.startsWith("video/mp4");
    recordingMimeRef.current = mimeType;
    const recorder = new MediaRecorder(stream, { mimeType });
    recordingChunksRef.current = [];
    recorder.ondataavailable = event => {
      if (event.data.size) recordingChunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const extension = recordingMimeRef.current.startsWith("video/mp4")
        ? "mp4"
        : "webm";
      const blob = new Blob(recordingChunksRef.current, {
        type: recordingMimeRef.current,
      });
      const fileName = `lukita-live-${Date.now()}.${extension}`;
      setVideoReview(previous => {
        if (previous) URL.revokeObjectURL(previous.url);
        return {
          url: URL.createObjectURL(blob),
          blob,
          mimeType: recordingMimeRef.current,
          fileName,
        };
      });
      stream.getTracks().forEach(track => track.stop());
      recorderRef.current = null;
      setIsRecording(false);
      setCaptureStatus(
        isMp4
          ? "Video MP4 listo para revisar y compartir"
          : "MP4 no está disponible aquí · video WebM listo para revisar"
      );
    };
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
    setCaptureStatus(
      isMp4
        ? "Grabando MP4 · pulsa Detener para revisar"
        : "Grabando WebM · este navegador no expone MP4"
    );
  };

  const beginRecording = () => {
    if (recordingCountdown !== null || recorderRef.current) return;
    setRecordingCountdown(3);
    let remaining = 3;
    const timer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(timer);
        setRecordingCountdown(null);
        startRecording();
      } else setRecordingCountdown(remaining);
    }, 1000);
  };

  const toggleRecording = () => {
    if (recorderRef.current) recorderRef.current.stop();
    else beginRecording();
  };

  const downloadReviewedVideo = () => {
    if (videoReview) downloadBlob(videoReview.blob, videoReview.fileName);
  };

  const shareReviewedVideo = async () => {
    if (!videoReview) return;
    const file = new File([videoReview.blob], videoReview.fileName, {
      type: videoReview.mimeType,
    });
    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare({ files: [file] }))
    ) {
      try {
        await navigator.share({
          title: "Mi momento con Lukita",
          text: "Creado en Lukita Live",
          files: [file],
        });
        setCaptureStatus("Video compartido desde el menú del dispositivo");
      } catch {
        setCaptureStatus(
          "Compartir cancelado · el video permanece en revisión"
        );
      }
      return;
    }
    downloadReviewedVideo();
    setCaptureStatus(
      "Video descargado · adjúntalo manualmente en tu red social"
    );
  };

  const openSocialShare = (
    network: "x" | "whatsapp" | "instagram" | "tiktok"
  ) => {
    if (!videoReview) return;
    downloadReviewedVideo();
    const text = encodeURIComponent("Mi momento con Lukita Live");
    const urls = {
      x: `https://twitter.com/intent/tweet?text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(window.location.href)}`,
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/upload",
    };
    window.open(urls[network], "_blank", "noopener,noreferrer");
    setCaptureStatus(
      "Video descargado · completa el envío en la red social seleccionada"
    );
  };

  const closeVideoReview = () => {
    if (videoReview) URL.revokeObjectURL(videoReview.url);
    setVideoReview(null);
  };

  const onPlaceholderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    placeholderPointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const points = Array.from(placeholderPointersRef.current.values());
    if (points.length === 2) {
      placeholderGestureRef.current.distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
      placeholderGestureRef.current.scale = placeholderTransform.scale;
    } else {
      placeholderGestureRef.current = {
        x: event.clientX,
        y: event.clientY,
        distance: 0,
        scale: placeholderTransform.scale,
      };
    }
    event.preventDefault();
  };

  const onPlaceholderPointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!placeholderPointersRef.current.has(event.pointerId)) return;
    placeholderPointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const points = Array.from(placeholderPointersRef.current.values());
    if (points.length >= 2) {
      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
      const startDistance = placeholderGestureRef.current.distance;
      if (startDistance > 0)
        setPlaceholderTransform(current => ({
          ...current,
          scale: Math.min(2.4, Math.max(0.45, (placeholderGestureRef.current.scale * distance) / startDistance)),
        }));
    } else {
      const dx = event.clientX - placeholderGestureRef.current.x;
      const dy = event.clientY - placeholderGestureRef.current.y;
      setPlaceholderTransform(current => ({
        ...current,
        x: Math.min(180, Math.max(-180, current.x + dx)),
        y: Math.min(180, Math.max(-180, current.y + dy)),
      }));
      placeholderGestureRef.current.x = event.clientX;
      placeholderGestureRef.current.y = event.clientY;
    }
    event.preventDefault();
  };

  const onPlaceholderPointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    placeholderPointersRef.current.delete(event.pointerId);
    if (placeholderPointersRef.current.size < 2)
      placeholderGestureRef.current.distance = 0;
  };

  const resetPlaceholderTransform = () =>
    setPlaceholderTransform({ x: 0, y: 0, scale: 1 });

  const saveLightPreset = () => {
    const name = lightPresetName.trim() || `Luz ${lightPresets.length + 1}`;
    const next = [
      ...lightPresets.filter(preset => preset.name !== name),
      { name, intensity: lightIntensity, color: lightColor },
    ].slice(-8);
    setLightPresets(next);
    localStorage.setItem("lukita-ar-stage-light-presets", JSON.stringify(next));
    setLightPresetName("");
  };

  const applyLightPreset = (preset: {
    name: string;
    intensity: number;
    color: string;
  }) => {
    setLightIntensity(preset.intensity);
    setLightColor(preset.color);
  };

  const retryDefaultModel = () => {
    if (!gltfLoaderRef.current || !sceneRef.current || !modelRootRef.current) {
      setModelStatus("Motor 3D aún no está listo; espera un momento y reintenta.");
      return;
    }
    setModelStatus("Reintentando carga del GLB por defecto…");
    gltfLoaderRef.current.load(
      DEFAULT_MODEL_URL,
      gltf => attachCandidate(gltf.scene),
      undefined,
      () => setModelStatus("Fallback 3D activo · asset GLB no disponible; puedes cargar otro candidato.")
    );
  };

  const loadModel = () => {
    if (!modelUrl.trim() || !sceneRef.current || !modelRootRef.current) return;
    setModelStatus("Cargando GLB candidato…");
    gltfLoaderRef.current?.load(
      modelUrl.trim(),
      gltf => attachCandidate(gltf.scene),
      undefined,
      () =>
        setModelStatus(
          "No se pudo cargar el GLB. Verifica URL, CORS y formato."
        )
    );
  };

  const handleReferenceImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setReferenceImageError("Selecciona una imagen PNG, JPG o WebP."); return; }
    if (file.size > 5 * 1024 * 1024) { setReferenceImageError("La imagen debe pesar como máximo 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { setReferenceImageUrl(typeof reader.result === "string" ? reader.result : null); setReferenceImageError(""); setShowCharacterReference(true); setModelStatus("Referencia visual local cargada · placeholder interactivo"); };
    reader.onerror = () => setReferenceImageError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  };
  const handleLocalGlb = (file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".glb")) { setModelStatus("Selecciona un archivo .glb válido"); return; }
    const localUrl = URL.createObjectURL(file);
    setModelUrl(localUrl);
    setModelStatus("GLB local seleccionado · pulsa Previsualizar candidato");
  };

  return (
    <main className="min-h-screen bg-[#03100c] text-[#eafff7]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1c5545] pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6dffd0]">
              Lukita Spatial Experience
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Lukita AR Stage
            </h1>
            <p className="mt-1 text-sm text-[#a8cfc2]">
              Prototipo aislado · revisión de presencia espacial
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="border border-[#6dffd0]/50 px-3 py-2 text-xs font-semibold text-[#baffea] hover:bg-[#6dffd0]/10 focus:outline-none focus:ring-2 focus:ring-[#6dffd0]">← Menú principal</Link>
            <span className="border border-[#315d50] px-3 py-2 text-xs text-[#b3d8cc]" role="status" aria-label="Disponibilidad de realidad aumentada">
              {arReady ? "WebXR disponible" : arFallbackLabel(arAvailability)}
            </span>
            <span className={`border px-3 py-2 text-xs ${gpsState === "READY" ? "border-emerald-300/40 text-emerald-100" : "border-amber-200/30 text-amber-100"}`} role="status" aria-label="Estado del GPS">
              GPS · {gpsState === "READY" ? `${position?.accuracy ? Math.round(position.accuracy) : "—"} m` : gpsState.toLowerCase()}
            </span>
            {!arReady ? <button type="button" onClick={() => navigate("/luka-entry")} className="border border-[#ffd36d]/50 bg-[#2a2110]/70 px-3 py-2 text-xs text-[#ffe5a3]">Continuar en 2D</button> : null}
            <button
              className="border border-[#315d50] px-3 py-2 text-xs text-[#b3d8cc]"
              onClick={() => setShowWelcome(true)}
            >
              Tutorial
            </button>
          </div>
        </header>
        <section className="grid flex-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {" "}
          <div className="relative min-h-[560px] overflow-hidden border border-[#51e8bb] bg-[#071914] shadow-[0_0_32px_rgba(81,232,187,0.16)]">
            <div ref={mountRef} className="absolute inset-0 touch-none" />
            {isInitializing ? <div className="absolute inset-0 z-10 grid place-items-center bg-[#03100c]/85 backdrop-blur-sm" role="status" aria-live="polite"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#315d50] border-t-[#6dffd0]" aria-hidden="true" /><p className="mt-4 text-sm font-semibold text-[#baffea]">Preparando escena LUKA AR…</p><p className="mt-1 text-xs text-[#86b5a5]">Cargando motor 3D y experiencia espacial</p></div></div> : null}
            <div className="pointer-events-none absolute left-5 top-5 border border-[#2f7965] bg-[#061b15]/75 px-3 py-2 text-xs text-[#baffea]">
              ESCENA DE PRUEBA · {modelStatus}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCharacterReference(value => !value);
                setModelStatus(
                  showCharacterReference
                    ? "Referencia visual oculta · GLB candidato activo"
                    : "Referencia visual de Lukita activa · placeholder interactivo"
                );
              }}
              className={`absolute left-5 top-16 z-10 flex items-center gap-2 border px-2 py-2 text-left text-[11px] transition-colors duration-200 ${showCharacterReference ? "border-[#ffd36d] bg-[#2a2110]/90 text-[#ffe5a3]" : "border-[#2f7965] bg-[#061b15]/80 text-[#baffea]"}`}
              aria-pressed={showCharacterReference}
            >
              <img
                src={referenceImageUrl ?? "/manus-storage/lukita-character-foundation-reference_0f52a9ed.png"}
                alt=""
                className="h-8 w-8 object-cover object-top"
              />
              <span>
                {showCharacterReference
                  ? "Placeholder Lukita activo"
                  : "Mostrar referencia Lukita"}
              </span>
            </button>
            {showCharacterReference ? (
              <div className="absolute left-5 top-28 z-10 mt-1 w-40 border border-[#ffd36d]/60 bg-[#061b15]/95 p-2 text-[10px] leading-4 text-[#ffe5a3]">
                Referencia interactiva para composición y escala. No sustituye
                el modelo 3D maestro.
              </div>
            ) : null}
            {showCharacterReference ? (
              <div
                className="absolute inset-x-16 bottom-24 top-24 z-10 grid place-items-center touch-none select-none"
                onPointerDown={onPlaceholderPointerDown}
                onPointerMove={onPlaceholderPointerMove}
                onPointerUp={onPlaceholderPointerUp}
                onPointerCancel={onPlaceholderPointerUp}
                role="application"
                aria-label="Placeholder interactivo de Lukita: arrastra para mover y pellizca para redimensionar"
              >
                <div
                  className="relative max-h-full max-w-full cursor-grab active:cursor-grabbing"
                  style={{
                    transform: `translate(${placeholderTransform.x}px, ${placeholderTransform.y}px) scale(${placeholderTransform.scale})`,
                    transition: placeholderPointersRef.current.size
                      ? "none"
                      : "transform 180ms ease-out",
                  }}
                >
                  <img
                    src={referenceImageUrl ?? "/manus-storage/lukita-character-foundation-reference_0f52a9ed.png"}
                    alt="Placeholder interactivo de Lukita"
                    className="max-h-[310px] w-auto max-w-[230px] object-contain opacity-90 drop-shadow-[0_0_22px_rgba(255,211,109,.38)]"
                    draggable={false}
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[#ffd36d]/60 bg-[#061b15]/90 px-2 py-1 text-[10px] text-[#ffe5a3]">
                    Arrastra · pellizca para escalar
                  </span>
                </div>
              </div>
            ) : null}
            <div
              className="absolute right-5 top-5 border border-[#2f7965] bg-[#061b15]/80 px-3 py-2 text-[11px] text-[#baffea]"
              role="status"
              aria-label="Monitor de rendimiento AR"
            >
              <p className="uppercase tracking-[0.16em] text-[#6dffd0]">
                Rendimiento
              </p>
              <p className="mt-1">
                {performanceStats.fps || "—"} FPS ·{" "}
                {performanceStats.memoryMb
                  ? `${performanceStats.memoryMb} MB`
                  : "memoria no expuesta"}
              </p>
            </div>
            <div className="absolute right-5 top-20 z-10 w-[min(280px,calc(100%-2.5rem))] border border-[#2f7965] bg-[#061b15]/90 p-3 text-xs text-[#baffea]" role="region" aria-label="Puntos territoriales publicados">
              <p className="uppercase tracking-[0.16em] text-[#6dffd0]">POIs publicados</p>
              {publishedWorld.isLoading ? <p className="mt-2 text-[#86b5a5]">Consultando World Engine…</p> : null}
              {!publishedWorld.isLoading && !nearbyPois.length ? <p className="mt-2 text-[#86b5a5]">{gpsState === "READY" ? "No hay POIs publicados cercanos." : "Activa el GPS para ordenar los POIs por distancia."}</p> : null}
              {nearbyPois.length ? <div className="mt-2 space-y-2">{nearbyPois.map(poi => <div key={poi.publicId} className="flex items-center justify-between gap-2 border-t border-[#2f7965]/60 pt-2"><span className="truncate">{poi.name}</span><span className="shrink-0 text-[#ffd36d]">{poi.distance} m</span></div>)}</div> : null}
              {poiError ? <p className="mt-2 text-[#ffcf9d]">{poiError}</p> : null}
            </div>
            <div className="absolute bottom-5 right-5 flex flex-wrap justify-end gap-2">
              <button
                className="border border-[#4c806f] bg-[#061b15]/90 px-3 py-2 text-xs"
                onClick={resetModelTransform}
              >
                Restablecer modelo
              </button>
              <button
                className="border border-[#ffd36d]/60 bg-[#2a2110]/90 px-3 py-2 text-xs text-[#ffe5a3]"
                onClick={resetPlaceholderTransform}
                disabled={!showCharacterReference}
              >
                Restablecer Lukita
              </button>
              <button
                className="border border-[#4c806f] bg-[#061b15]/90 px-3 py-2 text-xs"
                onClick={captureScene}
              >
                Capturar PNG
              </button>
              <button
                className={`border px-3 py-2 text-xs ${isRecording ? "border-[#ff9a8b] text-[#ffb8ad]" : "border-[#4c806f] bg-[#061b15]/90"}`}
                onClick={toggleRecording}
              >
                {isRecording ? "Detener video" : "Grabar MP4"}
              </button>
              <button
                className="border border-[#4c806f] bg-[#061b15]/90 px-3 py-2 text-xs"
                onClick={() => setShowWelcome(true)}
              >
                Ayuda
              </button>
            </div>
            {recordingCountdown !== null ? (
              <div
                className="absolute inset-0 z-30 grid place-items-center bg-[#03100c]/55 backdrop-blur-[2px]"
                role="status"
                aria-live="assertive"
                aria-label={`La grabación comenzará en ${recordingCountdown} segundos`}
              >
                <div className="grid h-32 w-32 place-items-center rounded-full border-2 border-[#ffd36d] bg-[#061b15]/90 text-7xl font-black text-[#ffe5a3] shadow-[0_0_40px_rgba(255,211,109,.35)]">
                  {recordingCountdown}
                </div>
                <p className="absolute mt-48 border border-[#ffd36d]/60 bg-[#061b15]/90 px-3 py-2 text-xs text-[#ffe5a3]">
                  Prepárate · la grabación comienza en breve
                </p>
              </div>
            ) : null}
            <p
              className="absolute bottom-1 left-5 text-[11px] text-[#9fe8d0]"
              role="status"
            >
              {captureStatus}
            </p>
          </div>
          {videoReview ? (
            <div
              className="fixed inset-0 z-40 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="video-review-title"
            >
              <div className="w-full max-w-2xl border border-[#6dffd0] bg-[#082119] p-5 shadow-[0_0_50px_rgba(109,255,208,0.2)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6dffd0]">
                      Lukita Live · revisión previa
                    </p>
                    <h2
                      id="video-review-title"
                      className="mt-2 text-2xl font-semibold"
                    >
                      Tu video está listo
                    </h2>
                    <p className="mt-1 text-sm text-[#a8cfc2]">
                      Revisa el resultado antes de descargarlo o compartirlo. No
                      se publica automáticamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeVideoReview}
                    className="text-2xl text-[#b7d8ce]"
                    aria-label="Cerrar revisión"
                  >
                    ×
                  </button>
                </div>
                <video
                  className="mt-5 max-h-[48vh] w-full border border-[#315d50] bg-black object-contain"
                  src={videoReview.url}
                  controls
                  playsInline
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadReviewedVideo}
                    className="bg-[#6dffd0] px-3 py-2 text-xs font-semibold text-[#042019]"
                  >
                    Descargar{" "}
                    {videoReview.fileName.endsWith(".mp4") ? "MP4" : "WebM"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void shareReviewedVideo()}
                    className="border border-[#6dffd0] px-3 py-2 text-xs text-[#d9fff1]"
                  >
                    Compartir desde el dispositivo
                  </button>
                  <button
                    type="button"
                    onClick={() => openSocialShare("x")}
                    className="border border-[#4c806f] px-3 py-2 text-xs"
                  >
                    X
                  </button>
                  <button
                    type="button"
                    onClick={() => openSocialShare("whatsapp")}
                    className="border border-[#4c806f] px-3 py-2 text-xs"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => openSocialShare("instagram")}
                    className="border border-[#4c806f] px-3 py-2 text-xs"
                  >
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => openSocialShare("tiktok")}
                    className="border border-[#4c806f] px-3 py-2 text-xs"
                  >
                    TikTok
                  </button>
                </div>
                <p className="mt-4 text-xs leading-5 text-[#86b5a5]">
                  Las redes sociales abren sus propios flujos. Por privacidad,
                  el archivo se descarga y el usuario decide si lo adjunta y
                  publica.
                </p>
              </div>
            </div>
          ) : null}
          <aside className="space-y-5 border border-[#224b40] bg-[#0b201a]/80 p-5 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#6dffd0]">
                Controles rápidos
              </p>
              <h2 className="mt-2 text-xl font-semibold">Presentación</h2>
            </div>
            <label className="block text-sm text-[#cce8df]">
              Volumen{" "}
              <span className="float-right text-[#6dffd0]">
                {muted ? "Mute" : `${volume}%`}
              </span>
              <input
                className="mt-3 w-full accent-[#6dffd0]"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                disabled={muted}
              />
            </label>
            <button
              className="w-full border border-[#6dffd0] px-4 py-3 text-sm"
              onClick={() => setMuted(value => !value)}
            >
              {muted ? "Activar sonido" : "Silenciar"}
            </button>
            <label className="block text-sm text-[#cce8df]">
              Color de Star Trail
              <input
                className="mt-2 h-11 w-full cursor-pointer border border-[#3a6e5d] bg-[#06130f]"
                type="color"
                value={trailColor}
                onChange={e => setTrailColor(e.target.value)}
              />
            </label>
            <div className="border-t border-[#224b40] pt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6dffd0]">
                Gestos
              </p>
              <p className="mt-2 text-sm text-[#b7d8ce]">
                Un dedo rota y desplaza. Dos dedos muestran contactos y permiten
                pellizcar para escalar.
              </p>
            </div>{" "}
            <div className="border-t border-[#224b40] pt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6dffd0]">
                Colocación del candidato
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-xs text-[#b7d8ce]">
                  Ubicación
                  <select
                    className="mt-1 w-full border border-[#3a6e5d] bg-[#06130f] px-2 py-2 text-xs"
                    value={modelLocation}
                    onChange={e => setModelLocation(e.target.value)}
                  >
                    <option value="center">Centro</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                    <option value="elevated">Elevado</option>
                  </select>
                </label>
                <label className="text-xs text-[#b7d8ce]">
                  Elemento
                  <select
                    className="mt-1 w-full border border-[#3a6e5d] bg-[#06130f] px-2 py-2 text-xs"
                    value={modelElement}
                    onChange={e => setModelElement(e.target.value)}
                  >
                    <option value="full">Cuerpo completo</option>
                    <option value="face">Rostro</option>
                    <option value="prop">Accesorio</option>
                  </select>
                </label>
              </div>
              <label className="mt-3 block text-xs text-[#b7d8ce]">
                Luz principal{" "}
                <span className="float-right text-[#6dffd0]">
                  {lightIntensity.toFixed(1)}
                </span>
                <input
                  className="mt-2 w-full accent-[#6dffd0]"
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={lightIntensity}
                  onChange={e => setLightIntensity(Number(e.target.value))}
                />
              </label>
              <label className="mt-3 block text-xs text-[#b7d8ce]">
                Color ambiental
                <input
                  className="mt-2 h-10 w-full cursor-pointer border border-[#3a6e5d] bg-[#06130f]"
                  type="color"
                  value={lightColor}
                  onChange={e => setLightColor(e.target.value)}
                  aria-label="Color ambiental de la iluminación"
                />
              </label>
              <label className="mt-3 flex items-center gap-2 text-xs text-[#b7d8ce]">
                <input
                  type="checkbox"
                  checked={showPlacementBox}
                  onChange={e => setShowPlacementBox(e.target.checked)}
                />{" "}
                Mostrar caja de colocación
              </label>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <input
                  className="min-w-0 border border-[#3a6e5d] bg-[#06130f] px-2 py-2 text-xs"
                  placeholder="Nombre del preset"
                  value={lightPresetName}
                  onChange={e => setLightPresetName(e.target.value)}
                />
                <button
                  className="border border-[#4c806f] px-2 py-2 text-xs"
                  onClick={saveLightPreset}
                >
                  Guardar luz
                </button>
              </div>
              {lightPresets.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {lightPresets.map(preset => (
                    <button
                      key={preset.name}
                      className="border border-[#3a6e5d] px-2 py-1 text-[11px] text-[#b7d8ce]"
                      onClick={() => applyLightPreset(preset)}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              )}
              <label className="mt-3 block text-sm text-[#cce8df]">
                Cargar otro GLB candidato
                <input
                  className="mt-2 w-full border border-[#3a6e5d] bg-[#06130f] px-3 py-2 text-xs"
                  placeholder="https://…/modelo.glb"
                  value={modelUrl}
                  onChange={e => setModelUrl(e.target.value)}
                />
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="cursor-pointer border border-[#6dffd0]/60 px-3 py-3 text-center text-xs font-semibold text-[#bfffee] hover:bg-[#6dffd0]/10">
                  Seleccionar imagen de referencia
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e => handleReferenceImage(e.target.files?.[0])} />
                </label>
                <label className="cursor-pointer border border-[#6dffd0]/60 px-3 py-3 text-center text-xs font-semibold text-[#bfffee] hover:bg-[#6dffd0]/10">
                  Cargar archivo GLB
                  <input type="file" accept="model/gltf-binary,.glb" className="sr-only" onChange={e => handleLocalGlb(e.target.files?.[0])} />
                </label>
              </div>
              {referenceImageError ? <p className="mt-2 text-xs text-[#ffb4a8]" role="alert">{referenceImageError}</p> : null}
              <button
                className="mt-3 w-full bg-[#6dffd0] px-4 py-3 text-sm font-semibold text-[#042019]"
                onClick={loadModel}
              >
                Previsualizar candidato
              </button>
                            <p className="mt-2 text-xs text-[#86b5a5]">
                El candidato se carga según ubicación y elemento seleccionados; no sustituye el modelo maestro.
              </p>
              {modelStatus.toLowerCase().includes("fallback") || modelStatus.toLowerCase().includes("no pudo") ? (
                <button type="button" className="mt-2 border border-[#6dffd0]/60 px-3 py-2 text-xs text-[#bfffee]" onClick={retryDefaultModel}>
                  Reintentar GLB por defecto
                </button>
              ) : null}
            </div>
          </aside>
        </section>
        <section className="grid gap-6 border-t border-[#1c5545] pt-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6dffd0]">
              Device concept
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Lukita AR · escenario espacial
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#b7d8ce]">
              Un companion visual pensado para presentar a Lukita en realidad
              aumentada: perímetro neón turquesa, puntero estrella y controles
              de volumen, sin acceso a resultados, RNG, wallet, ledger ni reglas
              de MJP CORE.
            </p>
            <div className="mt-5 grid gap-3 text-xs text-[#9fc9bb] sm:grid-cols-3">
              <span className="border border-[#315d50] px-3 py-3">
                Presentación aislada
              </span>
              <span className="border border-[#315d50] px-3 py-3">
                Gestos multitáctiles
              </span>
              <span className="border border-[#315d50] px-3 py-3">
                Candidato GLB reversible
              </span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <figure className="border border-[#315d50] bg-[#06130f] p-2">
              <img
                src="/manus-storage/lukita-ar-device-concept_43fd0153.png"
                alt="Concepto visual del dispositivo Lukita AR"
                className="h-auto w-full object-contain"
              />
              <figcaption className="px-2 pb-1 pt-2 text-xs text-[#86b5a5]">
                Device concept original · dirección de producto.
              </figcaption>
            </figure>
            <figure className="border border-[#315d50] bg-[#06130f] p-2">
              <img
                src={referenceImageUrl ?? "/manus-storage/lukita-character-foundation-reference_0f52a9ed.png"}
                alt="Lámina de referencia del Character Foundation de Lukita"
                className="h-auto w-full object-contain"
              />
              <figcaption className="px-2 pb-1 pt-2 text-xs text-[#86b5a5]">
                Referencia visual entregada · identidad pendiente de aprobación
                humana.
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
      {showWelcome && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg border border-[#6dffd0] bg-[#082119]/95 p-6 shadow-[0_0_40px_rgba(109,255,208,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#6dffd0]">
                  Bienvenida · Lukita AR Stage
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {steps[step][0]}
                </h2>
              </div>
              <button
                className="text-[#9fc9bb]"
                onClick={() => setShowWelcome(false)}
                aria-label="Cerrar tutorial"
              >
                ×
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#c6e5dc]">
              {steps[step][1]}
            </p>
            <div className="mt-6 flex gap-1">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 ${i <= step ? "bg-[#6dffd0]" : "bg-[#23493e]"}`}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-[#86b5a5]">
                Paso {step + 1} de {steps.length} · 30 segundos
              </span>
              <button
                className="bg-[#6dffd0] px-4 py-2 text-sm font-semibold text-[#042019]"
                onClick={() =>
                  step === steps.length - 1
                    ? setShowWelcome(false)
                    : setStep(step + 1)
                }
              >
                {step === steps.length - 1 ? "Entrar a la escena" : "Siguiente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
