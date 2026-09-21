import { describe, expect, it } from "vitest";
import { attachDecodedGeometry, ifc4Contract, parseIfc4, validateIfcRoundTrip } from "./arkiIfc4";
import { buildHostConnectionRequest, selfCareContract, validateHostEndpoint } from "./arkiHostConnection";

const IFC = `ISO-10303-21;HEADER;FILE_SCHEMA(('IFC4'));ENDSEC;DATA;#1=IFCPROJECT('0a','owner','Project',$,$,$,$,$);#2=IFCWALL('1b',$,'Wall 01',$,$,$,$,$);ENDSEC;END-ISO-10303-21;`;

describe("ARKI IFC4 and governed hosts", () => {
  it("parses IFC4 semantics without executing file contents", () => {
    const result = parseIfc4(IFC);
    expect(result.status).toBe("PARSED");
    expect(result.schema).toBe("IFC4");
    expect(result.elements.some((element) => element.kind === "WALL")).toBe(true);
    expect(result.geometryDecoded).toBe(false);
    expect(ifc4Contract().executesFileCode).toBe(false);
  });

  it("requires decoded geometry before geometric round-trip validation", () => {
    const parsed = attachDecodedGeometry(parseIfc4(IFC), [{ expressId: 2, box: { min: [0, 0, 0], max: [4, 0.2, 3] } }]);
    expect(parsed.geometryDecoded).toBe(true);
    const result = validateIfcRoundTrip({ before: [{ id: "1b", kind: "WALL", box: { min: [0, 0, 0], max: [4, 0.2, 3] } }], after: [{ id: "1b", kind: "WALL", box: { min: [0, 0, 0], max: [4, 0.2, 3] } }] });
    expect(result.status).toBe("PASS");
  });

  it("fails round-trip on geometry drift", () => {
    const result = validateIfcRoundTrip({ before: [{ id: "1b", kind: "WALL", box: { min: [0, 0, 0], max: [4, 0.2, 3] } }], after: [{ id: "1b", kind: "WALL", box: { min: [0, 0, 0], max: [4.4, 0.2, 3] } }] });
    expect(result.status).toBe("FAIL");
    expect(result.mismatches[0].reason).toBe("GEOMETRY_OUTSIDE_TOLERANCE");
  });

  it("rejects insecure host endpoints and keeps tokens server-side", () => {
    expect(validateHostEndpoint({ kind: "REVIT", endpoint: "http://localhost:8080", capabilities: [] }).reason).toBe("HTTPS_REQUIRED");
    const request = buildHostConnectionRequest({ kind: "DYNAMO", endpoint: "https://host.example.com/run", hostId: "dynamo-1", capabilities: ["dynamo-run", "revit-transaction-guard"] });
    expect(request.validation.status).toBe("CONFIGURATION_VALID");
    expect(request.execution).toBe("DISABLED_UNTIL_SERVER_HOST_AND_HUMAN_REVIEW");
    expect(selfCareContract().forbiddenAutomaticActions).toContain("self-approve repair");
  });
});
