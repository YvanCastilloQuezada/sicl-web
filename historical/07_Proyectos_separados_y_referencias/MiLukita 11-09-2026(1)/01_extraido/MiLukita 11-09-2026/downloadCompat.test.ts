import { describe, expect, it } from "vitest";
import { chooseDownloadStrategy, isIosSafariLike } from "./downloadCompat";

describe("download compatibility", () => {
  it("detects Safari iOS while excluding iOS Chromium", () => {
    expect(isIosSafariLike("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1", "iPhone", 5)).toBe(true);
    expect(isIosSafariLike("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120.0 Mobile/15E148 Safari/604.1", "iPhone", 5)).toBe(false);
  });

  it("uses a normal anchor on Android TV when download is supported", () => {
    expect(chooseDownloadStrategy({ userAgent: "Mozilla/5.0 (Linux; Android 12; Android TV) AppleWebKit/537.36 Chrome/120.0 Safari/537.36", supportsDownload: true, openedTab: false })).toBe("anchor");
  });

  it("falls back to a tab or navigation when an anchor download is unreliable", () => {
    expect(chooseDownloadStrategy({ userAgent: "Safari iPhone", supportsDownload: true, openedTab: true })).toBe("open-tab");
    expect(chooseDownloadStrategy({ userAgent: "Safari iPhone", supportsDownload: true, openedTab: false })).toBe("navigation");
    expect(chooseDownloadStrategy({ userAgent: "Legacy Browser", supportsDownload: false, openedTab: false })).toBe("navigation");
  });
});
