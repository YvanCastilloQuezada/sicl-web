import { isAccessAllowed } from "../client/src/components/ArkiGateway";
import { MODULE_DEFINITIONS } from "../client/src/components/ArkiWorkspaceShell";
import type { ArkiAccess } from "../client/src/components/ArkiGateway";

const roles: ArkiAccess[] = ["visitor", "user", "specialist", "corporate"];
const checks: string[] = [];
for (const role of roles) for (const module of MODULE_DEFINITIONS) {
  const expected = module.allowed.includes(role);
  const actual = isAccessAllowed(role, module.name);
  if (actual !== expected) throw new Error(`Access mismatch: ${role} -> ${module.name}; expected ${expected}, got ${actual}`);
  checks.push(`${role}:${module.name}`);
}
if (checks.length !== 64) throw new Error(`Expected 64 role/module cases, got ${checks.length}`);
if (!isAccessAllowed("visitor", "Inicio") || !isAccessAllowed("visitor", "Biblioteca")) throw new Error("Visitor public access failed");
if (isAccessAllowed("visitor", "Generador") || isAccessAllowed("user", "Costos contractuales") || isAccessAllowed("specialist", "Administración")) throw new Error("Restricted access leaked");
console.log(JSON.stringify({ status: "PASS", roles: roles.length, modules: MODULE_DEFINITIONS.length, cases: checks.length, checks: ["4 roles × 16 modules", "visitor public access", "restricted modules", "corporate matrix"] }, null, 2));
