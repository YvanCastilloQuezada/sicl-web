# Informe único de auditoría: redondeo de premios y RTP de loterías

**Proyecto:** Multi Juegos Perú — piloto gratuito de créditos virtuales.  
**Versión del informe:** 1.0.0.  
**Alcance:** Loterías históricas 6/29, 6/39 MJP, 6/49 y 6/59; nueva familia Lot 19, Lot 29, Lot 39 Consuelo, Lot 49 y Lot 59 con bolas de consuelo.

> **Aviso de alcance.** Este documento audita un piloto estrictamente virtual. Los créditos y premios no son dinero, no tienen convertibilidad, no admiten depósitos, retiros ni pagos. Si se considerase una operación con dinero real, las reglas, la implementación y los requisitos regulatorios deberán recibir revisión independiente especializada antes de cualquier activación.

## 1. Solicitud auditada

Se solicitó que todos los premios se resuelvan en unidades enteras, sin decimales, con la siguiente convención:

| Importe bruto virtual `x` | Liquidación final |
|---:|---:|
| `x ≤ 0` | `0` créditos |
| `0 ≤ x < 0,4` | `0` créditos |
| `0,4 ≤ x < 1` | `1` crédito |
| `x ≥ 1` | `ceil(x)` créditos |

La implementación definitiva es `roundVirtualPrize(x)`: devuelve `0` para valores no finitos, negativos o inferiores a `0,4`; desde `0,4` usa el techo matemático. La regla queda incluida en el expediente de liquidación de cada boleto como `roundingPolicy`.

## 2. Resultado de la revisión de premios

Se revisaron las tablas de premios, multiplicadores MJP, premios de consuelo y columnas persistidas. Todas las tablas activas usan ya enteros no negativos; por tanto, **la regla no altera ningún premio publicado ni ningún RTP calculado**. Su propósito es impedir que futuras políticas con importes fraccionarios creen créditos decimales o resultados ambiguos.

| Área auditada | Resultado | Impacto operativo |
|---|---|---|
| `pilot_tickets.virtualPrizeAmount` y movimientos de billetera | Enteros | Se conserva el modelo de datos existente. |
| Tablas base de loterías | Enteros | Sin cambio de premios. |
| Paquetes de bolas de consuelo | Enteros | Sin cambio de premios ni costos. |
| MJP Extra 6/39 | Multiplicador entero ×2 | Sin cambio. |
| Cálculos de RTP | Ahora aplican la misma función de redondeo | Sin variación numérica mientras las tablas sean enteras. |

La prueba de borde confirmó que `0,39999999999999999 → 0`, `0,4 → 1`, `0,9999999 → 1` y `1,4 → 2` créditos virtuales.

## 3. Metodología matemática

Para un dominio de `N` números y una selección de `p` números, la probabilidad de acertar `j` números principales es:

`P(J=j) = C(p,j) × C(N-p,p-j) / C(N,p)`.

El retorno esperado de una tabla se calcula como la suma de cada probabilidad por el premio final **después de aplicar la regla de redondeo**. El RTP es el retorno esperado dividido entre el costo virtual del boleto.

En paquetes de bolas de consuelo, el cálculo también suma la probabilidad de que por lo menos una bola adicional coincida con un número del boleto que no apareció entre los principales. El consuelo se paga una sola vez por boleto y se liquida con la misma regla de redondeo.

## 4. RTP recalculado de variantes históricas

La auditoría detectó que cuatro valores se mostraban como objetivo aproximado de 85 %, aunque las tablas enteras ya publicadas producen valores exactos ligeramente distintos. Se corrigieron los valores declarados en configuración; **no se cambiaron tablas, precios ni expedientes históricos**.

| Modalidad | Selección | Precio virtual | Premio mayor | RTP declarado previo | RTP exacto recalculado | Ajuste aplicado |
|---|---:|---:|---:|---:|---:|---|
| Lotería 29 histórica | 6/29 | 1 | 7 000 | 85,0000 % | **84,80274515 %** | Se actualizó el valor declarado. |
| Lotería 39 MJP base | 6/39 | 6 | 300 000 | 85,0000 % | **85,14846286 %** | Se actualizó el valor declarado. |
| Lotería 39 con MJP Extra | 6/39 + Extra | 7 | 300 000 | 75,15623969 % | **75,15623969 %** | Sin cambio. |
| Lotería 49 histórica | 6/49 | 1 | 200 000 | 85,0000 % | **85,08206916 %** | Se actualizó el valor declarado. |
| Lotería 59 histórica | 6/59 | 1 | 500 000 | 85,0000 % | **84,62524996 %** | Se actualizó el valor declarado. |

## 5. RTP de la nueva familia con bolas de consuelo

Las siguientes cifras se recalcularon después de aplicar la regla de enteros. Como todas las tablas ya eran enteras, coinciden con los valores matemáticos previamente calculados.

| Modalidad | Tipo técnico | Selección | Premio mayor virtual | RTP base exacto |
|---|---|---:|---:|---:|
| Lot 19 | `loteria_19` | 3/19 | 70 | **86,48090815 %** |
| Lot 29 | `loteria_29_cons` | 4/29 | 80 | **84,96484359 %** |
| Lot 39 Consuelo | `loteria_39_cons` | 5/39 | 100 000 | **86,25340204 %** |
| Lot 49 | `loteria_49_cons` | 6/49 | 350 000 | **84,93396938 %** |
| Lot 59 | `loteria_59_cons` | 6/59 | 1 200 000 | **85,05136129 %** |

| Modalidad | Bolas adicionales | Costo total virtual | Consuelo único | RTP combinado exacto |
|---|---:|---:|---:|---:|
| Lot 19 | 1 | 2 | 5 | **85,19091847 %** |
| Lot 29 | 1 | 2 | 5 | **84,96484359 %** |
| Lot 39 Consuelo | 1 | 2 | 5 | **85,02501924 %** |
| Lot 49 | 1 | 2 | 5 | **85,38838755 %** |
| Lot 49 | 2 | 3 | 5 | **85,40198660 %** |
| Lot 59 | 1 | 2 | 5 | **85,29770777 %** |
| Lot 59 | 2 | 3 | 5 | **85,08496652 %** |
| Lot 59 | 3 | 4 | 5 | **85,98313512 %** |

## 6. Cambios técnicos auditables

| Componente | Cambio |
|---|---|
| `shared/virtualPrizeRounding.ts` | Fuente única de la política de redondeo e identificación de premios enteros. |
| `shared/lotteryVariants.ts` | RTP recalculado sobre premios finales; valores históricos corregidos al cálculo exacto. |
| `server/pilot.ts` | Liquidación persistida normaliza el premio antes de actualizar boleto y billetera; conserva `rawPrize`, `prize` y la política aplicada en `resultJson`. |
| `scripts/auditar-rtp-redondeo.mjs` | Genera el reporte JSON reproducible de RTP, tablas enteras y paquetes de bolas. |
| `shared/virtualPrizeRounding.test.ts` | Pruebas de umbral y comprobación de tablas enteras/RTP. |

No se requieren cambios de esquema: el almacenamiento de premios y billetera ya es entero, y la regla se aplica antes de persistir.

## 7. Evidencia de verificación

| Comando o prueba | Resultado esperado |
|---|---|
| `pnpm tsx scripts/auditar-rtp-redondeo.mjs` | JSON con los RTP exactos incluidos en este informe. |
| `pnpm vitest run shared/virtualPrizeRounding.test.ts server/lotteryVariants.test.ts` | Umbrales de redondeo, premios enteros y RTP aprobados. |
| `pnpm check && pnpm test` | Tipos y regresión integral del proyecto aprobados antes del checkpoint. |

## 8. Conclusión de auditoría

La regla solicitada quedó implementada de forma centralizada y verificable. En el estado auditado, no produce modificaciones de premios ni de RTP porque todas las tablas ya son enteras. La mejora relevante es preventiva: toda futura política fraccionaria seguirá el umbral `0,4` y no podrá introducir saldos o premios decimales.

La recalibración corrigió la **declaración** de RTP de las cuatro variantes históricas para reflejar su valor exacto. La nueva familia Lot 19–59 conserva sus tablas y RTP calculados, incluida la coexistencia independiente de Lot 39 Consuelo 5/39 y Lotería 39 MJP 6/39.

## 9. Decisión de control de cambios — adjunto 15

El 25 de agosto de 2026 se contrastó `pasted_content_15.txt` con la configuración vigente. Aunque el adjunto describe la misma familia de cinco loterías, propone tablas distintas y presenta RTP incompatibles con su propia matemática: sus RTP base calculados serían 22,0846 % para Lot 19, 21,8096 % para Lot 29, 1 559,2342 % para Lot 39, 218,2898 % para Lot 49 y 108,1281 % para Lot 59.

> **Decisión aprobada por el usuario: opción A.** Se conservan las tablas recalibradas y los RTP auditados de este informe. `pasted_content_15.txt` queda clasificado como especificación obsoleta de referencia y no autoriza cambios de premios, RTP, rondas, comprobantes ni reglas activas.

## Referencias internas

[1] [`shared/virtualPrizeRounding.ts`](../shared/virtualPrizeRounding.ts) — Regla operativa de redondeo.  
[2] [`shared/lotteryVariants.ts`](../shared/lotteryVariants.ts) — Tablas, combinatoria y RTP teórico.  
[3] [`server/pilot.ts`](../server/pilot.ts) — Liquidación persistida y trazabilidad.  
[4] [`scripts/auditar-rtp-redondeo.mjs`](../scripts/auditar-rtp-redondeo.mjs) — Auditor reproducible de valores.  
[5] [`shared/virtualPrizeRounding.test.ts`](../shared/virtualPrizeRounding.test.ts) — Cobertura automatizada de la regla.
[6] [`pasted_content_15.txt`](../../upload/pasted_content_15.txt) — Adjunto contrastado y clasificado como obsoleto.
