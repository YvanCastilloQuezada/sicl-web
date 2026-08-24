export function nextRecommendationVersion(existingVersions: Array<number | string | undefined | null>): number {
  const versions = existingVersions.map(Number).filter(Number.isFinite);
  return versions.length ? Math.max(...versions) + 1 : 1;
}
