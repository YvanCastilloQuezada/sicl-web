import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { backupContinuityOutbox } from "./arki-memory-outbox-backup.mjs";

const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite");

test("SQLite outbox backup is a consistent, integrity-checked snapshot", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "arki-outbox-backup-test-"));
  const source = path.join(directory, "source.sqlite");
  const backupDir = path.join(directory, "backups");
  try {
    const db = new DatabaseSync(source);
    db.exec("CREATE TABLE events(id INTEGER PRIMARY KEY, payload TEXT NOT NULL)");
    db.prepare("INSERT INTO events(payload) VALUES (?)").run("encrypted-event-envelope");
    db.close();

    const result = await backupContinuityOutbox({ sourcePath: source, backupDir });
    assert.equal(result.manifest.integrity_check, "ok");
    assert.equal(result.manifest.bytes > 0, true);
    assert.equal(result.manifest.sha256.length, 64);

    const backup = new DatabaseSync(result.backupPath);
    try {
      assert.equal(backup.prepare("SELECT payload FROM events").get()?.payload, "encrypted-event-envelope");
      assert.deepEqual(backup.prepare("PRAGMA integrity_check").get(), { integrity_check: "ok" });
    } finally { backup.close(); }

    const manifest = JSON.parse(await fs.readFile(result.manifestPath, "utf8"));
    assert.equal(manifest.sha256, result.manifest.sha256);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
