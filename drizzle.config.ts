/**
 * @deprecated drizzle-kit con dialect mysql. No usar en runtime (F1b usa better-sqlite3).
 * Reemplazo: Migraciones manuales en drizzle/sqlite/migrations/
 *
 * NO USAR. NO ELIMINAR todavía. Deuda documentada para eliminar
 * tras la fase de reconciliación sicl-web ↔ sicl-core ↔ arki-acs.
 * Ver: server/_core/arkiIdentity/README.md § Deuda técnica
 */
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
