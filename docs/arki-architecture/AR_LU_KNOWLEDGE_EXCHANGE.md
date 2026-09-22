# AR-LU — intercambio de conocimiento

## Objetivo

Los libros y registros aprobados en LUCA pueden interesar a ARKI, especialmente en GIS, georreferenciación, arquitectura, paisajismo, urbanismo, BIM y visión artificial. Del mismo modo, los registros de arquitectura, paisajismo, turismo y representación espacial de ARKI pueden enriquecer a LUCA.

## Flujo

1. El documento se carga en el repositorio de conocimiento de su producto.
2. Se registra en Delta 6.2 como `STAGED`, con archivo, commit, provenance y derechos.
3. La revisión humana aprueba, rechaza o congela el registro.
4. Un registro `VALIDATED`, `CANONICAL` o `FROZEN` genera una notificación AR-LU y un paquete candidato para el producto interesado.
5. El destino valida el paquete y lo conserva como candidato; no se convierte automáticamente en verdad canónica.
6. Si existe desacuerdo, el registro pasa a cuarentena o `REVOKE_PENDING_REVIEW`; no se borra automáticamente del otro producto.

## Clasificación inicial

| Dominio | Destino |
|---|---|
| GIS, geoespacial, arquitectura, paisajismo, urbanismo, BIM, visión y dispositivos | ARKI y/o LUCA según el contenido |
| Costos, predimensionamiento y coordinación BIM | Principalmente ARKI |
| Turismo, lugares, rutas, patrimonio y marketing espacial | Principalmente LUCA |

## Regla de desacuerdo

La eliminación automática de libros o registros sería peligrosa porque podría destruir provenance, evidencias o conocimiento aprobado. Por eso el sistema conserva el original, aísla la copia discutida y solicita revisión. El propietario puede después mantener, corregir, rechazar o revocar explícitamente.

## Estado de implementación

Está implementado el contrato común `AR-LU-KNOWLEDGE-EXCHANGE-1.0`, la clasificación de interés, las notificaciones, la validación de provenance, la exigencia de aprobación y la cuarentena segura. La detección automática de una nueva carga entre repositorios requiere todavía un canal operativo: webhook de GitHub o un proceso periódico en el servidor Ubuntu/WebDev. Sin ese canal no se afirma que ARKI pueda observar por sí solo una carga futura en LUCA.
