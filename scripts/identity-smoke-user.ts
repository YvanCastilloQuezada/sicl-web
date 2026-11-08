/**
 * CLI one-shot: crea un usuario local de smoke test y emite un token
 * opaco, imprimiendo AMBOS por stdout (password + token). Uso:
 *
 *   pnpm tsx scripts/identity-smoke-user.ts <username> <password>
 *   pnpm tsx scripts/identity-smoke-user.ts <username>   # password auto
 *
 * Requiere ARKI_IDENTITY_ENABLE=1 y ARKI_IDENTITY_DB_PATH válidos.
 * Solo para smoke tests en 127.0.0.1; NO usar en CI de producción.
 */
import { randomBytes } from "node:crypto";
import { createCredential } from "../server/_core/arkiIdentity/auth";
import { issueToken } from "../server/_core/arkiIdentity/issuer";
import { closeDb } from "../server/_core/arkiIdentity/storage";

async function main() {
  const username = process.argv[2] ?? "arki-e2e";
  const password = process.argv[3] ?? randomBytes(16).toString("hex");

  if (!process.env.ARKI_IDENTITY_ENABLE) {
    console.error("ARKI_IDENTITY_ENABLE not set");
    process.exit(1);
  }

  try {
    const { userId } = await createCredential({ username, password });
    const issued = issueToken({
      userId,
      clientId: "bridge-local",
      scopes: ["git:read", "files:read", "services:read"],
      ttlSeconds: 3600,
    });
    // Salida machine-readable: la primera línea password, la segunda token
    console.log(`PASSWORD=${password}`);
    console.log(`USER_ID=${userId}`);
    console.log(`CLIENT=bridge-local`);
    console.log(`SCOPES=git:read,files:read,services:read`);
    console.log(`TOKEN=${issued.token}`);
    console.log(`EXPIRES_AT=${issued.expiresAt}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("IDENTITY_USERNAME_TAKEN")) {
      console.error(`USER_EXISTS:${username}`);
      process.exit(2);
    }
    console.error(`ERROR:${msg}`);
    process.exit(1);
  } finally {
    closeDb();
  }
}

main();
