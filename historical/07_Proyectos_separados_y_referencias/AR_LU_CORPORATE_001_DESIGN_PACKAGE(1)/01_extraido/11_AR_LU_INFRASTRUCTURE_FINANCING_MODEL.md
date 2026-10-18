# AR-LU — Infrastructure Financing Model v1.0

> **Estado máximo:** análisis y diseño. No constituye asesoría legal, tributaria, contable, financiera ni societaria. No autoriza gastos, transferencias, constitución de empresas, postulaciones, firmas, registros, contactos institucionales ni cambios en ARKI o LUCA.
>
> **Evidencia:** cada afirmación se clasifica, cuando corresponde, como `OFFICIAL_SOURCE`, `PRODUCT_OWNER_INPUT`, `DOCUMENT_EVIDENCE`, `PROPOSAL`, `INFERENCE`, `UNKNOWN` o `REQUIRES_PROFESSIONAL_VALIDATION`.


## Decisión de diseño

No se aprueba comprar vivienda, construir data center ni comprar hardware. Primero se comparan alternativas frente a cuellos de botella demostrados.

## Alternativas

A. infraestructura existente; B. workstation/cluster incremental; C. colocación; D. cloud; E. hybrid cloud; F. oficina técnica; G. private server room; H. futuro data center propio.

## Criterios

CAPEX, OPEX, potencia, cooling, UPS, protección contra incendios, redundancia de red, seguridad, mantenimiento, utilización, escalabilidad, riesgo de falla y costo por unidad de cómputo.

## Método

Cada alternativa debe modelar capacidad, utilización, costo total de propiedad, crecimiento, recuperación ante fallos, latencia, privacidad, licencias, personal y plazo. El costo por GPU no equivale al costo por resultado; deben medirse cargas reales.

## Gate de compra

`NEED_IDENTIFIED → OPTIONS_COMPARED → BUSINESS_CASE → HUMAN_APPROVAL → PROCUREMENT`. Este mandato no ejecuta las dos últimas etapas.
## Firewalls permanentes

ARKI y LUCA permanecen como sistemas independientes. AR-LU es sólo una hipótesis de paraguas corporativo. La infraestructura compartida futura no compartirá autoridad semántica. Ningún cálculo se transforma automáticamente en decisión, ningún borrador se transforma en envío y ningún resultado documental se presenta como capacidad verificada sin evidencia.


## Referencias

[1]: https://www.gob.pe/4359-programa-nacional-de-innovacion-y-desarrollo-productivo-proinnovate-que-hacemos "ProInnóvate — Qué hacemos"
[2]: https://www.gob.pe/54499-programa-nacional-de-innovacion-y-desarrollo-productivo-proinnovate-nuestros-fondos "ProInnóvate — Nuestros fondos"
[3]: https://prociencia.gob.pe/calendario-de-concursos/ "PROCIENCIA — Calendario de concursos"
[4]: https://www.gob.pe/institucion/concytec/noticias/1333254-concytec-abrira-mas-de-s-70-millones-en-fondos-concursables-para-ciencia-e-innovacion-en-2026 "CONCYTEC — Fondos 2026"
[5]: https://www.gob.pe/institucion/produce/noticias/1343582-produce-destinara-s-170-millones-para-impulsar-la-innovacion-tecnologica-y-el-desarrollo-productivo-en-2026 "PRODUCE — Innovación y desarrollo productivo 2026"
[6]: https://www.cap.org.pe/ "Colegio de Arquitectos del Perú"
[7]: https://www.cip.org.pe/leyes/ "Colegio de Ingenieros del Perú — Leyes profesionales"
[8]: https://www.cip.org.pe/formato-certificado-de-habilidad/ "CIP — Certificado de habilidad"
[9]: https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ley_29090.pdf "Ley 29090 — Habilitaciones urbanas y edificaciones"
[10]: https://www.gob.pe/firmadigital "Gob.pe — Firma digital"
[11]: https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios "SUNAT — Regímenes tributarios"
[12]: https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimen-mype-tributario "SUNAT — Régimen MYPE Tributario"
[13]: https://orientacion.sunat.gob.pe/3053-concepto-tasa-y-operaciones-gravadas-igv-empresas "SUNAT — IGV"
[14]: https://www.sunat.gob.pe/legislacion/igv/ley/capitul6.htm "SUNAT — Crédito fiscal del IGV"
[15]: https://www.sunat.gob.pe/orientacion/cronogramas/2026/cObligacionMensual2026.html "SUNAT — Cronograma 2026"
[16]: https://www.comunidadandina.org/StaticFiles/DocOf/DEC486.pdf "Comunidad Andina — Decisión 486"
[17]: https://busquedas.elperuano.pe/dispositivo/NL/218542-6 "Decreto Legislativo 1044 — Competencia desleal"
[18]: https://www.gob.pe/institucion/indecopi/noticias/906591-el-indecopi-habilita-servicio-para-que-creadores-de-software-registren-sus-programas-a-traves-de-la-plataforma-de-registro-virtual-de-obras "INDECOPI — Registro de software"
[19]: https://www.gob.pe/83358-registrar-una-obra-en-el-indecopi "INDECOPI — Registrar una obra"
