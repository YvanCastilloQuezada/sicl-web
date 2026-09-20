import { mkdirSync, writeFileSync } from "node:fs";
import { buildProjectBGeometricVariants, projectBVariantSvg, validateProjectBGeometricVariants } from "../client/src/components/arkiP9ProjectBGeometry";
const out = "/tmp/sicl-web-arki-canonical/docs/project-b";
mkdirSync(out, { recursive: true });
const variants = buildProjectBGeometricVariants();
if (!validateProjectBGeometricVariants(variants)) throw new Error("Project B geometric validation failed");
for (const variant of variants) {
  writeFileSync(`${out}/${variant.variantId}-CONCEPTUAL-PLAN.svg`, projectBVariantSvg(variant));
}
writeFileSync(`${out}/PROJECT-B-GEOMETRIC-DELIBERATION.json`, JSON.stringify(variants.map((variant) => ({ variantId: variant.variantId, modelVersion: variant.model.modelVersion, modelProjectId: variant.model.projectId, sourcePlanId: variant.model.sourcePlanId, elementCount: variant.model.elements.length, validations: variant.validations, permitReady: variant.permitReady, constructionReady: variant.constructionReady, humanReviewRequired: variant.humanReviewRequired })), null, 2) + "\n");
console.log(JSON.stringify({ variants: variants.length, validated: true, plans: variants.map((v) => v.variantId) }, null, 2));
