import { execFile } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface EnergySimulationInput {
  location: {
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
    timezone: number;
  };
  runPeriod: {
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
  };
}

export interface EnergyKPIs {
  totalHeatingEnergy_kWh: number | null;
  totalCoolingEnergy_kWh: number | null;
  totalEnergyIntensity_kWh_m2: number | null;
  simulationSuccessful: boolean;
  kpiStatus: "not_instrumented";
  configurationWarnings: string[];
  errorMessage?: string;
  eplusErrLog?: string;
  outputCsvPath?: string;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
}

function executeEnergyPlus(
  binary: string,
  args: string[],
  timeout: number,
): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    execFile(
      binary,
      args,
      {
        timeout,
        maxBuffer: 10 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error) {
          const enrichedError = error as Error & {
            stdout?: string;
            stderr?: string;
          };

          enrichedError.stdout = String(stdout || "");
          enrichedError.stderr = String(stderr || "");
          reject(enrichedError);
          return;
        }

        resolve({
          stdout: String(stdout || ""),
          stderr: String(stderr || ""),
        });
      },
    );
  });
}

function readErrorLog(errPath: string): string {
  if (!fs.existsSync(errPath)) return "";

  return fs.readFileSync(errPath, "utf-8");
}

function validateCsv(csvPath: string): void {
  if (!fs.existsSync(csvPath)) {
    throw new Error("EnergyPlus no generó eplusout.csv");
  }

  const content = fs.readFileSync(csvPath, "utf-8").trim();

  if (!content) {
    throw new Error("eplusout.csv está vacío");
  }

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error(
      "eplusout.csv no contiene filas de resultados",
    );
  }

  if (!lines[0].includes(",")) {
    throw new Error("Encabezado CSV inválido");
  }
}

export async function runEnergySimulation(
  input: EnergySimulationInput,
): Promise<EnergyKPIs> {
  const configurationWarnings = [
    "La ubicación recibida no se aplica al Site:Location del IDF.",
    "El período recibido no modifica el RunPeriod del IDF.",
    "El modelo actual no tiene instrumentación de medidores energéticos.",
    "Los KPI energéticos no pueden calcularse con las variables actuales.",
  ];

  let workDir = "";

  try {
    if (
      !input ||
      !input.location ||
      !input.runPeriod
    ) {
      throw new Error("Entrada de simulación incompleta");
    }

    const epwSource = path.join(
      __dirname,
      "weather",
      "lima_pe.epw",
    );

    const idfSource = path.join(
      __dirname,
      "templates",
      "lima_1zone.idf",
    );

    if (!fs.existsSync(epwSource)) {
      throw new Error(`EPW no encontrado: ${epwSource}`);
    }

    if (!fs.existsSync(idfSource)) {
      throw new Error(`IDF no encontrado: ${idfSource}`);
    }

    workDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "arki-energy-v31-"),
    );

    const epwPath = path.join(workDir, "in.epw");
    const idfPath = path.join(workDir, "in.idf");

    fs.copyFileSync(epwSource, epwPath);
    fs.copyFileSync(idfSource, idfPath);

    const epBin =
      process.env.ENERGYPLUS_BIN || "energyplus";

    const args = [
      "-r",
      "-w",
      epwPath,
      "-d",
      workDir,
      idfPath,
    ];

    console.log("ARKI EnergyPlus V31:", epBin, args);

    await executeEnergyPlus(epBin, args, 120000);

    const csvPath = path.join(workDir, "eplusout.csv");
    const errPath = path.join(workDir, "eplusout.err");

    const errLog = readErrorLog(errPath);

    if (/\*\*\s*(Severe|Fatal)\s*\*\*/i.test(errLog)) {
      throw new Error(
        "EnergyPlus terminó con errores Severe o Fatal",
      );
    }

    validateCsv(csvPath);

    return {
      totalHeatingEnergy_kWh: null,
      totalCoolingEnergy_kWh: null,
      totalEnergyIntensity_kWh_m2: null,
      simulationSuccessful: true,
      kpiStatus: "not_instrumented",
      configurationWarnings,
      eplusErrLog: errLog,
      outputCsvPath: csvPath,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const errPath = workDir
      ? path.join(workDir, "eplusout.err")
      : "";

    const errLog = errPath
      ? readErrorLog(errPath)
      : "";

    console.error("ARKI EnergyPlus V31:", message);

    return {
      totalHeatingEnergy_kWh: null,
      totalCoolingEnergy_kWh: null,
      totalEnergyIntensity_kWh_m2: null,
      simulationSuccessful: false,
      kpiStatus: "not_instrumented",
      configurationWarnings,
      errorMessage: message,
      eplusErrLog: errLog,
    };
  }
}
