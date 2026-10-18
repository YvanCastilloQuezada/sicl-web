# ARKI — Auditoría actual para DeepSeek

**Fecha:** 23 de septiembre de 2026  
**Repositorio auditado:** proyecto ARKI · `generador-familias`  
**Último checkpoint:** `c62183a5`

## Veredicto preliminar

**Estado técnico:** VERIFIED para la compilación, regresión de dominio y estructura UI auditada. La evidencia completa se encuentra en `ARKI_DEEPSEEK_CURRENT_AUDIT.zip`.

**Alcance actual:** el último cambio fue exclusivamente de frontend y prueba asociada. Se eliminó el panel flotante gris/Navigator y se sustituyó por un Info Box fijo espejo del panel derecho. La pantalla queda organizada como Info Box izquierdo, canvas central e Info Box derecho.

## Hallazgos solicitados

| Área | Resultado |
|---|---|
| Git log y estado | Estado limpio en la auditoría; últimos cambios registrados en checkpoints ARKI |
| Repositorio | El proyecto auditado corresponde al workspace ARKI `generador-familias`; el remoto está configurado en el repositorio de artefactos del proyecto |
| Dominio `shared/` | Los módulos paramétricos, constructivos, costos, recálculo, exportaciones y expediente existen |
| Código Luka | No se detectaron archivos específicos `luka*`, `arkiVision*`, `arkiAR*`, `arkiVoice*`, `arkiOCR*` ni carpetas `vision/`, `ar/`, `voice/` o `camera/` |
| UI | Existen `ArkiWorkspaceShell`, `ArkiGateway`, `ArkiNavigator`, módulos Generator/BIM/Dossier/Metrics e i18n de 8 idiomas |
| EXP-TEC | `DossierModule` monta con `activeModule === "EXP-TEC"` |
| Layout | Test PASS: `240px / fluid / 260px`, responsive en 1050 y 720 px |
| Paneles | El componente izquierdo usa el mismo contrato visual y contenido del Info Box derecho; no usa la clase del Navigator flotante |
| Tests | Check, build, dominio, serialización, costos, recálculo, acceso, i18n, montaje y limpieza PASS |

## Evidencia

El paquete contiene:

- Estado Git, log, remoto, listado de `shared/` y `client/src/`.
- Código completo de los módulos de dominio solicitados cuando existen.
- Código actual de `ArkiWorkspaceShell`, `ArkiNavigator`, `ArkiGateway`, `App`, estilos, i18n y `GeneratorModule`.
- Output completo de los 17 comandos solicitados.
- Manifest y SHA-256.
- Captura del shell actual con los dos Info Box y el canvas central.

## Limitaciones verificadas

No se encontró implementación específica de Luka para visión, OCR, realidad aumentada, voz o cámara. Por tanto, esas capacidades permanecen **NO AVAILABLE / no implementadas en este repositorio** y no deben declararse como existentes.

La captura móvil específica del workspace no se declara como evidencia de implementación funcional si no existe una captura verificable del estado correspondiente. El test estructural sí confirma los breakpoints de 1050 px y 720 px.

## Regla de interpretación

La existencia de un módulo y el paso de un test estructural no equivalen a un flujo E2E completo. Las capacidades de dominio se consideran verificadas por sus tests actuales; las capacidades de Luka se consideran pendientes por ausencia de código y tests específicos.

## Entregable

`ARKI_DEEPSEEK_CURRENT_AUDIT.zip` contiene el paquete reproducible de revisión.
