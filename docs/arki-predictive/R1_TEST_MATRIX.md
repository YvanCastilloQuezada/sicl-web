# R1 · Matriz de pruebas

| Área | Evidencia | Resultado |
|---|---|---|
| TypeScript | `pnpm check` | PASS |
| S1/S2 | 24 pruebas existentes | PASS |
| R1 | selección, identidad, retorno, UI | PASS |
| Regresión | 96 archivos / 434 pruebas | PASS |
| Build | `pnpm build` | PASS; warnings de chunks grandes no bloqueantes |
| Browser | ruta R1 sin bypass | BLOQUEADO por fallback de autenticación/arranque |
