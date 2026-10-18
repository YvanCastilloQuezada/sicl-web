// tests/h002_identity_uncertainty.test.ts
// TDD: Estos tests DEBEN FALLAR hasta que F-1 esté resuelto.

describe('H-002 F-1 Resolution — Identity Uncertainty Detection', () => {

  let ledger: DerivationLedger;
  let analyzer: ImpactAnalyzer;

  beforeEach(async () => {
    ledger = new DerivationLedger();
    analyzer = new ImpactAnalyzer(ledger);
  });

  // ──────────────────────────────────────────────
  // CF-1-01: Consumidor SIN content_hash → UNCERTAIN
  // ──────────────────────────────────────────────
  it('CF-1-01: consumidor sin content_hash debe aparecer en identityUncertainArtifacts', async () => {
    // SETUP: Productor CON hash, consumidor SIN hash
    await ledger.record({
      output: { entityType: 'Area', entityId: 'A1', version: 1 }, // SIN contentHash
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'G1', version: 1, contentHash: 'hG1' }],
      relations: [{ type: 'COMPUTED_FROM', domain: 'computational' }]
    });

    // ACTION: WHAT-IF sobre G1@1
    const result = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'G1', version: 1, contentHash: 'hG1'
    });

    // ASSERT: A1 aparece como UNCERTAIN
    expect(result.identityUncertainArtifacts).toHaveLength(1);
    expect(result.identityUncertainArtifacts[0].artifactRef.entityId).toBe('A1');
    expect(result.identityUncertainArtifacts[0].identityStatus).toBe('UNCERTAIN');
    expect(result.identityUncertainArtifacts[0].uncertaintyReason).toBe('MISSING_CONTENT_HASH');

    // ASSERT: A1 NO aparece en impactedArtifacts (verificados)
    const verifiedA1 = result.impactedArtifacts.find(a => a.artifactRef.entityId === 'A1');
    expect(verifiedA1).toBeUndefined();

    // ASSERT: Metadata correcta
    expect(result.analysisMetadata.identityUncertaintyCount).toBe(1);
  });

  // ──────────────────────────────────────────────
  // CF-1-02: Consumidor con hash DIFERENTE → UNCERTAIN
  // ──────────────────────────────────────────────
  it('CF-1-02: consumidor con hash diferente al productor debe ser UNCERTAIN', async () => {
    // SETUP: Productor G1@1 con hash 'hG1_old', consumidor A1@1 que referencia hash 'hG1_new'
    await ledger.record({
      output: { entityType: 'Area', entityId: 'A1', version: 1, contentHash: 'hA1' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'G1', version: 1, contentHash: 'hG1_old' }],
      relations: [{ type: 'COMPUTED_FROM', domain: 'computational' }]
    });

    // ACTION: WHAT-IF sobre G1@1 con hash NUEVO
    const result = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'G1', version: 1, contentHash: 'hG1_new'
    });

    // ASSERT: A1 aparece como UNCERTAIN por HASH_MISMATCH
    expect(result.identityUncertainArtifacts).toHaveLength(1);
    expect(result.identityUncertainArtifacts[0].identityStatus).toBe('UNCERTAIN');
    expect(result.identityUncertainArtifacts[0].uncertaintyReason).toBe('HASH_MISMATCH');
  });

  // ──────────────────────────────────────────────
  // CF-1-03: Consumidor con hash COINCIDENTE → VERIFIED
  // ──────────────────────────────────────────────
  it('CF-1-03: consumidor con hash coincidente debe ser VERIFIED', async () => {
    // SETUP: Productor y consumidor con mismo hash
    await ledger.record({
      output: { entityType: 'Area', entityId: 'A1', version: 1, contentHash: 'hA1' },
      method: { id: 'M1', version: 1 },
      inputs: [{ entityType: 'Geometry', entityId: 'G1', version: 1, contentHash: 'hG1' }],
      relations: [{ type: 'COMPUTED_FROM', domain: 'computational' }]
    });

    // ACTION: WHAT-IF sobre G1@1 con mismo hash
    const result = await analyzer.analyzeImpact({
      entityType: 'Geometry', entityId: 'G1', version: 1, contentHash: 'hG1'
    });

    // ASSERT: A1 aparece como VERIFIED en impactedArtifacts
    expect(result.impactedArtifacts).toHaveLength(1);
    expect(result.impactedArtifacts[0].artifactRef.entityId).toBe('A1');
    expect(result.impactedArtifacts[0].identityStatus).toBe('VERIFIED');

    // ASSERT: identityUncertainArtifacts está vacío
    expect(result.identityUncertainArtifacts).toHaveLength(0);
    expect(result.analysisMetadata.identityUncertaintyCount).toBe(0);
  });
});