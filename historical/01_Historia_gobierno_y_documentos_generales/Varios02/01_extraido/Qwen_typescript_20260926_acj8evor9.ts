// tests/h002_cycle_canonicalization.test.ts
// TDD: Estos tests DEBEN FALLAR hasta que la implementación sea correcta.

import { ImpactAnalyzer } from '../server/arkiH002ImpactAnalyzer';
import { DerivationLedger } from '../server/arkiH001DerivationLedger';
import { VersionedRef, TypedRelation } from '../server/contracts/types';

describe('H-002 Pase 3 — Cycle Canonicalization (TDD)', () => {

  let ledger: DerivationLedger;
  let analyzer: ImpactAnalyzer;

  beforeEach(async () => {
    ledger = new DerivationLedger();
    analyzer = new ImpactAnalyzer(ledger);
  });

  // ──────────────────────────────────────────────
  // CP-01: Ciclo simple se reporta UNA sola vez
  // ──────────────────────────────────────────────
  it('CP-01: ciclo simple A→B→C→A debe reportarse exactamente UNA vez', async () => {
    // SETUP: Crear ciclo intencional A→B→C→A
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'C', version: 1, contentHash: 'hC' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' },
      method: { id: 'M2', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'C', version: 1, contentHash: 'hC' },
      method: { id: 'M3', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });

    // ACTION: Analizar impacto desde A@1
    const result = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA'
    });

    // ASSERT: Exactamente 1 ciclo, 3 artefactos afectados, sin fail-closed
    expect(result.cyclesDetected).toBe(1);
    expect(result.affectedArtifacts).toHaveLength(3);
    expect(result.failClosedTriggered).toBe(false);
    
    // El ciclo debe tener fingerprint determinista
    expect(result.cycles[0].canonicalFingerprint).toBeDefined();
    expect(typeof result.cycles[0].canonicalFingerprint).toBe('string');
    expect(result.cycles[0].canonicalFingerprint.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────
  // CP-02: Invarianza rotacional
  // ──────────────────────────────────────────────
  it('CP-02: consultar desde B@1 debe producir el MISMO canonical fingerprint que desde A@1', async () => {
    // SETUP: Mismo ciclo A→B→C→A
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'C', version: 1, contentHash: 'hC' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' },
      method: { id: 'M2', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'C', version: 1, contentHash: 'hC' },
      method: { id: 'M3', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });

    // ACTION: Analizar desde A@1 y desde B@1
    const resultFromA = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA'
    });
    const resultFromB = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB'
    });

    // ASSERT: Mismo fingerprint, mismo número de ciclos
    expect(resultFromA.cyclesDetected).toBe(1);
    expect(resultFromB.cyclesDetected).toBe(1);
    expect(resultFromA.cycles[0].canonicalFingerprint)
      .toBe(resultFromB.cycles[0].canonicalFingerprint);
  });

  // ──────────────────────────────────────────────
  // CP-03: Ciclos disjuntos se cuentan por separado
  // ──────────────────────────────────────────────
  it('CP-03: dos ciclos independientes deben reportarse como 2 ciclos distintos', async () => {
    // SETUP: Ciclo 1: A→B→A
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' },
      method: { id: 'M2', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });

    // SETUP: Ciclo 2: X→Y→Z→X (completamente disjunto)
    await ledger.record({
      output: { entityType: 'Area', entityId: 'X', version: 1, contentHash: 'hX' },
      method: { id: 'M3', version: 1 },
      inputs: [{ entityType: 'Area', entityId: 'Z', version: 1, contentHash: 'hZ' }],
      relations: [{ type: 'COMPUTED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Area', entityId: 'Y', version: 1, contentHash: 'hY' },
      method: { id: 'M4', version: 1 },
      inputs: [{ entityType: 'Area', entityId: 'X', version: 1, contentHash: 'hX' }],
      relations: [{ type: 'COMPUTED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Area', entityId: 'Z', version: 1, contentHash: 'hZ' },
      method: { id: 'M5', version: 1 },
      inputs: [{ entityType: 'Area', entityId: 'Y', version: 1, contentHash: 'hY' }],
      relations: [{ type: 'COMPUTED_FROM', domain: 'computational' }]
    });

    // ACTION: Analizar desde A@1 (debería ver ciclo 1, no ciclo 2)
    const resultFromA = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA'
    });

    // ASSERT: Solo 1 ciclo visible desde A (el disjunto no se alcanza)
    expect(resultFromA.cyclesDetected).toBe(1);
    expect(resultFromA.affectedArtifacts).toHaveLength(2); // A y B

    // ACTION: Analizar desde X@1 (debería ver ciclo 2, no ciclo 1)
    const resultFromX = await analyzer.analyzeImpact({
      entityType: 'Area', entityId: 'X', version: 1, contentHash: 'hX'
    });

    // ASSERT: Solo 1 ciclo visible desde X
    expect(resultFromX.cyclesDetected).toBe(1);
    expect(resultFromX.affectedArtifacts).toHaveLength(3); // X, Y, Z

    // ASSERT: Los fingerprints son distintos
    expect(resultFromA.cycles[0].canonicalFingerprint)
      .not.toBe(resultFromX.cycles[0].canonicalFingerprint);
  });

  // ──────────────────────────────────────────────
  // CP-04: Dirección relacional se preserva
  // ──────────────────────────────────────────────
  it('CP-04: A→B (DERIVED_FROM) + B→A (SUPPORTED_BY) NO es un ciclo en el mismo dominio', async () => {
    // SETUP: A deriva de B (computacional), B es soportado por A (epistémico)
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' },
      method: { id: 'M2', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' }],
      relations: [{ type: 'SUPPORTED_BY', domain: 'epistemic' }]
    });

    // ACTION: Analizar impacto desde A@1
    const result = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA'
    });

    // ASSERT: Si el analizador distingue dominios, esto puede ser 0 o 1 ciclo
    // dependiendo de si se considera ciclo cross-dominio.
    // Lo CRÍTICO es que SI se reporta como ciclo, las aristas deben
    // conservar sus dominios distintos.
    if (result.cyclesDetected > 0) {
      const cycle = result.cycles[0];
      expect(cycle.relationDomains).toContain('computational');
      expect(cycle.relationDomains).toContain('epistemic');
      // El fingerprint debe reflejar la asimetría direccional
      // (no es lo mismo que un ciclo con dos DERIVED_FROM)
    }
    
    // En cualquier caso, no debe haber truncamiento silencioso
    expect(result.failClosedTriggered).toBe(false);
  });

  // ──────────────────────────────────────────────
  // CP-05: Fail-closed ante explosión de ciclos
  // ──────────────────────────────────────────────
  it('CP-05: exceder max_paths_per_artifact debe activar fail-closed sin truncamiento', async () => {
    // SETUP: Grafo denso con ciclos anidados que exceden límites
    // Crear un grafo tipo "mesh" con 20 nodos interconectados
    const nodeCount = 20;
    for (let i = 0; i < nodeCount; i++) {
      const nextNode = (i + 1) % nodeCount;
      const prevNode = (i - 1 + nodeCount) % nodeCount;
      await ledger.record({
        output: { entityType: 'Test', entityId: `N${i}`, version: 1, contentHash: `h${i}` },
        method: { id: `M${i}`, version: 1 },
        inputs: [
          { entityType: 'Test', entityId: `N${nextNode}`, version: 1, contentHash: `h${nextNode}` },
          { entityType: 'Test', entityId: `N${prevNode}`, version: 1, contentHash: `h${prevNode}` }
        ],
        relations: [
          { type: 'DERIVED_FROM', domain: 'computational' },
          { type: 'DERIVED_FROM', domain: 'computational' }
        ]
      });
    }

    // ACTION: Analizar con límite bajo
    const result = await analyzer.analyzeImpact({
      entityType: 'Test', entityId: 'N0', version: 1, contentHash: 'h0'
    }, { max_paths_per_artifact: 5 });

    // ASSERT: Fail-closed activado, SIN artefactos parciales
    expect(result.failClosedTriggered).toBe(true);
    expect(result.affectedArtifacts).toHaveLength(0); // No truncamiento parcial
    expect(result.failClosedReason).toBeDefined();
  });

  // ──────────────────────────────────────────────
  // CP-06: Regresión H-001 post-canonicalización
  // ──────────────────────────────────────────────
  it('CP-06: los 322 PASS de H-001 deben seguir PASS tras canonicalización', async () => {
    // Este test es un placeholder para la suite de regresión completa.
    // En la práctica, se ejecuta: pytest tests/h001/ -v
    // Aquí verificamos que el contrato de H-001 no se rompió:
    
    // 1. contractVersion sigue siendo 1
    const record = await ledger.record({
      output: { entityType: 'Test', entityId: 'R1', version: 1, contentHash: 'hr1' },
      method: { id: 'MR', version: 1 },
      inputs: [],
      relations: []
    });
    expect(record.contractVersion).toBe(1);
    
    // 2. Lectura histórica fail-closed sigue funcionando
    // (inyectar evento corrupto y verificar rechazo)
    // ... implementación específica del adapter
    
    // 3. canonical_json sigue siendo determinista
    const fp1 = ledger.stableFingerprint({ inputs: ['B', 'A'], relations: [], assumptions: [] });
    const fp2 = ledger.stableFingerprint({ inputs: ['A', 'B'], relations: [], assumptions: [] });
    expect(fp1).toBe(fp2);
  });

  // ──────────────────────────────────────────────
  // CP-07: Determinismo de replay
  // ──────────────────────────────────────────────
  it('CP-07: misma consulta ejecutada 10 veces debe producir resultados idénticos', async () => {
    // SETUP: Ciclo simple
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });
    await ledger.record({
      output: { entityType: 'Geometry', entityId: 'B', version: 1, contentHash: 'hB' },
      method: { id: 'M2', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA' }],
      relations: [{ type: 'DERIVED_FROM', domain: 'computational' }]
    });

    // ACTION: Ejecutar 10 veces
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(await analyzer.analyzeImpact({
        entityType: 'Geometry', entityId: 'A', version: 1, contentHash: 'hA'
      }));
    }

    // ASSERT: Todos idénticos
    const firstFingerprint = results[0].cycles[0].canonicalFingerprint;
    for (let i = 1; i < 10; i++) {
      expect(results[i].cyclesDetected).toBe(results[0].cyclesDetected);
      expect(results[i].cycles[0].canonicalFingerprint).toBe(firstFingerprint);
      expect(results[i].affectedArtifacts).toHaveLength(results[0].affectedArtifacts.length);
    }
  });
});