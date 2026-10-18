# AR-LU Funding Center — Especificación v0.1


> **Estado:** diseño/prototipo documental. No constituye asesoría legal, tributaria, contable, financiera ni regulatoria. No autoriza pagos, postulaciones, firmas, registros ni comunicaciones externas.

> **Principio de gobernanza:** CREAR ≠ PUBLICAR · PROPONER ≠ PAGAR · CALCULAR ≠ DECLARAR · SOFTWARE INTERNO ≠ INFORMACIÓN PÚBLICA.


## Propósito

El Funding Center será un espacio interno para preparar convocatorias y evaluar su viabilidad. Su primera familia de fuentes será ProInnóvate, con arquitectura extensible a PROCIENCIA/CONCYTEC y otras convocatorias. ProInnóvate declara que impulsa innovación, emprendimiento innovador y desarrollo tecnológico/productivo mediante concursos; esa descripción institucional no determina la elegibilidad de un proyecto concreto [1].

## Flujo gobernado

```text
SOURCE → CALL → ELIGIBILITY → REQUIREMENTS → EVIDENCE → FORMULATION
→ BUDGET → REVIEW → SUBMISSION_READINESS → HUMAN_AUTHORIZATION
```

El sistema nunca debe pasar de `SUBMISSION_READINESS` a envío automáticamente.

## Entidad Convocatoria

Debe conservar entidad convocante, concurso, objetivo, periodo, monto, cofinanciamiento, TRL si aplica, gastos elegibles, restricciones, incompatibilidades, requisitos, documentos, criterios de evaluación, deadline, estado, fuente oficial, fecha de consulta y versión de bases. Cada campo debe admitir `UNKNOWN`.

## Eligibility Engine

El resultado será `ELIGIBLE`, `POTENTIALLY_ELIGIBLE`, `NOT_ELIGIBLE` o `UNKNOWN`. Cada resultado deberá incluir reglas evaluadas, evidencia, fuente, fecha, supuestos, campos faltantes y responsable de revisión. La ausencia de bases o de datos del postulante produce `UNKNOWN`, nunca elegibilidad implícita.

## Disclosure firewall

Cada contenido se clasifica como `PUBLIC_DISCLOSURE`, `CONFIDENTIAL_APPLICATION_DISCLOSURE` o `INTERNAL_TRADE_SECRET`. El sistema debe comparar la clasificación con la obligación de declarar información. La protección no permite omitir información obligatoria ni presentar afirmaciones falsas.

## Reglas de cierre

No se registra convocatoria como abierta sin fuente oficial y fecha. No se calcula presupuesto elegible sin bases. No se genera una afirmación de TRL sin metodología y evidencia aplicable. No se presenta ninguna postulación sin autorización humana explícita.

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
