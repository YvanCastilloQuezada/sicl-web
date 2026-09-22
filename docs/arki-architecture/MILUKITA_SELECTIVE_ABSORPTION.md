# Absorción selectiva de MiLukita en ARKI

## Estado

La integración se realiza en la rama `integration/milukita-depurated-field-copilot` de ARKI. El repositorio original `YvanCastilloQuezada/milukita` permanece independiente e intacto.

La fuente auditada es la rama `transfer/arki-corp-milukita-ordenes-001-008`, commit `2fb937a223752d44e8958ca526d6df8f642482d5`.

## Decisión de producto

ARKI no absorbe MiLukita como una segunda aplicación ni copia su dominio de entretenimiento. Absorbe únicamente contratos portables que mejoran su función de copiloto arquitectónico:

```text
MiLukita captura y presenta
→ ARKI observa, conversa e interpreta
→ SICL Core persiste, versiona y gobierna
→ revisión humana decide la verificación/publicación
```

## Incorporado en esta rama

- Contrato de intenciones de voz de campo y estados de sesión.
- Interpretación controlada de comandos en español.
- Regla de confirmación humana para acciones destructivas o de envío a revisión.
- Prohibición explícita de `VERIFY`, `PUBLISH`, `DECISION_COMMIT`, resolución crítica y modificación del MJP CORE desde campo.
- Sobre de evidencia con procedencia `MILUQUITA`, estado epistémico y revisión obligatoria.
- Validación básica de GPS.
- Modelo de captura offline, sincronización pendiente y conflicto por versión.
- Gates de evidencia para no confundir `CAPTURED` con `VERIFIED` o `PUBLISHED`.
- Manifiesto de procedencia y absorción selectiva.

## Excluido de la copia de ARKI

No se copian ni se conectan al motor arquitectónico:

- juegos;
- ruleta, bingo, loterías y jackpot;
- MultiMarket;
- RTP y RNG;
- wallet, reward ledger y settlement;
- reglas de sorteos;
- superficies comerciales de entretenimiento;
- MJP CORE.

## Archivos añadidos

| Archivo | Propósito |
|---|---|
| `server/integrations/milukita/milukitaFieldCopilot.ts` | Contrato depurado de voz, intents y límites de autoridad |
| `server/integrations/milukita/milukitaTerritorialEvidence.ts` | Procedencia, GPS, evidencia y sincronización offline |
| `server/integrations/milukita/milukitaSelectiveAbsorption.ts` | Manifiesto de origen, selección y exclusiones |
| `server/integrations/milukita/milukitaSelectiveAbsorption.test.ts` | Pruebas de no absorción del dominio de juegos y de gates |

## Qué no se afirma todavía

Esta rama no certifica compatibilidad física universal de WebXR, cámara, GPS, micrófono, receptores de TV ni hosts nativos. Esas capacidades siguen sujetas a pruebas de dispositivo y servicios autorizados.

Tampoco se habilita autoridad de decisión o publicación en el dispositivo. La escritura canónica continúa siendo exclusivamente de SICL Core y la revisión humana sigue siendo obligatoria.

## Reversibilidad

La operación es reversible porque:

1. `main` de ARKI no se modifica en esta rama.
2. El repositorio original de MiLukita no se modifica.
3. La extracción queda documentada por commit y rama.
4. La copia depurada no contiene el MJP CORE ni sus módulos financieros.
