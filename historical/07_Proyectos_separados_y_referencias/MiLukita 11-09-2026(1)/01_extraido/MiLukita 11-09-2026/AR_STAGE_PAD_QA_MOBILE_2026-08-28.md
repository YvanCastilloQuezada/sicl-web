# QA de Lukita AR Stage Pad — 2026-08-28

## Alcance

Se verificó el flujo visual en viewport móvil de 390 × 844 px para `/touch-remote` y `/lukita-ar-stage`. Esta evidencia es una simulación automatizada de layout y no sustituye una prueba en dispositivos físicos.

| Área | Resultado | Evidencia / observación |
|---|---|---|
| Controller Lab móvil | PASS | La interfaz carga en viewport estrecho; el borde, los modos y el onboarding son visibles sin error de renderizado. |
| AR Stage móvil | PASS CONDICIONAMIENTO | La bienvenida y el tutorial cargan; el entorno informa `AR NOT SUPPORTED` en el navegador de sandbox, comportamiento esperado fuera de un dispositivo WebXR compatible. |
| Cuarto modo AR Stage | PASS | El selector muestra `AR Stage` junto a Game Pad, Track Pad y Teclado. |
| Copy de onboarding | CORREGIDO | La prueba detectó el texto obsoleto “tres modos”; se actualizó a “cuatro modos”. |
| Acceso externo de imágenes | PASS | Los dos enlaces CDN se abrieron directamente y mostraron código HTTP/renderizado de imagen sin `AccessDenied`. |
| Cámara, ubicación y orientación física | PENDIENTE HUMANO | Requiere Safari iOS, Chrome Android, permisos reales de cámara/geolocalización, sensores de orientación y pruebas táctiles. |
| Volumen y háptica física | PENDIENTE HUMANO | El sandbox no puede certificar altavoz, vibración ni respuesta háptica de teléfonos concretos. |

## Enlaces visuales verificados

- Horizontal: https://files.manuscdn.com/user_upload_by_module/session_file/310519663620353393/CEGwpThifqJqIRzd.png
- Vertical: https://files.manuscdn.com/user_upload_by_module/session_file/310519663620353393/qXVCooDJABEgbuIy.png

## Criterio de cierre

La QA automatizada de layout y acceso externo queda aprobada. La certificación de cámara, ubicación, orientación, volumen y háptica permanece explícitamente bloqueada hasta contar con dispositivos físicos y aprobación humana. No se habilita publicación remota de escenas ni se modifica MJP CORE.
