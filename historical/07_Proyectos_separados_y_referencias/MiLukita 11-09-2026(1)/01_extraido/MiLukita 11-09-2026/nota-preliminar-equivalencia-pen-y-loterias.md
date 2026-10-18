# Nota preliminar — créditos virtuales, referencia PEN y loterías múltiples

**Estado:** análisis previo; no habilita dinero real, equivalencias cobrables, retiros ni precios en soles.

## Referencia interna segura

El piloto puede guardar una **escala de referencia contable** de `1 crédito virtual = 1 unidad de referencia PEN` únicamente para pruebas de migración, conciliación y diseño de tablas. Debe conservar simultáneamente los marcadores `virtualOnly: true`, `redeemable: false`, `cashValue: 0` y `migrationRequiresLegalApproval: true`. La interfaz pública debe seguir usando exclusivamente “créditos virtuales” y mostrar que no son dinero ni generan un derecho de conversión futura.

> Una eventual migración a soles no debe convertir saldos, boletos ni premios del piloto por defecto. Requerirá un producto autorizado distinto, aceptación expresa del usuario, tratamiento legal/tributario, certificación técnica, medios de pago y reglas publicadas para la modalidad de dinero real.

## Contraste de la propuesta adjunta

Para una selección de seis números, la probabilidad exacta de `k` aciertos es `C(6,k) × C(N−6,6−k) / C(N,6)`. Con esa fórmula, las tablas adjuntas no producen los RTP declarados: los pagos propuestos exceden el 100 % en los cuatro casos.

| Variante propuesta | Precio virtual | RTP declarado en el adjunto | RTP exacto recalculado | Estado de la tabla |
|---|---:|---:|---:|---|
| 6/29 | 10 créditos | 87,12 % | **105,97 %** | No publicable sin recalibrar |
| 6/39 | 6 créditos | 88,16 % | **102,61 %** | No publicable sin recalibrar |
| 6/49 | 4 créditos | 78,75 % | **117,19 %** | No publicable sin recalibrar |
| 6/59 | 2 créditos | 29,80 % | **182,16 %** | No publicable sin recalibrar |

Por ejemplo, en 6/29 la probabilidad exacta de cinco aciertos es aproximadamente **0,02905 %**, no 0,005262 %; y la de tres aciertos es **7,4565 %**, no 4,735 %. Esta diferencia explica la desviación de RTP. El comando reproducible `pnpm analyze:lotteries` calcula cada contribución antes de que se codifique una regla.

## Referencia regulatoria

La documentación oficial consultada exige, para homologar una modalidad futura, declarar los porcentajes teóricos mínimo y máximo de retorno cuando correspondan, describir las reglas y aportar certificación de un laboratorio autorizado. El formato de certificado exige además contrastar el PRT con límites estadísticos de simulación o con el modelo matemático analítico. Las fuentes revisadas no sustentan, por sí solas, una regla general de “RTP mínimo 85 %” aplicable a todas las loterías; esa cifra debe verificarse con asesoría regulatoria específica antes de declararse como requisito MINCETUR. [1] [2]

## Decisión pendiente del usuario

Antes de implementar variantes, se requiere confirmar si el siguiente alcance es solo la **capa contable de referencia PEN** o si incluye cuatro modalidades nuevas. Para las modalidades nuevas, primero se deben aprobar tablas recalibradas que mantengan el RTP objetivo y no superen el 100 %, junto con su tratamiento como pilotos exclusivamente virtuales.

## Referencias

[1]: [MINCETUR — Autorización y homologación de modalidades de juego](https://www.gob.pe/94278-autorizacion-y-registro-homologacion-y-o-modificacion-de-modalidades-de-juego)

[2]: [MINCETUR — Formatos de certificado de cumplimiento 2025](https://apuestasdeportivas.mincetur.gob.pe/PDF/FORMATOS_CERTIFICADOS_CUMPLIMIENTO_2025.pdf)
