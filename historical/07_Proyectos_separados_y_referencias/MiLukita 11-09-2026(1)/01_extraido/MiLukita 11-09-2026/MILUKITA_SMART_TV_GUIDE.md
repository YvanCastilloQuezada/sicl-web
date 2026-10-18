# MiLukita — Guía Smart TV y estado de implementación

## Alcance

La experiencia TV de MiLukita funciona como una aplicación web/PWA que puede abrirse en un navegador de Smart TV, Android TV, Google TV, computadora, tablet o celular. La pantalla TV presenta la emisión, el estado unificado de `MjpTvManifest`, el QR y contenido de acompañamiento; el celular puede abrir la ronda mediante el QR autoritativo. El piloto continúa limitado a créditos virtuales, sin cobros ni retiros.

## Funciones implementadas

| Área | Estado | Evidencia |
|---|---|---|
| Selector inicial “Ver transmisión en vivo / Ver en línea” | Implementado | `/tv`, `TvModeStartScreen.tsx` |
| Botón Salir al portal | Implementado | `TvModeStartScreen.tsx`, `BroadcastPage.tsx` |
| Navegación por flechas y Enter/OK | Implementado en la interfaz | `useTvRemoteNavigation.ts` |
| Volver/Escape y tecla Info | Implementado en la interfaz | `useTvRemoteNavigation.ts` |
| Foco visible de alto contraste | Implementado | `client/src/index.css` |
| QR del evento basado en manifest | Implementado | `MiLukitaCircularQR.tsx`, `BroadcastPage.tsx` |
| QR de acceso directo a `/tv` | Implementado | `TVBrandGuide.tsx` |
| Guía por marca | Implementado | `TVBrandGuide.tsx` |
| Orientación adaptable y acceso rápido TV en PWA | Implementado | `manifest.webmanifest` |
| Prueba física en modelos concretos | Pendiente | Requiere hardware y matriz QA |

## Guía rápida

En Samsung Tizen, LG webOS, Google TV, Android TV o Fire TV se debe abrir el navegador disponible, escribir la URL de MiLukita TV o escanear el QR mostrado en la guía, y guardar la página como favorito. En Apple TV, el flujo recomendado es abrir `/tv` en iPhone, iPad o Mac y usar AirPlay cuando el equipo y la red sean compatibles.

La navegación de la pantalla inicial admite flechas direccionales, OK/Enter, Volver/Escape e Info. El foco visible no altera la autoridad del servidor: únicamente ayuda a seleccionar controles de interfaz.

## Límites y no afirmaciones

La configuración PWA mejora la experiencia cuando el navegador admite instalación y orientación; no implica que todos los sistemas Smart TV permitan instalar PWAs ni que exista una aplicación nativa para Samsung, LG, Apple TV, Fire TV o Android TV. La compatibilidad definitiva debe certificarse en equipos físicos concretos, versiones de firmware concretas, resolución, distancia de lectura, mando y condiciones de red.

El QR directo abre `/tv?mode=online` en el dispositivo que lo escanea. El QR de una ronda continúa siendo el QR firmado y autoritativo proyectado por `MjpTvManifest`; el QR de guía no reemplaza ese contrato.

## Próxima validación

La siguiente actividad recomendada es ejecutar una matriz física con al menos un equipo Samsung Tizen, un LG webOS, un Google/Android TV, una tablet y un celular. Deben verificarse foco, retorno, selección, legibilidad a 2–5 metros, escaneo QR, reconexión, contingencia y ausencia de scroll horizontal. Hasta completar esa matriz, el estado correcto es **implementado en código y validado localmente**, no certificado universalmente.
