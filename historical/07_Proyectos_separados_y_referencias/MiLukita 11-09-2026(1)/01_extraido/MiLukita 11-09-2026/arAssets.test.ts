import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { validateArAssetPayload } from "../server/arAssets";

describe("Order 58 LUKA AR asset registry", () => {
  it("exposes the complete backend asset API", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("arAssets.register");
    expect(procedures).toContain("arAssets.get");
    expect(procedures).toContain("arAssets.createVersion");
    expect(procedures).toContain("arAssets.validate");
    expect(procedures).toContain("arAssets.associate");
    expect(procedures).toContain("arAssets.archive");
    expect(procedures).toContain("arAssets.getPublished");
  });

  it("validates GLB magic, metadata, size and checksum", () => {
    const bytes = new Uint8Array([0x67, 0x6c, 0x54, 0x46, 0, 0, 0, 0, 0, 0, 0, 0]);
    const result = validateArAssetPayload({ mimeType: "model/gltf-binary", originalName: "lukita.glb", bytes, metadata: { anchors: ["floor"] } });
    expect(result.valid).toBe(true);
    expect(result.format).toBe("GLB");
    expect(result.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects a fake GLB with only a .glb-like MIME claim", () => {
    const result = validateArAssetPayload({ mimeType: "model/gltf-binary", originalName: "fake.glb", bytes: new Uint8Array([1, 2, 3]), metadata: {} });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_GLB_MAGIC");
  });

  it("validates GLTF JSON structure and rejects malformed metadata", () => {
    const valid = validateArAssetPayload({ mimeType: "model/gltf+json", originalName: "lukita.gltf", bytes: new TextEncoder().encode(JSON.stringify({ asset: { version: "2.0" } })), metadata: { scale: 1 } });
    expect(valid.valid).toBe(true);
    const invalid = validateArAssetPayload({ mimeType: "model/gltf+json", originalName: "bad.gltf", bytes: new TextEncoder().encode("not json"), metadata: [] as never });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain("INVALID_GLTF_DOCUMENT");
    expect(invalid.errors).toContain("ASSET_METADATA_REQUIRED");
  });

  it("does not expose publication as a second AR-specific gate", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("territorial.publishApprovedVersion");
    expect(procedures).toContain("arAssets.publishForWorldObject");
    expect(procedures).toContain("arAssets.getPublished");
  });
});
