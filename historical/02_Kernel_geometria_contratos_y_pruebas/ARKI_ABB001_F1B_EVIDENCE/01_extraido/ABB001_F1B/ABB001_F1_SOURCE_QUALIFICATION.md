# ABB-001-F1 — Source Qualification and Freeze Review

**Expediente:** Vivienda Fernández Rojas / Rossmery Yanire Fernández Rojas  
**Estado máximo:** `F1 QUALIFIED FOR BOUNDED EXTRACTION / MODEL RECONSTRUCTION NOT YET VERIFIED`  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `ARKI_ABB001_SOURCE_FREEZE_V1`

## 1. Veredicto

El Source Freeze recibido es **válido como conjunto documental congelado** para iniciar una extracción semántica acotada. Contiene cinco archivos DWG, dos PDFs y hashes SHA-256. La inspección visual confirma una vivienda unifamiliar de dos pisos, azotea y techo, con ubicación, arquitectura, estructuras, instalaciones sanitarias e instalaciones eléctricas.

F1 **no demuestra** importación DWG operativa, reconstrucción automática de un modelo BIM, round-trip CAD/BIM ni reconciliación automática entre disciplinas. Por tanto, esas capacidades permanecen `NOT_DEMONSTRATED`.

**Resultado:** `APPROVE WITH BOUNDED LIMITS`.

## 2. Identidad documental observada

| Campo | Valor | Estado |
|---|---|---|
| Tipología | Vivienda unifamiliar | EXISTS en cartelas |
| Ubicación | Urb. Miraflores Boulevard Park Plaza, Mz. AN, Lote 18, II Etapa, Castilla, Piura | EXISTS en U-01 |
| Frente / lote | 7.00 m / Lote 18 | EXISTS en U-01 |
| Área de terreno | 140.00 m² | EXISTS en U-01 |
| Área techada declarada | 230.40 m² | EXISTS en U-01 |
| Niveles | Primer piso, segundo piso, azotea y techo | EXISTS en A-01 |
| Escalas | 1/50; ubicación 1/250 y 1/5000; detalles 1/10, 1/20 y 1/25 | EXISTS en láminas |
| Disciplinas | Ubicación, arquitectura, estructuras, sanitarias y eléctricas | EXISTS en set PDF |
| Identificador personal | Visible en cartela de la fuente | Se conserva sólo en evidencia fuente; no se propaga al modelo |

## 3. Láminas identificadas

| Disciplina | Láminas visibles |
|---|---|
| Ubicación | U-01 — Ubicación y localización |
| Arquitectura | A-01 — Plantas de distribución; A-02 — Secciones y elevaciones |
| Estructuras | E-01 — Planta de cimentación y detalles; E-02 — Aligerados y detalles; E-03 — Aligerado, escalera, cisterna y detalles |
| Sanitarias | IS-01 — Desagüe y evacuación pluvial, 1.º y 2.º piso; IS-02 — Azotea y techo; IS-03 — Distribución de agua fría y caliente, 1.º y 2.º piso; IS-04 — Azotea y techo |
| Eléctricas | IE-01 — Circuitos eléctricos, 1.º y 2.º piso; IE-02 — Circuitos eléctricos, azotea y techo |

## 4. Fuentes y verificación

| Fuente | Tipo | Evidencia |
|---|---|---|
| `ARQUITECTURA MODIFICADA.dwg` | DWG AutoCAD 2018/2019/2020 | Hash registrado |
| `PROY. FERNANDEZ ROJAS - ARQUITECTURA.dwg` | DWG AutoCAD 2018/2019/2020 | Hash registrado |
| `PROY. FERNANDEZ ROJAS - ESTRUCTURAS.dwg` | DWG AutoCAD 2018/2019/2020 | Hash registrado |
| `PROY. FERNANDEZ ROJAS - SANITARIAS ELECTRICAS.dwg` | DWG AutoCAD 2018/2019/2020 | Hash registrado |
| `PROY. FERNANDEZ ROJAS - UBICACION.dwg` | DWG AutoCAD 2018/2019/2020 | Hash registrado |
| `ARQUITECTURA MODIFICADA.pdf` | PDF, 2 páginas | `pdfinfo`, texto y revisión visual |
| `PROY. FERNANDEZ ROJAS.pdf` | PDF, 12 páginas | `pdfinfo`, texto y revisión visual |

El hash del ZIP de entrada es:

`2b9f15324d541df51d33af107a686d37ca571c374ff98e19f91ebe42be161032`

Los hashes de cada archivo están en `ARKI_ABB001_SOURCE_FREEZE_V1/SOURCE_INTEGRITY_RAW.txt`.

## 5. Gates de F1

| Gate | Resultado | Evidencia |
|---|---|---|
| Fuente original preservada | PASS | ZIP original dentro del Source Freeze |
| Integridad SHA-256 registrada | PASS | `SOURCE_INTEGRITY_RAW.txt` |
| DWG clasificados por disciplina | PASS | Inventario de cinco DWG |
| PDFs legibles | PASS | `pdfinfo`, extracción y revisión visual |
| Cartelas y códigos de lámina identificables | PASS | U-01, A-01, A-02, E-01..E-03, IS-01..IS-04, IE-01..IE-02 |
| Geometría DWG importada en ARKI | NOT_DEMONSTRATED | No se ejecutó adaptador DWG/DXF |
| Entidades BIM reconstruidas automáticamente | NOT_DEMONSTRATED | F1 no ejecuta reconstrucción |
| Coordinación automática entre disciplinas | PARTIAL / NOT_DEMONSTRATED | Correspondencia documental observada; sin prueba computable |
| Snapshot canónico persistido | NOT_DEMONSTRATED | No se creó ni mutó estado canónico |

## 6. Restricciones y firewall

F1 no modifica producto, kernel, motores BKH, UI ni tests existentes. La documentación fuente no constituye aprobación profesional, firma estructural, validación normativa definitiva ni autorización de construcción.

La discrepancia del registro heredado que indicaba 400 páginas para el PDF principal queda documentada: `pdfinfo` verifica 12 páginas. No se usa el dato heredado como evidencia positiva.

## 7. Siguiente fase permitida

ABB-001-F2 podrá definir una **reconstrucción semántica acotada** únicamente con provenance por archivo, lámina y región de origen. La falta de lectura geométrica DWG deberá representarse como `UNKNOWN` o `NOT_DEMONSTRATED`, nunca como PASS implícito.

F2 requiere autorización independiente del Product Owner.

**STOP F1.**

---

**Clasificación final:** `F1 QUALIFIED / BOUNDED / NO BIM MODEL CLAIM`  
**Autoridad humana:** pendiente de cierre independiente.  
**Provenance:** exclusivamente `ARKI_ABB001_SOURCE_FREEZE_V1` y sus fuentes congeladas.  
**Terminología:** ARKI Master Codebook v1.0.

## Control de cambios

| Versión | Cambio | Estado |
|---|---|---|
| 1.0 | Calificación inicial del Source Freeze V1 | Bounded / Pending independent review |

**Fin del informe.**

**No se autoriza implementación adicional desde este documento.**

**Human Authority preserved.**

**STOP.**
