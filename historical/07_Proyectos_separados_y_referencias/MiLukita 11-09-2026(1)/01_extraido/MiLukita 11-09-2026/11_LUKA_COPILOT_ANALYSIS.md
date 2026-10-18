# 11 — Análisis de LUKA Copilot

LUKA Copilot es una capa de interpretación/guiado, no una autoridad de verdad ni de publicación. Vive principalmente en superficies de campo/piloto y usa reconocimiento de voz del navegador o integración de transcripción cuando está disponible.

## Estados

`IDLE → LISTENING → PROCESSING_AUDIO → ANALYZING → INTENT_DETECTED → CONFIRMATION_REQUIRED → ACTION_EXECUTED` o `FALLBACK_MANUAL/CANCELLED/ERROR`.

## Intents

Los intents pueden representar observaciones dictadas, acciones de navegación, comandos de TV o solicitudes contextuales. El sistema debe guardar el texto original, interpretación y resultado por separado. Una observación dictada se considera pendiente de verificación humana.

## Permisos y límites

Requiere micrófono del navegador y contexto seguro. No puede verificar una afirmación territorial, cambiar `WorldObject` a `PUBLISHED`, resolver conflictos ni modificar MJP CORE. Puede proponer o guiar; la acción final depende del procedimiento permitido y, cuando corresponda, confirmación humana.

## Auditoría

Deben distinguirse `INTENT_DETECTED` y `ACTION_EXECUTED`. Cancelar no debe persistir una observación parcial como verificada. Fallback manual debe conservar el motivo y actor.

## Estado real

La interfaz de estados, cancelación y fallback está implementada parcialmente. Precisión de reconocimiento, latencia inferior a un umbral y compatibilidad entre navegadores son NO_VERIFICADOS/EXTERNAL_REQUIRED.
