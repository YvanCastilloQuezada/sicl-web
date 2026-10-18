# Modelo financiero preliminar — Multi Juegos Perú — 2026

**Fecha de corte:** 25 de agosto de 2026. **Autor:** Manus AI.

## Alcance y advertencia

Este documento es un **modelo de planificación**, no una proyección certificada ni una opinión tributaria. El piloto vigente continúa exclusivamente en créditos virtuales, sin dinero real, cobros, retiros o conversión. La hoja de escenarios muestra qué ocurriría bajo una operación futura hipotética y regulada; no debe usarse para activar pagos. Un contador peruano y un asesor legal deben validar el tratamiento tributario, contractual y regulatorio antes de cualquier decisión.

## Datos externos usados

| Parámetro | Valor | Tratamiento | Fuente |
| --- | ---: | --- | --- |
| UIT 2026 | S/ 5,500 | Referencia tributaria | [1] |
| Comisión Yape Empresa | 2.95% | Referencia de cobro; sujeto a contrato y producto | [2] |
| Impuesto a juegos a distancia | 12% | Proxy de escenario futuro; no aplica al piloto virtual por sí solo | [3] |
| Gastos de mantenimiento | 2% del ingreso neto | Proxy indicado por SUNAT; validar base exacta | [3] |

La RMV, alquileres, servicios, salarios y cotizaciones no se han rellenado con cifras inventadas. Las partidas internas aparecen como **supuestos editables** en el archivo XLSX y deben reemplazarse por cotizaciones, contratos o planillas reales.

## Escenarios ilustrativos

Con precio unitario de S/ 1 y RTP técnico de 85%, el margen bruto antes de pagos, impuestos y costos fijos es 15% de las ventas. El escenario de 12% de impuesto y 2% de mantenimiento aplica una fórmula simplificada para sensibilidad, no una liquidación tributaria definitiva.

| Escenario | Jugadas/mes | Ventas brutas | Resultado operativo proxy* |
| --- | ---: | ---: | ---: |
| Conservador | 100,000 | S/ 100,000 | Se calcula en el XLSX |
| Base | 300,000 | S/ 300,000 | Se calcula en el XLSX |
| Expansión | 1,000,000 | S/ 1,000,000 | Se calcula en el XLSX |

\* El resultado proxy descuenta premios al RTP indicado, comisión Yape, proxy de impuesto, mantenimiento y costos fijos gerenciales. No incluye IGV, renta, ISC, chargebacks, fraude, reservas, certificación, homologación, geolocalización, adquisición de hardware ni otros costos no confirmados.

## Lectura para auditoría

La variable crítica es la combinación **RTP + volumen + costo de adquisición + costo regulatorio**. Con jugadas de S/ 1, un RTP de 85% deja un margen teórico estrecho antes de costos; por ello no es responsable presentar utilidad neta como hecho sin cotizaciones y sin definir el régimen tributario completo. La hoja **Supuestos** permite probar RTP de 85%, 86% u otro valor por escenario, pero la decisión de producto debe seguir las tablas y simulaciones de cada juego, no un promedio del catálogo.

El piloto debe mantener una contabilidad separada para créditos virtuales y cualquier futura operación monetaria. No se debe reutilizar el ledger virtual como libro de dinero real ni migrar saldos automáticamente. La eventual operación real requeriría una evaluación independiente de autorización MINCETUR, homologación, juego responsable, KYC/AML, geolocalización, pagos, protección de datos y fiscalidad.

## Pendientes del contador y del asesor legal

| Prioridad | Entregable | Responsable | Evidencia requerida |
| --- | --- | --- | --- |
| Alta | Cotizaciones de cloud, CDN, observabilidad y soporte | Finanzas/Operaciones | 3 cotizaciones o contratos |
| Alta | Planilla y cargas laborales | Contador | Planilla y régimen aplicable |
| Alta | Tratamiento tributario completo | Contador/Abogado | Memo firmado con base legal |
| Alta | Estructura de pagos y conciliación | Finanzas | Contrato del adquirente y flujo de settlement |
| Alta | Costos de homologación y certificación | Legal/QA | Cotizaciones de laboratorios autorizados |
| Media | CAC, retención y conversión | Producto/Marketing | Cohortes observadas, no supuestas |

## Referencias

[1]: https://www.sunat.gob.pe/indicestasas/uit.html — SUNAT, “Unidad Impositiva Tributaria - UIT”, valor 2026: S/ 5,500.

[2]: https://www.yape.com.pe/productos/yape-empresa — Yape, “Yape Empresa”, tarifa de recaudación publicada en su página de producto.

[3]: https://emprender.sunat.gob.pe/principales-impuestos/otros/impuesto-los-juegos-apuestas-deportivas-distancia — SUNAT, “Impuesto a los juegos y apuestas deportivas a distancia”.

[4]: https://apuestasdeportivas.mincetur.gob.pe/ — MINCETUR, portal de juegos online y apuestas deportivas a distancia, legislación y registros.
