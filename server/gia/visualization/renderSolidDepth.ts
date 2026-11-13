/**
 * Mapa de profundidad del sólido 3D, rasterizado en TypeScript puro.
 *
 * Sin Three.js, sin WebGL, sin dependencias externas.
 *
 * Proyección perspectiva de los vertices, z-buffer por pixel,
 * salida como buffer de 8 bits (0 = lejos, 255 = cerca).
 *
 * Se usa como segunda referencia para el generador fotorrealista:
 * el modelo de difusión "entiende" la profundidad de la escena
 * y no inventa oclusiones.
 */

import type { RenderData, RenderVertex, RenderFace, RenderCamera } from "./types";

type Vec3 = [number, number, number];
type Vec2 = [number, number];

export type DepthMap = {
  width: number;
  height: number;
  /** Buffer de 8 bits: 0 = lejos, 255 = cerca. */
  buffer: Uint8Array;
};

/** Proyección perspectiva de un punto 3D a 2D (coordenadas de pantalla + profundidad). */
function projectPerspective(
  v: Vec3,
  camera: RenderCamera,
  width: number,
  height: number,
): { x: number; y: number; z: number } {
  const [cx, cy, cz] = camera.position;
  const [tx, ty, tz] = camera.target;

  // Base de la cámara: forward, right, up
  const forward: Vec3 = [tx - cx, ty - cy, tz - cz];
  const fLen = Math.sqrt(forward[0] ** 2 + forward[1] ** 2 + forward[2] ** 2) || 1;
  const f: Vec3 = [forward[0] / fLen, forward[1] / fLen, forward[2] / fLen];

  // Right = forward × up (con up = [0,1,0])
  const right: Vec3 = [f[2], 0, -f[0]];
  const rLen = Math.sqrt(right[0] ** 2 + right[1] ** 2 + right[2] ** 2) || 1;
  const r: Vec3 = [right[0] / rLen, right[1] / rLen, right[2] / rLen];

  // Up = right × forward
  const u: Vec3 = [
    r[1] * f[2] - r[2] * f[1],
    r[2] * f[0] - r[0] * f[2],
    r[0] * f[1] - r[1] * f[0],
  ];

  // Coordenadas del punto en el espacio de la cámara
  const dx = v[0] - cx;
  const dy = v[1] - cy;
  const dz = v[2] - cz;
  const xCam = dx * r[0] + dy * r[1] + dz * r[2];
  const yCam = dx * u[0] + dy * u[1] + dz * u[2];
  const zCam = dx * f[0] + dy * f[1] + dz * f[2];

  if (zCam <= 0.01) return { x: -1, y: -1, z: zCam };

  const fovRad = (camera.fov * Math.PI) / 180;
  const aspect = width / height;
  const tanHalf = Math.tan(fovRad / 2);

  const nx = xCam / (zCam * tanHalf * aspect);
  const ny = yCam / (zCam * tanHalf);

  return {
    x: ((nx + 1) / 2) * width,
    y: ((1 - ny) / 2) * height,
    z: zCam,
  };
}

/** Rasteriza un triángulo con z-buffer. */
function rasterizeTriangle(
  p0: { x: number; y: number; z: number },
  p1: { x: number; y: number; z: number },
  p2: { x: number; y: number; z: number },
  depthBuffer: Float32Array,
  width: number,
  height: number,
) {
  // Bounding box
  const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x)));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x)));
  const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y)));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y)));

  if (minX > maxX || minY > maxY) return;

  // Barycentric coordinates
  const area = (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
  if (Math.abs(area) < 1e-6) return;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const w0 = ((p1.x - x) * (p2.y - y) - (p2.x - x) * (p1.y - y)) / area;
      const w1 = ((p2.x - x) * (p0.y - y) - (p0.x - x) * (p2.y - y)) / area;
      const w2 = 1 - w0 - w1;

      if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
        const z = w0 * p0.z + w1 * p1.z + w2 * p2.z;
        const idx = y * width + x;
        if (z < depthBuffer[idx]) {
          depthBuffer[idx] = z;
        }
      }
    }
  }
}

/** Genera el mapa de profundidad del sólido. */
export function renderSolidDepth(
  data: RenderData,
  options: { width?: number; height?: number; cameraId?: string } = {},
): DepthMap {
  const width = options.width ?? 512;
  const height = options.height ?? 512;
  const camera = data.cameras.find((c) => c.id === options.cameraId) ?? data.cameras[0];

  // Z-buffer inicializado a +infinito
  const depthBuffer = new Float32Array(width * height).fill(Infinity);

  // Proyectar todos los vertices
  const projected = data.vertices.map((v) => projectPerspective(v, camera, width, height));

  // Rasterizar cada face (triángulo)
  for (const face of data.faces) {
    const [i0, i1, i2] = face.vertices;
    const p0 = projected[i0];
    const p1 = projected[i1];
    const p2 = projected[i2];

    // Descartar si algún vertex está detrás de la cámara
    if (p0.x < 0 || p1.x < 0 || p2.x < 0) continue;

    rasterizeTriangle(p0, p1, p2, depthBuffer, width, height);
  }

  // Convertir z-buffer a 8 bits
  // Encontrar min/max de z (ignorando infinitos)
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const z of depthBuffer) {
    if (z < Infinity) {
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }

  const range = maxZ - minZ || 1;
  const buffer = new Uint8Array(width * height);

  for (let i = 0; i < depthBuffer.length; i++) {
    const z = depthBuffer[i];
    if (z === Infinity) {
      buffer[i] = 0; // fondo
    } else {
      // Normalizar: cerca = 255, lejos = 0
      buffer[i] = Math.round(((maxZ - z) / range) * 255);
    }
  }

  return { width, height, buffer };
}

/** Convierte DepthMap a PNG (buffer crudo para sharp). */
export function depthMapToRaw(depth: DepthMap): { raw: Buffer; width: number; height: number } {
  // Convertir buffer de 8 bits (grayscale) a Buffer de Node
  return {
    raw: Buffer.from(depth.buffer),
    width: depth.width,
    height: depth.height,
  };
}
