# 27 — Manual para otra IA

## Antes de editar

Leer `01_MILUKITA_EXECUTIVE_SUMMARY.md`, `04_MILUKITA_MASTER_ARCHITECTURE.md`, `21_MJP_CORE_DEPENDENCY_MAP.md`, `28_MILUKITA_INVARIANTS.md` y `29_MILUKITA_RECOVERY_MATRIX.md`. Después inspeccionar el archivo real que se cambiará y sus tests.

## No confundir

Documentación no es implementación. UI no es función real. Test no es producción. Simulación no es integración. QR no es autorización. VERIFIED no es PUBLISHED. Agente no es automatización. LUKA no es MJP CORE.

## Orden recomendado

1. Confirmar alcance y autoridad.
2. No tocar MJP CORE.
3. Actualizar contrato compartido si el estado cambia.
4. Actualizar schema/migración solo con proceso seguro.
5. Implementar server-side guard primero.
6. Implementar UI con estados loading/error/empty/offline.
7. Añadir tests positivos y negativos.
8. Revisar visual móvil y desktop.
9. Documentar límites y gates externos.
10. Crear checkpoint recuperable.

## Reglas de producto

Mapper captura. The Eye verifica. Human Authority publica. Runtime consume publicados. Copilot guía pero no afirma verdad. QR inicia contexto pero no autoriza. TV/Controller no modifica core. AR muestra datos publicados y respeta permisos.

## Nunca hacer

No inventar reviews, datos, evidencia, autoridad, porcentajes de agentes, compatibilidad universal o estado de producción. No hardcodear secretos. No mezclar Wallet/RNG/Rules con territorial/AR/TV.
