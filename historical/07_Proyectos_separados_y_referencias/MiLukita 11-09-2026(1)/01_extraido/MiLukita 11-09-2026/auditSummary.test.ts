import { describe, expect, it } from "vitest";
import { AUDIT_SUMMARY_ITEMS, filterAuditSummary } from "./auditSummary";

describe("audit summary", () => {
  it("incluye el inventario mínimo y conserva los riesgos críticos", () => {
    expect(AUDIT_SUMMARY_ITEMS.length).toBeGreaterThanOrEqual(10);
    expect(AUDIT_SUMMARY_ITEMS.some((item) => item.title === "MJP CORE conserva la autoridad" && item.priority === "P0")).toBe(true);
    expect(AUDIT_SUMMARY_ITEMS.some((item) => item.status === "PAUSADO")).toBe(true);
  });

  it("filtra por texto, estado y prioridad sin mutar la fuente", () => {
    const source = [...AUDIT_SUMMARY_ITEMS];
    const result = filterAuditSummary(AUDIT_SUMMARY_ITEMS, "Watchdog", "VERIFICADO", "P1");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Watchdog ALERT_ONLY");
    expect(AUDIT_SUMMARY_ITEMS).toEqual(source);
  });

  it("permite identificar lo que sigue abierto o no verificado", () => {
    const result = filterAuditSummary(AUDIT_SUMMARY_ITEMS, "", "NO VERIFICADO", "P1");
    expect(result.map((item) => item.area)).toContain("Hardware");
  });
});
