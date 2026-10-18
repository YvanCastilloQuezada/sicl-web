# 23 — Contradicciones y desalineaciones

| Afirmación A | Afirmación B | Evidencia | Impacto | Recomendación |
|---|---|---|---|---|
| Portal/QR/AR listos | Browser puede servir pantalla vieja o fallback | SW, chunks, reportes públicos | Usuario ve una experiencia distinta al repo | Versionar cache, verificar build desplegado y hacer smoke test. |
| QR circular es experiencia | QR es solo deep link/presentación | `shared/circularQr.ts` | Se espera autorización o contenido que no existe | Mostrar destino, expiración y límites. |
| VERIFIED | PUBLISHED | `territorialTrust.ts` | Runtime podría confundirse si filtra mal | Mantener campos y gate separados. |
| Mapper/The Eye son apps de campo | UI puede parecer landing/dashboard | `TerritorialTrustPage.tsx`, entry route | El operador no captura/revisa rápidamente | Priorizar modo campo y separar admin. |
| Controller Lab controla TV | Contrato/session no prueba receptor real | `TouchRemotePage.tsx`, controller contracts | Botones no producen efecto físico | Integrar receptor y probar red/hardware. |
| GLB existe | GLB puede ser inválido, inaccesible o incompatible | AR loader/assets | Fallback/loader infinito | Validar GLB, headers, URL y dispositivo. |
| Test PASS | Producción certificada | suites + gates externos | Falsa sensación de completitud | Etiquetar test vs field gate. |
| Agente implementado | Agente productivo con memoria/herramientas | registry vs runtime | Sobrestimar madurez | Informe agente por agente con evidencia. |
| Audit chain | Toda acción auditada | server events vs UI events | Huecos de trazabilidad | Definir cobertura de eventos. |
| Dominio público | QR definitivo productivo | Publish/DNS/HTTPS/cache | QR puede apuntar a preview/versión vieja | Regenerar tras dominio estable y smoke test físico. |

El proyecto debe tratar estas contradicciones como riesgos de release, no como simples problemas de copy.
