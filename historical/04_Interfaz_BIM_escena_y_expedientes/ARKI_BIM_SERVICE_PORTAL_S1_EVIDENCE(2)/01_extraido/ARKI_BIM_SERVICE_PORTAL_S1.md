# ARKI BIM Service Portal — Adenda Operativa 97A-07-S1

## Estado máximo

`PORTAL FOUNDATION IMPLEMENTED / INTERNAL TESTING / NO PUBLIC LAUNCH / NO REAL PAYMENTS / PENDING INDEPENDENT VERIFICATION`

## Flujo

`DISCOVER → SELECT → UPLOAD → PREFLIGHT → SCOPE → QUOTE → PAYMENT GATE → PROCESS → QA → DELIVER → RETAIN/DELETE`

La fundación implementa contratos deterministas para el catálogo, jobs aislados, manifests de entrada, validación de integridad, preflight bounded, cotización gobernada, abstracción de proveedor de pago, máquina de estados, delivery y retención.

## Publication gate

Solo `APPROVED_FOR_SERVICE` puede aceptar trabajo comercial. Los servicios actuales de ARKI no se promocionan automáticamente: permanecen en `INTERNAL_TESTING` o en estados derivados de evidencia.

## Upload gate

`UPLOADED ≠ TRUSTED`. El portal exige tipo aprobado, límite de tamaño, hash y estado de integridad. La declaración de autorización del cliente se conserva como declaración, no como hecho verificado.

## Payment boundary

No se conectó ningún proveedor real y no se aceptan pagos reales. `PaymentProviderPort` es una interfaz gobernada para futura integración. El procesamiento exige evidencia verificable de pago, salvo jobs explícitamente marcados como benchmark/no comerciales.

## Isolation and confidentiality

Cada job posee `projectIsolationKey`; los inputs se clasifican como `PRIVATE_PROJECT_DATA`; el consentimiento de servicio no equivale a consentimiento de benchmark y no existe promoción automática a LKS, Academy o conocimiento canónico.

## Preflight

El preflight solo inventaría archivos, detecta formatos soportados, faltantes, disciplinas y complejidad bounded. No ejecuta gratuitamente el servicio completo.

## Prohibiciones activas

No hay lanzamiento público, uploads sin control, cobro real, procesamiento masivo, certificación profesional, precio vinculante autónomo, contacto comercial autónomo, mutation canónica ni despliegue productivo.
