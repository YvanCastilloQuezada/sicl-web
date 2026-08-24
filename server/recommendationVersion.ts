export function comparisonCollectionForRecommendation(kind: string, snapshot: { comparisons: Array<{ id: string }>; multiComparisons: Array<{ id: string }> }) {
  return kind === "MULTI_CRITERIA" ? snapshot.multiComparisons : snapshot.comparisons;
}

export function nextRecommendationVersion(existingVersions: Array<number | string | undefined | null>): number {
  const versions = existingVersions.map(Number).filter(Number.isFinite);
  return versions.length ? Math.max(...versions) + 1 : 1;
}
