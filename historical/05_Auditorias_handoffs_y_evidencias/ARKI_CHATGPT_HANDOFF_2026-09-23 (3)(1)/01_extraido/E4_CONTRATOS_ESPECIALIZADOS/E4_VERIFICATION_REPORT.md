# E4 — Informe de verificación

## Veredicto técnico

**E4 preparado para revisión del Product Owner — APPROVE WITH FIXES provisional.**

Se definieron esquemas comunes, reglas de escaleras y ascensores, contratos de gases medicinales y seguridad, gobierno de especialistas y diez casos de prueba especializados.

## Evidencia

`pnpm check` terminó con `exit=0`. `pnpm build` terminó con `exit=0`. Las pruebas constructiva, profesional, dossier técnico, serialización, coherencia de muro, muro-puerta-canvas y selección BIM terminaron con `exit=0`.

Estos outputs son regresión del producto actual. Los casos E4-T01–E4-T10 son criterios de aceptación documentados y todavía no son pruebas ejecutadas de los nuevos contratos.

## Estado

| Criterio | Resultado |
|---|---|
| Esquema común | SCHEMA_DEFINED |
| Escaleras y ascensores | SCHEMA_DEFINED |
| Gases, seguridad y MEP | SCHEMA_DEFINED |
| Gobierno de especialistas | CONTRACT_DEFINED |
| Pruebas especializadas | SPECIFIED, no ejecutadas |
| Código de producto nuevo | No |
| Regresión | PASS |
| E5 | DEFER hasta aprobación de E4 |

## Límites

E4 no declara cálculos estructurales, hidráulicos, eléctricos, térmicos, de gases, incendio o seguridad. Tampoco emite firma profesional. La ejecución de motores y fixtures queda asignada a E7 u otra entrega autorizada.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
