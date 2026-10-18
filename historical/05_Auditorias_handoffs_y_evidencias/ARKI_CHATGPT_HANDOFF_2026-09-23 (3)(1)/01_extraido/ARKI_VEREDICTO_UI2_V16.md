# ARKI — Veredicto UI-2 v1.6

**Estado:** APPROVE WITH EVIDENCE  
**Alcance:** taxonomía canónica final y matriz de visibilidad.

## Resultado

La lista final de 16 módulos quedó aplicada: Data, Biblioteca, Proyectos, Generador, Modelo BIM, Planta, Corte, 3D, Metrados, PRESUP-5D, GASTOS, 4D, Clashes, EXP-TEC, O-M y ADM. SILC no existe como página independiente; su responsabilidad queda absorbida por Modelo BIM.

La verificación real confirmó la matriz solicitada: visitante 2, usuario 14, especialista 15 y corporativo 16. GASTOS, O-M y ADM aparecen en perfiles no visitantes, pero están desactivados y muestran tooltip cuando su estado todavía es no disponible o futuro.

Se ejecutaron **17 outputs reales**, todos con resultado satisfactorio, y se recopilaron **8 capturas** de evidencia. El paquete ZIP pasó `unzip -tq` y su SHA-256 es `74170fab16091067bbd4ef1c3fa68003c518e2828776659eac28a431625d55eb`.

## Riesgos y limitaciones

La matriz de acceso sigue siendo local y no constituye autenticación de producción. Los módulos GASTOS, O-M y ADM tienen taxonomía, visibilidad y estados explícitos, pero su dominio completo aún no está implementado. La traducción utiliza fallback para claves nuevas en idiomas distintos de español e inglés. UI-3 permanece bloqueada hasta la decisión posterior del Product Owner.

## Decisión

**APPROVE WITH EVIDENCE.** UI-2 v1.6 puede considerarse cerrada dentro del alcance de taxonomía, visibilidad y renombres. No se promueven como implementados los dominios que permanecen `NOT AVAILABLE`, `FUTURE REFERENCE` o `PARTIAL`.
