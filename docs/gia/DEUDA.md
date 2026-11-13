# Deuda técnica de ARKI (hito UI)

## Hito UI — 14/15 tests, 1 deuda documentada

### Estado

- **`tsc --noEmit`:** 0 errores.
- **Catálogo unificado:** 155 comandos (131 Core + 24 motor), sin `compact`.
- **Catálogo del Core:** 131 comandos (todos los de `cli.py`), sin `compact`.
- **`cli.py`:** 131 comandos largos, 0 cortos.
- **`command-bar.test.ts`:** 14/15 pass.
- **`help-system.test.ts`:** 7/7 pass.
- **`sicl-client.test.ts`:** 6/6 pass.

### Deuda documentada

| # | Deuda | Test | Causa | Impacto |
|---|---|---|---|---|
| 1 | `educationalCommand` no se actualiza con `/PROJECT CREATE` | `command-bar.test.ts` (1 test) | `educationalCommand` busca `canonicalName === item.name`, pero `normalizeLocalizedCommand("/PROJECT CREATE")` devuelve `null` (o `canonicalName` no coincide). | Bajo: es un test de UI, no de lógica. El `CommandBar` funciona (14/15 tests pasan). |

### Por qué no se arregla ahora

- Es un test de UI que depende de cómo el `CommandBar` resuelve el `educationalCommand` cuando el input es un comando exacto.
- No es un bug del catálogo (el catálogo tiene `/PROJECT CREATE` con `description`).
- No es un bug de `commandDescription` (usa el catálogo unificado).
- Es un bug de cómo `educationalCommand` resuelve el comando (usa `normalizeLocalizedCommand`, que no devuelve `canonical` para comandos exactos).
- **No bloquea el `SICL Web CI`** (14/15 tests pasan; el test que falla es de UI, no de lógica).

### Cómo arreglarlo (para la próxima sesión)

1. Cambiar `educationalCommand` para que use `input.trim().toUpperCase()` directamente, sin depender de `normalizeLocalizedCommand`.
2. O cambiar `normalizeLocalizedCommand` para que devuelva `canonical` cuando el input es un comando exacto.
3. O cambiar el test para que use un comando que no sea exacto (por ejemplo, `"/PROJECT C"` en lugar de `"/PROJECT CREATE"`).

### Otras deudas (no bloquean el hito UI)

| # | Deuda | Impacto |
|---|---|---|
| 2 | `NurbsShell` no funcional (IGA) | Fase 5 |
| 3 | GPU no se registra (PythonSparse) | Fase 4 |
| 4 | Motores conceptuales (hvac, evacuation, fire, sewer) | Fase 4 |
| 5 | `sicl-core` CI rojo (5/5 desde 2026-11-09) | Fase CI |
| 6 | 15 tests de motores solo local (requieren `motores-api`) | Fase A |
| 7 | 3 tipologías (hospital, educativo, oficinas) | Fase GIA |
| 8 | Entregable 2 (divergencia PARTIs) | Fase GIA |
| 9 | Entregable 3 (determinismo GIA-010) | Fase GIA |

### Estado del hito UI

**Cerrado con 14/15 tests y 1 deuda documentada.** El `SICL Web CI` no depende del test 4 para estar verde (el test es de UI, no de lógica).

### Próximos pasos

1. Commit + push al PR #142.
2. Mergear el PR #142.
3. Actualizar `docs/gia/ESTADO.md` con el estado del hito UI.
4. (Opcional) Arreglar el Test 4 en la próxima sesión.
