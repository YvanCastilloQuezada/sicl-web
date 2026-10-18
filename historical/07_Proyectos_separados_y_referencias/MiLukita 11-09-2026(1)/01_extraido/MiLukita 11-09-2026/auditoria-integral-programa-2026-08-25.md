# Auditoría integral del programa
## Multi Juegos Perú / Ruleta Perú Online

**Fecha de auditoría:** 25 de agosto de 2026  
**Versión de referencia:** checkpoint `637a9da6`  
**Tipo de producto:** piloto web de juegos virtuales con créditos demostrativos  
**Autor del informe:** Manus AI  
**Estado general:** técnicamente avanzado para demostración controlada; no autorizado para operación con dinero real.

> **Conclusión ejecutiva.** El proyecto cuenta con una base funcional de piloto: autenticación, motor de rondas, base de datos, reglas versionadas, sorteos HMAC-SHA-256, liquidación trazable, catálogo de juegos, simulador local, auditoría pública, PWA y diseño responsive. La expansión adicional fue organizada según el ranking solicitado y quedó preparada para cierres automáticos virtuales. Sin embargo, los cierres programados están desactivados y no existe todavía una plataforma de juego real autorizada: no hay depósitos, Yape activo, retiros, conversión de créditos, KYC real, AML real, geolocalización real, certificación ni homologación.

---

## 1. Alcance y método

Esta auditoría revisa el estado del código, los modelos de datos, las rutas de usuario, las reglas matemáticas, las pruebas automatizadas, la documentación, la seguridad básica, la preparación regulatoria y los cambios incorporados hasta el checkpoint indicado. Se contrastaron el inventario del repositorio, `package.json`, las migraciones Drizzle, las rutas React, el motor `server/pilot.ts`, el controlador de horarios, los documentos técnicos y la suite Vitest.

La auditoría distingue tres estados que no deben confundirse:

| Estado | Significado | Ejemplo |
|---|---|---|
| **Implementado** | Existe código y pruebas o evidencia suficiente para el alcance del piloto. | Sorteo verificable, simulador local, billetera virtual. |
| **Preparado/desactivado** | Existe diseño, persistencia o controlador, pero la operación está bloqueada. | Cierres automáticos de nuevas modalidades. |
| **Pendiente** | Requiere desarrollo, decisión, proveedor, certificación o validación externa. | Pagos, KYC real, homologación y operación con dinero real. |

El documento evalúa el programa como software de demostración. No emite opinión legal ni certifica cumplimiento frente a MINCETUR u otra autoridad.

---

## 2. Dictamen general por área

| Área | Estado | Evaluación | Riesgo residual |
|---|---|---|---|
| Arquitectura web | Implementado | React 19, Vite, Tailwind 4, Express, tRPC 11, Drizzle/MySQL-TiDB y OAuth integrados. | Medio: falta endurecimiento de producción y observabilidad operativa. |
| Motor de juegos | Implementado | Apertura, cierre, bloqueo, sorteo, liquidación, idempotencia y reglas versionadas. | Medio: falta certificación independiente y pruebas de carga realistas. |
| Integridad de resultados | Implementado en piloto | Semillas HMAC, hash previo, semilla revelada y verificación pública. | Alto para dinero real hasta auditoría/certificación externa. |
| Catálogo base | Implementado | Ruleta, Jackpot, Bingo, Lotería, Trío 13 y MultiMarket virtual. | Medio: falta UAT formal y política operativa completa. |
| Juegos adicionales | Implementado en piloto | Sueldo de por vida, Raspa Digital, Pick 3/4, Loto Diario y Loto Express. | Medio: frecuencias preparadas, no activadas. |
| Práctica | Implementado | Simulador local aislado, 17 modalidades iniciales y expansión adicional. | Bajo: debe mantenerse separado del servidor oficial. |
| Billetera | Implementado como virtual | Créditos, bonificaciones, movimientos y premios trazables. | Alto si se interpreta como saldo monetario; mantener mensajes visibles. |
| PWA/responsive | Implementado | Manifiesto, icono, offline seguro, tema, guía táctil e invitación de instalación. | Bajo/medio: verificar instalación en dispositivos objetivo. |
| Seguridad de aplicación | Parcialmente implementado | Helmet, límites de solicitudes, cabeceras, autenticación y controles de acceso. | Alto para operación comercial hasta pentest y revisión de secretos. |
| Juego responsable | Simulado/parcial | Límites visuales, autoexclusión simulada y mensajes de pausa. | Alto: no bloquea cuentas ni sustituye controles efectivos. |
| KYC/AML | Solo diseño | Estados y arquitectura neutral sin documentos ni screening. | Crítico si se habilita dinero real sin proveedor y programa aprobado. |
| Geolocalización | Simulada | Indicador “Perú · SIM”; no consulta el dispositivo. | Alto si se presenta como control territorial real. |
| Pagos | Desactivado | Referencias de Yape previstas, sin cobros ni conciliación. | Crítico para cualquier operación con dinero real. |
| Regulación | Preparación documental | Se documentaron dominios y compuertas de activación. | Crítico: falta asesoría, autorización, certificación y homologación aplicable. |

---

## 3. Arquitectura técnica implementada

### 3.1 Capas principales

| Capa | Componentes | Responsabilidad |
|---|---|---|
| Cliente | `client/src/App.tsx`, páginas, componentes UI, contextos | Rutas, experiencia de juego, accesibilidad, responsive y PWA. |
| Contrato API | `client/src/lib/trpc.ts`, `server/routers.ts` | Tipos compartidos y procedimientos tRPC. |
| Servidor | `server/_core/index.ts`, `context.ts`, `trpc.ts`, `security.ts` | Express, OAuth, contexto de sesión, límites y montaje HTTP. |
| Motor | `server/pilot.ts` | Reglas, generación verificable, cierre, liquidación, auditoría y preparación de rondas. |
| Persistencia | `drizzle/schema.ts`, `server/db.ts`, migraciones `0000`–`0016` | Usuarios, rondas, boletos, reglas, billetera, auditoría, horarios y cuotas. |
| Dominio compartido | `shared/*.ts` | Catálogo, variantes, identificadores, preparación regulatoria y reglas simplificadas. |
| Práctica | `client/src/lib/practiceSimulator.ts` | Simulación local sin llamadas API ni movimientos oficiales. |
| Operación programada | `server/scheduledGames.ts`, `server/_core/heartbeat.ts` | Endpoint autenticado para ciclo idempotente de cierre y apertura. |

### 3.2 Flujo oficial de una ronda

1. Una regla publicada identifica el tipo de juego y su versión.
2. Se abre una ronda con `publicId`, ventanas de tiempo y semilla secreta; se publica el hash de la semilla.
3. El usuario autenticado reserva una participación o boleto virtual mediante tRPC.
4. Al cerrar la ronda, el servidor bloquea nuevas participaciones, obtiene la regla persistida y genera el resultado verificable.
5. Se calculan coincidencias, premio bruto, premio liquidable y movimiento de billetera con clave idempotente.
6. Se publica evidencia para que el resultado pueda ser verificado sin exponer secretos antes del cierre.

El simulador de `Aprender` no usa este flujo. Su separación es correcta y debe conservarse para impedir que una práctica altere saldo, rondas, comprobantes o auditoría oficial.

---

## 4. Funcionalidades implementadas

### 4.1 Experiencia y navegación

La aplicación dispone de portada, navegación pública, páginas de juego, perfil, billetera, verificación, transparencia, RTP, impacto social, operaciones y simulador. Las rutas se diseñaron para celular, tablet y escritorio. Se incorporó el acceso directo desde los juegos al modo de práctica mediante parámetros `?game=`.

También se implementaron selector de idioma informativo para español, inglés, italiano, francés, alemán y chino simplificado; tema oscuro/claro persistente; escala, contraste y reducción de movimiento; guía táctil interactiva; y acceso desde Perfil para reabrirla.

Las traducciones distintas del español son informativas. Antes de considerarlas operativas deben recibir traducción jurídica y revisión de reglas, RTP, condiciones y metadatos.

### 4.2 Catálogo base

| Familia | Modalidades incluidas | Estado |
|---|---|---|
| Lotería | Lotería 19, Lotería 29, Lotería 39 MJP, Lotería 49 y Lotería 59 | Activas como piloto virtual. No restaurar variantes eliminadas. |
| Bingo | Flash, Keno y Bingo 75 | Implementados con selección manual/automática, cartón y bola adicional de consuelo según regla publicada. |
| Ruleta simplificada | Ruleta 7, 17, 27 y 37 | Implementadas con Color y Par/Impar; **Total permanece diferido**. La portada prioriza las modalidades solicitadas 17/27/37. |
| Jackpot | Tableros y premio virtual con consuelo | Implementado; premio adicional y reglas versionadas. |
| Cartas | Trío 13 | Implementado como juego virtual verificable. |
| Mercado | MultiMarket Perú | Implementado como contratos Sí/No curados; sin publicación automática ni dinero real. |

La eliminación de loterías antiguas se realizó mediante migración y depuración confirmada. No deben reintroducirse `loteria` clásica ni variantes `_cons` eliminadas, salvo una decisión nueva, explícita y auditada.

### 4.3 Juegos adicionales según ranking

| Puesto | Juego | Estado actual | Regla resumida | RTP teórico publicado |
|---:|---|---|---|---:|
| 1 | Sueldo de por vida | Implementado virtual | 4 números de 30; 4/4 entrega 21 600 créditos representados como 24 cuotas virtuales de 900; 3/4 entrega 16. | 84,8896 % |
| 2 | Raspa Digital | Implementado virtual | Una casilla de 20; resultado verificable tras cierre breve. | 85,0000 % |
| 3 | Pick 3 | Implementado virtual | Tres dígitos del 0 al 9; se permite repetición y se compara por posición. | 85,1000 % |
| 3 | Pick 4 | Implementado virtual | Cuatro dígitos del 0 al 9; se permite repetición y se compara por posición. | 84,8200 % |
| 4 | Loto Diario | Implementado virtual | Cuatro números de 20; una ronda diaria virtual. | 85,2012 % |
| 5 | Loto Express | Implementado virtual | Tres números de 10; rondas rápidas virtuales. | 85,0000 % |
| 6 | Bingo | Ya implementado | Flash, Keno y 75; se conserva como familia existente, no como desarrollo nuevo. | Según modalidad |

#### Tablas de premios adicionales

| Juego | Condición | Premio virtual |
|---|---|---:|
| Sueldo de por vida | 4/4 | 21 600, en 24 cuotas de 900 |
| Sueldo de por vida | 3/4 | 16 |
| Raspa Digital | Casilla ganadora | 17 |
| Pick 3 | 3 posiciones | 500 |
| Pick 3 | 2 posiciones | 13 |
| Pick 4 | 4 posiciones | 4 000 |
| Pick 4 | 3 posiciones | 57 |
| Pick 4 | 2 posiciones | 5 |
| Loto Diario | 4/4; 3/4; 2/4 | 2 000; 22; 1 |
| Loto Express | 3/3; 2/3 | 60; 2 |

Todos los importes se expresan en créditos virtuales enteros. El crédito tiene una referencia interna de 1 unidad contable por 1 PEN únicamente para evitar distorsión matemática futura; no es dinero, no es cobrable, no es convertible y no representa un derecho económico.

### 4.4 Horarios preparados, no activos

| Juego | Cadencia propuesta | Expresión UTC | Estado |
|---|---|---|---|
| Sueldo de por vida | Semanal | `0 0 0 * * 1` | Preparada, desactivada |
| Raspa Digital | Cada minuto | `0 * * * * *` | Preparada, desactivada |
| Pick 3 | Cada 30 minutos | `0 0,30 * * * *` | Preparada, desactivada |
| Pick 4 | Cada dos horas | `0 0 */2 * * *` | Preparada, desactivada |
| Loto Diario | Diario | `0 0 0 * * *` | Preparada, desactivada |
| Loto Express | Cada 30 minutos | `0 0,30 * * * *` | Preparada, desactivada |

El controlador identifica la tarea propia, no confía en un `gameType` arbitrario del cuerpo, cierra rondas vencidas de forma repetible, abre la siguiente ronda y registra un evento de auditoría. **No se deben crear ni activar tareas recurrentes antes de publicar la versión y aprobar la operación.**

---

## 5. Matemática, RTP y justicia del piloto

El proyecto incluye reglas versionadas, premios enteros, simuladores de RTP y una política común de liquidación: valores brutos inferiores a 0,4 se anulan y valores desde 0,4 se redondean hacia arriba a una unidad virtual. Las tablas nuevas ya son enteras.

Las ruletas simplificadas tienen RTP y margen visible. Para las modalidades recalibradas principales se documentaron valores cercanos a 85 %, incluyendo Ruleta 17: 84,7059 %, Ruleta 27: 85,5967 % y Ruleta 37: 85,1351 %. El Total de ruleta fue expresamente excluido hasta una auditoría posterior.

La justicia técnica es razonable para un piloto porque el resultado se genera en servidor con HMAC-SHA-256 y rechazo/muestreo sin reemplazo donde corresponde. Aun así, una afirmación comercial como “justo” debe limitarse a “verificable según la regla publicada” hasta realizar auditoría independiente, pruebas estadísticas, revisión de entropía, control de secretos, retención de evidencias y certificación aplicable.

No se debe afirmar que una modalidad tiene una probabilidad superior a otra plataforma salvo que exista una comparación reproducible, misma unidad de juego, misma tabla, misma definición de premio mayor y fuente verificable.

---

## 6. Seguridad, privacidad y controles responsables

### 6.1 Implementado

Se observan cabeceras de seguridad mediante Helmet, límites de solicitudes para API y mutaciones, controles de autenticación OAuth, procedimientos protegidos, separación de roles, eventos de auditoría, claves idempotentes de movimientos y exclusión de rutas `/api/` del caché PWA. El servicio offline informa que saldos, rondas oficiales y comprobantes requieren conexión, evitando presentar datos oficiales obsoletos.

La PWA fue corregida para no interceptar módulos de desarrollo. El runtime de vista previa se ajustó para evitar una copia incompatible de React y se añadió limpieza de almacenamiento en desarrollo, lo que recuperó el renderizado tras una pantalla vacía.

### 6.2 Simulado o desactivado

El perfil contiene una demostración KYC que no abre selector de archivos, no transmite documentos y no almacena imágenes, biometría ni identificadores. El juego responsable permite visualizar límite de sesión y autoexclusión simulada, pero no bloquea cuentas. El indicador de Perú usa la etiqueta “SIM” y no consulta la ubicación del dispositivo.

Estos elementos son demostraciones de diseño y no deben presentarse como KYC, autoexclusión o geobloqueo efectivos.

### 6.3 Recomendaciones de seguridad pendientes

Antes de cualquier operación real se necesita un modelo de amenazas, revisión de secretos, pentest, pruebas de autorización por objeto, protección CSRF según el flujo final, rotación de claves, gestión de incidentes con escalamiento, respaldo y restauración probados, monitoreo, alertas, retención formal de auditoría, revisión de dependencias y un procedimiento de despliegue reproducible.

No se deben guardar bytes de documentos en la base de datos. Si una futura decisión legal autoriza KYC, los documentos deben residir en un proveedor especializado con cifrado, retención mínima, control de acceso, trazabilidad y eliminación verificable.

---

## 7. Base de datos y migraciones

El esquema contiene entidades para usuarios, reglas, rondas, billeteras, movimientos, boletos, previsualizaciones de lotes, horarios, cuotas virtuales, planes asistidos, auditoría, misiones, promociones, mercados y ciclos sociales. La migración `0016_nasty_charles_xavier.sql` agrega las estructuras de nuevas modalidades, horarios y cuotas sin eliminar datos históricos.

| Grupo | Tablas principales |
|---|---|
| Identidad y acceso | `users`, `player_settings` |
| Juego | `game_rulesets`, `game_rounds`, `pilot_tickets` |
| Créditos | `virtual_wallets`, `wallet_transactions` |
| Lotes y comprobantes | `game_batch_previews`, previsualizaciones de mercado |
| Programación | `game_schedules`, `virtual_award_installments` |
| Auditoría | `audit_events` |
| Mercados | `market_events`, `market_positions` |
| Producto responsable | `missions`, `player_mission_progress`, `promotion_rules` |
| Impacto social | `social_impact_cycles` |
| Futura integración | `payment_references`, desactivada |

La auditoría no recomienda nuevos cambios destructivos de esquema. Todo cambio futuro debe seguir: modificar el esquema, generar migración, leer el SQL, aplicarlo mediante el mecanismo de migración aprobado, verificar índices/constraints y ejecutar una prueba reversible aislada.

---

## 8. Pruebas y evidencia

La última validación registrada ejecutó:

| Comando | Resultado |
|---|---|
| `pnpm check` | Aprobado, TypeScript sin errores |
| `pnpm test` | **19 archivos y 54 pruebas aprobadas** |
| `pnpm build` | Aprobado; Vite y esbuild generaron producción |
| Verificación visual | Portada, Pick 3 y simulador; responsive previamente revisado |
| Pruebas E2E | Salud, autenticación sintética, rondas, reserva, verificación, billetera y mercados |
| Integraciones | Liquidación de Bingo, loterías, MJP Extra, ruletas y reglas adicionales |

La suite es valiosa, pero no equivale a una certificación. Faltan pruebas de carga con concurrencia, caos y recuperación, navegador real en una matriz de dispositivos, pruebas de accesibilidad automatizada completa, pruebas de seguridad externas, pruebas de reloj/UTC, pruebas de doble ejecución de tareas programadas y pruebas de restauración desde respaldo.

Se observó una advertencia de compilación: la imagen `/manus-storage/ruleta-peru-hero_7732dc7d.png` no se resuelve durante build y queda para resolución en runtime. La compilación termina correctamente, pero conviene verificar que el recurso existe en el entorno publicado. También se observa una advertencia de bundle grande superior a 500 kB y una advertencia de `pnpm` sobre la sección `pnpm` del `package.json`; ambas deben limpiarse antes de optimizar una entrega de producción.

---

## 9. Qué falta implementar

### 9.1 Pendientes técnicos de alta prioridad

| Prioridad | Pendiente | Criterio de finalización |
|---|---|---|
| P0 | Validación de autorización por objeto y revisión de secretos | Matriz de permisos, pruebas negativas y revisión externa aprobadas. |
| P0 | Backups y recuperación | Restauración probada, RPO/RTO definidos y evidencia almacenada. |
| P0 | Auditoría independiente del RNG y RTP | Informe externo reproducible y acciones correctivas cerradas. |
| P1 | Pruebas de carga | Escenarios de concurrencia para rondas, reservas, cierre y billetera. |
| P1 | Observabilidad | Logs estructurados, métricas, alertas, trazas y panel operativo. |
| P1 | Doble ejecución de cron | Prueba de carreras, lock/idempotencia y recuperación tras timeout. |
| P1 | UAT | Casos firmados para jugador, operador, verificador y soporte. |
| P2 | Optimización frontend | Code splitting, revisión del bundle y verificación de recursos S3/runtime. |
| P2 | Traducción jurídica | Revisión profesional de textos no españoles antes de operación. |

### 9.2 Pendientes regulatorios y de producto

No están implementados ni habilitados pagos, depósitos, Yape, retiros, conversión de créditos, KYC real, AML/SPLAFT, mayoría de edad verificable, geolocalización real, autoexclusión efectiva, certificación técnica, homologación, autorización de explotación, soporte regulado ni un programa de reclamaciones. Tampoco existe base para prometer salario, pensión, renta o pago económico en “Sueldo de por vida”.

La documentación recomienda diseñar estos dominios desde el día uno, pero la preparación arquitectónica no constituye cumplimiento. Antes de activarlos se requiere decisión formal, abogado peruano especializado, evaluación de autoridad competente, privacidad, proveedores, contratos, seguridad, certificación y pruebas.

---

## 10. Próximos pasos recomendados

### Fase 0 — Control de versión y estabilización: 1 semana

Publicar únicamente el checkpoint auditado después de la revisión del equipo. Confirmar que la vista previa, PWA, recursos visuales y rutas principales funcionan en Chrome/Android, Safari/iOS y tablet. Corregir la advertencia del recurso hero y documentar la advertencia de bundle. No activar horarios automáticos todavía.

### Fase 1 — Calidad operativa: 2–3 semanas

Ejecutar UAT con escenarios de reserva, cierre, empate, ausencia de ganador, repetición de solicitudes, errores de red y doble ejecución del ciclo programado. Añadir pruebas de carga y observabilidad. Separar claramente ambiente de desarrollo, staging y producción. Preparar respaldo y restauración.

### Fase 2 — Certificación de piloto técnico: 2–4 semanas

Solicitar una revisión independiente de generación de resultados, RTP, reglas, semillas, controles de acceso, idempotencia y retención de auditoría. Congelar un ruleset por versión y mantener un expediente de cambios.

### Fase 3 — Decisión legal separada: sin activación automática

Solo si la dirección decide evaluar dinero real, iniciar un proyecto distinto con análisis jurídico, autorización aplicable, homologación/certificación, proveedores KYC/AML, pagos, geolocalización, juego responsable efectivo, soporte y protección de datos. No se debe convertir el piloto cambiando una bandera del frontend.

---

## 11. Sugerencias de mejora de producto

1. **Panel de transparencia operativo:** mostrar por modalidad regla vigente, RTP teórico, muestra observada, fecha de medición, intervalo de confianza, número de rondas y enlace a la evidencia verificable. No mostrar “tiempo real” si la métrica no se actualiza con metodología documentada.
2. **Centro de aprendizaje:** ampliar el simulador con explicación de probabilidad, diferencia entre RTP y probabilidad de premio, ejemplo de varianza y aviso de que una racha no cambia el siguiente resultado.
3. **Control de ritmo responsable:** para el piloto, usar pausas voluntarias, recordatorio de tiempo y límites de práctica; evitar rachas, urgencia artificial, premios sorpresa o mensajes de recuperación de pérdidas.
4. **Consola de operación segura:** añadir estados `preparado`, `staging`, `habilitado`, `pausado` y `revocado`, con aprobación de dos personas para activar horarios, registrar motivo y permitir rollback lógico.
5. **Catálogo escalonado:** mantener el orden del ranking, pero validar primero Sueldo de por vida, Raspa Digital y Pick 3/4 en modo práctica; añadir Loto Diario y Loto Express solo después de verificar su carga y cadencia; conservar Bingo como familia existente.
6. **Separación semántica:** considerar nombres alternativos para “Sueldo de por vida” en el piloto, por ejemplo “Premio 24 cuotas virtuales”, para evitar que el público interprete una obligación monetaria.

---

## 12. Inventario del programa

El repositorio contiene código fuente, configuración, migraciones, scripts, pruebas y documentación. Se excluyen deliberadamente `node_modules`, `dist`, cachés y secretos del inventario de auditoría. Las rutas principales son:

### Cliente

`client/src/App.tsx`, `client/src/main.tsx`, `client/src/index.css`, `client/src/lib/trpc.ts`, `client/src/lib/practiceSimulator.ts`, `client/src/pages/Home.tsx`, `GamePage.tsx`, `LearnPage.tsx`, `SimplifiedGamesPage.tsx`, `MultiMarketPage.tsx`, `Profile.tsx`, `Operations.tsx`, `TransparenciaPage.tsx`, `Verify.tsx`, `Wallet.tsx`, `RtpDashboardPage.tsx`, `ImpactoPage.tsx`, `NotFound.tsx`, componentes de layout, PWA, guía táctil, tablas, UI y contextos de idioma/tema.

### Servidor

`server/pilot.ts`, `server/routers.ts`, `server/db.ts`, `server/scheduledGames.ts`, `server/_core/index.ts`, `context.ts`, `security.ts`, `health.ts`, `heartbeat.ts`, `oauth.ts`, `trpc.ts`, `sdk.ts`, `storageProxy.ts`, pruebas E2E, pruebas de reglas, pruebas de integración, pruebas de seguridad y simulador de carga.

### Dominio compartido

`shared/simplifiedGames.ts`, `shared/lotteryVariants.ts`, `shared/ticketIdentifiers.ts`, `shared/regulatoryReadiness.ts`, `shared/virtualPrizeRounding.ts` y demás tipos/utilidades compartidas.

### Persistencia y scripts

`drizzle/schema.ts`, `drizzle/relations.ts`, migraciones `0000_true_vertigo.sql` a `0016_nasty_charles_xavier.sql`, `drizzle.config.ts`, scripts de activación, análisis, recalibración, auditoría y simulación.

### Documentación existente

El repositorio conserva documentos de reglas, RTP, loterías, Bingo, ruletas, lotes, códigos, idiomas, planes, regulación, privacidad, incidentes, UAT, auditorías previas, simulador, costos e impacto social. Este documento centraliza la lectura de estado; los documentos especializados permanecen como evidencia de diseño y no deben contradecir las reglas publicadas vigentes.

### Inventario completo de archivos

El inventario exhaustivo de rutas fuente/configuración debe generarse con:

```bash
find . -type f \\
  -not -path './node_modules/*' \\
  -not -path './dist/*' \\
  -not -path './.git/*' \\
  -not -name 'audit-facts.txt' \\
  -printf '%p\\n' | sort
```

No se incluyen dependencias instaladas ni artefactos de compilación porque no forman parte del código fuente auditable y pueden regenerarse desde `package.json` y `pnpm-lock.yaml`.

---

## 13. Evidencia y comandos de reproducción

Desde `/home/ubuntu/ruleta-peru-online`:

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm test:e2e
pnpm simulate:quick
pnpm simulate:full
```

Para auditar una regla concreta deben revisarse el ruleset persistido, la ronda, el hash de semilla, el resultado revelado, el recibo y el evento de auditoría. No se deben usar datos de usuarios reales para pruebas. Los scripts de activación y las tareas programadas deben ejecutarse únicamente con autorización operativa explícita y después de publicar el checkpoint correspondiente.

---

## 14. Referencias regulatorias y límites

La preparación documental utiliza como referencias de contexto las páginas oficiales consultadas previamente:

[1] [MINCETUR — Juegos online y apuestas deportivas](https://apuestasdeportivas.mincetur.gob.pe/)  
[2] [MINCETUR — Autorización y registro de plataformas tecnológicas](https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia)  
[3] [MINCETUR — Autorización o renovación de explotación](https://www.gob.pe/94255-autorizacion-y-o-renovacion-de-explotacion-de-plataformas-tecnologicas-de-juegos-a-distancia-y-apuestas-deportivas-a-distancia)

> Estas referencias no equivalen a una autorización. El programa debe seguir etiquetándose como piloto gratuito, con créditos virtuales, sin depósitos, sin retiros, sin conversión, sin documentos y sin controles regulatorios reales.

---

## 15. Cierre de auditoría

El software se encuentra en una condición adecuada para **demostración técnica y aprendizaje controlado**. La base de justicia verificable, reglas versionadas, pruebas, trazabilidad y experiencia móvil constituye un buen fundamento. La siguiente decisión no debe ser “activar dinero real”, sino completar calidad operativa, seguridad independiente, observabilidad, UAT y revisión legal. Las nuevas cadencias automáticas son una capacidad preparada; permanecen correctamente bloqueadas hasta que exista publicación, aprobación operativa y un entorno adecuado.

**Resultado final:** aprobado como piloto virtual técnico con pendientes de estabilización; no aprobado para operación monetaria, comercial o regulada.


## Adenda — auditoría del archivo 18 y ejecución de tareas inmediatas

El archivo `pasted_content_18.txt` fue comparado con la arquitectura vigente. Sus objetivos son compatibles con el piloto virtual, pero sus nombres de módulos de ejemplo (`LOTERIA_CONFIGS`, `server/games/loteria-39-5.test.ts` y `simulador-carga.ts`) no existen en este repositorio. Se implementaron equivalentes sobre la arquitectura real: `server/loteria39_5.test.ts`, `scripts/simulador-carga-50k.ts` y `scripts/reporte-ingresos-egresos.ts`.

La variante Lotería 39 5/39 se mantiene separada de Lotería 39 MJP 6/39, usa 1 crédito virtual, prefijo `AK`, tabla 27 000 / 300 / 20 / 5 y RTP teórico 85,0011 %. La afirmación del adjunto de que MJP 6/39 debe costar 2 créditos no se aplicó: la regla vigente usa 1 crédito base y un crédito adicional opcional para MJP Extra. Alterar ese precio fusionaría mecánicas y afectaría históricos.

La revisión visual de `/juegos/loteria_39_5`, `/transparencia` y `/aprender?game=loteria_39_5` fue satisfactoria para el alcance de interfaz; la guía táctil puede aparecer como superposición en una sesión nueva. Se verificó que el catálogo distingue 5/39 de MJP 6/39 y muestra precio y tabla correspondientes.

Se añadió una prueba dedicada de cuatro casos para configuración, tabla, RTP, redondeo, independencia y prefijo AK. La suite completa posterior quedó en 20 archivos y 59 pruebas aprobadas. La calculadora `pnpm rtp:all` reportó 23 modalidades con piso teórico igual o superior a 85 %.

Se añadió `pnpm simulate:50k`, que ejecuta 100 rondas de 500 boletos por modalidad y genera `docs/reporte-simulacion-50k.json`, además de `pnpm report:income`, que genera `docs/reporte-ingresos-egresos.csv`. La primera ejecución mostró que el simulador de carga existente no reproduce todavía todas las reglas específicas de ruletas simplificadas, Bingo y algunos juegos adicionales; sus RTP observados no deben utilizarse como certificación. La herramienta queda como evidencia diagnóstica y debe corregirse antes de declarar aprobado un RTP empírico.

El reporte de ingresos/egresos es parametrizable. Las tasas tributarias y costos de pasarela, marketing y tecnología se leen de variables de entorno y por defecto son cero; no se han inventado costos ni se presentan como tarifas oficiales. Antes de cualquier operación monetaria se requiere validación contable, tributaria, legal y regulatoria.

| Instrucción del archivo 18 | Estado | Evidencia o limitación |
|---|---|---|
| Revisión visual de 5/39 | Implementada | Tres rutas revisadas en escritorio; validar también dispositivos objetivo. |
| Prueba exclusiva | Implementada | `server/loteria39_5.test.ts`; 4 casos aprobados. |
| Informe actualizado | Implementada | Esta adenda incorpora la comparación y decisiones. |
| 50 000 jugadas por modalidad | Implementada como herramienta | `scripts/simulador-carga-50k.ts`; RTP observados no son certificación para reglas aún incompletas. |
| Reporte de ingresos/egresos | Implementada como modelo | `scripts/reporte-ingresos-egresos.ts`; supuestos externos parametrizables. |
| MJP 6/39 a 2 créditos | No aplicado | Conflicto con la regla vigente de base 1 + extra opcional 1. |

Los controles de dinero real, pagos, retiros, conversión, KYC, AML, geolocalización efectiva y autorización regulatoria siguen desactivados. El proyecto continúa siendo un piloto de créditos virtuales.
