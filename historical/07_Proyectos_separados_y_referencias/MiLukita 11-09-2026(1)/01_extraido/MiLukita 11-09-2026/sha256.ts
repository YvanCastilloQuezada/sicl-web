export async function sha256Hex(value: string): Promise<string> {
  return sha256Bytes(new TextEncoder().encode(value));
}

export async function sha256Bytes(value: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error("WEB_CRYPTO_UNAVAILABLE");
  const stableBuffer = new Uint8Array(value).buffer as ArrayBuffer;
  const digest = await globalThis.crypto.subtle.digest("SHA-256", stableBuffer);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function sha256Base64(value: string): Promise<string> {
  const binary = typeof atob === "function" ? atob(value) : Buffer.from(value, "base64").toString("binary");
  return sha256Bytes(Uint8Array.from(binary, character => character.charCodeAt(0)));
}
