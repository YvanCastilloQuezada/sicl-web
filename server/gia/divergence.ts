/**
 * Métricas de divergencia entre alternativas PARTI (GIA-002).
 *
 * Un PARTI se representa como un grafo de espacios con atributos:
 * - spaces: nodos con id, tipo, zona
 * - edges: aristas (adyacencias entre espacios)
 * - accessOrder: secuencia de tipos desde el ingreso
 *
 * Tres métricas:
 * M1 - Divergencia topológica (Graph Edit Distance normalizada)
 * M2 - Divergencia de secuencia (Levenshtein normalizada)
 * M3 - Divergencia de esquema funcional (Adjusted Rand Index)
 */

export type PartiSpace = {
  id: string;
  type: string;
  zone: string;
};

export type PartiEdge = {
  a: string;
  b: string;
  weight?: number;
};

export type Parti = {
  id: string;
  spaces: PartiSpace[];
  edges: PartiEdge[];
  accessOrder: string[]; // secuencia de tipos desde el ingreso
};

/**
 * M1 - Divergencia topológica.
 * Compara el grafo de adyacencia de espacios.
 * Usa una aproximación de Graph Edit Distance normalizada:
 * cuenta nodos y aristas no compartidos, normaliza por el tamaño máximo.
 */
export function topologicalDivergence(A: Parti, B: Parti): number {
  const nodesA = new Set(A.spaces.map((s) => s.type));
  const nodesB = new Set(B.spaces.map((s) => s.type));

  // Nodos no compartidos
  const nodesOnlyA = [...nodesA].filter((n) => !nodesB.has(n)).length;
  const nodesOnlyB = [...nodesB].filter((n) => !nodesA.has(n)).length;
  const nodesUnion = new Set([...nodesA, ...nodesB]).size;
  const nodeDiff = (nodesOnlyA + nodesOnlyB) / Math.max(nodesUnion, 1);

  // Aristas no compartidas (por tipo de par)
  const edgeKey = (e: PartiEdge, spaces: PartiSpace[]): string => {
    const typeA = spaces.find((s) => s.id === e.a)?.type ?? e.a;
    const typeB = spaces.find((s) => s.id === e.b)?.type ?? e.b;
    return [typeA, typeB].sort().join("--");
  };
  const edgesA = new Set(A.edges.map((e) => edgeKey(e, A.spaces)));
  const edgesB = new Set(B.edges.map((e) => edgeKey(e, B.spaces)));
  const edgesOnlyA = [...edgesA].filter((e) => !edgesB.has(e)).length;
  const edgesOnlyB = [...edgesB].filter((e) => !edgesA.has(e)).length;
  const edgesUnion = new Set([...edgesA, ...edgesB]).size;
  const edgeDiff = (edgesOnlyA + edgesOnlyB) / Math.max(edgesUnion, 1);

  // Promedio de nodos y aristas
  return (nodeDiff + edgeDiff) / 2;
}

/**
 * M2 - Divergencia de secuencia.
 * Compara la secuencia de acceso (orden de tipos desde el ingreso)
 * usando distancia de Levenshtein normalizada.
 */
export function sequenceDivergence(A: Parti, B: Parti): number {
  const a = A.accessOrder;
  const b = B.accessOrder;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 0;

  // Matriz de Levenshtein
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length] / maxLen;
}

/**
 * M3 - Divergencia de esquema funcional.
 * Compara la partición de espacios en zonas usando Adjusted Rand Index.
 * ARI = 1: particiones idénticas. ARI = 0: particiones al azar.
 */
export function schemaDivergence(A: Parti, B: Parti): number {
  // Construir mapa de tipo -> zona para cada PARTI
  const zoneA = new Map<string, string>();
  const zoneB = new Map<string, string>();
  for (const s of A.spaces) zoneA.set(s.type, s.zone);
  for (const s of B.spaces) zoneB.set(s.type, s.zone);

  // Solo comparar tipos que están en ambos
  const commonTypes = [...zoneA.keys()].filter((t) => zoneB.has(t));
  if (commonTypes.length < 2) return 1; // sin datos suficientes, se considera divergente

  // Construir matriz de contingencia
  const zonesA = [...new Set(commonTypes.map((t) => zoneA.get(t)!))];
  const zonesB = [...new Set(commonTypes.map((t) => zoneB.get(t)!))];
  const contingency = zonesA.map((za) =>
    zonesB.map((zb) =>
      commonTypes.filter((t) => zoneA.get(t) === za && zoneB.get(t) === zb).length
    )
  );

  // Calcular ARI
  const n = commonTypes.length;
  const sumComb = (arr: number[]) => arr.reduce((acc, x) => acc + (x * (x - 1)) / 2, 0);
  const rowSums = contingency.map((row) => row.reduce((a, b) => a + b, 0));
  const colSums = zonesB.map((_, j) => contingency.reduce((acc, row) => acc + row[j], 0));
  const sumCells = contingency.flat().reduce((acc, x) => acc + (x * (x - 1)) / 2, 0);
  const sumRows = sumComb(rowSums);
  const sumCols = sumComb(colSums);
  const totalPairs = (n * (n - 1)) / 2;

  const expectedIndex = (sumRows * sumCols) / totalPairs;
  const maxIndex = (sumRows + sumCols) / 2;
  if (maxIndex === expectedIndex) return 1;
  return (sumCells - expectedIndex) / (maxIndex - expectedIndex);
}

/**
 * Divergencia combinada: retorna las 3 métricas.
 */
export function divergence(A: Parti, B: Parti): { m1: number; m2: number; m3: number } {
  return {
    m1: topologicalDivergence(A, B),
    m2: sequenceDivergence(A, B),
    m3: schemaDivergence(A, B),
  };
}

/**
 * Regla de aprobación GIA-002.
 * PASA si al menos un par de alternativas cumple:
 *   M1 >= 0.25 OR M2 >= 0.30 OR M3 <= 0.70
 * Y al menos 2 métricas se cumplen a la vez para ese par.
 */
export function passesGIA002(partis: Parti[]): { pass: boolean; details: Array<{ pair: [string, string]; m1: number; m2: number; m3: number; votes: number }> } {
  const details: Array<{ pair: [string, string]; m1: number; m2: number; m3: number; votes: number }> = [];
  let pass = false;

  for (let i = 0; i < partis.length; i++) {
    for (let j = i + 1; j < partis.length; j++) {
      const { m1, m2, m3 } = divergence(partis[i], partis[j]);
      const votes = [m1 >= 0.25, m2 >= 0.30, m3 <= 0.70].filter(Boolean).length;
      details.push({ pair: [partis[i].id, partis[j].id], m1, m2, m3, votes });
      if (votes >= 2) pass = true;
    }
  }
  return { pass, details };
}
