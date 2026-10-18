# MiLukita — Próximas actividades y hoja de ruta operativa

**Proyecto:** MiLukita / MJP CORE  
**Fecha de corte:** 26 de agosto de 2026  
**Documento:** Hoja de ruta posterior a la ampliación de Lukita Script Lab  
**Estado:** Piloto exclusivamente virtual, con créditos sin valor monetario, sin pagos, retiros ni conversión

## 1. Propósito

Este documento consolida las actividades que deben ejecutarse después de la implementación del historial visual, la comparación de versiones, la previsualización de variaciones IA y las categorías administrativas de Lukita Script Lab. Su finalidad es separar con claridad lo que ya está implementado de lo que todavía requiere validación, decisión humana, proveedor externo o certificación independiente.

La prioridad operativa es fortalecer el control editorial sin trasladar autoridad funcional a la IA. El MJP CORE conserva la autoridad sobre rondas, resultados, reglas, RTP, premios virtuales, créditos, auditoría, Event Store y controles de operación. Lukita solo comunica estados confirmados y el asistente IA solo propone textos sujetos a revisión humana.

## 2. Estado actual resumido

| Área | Estado al corte | Evidencia o referencia |
|---|---|---|
| Marca MiLukita y anfitrión Lukita | Implementado | `MILUKITA_BRAND_SYSTEM.md`, `MILUKITA_REBRAND_AUDIT.md` |
| Script Lab administrativo | Implementado | `client/src/components/LukitaScriptsPanel.tsx` |
| Persistencia de versiones | Implementado | `lukita_script_versions`, migraciones 0023 y 0024 |
| Historial y comparación antes/después | Implementado en interfaz | Endpoint `operations.lukitaScriptHistory` y selector visual de versión |
| Categorías y etiquetas | Implementado | Columnas `category` y `tagsJson`, filtros en Script Lab |
| Preview de variaciones IA | Implementado | Preview local, sin guardado ni publicación automática |
| Asistente IA | Implementado con límites | `invokeLLM` server-side, JSON Schema, máximo tres propuestas |
| Tests de la nueva fase | Aprobados | Focalizados: 8/8; suite completa previa: 110/4, debe repetirse tras el último cambio |
| Build y TypeScript | Validados en la fase anterior | `pnpm check` y `pnpm build`; repetir como cierre de esta fase |
| Dinero real, pagos, retiros y conversión | Bloqueados | No forman parte del piloto |
| Concurrencia real en staging | Diferida | Falta `STAGING_DATABASE_URL` aislada |
| Certificación externa de RNG y seguridad | Pendiente | Requiere auditor independiente |

## 3. Actividades inmediatas de cierre técnico

| Prioridad | Actividad | Responsable sugerido | Dependencia | Criterio de aceptación |
|---|---|---|---|---|
| Alta | Ejecutar nuevamente `pnpm check` y `pnpm test --` después de la integración del historial | Ingeniería | Ninguna | TypeScript sin errores; todas las pruebas aplicables aprobadas |
| Alta | Ejecutar `pnpm build` y conservar el reporte de chunks | Ingeniería | Suite aprobada | Entry inicial y páginas diferidas medidos; sin regresiones funcionales |
| Alta | Verificar en una cuenta administrativa que se crean, archivan y consultan versiones | QA + Operador | Sesión con rol admin | Un guardado crea una nueva versión; la anterior queda archivada y comparable |
| Alta | Probar una variación IA, abrir su preview y verificar que no se persiste hasta guardar | QA + Operador | Credenciales/servicio LLM disponible | Preview visible; no cambia DB ni estado del juego antes de aprobación |
| Media | Validar filtros por categoría, trigger, estado y etiquetas con datos administrativos | QA | Al menos dos versiones por trigger | Resultados consistentes y sin exposición a jugadores |
| Media | Confirmar que `tagsJson` queda compatible con TiDB y documentar la migración 0024 corregida | Ingeniería | Base de datos accesible | `SHOW COLUMNS` confirma `varchar(512)` y valores por defecto válidos |

## 4. Próxima fase de producto y gobernanza editorial

La siguiente ampliación recomendable es un flujo de aprobación más explícito. El operador debería poder seleccionar una versión, compararla con su antecesora, previsualizarla en el contexto de Home, TV y Overlay, y aprobarla para uso comunicacional. Esta aprobación no debe publicar reglas ni modificar resultados; únicamente debe establecer qué texto puede presentar la capa de experiencia.

| Actividad | Resultado esperado | Prioridad |
|---|---|---:|
| Historial de auditoría enriquecido | Usuario, hora, motivo, origen, versión anterior y versión nueva consultables | Alta |
| Estado editorial separado | `draft`, `review`, `approved`, `archived`, sin confundirlo con estado de ronda | Alta |
| Comparación de fallback | Antes/después también para fallback, categoría y etiquetas | Media |
| Preview por superficie | Mismo guion simulado en Web, TV, Overlay y pantalla secundaria | Media |
| Exportación de revisión | Informe textual o JSON de la versión aprobada, sin datos sensibles | Baja |

## 5. Rendimiento y experiencia

El code-splitting ya separa las páginas principales y los vendors. La actividad siguiente es medir carga en condiciones representativas, no solamente observar el tamaño de los archivos. Deben compararse carga inicial de Home, carga de `/tv`, carga del Control Room y navegación a una página de juego. El indicador debe separar descarga, ejecución JavaScript, renderizado y llamadas de datos.

| Actividad | Métrica que debe conservarse | Criterio de aceptación |
|---|---|---|
| Medición de Home | Tamaño transferido, tiempo de render y errores de consola | Sin regresión frente al build de referencia |
| Medición de rutas diferidas | Tiempo desde navegación hasta contenido útil | Cada ruta carga solo sus dependencias necesarias |
| Optimización vendor React | Gzip, ejecución y duplicación de dependencias | Reducir costo de entrada sin degradar compatibilidad |
| Asset de hero | Resolución en runtime y peso real | Sin advertencias bloqueantes ni imagen rota |
| Responsive | 390×844, 768×1024, 1024×768 y 1280×720 | Sin desbordamientos ni pérdida de información crítica |

## 6. Seguridad, datos y operación

El asistente IA debe seguir siendo una herramienta de apoyo interno. No se deben enviar a un proveedor LLM datos de usuarios, documentos de identidad, saldos, semillas, resultados no publicados, secretos, identificadores de sesión ni información de auditoría sensible. El prompt debe recibir únicamente el contexto editorial mínimo: disparador, nombre de juego, texto actual y fallback.

La persistencia administrativa debe conservar el historial, pero no debe convertirse en un canal para modificar el motor de juegos. Todo endpoint nuevo debe permanecer bajo `adminProcedure`; los clientes públicos no deben listar ni consultar las versiones internas de Lukita. Las acciones de guardar y restaurar deben continuar registrando eventos operativos con idempotencia.

| Control | Estado | Próxima acción |
|---|---|---|
| Autorización administrativa | Implementada | Añadir prueba explícita de rechazo para jugador |
| Límite de longitud | Implementado | Mantener 280 caracteres por texto |
| Máximo de variaciones | Implementado | Mantener máximo tres propuestas por solicitud |
| Salida estructurada | Implementada | Registrar fallos de parseo sin guardar contenido inválido |
| Aprobación humana | Implementada en UI | Separar posteriormente `draft/review/approved` |
| Datos personales en prompt | No enviados por diseño | Revisar cualquier nueva variable antes de incorporarla |
| Publicación automática | Bloqueada | No activar sin decisión de producto y control de rollback |

## 7. Validación de dispositivos y TV

El proyecto ya cuenta con validación responsive automatizada y revisión visual del navegador. Todavía conviene completar una matriz física antes de una audiencia amplia: Smart TV real, Android TV o Google TV, tablet y celular. La prueba debe cubrir selector en vivo/en línea, salida al portal, QR, reconexión, overlay, lectura del manifest y legibilidad de resultados.

| Dispositivo | Flujos mínimos | Responsable |
|---|---|---|
| Smart TV | Arranque, modo TV, navegación por control remoto, QR, contingencia | QA con equipo físico |
| Android TV/Google TV | Instalación o navegador, foco, reproducción y reconexión | QA con equipo físico |
| Tablet | Orientación vertical/horizontal, touch, PWA y overlay | QA |
| Celular | PWA, instalación, offline, guía táctil y pantalla secundaria | QA |
| PC/laptop | Web, Control Room, exportación PNG y verificación | Ingeniería + QA |

## 8. Datos de staging y concurrencia

La prueba de concurrencia real continúa diferida por decisión del propietario. No debe utilizarse `DATABASE_URL` del piloto. Para reactivar esta actividad se necesita una base MySQL/TiDB aislada y una variable `STAGING_DATABASE_URL` proporcionada mediante el mecanismo seguro de secretos. El runner existente debe verificar la variable, abortar si apunta a la base del piloto y generar un reporte reproducible.

El criterio de aceptación será obtener métricas reales de reservas concurrentes, cierres, claims idempotentes, latencia y errores de base de datos, con limpieza posterior de los datos de prueba. Hasta que exista esa URL, cualquier número de concurrencia debe presentarse como no medido.

## 9. Regulación, certificación y monetización futura

El piloto debe permanecer con créditos virtuales. Antes de cualquier decisión de dinero real se requerirá una revisión legal específica, un diseño de KYC/AML con proveedor aprobado, geolocalización, juego responsable, homologación aplicable, certificación independiente del RNG, seguridad, trazabilidad y validación de cada modalidad. La arquitectura preparada no equivale a autorización para operar.

| Actividad futura | Condición previa | Estado |
|---|---|---|
| Certificación independiente de RNG | Expediente técnico congelado y entorno reproducible | Pendiente |
| Auditoría de matemáticas y RTP | Reglas versionadas, simulaciones y tablas finales | Pendiente |
| Revisión legal peruana | Definición exacta de modalidad y modelo operativo | Pendiente |
| KYC/AML real | Decisión de monetización y proveedor | Bloqueado |
| Pagos y retiros | Licenciamiento, controles y decisión formal | Bloqueado |
| Conversión de créditos | Prohibida durante el piloto | No implementar |
| YouTube Live | Credenciales, decisión del propietario y prueba de canal | Pausado |
| Dominio MiLukita | Compra y configuración por el propietario | Pendiente |

## 10. Cronograma sugerido por fases

| Fase | Horizonte orientativo | Entregable |
|---|---:|---|
| Cierre técnico de Script Lab | 1–2 días hábiles | Suite completa, build, pruebas administrativas y auditoría actualizada |
| Flujo editorial aprobado | 3–5 días hábiles | Estados de revisión, auditoría enriquecida y preview por superficie |
| Rendimiento y assets | 3–5 días hábiles | Medición de carga, optimización vendor y corrección de assets |
| Matriz de dispositivos | 1–2 semanas | Evidencia en equipos reales y lista de incidencias |
| Staging y concurrencia | Depende de URL aislada | Reporte real de carga y claims |
| Certificación y revisión legal | Según terceros | Expediente externo; no es una tarea automática de ingeniería |

Los plazos son orientativos y no representan una promesa de certificación ni de autorización regulatoria. Las actividades que dependen de equipos físicos, credenciales, asesores o proveedores deben programarse después de contar con esos recursos.

## 11. Criterios de no avance

No se debe avanzar hacia dinero real, pagos, retiros, conversión, premios monetarios o automatización regulada mientras el piloto no tenga una decisión formal, revisión legal, proveedor definido, pruebas independientes y controles operativos verificables. Tampoco se debe permitir que un guion generado por IA se interprete como resultado, regla, premio o probabilidad oficial.

La próxima acción técnica más segura es cerrar la validación completa de esta fase y luego implementar, si se aprueba, el flujo editorial `draft → review → approved → archived` con rollback visible. En paralelo, QA puede preparar la matriz física de dispositivos y el propietario puede facilitar la URL de staging aislada cuando decida reactivar la concurrencia.

## 12. Referencias internas

- `MILUKITA_REBRAND_AUDIT.md`
- `MILUKITA_BRAND_SYSTEM.md`
- `MJP_MASTER_IMPLEMENTATION_AUDIT.md`
- `shared/lukitaScripts.ts`
- `server/lukitaScripts.ts`
- `client/src/components/LukitaScriptsPanel.tsx`
- `drizzle/schema.ts`
- `drizzle/0023_wonderful_jackal.sql`
- `drizzle/0024_tired_alex_wilder.sql`
- `todo.md`

## Evidencia visual de la fase Script Lab

La revisión móvil de `/` y `/control-room` confirmó que la navegación pública MiLukita, la guía táctil y el acceso protegido se adaptan a 390×844 sin desbordamiento visible. El Control Room se mantiene protegido por autenticación; por ello, la inspección visual de los módulos internos de historial y Script Lab requiere una sesión administrativa real y no se declara como validación pública.
