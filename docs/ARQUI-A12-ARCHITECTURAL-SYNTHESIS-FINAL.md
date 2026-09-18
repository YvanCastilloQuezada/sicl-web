# SiMS-DeI — ARQUI A12
# Architectural Synthesis, Strategy and Parti Composition

## Estado

**IMPLEMENTED LOCALLY — PASS WITH OBSERVATIONS**

A12 añade una composición derivada, explicable y no autónoma sobre el problema arquitectónico A11. Reutiliza el estado de proyecto, evidencia, registro espacial, objetivos, restricciones, preferencias, tensiones, preguntas e intención derivada ya existentes.

## Superficie implementada

El panel ARQUI ahora puede derivar:

- **Design drivers**, cada uno con bases y escala espacial.
- Tres respuestas estratégicas distinguibles: **Courtyard / protected void**, **Linear bar / sequence** y **Compact vertical / released ground**.
- Un **parti hipotético** por estrategia, con idea rectora, relación masa-vacío, circulación, acceso, distribución programática, sitio, orientación y organización vertical conceptual.
- Movimientos espaciales sugeridos y un mapeo informativo hacia operaciones posibles.
- Trade-offs esperados, unknowns, preguntas abiertas, perspectivas especialistas y provenance.
- Modificación humana de una estrategia y combinación humana de dos estrategias como funciones derivadas, sin mutar geometría.

## Límites constitucionales

Las estrategias se clasifican como **HYPOTHESIS**. El sistema no crea ganador, recomendación, decisión, preferencia, geometría ni operación espacial. La coherencia interna de una estrategia no constituye calidad arquitectónica ni causalidad demostrada. Los campos de sitio, programa, circulación, orientación y especialistas son hipótesis trazables, no hechos normativos ni desempeño validado.

La síntesis no ingiere libros ni crea una segunda base de conocimiento. Las fuentes futuras podrán enlazarse mediante `knowledgeBasis`; en este corte permanece vacío cuando no existe una contribución de conocimiento substantiva en el contexto.

## Trazabilidad

```text
DESIGN_PROBLEM
→ ARCHITECTURAL_READING
→ DESIGN_DRIVERS
→ STRATEGIC_RESPONSES
→ DESIGN_STRATEGY
→ PARTI_HYPOTHESIS
→ SPATIAL_PRINCIPLES
```

Cada estrategia conserva sus drivers, objetivos, constraints, preguntas, unknowns y bases de evidencia. El usuario puede inspeccionar una estrategia, comparar sus trade-offs y formular preguntas sin que ARQUI la seleccione automáticamente.

## i18n

Las nuevas claves se añadieron a los ocho catálogos declarados: `es`, `en`, `pt`, `it`, `fr`, `de`, `ru` y `zh`. No se añadió traducción externa en runtime.

## Validación

| Gate | Resultado |
|---|---:|
| Pruebas focalizadas A12 + A11 | 12 passed |
| Suite Web completa | 39 files / 208 tests passed |
| TypeScript | PASS |
| Vite build | PASS |
| `git diff --check` | PASS |
| Core compile/status | PASS; sin cambios |
| Deployment | NO |
| Push / merge | NO |

## Observaciones

El build conserva advertencias preexistentes sobre chunks grandes. No bloquean A12 y no se modificó la estrategia de bundling porque queda fuera del alcance.

## Archivos principales

- `client/src/components/arquiArchitecturalSynthesis.ts`
- `client/src/components/arquiArchitecturalSynthesis.test.ts`
- `client/src/components/arquiDialogue.ts`
- `client/src/components/ArquiContextPanel.tsx`
- `client/src/i18n/locales/*.json`

**A12_STOP = YES**
