# Decisiones P0 del Product Owner

Estas cinco decisiones bloquean la contratación de E5–E7. Se pueden resolver con `RESOLVED` o `DEFER EXPLÍCITO`.

| ID | Decisión | Recomendación | Respuesta |
|---|---|---|---|
| P0-1 | Visor 3D | Three.js + React Three Fiber | PENDIENTE |
| P0-2 | Persistencia real | Local-first con IndexedDB y adaptador de servidor opcional | PENDIENTE |
| P0-3 | Parser IFC4 | web-ifc gobernado, con reporte de pérdida | PENDIENTE |
| P0-4 | Solver estructural | OpenSees, sujeto a validación profesional | PENDIENTE |
| P0-5 | Normativa MEP | Perú como país base y alcance hospitalario inicial | PENDIENTE |

## Formato de respuesta

```text
P0-1: RESOLVED — Three.js + React Three Fiber
P0-2: RESOLVED — IndexedDB local-first + adaptador servidor opcional
P0-3: DEFER EXPLÍCITO — se decide al iniciar E5
P0-4: DEFER EXPLÍCITO — requiere validación profesional
P0-5: RESOLVED — Perú + hospitalario inicial
```

No se debe abrir E1 como bloque ejecutable hasta que las cinco decisiones tengan respuesta explícita y el Product Owner apruebe la clasificación, las capturas y los ADRs.


## Resolución del Product Owner — 2026-09-23

El Product Owner respondió: **“Acepto las 5 recomendaciones: Three.js/R3F, IndexedDB local-first, web-ifc, OpenSees y Perú + hospitalario.”**

Estado de FIX-0.4: **RESOLVED BY PRODUCT OWNER**.

La resolución autoriza la arquitectura contractual, pero no declara implementadas ni verificadas esas tecnologías.
