# Evaluación de factibilidad de tarifa definitiva de S/ 1
## Multi Juegos Perú / Ruleta Perú Online

**Fecha:** 25 de agosto de 2026  
**Versión técnica de referencia:** checkpoint `31a4f3d3`  
**Objeto:** evaluar si una futura operación, separada del piloto, podría cobrar S/ 1 por participación.  
**Estado actual:** no se modifica el piloto; continúa con créditos virtuales sin pagos ni retiros.

> **Advertencia.** Esto es análisis técnico y financiero preliminar, no asesoría financiera, tributaria ni legal. Antes de usar una tarifa en una operación real se requiere revisión de un contador, abogado peruano especializado, autoridad competente y proveedor de pagos. La referencia interna “1 crédito = 1 unidad PEN” no crea valor económico ni autorización.

## 1. Respuesta ejecutiva

**S/ 1 es técnicamente factible para la mayoría de las modalidades, pero no es automáticamente sostenible como precio definitivo.** El precio por sí solo no determina la rentabilidad: importan el RTP, la tabla de premios, la frecuencia, el volumen, los costos de adquisición, el fraude, la atención, la infraestructura, los impuestos y la comisión de pago.

Con RTP cercano a 85 %, una jugada de S/ 1 deja aproximadamente S/ 0,15 de retención bruta antes de costos. En un escenario ilustrativo que descuenta 12 % sobre la base del impuesto a juegos, 2 % de mantenimiento dentro de dicha base, 1 % de ISC y 5 % de pasarela, quedan aproximadamente **S/ 0,06–S/ 0,08 por jugada**, antes de personal, tecnología, marketing, licencias, certificación, fraude, soporte, renta e IGV u otras obligaciones. Las tasas y bases deben confirmarse para la estructura concreta de la empresa; no deben copiarse mecánicamente del archivo adjunto.

Mi recomendación es mantener **S/ 1 como precio de entrada**, no como precio universal obligatorio:

| Grupo | Recomendación preliminar |
|---|---|
| Juegos ya calibrados cerca de 85 % y con precio actual de 1 crédito | Candidato fuerte para S/ 1, sujeto a costos y cumplimiento. |
| Ruleta 17, 27, 37 y Lotería 39, hoy con precio superior a 1 | No bajar a S/ 1 conservando premios; exige recalibración completa y nueva regla versionada. |
| MJP Extra y cualquier complemento | No usar “bola extra + S/ 1” sin recalcular su RTP y revisar divulgación, tributación y autorización. |
| Operación con pago directo de S/ 1 | Poco eficiente si la pasarela cobra comisión fija; conviene evaluar saldo mínimo, paquetes y límites, sin compras automáticas. |

## 2. Correcciones al archivo recibido

El archivo adjunto es útil como hipótesis comercial, pero contiene afirmaciones que no coinciden con el código y la documentación vigente:

| Afirmación del archivo | Verificación contra el proyecto |
|---|---|
| Lotería 29 como 4/29 | Incorrecto para el catálogo vigente: el motor usa **6/29**. |
| Lotería 19 como 3/19 | Coincide con la configuración vigente. |
| Loterías 39, 49 y 59 a S/ 2 | No coincide con la configuración visible actual: Lotería 39 usa 6 créditos y Loterías 49/59 usan 1 crédito en la interfaz y motor actual. |
| Impuesto de juegos de 12 % | SUNAT informa 12 % de la base imponible para juegos y apuestas a distancia; la base y el sujeto deben revisarse para la estructura concreta.[1] |
| ISC de 1 % | SUNAT informa 1 % para juegos a distancia bajo el sistema al valor; su aplicación concreta debe confirmarse según operador, residencia y modalidad.[2] |
| Pasarela de 5 % | No es un dato del proyecto ni una tarifa universal; se usa solo como escenario ilustrativo. |
| “Atrae a jóvenes” y “no importa perder” | Deben eliminarse. Son mensajes incompatibles con un diseño de juego responsable y pueden incentivar uso excesivo. |
| “El jugador recupera su apuesta” con premio de S/ 1 | No siempre es cierto; depende de si el premio es bruto, neto, total, si devuelve la participación y de la tabla publicada. |

## 3. Tarifas y RTP que deben considerarse como fuente técnica

La fuente autoritativa para una futura recalibración es la regla persistida y el motor servidor; la interfaz debe reflejarla. La tabla siguiente resume el estado registrado en `server/pilot.ts` y `client/src/data/games.ts`.

| Modalidad | Precio actual en créditos | RTP publicado | ¿S/ 1 sin cambiar premios? | Dictamen |
|---|---:|---:|---|---|
| Ruleta piloto | 1 | 83,7800 % | Sí | Viable como entrada, con margen bruto 16,22 %. |
| Ruleta 7 | 1 | 85,7143 % | Sí | Viable; margen bruto 14,29 %. |
| Ruleta 17 | 5 | 84,7059 % | **No** | Con los mismos premios, el RTP teórico se multiplicaría por 5. |
| Ruleta 27 | 9 | 85,5967 % | **No** | Con los mismos premios, el RTP teórico se multiplicaría por 9. |
| Ruleta 37 | 4 | 85,1351 % | **No** | Con los mismos premios, el RTP teórico se multiplicaría por 4. |
| Jackpot | 1 | 85,0426 % | Sí | Viable como precio base, revisando varianza y pozo. |
| Bingo Flash | 1 | 85,0549 % | Sí | Candidato fuerte. |
| Bingo Keno | 1 | 85,0000 % | Sí | Candidato fuerte. |
| Bingo 75 | 1 | 84,5636 % | Sí | Candidato; divulgar patrón, bola 41 y premio. |
| Lotería 19 | 1 | 86,4800 % | Sí | Candidato, con margen bruto menor. |
| Lotería 29 | 1 | 84,8000 % | Sí | Candidato; la combinación vigente es 6/29. |
| Lotería 39 | 6 | 85,1485 % | **No** | Requiere recalcular tabla; MJP Extra es un complemento separado. |
| Lotería 49 | 1 | 85,0800 % | Sí | Candidato técnico; revisar varianza del premio mayor. |
| Lotería 59 | 1 | 84,6300 % | Sí | Candidato técnico; alto riesgo de varianza y liquidez. |
| Trío 13 | 1 | 84,9700 % | Sí | Candidato. |
| Sueldo de por vida | 1 | 84,8896 % | Sí | Candidato solo con lenguaje que diga “cuotas virtuales”, no renta real. |
| Raspa Digital | 1 | 85,0000 % | Sí | Candidato fuerte; revisar frecuencia y riesgo de juego impulsivo. |
| Pick 3 | 1 | 85,1000 % | Sí | Candidato fuerte; permitir repeticiones explícitamente. |
| Pick 4 | 1 | 84,8200 % | Sí | Candidato fuerte; revisar premios de baja frecuencia. |
| Loto Diario | 1 | 85,2012 % | Sí | Candidato; requiere ronda diaria real y control de cierre. |
| Loto Express | 1 | 85,0000 % | Sí | Candidato condicionado a límites de frecuencia y operación. |

## 4. Resultado matemático de cobrar S/ 1

Si se mantiene exactamente la tabla de premios de un juego, el RTP cambia inversamente con el precio. Para un juego cuyo precio actual es `P` y RTP actual es `R`, cobrar 1 manteniendo la misma tabla produce aproximadamente `R × P`.

| Modalidad con precio actual superior a 1 | RTP actual | Precio actual | RTP aproximado si se cobra 1 sin recalibrar |
|---|---:|---:|---:|
| Ruleta 17 | 84,7059 % | 5 | 423,5295 % |
| Ruleta 27 | 85,5967 % | 9 | 770,3703 % |
| Ruleta 37 | 85,1351 % | 4 | 340,5404 % |
| Lotería 39 | 85,1485 % | 6 | 510,8910 % |

Estos valores no son una oportunidad de negocio: demuestran que **no se puede cambiar el precio de 5, 9, 4 o 6 a 1 sin reducir/reconstruir premios**. La recalibración debe ejecutarse con combinatoria exacta, redondeo definido, prueba de liquidación y nueva versión de regla.

Para los juegos que ya cobran 1 crédito y mantienen RTP alrededor de 85 %, el cambio conceptual a S/ 1 es más directo, pero la tarifa real todavía debe cubrir costos. El margen bruto por jugada es aproximadamente `1 − RTP`.

## 5. Escenario unitario de costos

El siguiente escenario usa una jugada de S/ 1 y un RTP de 85 %. No es una proyección ni una promesa; sirve para mostrar sensibilidad.

| Concepto por jugada de S/ 1 | Importe aproximado | Comentario |
|---|---:|---|
| Venta/apuesta | S/ 1,0000 | Antes de devoluciones y premios. |
| Premios a RTP 85 % | -S/ 0,8500 | Promedio teórico, no resultado de cada jugada. |
| Retención bruta | S/ 0,1500 | Antes de impuestos y costos. |
| Impuesto de juegos, escenario 12 % sobre 98 % de retención | -S/ 0,0176 | Base y aplicabilidad requieren confirmación. |
| ISC, escenario 1 % sobre S/ 1 | -S/ 0,0100 | Hipótesis de modelación; confirmar base. |
| Pasarela, escenario variable 5 % | -S/ 0,0500 | El 5 % no está confirmado; una tarifa fija sería peor en tickets pequeños. |
| Contribución antes de costos fijos | **S/ 0,0724** | Aproximación para RTP 85 %. |

Con RTP 84,56 %–86,48 %, el resultado del mismo escenario se mueve aproximadamente entre **S/ 0,0593 y S/ 0,0831 por jugada**, usando las hipótesis anteriores. Marketing, personal, servidores, soporte, antifraude, auditoría, licencias, certificación, renta, contabilidad, devoluciones y contingencias todavía deben salir de esa contribución.

## 6. Volumen mínimo y punto de equilibrio

No es correcto concluir que 10 000 jugadores diarios producirán S/ 300 000 mensuales sin definir días, retención, premios, impuestos, usuarios repetidos, costos y tasa de conversión. Un ejemplo de sensibilidad con 30 días y una participación de S/ 1 por jugador sería:

| Jugadas por día | Ventas mensuales | Contribución unitaria escenario S/ 0,0724 | Contribución antes de costos fijos |
|---:|---:|---:|---:|
| 1 000 | S/ 30 000 | S/ 0,0724 | S/ 2 172 |
| 10 000 | S/ 300 000 | S/ 0,0724 | S/ 21 720 |
| 50 000 | S/ 1 500 000 | S/ 0,0724 | S/ 108 600 |

El punto de equilibrio real se calcula como:

`jugadas mensuales = costos fijos mensuales / contribución neta por jugada`

Si los costos fijos fueran S/ 50 000 mensuales y la contribución efectiva fuera S/ 0,0724, se necesitarían aproximadamente 690 608 jugadas mensuales. Esta cifra es solo un ejemplo de sensibilidad y no debe usarse como presupuesto aprobado.

## 7. Recomendación por familia

### Juegos candidatos a S/ 1

Bingo Flash, Bingo Keno, Bingo 75, Lotería 19, Lotería 29, Lotería 49, Lotería 59, Trío 13, Sueldo de por vida, Raspa Digital, Pick 3, Pick 4, Loto Diario, Loto Express, Jackpot, Ruleta piloto y Ruleta 7 son técnicamente candidatos porque el precio vigente del motor es 1 crédito y las reglas ya están calibradas alrededor del rango publicado. Esto no autoriza cobro real ni garantiza rentabilidad.

### Juegos que necesitan una fase de recalibración

Ruleta 17, Ruleta 27, Ruleta 37 y Lotería 39 no deben pasar directamente a S/ 1 conservando sus premios. El equipo tendría que fijar un presupuesto de premio por jugada, recalcular todas las categorías, controlar los premios enteros y medir la varianza. El nuevo ruleset debería publicarse con versión, fecha, fórmula, RTP, margen, límites y evidencia.

### Complementos y extras

MJP Extra no debe tratarse como una simple venta adicional de S/ 1. Su tarifa, multiplicador, elegibilidad, premio, RTP incremental, impuestos y divulgación deben modelarse como producto propio. Las bolas extra no deben venderse por número de bolas sin comprobar que cada opción tenga probabilidad y valor esperado publicados.

## 8. Viabilidad operativa de un ticket de S/ 1

Una transacción individual de S/ 1 puede ser antieconómica si el proveedor cobra una comisión fija, un mínimo por operación o costos de contracargo. La solución no debe ser ocultar el costo ni inducir compras automáticas. Deben compararse tres modelos legales y transparentes: saldo precargado con consentimiento explícito, paquetes de créditos con precio y caducidad claramente informados, o cobro agrupado con comprobante por cada participación. Cualquiera de estos modelos requeriría autorización, proveedor, conciliación, protección al consumidor y revisión legal.

El piloto actual debe conservar 1 crédito como unidad interna, sin mostrar soles como precio real, sin pagos y sin convertir el saldo. La migración futura no puede asumirse automática.

## 9. Condiciones antes de considerar S/ 1 definitivo

| Condición | Evidencia necesaria |
|---|---|
| Tabla de premios | Ruleset aprobado, fórmula, RTP exacto y tratamiento de redondeo. |
| Economía unitaria | Modelo con escenarios de volumen, costos fijos/variables, premios, fraude y sensibilidad. |
| Impuestos | Dictamen tributario sobre impuesto a juegos, ISC, IGV, renta y obligaciones conexas. |
| Pagos | Contrato, comisión fija/variable, conciliación, reversos, fraude y atención. |
| Regulación | Revisión de autorización, homologación, certificación y modalidad aplicable. |
| Juego responsable | Límites efectivos, pausas, autoexclusión real, mayoría de edad y soporte. |
| Seguridad | Pentest, gestión de claves, backups, recuperación y monitoreo. |
| Operación | UAT, carga, doble ejecución de cron, incidentes y continuidad. |
| Comunicación | Prohibición de claims de “dinero fácil”, “recuperar pérdidas” o rentabilidad garantizada. |

## 10. Decisión recomendada

**No implementar todavía precios en soles ni modificar el piloto.** Mantener 1 crédito virtual en las modalidades que ya están diseñadas para 1 crédito y usar la cifra como referencia de laboratorio, no como precio de venta. Para una futura etapa, aprobaría un experimento de tarifa S/ 1 únicamente en modalidades con baja complejidad de liquidación y reglas recalibradas: Raspa Digital, Pick 3, Bingo y Loto Express. Después evaluaría Loto Diario y Loterías de precio 1. Dejaría Ruleta 17/27/37 y Lotería 39 para una fase posterior de recalibración, certificación y liquidez.

La tarifa de S/ 1 puede ser una buena **puerta de entrada**, pero no debe presentarse como “barrera cero”, ni orientarse a menores, ni basarse en que perder “no importa”. El objetivo debe ser entretenimiento transparente, límites de uso, resultados verificables y economía sostenible.

## 11. Referencias

[1] [SUNAT — Impuesto a los juegos y apuestas deportivas a distancia](https://emprender.sunat.gob.pe/principales-impuestos/otros/impuesto-los-juegos-apuestas-deportivas-distancia)  
[2] [SUNAT — ISC a los juegos y apuestas deportivas a distancia](https://emprender.sunat.gob.pe/principales-impuestos/impuesto-selectivo-consumo-isc/isc-los-juegos-apuestas-deportivas-distancia)  
[3] [MINCETUR — Juegos online y apuestas deportivas](https://apuestasdeportivas.mincetur.gob.pe/)  
[4] [MINCETUR — Homologación de plataformas tecnológicas](https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia)

## 12. Anexo: cálculo reproducible

El cálculo usado en este informe se conserva en `/home/ubuntu/price_one_sol_analysis.py`. Ejecutarlo con:

```bash
python3 /home/ubuntu/price_one_sol_analysis.py
```

El script muestra RTP, retención bruta por S/ 1, escenario con impuesto de juegos y mantenimiento, ISC, pasarela hipotética y el RTP que resultaría si se cobrara 1 manteniendo una tabla diseñada para un precio mayor. Las tasas de pasarela y la aplicación concreta de tributos son hipótesis de sensibilidad, no datos contractuales ni un dictamen tributario.
