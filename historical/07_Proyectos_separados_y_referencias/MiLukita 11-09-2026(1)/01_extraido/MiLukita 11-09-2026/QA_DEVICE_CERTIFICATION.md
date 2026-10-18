# Matriz de QA físico — MiLukita

**Fecha:** 26 de agosto de 2026  
**Estado:** protocolo preparado; certificación física pendiente

## Alcance

Esta matriz cubre la ruta Home → TV en línea → sesión → QR/URL → celular → acción → resultado, además de instalación PWA, cambio de modo, pérdida de conexión, reconexión, exportación PNG y accesibilidad básica.

| Plataforma | Evidencia disponible | Resultado actual | Pendiente |
|---|---|---|---|
| Chrome/Edge escritorio | Revisión local y screenshots | Aprobado visualmente | Prueba pública con red variable |
| Móvil responsive 390×844 | Screenshot del viewport | Aprobado visualmente | iOS/Android físicos |
| Safari iOS físico | No disponible en el entorno | No verificable | Escaneo QR, PWA, audio, exportación y reconexión |
| Android TV físico | No disponible en el entorno | No verificable | Navegación con control remoto, video, QR y legibilidad |
| Google TV físico | No disponible en el entorno | No verificable | Misma matriz de Android TV |
| Tablet físico | No disponible | No verificable | Orientación, teclado táctil y viewport |

## Criterios de aprobación

La prueba solo se considera aprobada si el participante puede entrar a una sesión, ver el estado correcto, enviar una acción dentro de la ventana, recibir respuesta, reconectarse sin duplicar puntos, salir y volver a entrar sin quedar bloqueado. Para TV se debe registrar modelo, sistema operativo, navegador, resolución, versión de firmware, fecha, red y evidencia visual.

## Limitación

Las revisiones de viewport y los navegadores disponibles en el sandbox **no sustituyen** Safari iOS físico ni Android TV físico. No se debe declarar certificación de hardware hasta ejecutar esta matriz con equipos reales.
