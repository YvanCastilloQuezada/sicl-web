#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import process from "node:process";

const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite");

function quoteSqlitePath(value) {
  return "'" + value.replaceAll("'", "''") + "'";
}

async function sha256File(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
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


export async function restoreContinuityOutbox({ backupPath, targetPath, manifestPath = `${backupPath}.manifest.json` }) {
  const backup = path.resolve(backupPath);
  const target = path.resolve(targetPath);
  const manifestFile = path.resolve(manifestPath);
  const directory = path.dirname(target);
  await fs.access(backup);
  const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
  if (manifest.artifact !== "ARKI_MEMORY_WEB_OUTBOX_BACKUP" ||
      manifest.backup_file !== path.basename(backup) ||
      manifest.integrity_check !== "ok" ||
      !/^[a-f0-9]{64}$/.test(manifest.sha256 ?? "")) {
    throw new Error("OUTBOX_BACKUP_MANIFEST_INVALID");
  }
  const stat = await fs.stat(backup);
  if (stat.size !== manifest.bytes || await sha256File(backup) !== manifest.sha256) {
    throw new Error("OUTBOX_BACKUP_CHECKSUM_MISMATCH");
  }

  const sourceDb = new DatabaseSync(backup);
  try {
    const integrity = sourceDb.prepare("PRAGMA integrity_check").get();
    if (!integrity || Object.values(integrity)[0] !== "ok") throw new Error("OUTBOX_BACKUP_INTEGRITY_FAILED");
    const table = sourceDb.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='arki_continuity_outbox'"
    ).get();
    if (!table) throw new Error("OUTBOX_BACKUP_SCHEMA_INVALID");
  } finally {
    sourceDb.close();
  }

  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  try { await fs.chmod(directory, 0o700); } catch { /* best effort on restricted filesystems */ }
  try {
    await fs.access(target);
    throw new Error("OUTBOX_RESTORE_TARGET_EXISTS");
  } catch (error) {
    if (error instanceof Error && error.message === "OUTBOX_RESTORE_TARGET_EXISTS") throw error;
    if (error?.code !== "ENOENT") throw error;
  }

  const temporary = path.join(directory, `.${path.basename(target)}.restore-${randomUUID()}`);
  try {
    const db = new DatabaseSync(backup);
    try { db.exec(`VACUUM INTO ${quoteSqlitePath(temporary)}`); }
    finally { db.close(); }

    const restored = new DatabaseSync(temporary);
    try {
      const integrity = restored.prepare("PRAGMA integrity_check").get();
      const table = restored.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='arki_continuity_outbox'"
      ).get();
      if (!integrity || Object.values(integrity)[0] !== "ok" || !table) {
        throw new Error("OUTBOX_RESTORE_VERIFICATION_FAILED");
      }
    } finally { restored.close(); }

    await fs.chmod(temporary, 0o600);
    // Hard-link publication is atomic and refuses to overwrite an existing target.
    await fs.link(temporary, target);
    await fs.unlink(temporary);
    return { targetPath: target, integrity_check: "ok", sha256: await sha256File(target) };
  } catch (error) {
    await fs.rm(temporary, { force: true });
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--restore") {
    if (!args[1] || !args[2] || args.length > 3) {
      throw new Error("USAGE: node scripts/arki-memory-outbox-backup.mjs --restore <backup.sqlite> <target.sqlite>");
    }
    const result = await restoreContinuityOutbox({ backupPath: args[1], targetPath: args[2] });
    console.log(JSON.stringify(result));
    return;
  }
  if (args.length > 0) {
    throw new Error("UNKNOWN_ARGUMENT; use --restore <backup.sqlite> <target.sqlite> or no arguments for backup");
  }
  const root = process.env.ARKI_STORAGE_ROOT?.trim() || path.join(process.cwd(), "data");
  const sourcePath = process.env.ARKI_CONTINUITY_OUTBOX_PATH?.trim()
    || path.join(root, "memory", "continuity-outbox.sqlite");
  const backupDir = process.env.ARKI_CONTINUITY_BACKUP_DIR?.trim()
    || path.join(root, "backups", "memory-outbox");
  const result = await backupContinuityOutbox({ sourcePath, backupDir });
  console.log(JSON.stringify(result.manifest));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "OUTBOX_BACKUP_FAILED");
    process.exitCode = 1;
  });
}
