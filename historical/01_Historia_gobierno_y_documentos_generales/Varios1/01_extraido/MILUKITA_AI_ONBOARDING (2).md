# MILUKITA AI ONBOARDING

## Primer principio

MiLukita es un ecosistema territorial y de experiencias. LUKA es una identidad/agente de asistencia y presentación; Mapper captura; The Eye revisa; Human Authority decide; World Engine versiona y publica; Runtime consume publicación. MJP CORE es protegido, de solo lectura y está fuera de la autoridad territorial.

## Orden de lectura obligatoria

Primero leer `00_KNOWLEDGE_TRANSFER_CONTRACT.md`, `01_MILUKITA_EXECUTIVE_SUMMARY.md`, `02_MILUKITA_DEFINITION.md`, `04_MILUKITA_MASTER_ARCHITECTURE.md`, `08_MILUKITA_DATA_MODEL.md`, `19_SECURITY_RBAC_ANALYSIS.md`, `21_MJP_CORE_DEPENDENCY_MAP.md`, `28_MILUKITA_INVARIANTS.md`, `23_CONTRADICTIONS_REPORT.md` y `KNOWLEDGE_TRANSFER_GAP_REPORT.md`. Después consultar el anexo del módulo que se quiera cambiar y sus tests.

## Respuestas mínimas que la IA debe poder dar

| Pregunta | Respuesta documentada |
|---|---|
| ¿Qué es MiLukita? | Ecosistema que conecta identidad LUKA, territorio, experiencias, captura y runtime bajo gobernanza humana. |
| ¿Qué puede hacer? | Capturar y revisar conocimiento territorial, preparar experiencias AR/QR y ofrecer superficies de control documentadas. |
| ¿Qué no puede hacer? | No puede convertir captura en verdad, publicar sin Human Authority ni tocar MJP CORE. |
| ¿Qué datos maneja? | WorldObjects, WorldPoints, Claims, Sources, Evidence, sesiones, observaciones, publicaciones, conflictos, auditoría y referencias de almacenamiento. |
| ¿Qué estado está probado? | El estado del contrato, no la producción: consultar `24_IMPLEMENTATION_STATUS.md`. |
| ¿Qué requiere hardware? | GPS, cámara, micrófono, WebXR, TV, Cast/DLNA, offline físico y escaneo QR real. |

## Procedimiento antes de editar

La IA debe localizar la fuente canónica, comprobar si existe una ruta backend protegida, identificar el rol autorizado, buscar tests, consultar contradicciones y actualizar documentación. Debe separar cambios visuales de cambios de autoridad. No debe iniciar con una reescritura, una migración destructiva, una dependencia nueva o un cambio de MJP CORE.

## Pruebas obligatorias

Una modificación territorial requiere TypeScript, tests relevantes, build, prueba negativa de aislamiento, revisión visual si afecta UI y actualización del documento de estado. Una modificación de datos requiere migración explícita, backup/rollback y decisión humana. Una modificación de AR, TV o QR requiere prueba de dispositivo y clasificación de cualquier simulación.

## Preguntas que deben bloquear la ejecución

La IA debe detenerse y pedir al propietario aclaración si hay conflicto entre una maqueta y un contrato, si se solicita publicar sin URL/SSL demostrados, si se pretende usar un QR como autorización, si falta la autoridad del actor, si se requiere acceder a un secreto, o si una instrucción afecta RNG, wallet, ledger, settlement, reglas o manifest de MJP CORE.

## Handover final

La IA que termine una sesión debe dejar archivos modificados, motivo, tests, limitaciones, estado de producción, decisiones pendientes, evidencia y riesgos. Debe actualizar la matriz CSV y no declarar READY sin evidencia objetiva.

## Reglas inmutables

Mapper captura. The Eye verifica. Human Authority publica. Runtime consume publicados. Copilot guía pero no afirma verdad. QR inicia contexto pero no autoriza. TV/Controller no modifica core. AR muestra datos publicados y respeta permisos. No se deben inventar reviews, datos, evidencia, autoridad, porcentajes, compatibilidad universal ni estado de producción. No se deben hardcodear secretos ni mezclar Wallet/RNG/Rules con territorial, AR o TV.
