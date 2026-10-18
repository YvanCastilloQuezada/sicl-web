# ARKI UI-2 v1.6 — Paquete verificable

## Alcance ejecutado

Se aplicó la taxonomía canónica v1.6. `Inicio` pasó a `Data`; `Presupuesto` pasó a `PRESUP-5D`; `Costos contractuales` pasó a `GASTOS`; `Expediente` pasó a `EXP-TEC`; `O&M` pasó a `O-M`; `Administración` pasó a `ADM`. La página SILC no se creó: su capacidad quedó absorbida por Modelo BIM, conforme a la decisión del Product Owner.

La matriz verificada es: visitante 2 módulos, usuario 14, especialista 15 y corporativo 16. GASTOS, O-M y ADM son visibles para perfiles no visitantes y quedan desactivados con tooltip cuando su estado es `NOT AVAILABLE` o `FUTURE REFERENCE`.

## Archivos funcionales incluidos

- `client/src/components/ArkiWorkspaceShell.tsx`
- `client/src/components/ArkiNavigator.tsx`
- `client/src/components/ArkiGateway.tsx`
- `client/src/i18n/catalog.ts`
- `scripts/test-access-matrix.ts`
- `scripts/test-i18n-catalog.ts`
- `scripts/test-modules-mount.ts`
- `scripts/test-navigator-layout.ts`

## Evidencia

- `outputs/`: 17 outputs reales, numerados de `01` a `17`.
- `captures/`: 8 capturas visuales, incluyendo Data, PRESUP-5D, EXP-TEC, Navigator, Visitante, Especialista, Corporativo y Gateway.
- `tracked_diff.patch`: diff de los archivos relevantes.
- `manifest.txt`: inventario y hashes.
- `sha256.txt`: hash SHA-256 del ZIP.

## Limitaciones

La autenticación continúa siendo prototipo local. La taxonomía no implementa todavía el dominio completo de GASTOS, O-M o ADM; esos estados se mantienen explícitos mediante `NOT AVAILABLE` y `FUTURE REFERENCE`. UI-3 permanece bloqueada hasta emitir el veredicto de esta entrega.
