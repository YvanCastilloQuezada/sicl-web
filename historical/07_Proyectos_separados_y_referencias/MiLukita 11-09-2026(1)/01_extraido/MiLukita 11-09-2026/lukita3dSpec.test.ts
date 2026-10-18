import { describe, expect, it } from "vitest";
import { clampAnnotationCoordinate, clampCameraElevation, clampCameraPan, clampCameraZoom, get3DVersionLabel, getCandidateChecklistStatus, isCandidateReadyForHumanReview, isSupported3DFileName, isSupported3DModelUrl, LUKITA_3D_ANNOTATION_CATEGORIES, LUKITA_3D_APPROVED_VERSION, LUKITA_3D_CANDIDATE_ID, LUKITA_3D_EXPRESSIONS, LUKITA_3D_POSES, LUKITA_3D_REVIEW_STATUSES, parseAnnotationSession } from "./lukita3dSpec";

describe("Lukita 3D production studio contract", () => {
  it("keeps the approved visual version immutable in the studio", () => {
    expect(LUKITA_3D_APPROVED_VERSION).toBe("LUKITA-A+B+C-2D-APPROVED-01");
  });

  it("exposes the required validation poses and expressions", () => {
    expect(LUKITA_3D_POSES).toEqual(["neutral", "welcome", "present", "celebrate", "contingency"]);
    expect(LUKITA_3D_EXPRESSIONS).toEqual(["neutral", "smile", "focus", "celebrate", "contingency"]);
  });

  it("accepts only GLB and GLTF model filenames", () => {
    expect(isSupported3DFileName("lukita-blockout.glb")).toBe(true);
    expect(isSupported3DFileName("lukita-blockout.GLTF")).toBe(true);
    expect(isSupported3DFileName("lukita.png")).toBe(false);
    expect(isSupported3DFileName("lukita.exe")).toBe(false);
  });

  it("keeps annotation categories and coordinates within the review canvas", () => {
    expect(LUKITA_3D_ANNOTATION_CATEGORIES).toContain("Rostro");
    expect(clampAnnotationCoordinate(-10)).toBe(0);
    expect(clampAnnotationCoordinate(120)).toBe(100);
    expect(clampAnnotationCoordinate(Number.NaN)).toBe(0);
    expect(clampAnnotationCoordinate(42.5)).toBe(42.5);
  });

  it("imports only valid bounded annotation sessions", () => {
    expect(parseAnnotationSession({ schema: "wrong", annotations: [] })).toBeNull();
    expect(parseAnnotationSession({ schema: "milukita-review-annotations.v1", annotations: [{ id: 1, x: -5, y: 150, category: "Rostro", note: "Revisar" }, { id: 2, x: 40, y: 50, category: "Invalida", note: "No" }] })).toEqual({ annotations: [{ id: 1, x: 0, y: 100, category: "Rostro", note: "Revisar" }] });
  });

  it("exposes an explicit candidate decision contract without production approval", () => {
    expect(LUKITA_3D_CANDIDATE_ID).toBe("LUKITA-3D-CANDIDATE-01");
    expect(LUKITA_3D_REVIEW_STATUSES).toContain("APPROVED · TECHNICAL BLOCKOUT ONLY");
    expect(LUKITA_3D_REVIEW_STATUSES).toContain("REJECTED · CORRECTION REQUIRED");
  });

  it("accepts only secure direct model URLs for external preview", () => {
    expect(isSupported3DModelUrl("https://cdn.example.com/lukita.glb")).toBe(true);
    expect(isSupported3DModelUrl("https://cdn.example.com/lukita.gltf?rev=2")).toBe(true);
    expect(isSupported3DModelUrl("http://cdn.example.com/lukita.glb")).toBe(false);
    expect(isSupported3DModelUrl("https://cdn.example.com/lukita.zip")).toBe(false);
    expect(isSupported3DModelUrl("javascript:alert(1)")).toBe(false);
  });

  it("requires every candidate gate before human review and rejects flagged assets", () => {
    expect(isCandidateReadyForHumanReview({ license: true, provenance: true, identity: true, technical: true })).toBe(true);
    expect(isCandidateReadyForHumanReview({ license: true, provenance: true, identity: true })).toBe(false);
    expect(isCandidateReadyForHumanReview({ license: true, provenance: true, identity: true, technical: true }, true)).toBe(false);
  });

  it("classifies checklist rows for approved and pending exports", () => {
    const complete = { license: true, provenance: true, identity: true, technical: true };
    expect(getCandidateChecklistStatus("Lukita candidate 02", complete)).toBe("approved");
    expect(getCandidateChecklistStatus("Lukita candidate 02", { license: true })).toBe("pending");
    expect(getCandidateChecklistStatus("Superhero reference", complete)).toBe("pending");
  });

  it("clamps interactive camera controls to safe review bounds", () => {
    expect(clampCameraZoom(-2)).toBe(0.65);
    expect(clampCameraZoom(3)).toBe(1.8);
    expect(clampCameraElevation(-2)).toBe(-0.7);
    expect(clampCameraElevation(2)).toBe(1.35);
    expect(clampCameraPan(-4)).toBe(-1.25);
    expect(clampCameraPan(4)).toBe(1.25);
  });

  it("limits version labels to a safe readable length", () => {
    expect(get3DVersionLabel("  blockout-02.glb  ")).toBe("blockout-02.glb");
    expect(get3DVersionLabel(" ")).toBe("Versión sin nombre");
    expect(get3DVersionLabel("x".repeat(100))).toHaveLength(80);
  });
});
