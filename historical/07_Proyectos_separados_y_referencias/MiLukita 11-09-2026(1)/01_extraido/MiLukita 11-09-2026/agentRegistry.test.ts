import { describe, expect, it } from "vitest";
import { AGENT_AUTHORITY_BOUNDARY, AGENT_REGISTRY, canAgentMutateCore, summarizeAgentRegistry } from "./agentRegistry";

describe("agent registry", () => {
  it("contains the 16 requested governed agents including the reserved Legal Agent", () => {
    expect(AGENT_REGISTRY).toHaveLength(16);
    expect(AGENT_REGISTRY.map((entry) => entry.name)).toEqual(expect.arrayContaining(["Audience Intelligence", "Marketing Intelligence", "Social", "Content", "Lukita", "Sales", "Revenue", "Financial Intelligence", "Experience Director", "Auditor", "Watchdog", "Recovery", "Supervisor", "Business Strategy", "Distribution", "Legal & Compliance Intelligence Agent"]));
  });

  it("never grants core mutation authority", () => {
    expect(AGENT_REGISTRY.every((entry) => canAgentMutateCore(entry) === false)).toBe(true);
    expect(AGENT_REGISTRY.every((entry) => entry.authorityBoundary === AGENT_AUTHORITY_BOUNDARY)).toBe(true);
  });

  it("does not fabricate maturity or operational metrics", () => {
    expect(AGENT_REGISTRY.every((entry) => entry.declaredMaturity === null)).toBe(true);
    expect(AGENT_REGISTRY.every((entry) => Object.values(entry.observedMetrics).every((value) => value === null))).toBe(true);
  });

  it("summarizes evidence states without hiding partial readiness", () => {
    const summary = summarizeAgentRegistry();
    expect(summary.total).toBe(16);
    expect(summary.implemented).toBeGreaterThan(0);
    expect(summary.partial + summary.prepared + summary.implemented + summary.planned).toBe(16);
    expect(summary.allCoreMutationDisabled).toBe(true);
  });
});
