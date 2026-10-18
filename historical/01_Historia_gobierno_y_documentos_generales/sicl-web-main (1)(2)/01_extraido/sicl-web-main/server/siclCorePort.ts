import { analysisView, appendHumanDecision, appendHumanReview, appendRecord, emptySnapshot, parseSnapshot, type RecordKind, type SiclEvent, type SiclRecord, type SiclSnapshot } from "./siclCore";

/**
 * Port consumed by tRPC. The current implementation is an HTTP-process-safe
 * contract adapter; a future deployment may replace it with the real SICL
 * Core service without changing router or UI contracts.
 */
export interface SiclCorePort {
  emptySnapshot(): SiclSnapshot;
  parseSnapshot(raw: string): SiclSnapshot;
  appendRecord(snapshot: SiclSnapshot, kind: RecordKind, record: SiclRecord, event: SiclEvent): SiclSnapshot;
  appendHumanReview(snapshot: SiclSnapshot, review: SiclRecord, event: SiclEvent): SiclSnapshot;
  appendHumanDecision(snapshot: SiclSnapshot, decision: SiclRecord, event: SiclEvent): SiclSnapshot;
  analysisView(snapshot: SiclSnapshot): ReturnType<typeof analysisView>;
}

export const siclCorePort: SiclCorePort = {
  emptySnapshot,
  parseSnapshot,
  appendRecord,
  appendHumanReview,
  appendHumanDecision,
  analysisView,
};
