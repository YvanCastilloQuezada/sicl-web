import { describe, expect, it } from "vitest";
import { transcribeFieldAudio } from "./voiceEngine";

describe("Fase E.2 · Voice Engine", () => {
  it("rechaza audio sin HTTPS antes de llamar al proveedor STT", async () => {
    await expect(transcribeFieldAudio({ audioUrl: "http://example.com/audio.webm" })).resolves.toEqual({
      error: "Audio URL must use HTTPS",
      code: "INVALID_FORMAT",
    });
  });

  it("rechaza URLs inválidas sin exponer detalles internos", async () => {
    await expect(transcribeFieldAudio({ audioUrl: "not-a-url" })).resolves.toEqual({
      error: "Audio URL is invalid",
      code: "INVALID_FORMAT",
    });
  });
});
