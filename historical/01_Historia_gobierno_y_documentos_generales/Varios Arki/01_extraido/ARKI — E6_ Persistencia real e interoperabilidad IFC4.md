# ARKI — E6: Persistencia real e interoperabilidad IFC4

**Fecha:** 23 de septiembre de 2026  
**Estado:** **PARTIAL — implementación y validación automatizada en verde; cierre formal pendiente**

## Veredicto técnico provisional

E6 no se declara `VERIFIED`. El Bloque A tiene contratos formales de persistencia, stores IndexedDB versionados, gate de snapshot, auditoría encadenada y funciones de restauración. El Bloque B tiene exporter IFC4 semántico, parser textual gobernado, adaptador real `web-ifc`/WASM, GlobalId determinista, lossReport y tres fixtures IFC4 menores de 5 MB.

La validación automatizada ejecutada en esta entrega terminó con `exit code 0`: `pnpm check`, `pnpm build`, pruebas formales de persistencia, identidad, exportación IFC4, fixtures, parser web-ifc y regresión del motor constructivo y SceneModel.

## Evidencia confirmada

- Baseline previo a E6: verde.
- Contratos `Session`, `Project`, `Version`, `Snapshot` y `AuditEntry` añadidos.
- IndexedDB migrado a versión 2 con stores separados.
- Gate formal y verificación de cadena de auditoría probados con datos deterministas.
- GlobalId determinista probado sin `Math.random()` ni `Date.now()`.
- Exportación IFC4 y parseo textual: 28 entidades preservadas en fixture de prueba.
- Parser `web-ifc` real: `schema=IFC4`, fixture abierto correctamente, 29 entidades leídas.
- Tres fixtures IFC4 generados y registrados con SHA-256.
- Panel de carga IFC4 y exportación desde el visor integrado.

## Razones por las que sigue PARTIAL

1. No se han producido las seis capturas obligatorias con hash.
2. La restauración después de cerrar y reabrir una pestaña necesita evidencia de navegador, no sólo contrato y prueba estática.
3. La restauración de viewpoints todavía no está persistida en IndexedDB como entidad formal.
4. El exporter IFC4 actual es semántico mínimo y no representa todavía geometría IFC completa, relaciones espaciales ni materiales ricos.
5. El round-trip de fixtures está validado por identidad/entidades en el adaptador actual, pero requiere lossReport completo por geometría y propiedades para promoción.
6. El adaptador remoto continúa siendo una capacidad contractual, no un servidor productivo.

## Alcance no autorizado en E6

DXF, RVT/RFA, multiusuario en vivo, persistencia server-side productiva, firma digital profesional y gate de apto para construcción permanecen fuera de esta entrega.

## Estado siguiente

E6 queda abierto en estado `PARTIAL`. E7 continúa bloqueado. La próxima iteración de E6 debe completar la evidencia de navegador, persistencia formal de viewpoints, geometría/relaciones IFC y lossReport antes de solicitar veredicto final.
