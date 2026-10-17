export class ArkiMysqlLedgerRepository {
  constructor(pool: any);
  insertPending(args: any): Promise<void>;
  transitionReady(objectId: string, ownerId: number, projectId: string): Promise<void>;
  get(objectId: string): Promise<any>;
  isProjectOwner(ownerId: number, projectId: string): Promise<boolean>;
  revoke(objectId: string, ownerId: number, projectId: string): Promise<void>;
  listStalePending(before: Date, limit?: number): Promise<any[]>;
}
