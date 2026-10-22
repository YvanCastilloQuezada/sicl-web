export function createFileBackend(root: string): {
  putExact(key: string, data: Buffer): Promise<any>;
  readExact(key: string): Promise<Buffer>;
  deleteExact(key: string): Promise<any>;
};
