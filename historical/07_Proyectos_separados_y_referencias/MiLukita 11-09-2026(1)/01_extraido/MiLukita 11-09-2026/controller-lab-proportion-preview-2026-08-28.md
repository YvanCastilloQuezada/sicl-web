# MiLukita Controller Lab — simulador de proporciones y presets

**Fecha:** 28 de agosto de 2026.  
**Ruta:** `/touch-remote`.

| Capacidad | Implementación |
|---|---|
| Vista previa por proporción | Panel aislado con `iframe` que simula móvil 20:9, móvil 16:9, plegable 4:3, TV 16:9, laptop 16:10 y el viewport actual. No inicia sesión ni fuerza rotación física. |
| Presets por dispositivo | Al guardar, el usuario asocia el perfil a celular, tablet/plegable o TV/laptop/escritorio. Se conserva localmente y puede cargar, editar o eliminar el preset. |
| Latencia gradual | El indicador interpola progresivamente de verde a amarillo y rojo para 40–500 ms, manteniendo etiquetas legibles y alertas solo a partir de conexión variable, alta o respaldo. |

## Validación

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas | PASS — 4 archivos, 17 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 337 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 7,48 s |
| QA visual 1280×720 | PASS; botón de simulación y selección de preset visibles |

La vista previa es una herramienta de composición, no una certificación de hardware. La latencia usa mediciones reales ping/pong cuando hay socket activo; no simula ni afirma rendimiento de producción. MJP CORE permanece fuera de alcance.
