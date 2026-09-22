import { ADVANCED_RENDER_CONTRACT, assessAdvancedCapabilities, validateRenderRequest, type AdvancedCapability } from "../shared/arkiAdvancedRenderCapabilities";

const expected: AdvancedCapability[] = [...ADVANCED_RENDER_CONTRACT.capabilities];
const assessments = assessAdvancedCapabilities({ webgl2: true, xrVr: false, xrAr: false, cloudUrl: undefined, cloudTokenConfigured: false, mediaRecorder: true, usdzExporter: false, pathTracerDependency: false });
const seen = new Set(assessments.map((item) => item.capability));
const missing = expected.filter((capability) => !seen.has(capability));
if (missing.length) { console.error(JSON.stringify({ status: "FAIL", missing }, null, 2)); process.exit(1); }
const resolutionChecks = (Object.keys(ADVANCED_RENDER_CONTRACT.resolutions) as Array<keyof typeof ADVANCED_RENDER_CONTRACT.resolutions>).map((resolution) => validateRenderRequest({ resolution, samples: 5000 }));
if (resolutionChecks.some((item) => item.samples !== 5000 || item.width <= 0 || item.height <= 0)) { console.error(JSON.stringify({ status: "FAIL", reason: "invalid resolution contract" }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "PASS", schema: ADVANCED_RENDER_CONTRACT.schema, capabilities: assessments, resolutions: resolutionChecks, security: ADVANCED_RENDER_CONTRACT.security }, null, 2));
