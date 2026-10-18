export type DownloadStrategy = "anchor" | "open-tab" | "navigation";

export function isIosSafariLike(userAgent: string, platform = "", maxTouchPoints = 0): boolean {
  const appleMobile = /iPad|iPhone|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
  return appleMobile && /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS/i.test(userAgent);
}

export function chooseDownloadStrategy(input: { userAgent: string; platform?: string; maxTouchPoints?: number; supportsDownload: boolean; openedTab: boolean }): DownloadStrategy {
  if (isIosSafariLike(input.userAgent, input.platform, input.maxTouchPoints) || !input.supportsDownload) {
    return input.openedTab ? "open-tab" : "navigation";
  }
  return "anchor";
}

export async function downloadBlobCompat(blob: Blob, filename: string): Promise<DownloadStrategy> {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.position = "fixed";
  anchor.style.left = "-9999px";
  document.body.appendChild(anchor);
  const supportsDownload = "download" in anchor;
  const needsFallback = isIosSafariLike(navigator.userAgent, navigator.platform, navigator.maxTouchPoints) || !supportsDownload;
  let openedTab: Window | null = null;
  if (needsFallback) openedTab = window.open(url, "_blank", "noopener,noreferrer");
  const strategy = chooseDownloadStrategy({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    supportsDownload,
    openedTab: Boolean(openedTab),
  });

  if (strategy === "anchor") {
    anchor.click();
  } else if (strategy === "navigation" && !openedTab) {
    window.location.assign(url);
  }

  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 30_000);
  return strategy;
}

export async function downloadDataUrlCompat(dataUrl: string, filename: string, mimeType = "image/png"): Promise<DownloadStrategy> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const normalized = blob.type ? blob : new Blob([blob], { type: mimeType });
  return downloadBlobCompat(normalized, filename);
}
