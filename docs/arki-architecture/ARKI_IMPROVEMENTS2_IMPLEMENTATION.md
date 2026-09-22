# ARKI — Implementación de Mejoras 2

## Implementado

Se incorporó un motor TypeScript determinista de validación normativa con **54 reglas de referencia RNE Perú** extraídas del documento `00000Mejoras2.docx`. Cada regla conserva identificador, dominio, variable, umbral, unidad, referencia legal, procedencia y estado `REFERENCE_SEED`. La validación distingue `PASS`, `FAIL` y `UNKNOWN`; la ausencia de evidencia nunca se interpreta como cumplimiento.

Se añadió un contrato de gobernanza para separar el grafo first-party, hosts externos, sandbox staging y marketplace congelado. El sandbox y el marketplace permanecen **cerrados** porque el documento exige Docker/gVisor, seccomp validado, aislamiento de red, pentest y pruebas de escape que no pueden afirmarse en este entorno.

## Integración

El endpoint protegido `parametricRuntime.validateNormative` permite validar hechos del Project State sin mutarlo ni promover resultados al Core. La respuesta exige revisión humana y reporta referencias legales para que un profesional pueda contrastarlas con la versión oficial vigente.

## No se afirma

No se afirma que estas reglas constituyan una certificación legal, una revisión normativa vigente ni una firma profesional. Tampoco se habilita ejecución arbitraria de Python, Docker socket, marketplace, publicación o mutación canónica automática.

## Gates pendientes

Para activar sandbox/marketplace se requiere un host separado autorizado, runtime de aislamiento real (gVisor/Kata/Firecracker), seccomp probado, red aislada, límites de recursos, escaneo de dependencias, pentest externo, revisión de licencias y aprobación humana.
