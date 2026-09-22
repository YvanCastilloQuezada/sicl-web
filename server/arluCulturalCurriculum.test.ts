import { describe, expect, it } from "vitest";
import { culturalCurriculumSummary, listCulturalTopics } from "../shared/arluCulturalCurriculum";
describe("AR-LU cultural curriculum", () => {
  it("enables shared cultural topics for both products", () => { const topics = listCulturalTopics("LUCA"); expect(topics.length).toBeGreaterThan(8); expect(topics.some((topic) => topic.domain === "HISTORY_PERU")).toBe(true); expect(topics.some((topic) => topic.domain === "HERITAGE")).toBe(true); expect(topics.some((topic) => topic.domain === "TOURISM")).toBe(true); });
  it("keeps every topic research-pending and non-canonical", () => { const summary = culturalCurriculumSummary(); expect(summary.researchPending).toBe(summary.total); expect(summary.canonicalized).toBe(0); });
});
