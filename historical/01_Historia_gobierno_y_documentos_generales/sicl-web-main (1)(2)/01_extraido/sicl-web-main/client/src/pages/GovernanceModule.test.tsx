import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GovernanceModule } from "./Home";

describe("GovernanceModule", () => {
  it("renders the shared ledger as read-only without gate or domain decision actions", () => {
    const markup = renderToStaticMarkup(<GovernanceModule />);
    expect(markup).toContain("Capability Gate Ledger");
    expect(markup).toContain("PROCESS CONTROL · NOT DECISION AUTHORITY");
    expect(markup).toContain("PROPOSAL");
    expect(markup).toContain("RELEASED");
    expect(markup).not.toContain("Advance gate");
    expect(markup).not.toContain("Create decision");
    expect(markup).not.toContain("<button");
  });
});
