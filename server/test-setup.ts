// server/test-setup.ts
// Setup de tests para vitest. Define variables de entorno aisladas.
// NO afecta a producción ni a .env.local.
// Aislado: usa la base de datos arki_test (no arki_web).

// --- MO22: JWT / appId ---
process.env.VITE_APP_ID = "MO22_TEST_APP_ID";
process.env.JWT_SECRET = "mo22-test-jwt-secret-for-vitest-only-32chars-min";

// --- MO22: MariaDB (contenedor arki-web-mariadb, puerto host 3307, DB arki_test) ---
process.env.DATABASE_URL = "mysql://arki_web:YjIPFV8y0K_ccBLcwnfirB7cowH64MepDrNfRDpzn-7zOspe@127.0.0.1:3307/arki_test";

// --- MO22: storage local para tests ---
process.env.ARKI_STORAGE_ROOT = "/tmp/arki-mo22-test-storage";

// --- SICL Core (para tests que lo necesiten) ---
process.env.SICL_CORE_URL = "http://127.0.0.1:8000";
process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";

// --- Crear el directorio de storage si no existe ---
import { mkdirSync } from "node:fs";
try {
  mkdirSync(process.env.ARKI_STORAGE_ROOT, { recursive: true });
  mkdirSync(`${process.env.ARKI_STORAGE_ROOT}/objects`, { recursive: true });
} catch {
  // ya existe
}
