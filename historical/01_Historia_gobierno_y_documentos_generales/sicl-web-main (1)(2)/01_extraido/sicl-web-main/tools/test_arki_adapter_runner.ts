import { existsSync } from "node:fs";
import { executeOssWorker } from "../server/arkiNativeAdapters";

const python = process.env.ARKI_OSS_PYTHON;
if (!python || !existsSync(python)) throw new Error("ARKI_OSS_PYTHON must point to the isolated worker environment");
const result = await executeOssWorker("ifc", "/home/ubuntu/arki-fixtures/runner-fixture.ifc");
if (result.status !== "EXECUTED") throw new Error(`worker failed: ${result.stderr}`);
console.log(JSON.stringify({ ok: true, status: result.status, operation: result.operation, outputPath: result.outputPath }));
