"use strict";
/**
 * ARKI Defect Detector
 * 
 * Detecta tests que fallan en el proyecto y reporta el error.
 * No genera parches automáticos (eso requiere LLM), pero sugiere
 * un parche basado en el error.
 */

const cp = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Ejecuta los tests y devuelve los que fallan.
 */
function detectFailingTests(rootDir) {
  const testFiles = findTestFiles(rootDir);
  const failing = [];

  for (const testFile of testFiles) {
    const result = runTest(rootDir, testFile);
    if (!result.pass) {
      failing.push({
        test: testFile,
        error: result.error,
        output: result.output
      });
    }
  }

  return failing;
}

/**
 * Encuentra archivos de test en el proyecto.
 */
function findTestFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findTestFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.cjs"))) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Ejecuta un test con vitest.
 */
function runTest(rootDir, testFile) {
  try {
    const result = cp.spawnSync("pnpm", ["vitest", "run", testFile], {
      cwd: rootDir,
      encoding: "utf8",
      timeout: 30000,
      maxBuffer: 1024 * 1024
    });

    if (result.status === 0) {
      return { pass: true };
    }

    return {
      pass: false,
      error: result.stderr || result.stdout,
      output: result.stdout
    };
  } catch (e) {
    return {
      pass: false,
      error: e.message,
      output: ""
    };
  }
}

/**
 * Sugiere un parche basado en el error.
 * (Sin LLM, solo reporta el error).
 */
function suggestPatch(defect) {
  return {
    test: defect.test,
    error: defect.error.slice(0, 500),
    suggestion: "Revisar el test fallido y corregir el código o el test.",
    requiresHumanReview: true
  };
}

module.exports = {
  detectFailingTests,
  findTestFiles,
  runTest,
  suggestPatch
};
