// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SpatialARView from "./SpatialARView";

const mocks = vi.hoisted(() => ({
  listSpatialRegistrations: vi.fn().mockResolvedValue({ registrations: [{ registration_id: "REG-1", status: "LOCKED", derived_transform: { rotation_degrees: 0, scale: 1 } }] }),
  createPersistentSpatialEvidence: vi.fn(),
}));
vi.mock("@/api/sicl-client", () => ({ siclClient: { listSpatialRegistrations: mocks.listSpatialRegistrations, createPersistentSpatialEvidence: mocks.createPersistentSpatialEvidence, proposeSpatialRegistration: vi.fn(), transitionSpatialRegistration: vi.fn() } }));

const representation = { id: "SPATIAL-A", alternative_id: "UPAO-001-A", spatial_scope: "edificacion", north_degrees: 0, elements: [], provenance: "SYNTHETIC" } as never;

describe("SpatialARView", () => {
  it("reuses a locked registration, keeps A/B/C switching UI-only, and does not request camera on mount", async () => {
    const onAlternativeChange = vi.fn();
    render(React.createElement(SpatialARView, { projectId: "UPAO-001", selectedAlternativeId: "UPAO-001-A", representation, alternatives: ["UPAO-001-A", "UPAO-001-B", "UPAO-001-C"], onAlternativeChange, onClose: vi.fn() }));
    await waitFor(() => expect(screen.getByText(/LOCKED · REG-1/)).toBeTruthy());
    expect(screen.getByText(/Camera is inactive until you explicitly allow it/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onAlternativeChange).toHaveBeenCalledWith("UPAO-001-B");
    expect(screen.getByText(/Automatic camera upload is disabled/)).toBeTruthy();
    expect(mocks.createPersistentSpatialEvidence).not.toHaveBeenCalled();
  });
});
