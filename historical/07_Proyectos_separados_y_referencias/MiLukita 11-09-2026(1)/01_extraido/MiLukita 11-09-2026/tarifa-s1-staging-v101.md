# Tarifa virtual S/1 y staging de modelos — v1.0.1

**Fecha:** 25 de agosto de 2026  
**Alcance:** piloto de créditos virtuales; no constituye operación monetaria.

## 1. Decisión de implementación

Las modalidades adicionales ya existentes en el motor se reclasifican como implementadas en el piloto virtual: **Pick 3, Pick 4, Raspa Digital, Sueldo de por vida y Loto Express**. Loto Diario también queda disponible. Todas mantienen una tarifa de **1 crédito virtual** en staging; la equivalencia interna con S/1 solo es una referencia de diseño y no habilita cobros, retiros, conversión, Yape ni pagos.

## 2. Recalibraciones

| Modalidad | Tarifa virtual | Premio o tabla principal | RTP teórico/modelado | Observación |
|---|---:|---|---:|---|
| Ruleta base | 1 | 32 por coincidencia | 86,4865% | Pago entero; reemplaza 31 |
| Ruleta 17 | 1 | 2 por apuesta ganadora | 94,1176% | 8/17 resultados favorables |
| Ruleta 27 | 1 | 2 por apuesta ganadora | 96,2963% | 13/27 resultados favorables |
| Ruleta 37 | 1 | 2 por apuesta ganadora | 97,2973% | 18/37 resultados favorables |
| Bingo 75 | 1 | 1 en línea principal; 12 con bola 41 | 85,15% transitorio | Requiere simulación extendida antes de cualquier operación |
| Lotería 29 | 1 | 7 000; 320; 46; 6 | 92,2593% | Incremento mínimo práctico del premio de 3 aciertos |
| Lotería 39 MJP | 1 | 50 000; 1 167; 108; 10; 1 | 87,0902% | Tabla entera S/1 de transición |
| Lotería 49 | 1 | 200 000; 2 500; 160; 21; 2 | 85,0821% | Tabla vigente de 1 crédito |
| Lotería 59 | 1 | 500 000; 10 000; 250; 25; 5 | 94,3736% | Incremento mínimo práctico del premio de 2 aciertos |
| Pick 3 | 1 | 500 en 3; 13 en 2 posiciones | 85,10% | Dígitos repetibles; orden importa |
| Pick 4 | 1 | 4 000 en 4; 58 en 3; 5 en 2 | 85,18% | Ajuste de 57 a 58 en tres posiciones |
| Raspa Digital | 1 | 17 en casilla ganadora | 85,00% | Tablero virtual |
| Sueldo de por vida | 1 | 24 cuotas de 913; 16 en 3 aciertos | 86,03% transitorio | Las cuotas son créditos virtuales, no renta |
| Loto Diario | 1 | 2 000; 22; 1 | 85,20% | Sorteo diario preparado |
| Loto Express | 1 | 60; 2 | 85,00% | Sorteo cada 30 minutos preparado |

El RTP es una expectativa matemática agregada; no garantiza un resultado individual. Las tablas se expresan en unidades enteras de crédito virtual.

## 3. Calculadora reproducible

El comando `pnpm rtp:all` ejecuta `scripts/calculadora-rtp-todas.ts`. La corrida de validación del 25 de agosto de 2026 verificó **22 modalidades** y terminó con `RTP OK`, sin modalidades por debajo del 85% según las bases declaradas. La calculadora combina probabilidades exactas para las loterías y ruletas con los RTP versionados de las modalidades cuyo motor usa tablas o patrones más complejos.

## 4. Staging de tarifa

La consola de operaciones incorpora `StagingFinancePanel`. Solo se muestra a un administrador autenticado y permite escoger una modalidad, simular 1 o 10 jugadas y reiniciar el contador. El staging registra únicamente estado React local: jugadas, gasto de referencia y premio esperado. No llama a reserva de tickets, billetera, rondas, pagos ni almacenamiento. El texto de la interfaz identifica expresamente que S/1 es una referencia virtual.

## 5. Modelo financiero administrativo

Se añadió `shared/financialModel.ts` y el procedimiento protegido `operations.financialProjection`. Los supuestos iniciales son parametrizables y no deben interpretarse como tasas definitivas:

| Supuesto | Valor inicial |
|---|---:|
| Jugadas diarias | 10 000 |
| Días del mes | 30 |
| Precio de referencia | S/1,00 |
| RTP de escenario | 85% |
| Impuesto de juegos | 12% sobre base modelada; validar profesionalmente |
| Mantenimiento | 2% |
| ISC | 1%; validar profesionalmente |
| Pasarela | 5%; reemplazar por cotización real |
| Marketing | 20% |

Con esos supuestos, 300 000 jugadas generan S/300 000 de ingresos de referencia y S/255 000 de premios esperados. El modelo muestra una **contribución negativa de S/38 292** antes de costos administrativos no incluidos, debido a la combinación de RTP, cargas y marketing. Por tanto, S/1 puede ser una tarifa de entrada, pero no se debe afirmar rentabilidad neta sin costos reales, estructura tributaria confirmada, límites de premios y volumen suficiente.

## 6. Controles y límites

La implementación permanece en piloto virtual. No se activaron pagos, retiros, conversión a soles, documentos KYC, biometría, ubicación real, AML operativo ni autorización regulatoria. Los cierres automáticos siguen preparados para publicación, pero no deben activarse como operación monetaria sin decisión legal, técnica y financiera separada.

## 7. Evidencia técnica

La comprobación `pnpm check` pasó después de integrar el panel. Las pruebas específicas `server/financialModel.test.ts` pasaron 4/4 y verifican tarifas, piso RTP, ingresos, pasarela, contribución y protección contra división por cero. La suite del motor fue actualizada para los premios enteros recalibrados. Debe ejecutarse `pnpm test` completo antes de cada checkpoint posterior.

## 8. Pendientes antes de una etapa definitiva

Primero, sustituir las tasas ilustrativas por contratos y dictámenes reales de pasarela, impuestos y operación. Segundo, ejecutar simulaciones de alta cantidad para Bingo 75 y Sueldo de por vida y publicar intervalos de confianza del RTP observado. Tercero, revisar límites de exposición al jackpot, reservas de premios, fraude, conciliación y protección de usuarios. Cuarto, someter reglas, controles y modelo a asesoría legal peruana y certificación independiente. Ningún resultado de este documento equivale a autorización para operar juegos con dinero real.

## Referencias internas

- `shared/financialModel.ts` — modelo financiero paramétrico.
- `scripts/calculadora-rtp-todas.ts` — calculadora RTP reproducible.
- `server/financialModel.test.ts` — pruebas del modelo y del piso RTP.
- `shared/simplifiedGames.ts` — configuración de ruletas y Bingos.
- `shared/lotteryVariants.ts` — tablas de Loterías y cálculo teórico.
- `server/pilot.ts` — motor autoritativo, políticas y reglas versionadas.
- `client/src/components/StagingFinancePanel.tsx` — staging local y vista administrativa.
- `client/src/pages/Operations.tsx` — consola de operador.
- `client/src/pages/TransparenciaPage.tsx` — divulgación pública sincronizada.
- `/home/ubuntu/sunat-tax-findings-2026-08-25.md` — hallazgos oficiales usados como referencia preliminar; requieren revisión profesional.
