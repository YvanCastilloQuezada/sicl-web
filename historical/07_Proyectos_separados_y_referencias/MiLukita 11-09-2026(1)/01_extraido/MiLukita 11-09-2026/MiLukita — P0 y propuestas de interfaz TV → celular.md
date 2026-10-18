# MiLukita — P0 y propuestas de interfaz TV → celular

**Contexto:** revisión independiente posterior a la Orden 43-B. Este documento es diagnóstico y de diseño conceptual; no implementa ninguna solución de interfaz.

## 1. Extracción de P0

La auditoría `MILUKITA_UX_MASTER_AUDIT.md` **no registra problemas P0 críticos**. Los hallazgos más urgentes están clasificados como **P1 alto**, porque afectan la demostración del flujo y la certificación multiplataforma, pero no se ha demostrado una pérdida de autoridad, alteración de resultados, dinero real o corrupción del Event Store.

| Resultado | Interpretación |
|---|---|
| P0 registrados | 0 |
| P1 relevantes para TV → celular | QR no visible directamente en `/tv`; flujo de 15 minutos no probado como golden flow; siguiente evento no publicado; KILL LUKITA no probado; Safari iOS/Android TV no certificados |
| Riesgo de autoridad | No se observó dependencia circular; MJP CORE sigue siendo fuente autoritativa |
| Riesgo de experiencia | Alto hasta resolver evidencia y continuidad del recorrido |

## 2. Propuestas de interfaz priorizadas para TV → celular

### P1-UX-01 — Puente QR único y siempre explicable

La pantalla TV debe tener un bloque de participación con tres elementos persistentes: **QR de la ronda**, código corto legible y frase de acción “Escanea con tu celular para participar”. El bloque debe mostrar juego, ronda, hora de expiración y estado “Solo créditos virtuales”. Cuando la ronda no esté abierta, el QR debe desaparecer y convertirse en un estado explícito “El próximo QR aparecerá al abrir la ronda”, nunca en un QR viejo.

**Evidencia que debe exigirse:** el QR debe derivar del mismo `roundId`, `eventId`, `experienceId`, `verifyUrl` y `expiresAt` del manifest; debe haber una prueba visual y de contrato que demuestre que no se presenta QR expirado.

### P1-UX-02 — Entrada móvil en dos pasos

Al escanear, el celular debe abrir una pantalla puente que confirme **“Estás entrando a: [juego] · Ronda [id]”**, muestre el estado de conexión y ofrezca dos acciones: **Continuar** y **Verificar ronda**. Esto reduce el riesgo de que el usuario participe en una ronda distinta por una captura antigua o un enlace reenviado.

### P1-UX-03 — Estado común TV y celular

TV y celular deben mostrar la misma etiqueta de fase: **Próximamente**, **Abierta**, **Cerrada**, **Sorteando**, **Resultado verificado** o **Contingencia**. La etiqueta debe incluir una marca temporal del servidor y no el reloj local como autoridad. La animación puede ser distinta, pero el texto y el color semántico deben coincidir.

### P1-UX-04 — Cierre visible e irreversible

Antes del cierre, el celular debe mostrar countdown y una advertencia clara. Después del cierre, el botón de participación debe quedar deshabilitado con copy “Participación cerrada por el servidor”; TV debe cambiar el bloque QR a “QR expirado”. El usuario debe encontrar un enlace inmediato a **Verificar resultado**.

### P1-UX-05 — Continuidad al siguiente evento

Después de la verificación, TV y celular deben ofrecer una siguiente acción: **Ver próximo evento**, **Volver a juegos** o **Seguir en modo aprender**. El bloque debe mostrar “Próximo evento no disponible” cuando el backend no haya publicado uno; no se debe fabricar un horario.

### P1-UX-06 — Contingencia que no rompe la participación

Si YouTube falla, TV debe conservar manifest, estado de ronda, QR válido si aún está abierta y enlace de verificación. El encabezado debe decir “Señal audiovisual fuera de servicio; el servidor continúa operativo”. Lukita, si se integra en el futuro, debe reducirse o desaparecer sin ocultar el QR ni el estado autoritativo.

## 3. Solución recomendada como arquitectura UX

La unidad de interacción debe ser una **Event Card común** consumida por TV y celular, derivada del manifest. La tarjeta debe contener `eventId`, `roundId`, `gameId`, `phase`, `status`, `countdown`, `qr`, `verifyUrl`, `nextEvent` y `recovery`. El cliente puede animar, pero no recalcular autoridad ni mantener QR fuera de su ventana.

| Capa | Responsabilidad | No debe hacer |
|---|---|---|
| MJP CORE | Estado, cierre, resultado y fuente autoritativa | Depender de Lukita |
| MjpTvManifest | Proyección común TV/celular/overlay | Inventar siguiente evento o QR |
| TV Client | Presentación, QR, estado y contingencia | Decidir resultados |
| Celular | Confirmación, interacción y verificación | Confiar en reloj local |
| Lukita | Companion y presentación futura | Generar números, premios o fases |

## 4. Condiciones de aceptación futuras

La propuesta no debe considerarse implementada hasta que exista una prueba golden flow con fixture controlado, una prueba negativa de QR expirado, una prueba de ronda cerrada, una prueba de contingencia audiovisual, una prueba sin Lukita y evidencia en Chromium, iOS Safari y Android TV. Esta recomendación permanece fuera de alcance de la Orden 43-B.
