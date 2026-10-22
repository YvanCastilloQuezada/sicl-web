export interface AuthorizedStorage {
  put(args: {
    ownerId: number;
    projectId: string;
    data: Buffer | Uint8Array | string;
    contentType: string;
  }): Promise<{
    objectId: string;
    key: string;
    url: string;
    sha256: string;
    sizeBytes: number;
    contentType: string;
  }>;
  read(args: {
    ownerId: number;
    projectId: string;
    objectId: string;
  }): Promise<{ body: Buffer; contentType: string }>;
  revoke(args: {
    ownerId: number;
    projectId: string;
    objectId: string;
  }): Promise<void>;
}
export function createAuthorizedStorage(args: {
  ledger: any;
  files: any;
}): AuthorizedStorage;
