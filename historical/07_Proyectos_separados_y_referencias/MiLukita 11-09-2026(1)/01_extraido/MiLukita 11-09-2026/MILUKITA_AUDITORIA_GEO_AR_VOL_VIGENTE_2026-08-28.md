# Auditoría profunda vigente de MiLukita
## Geolocalización de escenas, cuarto AR Stage, volumen y estado constitucional

**Fecha de auditoría:** 28 de agosto de 2026  
**Proyecto:** `ruleta-peru-online`  
**Alcance:** Controller Lab, AR Stage Pad, consola de escenas geolocalizadas, flujo de captura social, Agent Registry, MJP CORE y documentación constitucional.  
**Versión base revisada:** checkpoint `588ecdd9` y cambios posteriores de esta iteración.  
**Resultado de validación:** TypeScript PASS; 112 archivos de prueba aprobados y 1 omitido; 396 tests aprobados y 4 omitidos; build PASS.

> **Conclusión ejecutiva.** MiLukita dispone ahora de un cuarto control AR Stage integrado en Controller Lab, una consola local de preparación de escenas geolocalizadas y un flujo de captura social con revisión previa. Estas capacidades son de presentación y preparación: no gobiernan el juego, no escriben en MJP CORE y no publican escenas automáticamente. La geolocalización productiva, la persistencia remota, el QA físico y la aprobación de contenido continúan siendo gates externos o humanos.

## 1. Decisión constitucional

La arquitectura vigente mantiene cuatro capas separadas:

| Capa | Responsabilidad | Estado auditado |
|---|---|---|
| MJP CORE | Verdad del juego, resultados, RNG, reglas, wallet, ledger y settlement | Protegida; no modificada |
| Experience OS | Orquestación de experiencias, transiciones y contexto | Implementada de forma parcial/simulada según superficie |
| Character OS | Identidad, estados y presentación de Lukita/Kiko | Contratos y fallback visual implementados |
| Presentation OS | TV, celular, Controller Lab, AR y captura | Implementado para prototipo y revisión |

El cuarto control no introduce una autoridad nueva. En la sesión realtime utiliza el transporte compatible `TRACKPAD`, mientras su identidad local es `AR_STAGE`. Esta decisión evita migraciones destructivas del esquema de sesiones y mantiene el límite `presentation-only`.

## 2. Cuarto control AR Stage

### 2.1 Funcionalidad implementada

El cuarto modo se integra en `client/src/pages/TouchRemotePage.tsx` y comparte el patrón visual de los otros controles: maqueta 16 × 8 cm, borde perimétrico verde/turquesa neón, barra superior de acciones y superficie principal trackpad-first.

La superficie AR admite arrastre, pellizco, escala, rotación multitáctil, puntos de contacto, Lukita Star Trail, sensibilidad, háptica, volumen e iluminación. La orientación se adapta automáticamente a la orientación física disponible y conserva un fallback por viewport cuando el navegador no expone el sensor.

La barra superior contempla las acciones de AR, foto, video, compartir, cambio de cámara, privacidad y restablecimiento. La captura se mantiene detrás de una revisión previa; el usuario puede reproducir, descargar, descartar o compartir explícitamente. No hay publicación automática en redes sociales.

### 2.2 Control de volumen

El cuarto control usa el patrón de volumen existente del ecosistema: nivel persistente, mute, indicador visual, color coordinable y respuesta de interacción. El volumen afecta la presentación local y no es una ruta hacia resultados, wallet, reglas o estado de juego.

### 2.3 Estado de la imagen de Lukita

La imagen de referencia de Lukita se usa como placeholder visual interactivo mientras el GLB definitivo no está aprobado. La referencia no se trata como autoridad de identidad ni como sustituto del Character Foundation. El contrato canónico continúa distinguiendo:

- referencia visual;
- Character Foundation aprobado;
- asset GLB candidato;
- asset GLB definitivo;
- escena AR publicada.

## 3. Activación por ubicación y captura social

### 3.1 Flujo actual

1. El cuarto control entra en estado de preparación.
2. Si la ubicación AR no está activa, muestra guía de superficie y mantiene la captura bloqueada.
3. El usuario activa la ubicación AR y concede el permiso de cámara cuando corresponde.
4. Lukita aparece como presencia visual para foto, video o interacción.
5. El usuario puede cambiar entre cámara frontal y trasera.
6. Foto o video pasan por revisión previa.
7. Compartir requiere una acción explícita del usuario y usa el menú del dispositivo.

### 3.2 Límites

La implementación no prueba que todos los navegadores soporten WebXR, MediaRecorder o codificación MP4. WebM continúa siendo el fallback principal cuando el navegador no ofrece MP4. La ubicación del prototipo es un contexto de activación/colocación; no constituye un sistema de geofencing productivo ni una base de datos de lugares públicos.

## 4. Consola de escenas geolocalizadas

### 4.1 Ubicación de la superficie

La consola se integra en el Control Room mediante `client/src/components/LukitaGeoPlacementPanel.tsx` y se conecta desde `client/src/pages/ControlRoom.tsx`. No se creó una segunda navegación administrativa.

### 4.2 Parámetros configurables

| Parámetro | Función | Restricción actual |
|---|---|---|
| Punto en mapa | Elegir latitud/longitud | Requiere ubicación válida |
| Ubicación del celular | Centrar en la posición autorizada | Depende del permiso del navegador |
| Tipo de presencia | Lukita, Kiko o compañero de TV | Catálogo local cerrado |
| Altura | Altura visual en metros | Validada entre 0.2 y 8 m |
| Escala | Escala relativa del modelo | Validada entre 0.1 y 4 |
| Orientación | Rotación de la presencia | Validada entre -180° y 180° |
| Iluminación | Entorno, neutra o estudio | Configuración local |
| Interacción | Solo presencia, foto o video | No publica automáticamente |
| Privacidad | Privado, no listado o público en revisión | Nunca activa publicación por sí sola |

### 4.3 Persistencia y revisión

Las escenas se almacenan localmente en el navegador bajo la clave `milukita-geo-scenes-v1`. Cada guardado genera una versión y conserva el historial limitado a 20 entradas. El usuario puede restaurar una versión anterior y solicitar revisión humana. El estado visible es `LOCAL_DRAFT` o `HUMAN_REVIEW_REQUIRED`; no existe estado de publicación aprobada dentro de esta superficie.

Esto es una mejora de preparación, no una afirmación de persistencia productiva. Para producción se necesitarían identidad, autorización, base de datos, audit log append-only, control de conflictos, retención, exportación y revisión de privacidad.

## 5. Contratos y evidencias

| Archivo | Evidencia |
|---|---|
| `client/src/pages/TouchRemotePage.tsx` | Cuarto modo AR Stage, barra de acciones, transporte compatible, captura y revisión |
| `client/src/components/LukitaGeoPlacementPanel.tsx` | Mapa, selección de ubicación, parámetros de escena, borradores versionados y solicitud de revisión |
| `shared/lukitaGeoPlacement.ts` | Validación de ubicación, dimensiones, privacidad y bloqueo de publicación |
| `shared/touchRemoteContract.test.ts` | Regresión de AR Stage, ubicación, cámara y bloqueo de captura |
| `shared/lukitaLiveCaptureContract.ts` | Consentimiento, revisión previa y compartir explícito |
| `shared/lukitaCharacterFoundation.ts` | Identidad y límites de Character Foundation |
| `shared/lukitaLiveBoundaries.ts` | Separación Experience QR, Control QR, Controller Lab y Lukita |
| `docs/LUKITA_AR_STAGE_PROPOSAL.md` | Propuesta canónica, captura, orientación, geolocalización y límites |
| `docs/MILUKITA_CONTROLLER_LAB_MANUAL.md` | Instrucciones de los cuatro controles |
| `docs/MILUKITA_CHARACTER_BIBLE.md` | Identidad consolidada y estado de aprobación |
| `docs/MILUKITA_AGENT_AUTONOMOUS_ADVANCEMENT_PLAN.md` | Gates de madurez y trabajo autónomo seguro |

## 6. Auditoría de seguridad y autoridad

### 6.1 Invariantes conservadas

- El Controller Lab es backstage y no es una consola de gobierno del juego.
- AR Stage solo controla presentación, posición visual, escala, orientación y captura.
- La consola geográfica no activa escenas en producción.
- El flujo de compartir requiere intervención explícita del usuario.
- Las escenas públicas quedan en intención de revisión, no en publicación efectiva.
- Legal & Compliance sigue `PLANNED / NOT_STARTED / DISABLED / ADVISORY_ONLY / AUTONOMY 0`.
- Distribution conserva readiness y publicación bloqueada mientras no existan proveedores y gates aprobados.
- Los agentes solo observan, alertan o proponen; no escriben en MJP CORE.

### 6.2 Riesgos residuales

| Riesgo | Estado | Mitigación actual | Gate pendiente |
|---|---|---|---|
| Permiso de ubicación denegado | Controlado | Selección manual en mapa y mensaje explicativo | QA en dispositivos reales |
| Coordenadas sensibles | Parcial | Solo almacenamiento local en prototipo | Política de privacidad y retención |
| Captura sin consentimiento | Controlado | Captura bloqueada antes de activación y revisión previa | Prueba legal/UX externa |
| MP4 no disponible | Controlado | Fallback WebM transparente | Encoder o pipeline aprobado |
| Publicación accidental | Controlado | `HUMAN_REVIEW_REQUIRED` y sin mutación remota | Workflow de aprobación productivo |
| GLB incorrecto | Parcial | Placeholder y asset candidato separado | Aprobación del GLB definitivo |
| Falsa sensación de producción | Controlado | Badges de borrador, simulado y bloqueado | Auditoría periódica de copy |
| Dependencia de mapa externo | Parcial | Componente reutilizable con configuración del proyecto | Proveedor, claves y SLA aprobados |

## 7. Validación ejecutada

La validación final de esta iteración produjo:

```text
TypeScript: PASS
Test Files: 112 passed | 1 skipped (113)
Tests:      396 passed | 4 skipped (400)
Build:      PASS
```

El build mantiene una advertencia no bloqueante sobre chunks grandes del visor 3D. No se interpretó como fallo funcional. La validación automatizada no sustituye la prueba física en Safari iOS, Android Chrome, Android/Google TV, Samsung Tizen o LG webOS.

## 8. Qué puede declararse implementado

| Capacidad | Clasificación | Motivo |
|---|---|---|
| Cuarto control AR Stage en Controller Lab | IMPLEMENTADO | Ruta, modo, gestos y controles presentes |
| Superficie trackpad continua | IMPLEMENTADO | Interacción táctil y fallback definidos |
| Giro automático | IMPLEMENTADO EN PROTOTIPO | Reutiliza orientación/viewport; requiere QA físico |
| Volumen AR | IMPLEMENTADO | Comparte patrón de volumen del ecosistema |
| Foto/video con revisión | IMPLEMENTADO EN PROTOTIPO | Flujo local y consentimiento explícito |
| Compartir social | IMPLEMENTADO COMO ACCIÓN EXPLÍCITA | Usa menú del dispositivo, sin publicación automática |
| Mapa y configuración de escenas | IMPLEMENTADO LOCALMENTE | Preview y borradores, no persistencia remota |
| Historial versionado | IMPLEMENTADO LOCALMENTE | Máximo 20 entradas por navegador |
| Publicación geolocalizada productiva | NO IMPLEMENTADO | Requiere backend, permisos y revisión |
| Geofencing productivo | NO IMPLEMENTADO | No se debe inferir desde el mapa prototipo |
| QA físico multidispositivo | NO VALIDADO | Requiere dispositivos y sesiones reales |

## 9. Recomendación de cierre

La prioridad ya no debe ser añadir más controles. El siguiente ciclo debe congelar el diseño del cuarto device, aprobar el Character Foundation y el GLB definitivo, y ejecutar una prueba de extremo a extremo en dispositivos reales. La consola geográfica debe evolucionar solo después de decidir quién puede crear, revisar, aprobar, retirar y auditar una escena, y durante cuánto tiempo se conservan las coordenadas.

**Declaración:** esta auditoría describe el estado verificable del prototipo y sus contratos. No constituye certificación legal, certificación de seguridad, aprobación de contenido ni autorización de despliegue productivo.

## 10. Corrección del acceso externo y gobierno de escenas

El enlace anterior podía devolver `AccessDenied` porque apuntaba a una ruta privada de almacenamiento del entorno WebDev. La entrega corregida debe usar un recurso público de descarga o el checkpoint revisable, nunca una ruta `/manus-storage/` privada presentada como URL pública.

Se añadió `shared/lukitaGeoGovernance.ts` con retención máxima de 30 días, precisión de coordenadas aproximada por defecto, separación de funciones entre operador y revisor, y estados `LOCAL_DRAFT`, `HUMAN_REVIEW_REQUIRED`, `APPROVED_FOR_PILOT` y `REJECTED`. El contrato mantiene `publishable: false` y `coreWrite: false` de manera incondicional. El workflow implementado permite solicitar revisión, pero no convierte una solicitud en aprobación ni en publicación.

La QA automatizada cubre determinísticamente creación, expiración, separación de funciones y denegación de publicación/escritura en MJP CORE. La QA física continúa pendiente porque requiere cámaras, sensores, permisos y navegadores reales.
