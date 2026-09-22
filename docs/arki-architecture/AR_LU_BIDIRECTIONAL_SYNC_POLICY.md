# AR-LU: política de sincronización bidireccional

## Decisión

La autorización del propietario se implementa como **sincronización federada gobernada**, no como copia indiscriminada. ARKI y LUCA pueden proponer y propagar mejoras en ambas direcciones, pero cada cambio se clasifica antes de entrar al repositorio destino.

## Tres carriles

| Carril | Contenido | Comportamiento |
|---|---|---|
| `AUTO_SYNC` | Contratos compartidos explícitos, documentación AR-LU, catálogos y formatos | Puede propagarse después de commit de origen, pruebas destino, provenance y checkpoint |
| `MIRROR_WITH_REVIEW` | Código de servidor/cliente, seguridad, routers, esquema, adaptadores y cambios de comportamiento | Se prepara como handoff y requiere revisión del propietario o responsable autorizado |
| `NEVER_SYNC` | Secretos, credenciales, tokens, datos productivos, snapshots de Core, Project State, wallet, ledger, RNG, RTP, juegos y componentes financieros | Se bloquea siempre, incluso con autorización general |

## Mejoras propuestas

La sincronización usa cuatro protecciones adicionales: contrato explícito de archivos compartibles, pruebas en el destino antes de aplicar, provenance con commit y ruta de origen, y checkpoint reversible. También se conserva un rollback point por transferencia y se impide que una sincronización cambie el Core canónico o publique contenido.

La política funciona en ambas direcciones: `ARKI_TO_LUCA` y `LUCA_TO_ARKI`. Un componente parecido no se considera automáticamente equivalente: debe coincidir con el contrato compartido y superar las pruebas. Las capacidades específicas de producto permanecen en su repositorio.

## Qué queda actualizado ahora

Se propagó a ambos repositorios el contrato `AR-LU-FEDERATED-SYNC-1.0`, sus invariantes y las pruebas. El catálogo de telemetría, proveedores y registros AR-LU queda clasificado como compartible. La sincronización permanente mediante webhook o GitHub Actions queda preparada conceptualmente, pero requiere configurar credenciales de repositorio y un host de ejecución; no se inventan secretos ni se habilita una fusión automática de código sensible.

## Registro mínimo de cada transferencia

Cada handoff debe guardar dirección, commit de origen, rutas, clasificación, pruebas destino, provenance, checkpoint de rollback, actor y resultado. Si falla una prueba, hay un secreto, o aparece Core/Project State, la transferencia se bloquea y se conserva evidencia.
