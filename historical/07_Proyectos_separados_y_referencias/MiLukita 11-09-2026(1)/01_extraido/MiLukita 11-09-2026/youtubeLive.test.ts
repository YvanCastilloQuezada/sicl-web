import { describe, expect, it } from "vitest";
import { getYoutubeLiveStatus } from "./youtubeLive";

describe("YouTube Live adapter", () => {
  it("returns an explicit blocked state when credentials are unavailable", async () => {
    const previousKey = process.env.YOUTUBE_API_KEY;
    const previousChannel = process.env.YOUTUBE_CHANNEL_ID;
    delete process.env.YOUTUBE_API_KEY;
    delete process.env.YOUTUBE_CHANNEL_ID;
    const result = await getYoutubeLiveStatus();
    expect(result.status).toBe("BLOCKED");
    expect(result.reason).toContain("YOUTUBE_API_KEY");
    if (previousKey === undefined) delete process.env.YOUTUBE_API_KEY; else process.env.YOUTUBE_API_KEY = previousKey;
    if (previousChannel === undefined) delete process.env.YOUTUBE_CHANNEL_ID; else process.env.YOUTUBE_CHANNEL_ID = previousChannel;
  });
});
