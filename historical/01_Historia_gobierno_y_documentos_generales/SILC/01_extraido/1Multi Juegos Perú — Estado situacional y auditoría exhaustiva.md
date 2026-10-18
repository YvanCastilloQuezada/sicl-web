# Multi Juegos Perú — Estado situacional y auditoría exhaustiva

**Proyecto:** `ruleta-peru-online`  
**Producto:** Multi Juegos Perú (MJP)  
**Fecha de corte:** 26 de agosto de 2026  
**Autor:** Manus AI  
**Checkpoint de referencia:** `7ecabd40`  
**Estado operativo:** piloto gratuito, exclusivamente virtual  

> Este documento consolida el estado técnico, funcional, matemático, operativo y regulatorio del piloto. No constituye certificación independiente, opinión tributaria, asesoría legal ni autorización para operar con dinero real.

## 1. Dictamen ejecutivo

MJP es un piloto web full-stack de entretenimiento con créditos virtuales. El backend y la base de datos conservan la autoridad sobre rondas, resultados, reglas, premios virtuales, auditoría y movimientos de wallet. La interfaz web/PWA, el canal TV, el overlay para OBS y la pantalla secundaria consumen proyecciones públicas; no deben decidir resultados.

La versión auditada incluye motor de rondas, sorteo verificable mediante HMAC-SHA-256, reglas versionadas, billetera virtual, simulador, RTP, Bingo, Loterías, Ruletas Simplificadas, Trío 13, MultiMarket virtual, PWA, TV/QR/OBS, Auditor Agent, Event Store, Game Registry, Scheduler de propuesta, Autopilot acotado, Watchdog conceptual, Kill Switch administrativo, métricas no-PII y preparación regulatoria. Los pagos, retiros, conversión de créditos, Yape, KYC real, AML real y operación monetaria permanecen desactivados.

La cobertura automatizada más reciente separa **91 pruebas aprobadas en la suite Vitest** y **6 pruebas E2E aprobadas** mediante `pnpm test:e2e`. También se ejecutaron `pnpm check` y `pnpm build` con resultado satisfactorio. La validación interactiva adicional en Smart TV, Android TV, tablet y celular fue confirmada por el propietario; para una auditoría externa formal deben conservarse los modelos, versiones, resoluciones, capturas y logs de cada dispositivo.

## 2. Estados de auditoría

| Estado | Interpretación aplicada |
| --- | --- |
| **PASS** | Funciona y existe evidencia dentro del alcance probado. |
| **IMPLEMENTED / NEEDS STAGING** | Está implementado, pero falta validación bajo infraestructura representativa. |
| **SIMULATED** | Opera con datos aislados o demostrativos y no afecta la operación oficial. |
| **LOCAL ONLY** | Funciona principalmente en navegador o almacenamiento local. |
| **BLOCKED** | Depende de credenciales, proveedor, decisión o autorización externa. |
| **NOT IMPLEMENTED** | No existe funcionalidad operativa. |
| **NEEDS HUMAN DECISION** | Requiere aprobación formal del propietario, legal, seguridad o dirección. |

## 3. Inventario técnico

| Elemento | Situación |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind 4, PWA |
| Backend | Express, tRPC 11, TypeScript |
| Persistencia | Drizzle ORM sobre MySQL/TiDB |
| Identidad | Manus OAuth y roles |
| Integridad | HMAC-SHA-256, semillas, hashes, reglas versionadas e idempotencia |
| Tiempo real | Polling de 5–10 segundos y BroadcastChannel local; no hay WebSocket/SSE productivo |
| Pruebas | Vitest, integración, API E2E y Chromium E2E |
| Estado de referencia | Checkpoint `7ecabd40` |

El build mantiene dos advertencias no bloqueantes conocidas: un recurso `/manus-storage/...` que se resuelve en runtime y un bundle frontend principal superior a 500 kB. Conviene optimizarlos antes de una publicación amplia.

## 4. Arquitectura y fuente de verdad

```text
MJP CORE
├── Round Engine       -> rondas persistidas y estados
├── Draw Engine        -> semilla, hash, resultado verificable
├── Rule Engine        -> rulesets versionados y premios
├── Credit Engine      -> créditos virtuales e idempotencia
├── Audit/Verify       -> eventos, pruebas y verificación pública
└── Consumidores
    ├── Web/PWA
    ├── TV Client
    ├── Overlay/OBS
    ├── QR/Pantalla secundaria
    ├── Auditor Agent
    ├── Event Store
    └── YouTube, Avatar y TTS — bloqueados o no implementados
```

El contrato `MjpTvManifest v1` unifica la distribución pública del evento. Incluye identidad de evento y ronda, juego, subtipo, versión de ruleset, estado proyectado, cuenta regresiva, QR firmado, resultado cuando corresponde, participantes, timestamps, URLs públicas, secuencia, versión del manifest y banderas de crédito virtual. TV Client y overlay no generan resultados ni modifican rondas.

## 5. Estado funcional por dominio

| Dominio | Estado | Evidencia / limitación |
| --- | --- | --- |
| Rondas y estados | PASS | Estados persistidos y máquina formal de transiciones. |
| Sorteo verificable | PASS | HMAC-SHA-256, semilla revelable y verificación pública. |
| Liquidación virtual | PASS | Movimientos e idempotencia; claim con bloqueo de fila añadido. |
| Claim transaccional | IMPLEMENTED / NEEDS STAGING | `SELECT ... FOR UPDATE` antes de liquidar; falta carga concurrente real MySQL/TiDB. |
| Wallet | PASS | Solo créditos virtuales, sin valor monetario ni conversión. |
| QR | PASS / LOCAL ONLY | Firma, expiración y derivación determinista; sin almacenamiento físico del payload como fila independiente. |
| TV `/tv` | PASS dentro del piloto | Selector en vivo/en línea, salida, contingencia, QR, historial, temas y notificaciones. |
| Overlay `/overlay/:roundId` | PASS dentro del piloto | Estadísticas del manifest, realce de cambios y exportación PNG local. |
| PWA | PASS | Manifiesto, instalación, offline, tema y guía táctil. |
| Auditor Agent | PASS acotado | Verifica determinísticamente; no tiene autoridad para cambiar resultados. |
| Event Store | PASS acotado | Correlación, idempotencia y encadenamiento operativo. |
| Analítica | LOCAL ONLY | Sesiones, retornos y pantalla secundaria sin PII innecesaria. |
| YouTube Live oficial | BLOCKED | Falta API key, canal y autorización de scopes mínimos. |
| Avatar 3D/TTS | NOT IMPLEMENTED | Requiere proveedor, activos, presupuesto y decisión de producto. |
| Scheduler | BLOCKED | Preparado, pero no activado para cierres automáticos. |
| Watchdog/Kill Switch independiente | NOT IMPLEMENTED / NEEDS HUMAN DECISION | Falta operación persistente y procedimiento formal. |

## 6. Catálogo virtual

El catálogo activo contiene Loterías, Bingo, Ruletas Simplificadas y modalidades adicionales. Las tarifas internas se expresan en créditos virtuales referenciados internamente a una unidad PEN únicamente como parámetro de diseño; esto no crea valor monetario, deuda ni promesa de conversión.

| Familia | Modalidades o alcance |
| --- | --- |
| Lotería | Lotería 19, 29, 39, 49, 59 y variante separada 5/39 según ruleset vigente; MJP Extra conserva reglas diferenciadas. |
| Bingo | Bingo Flash, Bingo Keno y Bingo 75, con selección manual o generación automática según modalidad. |
| Ruleta | Ruleta piloto y Ruletas Simplificadas 7, 17, 27 y 37; se diferencian reglas y pagos por ruleset. |
| Cartas | Trío 13 con barajado y verificación virtual. |
| Mercados | MultiMarket Perú virtual, curado y moderado; sin publicación automática ni dinero real. |
| Juegos adicionales | Pick 3, Pick 4, Raspa, Sueldo de por vida y Loto Express sujetos a reglas, simulaciones y validación matemática individual antes de operación regulada. |

No debe utilizarse el promedio del catálogo para afirmar que cada juego alcanza un RTP determinado. Cada modalidad requiere su propio ruleset, cálculo exacto, simulación compatible y aprobación.

## 7. Auditoría matemática y RTP

La calculadora RTP del proyecto ha sido utilizada para comparar tablas y objetivos. El umbral de 85 % es una referencia de diseño del piloto y no una certificación regulatoria. La simulación aislada no debe tratarse como equivalente al motor si no reproduce todas sus reglas, especialmente en Bingo, ruletas simplificadas, Raspa, Pick, Loto y Sueldo.

Las reglas de redondeo virtual están documentadas: fracciones entre 0 y menos de 0,40 se anulan; desde 0,40 hasta menos de 1,00 se redondean hacia la unidad superior. Los premios publicados deben mostrar siempre unidades enteras y el ruleset exacto aplicado.

La afirmación correcta para auditoría es: **el sistema dispone de cálculos y pruebas por modalidad, pero requiere certificación matemática independiente y pruebas de carga antes de dinero real**. No deben publicarse comparaciones con operadores externos ni probabilidades no sustentadas por una fuente y una fórmula reproducible.

## 8. TV, PWA, QR y experiencia multidispositivo

Al encender `/tv`, el usuario puede elegir **Ver transmisión en vivo** o **Ver en línea**. El primer modo prepara la señal audiovisual cuando existe configuración válida; el segundo conserva el estado del evento, QR, historial y verificación aunque no exista señal audiovisual. El botón **Salir al portal** devuelve al inicio.

Las notificaciones de `/tv` reaccionan a cambios de secuencia o estado autoritativo, no a cada polling. Se pueden seleccionar temas de notificación y el nombre de marca o marca de agua se conserva localmente. El overlay muestra estado, juego, subtipo, secuencia, cuenta regresiva, participantes, QR, resultado, ruleset, timestamp, versión y modo virtual. La exportación PNG es local y no envía el manifest a un servidor.

La prueba automatizada responsive cubre 1280×720, 1024×768, 768×1024 y 390×844. La revisión interactiva adicional fue confirmada por el propietario como satisfactoria en Smart TV, Android TV, tablet y celular. Para formalizar la evidencia externa se recomienda conservar una ficha por dispositivo con fabricante, modelo, sistema operativo, navegador, versión, resolución, conectividad, fecha, resultado y captura.

## 9. Seguridad, privacidad y juego responsable

El piloto mantiene límites de solicitudes, cabeceras de seguridad, OAuth, separación de roles, procedimientos protegidos, controles de accesibilidad, modo offline y eventos de auditoría. Los mecanismos KYC/AML, geolocalización, autoexclusión y límites de tiempo son preparatorios o simulados, no controles regulatorios efectivos.

No se deben cargar documentos reales en el simulador KYC. Tampoco debe presentarse el estado de geolocalización simulada como una comprobación legal de ubicación. Antes de cualquier dinero real se requiere diseño y revisión específica de protección de datos, retención, acceso, consentimiento, prevención de fraude, KYC/AML, juego responsable y atención de reclamos.

## 10. Claim transaccional de cierre

El cierre de ronda utiliza una transacción y reclama la fila con `SELECT ... FOR UPDATE` antes de calcular resultado, premios y movimientos. Una ronda ya liquidada conserva la evidencia existente para impedir doble liquidación lógica. La prueba dedicada confirma la transacción y la reclamación previa.

El estado se clasifica **IMPLEMENTED / NEEDS STAGING**, no como certificación de concurrencia. Faltan pruebas en MySQL/TiDB representativo con dos procesos simultáneos, deadlocks, timeouts, reintentos, rollback, observabilidad y recuperación operativa.

## 11. Pruebas y evidencias

| Validación | Resultado |
| --- | --- |
| `pnpm check` | PASS; TypeScript sin errores |
| `pnpm test -- --run` | PASS; 31 archivos, 91 pruebas aprobadas y 3 pruebas de navegador omitidas por bandera de entorno |
| `pnpm test:e2e` | PASS; 2 archivos y 6 pruebas E2E aprobadas |
| Cambio de modo TV | PASS en navegador automatizado |
| Salida al portal | PASS en navegador automatizado |
| Persistencia de temas | PASS tras recarga |
| Exportación PNG con marca | PASS en Chromium |
| Responsive TV | PASS en cuatro tamaños automatizados |
| Claim de cierre | PASS unitario; NEEDS STAGING para concurrencia |
| Revisión física | Confirmada por el propietario; faltan fichas técnicas por dispositivo para auditoría externa |
| Build | PASS; advertencias no bloqueantes documentadas |

## 12. Modelo financiero preliminar 2026

El archivo complementario `MJP_MODELO_FINANCIERO_PERU_2026.xlsx` contiene hojas de supuestos, costos fijos, escenarios y notas de auditoría. `MJP_MODELO_FINANCIERO_PERU_2026.md` explica la metodología.

El modelo utiliza como referencias externas la UIT 2026 de S/ 5 500, la tarifa publicada de Yape Empresa de 2,95 % y una referencia SUNAT de 12 % para juegos a distancia, aplicadas únicamente como sensibilidades de una operación futura. La nómina, cloud, marketing, soporte, certificación, homologación, reservas, fraude, chargebacks, IGV, renta, ISC y otros costos deben sustituirse por contratos, cotizaciones o dictámenes profesionales.

Con una jugada hipotética de S/ 1 y RTP de 85 %, el margen bruto teórico antes de fees, impuestos y costos fijos es 15 %. Esto no es utilidad neta. El piloto actual no genera ventas, ingresos, premios monetarios, obligaciones tributarias de operación real ni conversión de créditos.

## 13. Preparación regulatoria y límites de alcance

La eventual migración a dinero real sería un proyecto nuevo, no una simple activación de configuración. Exigiría separar ledger virtual y ledger monetario, rediseñar pagos y conciliación, implementar KYC/AML efectivo, geolocalización, juego responsable, protección de datos, atención de reclamos, control de menores, homologación, certificación RNG, revisión tributaria y autorización aplicable de MINCETUR. Los requisitos deben verificarse con asesoría peruana vigente antes de cualquier lanzamiento [1] [2].

No se permite afirmar que el piloto está homologado, autorizado, certificado o listo para operar con soles. La referencia interna crédito/PEN sirve solo para evitar distorsiones de diseño y no habilita cobros ni retiros.

## 14. Riesgos y recomendaciones priorizadas

| Prioridad | Riesgo o brecha | Acción recomendada | Responsable sugerido |
| --- | --- | --- | --- |
| Alta | Certificación independiente pendiente | Contratar auditor técnico competente para RNG, rulesets y RTP | Dirección / QA |
| Alta | Claim no probado bajo concurrencia real | Ejecutar staging MySQL/TiDB con carreras, rollback y deadlocks | Ingeniería / QA |
| Alta | Modelo financiero preliminar | Sustituir supuestos por cotizaciones, contratos y memo contable/tributario | Contador |
| Alta | Integración YouTube oficial bloqueada | Configurar API key restringida y canal solo tras aprobación de alcance | Operaciones |
| Media | Evidencia física resumida | Guardar ficha por dispositivo y captura por escenario | QA |
| Media | Bundle frontend grande | Aplicar code splitting y optimización de recursos | Ingeniería |
| Media | Métricas productivas incompletas | Definir retención, cohortes, alertas y observabilidad con privacidad | Producto / Datos |

## 15. Checklist de auditoría externa

| Control | Evidencia a solicitar |
| --- | --- |
| Código y dependencias | Checkpoint, lockfile, inventario de versiones y diff |
| Reglas | Rulesets, fórmulas, tablas de premios y aprobación de cambios |
| Sorteo | Semilla, hash, algoritmo, revelación y reproducción independiente |
| Liquidación | Logs, idempotency keys, transacciones y pruebas de concurrencia |
| Datos | Esquema, migraciones, retención, backups y controles de acceso |
| TV/QR | Manifest, firma, expiración, rutas públicas y capturas |
| E2E | Logs completos, entorno, navegador, dispositivo y timestamp |
| Finanzas | Modelo, cotizaciones, bases tributarias y supuestos editables |
| Regulación | Memo legal, homologación, certificación y autorización aplicable |
| Seguridad | Pen test, threat model, incident response y revisión de secretos |

## 16. Conclusión

El proyecto presenta una base técnica sólida para un piloto virtual verificable y multiplataforma. La implementación actual permite probar juegos, rondas, TV, QR, overlay, PWA y auditoría sin utilizar dinero real. La arquitectura separa razonablemente la autoridad del backend de las vistas consumidoras y conserva límites explícitos frente a una futura regulación.

El sistema **no debe considerarse listo para monetización**. Las decisiones críticas siguientes son: certificación independiente del RNG y RTP, pruebas de concurrencia en staging, revisión contable y tributaria, formalización de evidencia de dispositivos, seguridad ofensiva y decisión legal sobre el alcance regulado. Hasta completar esos controles, deben permanecer desactivados pagos, retiros, conversión, Yape, KYC/AML real, operación automática y cualquier promesa de premio monetario.

## Referencias

[1]: https://www.sunat.gob.pe/indicestasas/uit.html — SUNAT, “Unidad Impositiva Tributaria - UIT”.

[2]: https://emprender.sunat.gob.pe/principales-impuestos/otros/impuesto-los-juegos-apuestas-deportivas-distancia — SUNAT, “Impuesto a los juegos y apuestas deportivas a distancia”.

[3]: https://www.yape.com.pe/productos/yape-empresa — Yape, “Yape Empresa”.

[4]: https://apuestasdeportivas.mincetur.gob.pe/ — MINCETUR, portal de juegos online y apuestas deportivas a distancia.
