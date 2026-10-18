# Recomendación para convertir «Ruleta Perú» en un juego en línea justo

**Base de análisis:** `Ruleta Perú 28-7-2024.xlsm` y la revisión técnica previa del prototipo.  
**Objetivo asumido:** crear una plataforma web en la que la animación sea atractiva, pero donde la venta, el cierre de apuestas, el sorteo, los premios y la auditoría sean controlados por un servidor.

> **Principio central:** la animación nunca debe decidir el resultado. El servidor debe decidirlo, registrarlo y permitir que cualquier persona verifique posteriormente que el resultado coincide con las reglas publicadas.

Esta propuesta distingue dos escenarios. Un **modo demostración o gratuito** permite validar la experiencia sin pagos, datos sensibles ni premios monetarios. Un **modo con dinero real** exige además revisión legal, controles de identidad y edad, gestión de límites, proveedor de pagos, auditoría de seguridad y validaciones regulatorias. En Perú, MINCETUR publica un marco específico para juegos a distancia y mantiene recursos sobre legislación, registros, laboratorios y plataformas; por eso esa revisión debe ocurrir antes de cobrar o pagar premios. [1] [2]

## 1. Mi recomendación directa

Recomiendo **no intentar “subir el Excel a internet”**. Lo utilizaría como documento de referencia y fuente de reglas, pero construiría un sistema web nuevo con el mismo concepto visual. El Excel actual mezcla interfaz, datos, fórmulas, macros, multimedia, archivos locales y vínculos externos; esa mezcla es precisamente lo que dificulta garantizar justicia, disponibilidad y auditoría.

La primera versión debe ser un **piloto web sin dinero real**, con boletos ficticios y un verificador público de sorteos. Cuando el motor de reglas, la aleatoriedad y el registro de auditoría hayan pasado pruebas independientes, se puede integrar el flujo de pagos y operación regulada.

| Alternativa | Qué incluye | Ventajas | Riesgos o límites | Costo relativo | Complejidad |
|---|---|---|---|---:|---:|
| **A. Plataforma web completa** | Web responsive, backend autoritativo, base de datos, panel de operador, pagos, auditoría y verificador público | Es la opción correcta para crecer y para separar el resultado del navegador | Requiere seguridad, cumplimiento, soporte y pruebas externas | Medio/alto y variable | Alta |
| **B. Piloto web gratuito** | Web responsive, cuentas simples o acceso de prueba, rondas ficticias, sin pagos ni premios monetarios | Permite validar reglas, UX y justicia con menor riesgo | No demuestra todavía la operación financiera real | Bajo/medio | Media |
| **C. Mantener Excel como sistema principal** | Compartir el XLSM o conectarlo a una pantalla web | Menor cambio inicial | No resuelve macros, rutas locales, privacidad, concurrencia ni auditoría | Bajo al inicio, alto riesgo posterior | Media, pero frágil |

**Elección técnica recomendada:** empezar por **B** para validar el juego y diseñarlo desde el principio con la arquitectura de **A**. No recomiendo C salvo como archivo histórico o herramienta temporal de migración.

## 2. Arquitectura propuesta

La aplicación debe dividirse en cinco responsabilidades: interfaz, API, motor de reglas, motor de sorteo y auditoría. El navegador solo solicita acciones y muestra estados firmados por el servidor; no puede cambiar el resultado ni calcular por sí mismo cuánto debe pagarse.

![Arquitectura propuesta](https://private-us-east-1.manuscdn.com/sessionFile/SDhRCarZNbVaCyaP6n51p4/sandbox/lXHa3x3sR0Hd8UDpGAyFBz-images_1787561927502_na1fn_L2hvbWUvdWJ1bnR1L3J1bGV0YV9hcmNoaXRlY3R1cmU.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvU0RoUkNhclpOYlZhQ3lhUDZuNTFwNC9zYW5kYm94L2xYSGEzeDNzUjBIZDhVRHBHQXlGQnotaW1hZ2VzXzE3ODc1NjE5Mjc1MDJfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzSjFiR1YwWVY5aGNtTm9hWFJsWTNSMWNtVS5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEYCIQDbFjA-D7PHJP680S9MiPMWxNiv671dsTPCGL9qBrlxWgIhAKXLANc9oqKb5pKIkDXJxT3uysoYUCUWaIpR6Bs8QrLG)

| Componente | Responsabilidad | Regla de seguridad |
|---|---|---|
| Web del jugador | Registro, elección de ronda, selección de números, comprobante y consulta | Nunca contiene secretos ni decide premios. |
| Panel de operador | Abrir/cerrar rondas, ver incidencias, revisar pagos y publicar resultados | Roles separados; acciones sensibles requieren confirmación y registro. |
| API backend | Valida entradas, aplica estados, crea boletos y ejecuta liquidaciones | Todas las operaciones críticas son transaccionales e idempotentes. |
| Base relacional | Usuarios, rondas, reglas, boletos, sorteos, premios, pagos y auditoría | No se permite editar silenciosamente un boleto cerrado. |
| Motor de reglas | Evalúa aciertos y premios con una versión de reglas fija por ronda | La ronda guarda el `ruleset_version` usado. |
| Motor de sorteo | Genera el resultado verificable | No usa `Math.random`, `Rnd` ni lógica de frontend. |
| Registro de auditoría | Conserva compromisos, resultados, cambios y eventos | Append-only, con hash encadenado y respaldo. |
| Verificador público | Reproduce el resultado a partir de datos publicados | Debe funcionar sin cuenta y mostrar el algoritmo exacto. |

Para un primer despliegue, una aplicación web con backend TypeScript, base relacional y almacenamiento de respaldos es suficiente. La animación de la ruleta puede implementarse con Babylon.js o una animación web convencional, pero debe recibir del servidor únicamente el resultado ya decidido. La plataforma de alojamiento debe soportar el backend, tareas de cierre de ronda y, si se necesita tiempo real, una conexión persistente; la base de datos debe ser la fuente de estado, no la memoria del navegador.

## 3. Modelo de datos mínimo

| Entidad | Campos esenciales | Propósito |
|---|---|---|
| `users` | `id`, nombre, celular, estado, rol, fecha de alta | Identidad y permisos. |
| `rounds` | `id`, nombre, apertura, cierre, estado, `ruleset_version`, `rng_version`, `server_seed_hash`, `public_seed` | Define una ronda inmutable desde el cierre. |
| `tickets` | `id`, `round_id`, usuario, números, multiplicador, importe, fecha del servidor, estado | Congela la jugada aceptada. |
| `draws` | `round_id`, resultado, semilla revelada, fuente pública, timestamp, hash del resultado | Registra el sorteo ejecutado. |
| `rulesets` | versión, números permitidos, modalidades, premios, multiplicadores | Evita cambiar reglas a mitad de ronda. |
| `prize_results` | boleto, categoría, premio calculado, estado de pago | Separa cálculo de pago. |
| `payments` | proveedor, referencia, importe, estado, idempotency key, webhook | Reconcilia pagos sin duplicarlos. |
| `audit_events` | actor, acción, entidad, antes/después, timestamp, hash anterior, hash actual | Permite reconstruir la historia. |
| `disputes` | boleto, motivo, evidencia, resolución | Gestiona reclamos sin borrar el histórico. |

El identificador público del boleto debe ser aleatorio y no revelar el celular ni datos personales. El celular puede existir en la base privada, pero los reportes públicos deben mostrarlo enmascarado. No migraría automáticamente todos los teléfonos del Excel al entorno en línea: primero hay que determinar su procedencia, consentimiento, necesidad y retención.

## 4. Cómo haría un sorteo verificablemente justo

### 4.1. Compromiso previo del servidor

Antes de abrir una ronda, el servidor genera una semilla secreta `server_seed` y publica solamente:

```text
server_seed_hash = SHA-256(server_seed)
```

El hash se publica junto con el identificador de ronda, las reglas, el cierre, la versión del algoritmo y la versión del código. La semilla original no puede cambiarse sin que el hash publicado deje de coincidir.

### 4.2. Fuente pública posterior al cierre

Después del cierre de apuestas se obtiene una segunda entrada que no existía cuando se vendieron los boletos. Puede ser una fuente pública de aleatoriedad, un mecanismo de compromiso/revelación de varias partes o una fuente que el auditor independiente apruebe. La fuente debe quedar almacenada con su valor original y timestamp.

Un resultado puede derivarse de:

```text
material = server_seed || public_seed || round_id || ruleset_version
stream   = HMAC-SHA-256(server_seed, material)
```

Luego se extraen enteros mediante **rechazo**, no mediante `byte % 38` o `number % N` sin control. NIST documenta mecanismos de generación de bits aleatorios basados en funciones hash o cifrados por bloques; esa referencia es más apropiada para el diseño que combinar bytes con XOR y reducirlos directamente con módulo. [3]

Pseudocódigo conceptual para una posición uniforme entre `0` y `N-1`:

```text
function unbiasedIndex(stream, N):
    limit = floor(2^32 / N) * N
    counter = 0
    repeat:
        digest = SHA-256(stream || counter)
        x = uint32(digest[0:4])
        counter = counter + 1
    until x < limit
    return x % N
```

Para una ruleta con 38 posiciones se debe decidir primero si las posiciones son realmente `0..37` o `1..38`. El problema actual del Excel mezcla ambos rangos. En la plataforma nueva usaría una sola convención, por ejemplo `0..37`, y convertiría el índice a una casilla mediante una tabla explícita.

### 4.3. No imponer repeticiones ocultas

La regla actual intenta evitar que salgan los últimos diez números. Eso cambia la distribución natural y, además, el código tiene un historial local que no persiste entre giros. Para un juego justo recomiendo **permitir repeticiones**, como en un sorteo independiente, salvo que el producto quiera publicar claramente una regla de “bolsa sin repetición”.

Si se decide no repetir, no debe ocultarse como una optimización. Hay que usar una bolsa aleatoria o permutación verificable, publicar que cada número se retira hasta completar la bolsa y demostrar el estado de esa bolsa en cada ronda.

### 4.4. Verificación pública

Una URL como `/verificar/RND-2026-000123` debe mostrar:

| Dato publicado | Para qué sirve |
|---|---|
| ID de ronda | Evita mezclar resultados. |
| Reglas y premios de la ronda | Demuestra qué versión se aplicó. |
| Hash de semilla previo | Prueba que el servidor no cambió la semilla después de ver las apuestas. |
| Semilla revelada posterior | Permite reproducir el cálculo. |
| Fuente pública posterior al cierre | Añade una entrada que no estaba disponible al vender. |
| Algoritmo y versión | Permite auditar el resultado. |
| Resultado reproducido | Confirma que la salida coincide. |
| Hash del listado de boletos cerrado | Demuestra qué conjunto participó. |

La animación debe mostrar el resultado ya calculado, pero no debe tener la capacidad técnica de escogerlo. También debe existir un endpoint o página que un auditor pueda consultar sin depender de la interfaz gráfica.

## 5. Ciclo de vida de una ronda

```text
DRAFT → OPEN → LOCKED → DRAWN → SETTLED → ARCHIVED
```

En `DRAFT` se preparan reglas y premios. En `OPEN` se aceptan boletos válidos. En `LOCKED` se rechazan nuevas ventas, se calcula y publica el hash del listado cerrado y se inicia el sorteo. En `DRAWN` se publica el resultado y la evidencia. En `SETTLED` se calculan premios y pagos. En `ARCHIVED` se conserva el expediente completo.

Las transiciones deben ejecutarse con transacciones de base de datos. El servidor debe usar UTC internamente y convertir a hora peruana solo para mostrar. Un boleto enviado después del cierre debe ser rechazado por el servidor aunque el navegador lo haya mostrado como disponible. Cada intento de pago y cada creación de boleto debe usar una clave de idempotencia para evitar duplicados por doble clic, recarga o reintento de red.

## 6. Qué conservar y qué rehacer del Excel

| Elemento del Excel | Decisión recomendada |
|---|---|
| Identidad visual, colores y concepto de portada | **Conservar como referencia de diseño**, rediseñando para móvil y escritorio. |
| Modalidades de juego | **Conservar después de documentar y probar** cada regla. |
| Fórmulas de `BaseDeDatos` | **Reescribir como código de backend testeable**; no copiarlas literalmente. |
| `UserFormRuleta` y `UserFormJackpot` | **Rehacer la animación en web**; la animación actual queda como referencia. |
| `UserFormNuevaCartilla` | **Rehacer completamente**, incluyendo persistencia real de la venta. |
| `UserFormResultados` | **Convertir en consulta web con permisos y datos enmascarados**. |
| `Tipos` y `RuleBingo 10x10` | **Convertir a reglas versionadas y modelo económico formal**. |
| `BaseDeDatos` | Importar solo como histórico o datos de prueba validados. |
| Macros, ActiveX, rutas `C:\...` y vínculos externos | **Eliminar del sistema en línea**. |

El archivo actual contiene datos de demostración y fechas de 2024. No los trataría como operaciones vivas. La migración debe guardar cada fila con un origen explícito, por ejemplo `legacy_excel_demo`, y crear un informe de filas importadas, rechazadas y corregidas. El XLSM original debe quedar en modo solo lectura como archivo de referencia, no como fuente que siga modificando el sistema nuevo.

## 7. Mejoras funcionales que implementaría

La primera pantalla debe mostrar la ronda actual, su hora de cierre, el costo, los premios, las reglas resumidas y un enlace “Cómo se verifica”. El jugador debe poder revisar el boleto antes de confirmar, recibir un ID y un comprobante, y consultar el estado sin exponer el celular completo.

El operador debe tener un panel con apertura/cierre de ronda, recaudación, boletos aceptados, incidencias, resultado, premios pendientes y exportación de auditoría. No debe poder editar directamente una celda crítica. Cambiar una regla o premio debe crear una nueva versión y no modificar rondas anteriores.

Añadiría límites de apuesta, límites de pérdida, pausas, autoexclusión, historial de actividad y mensajes claros de riesgo. Estos controles no sustituyen el cumplimiento legal, pero sí reducen errores y abuso operativo. En modo gratuito, reemplazaría pagos y premios por puntos ficticios para probar el flujo sin riesgo financiero.

## 8. Seguridad y operación

La seguridad debe verificarse con una lista formal de requisitos, no solo con una revisión visual. OWASP ASVS ofrece una base para probar controles técnicos de aplicaciones web y servicios, así como una lista de requisitos para desarrollo seguro. [4]

Los controles mínimos serían autenticación robusta para operadores, roles separados, MFA para funciones críticas, cifrado en tránsito y en reposo, secretos solo en servidor, protección contra inyección y XSS, límites de velocidad, validación de webhooks, logs sin datos sensibles, monitoreo, alertas y restauración probada de respaldos.

Para dinero real añadiría una revisión independiente del generador de resultados, pruebas de penetración, revisión del código, simulación de fraude y un expediente por ronda. También separaría la capacidad de **preparar** una ronda de la capacidad de **cerrarla y liquidarla**. Dos personas o dos roles deberían participar en acciones irreversibles de alto impacto.

## 9. Plan de implementación

| Fase | Resultado | Criterio de salida |
|---|---|---|
| 0. Decisión de negocio y legal | Definición de gratuito vs dinero real, territorio, edad, pagos y premios | No se integra dinero real sin validación especializada. |
| 1. Especificación | Documento de reglas, premios, horarios y estados | Todos los casos ambiguos del Excel tienen respuesta escrita. |
| 2. Motor puro | Código de reglas y sorteo sin interfaz | Tests deterministas, casos de borde y reproducción exacta. |
| 3. Backend | Usuarios, rondas, boletos, cierre, sorteo y auditoría | Ningún resultado depende del navegador. |
| 4. Web piloto | Compra ficticia, animación, resultados y verificador público | Un usuario puede completar una ronda sin Excel. |
| 5. Seguridad | ASVS, revisión de permisos, pruebas de abuso y backups | No hay secretos en frontend ni modificaciones silenciosas. |
| 6. Pagos y operación | Integración con proveedor, webhooks, conciliación y reclamos | Pagos idempotentes y expediente por operación. |
| 7. Piloto controlado | Datos ficticios o grupo limitado, sin publicidad masiva | Se mide disponibilidad, errores, tiempos y reclamos. |
| 8. Auditoría de salida | Informe independiente de RNG, reglas y seguridad | Aprobación formal antes de cualquier lanzamiento comercial. |

## 10. Pruebas que exigiría antes del lanzamiento

| Área | Prueba imprescindible |
|---|---|
| Cierre | Un boleto posterior al cierre siempre se rechaza en servidor. |
| Duplicados | Repetir la misma petición nunca crea dos boletos ni dos cargos. |
| Reproducción | Con los datos publicados, el verificador obtiene exactamente el mismo resultado. |
| Semilla | Cambiar cualquier byte de la semilla produce un hash distinto y evidencia una inconsistencia. |
| Reglas | Los casos de 0, 1, 2, 3, 4, 5 y 6 aciertos coinciden con la matriz oficial. |
| Adicionales | Cada combinación de adicional y fija está probada. |
| Premios | El monto total calculado coincide con el ledger de liquidación. |
| Concurrencia | Dos operadores no pueden cerrar la misma ronda dos veces. |
| Seguridad | Un jugador no puede leer boletos, teléfonos o funciones administrativas ajenas. |
| Recuperación | Se puede restaurar la base y verificar el hash de auditoría desde un respaldo. |
| UX | La operación funciona en móvil, escritorio y con conexión intermitente. |

## Veredicto

El proyecto merece continuar, pero como **migración controlada**, no como publicación directa del XLSM. La prioridad debe ser construir primero el motor de reglas y el verificador público; después la venta ficticia; luego el panel de operación; y solo al final los pagos y premios reales.

La mejora más importante no es la animación: es que el sistema pueda contestar, para cada ronda, **qué reglas estaban vigentes, qué boletos quedaron cerrados, cómo se generó el resultado, quién ejecutó cada acción y cómo un tercero puede reproducirlo**. Si esas preguntas tienen respuestas verificables, el juego puede aspirar a ser justo y confiable. Si dependen de un botón, una macro o una hoja oculta de Excel, no.

Para iniciar la construcción concreta necesito confirmar cuatro decisiones: si el primer piloto será gratuito o con dinero real; si se mantendrán las modalidades de Ruleta, Jackpot y Bingo desde el inicio; qué proveedor de pagos se pretende usar; y si la operación será únicamente para Perú o para otros países.

## Referencias

[1]: https://apuestasdeportivas.mincetur.gob.pe/ "MINCETUR — Juegos online y apuestas deportivas"
[2]: https://www.gob.pe/institucion/mincetur/normas-legales/4743535-005-2023-mincetur "MINCETUR — Decreto Supremo N.° 005-2023-MINCETUR"
[3]: https://csrc.nist.gov/pubs/sp/800/90/a/r1/final "NIST SP 800-90A Rev. 1 — Recommendation for Random Number Generation Using Deterministic Random Bit Generators"
[4]: https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard"
[5]: file:///home/ubuntu/ruleta_revision_tecnica.md "Revisión técnica previa del prototipo Ruleta Perú"
