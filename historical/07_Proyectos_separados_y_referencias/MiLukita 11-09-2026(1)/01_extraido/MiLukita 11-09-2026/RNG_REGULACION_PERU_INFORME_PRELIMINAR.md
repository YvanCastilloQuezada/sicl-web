# Multi Juegos Perú — Informe preliminar de RNG y regulación peruana

**Fecha de corte:** 26 de agosto de 2026  
**Producto:** Multi Juegos Perú, piloto de entretenimiento con créditos virtuales  
**Estado:** preliminar; para revisión independiente  
**Autor:** Manus AI

> Este informe no es una opinión legal, certificación de RNG, homologación ni autorización de operación. Debe ser revisado por un abogado peruano, un laboratorio de certificación autorizado y un especialista independiente en seguridad criptográfica antes de cualquier operación monetaria.

## 1. Objetivo y alcance

El objetivo es describir el estado técnico observable del generador de resultados y mapear las obligaciones que deberían verificarse si el producto evolucionara desde el piloto virtual hacia juegos a distancia con valor monetario en Perú. El piloto actual no recibe dinero, no procesa retiros, no convierte créditos, no usa Yape y no pretende operar como plataforma autorizada.

El análisis cubre el motor de sorteos en `server/pilot.ts`, la semilla del servidor, el hash público, la derivación del `publicSeed`, el algoritmo de rechazo, la revelación posterior, la liquidación virtual, el claim transaccional y el contrato `MjpTvManifest v1`. No certifica el comportamiento de todos los juegos ni la distribución estadística de cada modalidad.

## 2. Estado técnico del RNG implementado

El proyecto declara `hmac-sha256-rejection-v1` como versión de algoritmo. El resultado se deriva de una semilla secreta del servidor, el identificador público de ronda, el hash del conjunto ordenado de tickets y el contexto de juego. Para obtener índices uniformes, el código lee un entero de 32 bits del digest HMAC y rechaza valores fuera del múltiplo completo del tamaño del espacio; luego aplica módulo sobre el rango permitido. Para muestras sin repetición, el motor deriva contextos sucesivos y evita duplicados.

La ronda publica inicialmente un `serverSeedHash`. Después del cierre, se almacena la semilla revelada, el `publicSeed`, el `ticketSetHash` y el resultado. Un verificador puede recomputar la cadena si dispone de la versión del algoritmo, la semilla revelada, el conjunto de tickets y las reglas exactas.

| Control técnico | Estado preliminar | Comentario |
| --- | --- | --- |
| HMAC-SHA-256 | IMPLEMENTED | Función criptográfica estándar; requiere revisión de implementación y custodia. |
| Compromiso previo | IMPLEMENTED | `serverSeedHash` se registra antes del resultado. |
| Semilla pública | IMPLEMENTED | Se deriva del identificador y del conjunto ordenado de tickets. |
| Rejection sampling | IMPLEMENTED | Evita sesgo de módulo cuando el rango no divide 2³². |
| Reproducción | IMPLEMENTED / NEEDS INDEPENDENT REVIEW | Hay verificación interna; falta reproducción por tercero. |
| Custodia de secreto | NEEDS REVIEW | Deben revisarse secretos, logs, acceso de administradores y backups. |
| Entropía de semilla | NEEDS REVIEW | Se usa `randomBytes`; falta expediente de entorno, versión y auditoría de fuente de entropía. |
| Estadística de distribución | NEEDS TESTING | Requiere muestras por modalidad y batería predefinida. |
| Separación de funciones | PARTIAL | Auditor Agent no es autoritativo; falta operación independiente completa. |
| Certificación de laboratorio | NOT AVAILABLE | No se ha presentado expediente a laboratorio autorizado. |

## 3. Revisión criptográfica recomendada

El revisor independiente debe reconstruir resultados desde una copia inmutable del código y un conjunto de rondas de prueba. Debe confirmar que el hash de semilla publicado no puede modificarse después de abrir la ronda, que la semilla revelada coincide exactamente con el compromiso, que la canonicalización del ticket set es estable y que el `publicSeed` no puede ser controlado de forma oportunista por usuarios, administradores o el orden de llegada.

También debe comprobar la generación de semillas en el sistema operativo y runtime realmente desplegados, la longitud y protección de secretos, el acceso a variables de entorno, la exclusión de secretos de logs, la rotación, los backups, la sincronización temporal, la inmutabilidad de eventos y la respuesta ante fallo o reintento. La revisión debe incluir análisis de control de acceso, cambios de ruleset, reejecución de cierres y capacidad de un operador para modificar resultados.

## 4. Pruebas estadísticas propuestas

Las pruebas no deben ejecutarse con datos de producción ni con dinero real. El laboratorio debe recibir un entorno aislado, versión fijada y un protocolo previamente aprobado. Como mínimo:

| Prueba | Propósito | Evidencia |
| --- | --- | --- |
| Uniformidad por bolsillo/número | Detectar sesgo sistemático en cada rango | Conteos, expectativa, estadístico y umbral predefinido |
| Independencia entre rondas | Buscar correlación entre resultados consecutivos | Semillas, contextos, autocorrelación y p-valores |
| Sin repetición | Verificar que muestras únicas no duplican valores | Casos por juego y reglas |
| Rejection sampling | Confirmar que candidatos rechazados no se convierten por módulo | Traza de contadores y reproducción |
| Reproducción | Obtener exactamente el mismo resultado desde evidencia pública | Script externo y hash de salida |
| Resistencia operacional | Verificar cierre, reintento, timeout y doble worker | Logs, transacciones y rollback |
| Cambios de reglas | Confirmar que cada resultado conserva su ruleset | Snapshot de ruleset y firma de auditoría |
| Pruebas de límites | Rangos mínimos, máximos, cero y muestras grandes | Casos de borde reproducibles |

Ningún p-valor aislado prueba que un sistema sea aleatorio. El protocolo debe fijar tamaño muestral, hipótesis, corrección por múltiples pruebas, criterios de fallo y procedimiento de investigación antes de mirar los resultados.

## 5. Claim y liquidación

El cierre de ronda abre una transacción y reclama la fila con `SELECT id FROM game_rounds WHERE publicId = ? FOR UPDATE` antes de calcular premios y movimientos. Si la ronda ya está `settled`, devuelve la evidencia existente. La prueba dedicada confirma la transacción y la reclamación previa; la suite E2E cubre el canal TV, no la concurrencia de dos workers contra MySQL/TiDB real.

La clasificación correcta es **IMPLEMENTED / NEEDS STAGING**. El siguiente ensayo debe usar dos procesos concurrentes contra una base MySQL/TiDB aislada, una ronda fixture y cleanup garantizado. Debe verificar exactamente un resultado, una liquidación, una fila de auditoría y ningún movimiento duplicado, además de deadlocks, timeouts, reintentos y rollback.

## 6. Marco regulatorio peruano preliminar

El portal oficial de MINCETUR indica que la Ley N.° 31557, modificada por la Ley N.° 31806, y el Reglamento aprobado mediante el Decreto Supremo N.° 005-2023-MINCETUR establecen un tratamiento normativo para juegos a distancia y apuestas deportivas a distancia. El mismo portal identifica a la DGJCMT como autoridad competente en la supervisión y fiscalización administrativa de esta materia [1].

La página oficial de trámite de MINCETUR describe la autorización y registro u homologación de plataformas tecnológicas. Indica que el expediente requiere, entre otros elementos, formulario, identificación de la plataforma, información de proveedores vinculados, certificación técnica emitida por un laboratorio autorizado y constancia de pago; también publica un plazo y una tasa que deben verificarse nuevamente al momento de presentar una solicitud [2].

El Decreto Supremo que aprueba el Reglamento fue publicado el 13 de octubre de 2023 en el Diario Oficial El Peruano [3]. La aplicación exacta a cada modalidad, programa de juego, plataforma, proveedor y flujo comercial debe ser determinada por asesoría local con el texto vigente y los criterios administrativos aplicables.

## 7. Brechas regulatorias para una futura operación real

| Tema | Estado MJP | Entregable requerido antes de monetizar |
| --- | --- | --- |
| Titular y autorización | OFF | Estructura societaria, solicitud y autorización aplicable |
| Plataforma tecnológica | Piloto web | Expediente técnico y homologación según procedimiento vigente |
| Programas/modalidades | Rulesets virtuales | Clasificación, documentación y aprobación aplicable |
| Laboratorio | No contratado | Certificación de laboratorio autorizado por MINCETUR |
| RNG | Implementado internamente | Auditoría/certificación independiente y evidencia reproducible |
| KYC/AML | Preparación simulada | Programa operativo, proveedor, controles y registros |
| Juego responsable | Límites simulados | Autoexclusión, límites, alertas, prevención de menores y atención |
| Geolocalización | Simulada | Control efectivo, privacidad, precisión, excepciones y auditoría |
| Pagos | OFF | Adquirente, conciliación, fraude, chargebacks y seguridad |
| Datos personales | Preparación | Base legal, consentimiento, minimización, retención y derechos |
| Fiscalidad | Modelo preliminar | Memo de contador/abogado y declaraciones aplicables |
| Reclamos | No operativo | Procedimiento, SLA, registro y escalamiento |

## 8. Referencias técnicas internacionales

NIST SP 800-90A Rev. 1 describe mecanismos para generar bits aleatorios mediante métodos deterministas basados en funciones hash o cifrados de bloque [4]. Es una referencia de ingeniería criptográfica, no una certificación de un juego ni una autorización peruana.

GLI publica especificaciones técnicas para pruebas de RNG y requisitos de presentación de dispositivos de juego [5]. Deben tratarse como referencia de evaluación y no como sustituto de la norma, procedimiento o laboratorio que MINCETUR reconozca para el producto concreto.

ISO/IEC 17025 establece requisitos generales de competencia, imparcialidad y operación consistente de laboratorios de ensayo y calibración [6]. La acreditación de un laboratorio no convierte por sí misma al sistema MJP en producto certificado.

## 9. Plan de revisión independiente

La revisión debe comenzar congelando un commit, dependencias, configuración de despliegue, esquema de base de datos y rulesets. Después se debe entregar al revisor un paquete con código, documentación, protocolo de generación, vectores de prueba, rondas reproducibles, logs inmutables y matriz de accesos. El tercero debe emitir hallazgos separados para RNG, seguridad, reglas, RTP, liquidación, disponibilidad, protección de datos y regulación.

Los hallazgos deben clasificarse como crítico, alto, medio o bajo y vincularse a una prueba de cierre. La aceptación no debe depender de una captura de pantalla: requiere evidencia reproducible, responsable, fecha, versión, ambiente y firma o aprobación del revisor.

## 10. Conclusión preliminar

MJP cuenta con una base técnica razonable para un piloto virtual verificable: compromiso de semilla, HMAC-SHA-256, rejection sampling, resultado reproducible, auditoría y claim transaccional con bloqueo de fila. Esto no equivale a certificación de RNG ni a autorización para operar juegos a distancia con dinero real.

La recomendación es mantener el piloto en créditos virtuales y no reutilizar su ledger como ledger monetario. Antes de considerar pagos o conversión, deben completarse la certificación independiente, las pruebas de concurrencia en staging, la homologación y autorización aplicables, el programa KYC/AML, juego responsable, geolocalización, protección de datos, conciliación financiera y revisión tributaria.

## Referencias

[1]: https://apuestasdeportivas.mincetur.gob.pe/ — MINCETUR, “Juegos online y apuestas deportivas”.

[2]: https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia — MINCETUR, “Autorización y registro (homologación) ... de plataformas tecnológicas”.

[3]: https://busquedas.elperuano.pe/dispositivo/SE/2224342-1 — Diario Oficial El Peruano, Decreto Supremo que aprueba el Reglamento de la Ley N.° 31557.

[4]: https://csrc.nist.gov/pubs/sp/800/90/a/r1/final — NIST, SP 800-90A Rev. 1.

[5]: https://gaminglabs.com/getting-started/technical-specifications-for-rng-testing/ — Gaming Laboratories International, “Technical Specifications for RNG Testing”.

[6]: https://www.iso.org/standard/66912.html — ISO, ISO/IEC 17025:2017.
