export type ParametricArchiveIdentity = {
  ownerId: number;
  projectId: string;
};

export function canArchiveParametricFile(
  current: ParametricArchiveIdentity | undefined,
  ownerId: number,
  projectId: string,
): boolean {
  return Boolean(
    current &&
      current.ownerId === ownerId &&
      current.projectId === projectId,
  );
}
