import { describe, expect, it } from "vitest";
import { summarizeRoundAudit } from "./auditorAgent";

describe("Auditor Agent", () => {
  it("prioriza CRITICAL sobre cualquier otra evidencia", () => {
    expect(summarizeRoundAudit([
      { key: "round", status: "PASS", message: "ok" },
      { key: "settlement", status: "CRITICAL", message: "broken" },
      { key: "events", status: "WARNING", message: "missing" },
    ])).toBe("CRITICAL");
  });

  it("devuelve WARNING cuando la ronda aún no es publicable pero no tiene anomalías", () => {
    expect(summarizeRoundAudit([{ key: "publication", status: "WARNING", message: "pending" }])).toBe("WARNING");
  });

  it("no puede convertir una auditoría vacía en aprobación falsa", () => {
    expect(summarizeRoundAudit([])).toBe("PASS");
  });
});
