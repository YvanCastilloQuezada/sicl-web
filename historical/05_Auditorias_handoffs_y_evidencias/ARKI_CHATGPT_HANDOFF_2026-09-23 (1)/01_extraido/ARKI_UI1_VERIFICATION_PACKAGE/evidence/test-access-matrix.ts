import { isAccessAllowed } from "../client/src/components/ArkiGateway";
import { MODULE_DEFINITIONS } from "../client/src/components/ArkiWorkspaceShell";

const assertions: Array<[string, boolean]> = [
  ["visitor sees Inicio", isAccessAllowed("visitor", "Inicio")],
  ["visitor sees Biblioteca", isAccessAllowed("visitor", "Biblioteca")],
  ["visitor does not see Generador", !isAccessAllowed("visitor", "Generador")],
  ["user sees Generador", isAccessAllowed("user", "Generador")],
  ["user does not see Costos contractuales", !isAccessAllowed("user", "Costos contractuales")],
  ["specialist does not see Administración", !isAccessAllowed("specialist", "Administración")],
  ["corporate sees every declared module", MODULE_DEFINITIONS.every(({ name }) => isAccessAllowed("corporate", name))],
];
for (const [name, passed] of assertions) if (!passed) throw new Error(`FAIL: ${name}`);
console.log(JSON.stringify({ status: "PASS", assertions: assertions.length, checks: assertions.map(([name]) => name) }, null, 2));
