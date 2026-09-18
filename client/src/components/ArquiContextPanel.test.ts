// @vitest-environment jsdom
import React from "react";
import { I18nextProvider } from "react-i18next";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/i18n";

const clientMock = vi.hoisted(() => ({
  listEvidence: vi.fn(),
  listSpatialRegistrations: vi.fn(),
  getProject: vi.fn(),
}));

vi.mock("@/api/sicl-client", () => ({
  siclClient: clientMock,
  apiErrorMessage: (error: unknown) => error instanceof Error ? error.message : "error",
}));

import ArquiContextPanel, { evidenceState, registrationIsAvailable } from "./ArquiContextPanel";

const renderPanel = (projectId: string, onNavigate: () => void) => render(
  React.createElement(I18nextProvider, { i18n }, React.createElement(ArquiContextPanel, { projectId, onNavigate })),
);

describe("ArquiContextPanel", () => {
  afterEach(() => cleanup());
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    clientMock.listEvidence.mockReset();
    clientMock.listSpatialRegistrations.mockReset();
    clientMock.getProject.mockReset();
    clientMock.getProject.mockResolvedValue({ project_id: "P", alternatives: [], evaluations: [], comparisons: [] });
  });

  it("derives confirmed and AI-proposed states without upgrading epistemic status", async () => {
    clientMock.listEvidence.mockResolvedValue([
      { evidence_id: "E1", evidence_type: "PHOTO", state: "AI_PROPOSED" },
      { evidence_id: "E2", evidence_type: "OBSERVATION", epistemic_state: "HUMAN_CONFIRMED", state: "OBSERVED" },
    ]);
    clientMock.listSpatialRegistrations.mockResolvedValue({ registrations: [{ registration_id: "R1", status: "LOCKED" }] });
    renderPanel("P-1", vi.fn());
    await waitFor(() => expect(screen.getByText("1 AI-proposed observations require human review.")).toBeTruthy());
    expect(screen.getByText("Registered")).toBeTruthy();
    expect(screen.queryByText(/confirmed conditions/i)).toBeNull();
  });

  it("shows empty context and routes contextual actions to existing modules", async () => {
    const onNavigate = vi.fn();
    clientMock.listEvidence.mockResolvedValue([]);
    clientMock.listSpatialRegistrations.mockResolvedValue({ registrations: [] });
    renderPanel("P-2", onNavigate);
    await waitFor(() => expect(screen.getByText("No field evidence has been recorded for this project yet.")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Capture or add a photograph" }));
    expect(onNavigate).toHaveBeenCalledWith("evidence");
    fireEvent.click(screen.getByRole("button", { name: "View context and location" }));
    expect(onNavigate).toHaveBeenCalledWith("context");
  });

  it("renders the invariant ARQUI identity and toggles compact/expanded presentation", async () => {
    clientMock.listEvidence.mockResolvedValue([]);
    clientMock.listSpatialRegistrations.mockResolvedValue({ registrations: [] });
    renderPanel("P-3", vi.fn());
    await waitFor(() => expect(screen.getByTestId("arqui-avatar")).toBeTruthy());
    expect(screen.getByText("ARQUI")).toBeTruthy();
    expect(screen.getByText("Your contextual architectural assistant")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Collapse ARQUI" }));
    expect(screen.queryByText("Contextual guidance")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Expand ARQUI" }));
    expect(screen.getByText("Contextual guidance")).toBeTruthy();
  });

  it("keeps canonical state helpers explicit", () => {
    expect(evidenceState({ state: "AI_PROPOSED" } as never)).toBe("AI_PROPOSED");
    expect(registrationIsAvailable({ status: "LOCKED" } as never)).toBe(true);
    expect(registrationIsAvailable({ status: "PROPOSED" } as never)).toBe(false);
  });
});
