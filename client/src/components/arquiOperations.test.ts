import { describe, expect, it } from "vitest";
import { parseArquiOperation, prepareHeightAction, verifyHeightResult } from "./arquiOperations";

const project = { id: "UPAO-001", alternatives: { "UPAO-001-A": { parameters: { floors: 2 } }, "UPAO-001-B": { parameters: { floors: 3 } } } } as any;

describe("ARQUI P9 controlled operations", () => {
  it("prepares an explicit, bounded action without executing it", () => {
    const parsed = parseArquiOperation("change alternative UPAO-001-A to 5 floors");
    expect(parsed.kind).toBe("CHANGE_HEIGHT");
    const action = prepareHeightAction("UPAO-001", project, parsed);
    expect("error" in action).toBe(false);
    if (!("error" in action)) {
      expect(action.source).toBe("USER_PROVIDED");
      expect(action.authority).toBe("EXPLICIT_COMMAND");
      expect(action.parameters.floors).toBe(5);
    }
  });
  it("rejects an ambiguous subject instead of selecting an alternative implicitly", () => {
    const action = prepareHeightAction("UPAO-001", project, parseArquiOperation("change to 5 floors"));
    expect(action).toEqual({ error: "Select one explicit alternative before changing its height." });
  });
  it("rejects unsupported or invalid inputs", () => {
    expect(parseArquiOperation("add a wall").kind).toBe("UNSUPPORTED");
    expect(parseArquiOperation("change alternative UPAO-001-A to banana floors").kind).toBe("INVALID");
    expect(parseArquiOperation("change alternative UPAO-001-A height to 18 m").kind).toBe("UNSUPPORTED");
  });
  it("requires explicit apply for a prepared action and verifies canonical readback", () => {
    const parsed = parseArquiOperation("change alternative UPAO-001-A to 5 floors");
    const action = prepareHeightAction("UPAO-001", project, parsed);
    expect("error" in action).toBe(false);
    if (!("error" in action)) {
      expect(parseArquiOperation("do it").kind).toBe("APPLY_PREPARED");
      expect(verifyHeightResult({ project_id: "UPAO-001", alternative_id: "UPAO-001-A:child", proposed_child: { project_id: "UPAO-001", alternative_id: "UPAO-001-A:child", parameters: { floors: 5 } } }, action).verified).toBe(true);
      expect(verifyHeightResult({ proposed_child: { parameters: { floors: 6 } } }, action).verified).toBe(false);
    }
  });
  it("supports stop/revocation and bounded delegation commands", () => {
    expect(parseArquiOperation("stop").kind).toBe("STOP");
    const delegated = prepareHeightAction("UPAO-001", project, parseArquiOperation("enter alternative UPAO-001-A 4 floors"), "DELEGATED_INPUT");
    expect("error" in delegated).toBe(false);
    if (!("error" in delegated)) expect(delegated.authority).toBe("DELEGATED_INPUT");
  });
});
