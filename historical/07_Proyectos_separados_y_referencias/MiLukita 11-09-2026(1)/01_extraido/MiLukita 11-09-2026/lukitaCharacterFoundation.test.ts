import { describe, expect, it } from "vitest";
import { LUKITA_CHARACTER_FOUNDATION, LUKITA_CHARACTER_FOUNDATION_VERSION, isLukitaCharacterFoundationPresentationOnly } from "./lukitaCharacterFoundation";

describe("Lukita Character Foundation", () => {
  it("declara una identidad visual estable y un estado pendiente de aprobación humana", () => {
    expect(LUKITA_CHARACTER_FOUNDATION_VERSION).toBe("LUKITA-CHARACTER-FOUNDATION-01");
    expect(LUKITA_CHARACTER_FOUNDATION.identity.name).toBe("Lukita");
    expect(LUKITA_CHARACTER_FOUNDATION.identity.visualStyle).toContain("3D estilizado premium");
    expect(LUKITA_CHARACTER_FOUNDATION.governance.approvalStatus).toBe("CANDIDATE_FOUNDATION_FOR_HUMAN_APPROVAL");
  });

  it("mantiene el personaje en el perímetro presentation-only", () => {
    expect(isLukitaCharacterFoundationPresentationOnly(LUKITA_CHARACTER_FOUNDATION)).toBe(true);
    expect(LUKITA_CHARACTER_FOUNDATION.governance.prohibitedAccess).toEqual(expect.arrayContaining(["rng", "results", "wallet", "ledger", "mjp_tv_manifest"]));
  });

  it("define el bucle Live orientado a cámara y social", () => {
    expect(LUKITA_CHARACTER_FOUNDATION.experience.primaryLoop).toEqual(["discover", "meet", "interact", "capture", "share"]);
    expect(LUKITA_CHARACTER_FOUNDATION.experience.cameraModes).toEqual(["front", "rear"]);
    expect(LUKITA_CHARACTER_FOUNDATION.experience.captureModes).toEqual(["photo", "video"]);
  });
});
