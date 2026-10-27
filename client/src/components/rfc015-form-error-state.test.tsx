import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EvidenceForm from "@/components/EvidenceForm";
import SourceForm from "@/components/SourceForm";
import EvaluationForm from "@/components/EvaluationForm";
import ComparisonForm from "@/components/ComparisonForm";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe("RFC-015 forms", () => {
  it("preserves Evidence fields when the save fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(<EvidenceForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("phase_a.evidence_id"), { target: { value: "E-FAIL" } });
    fireEvent.change(screen.getByLabelText("module_ui.statement"), { target: { value: "Keep this statement" } });
    fireEvent.submit(screen.getByRole("button", { name: "phase_a.create_evidence" }).closest("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByLabelText("phase_a.evidence_id")).toHaveValue("E-FAIL");
    expect(screen.getByLabelText("module_ui.statement")).toHaveValue("Keep this statement");
  });

  it("preserves Source fields when the save fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(<SourceForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("phase_a.source_id"), { target: { value: "S-FAIL" } });
    fireEvent.change(screen.getByLabelText("module_ui.title"), { target: { value: "Keep this source" } });
    fireEvent.submit(screen.getByRole("button", { name: "phase_a.create_source" }).closest("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByLabelText("phase_a.source_id")).toHaveValue("S-FAIL");
    expect(screen.getByLabelText("module_ui.title")).toHaveValue("Keep this source");
  });

  it("preserves Evaluation fields when the save fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(<EvaluationForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("gate.alternative"), { target: { value: "A-FAIL" } });
    fireEvent.change(screen.getByLabelText("gate.objective"), { target: { value: "Objective" } });
    fireEvent.submit(screen.getByRole("button", { name: "phase_a.create_evaluation" }).closest("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByLabelText("gate.alternative")).toHaveValue("A-FAIL");
    expect(screen.getByLabelText("gate.objective")).toHaveValue("Objective");
  });

  it("preserves Comparison fields when the save fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(<ComparisonForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("ui.alternatives_min"), { target: { value: "A, B" } });
    fireEvent.change(screen.getByLabelText("ui.objectives_optional"), { target: { value: "Energy" } });
    fireEvent.submit(screen.getByRole("button", { name: "phase_a.create_comparison" }).closest("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByLabelText("ui.alternatives_min")).toHaveValue("A, B");
    expect(screen.getByLabelText("ui.objectives_optional")).toHaveValue("Energy");
  });

  it("clears Evidence fields only after a successful save", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<EvidenceForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("phase_a.evidence_id"), { target: { value: "E-OK" } });
    fireEvent.change(screen.getByLabelText("module_ui.statement"), { target: { value: "Saved statement" } });
    fireEvent.submit(screen.getByRole("button", { name: "phase_a.create_evidence" }).closest("form")!);
    await waitFor(() => expect(screen.getByLabelText("phase_a.evidence_id")).toHaveValue(""));
    expect(screen.getByLabelText("module_ui.statement")).toHaveValue("");
  });
});
