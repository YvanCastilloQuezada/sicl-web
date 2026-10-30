# ARKI MEMORY — SICL Web local continuity outbox

## Storage authority

- SICL Core remains the sole canonical Event Store.
- SICL Web uses a local SQLite outbox only as a durable delivery queue for events not yet acknowledged by Core.
- The outbox is not a second Event Store and must never be used as the source of canonical history.
- The outbox is independent of the general SICL Web database adapter. No MariaDB service is required for CI or for this queue.

## Runtime requirements

- Node.js 22.5 or newer (the runtime must provide `node:sqlite`).
- A writable local filesystem on the Arki-02 host.
- `ARKI_CONTINUITY_ENCRYPTION_KEY`: canonical Base64 encoding of exactly 32 random bytes.
- Optional `ARKI_CONTINUITY_OUTBOX_PATH`: absolute or relative path to the SQLite database.
- If the path is not supplied, the database is stored at `$ARKI_STORAGE_ROOT/memory/continuity-outbox.sqlite`; when `ARKI_STORAGE_ROOT` is absent, `./data/memory/continuity-outbox.sqlite` is used.

Generate a key once and store it in the production secret manager or protected environment file:

```bash
openssl rand -base64 32
```

Do not regenerate the key after events have been queued. Losing or changing it makes pending encrypted envelopes unreadable and they will be moved to `BLOCKED` after integrity/decryption failure.

## File permissions and durability

- Parent directory is created with mode `0700`.
- Database file is restricted to mode `0600` where supported.
- SQLite uses WAL mode and a 5-second busy timeout.
- AES-256-GCM protects the event envelope. Authenticated additional data binds the ciphertext to owner, project, workstream, event ID, idempotency key and event type.
- SHA-256 is checked after decryption.
- Event and idempotency uniqueness are enforced by SQLite constraints.
- Delivery retries are bounded; after 12 failed attempts the event becomes `BLOCKED` and requires operator review.

## Deployment checklist

1. Confirm the Arki-02 Node runtime is at least 22.5.
2. Set `ARKI_STORAGE_ROOT` to a persistent local directory, not a temporary directory.
3. Set `ARKI_CONTINUITY_ENCRYPTION_KEY` to a protected 32-byte Base64 key.
4. Optionally set `ARKI_CONTINUITY_OUTBOX_PATH` to an explicit path under the persistent storage root.
5. Ensure the service account can write the parent directory and database file.
6. Configure `SICL_CORE_URL` and `SICL_CORE_SERVICE_TOKEN`.
7. Start SICL Web and verify `/api/continuity/projects/{projectId}/checkpoint`.
8. Record a non-decision test event, verify it reaches Core, then verify the Core event sequence and Web outbox status is `SYNCED`.
9. Stop Core temporarily in a controlled test; confirm a new event remains `PENDING_SYNC`, then restore Core and confirm it becomes `SYNCED`.
10. Test a duplicate idempotency key and a changed-payload conflict. Do not mark MEMORY operational until these checks pass.

## Backup and recovery

The outbox contains events that may not yet have reached Core. It must be included in the Arki-02 backup plan. Run `node scripts/arki-memory-outbox-backup.mjs` on a daily systemd schedule. The script uses SQLite `VACUUM INTO` to create a consistent snapshot while WAL mode is active, verifies the snapshot, writes a SHA-256 manifest and applies restrictive file permissions. It defaults to `$ARKI_STORAGE_ROOT/backups/memory-outbox`; override with `ARKI_CONTINUITY_BACKUP_DIR`. Do not copy only the main SQLite file while WAL mode is active. After recovery, preserve the encryption key, restore the database to the configured path, start Web, and inspect both `PENDING_SYNC` and `BLOCKED` rows. Core remains the canonical history once an event has been acknowledged there.

## Epistemic state

Code and automated SQLite unit tests are the implementation gates. They do not prove that the production host has the required Node version, persistent path, encryption key, Core credentials, successful migration-free startup, or successful end-to-end delivery. Those remain `UNKNOWN` until recorded from Arki-02 with command output and Core checkpoint evidence.
