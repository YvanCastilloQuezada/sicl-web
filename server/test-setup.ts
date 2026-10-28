// server/test-setup.ts
// Setup de tests para vitest. Define variables de entorno aisladas.
// NO afecta a producción ni a .env.local.
// Aislado: usa la base de datos arki_test (no arki_web).
//
// NOTA 1: NO definir SICL_CORE_URL ni SICL_CORE_SERVICE_TOKEN aquí.
// El test coreHttpClient.test.ts necesita que estén vacíos por defecto.
//
// NOTA 2: ARKI_STORAGE_ROOT NO puede estar en /tmp ni /var/tmp.
// createFileBackend (arkiFileBackend.mjs) rechaza esos paths por seguridad:
//   if (base.startsWith('/tmp/') || base.startsWith('/var/tmp/')) throw Error('Unsafe root');
// Usamos ~/.arki-test-storage (privado, fuera de /tmp).
//
// NOTA 3: el directorio debe tener permisos 0o700.
// createFileBackend rechaza directorios con permisos group/other:
//   if ((s.mode & 0o022) !== 0) throw Error('Unsafe storage directory');

import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// --- MO22: JWT / appId ---
process.env.VITE_APP_ID = "MO22_TEST_APP_ID";
process.env.JWT_SECRET = "mo22-test-jwt-secret-for-vitest-only-32chars-min";

// --- MO22: MariaDB (contenedor arki-web-mariadb, puerto host 3307, DB arki_test) ---
process.env.DATABASE_URL = "mysql://arki_web:YjIPFV8y0K_ccBLcwnfirB7cowH64MepDrNfRDpzn-7zOspe@127.0.0.1:3307/arki_test";

// --- MO22: storage local para tests (fuera de /tmp, permisos 0o700) ---
const testStorageRoot = join(homedir(), ".arki-test-storage");
process.env.ARKI_STORAGE_ROOT = testStorageRoot;

// --- MO22: variables que enabled() requiere (arkiMo22Bridge.ts:15) ---
// IDENTITY_MODE="manus" activa la rama JWT de enabled() y de authenticated().
process.env.ARKI_STORAGE_MODE = "local";
process.env.ARKI_MO22_ENABLE = "1";
process.env.ARKI_DEV_OPEN = "0";
process.env.ARKI_IDENTITY_MODE = "manus";
process.env.NODE_ENV = "test";

// --- Crear el directorio de storage con permisos 0o700 ---
try {
  mkdirSync(testStorageRoot, { recursive: true, mode: 0o700 });
  mkdirSync(join(testStorageRoot, "objects"), { recursive: true, mode: 0o700 });
} catch {
  // ya existe
}
