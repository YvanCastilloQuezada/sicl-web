// server/contracts/IdentityUncertainty.ts

/**
 * F-1 RESOLUTION CONTRACT
 * 
 * Problema: Consumidores registrados sin content_hash no se encuentran
 * cuando el productor cambia de hash manteniendo (id, version).
 * 
 * Solución: Introducir identityStatus en ImpactedArtifact.
 * 
 * REGLAS:
 * 
 * F1-01: Si un consumidor NO tiene content_hash, se marca
 *        identityStatus = 'UNCERTAIN' con reason = 'MISSING_CONTENT_HASH'.
 * 
 * F1-02: Si un consumidor TIENE content_hash pero difiere del productor,
 *        se marca identityStatus = 'UNCERTAIN' con reason = 'HASH_MISMATCH'.
 * 
 * F1-03: Si un consumidor TIENE content_hash y coincide con el productor,
 *        se marca identityStatus = 'VERIFIED'.
 * 
 * F1-04: Los artefactos UNCERTAIN se reportan en
 *        ImpactReport.identityUncertainArtifacts (lista separada).
 * 
 * F1-05: Los artefactos UNCERTAIN NO aparecen en
 *        ImpactReport.impactedArtifacts (lista de verificados).
 * 
 * F1-06: analysisMetadata.identityUncertaintyCount refleja
 *        el total de artefactos con identidad incierta.
 * 
 * F1-07: H-002 SIGUE SIENDO READ-ONLY. No se introducen
 *        métodos de acción (propagate/invalidate/recompute/mutate).
 * 
 * IMPLICACIÓN PARA H-003:
 * H-003 NUNCA debe declarar VALID un artefacto con
 * identityStatus = 'UNCERTAIN'. Debe tratarlo como
 * REQUIRES_IDENTITY_VERIFICATION.
 */

export type IdentityStatus = 'VERIFIED' | 'UNCERTAIN';
export type UncertaintyReason = 
  | 'MISSING_CONTENT_HASH' 
  | 'HASH_MISMATCH' 
  | 'VERSION_AMBIGUITY';

// Extensión de ImpactedArtifact (ver contrato principal)
export interface ImpactedArtifact {
  artifactRef: VersionedRef;
  minDepth: number;
  impactPaths: ImpactPath[];
  identityStatus: IdentityStatus;           // NUEVO
  uncertaintyReason?: UncertaintyReason;    // NUEVO
}

// Extensión de ImpactReport
export interface ImpactReport {
  impactedArtifacts: ImpactedArtifact[];              // Solo VERIFIED
  identityUncertainArtifacts: ImpactedArtifact[];     // NUEVO: Solo UNCERTAIN
  cyclesDetected: number;
  cycles: Cycle[];
  failClosedTriggered: boolean;
  failClosedReason?: string;
  analysisMetadata: {
    queryRef: VersionedRef;
    totalPathsDiscovered: number;
    identityUncertaintyCount: number;       // NUEVO
  };
}