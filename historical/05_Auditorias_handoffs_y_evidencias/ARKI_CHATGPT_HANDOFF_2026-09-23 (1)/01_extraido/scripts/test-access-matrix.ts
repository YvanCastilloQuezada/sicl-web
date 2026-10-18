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
if (!isAccessAllowed("visitor", "Data") || !isAccessAllowed("visitor", "Biblioteca")) throw new Error("Visitor public access failed");
if (isAccessAllowed("visitor", "Generador") || isAccessAllowed("visitor", "GASTOS")) throw new Error("Visitor restriction leaked");
const expectedVisible: Record<ArkiAccess, number> = { visitor: 2, user: 14, specialist: 15, corporate: 16 };
for (const role of roles) { const count = MODULE_DEFINITIONS.filter(({ name }) => isAccessAllowed(role, name)).length; if (count !== expectedVisible[role]) throw new Error(`Visibility mismatch for ${role}: expected ${expectedVisible[role]}, got ${count}`); }
const renamed = ["Data", "PRESUP-5D", "GASTOS", "EXP-TEC", "O-M", "ADM"];
for (const name of renamed) if (!MODULE_DEFINITIONS.some((module) => module.name === name)) throw new Error(`Missing canonical module ${name}`);
console.log(JSON.stringify({ status: "PASS", roles: roles.length, modules: MODULE_DEFINITIONS.length, cases: checks.length, visibleByRole: expectedVisible, renamed, checks: ["4 roles × 16 modules", "visitor public access", "2/14/15/16 visibility", "canonical renames"] }, null, 2));
