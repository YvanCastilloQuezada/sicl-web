// server/contracts/CycleCanonicalization.ts

/**
 * H-002 Cycle Canonicalization Contract
 * 
 * Un ciclo es una secuencia cerrada de derivaciones donde el output final
 * es input del primer nodo. Ejemplo: A@1 → B@1 → C@1 → A@1
 * 
 * La canonicalización rotacional garantiza que:
 *   canonicalize(A→B→C→A) === canonicalize(B→C→A→B) === canonicalize(C→A→B→C)
 * 
 * Esto evita duplicar el mismo ciclo reportado desde diferentes puntos de entrada.
 */

export interface VersionedRef {
  entityType: string;
  entityId: string;
  version: number;
  contentHash?: string; // SHA-256 opcional
}

export interface TypedRelation {
  type: 'DERIVED_FROM' | 'COMPUTED_FROM' | 'SUPPORTED_BY';
  domain: 'computational' | 'epistemic' | 'architectural';
}

export interface Cycle {
  /** Nodos del ciclo en orden canónico (menor lexicográfico primero) */
  nodes: VersionedRef[];
  
  /** Fingerprint determinista del ciclo (independiente del punto de entrada) */
  canonicalFingerprint: string;
  
  /** Relaciones tipadas entre nodos consecutivos */
  edges: TypedRelation[];
  
  /** Dominios relacionales presentes en el ciclo */
  relationDomains: string[];
}

export interface CycleDetectionReport {
  /** Número de ciclos ÚNICOS detectados (post-canonicalización) */
  cyclesDetected: number;
  
  /** Lista de ciclos canónicos */
  cycles: Cycle[];
  
  /** Si se activó fail-closed por explosión de caminos */
  failClosedTriggered: boolean;
  
  /** Razón del fail-closed (si aplica) */
  failClosedReason?: 'MAX_PATHS_EXCEEDED' | 'MAX_EXPANSIONS_EXCEEDED' | 'MAX_CYCLES_EXCEEDED';
}

/**
 * REGLAS CONTRACTUALES (RC-01 a RC-07):
 * 
 * RC-01: canonicalize(A→B→C→A) === canonicalize(B→C→A→B)
 *        (invarianza rotacional)
 * 
 * RC-02: canonicalize(A→B→C→A) !== canonicalize(A→C→B→A)
 *        (la dirección importa; el ciclo inverso es un ciclo distinto)
 * 
 * RC-03: Si un ciclo contiene aristas de dominios mixtos
 *        (ej: DERIVED_FROM + SUPPORTED_BY), se preserva
 *        la secuencia exacta de dominios en el fingerprint.
 * 
 * RC-04: Dos ciclos que comparten nodos pero tienen aristas
 *        distintas se reportan como ciclos separados.
 * 
 * RC-05: Un ciclo de longitud 1 (A→A) es válido y se reporta.
 * 
 * RC-06: La canonicalización no modifica el Event Store.
 *        H-002 sigue siendo read-only.
 * 
 * RC-07: Si el número de ciclos únicos excede max_cycles,
 *        se activa fail-closed (no truncamiento silencioso).
 */

export const CANONICALIZATION_RULES = {
  RC_01_ROTATIONAL_INVARIANCE: 'RC-01',
  RC_02_DIRECTIONAL_DISTINCTION: 'RC-02',
  RC_03_MIXED_DOMAIN_PRESERVATION: 'RC-03',
  RC_04_DISTINCT_EDGES_DISTINCT_CYCLES: 'RC-04',
  RC_05_SELF_LOOP_VALID: 'RC-05',
  RC_06_READ_ONLY: 'RC-06',
  RC_07_FAIL_CLOSED_ON_OVERFLOW: 'RC-07'
} as const;