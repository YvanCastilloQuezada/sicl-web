# MiLukita Commercial OS

## Estado de implementación

Este documento registra la primera capa comercial segura de MiLukita. La implementación se apoya en Entertainment OS y no crea una arquitectura paralela. La autoridad sobre RNG, RTP, reglas, resultados, wallet, créditos, ledger, liquidación y `MjpTvManifest` permanece en MJP CORE.

| Área | Estado | Evidencia | Límite |
|---|---|---|---|
| Audience Intelligence | PARCIAL | Contrato tipado y dashboard `/comercial` | No hay audiencia productiva hasta conectar eventos autorizados |
| Inventario comercial | IMPLEMENTADO como catálogo | Tres espacios preparados y estados | Precio, disponibilidad real y venta requieren política humana |
| CRM | IMPLEMENTADO como estructura inicial | Leads, estados, filtro y minimización | No scraping ni importación externa |
| Agents comerciales | PROPOSE_ONLY | Contrato y gobernanza | No gasto, contratos, publicación ni cambios automáticos |
| Marketing/Social | PREPARADO | Interfaces previstas en contrato | Integraciones externas no configuradas |
| Revenue/Pricing | PARCIAL | Campo de precio sugerido nulo | No se inventan ingresos ni precios |
| Digital Twin comercial | PENDIENTE | No conectado a producción | Solo después de definir datos y supuestos verificables |
| Chaos comercial | PARCIAL | Reutiliza límites de Chaos local | No se probó proveedor real |
| TV/cable/OTT | BLOQUEADO | Arquitectura de distribución documentada | Requiere operador, feed profesional y acuerdos externos |

## Panel `/comercial`

El panel administrativo muestra métricas de audiencia como `NO_DATA` cuando no existe evidencia observada; no presenta cifras ficticias de usuarios, retención, ingresos o conversiones. Muestra inventario preparado para evento patrocinado, QR comercial y segmento. El CRM inicia vacío y exige fuente autorizada o consentimiento para cualquier lead. Las propuestas y precios sugeridos requieren aprobación humana.

## Gobernanza

Los agentes comerciales siguen la secuencia `OBSERVE → ANALYZE → INSIGHT → PROPOSE_ONLY`. No pueden modificar RNG, RTP, reglas, wallet, créditos, ledger, liquidación, resultados, `MjpTvManifest`, Kill Switch, Auditor ni Watchdog. La aprobación de una propuesta es una decisión administrativa y no equivale a contrato, compra de publicidad ni publicación.

## Privacidad y seguridad

La capa comercial aplica minimización de datos, estados de consentimiento y prohibición de scraping irresponsable. No se configuraron redes sociales, proveedores publicitarios, pasarelas, cobros, cuentas externas ni campañas masivas. La caída de Commercial OS no debe detener la experiencia principal ni el motor autoritativo.

## Próximas fases

La siguiente fase técnicamente recomendable es conectar eventos analíticos autorizados y persistentes para obtener audiencia real. Después se puede ampliar CRM con empresas y oportunidades; luego preparar campañas y propuestas, siempre con aprobación humana. Revenue, publicidad programática, distribución, Digital Twin y chaos testing de proveedores permanecen posteriores y condicionados a políticas, fuentes, credenciales y decisiones legales.

## Mejoras de operación comercial

El panel `/comercial` incorpora un monitor visual del pipeline con selector entre leads y propuestas; los conteos se muestran como `0` cuando no existen registros, sin inventar proyecciones. El inventario permite filtrar por `AVAILABLE`, `RESERVED`, `SOLD` y `EXPIRED`, y ordenar por nombre, tipo o estado. El botón de exportación produce un CSV con leads y propuestas actualmente disponibles en el modelo local. Estas funciones son de revisión administrativa y no envían campañas ni generan compromisos.
