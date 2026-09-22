import { describe, expect, it } from "vitest";
import { canTransferKnowledge, classifyKnowledgeInterest, prepareKnowledgeExchange, reconcileKnowledgeDisagreement } from "../shared/arluKnowledgeExchange";
import type { Delta62KnowledgeRecord } from "../shared/delta62Knowledge";
const record = (state: Delta62KnowledgeRecord["state"], domain: string): Delta62KnowledgeRecord => ({ recordId: "BOOK-001", formatVersion: "DELTA-6.2-FEDERATED-KNOWLEDGE-1.0", product: "LUCA", domain, title: "GIS y arquitectura", statement: "Registro aprobado", recordType: "SOURCE", state, provenance: ["UPLOAD", "HUMAN_APPROVAL"], sourceCommit: "abc123", sourceFile: "uploads/book.pdf", dependencies: [], confidence: "REVIEWED", humanReviewRequired: true });
describe("AR-LU knowledge exchange", () => {
  it("routes GIS and architecture knowledge to both products", () => expect(classifyKnowledgeInterest({ source: "LUCA", domains: ["GIS", "ARCHITECTURE"] })).toBe("BOTH"));
  it("notifies only after approval and preserves provenance", () => { const notification = prepareKnowledgeExchange(record("VALIDATED", "GEOSPATIAL"), { now: new Date("2026-09-22T05:00:00Z") }); expect(notification.status).toBe("READY_FOR_TRANSFER"); expect(canTransferKnowledge(notification, true).allowed).toBe(true); expect(notification.sourceFile).toBe("uploads/book.pdf"); });
  it("keeps unapproved books pending", () => expect(prepareKnowledgeExchange(record("STAGED", "LANDSCAPE")).status).toBe("PENDING_REVIEW"));
  it("quarantines disagreement instead of deleting automatically", () => { const result = reconcileKnowledgeDisagreement({ recordId: "BOOK-001", source: "LUCA", disagreement: true, humanReview: false }); expect(result.action).toBe("QUARANTINE"); expect(result.status).toBe("REVOKE_PENDING_REVIEW"); });
});
