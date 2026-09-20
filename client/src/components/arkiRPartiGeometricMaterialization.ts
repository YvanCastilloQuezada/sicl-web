import { buildProjectBGeometricVariants, type ProjectBGeometryVariant } from "./arkiP9ProjectBGeometry";
import type { RPartiHypothesis } from "./arkiRPartiManual";

export type RPartiGeometricRealization = Readonly<{
  realizationId: string;
  partiId: string;
  sourceVariantId: ProjectBGeometryVariant["variantId"];
  model: ProjectBGeometryVariant["model"];
  geometrySignature: string;
  hardConstraintStatus: "PASS" | "UNKNOWN";
  humanReviewRequired: true;
  automaticWinner: "NONE";
}>;

export type RPartiMaterializationResult = Readonly<{
  partiId: string;
  realizations: readonly RPartiGeometricRealization[];
  sameParti: boolean;
  geometricallyDistinct: boolean;
  hardConstraintsPreserved: boolean;
  status: "PASS" | "BLOCKED";
  humanReviewRequired: true;
  automaticWinner: "NONE";
  unknowns: string[];
}>;

const geometrySignature = (variant: ProjectBGeometryVariant): string => variant.model.elements
  .filter((element) => element.kind === "SPACE")
  .map((element) => JSON.stringify(element.geometry))
  .sort()
  .join("|");

const hardConstraintStatus = (variant: ProjectBGeometryVariant): "PASS" | "UNKNOWN" => {
  const required = ["ROOM_CONTAINMENT", "ROOM_NON_OVERLAP", "DOOR_CONNECTION", "PUBLIC_ROUTE"];
  return required.every((id) => variant.validations.find((validation) => validation.id === id)?.state === "PASS") ? "PASS" : "UNKNOWN";
};

const withPartiLineage = (variant: ProjectBGeometryVariant, partiId: string, realizationId: string): RPartiGeometricRealization => {
  const model = {
    ...variant.model,
    projectId: `${variant.model.projectId}:${partiId}:${realizationId}`,
    sourcePlanId: `${variant.model.sourcePlanId}:${partiId}:${realizationId}`,
    elements: variant.model.elements.map((element) => ({
      ...element,
      lineage: [...element.lineage, `parti:${partiId}`, `realization:${realizationId}`],
      provenance: [...element.provenance, `R-PARTI geometric materialization`, `same parti:${partiId}`],
    })),
  };
  return {
    realizationId,
    partiId,
    sourceVariantId: variant.variantId,
    model,
    geometrySignature: geometrySignature(variant),
    hardConstraintStatus: hardConstraintStatus(variant),
    humanReviewRequired: true,
    automaticWinner: "NONE",
  };
};

/**
 * Materializes two independent geometric realizations from the existing Project B
 * geometry adapter. The parti is shared; geometry, model identity and realization
 * lineage remain distinct. No preference or winner is inferred.
 */
export function materializeRPartiRealizations(parti: Pick<RPartiHypothesis, "partiId">): RPartiMaterializationResult {
  const variants = buildProjectBGeometricVariants();
  const realizations = variants.map((variant, index) => withPartiLineage(variant, parti.partiId, `${parti.partiId}:REALIZATION:${index + 1}`));
  const signatures = new Set(realizations.map((realization) => realization.geometrySignature));
  const hardConstraintsPreserved = realizations.every((realization) => realization.hardConstraintStatus === "PASS");
  const unknowns = variants.flatMap((variant) => variant.validations.filter((validation) => validation.state === "UNKNOWN").map((validation) => `${variant.variantId}:${validation.id}`));
  return {
    partiId: parti.partiId,
    realizations,
    sameParti: realizations.length === 2 && realizations.every((realization) => realization.partiId === parti.partiId),
    geometricallyDistinct: signatures.size === realizations.length,
    hardConstraintsPreserved,
    status: realizations.length === 2 && signatures.size === realizations.length && hardConstraintsPreserved ? "PASS" : "BLOCKED",
    humanReviewRequired: true,
    automaticWinner: "NONE",
    unknowns,
  };
}

export function validateRPartiMaterialization(result: RPartiMaterializationResult): boolean {
  return result.status === "PASS" && result.sameParti && result.geometricallyDistinct && result.hardConstraintsPreserved && result.realizations.every((realization) => realization.model.maturity === "CONCEPTUAL" && realization.model.permitReady === false && realization.model.constructionReady === false && realization.humanReviewRequired && realization.automaticWinner === "NONE") && result.humanReviewRequired && result.automaticWinner === "NONE";
}
