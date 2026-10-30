#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite") as typeof import("node:sqlite");

function quoteSqlitePath(value) {
  return "'" + value.replaceAll("'", "''") + "'";
}

async function sha256File(file) {
  const hash = createHash("sha256");
  const handle = await fs.open(file, "r");
  try {
    for await (const chunk of handle.createReadStream()) hash.update(chunk);
  } finally {
    await handle.close();
  }
  return hash.digest("hex");
}

export async function backupContinuityOutbox({ sourcePath, backupDir }) {
  const source = path.resolve(sourcePath);
  const directory = path.resolve(backupDir);
  await fs.access(source);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  try { await fs.chmod(directory, 0o700); } catch { /* best effort on restricted filesystems */ }

  const stamp = new Date().toISOString().replaceAll(":", "").replaceAll(".", "");
  const target = path.join(directory, `arki-memory-outbox-${stamp}-${process.pid}.sqlite`);
  const db = new DatabaseSync(source);
  try {
    db.exec("PRAGMA busy_timeout=5000");
    const check = db.prepare("PRAGMA integrity_check").get();
    if (!check || Object.values(check)[0] !== "ok") throw new Error("OUTBOX_SOURCE_INTEGRITY_FAILED");
    db.exec(`VACUUM INTO ${quoteSqlitePath(target)}`);
  } finally {
    db.close();
  }

  try {
    const snapshot = new DatabaseSync(target);
    try {
      const check = snapshot.prepare("PRAGMA integrity_check").get();
      if (!check || Object.values(check)[0] !== "ok") throw new Error("OUTBOX_BACKUP_INTEGRITY_FAILED");
    } finally { snapshot.close(); }

    await fs.chmod(target, 0o600);
    const stat = await fs.stat(target);
    const manifest = {
      artifact: "ARKI_MEMORY_WEB_OUTBOX_BACKUP",
      generated_at: new Date().toISOString(),
      source_file: path.basename(source),
      backup_file: path.basename(target),
      bytes: stat.size,
      sha256: await sha256File(target),
      integrity_check: "ok",
      encryption: "AES-256-GCM event envelopes; key is stored separately",
    };
    const manifestPath = target + ".manifest.json";
    const tempManifest = manifestPath + ".tmp";
    await fs.writeFile(tempManifest, JSON.stringify(manifest, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    await fs.rename(tempManifest, manifestPath);
    try { await fs.chmod(manifestPath, 0o600); } catch { /* best effort */ }
    return { backupPath: target, manifestPath, manifest };
  } catch (error) {
    await fs.rm(target, { force: true });
    throw error;
  }
}

async function main() {
  const root = process.env.ARKI_STORAGE_ROOT?.trim() || path.join(process.cwd(), "data");
  const sourcePath = process.env.ARKI_CONTINUITY_OUTBOX_PATH?.trim()
    || path.join(root, "memory", "continuity-outbox.sqlite");
  const backupDir = process.env.ARKI_CONTINUITY_BACKUP_DIR?.trim()
    || path.join(root, "backups", "memory-outbox");
  const result = await backupContinuityOutbox({ sourcePath, backupDir });
  console.log(JSON.stringify(result.manifest));
}

if (process.argv[1] && import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "OUTBOX_BACKUP_FAILED");
    process.exitCode = 1;
  });
}
