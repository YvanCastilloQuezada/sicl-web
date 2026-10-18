import { describe, expect, it } from "vitest";
import { sha256Base64, sha256Hex } from "./sha256";

describe("sha256 helpers", () => {
  it("calcula el digest hexadecimal SHA-256 de texto UTF-8", async () => {
    await expect(sha256Hex("MiLukita")).resolves.toBe("13898b2ae304831aec7daef36467ed583190eb48b63ddac00355fb8f23fbb4e2");
  });

  it("calcula el digest de los bytes decodificados desde base64", async () => {
    await expect(sha256Base64("SG9sYQ==")).resolves.toBe("e633f4fc79badea1dc5db970cf397c8248bac47cc3acf9915ba60b5d76b0e88f");
  });
});
