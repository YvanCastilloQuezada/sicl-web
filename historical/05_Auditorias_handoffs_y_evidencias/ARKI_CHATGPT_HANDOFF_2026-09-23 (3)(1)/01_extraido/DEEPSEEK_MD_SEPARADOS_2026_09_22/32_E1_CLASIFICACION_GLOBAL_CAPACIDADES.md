# E1.4 — Clasificación global de capacidades

Se aplica una sola etiqueta por capacidad.

| Etiqueta | Significado | Regla de evidencia |
|---|---|---|
| IMPLEMENTED | Existe código funcional | Falta E2E |
| VERIFIED | Código, prueba y output real | Debe conservarse el output |
| E2E VERIFIED | Cadena completa desde UI hasta dominio, persistencia o exportación | Requiere prueba integral |
| PARTIAL | Solo una parte está funcional | Brecha visible y registrada |
| CONCEPTUAL | Diseño o modelo sin implementación completa | No se presenta como capacidad terminada |
| CATALOGED | Está definido en catálogo | No implica motor |
| SCHEMA_DEFINED | Existe contrato de datos | No implica ejecución |
| NOT IMPLEMENTED | No existe | Debe tener plan o decisión |
| FUTURE | Registrado como futuro | No bloquea si el PO lo acepta |
| BLOCKED | Depende de recurso externo | Fail-closed obligatorio |
| PRODUCT OWNER DECISION REQUIRED | Falta una decisión material | No se implementa por suposición |

La capacidad mínima muro–abertura–puerta queda `VERIFIED` en dominio y prueba, pero su evidencia visual tiene tres estados distintos y no se promociona a E2E VERIFIED.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards" 
