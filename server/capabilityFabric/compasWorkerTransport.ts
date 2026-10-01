import { spawn } from "node:child_process";
import path from "node:path";
import type { CapabilityRequest } from "./types";
import type { CompasTransport } from "./compasAdapter";

export interface CompasWorkerOptions {
  pythonExecutable?: string;
  workerPath?: string;
  timeoutMs?: number;
}

export function createCompasWorkerTransport(
  options: CompasWorkerOptions = {},
): CompasTransport {
  const python = options.pythonExecutable ?? process.env.ARKI_PYTHON_EXECUTABLE ?? "python3";
  const workerPath = options.workerPath ?? path.resolve(process.cwd(), "tools/arki_compas_worker.py");
  const timeoutMs = options.timeoutMs ?? 10_000;

  return {
    invoke<TInput, TOutput>(
      capability: string,
      operation: CapabilityRequest<TInput>["operation"],
      input: TInput,
    ) {
      return new Promise((resolve, reject) => {
        const child = spawn(python, [workerPath], { stdio: ["pipe", "pipe", "pipe"] });
        let stdout = "";
        let stderr = "";
        let settled = false;

        const finish = (error?: Error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (error) reject(error);
        };

        const timer = setTimeout(() => {
          child.kill("SIGKILL");
          finish(new Error("COMPAS_RUNTIME_TIMEOUT"));
        }, timeoutMs);

        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");
        child.stdout.on("data", chunk => { stdout += chunk; });
        child.stderr.on("data", chunk => { stderr += chunk; });
        child.on("error", error => finish(new Error(`COMPAS_RUNTIME_SPAWN_FAILED:${error.message}`)));
        child.on("close", code => {
          if (settled) return;
          clearTimeout(timer);
          settled = true;
          const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
          if (!line) {
            reject(new Error(`COMPAS_RUNTIME_NO_RESPONSE:${code}:${stderr.trim()}`));
            return;
          }
          let payload: any;
          try { payload = JSON.parse(line); }
          catch { reject(new Error("COMPAS_RUNTIME_INVALID_RESPONSE")); return; }
          if (!payload.ok) {
            reject(new Error(String(payload.code ?? "COMPAS_RUNTIME_FAILED")));
            return;
          }
          resolve({
            output: payload.output as TOutput,
            evidenceStatus: "OBSERVED",
            diagnostics: Object.freeze([...(payload.diagnostics ?? [])]),
            runtime: Object.freeze({
              observed: payload.runtime?.observed === true,
              name: String(payload.runtime?.name ?? "compas"),
              version: payload.runtime?.version == null ? null : String(payload.runtime.version),
            }),
          });
        });

        child.stdin.end(JSON.stringify({ capability, operation, input }) + "\n");
      });
    },
  };
}
