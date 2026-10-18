# TV OS conceptual y MjpTvManifest unificado

**Proyecto:** Multi Juegos Perú  
**Fecha:** 25 de agosto de 2026  
**Autor:** Manus AI  
**Alcance:** diseño técnico y guion; no modifica el motor ni activa integraciones externas.

## 1. Dictamen ejecutivo sobre el documento 26

El documento 26 **sí aplica como dirección arquitectónica**, con una precisión esencial: “TV OS” no debe presentarse como un sistema operativo real ni como una aplicación nativa para Samsung, LG, Android TV, Google TV o Apple TV. En este proyecto significa una **capa de presentación web portable** que interpreta un estado de evento común.

La decisión recomendada es conservar un único cliente web/PWA como primera implementación. Este cliente puede funcionar en navegadores de PC, celulares, tablets, OBS y, sujeto a pruebas reales, navegadores integrados de Smart TV y dispositivos Android TV/Google TV. No debe afirmarse compatibilidad universal hasta probar resolución, navegador, rendimiento, manejo del mando y lectura del QR en cada familia de dispositivos.

La propuesta de que MJP sea la fuente de verdad y YouTube sea únicamente un canal de distribución es correcta. El servidor debe publicar el estado; TV, overlay, PWA y pantalla secundaria deben consumirlo. YouTube no debe decidir cierres, resultados, premios, reglas ni balances.

## 2. Matriz de aplicabilidad

| Requisito | Estado real | Aplicabilidad | Cómo se aplica |
|---|---|---|---|
| TV OS como abstracción | Parcialmente implementado | Alta | Mantenerlo como nombre arquitectónico de la capa de presentación. |
| Cliente HTML/CSS/JS portable | Implementado | Alta | `/tv` y `/overlay/:roundId` ya son clientes web. |
| PC, navegador, tablet y celular | Implementado | Alta | Usan el cliente web/PWA con diseño responsive. |
| Smart TV | No demostrado | Condicional | Probar navegador por familia antes de prometer compatibilidad. |
| Android TV/Google TV | No demostrado | Condicional | Validar navegador, mando, resolución y carga; no existe APK. |
| Apple TV/tvOS | No demostrado | Baja en primera fase | No asumir navegador Safari disponible en el dispositivo; requerir prueba específica. |
| Manifest común | Parcial | Alta | Consolidar `broadcast.round` y `eventFromRound` en un contrato único. |
| WebSocket/SSE | No implementado | Media | Mantener polling controlado inicialmente; evaluar SSE después de medir necesidad. |
| QR por evento | Implementado | Alta | Conservar QR firmado, estable, temporal y limitado a ronda abierta. |
| YouTube como distribución | Implementado parcialmente | Alta | Mantener iframe/adaptador; credenciales oficiales siguen pausadas. |
| OBS Browser Source | Preparado | Alta | Consumir el mismo manifest en un overlay sin autoridad de negocio. |
| Redes sociales | No implementado | Baja | Añadir solo después de consolidar el contrato y la política de publicación. |

## 3. Contrato exacto recomendado: `MjpTvManifest`

El contrato debe ser una **proyección pública inmutable para una lectura**, derivada del estado autoritativo del servidor. No sustituye `game_rounds`, `eventEngine`, `audit_events` ni el cálculo de premios. No recibe comandos del cliente.

```ts
export const MJP_TV_MANIFEST_VERSION = "mjp-tv-manifest-v1" as const;

export type MjpTvManifestStatus =
  | "SCHEDULED"
  | "PREPARING"
  | "OPEN"
  | "CLOSING"
  | "LOCKED"
  | "DRAWING"
  | "RESULT_PENDING"
  | "RESULT_VERIFIED"
  | "PUBLISHED"
  | "COMPLETED"
  | "CANCELLED"
  | "SUSPENDED"
  | "ERROR"
  | "RECOVERY";

export type MjpTvManifest = {
  schema: typeof MJP_TV_MANIFEST_VERSION;
  generatedAt: string;
  sequence: number;
  source: {
    system: "MJP_CORE";
    authoritative: true;
    broadcastId: string;
  };
  event: {
    eventId: string;
    eventType: "GAME_DRAW" | "ENTERTAINMENT";
    gameId: string;
    gameName: string;
    status: MjpTvManifestStatus;
    rulesVersion: string | null;
    scheduledStart: string | null;
    participationOpen: string | null;
    participationClose: string | null;
    executionStart: string | null;
    executionEnd: string | null;
  };
  participation: {
    allowed: boolean;
    confirmedCount: number;
    mode: "VIRTUAL_CREDITS";
    virtualOnly: true;
    creditsOnly: true;
    closeAt: string | null;
  };
  display: {
    title: string;
    subtitle: string;
    stateLabel: string;
    instructions: string;
    themeKey: string;
    locale: "es" | "en" | "it" | "fr" | "de" | "zh-CN";
  };
  countdown: {
    seconds: number | null;
    basedOn: "SERVER_CLOSE_AT" | "SERVER_EVENT_TIME" | "NONE";
  };
  qr: {
    available: boolean;
    imageDataUrl: string | null;
    targetUrl: string | null;
    roundId: string | null;
    expiresAt: string | null;
    signed: boolean;
    version: string | null;
  };
  result: {
    available: boolean;
    verified: boolean;
    value: unknown | null;
    verifyUrl: string | null;
  };
  avatar: {
    enabled: boolean;
    trigger: "NONE" | "EVENT_STARTED" | "EVENT_CLOSING" | "DRAW_STARTED" | "RESULT_VERIFIED" | "TRANSITION";
    scriptKey: string | null;
    text: string | null;
    audioUrl: string | null;
    renderer: "NONE" | "SCRIPT_ONLY" | "TTS" | "AVATAR_3D";
  };
  nextEvent: {
    available: boolean;
    eventId: string | null;
    gameId: string | null;
    gameName: string | null;
    scheduledStart: string | null;
    status: MjpTvManifestStatus | null;
  };
  recovery: {
    mode: "NORMAL" | "CONTINGENCY";
    lastConfirmedAt: string | null;
    lastConfirmedEventId: string | null;
    message: string | null;
  };
  verification: {
    public: boolean;
    url: string | null;
    evidenceHash: string | null;
  };
};
```

### 3.1 Reglas obligatorias del contrato

| Regla | Aplicación |
|---|---|
| Fuente única | `source.authoritative` siempre es `true`; el cliente solo representa. |
| No secretos | Nunca incluir semillas privadas, JWT, API keys, saldos individuales o PII. |
| No dinero real | `virtualOnly` y `creditsOnly` son constantes `true` en esta fase. |
| Estado verificable | `status` proviene del servidor, nunca del contador del navegador. |
| Countdown seguro | El cliente puede animar la cuenta, pero el cierre real se decide por servidor. |
| QR limitado | `available` solo puede ser `true` durante una ventana válida y abierta. |
| Resultado | Solo se muestra como verificado cuando existe evidencia pública. |
| Contingencia | Si no se confirma el servidor, se muestra el último estado identificado como confirmado. |
| Secuencia | `sequence` permite ignorar mensajes atrasados o repetidos. |
| Compatibilidad | `schema` permite evolucionar el manifest sin romper clientes anteriores. |
| Avatar subordinado | El avatar recibe datos; no puede producir comandos de dominio. |

### 3.2 Ejemplo de manifest OPEN

```json
{
  "schema": "mjp-tv-manifest-v1",
  "generatedAt": "2026-08-25T20:00:26.000Z",
  "sequence": 1842,
  "source": { "system": "MJP_CORE", "authoritative": true, "broadcastId": "MULTI-JUEGOS-PERU-TV" },
  "event": {
    "eventId": "R-L39-20260825-2000",
    "eventType": "GAME_DRAW",
    "gameId": "loteria_39",
    "gameName": "Lotería 39 MJP",
    "status": "OPEN",
    "rulesVersion": "loteria-39-v1.2.0",
    "scheduledStart": "2026-08-25T20:00:00.000Z",
    "participationOpen": "2026-08-25T20:00:00.000Z",
    "participationClose": "2026-08-25T20:02:00.000Z",
    "executionStart": "2026-08-25T20:02:00.000Z",
    "executionEnd": null
  },
  "participation": { "allowed": true, "confirmedCount": 142, "mode": "VIRTUAL_CREDITS", "virtualOnly": true, "creditsOnly": true, "closeAt": "2026-08-25T20:02:00.000Z" },
  "display": { "title": "Lotería 39", "subtitle": "Participa desde tu pantalla secundaria", "stateLabel": "EN VIVO", "instructions": "Escanea el QR y confirma con créditos virtuales", "themeKey": "lottery-gold", "locale": "es" },
  "countdown": { "seconds": 94, "basedOn": "SERVER_CLOSE_AT" },
  "qr": { "available": true, "imageDataUrl": null, "targetUrl": "https://mjp.example/juegos/loteria_39?round=R-L39-20260825-2000", "roundId": "R-L39-20260825-2000", "expiresAt": "2026-08-25T20:02:00.000Z", "signed": true, "version": "qr-round-v1" },
  "result": { "available": false, "verified": false, "value": null, "verifyUrl": null },
  "avatar": { "enabled": true, "trigger": "EVENT_STARTED", "scriptKey": "event_started", "text": "Comienza Lotería 39.", "audioUrl": null, "renderer": "SCRIPT_ONLY" },
  "nextEvent": { "available": false, "eventId": null, "gameId": null, "gameName": null, "scheduledStart": null, "status": null },
  "recovery": { "mode": "NORMAL", "lastConfirmedAt": "2026-08-25T20:00:26.000Z", "lastConfirmedEventId": "R-L39-20260825-2000", "message": null },
  "verification": { "public": true, "url": "/verificar?round=R-L39-20260825-2000", "evidenceHash": null }
}
```

El ejemplo es un contrato de diseño, no evidencia de una ronda real ni datos para sembrar en la base de datos.

## 4. Cómo deben consumirlo los clientes

```text
MJP Core / Round Engine
          ↓
   Event Projection
          ↓
   MjpTvManifest
   ┌──────┼──────────┬─────────┐
   TV   Overlay     PWA       Web
   │      │          │          │
   └──────┴──────┬───┴──────────┘
                  ↓
             Pantalla
```

El cliente debe solicitar el manifest mediante polling controlado en la primera fase. Una consulta cada cinco segundos es suficiente para demostración; más adelante se puede evaluar SSE si el retraso de actualización afecta la experiencia. No se recomienda introducir WebSocket o Redis solo por seguir el ejemplo del documento.

El navegador nunca debe aceptar desde la pantalla una orden para cerrar, sortear, pagar o cambiar reglas. La interacción del usuario se limita a navegación, selección y llamadas autorizadas al backend. El manifest se trata como datos de presentación.

## 5. Qué está implementado frente a lo que falta

| Elemento | Estado | Explicación |
|---|---|---|
| MJP Core como fuente de verdad | **IMPLEMENTADO** | Rondas, reglas, sorteos y liquidación virtual permanecen en servidor. |
| Event Engine | **IMPLEMENTADO PARCIAL** | Existe una proyección `eventFromRound` y estados explícitos, pero no un manifest TV unificado. |
| TV Client web | **IMPLEMENTADO** | `/tv` funciona como cliente web/PWA y muestra estado, QR, cuenta y contingencia. |
| Overlay OBS/browser | **IMPLEMENTADO** | `/overlay/:roundId` consume estado y QR. |
| Second Screen | **IMPLEMENTADO** | El QR lleva directamente al juego con `round` y contexto. |
| QR firmado | **IMPLEMENTADO** | Tiene HMAC, estabilidad por ronda, expiración y validación. |
| Sincronización común | **IMPLEMENTADO PARCIAL** | TV, overlay y PWA consultan proyecciones relacionadas; falta un único contrato. |
| `MjpTvManifest` | **DISEÑADO, NO IMPLEMENTADO** | Este documento define el contrato; aún no se conecta al código. |
| Smart TV real | **NO DEMOSTRADO** | Falta matriz y prueba con hardware/navegadores reales. |
| Android/Google TV | **NO DEMOSTRADO** | No existe APK ni prueba de dispositivo. |
| Apple TV | **NO DEMOSTRADO** | No debe asumirse navegador disponible. |
| YouTube | **BLOQUEADO** | Credenciales pausadas; no es fuente de verdad. |
| Avatar scripts | **IMPLEMENTADO** | Guiones deterministas subordinados al evento. |
| Avatar 3D/TTS | **NO IMPLEMENTADO** | Faltan proveedor, activos, derechos y pruebas. |
| Scheduler | **IMPLEMENTADO PARCIAL** | Genera propuesta por bloques y exige aprobación; no publica automáticamente. |
| Automation | **LIMITADO** | Autopilot/Watchdog y controles existen, pero no ejecutan todo el ciclo oficial. |
| Analítica de retorno | **IMPLEMENTADO PARCIAL** | Registra sesiones/retornos y pantalla secundaria para usuarios autenticados; requiere observación real. |
| RTP empírico completo | **FAIL** | La simulación de 50k aún no reproduce todas las reglas del backend. |

## 6. Guion de presentación ejecutiva

### Diapositiva 1 — La decisión arquitectónica

**Mensaje en pantalla:** “TV OS: una capa de presentación, no un sistema operativo”.

**Guion:** Multi Juegos Perú no necesita crear una aplicación diferente para cada fabricante como primera etapa. TV OS es el nombre de una abstracción: una pantalla web que interpreta el estado de un evento y lo representa con consistencia. La decisión reduce complejidad, pero no elimina la necesidad de probar dispositivos reales.

### Diapositiva 2 — El principio de fuente única

**Mensaje en pantalla:** “MJP decide; las pantallas representan”.

**Guion:** El núcleo del sistema conserva la autoridad sobre reglas, horarios, cierre, sorteo, premios y verificación. TV, overlay, web, PWA y pantalla secundaria reciben una proyección pública. YouTube es distribución; nunca debe ser el cerebro del sorteo.

### Diapositiva 3 — Qué es un evento

**Mensaje en pantalla:** “Juego = qué. Evento = cuándo y bajo qué reglas”.

**Guion:** Una modalidad como Lotería 39 define la mecánica. Una ronda concreta define la instancia: horario, ventana de participación, versión de reglas, QR, resultado y verificación. Esta separación permite reutilizar los juegos sin duplicar sus definiciones.

### Diapositiva 4 — El manifest unificado

**Mensaje en pantalla:** “Un contrato para todas las pantallas”.

**Guion:** Proponemos `MjpTvManifest`. Incluye identidad de evento, juego, estado, cuenta regresiva basada en servidor, participación virtual, QR firmado, resultado, verificación, contingencia, siguiente evento y guion contextual del avatar. El cliente no modifica estos datos; únicamente los muestra.

### Diapositiva 5 — Flujo TV + celular

**Mensaje en pantalla:** “Evento → TV → QR → celular → verificación”.

**Guion:** La TV presenta el evento activo. El espectador escanea el QR y llega directamente a la ronda correcta, sin buscar manualmente el juego. El teléfono funciona como segunda pantalla y control personal; la TV se mantiene como escenario público.

### Diapositiva 6 — Estado real del proyecto

**Mensaje en pantalla:** “Implementado no significa simplemente visible”.

**Guion:** Ya existen `/tv`, overlay, QR firmado, PWA, contingencia, Scheduler de propuesta, Event Store, Auditor Agent y analítica inicial. El manifest único todavía está diseñado, no conectado. La compatibilidad con Smart TV, Android TV, Google TV y Apple TV aún no está demostrada.

### Diapositiva 7 — Lo que no debemos afirmar todavía

**Mensaje en pantalla:** “Preparado no es certificado”.

**Guion:** No debemos afirmar que funciona en cualquier televisor, que YouTube está integrado automáticamente, que existe avatar 3D, que la automatización completa está activa o que el RTP empírico está reconciliado. El proyecto debe mantener estas distinciones para no confundir una demostración con una operación productiva.

### Diapositiva 8 — Siguientes pasos recomendados

**Mensaje en pantalla:** “Consolidar antes de expandir”.

**Guion:** La primera prioridad es conectar un manifest único sin duplicar la fuente de verdad. La segunda es ejecutar una matriz de compatibilidad en navegadores de TV, PC, tablet y celular. La tercera es completar la prueba de evento extremo a extremo y hacer que el simulador utilice exactamente el motor autoritativo. Avatar 3D, TTS, YouTube automático y aplicaciones nativas deben esperar.

## 7. Recomendación final

El documento 26 debe aprobarse como **arquitectura objetivo**, no como afirmación de que toda la compatibilidad ya está probada. La implementación más sólida consiste en crear `MjpTvManifest` como proyección versionada y pública, mantener polling controlado, conservar el QR firmado, probar navegadores reales y no crear aplicaciones nativas por plataforma hasta encontrar una limitación concreta.

La frase de producto recomendada es:

> **“Multi Juegos Perú usa una capa TV web/PWA que permite presentar el mismo evento verificable en distintas pantallas; la compatibilidad con cada plataforma se valida progresivamente.”**

La frase que debe evitarse es:

> **“Funciona en cualquier Smart TV, Apple TV, Android TV y Google TV”**, mientras no existan pruebas documentadas en esos dispositivos.

## 8. Decisiones pendientes del propietario

| Decisión | Por qué importa |
|---|---|
| Aprobar el contrato `MjpTvManifest` v1 | Define el contrato común antes de conectarlo al código. |
| Elegir si `nextEvent` será persistido o calculado | Afecta Scheduler y consistencia de programación. |
| Autorizar pruebas con dispositivos reales | Sin hardware no puede certificarse TV OS. |
| Definir política de latencia | Permite decidir entre polling, SSE o una solución posterior. |
| Mantener YouTube pausado o reactivarlo | Requiere credenciales y pruebas oficiales; no es necesario para MJP Core. |
| Definir política de retención de telemetría | Las métricas de pantalla secundaria deben tener límites y eliminación. |

## 9. Criterio de aceptación propuesto

Se considerará conectada la primera versión del manifest solo cuando exista un endpoint/procedimiento único que entregue `MjpTvManifest`, TV y overlay lo consuman, PWA pueda interpretar el mismo `eventId`, los estados avancen sin inventarse en el cliente, el QR corresponda a ese evento, la contingencia preserve el último estado confirmado, y existan pruebas de estado, versión, resultado, expiración y eventos fuera de orden.
