# AR-LU Corporate Competency Audit — v0.1


> **Estado:** diseño/prototipo documental. No constituye asesoría legal, tributaria, contable, financiera ni regulatoria. No autoriza pagos, postulaciones, firmas, registros ni comunicaciones externas.

> **Principio de gobernanza:** CREAR ≠ PUBLICAR · PROPONER ≠ PAGAR · CALCULAR ≠ DECLARAR · SOFTWARE INTERNO ≠ INFORMACIÓN PÚBLICA.


## Objetivo

Auditar agentes y capacidades existentes en ARKI y LUCA antes de crear nuevas competencias corporativas. El resultado inicial es un diseño de auditoría, no una autorización para crear agentes.

## Taxonomía

`REUSE_AS_IS`, `EXTEND`, `CONSOLIDATE`, `DUPLICATE_CANDIDATE`, `MISSING`, `CONTRACT_ONLY`, `NOT_DEMONSTRATED`, `HUMAN_ONLY`.

## Matriz inicial

| Competencia | Evidencia observada | Estado | Decisión inicial |
|---|---|---|---|
| Legal Counsel | políticas, contratos y límites documentales | parcial/documental | auditar antes de crear |
| Corporate Finance | presupuesto, costos y fund-related docs | parcial | consolidar en ledger corporativo |
| Accounting & Tax | no se demostró motor tributario productivo | NOT_DEMONSTRATED | diseñar controles, no agente autónomo |
| Economics & Strategy | capacidades de análisis y propuestas | parcial | reutilizar vistas, no duplicar agente |
| Administration/Controller | contratos y workspaces conceptuales | parcial | diseñar ledger y aprobaciones |
| Human Authority | presente como principio de gobernanza | HUMAN_ONLY | no automatizar |

## Regla de arquitectura

`ONE AR-LU CORPORATE INTELLIGENCE · MANY COMPETENCIES · ONE LEDGER · HUMAN AUTHORITY`. Las competencias pueden ser módulos o vistas especializadas, pero deben compartir un registro de decisiones, provenance y límites. No pueden firmar, pagar, declarar impuestos ni sustituir a profesionales habilitados.

## Auditoría requerida

Para cada agente se debe registrar ubicación, capacidades, permisos, datos, herramientas, mutaciones, publicación, duplicaciones, tests, estado y límites. Un contrato documental no se clasifica como implementación.

## Referencias

[1]: https://www.gob.pe/4359-programa-nacional-de-innovacion-y-desarrollo-productivo-proinnovate-que-hacemos "ProInnóvate — Qué hacemos"
[2]: https://www.gob.pe/54499-programa-nacional-de-innovacion-y-desarrollo-productivo-proinnovate-nuestros-fondos "ProInnóvate — Nuestros fondos"
[3]: https://prociencia.gob.pe/calendario-de-concursos/ "PROCIENCIA — Calendario de concursos"
[4]: https://www.gob.pe/institucion/concytec/noticias/1333254-concytec-abrira-mas-de-s-70-millones-en-fondos-concursables-para-ciencia-e-innovacion-en-2026 "CONCYTEC — Fondos concursables 2026"
[5]: https://repositorio.cap.org.pe/documento/305/ "CAP — Ley 14085"
[6]: https://repositorio.cap.org.pe/documento/307/ "CAP — Ley 16053"
[7]: https://repositorio.cap.org.pe/documento/309/ "CAP — Ley 28966"
[8]: https://www.cip.org.pe/leyes/ "CIP — Leyes profesionales"
[9]: https://www.cip.org.pe/formato-certificado-de-habilidad/ "CIP — Certificado de habilidad"
[10]: https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ley_29090.pdf "Ley 29090 — Habilitaciones urbanas y edificaciones"
[11]: https://www.gob.pe/firmadigital "Gob.pe — Firma digital"
[12]: https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios "SUNAT — Regímenes tributarios"
[13]: https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimen-mype-tributario "SUNAT — Régimen MYPE Tributario"
[14]: https://orientacion.sunat.gob.pe/3053-concepto-tasa-y-operaciones-gravadas-igv-empresas "SUNAT — IGV"
[15]: https://www.sunat.gob.pe/legislacion/igv/ley/capitul6.htm "SUNAT — Crédito fiscal del IGV"
[16]: https://www.sunat.gob.pe/orientacion/cronogramas/2026/cObligacionMensual2026.html "SUNAT — Cronograma 2026"
[17]: https://www.comunidadandina.org/StaticFiles/DocOf/DEC486.pdf "Comunidad Andina — Decisión 486"
[18]: https://busquedas.elperuano.pe/dispositivo/NL/218542-6 "Decreto Legislativo 1044 — Competencia desleal"
[19]: https://www.gob.pe/institucion/indecopi/noticias/906591-el-indecopi-habilita-servicio-para-que-creadores-de-software-registren-sus-programas-a-traves-de-la-plataforma-de-registro-virtual-de-obras "INDECOPI — Registro de software"
[20]: https://www.gob.pe/83358-registrar-una-obra-en-el-indecopi "INDECOPI — Registrar una obra"
