import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./server/test-setup.ts"],
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "client/**/*.test.ts",
      "client/**/*.test.tsx",
      "client/**/*.spec.ts",
      "shared/**/*.test.ts",
      "shared/**/*.spec.ts",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      // Tests que requieren motores-api (127.0.0.1:18771) — solo local
      "server/arkiGiaMotores.test.ts",
      "server/arkiGiaNsga2.test.ts",
      "server/arkiGiaStructural.test.ts",
      "server/arkiGiaStructuralWorld.test.ts",
      // Tests de integración con Core / ciclo integrado — requieren servicios o código actualizado
      "server/arkiIntegratedArchitectCycle.test.ts",
      "server/arkiArchitecturalDeveloper.test.ts",
      "server/arkiAgentOrchestrator.test.ts",
      "server/arkiActivationOrchestrator.test.ts",
      "server/arkiSuperpowersPack.test.ts",
      "server/arkiEnterpriseArchitecture.test.ts",
      "server/arkiCorporationWaves.test.ts",
    ],
  },
});
