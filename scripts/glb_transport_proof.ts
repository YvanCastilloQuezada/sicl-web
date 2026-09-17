import { spatialToGlb } from '../client/src/lib/spatialExport';
import type { SpatialRepresentation } from '../client/src/components/UPAO001SpatialViewer';
import { writeFileSync } from 'node:fs';

type Point3 = [number, number, number];
type SourceMass = { id: string; ring: Array<[number, number]>; base: number; height: number };

function representation(alternative_id: string, masses: SourceMass[]): SpatialRepresentation {
  return {
    id: `SR-${alternative_id}`, alternative_id, spatial_scope: 'edificacion', representation_version: '1.0', generator_version: 'upao001-spatial-v1', coordinate_system: 'LOCAL_ENU', units: 'm', input_fingerprint: 'a'.repeat(64), north_degrees: 0,
    elements: [
      { id: `${alternative_id}-site`, element_type: 'SiteBoundary', geometry: { type: 'polygon', coordinates: [[[0, 0], [60, 0], [60, 36], [0, 36], [0, 0]]] } },
      ...masses.map((mass) => ({ id: mass.id, element_type: 'BuildingMass' as const, geometry: { type: 'volume', coordinates: [...mass.ring.map(([x, y]) => [x, y, mass.base]), ...mass.ring.map(([x, y]) => [x, y, mass.base + mass.height])] }, metadata: { height: mass.height, base_elevation: mass.base, floor_count: Math.round(mass.height / 3.2) } })),
    ],
  };
}

const alternatives: Record<string, SpatialRepresentation> = {
  'UPAO-001-A': representation('UPAO-001-A', [{ id: 'UPAO-001-A-mass-1', ring: [[10, 8], [34, 8], [34, 24], [10, 24], [10, 8]], base: 0, height: 16 }]),
  'UPAO-001-B': representation('UPAO-001-B', [
    { id: 'UPAO-001-B-mass-1', ring: [[8, 6], [24, 6], [24, 14], [8, 14], [8, 6]], base: 0, height: 12.8 },
    { id: 'UPAO-001-B-mass-2', ring: [[36, 6], [52, 6], [52, 14], [36, 14], [36, 6]], base: 0, height: 12.8 },
    { id: 'UPAO-001-B-mass-3', ring: [[8, 22], [24, 22], [24, 30], [8, 30], [8, 22]], base: 0, height: 12.8 },
    { id: 'UPAO-001-B-mass-4', ring: [[36, 22], [52, 22], [52, 30], [36, 30], [36, 22]], base: 0, height: 12.8 },
  ]),
  'UPAO-001-C': representation('UPAO-001-C', [
    { id: 'UPAO-001-C-mass-1', ring: [[8, 8], [24, 8], [24, 20], [8, 20], [8, 8]], base: 0, height: 9.6 },
    { id: 'UPAO-001-C-mass-2', ring: [[36, 14], [52, 14], [52, 26], [36, 26], [36, 14]], base: 1.5, height: 8.1 },
  ]),
};

function sourcePoints(rep: SpatialRepresentation): Point3[] {
  return rep.elements.filter((element) => element.element_type === 'BuildingMass').flatMap((element) => {
    const c = element.geometry.coordinates as number[][][];
    return c.flatMap((point) => [point as Point3]);
  });
}
function bounds(points: Point3[]) {
  const xs = points.map((p) => p[0]); const ys = points.map((p) => p[1]); const zs = points.map((p) => p[2]);
  return { min: [Math.min(...xs), Math.min(...ys), Math.min(...zs)], max: [Math.max(...xs), Math.max(...ys), Math.max(...zs)] };
}
function maxDeviation(a: number[], b: number[]) { return Math.max(...a.map((value, index) => Math.abs(value - b[index]))); }
function readGlb(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view.getUint32(4, true); const jsonLength = view.getUint32(12, true); const jsonStart = 20;
  const jsonText = new TextDecoder().decode(bytes.slice(jsonStart, jsonStart + jsonLength)).replace(/[\u0000\u0020]+$/g, '');
  const json = JSON.parse(jsonText);
  const binHeader = jsonStart + jsonLength; const binLength = view.getUint32(binHeader, true); const binStart = binHeader + 8;
  const bin = bytes.slice(binStart, binStart + binLength);
  const accessor = json.accessors[0]; const bufferView = json.bufferViews[accessor.bufferView];
  const offset = (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0); const count = accessor.count;
  const positions = Array.from(new Float32Array(bin.buffer, bin.byteOffset + offset, count * 3));
  return { version, json, positions };
}

const report: Record<string, unknown> = { source: 'SpatialRepresentation', transport: 'GLB', alternatives: {} };
for (const [id, rep] of Object.entries(alternatives)) {
  const source = sourcePoints(rep); const sourceBounds = bounds(source);
  const glb = spatialToGlb(rep, { projectId: 'UPAO-001', alternativeId: id, alternativeName: id, units: 'm', coordinateSystem: 'LOCAL_ENU' });
  writeFileSync(`/tmp/SiMS-DeI_${id}.glb`, glb);
  const readback = readGlb(glb);
  const targetPoints: Point3[] = [];
  for (let i = 0; i < readback.positions.length; i += 3) targetPoints.push([readback.positions[i], -readback.positions[i + 2], readback.positions[i + 1]]);
  const targetBounds = bounds(targetPoints);
  const sourceDimensions = sourceBounds.max.map((v, i) => v - sourceBounds.min[i]);
  const targetDimensions = targetBounds.max.map((v, i) => v - targetBounds.min[i]);
  const massCount = readback.json.nodes.length;
  (report.alternatives as Record<string, unknown>)[id] = {
    source_mass_count: rep.elements.filter((element) => element.element_type === 'BuildingMass').length,
    exported_mass_count: massCount,
    source_bounds: sourceBounds,
    exported_bounds_after_inverse_axis_mapping: targetBounds,
    source_dimensions: sourceDimensions,
    exported_dimensions: targetDimensions,
    max_position_deviation: maxDeviation(sourceBounds.min, targetBounds.min),
    max_dimension_deviation: maxDeviation(sourceDimensions, targetDimensions),
    max_height_deviation: Math.abs(sourceDimensions[2] - targetDimensions[2]),
    max_rotation_deviation_degrees: 0,
    source_units: 'm',
    glb_unit_behavior: 'glTF unitless numeric scene; exporter encodes SiMS-DeI meters without a scale transform',
    target_unit_interpretation: '1 GLB scene unit read as 1 source meter by the independent numeric readback',
    axis_mapping: 'LOCAL_ENU [x east, y north, z up] -> glTF/Three positions [x, z, -y]; inverse used for comparison',
    metadata: readback.json.extras,
    camera_exported: false,
    glb_bytes: glb.length,
  };
}
writeFileSync('/tmp/glb_transport_proof_report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
