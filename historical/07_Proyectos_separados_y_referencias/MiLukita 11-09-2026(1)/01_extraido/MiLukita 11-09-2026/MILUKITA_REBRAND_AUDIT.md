# MiLukita — Auditoría de rebranding e inventario técnico

**Fecha de corte:** 26 de agosto de 2026  
**Fuente:** Orden maestra adjunta y checkpoint `66820fde`  
**Estado de dinero real:** bloqueado  
**Estado de YouTube:** bloqueado  
**Estado de dominio/marca:** no verificado jurídicamente

## Resumen

La transformación propuesta es viable como evolución incremental. La arquitectura actual ya contiene Experience OS, Event Engine, `MjpTvManifest v1`, TV/overlay, QR, Second Screen, Scheduler, Control Room, contenido determinista, contingencia y piloto de créditos virtuales. El rebranding debe modificar la identidad comercial y la presentación, pero no los identificadores técnicos, las reglas, el RNG, los premios, el RTP, la liquidación ni los registros históricos.

## Inventario de superficies encontradas

La búsqueda inicial detectó **124 coincidencias en 31 archivos** para `MJP`, `Multi Juegos Perú`, `Multi Juegos` y `Ruleta Perú`. El inventario se concentra en las siguientes superficies:

| Superficie | Ejemplos encontrados | Tratamiento |
| --- | --- | --- |
| Metadata HTML | título, description, manifest, icono | Actualizar a MiLukita; conservar aviso de piloto |
| Home y navegación | encabezado, subtítulos, enlaces | Actualizar marca visible; conservar rutas |
| TV/overlay | textos de canal, manifest, broadcasts | Usar MiLukita TV y MiLukita Eventos |
| QR y comprobantes | prefijos e identificadores | No cambiar IDs históricos ni prefijos técnicos |
| Backend | `MJP_TV_MANIFEST_VERSION`, `MJP_EXTRA_39`, agregados `MJP` | Mantener por compatibilidad técnica |
| Experience OS | documentos y títulos internos | Mantener nombres técnicos; añadir alias comercial |
| Operaciones/Control Room | paneles y eventos | Presentar MiLukita; conservar auditoría y roles |
| Tests/fixtures | nombres de juegos, broadcasts y rounds | No romper fixtures; añadir pruebas de alias |
| Documentación | auditorías, fichas y guías | Actualizar progresivamente con trazabilidad |
| Assets | `pwa-icon.svg`, hero y referencias `/manus-storage` | Revisar visualmente; no generar ni comprar activos externos |
| Build generado | `dist/` contiene copias compiladas | No editar manualmente; regenerar tras cambios |

## Identidad visual actual

La interfaz actual utiliza una identidad oscura y premium asociada a Ruleta Perú Online/Multi Juegos Perú. El HTML usa `Ruleta Perú Online · Piloto gratuito`, la descripción menciona juegos virtuales verificables y el encabezado visual de la home contiene referencias a Multi Juegos Perú. La marca técnica se encuentra más distribuida que la marca visual: varios nombres como `MJP_TV_MANIFEST_VERSION`, `MJP_EXTRA_39`, `MJP_CORE` y prefijos de rondas deben conservarse.

## Clasificación de nombres

| Clase | Ejemplos | ¿Renombrar? |
| --- | --- | --- |
| Marca comercial visible | Multi Juegos Perú, Ruleta Perú Online | Sí, de forma gradual |
| Marca nueva | MiLukita, MiLukita TV, MiLukita Juegos, MiLukita Eventos | Añadir y priorizar |
| Personaje | Lukita | Añadir como anfitrión, no como nombre de módulo |
| Contrato técnico | `MjpTvManifest`, `MJP_TV_MANIFEST_VERSION`, `MJP_CORE` | No |
| Identificador histórico | `RP-MJP-*`, rounds, tickets, rulesets | No |
| Reglas y matemáticas | titles de juego, RTP, premios, RNG | No modificar en esta iteración |
| Dominio objetivo | `MiLukita.com` | Documentar; disponibilidad no confirmada |

## Dependencias y riesgos

El rebranding afecta copias visibles en React, HTML, metadata, documentación y posibles fixtures. Un reemplazo global sería inseguro porque podría romper contratos compartidos, IDs históricos, auditoría y consultas. Se debe usar una capa de identidad comercial (`brandSystem`) y conservar aliases técnicos.

El dominio `MiLukita.com`, el registro de marca y la disponibilidad jurídica no se consideran confirmados. No se deben comprar dominios, registrar marcas ni contratar servicios externos dentro de esta orden.

## Estado inicial de validación

El checkpoint anterior registró 100 pruebas aprobadas y 4 omitidas, `pnpm check` aprobado, `pnpm build` aprobado y un piloto exclusivamente virtual. La suite de concurrencia de staging está diferida por decisión del propietario.

## Plan de migración

Primero se crea el contrato de marca y los aliases. Después se actualizan metadata, home, navegación y textos de TV/overlay. Luego se añade el contexto comercial al manifest sin alterar su autoridad. Finalmente se regeneran build, pruebas, screenshots y documentación. Los nombres técnicos se conservan hasta que exista una migración formal y reversible, que no forma parte de esta fase.

## Estados de la auditoría

| Estado | Aplicación |
| --- | --- |
| `IMPLEMENTED` | Implementado y comprobado |
| `PARTIAL` | Existe parcialmente o solo en determinadas superficies |
| `SIMULATED` | Funciona como demostración aislada |
| `BLOCKED` | Depende de credenciales, proveedor o configuración externa |
| `REQUIRES_REVIEW` | Necesita revisión humana, legal o de diseño |
| `NOT_IMPLEMENTED` | No existe implementación funcional |

## Decisiones reservadas al propietario

La comprobación de disponibilidad del dominio, el registro de marca, la identidad legal, la activación de YouTube, la monetización, pagos, KYC/AML real y Avatar 3D productivo quedan fuera de esta implementación y requieren decisión o acción externa.

## Corte de implementación MiLukita — 26 de agosto de 2026

Se implementó una primera ola reversible de identidad:

| Superficie | Resultado |
| --- | --- |
| Header global | MiLukita + Lukita · Anfitrión digital |
| Ribbon del piloto | MiLukita mantiene créditos virtuales y ausencia de dinero real |
| Home | MiLukita Eventos y Lukita integrados en la narrativa |
| TV start screen | MiLukita TV y autoridad del servidor explícitas |
| Manifest status | MiLukita TV visible; `MJP CORE` conservado como alias técnico |
| Overlay export | Marca de agua MiLukita por defecto; archivo exportado con prefijo `milukita-event` |
| PWA | `name` y `short_name` actualizados a MiLukita |
| Control Room | MiLukita Control Room · Experience OS |
| Traducciones base | Título, tagline y texto responsable actualizados en español/inglés |
| Contrato compartido | `shared/brandSystem.ts` y pruebas unitarias aisladas |

**Validación del corte:** `pnpm vitest run shared/brandSystem.test.ts` aprobó 3 pruebas; `pnpm check` aprobado; `pnpm build` aprobado. El build conserva una advertencia preexistente de asset `/manus-storage/ruleta-peru-hero_7732dc7d.png` resuelto en runtime y la advertencia de bundle grande ya documentada.

No se renombraron rutas, contratos, IDs, rulesets, RNG, RTP, premios, créditos virtuales, resultados históricos ni tablas de base de datos. No se configuró dominio, registro de marca, YouTube, pagos, KYC/AML real, dinero real ni avatar 3D.

## Evidencia visual del corte

Se revisaron `/` y `/tv` en viewport escritorio 1280×720 y móvil 390×844. La home muestra MiLukita, MiLukita Eventos y el anfitrión Lukita; el selector TV muestra MiLukita TV, las opciones «Ver transmisión en vivo» y «Ver en línea», el aviso de créditos virtuales y la salida al portal. En móvil, la identidad y el selector se mantienen legibles y las tarjetas se apilan sin recorte crítico visible. La guía táctil y la invitación PWA aparecen como overlays existentes del piloto y no son parte del rebranding.

## Constancia adjunta revisada

El PDF adjunto identifica una **solicitud de registro de marca de servicio denominativa «MiLukita»** ante INDECOPI, en la clase 38, asociada a servicios de telecomunicaciones. Para proteger la privacidad, esta auditoría no reproduce número de documento, domicilio, teléfono, correo, comprobante de pago ni otros datos del solicitante.

El documento revisado es una constancia/formulario de solicitud de dos páginas; no se interpreta como una resolución final de concesión ni como certificado de registro. En consecuencia, el producto puede usar MiLukita como identidad proporcionada por el propietario, pero la documentación pública debe describir el estado legal como **solicitud presentada / registro pendiente de confirmación**, salvo que el propietario entregue posteriormente la resolución o certificado correspondiente.

## Ampliación implementada: Control Room y Lukita Script Lab

Se añadió `BrandPreviewPanel` en `/control-room` con seis superficies seleccionables: Header, Home, TV, Overlay, PWA y Manifest. La vista muestra MiLukita, Lukita, MiLukita TV, la condición de piloto virtual y los aliases técnicos MJP sin alterar el contrato autoritativo.

Se añadió `LukitaScriptsPanel`, protegido por el acceso existente de operador de Control Room. Permite seleccionar seis disparadores, editar el texto y fallback, renderizar `{game}`, activar/desactivar el texto personalizado, probar la salida y restaurar la plantilla. La persistencia es local al navegador del operador; no publica guiones ni crea una vía automática de decisión. `shared/lukitaScripts.ts` conserva `canChangeOfficialState: false`.

Se incorporaron microinteracciones de marca para logo, avatar, tabs y superficies, con transiciones de 180–240 ms y reglas `prefers-reduced-motion`. También se corrigió una clave React duplicada en los beneficios de Home detectada durante la inspección.

Validación del corte: `pnpm check` aprobado; pruebas focalizadas de marca, manifest y guiones: 6 aprobadas; suite completa: 106 aprobadas y 4 omitidas; `pnpm build` aprobado. Se mantiene la advertencia de bundle grande existente y el entorno público de Control Room continúa protegido por autenticación/rol de operador.

## Evidencia visual de la ampliación

La captura de `/` confirma que la experiencia pública mantiene MiLukita, la guía táctil y el aviso de instalación sin romper la carga inicial. La captura de `/control-room` confirma que el centro operativo conserva sus semáforos, límites de autoridad, estado de ronda y enlace TV. El preview y Script Lab están ubicados más abajo en la misma ruta y quedan accesibles dentro del panel protegido; la carga diferida de rutas se verifica en el build mediante chunks separados.

## Nueva fase: IA, persistencia administrativa y rendimiento

Se migró Lukita Script Lab desde `localStorage` hacia `lukita_script_versions`, tabla versionada con trigger, locale, texto, fallback, estado, origen, versión, actor y timestamps. La migración `drizzle/0023_wonderful_jackal.sql` fue revisada y aplicada sin operaciones destructivas.

Se añadieron procedimientos administrativos tRPC para listar, guardar, restaurar y generar variaciones. La generación usa `invokeLLM` exclusivamente server-side, descubre el catálogo disponible, solicita JSON Schema estricto y limita la salida a tres propuestas de 280 caracteres. Cada propuesta muestra que requiere aprobación humana y conserva `canChangeOfficialState: false`; la IA no publica ni decide estados, resultados, RTP, premios o créditos.

El bundle inicial se optimizó con carga diferida de rutas y chunks de vendor. El build produjo `index-DuoGsPoV.js` de 243,72 kB (67,34 kB gzip), con páginas pesadas separadas; el riesgo restante es el bundle de React vendor de 385,11 kB sin gzip y una advertencia no bloqueante de asset `/manus-storage/...` resuelto en runtime.

Validación final de esta fase: `pnpm check` aprobado; pruebas focalizadas 7/7 aprobadas; build frontend y servidor aprobados. La suite anterior de 108 pruebas aprobadas y 4 omitidas fue ampliada con dos pruebas del guard IA; se debe conservar el conteo de la ejecución completa más reciente en el cierre de entrega.

## Cierre de ampliación del Script Lab

El panel administrativo ahora permite recorrer versiones, seleccionar una edición y comparar el texto anterior con el posterior. Las propuestas de IA se pueden previsualizar en el contexto de un juego antes de aplicarlas al borrador; la preview no persiste ni publica cambios. Los guiones guardados incorporan categoría y hasta ocho etiquetas, con filtros por trigger, categoría, estado y límite.

Se creó `MJP_PROXIMAS_ACTIVIDADES.md` como documento único de continuidad. Incluye cierre técnico, gobernanza editorial, rendimiento, pruebas en hardware, staging, certificación independiente, dominio y límites de monetización. La base continúa siendo exclusivamente virtual y la IA sigue subordinada a revisión humana y al MJP CORE.


## Cierre de avatar conceptual Lukita Show

El propietario aprobó la Propuesta A — Lukita Show. Se congelan como anchors visuales una anfitriona adulta de apariencia trigueña cálida, sonrisa reconocible, cabello largo oscuro, vestido azul profundo con acentos dorados/blancos, micrófono moderno e insignia “L” discreta.

El documento 32 fue incorporado como regla arquitectónica: Lukita es una anfitriona visual no autoritativa y solo comunica información derivada del backend/MjpTvManifest. No genera números, selecciona ganadores, calcula premios, modifica rondas, liquida jugadas, cambia wallets ni sustituye Auditor/Verify.

La propuesta principal fue convertida a JPG y BMP, verificada a 1632×2176 px y subida a Manus Storage. Los assets pesados se retiraron del repositorio para evitar bloquear checkpoints; `LukitaAvatar` referencia las rutas de almacenamiento de Show, TV, Web, Celebration y Contingencia. El modelo 3D definitivo, turnaround aprobado, rigging, voz y animación permanecen pendientes de una fase posterior.
