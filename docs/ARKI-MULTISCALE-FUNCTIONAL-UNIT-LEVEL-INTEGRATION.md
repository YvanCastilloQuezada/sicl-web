# ARKI — Integración de Unidad funcional y Piso/Nivel

**Fecha:** 2026-09-19  
**Estado:** `IMPLEMENTED / DERIVED_RELATION / HUMAN_REVIEW_REQUIRED`  
**Alcance:** integración sobre contratos existentes; sin segundo modelo geométrico.

## Resultado

ARKI incorpora las escalas intermedias:

```text
SPACE
→ FUNCTIONAL_UNIT
→ LEVEL
→ FUNCTIONAL_SYSTEM
→ BUILDING
```

La integración se implementa en `arkiMultiscaleSpatialHierarchy.ts` y se conecta al modelo del restaurante de 500 personas.

## Unidad funcional

Una unidad funcional agrupa referencias a espacios existentes, actividades, flujos, nivel o niveles, rol y necesidad funcional. No crea habitaciones, muros, puertas, volúmenes ni otra geometría.

Las unidades implementadas en el restaurante son:

- `UNIT-PUBLIC-ARRIVAL`: acceso, atención, comedores y circulación pública.
- `UNIT-PRODUCTION-SERVICE`: carga, recepción, circulación de servicio, soporte y cocina.
- `UNIT-SANITARY-SUPPORT`: servicios sanitarios públicos de N1 y N2.
- `UNIT-EGRESS-VERTICAL`: escaleras, movimiento vertical y evacuación.

Una unidad puede cruzar varios niveles. Esto se utiliza para la atención pública y para la evacuación vertical.

## Piso/Nivel

La escala de nivel reutiliza `A22Level` y añade referencias derivadas a:

- espacios situados en el nivel;
- unidades funcionales que lo ocupan;
- núcleos existentes;
- rutas existentes;
- huella de referencia, sin generar geometría nueva.

El restaurante incorpora `N1` y `N2` con cota conceptual, altura entre pisos, rol y huella del lote.

## Validaciones

El contrato comprueba:

- que la ruta multiescala sea la canónica;
- que cada nivel tenga índice y provenance;
- que cada unidad tenga espacios y evidencia;
- que los espacios referenciados existan;
- que los niveles de cada unidad coincidan con los niveles de sus espacios;
- que las referencias de unidades de cada nivel sean válidas;
- que se preserve la revisión humana;
- que no se duplique geometría.

Los estados de conflicto permanecen visibles. Una referencia desconocida no se convierte en `PASS`.

## Límites preservados

```text
FUNCTIONAL_UNIT ≠ ZONE
FUNCTIONAL_UNIT ≠ ROOM LIST
LEVEL ≠ FUNCTIONAL_UNIT
LEVEL ≠ BUILDING COMPLIANCE
GEOMETRY ≠ COMPLIANCE
IMPLEMENTED CONTRACT ≠ PROFESSIONAL CERTIFICATION
```

La integración no crea decisiones, ganadores, recomendaciones ni claims de licencia. El desempeño normativo continúa dependiendo del gate de aplicabilidad, la evidencia y la revisión humana.
