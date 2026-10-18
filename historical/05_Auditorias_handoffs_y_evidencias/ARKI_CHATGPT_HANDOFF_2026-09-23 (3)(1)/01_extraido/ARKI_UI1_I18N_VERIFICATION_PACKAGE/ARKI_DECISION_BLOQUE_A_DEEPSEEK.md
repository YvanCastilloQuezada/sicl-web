# ARKI — Decisión formal para el Bloque A

**Fecha:** 22 de septiembre de 2026  
**Documento relacionado:** Adenda al contrato corporativo BIM  
**Estado:** Aprobado para preparación del Bloque A

## 1. División de entregas

Se aprueba la división secuencial propuesta por DeepSeek:

### Bloque A — Gobernanza mínima para iniciar la UI

Debe incluir:

1. ADR de transición de `Home.tsx` al shell BIM.
2. Mapa de los cuatro accesos.
3. Matriz de módulos por rol y estado.

No se debe escribir código de la nueva UI hasta revisar este bloque.

### Bloque B — Inventario técnico e interoperabilidad

Debe incluir:

1. Inventario de disciplinas y familias.
2. Contrato de exportación ARKI → IFC/Revit.

No se deben implementar nuevas disciplinas técnicas antes de aprobar este bloque.

### Bloque C — Operación y verificación

Debe incluir:

1. Wireflows de especialistas, costos, interferencias y revisión.
2. Plan de pruebas y criterios de aceptación.

Cada bloque será verificado antes de avanzar al siguiente. DeepSeek no debe autoaprobar su propia entrega.

## 2. Decisiones de producto resueltas

### 2.1 Tipo de acceso en Fase A

La Fase A utilizará **perfiles locales de prototipo**, no autenticación corporativa real.

Los perfiles locales son una solución temporal para probar navegación, visibilidad de módulos y permisos de interfaz. Deben etiquetarse como:

```text
PROTOTIPO LOCAL — NO ES AUTENTICACIÓN DE PRODUCCIÓN
```

La autenticación, organizaciones, sesiones, permisos persistentes y auditoría corporativa quedan para una fase posterior de plataforma.

### 2.2 Perfiles iniciales

La primera matriz de perfiles será:

| Perfil | Responsabilidad principal |
|---|---|
| Visitante | Consulta pública y demostraciones |
| Usuario / Propietario | Proyecto, programa, variantes y revisión general |
| Arquitectura | Espacios, familias, acabados, accesibilidad y expediente arquitectónico |
| Estructuras | Predimensionamiento, elementos estructurales y revisión de cálculo |
| Instalaciones / MEP | Sanitarias, eléctricas, HVAC, gases, telecomunicaciones y seguridad |
| Costos y Presupuesto | Metrados, APU, PriceBook, S10, CAPECO y control económico |
| Coordinación BIM | Modelo federado, propiedades, relaciones, interferencias y BCF |
| Construcción | 4D, avance, encofrados, calidad, seguridad y cambios |
| Operación y Mantenimiento | Activos, garantías, mantenimiento y desempeño |
| Administrador Corporativo | Bibliotecas, estándares, permisos, auditoría e integraciones |

Los perfiles pueden agruparse visualmente en las cuatro entradas:

```text
Visitante
Usuario / Proyecto
Especialista / Coordinación
Corporativo / Costos / Interferencias
```

### 2.3 Tipologías prioritarias de la biblioteca inicial

La primera biblioteca priorizará, en este orden:

1. **Salud**, incluyendo hospital, clínica, centro médico, laboratorio y ambientes con gases medicinales.
2. **Educación**, incluyendo colegio, instituto, universidad y ambientes de laboratorio.
3. **Comercio y oficinas**, incluyendo comercio, oficinas, atención al público y edificios corporativos.
4. **Vivienda**, como expansión inmediata después de las tres primeras tipologías.

La prioridad no significa que las demás tipologías sean excluidas. Significa que las familias, reglas y pruebas iniciales se diseñarán primero para estas cuatro categorías.

## 3. Decisiones que permanecen pendientes

Las siguientes decisiones quedan clasificadas como `PRODUCT DECISION REQUIRED` y no deben inventarse en el Bloque A:

1. Motor externo o integración definitiva para cálculo estructural.
2. Versión exacta de Revit objetivo del primer conector.
3. Mapeo definitivo de cada categoría ARKI a familia nativa, parámetro compartido o propiedad IFC.
4. Criterio formal para separar contenido referencial, revisado, aprobado y emitible.
5. Catálogo de precios con validez contractual.

El contrato debe mostrar estas decisiones pendientes en la matriz de riesgos y no bloquear la construcción del shell mientras no sean necesarias para la navegación inicial.

## 4. Alcance de Fase A

La Fase A incluye únicamente:

- Gateway de cuatro entradas.
- Perfiles locales de prototipo.
- Shell BIM persistente.
- Navigator.
- Toolbox.
- Tab bar.
- Toolbar contextual.
- Canvas.
- Info Box.
- Barra de estado.
- Atajos.
- Estados de módulo disponible, parcial, conceptual y no disponible.
- Integración inicial con el dominio existente.

La Fase A no incluye:

- Backend corporativo.
- Usuarios reales.
- Organizaciones persistentes.
- Autenticación de producción.
- Cálculo estructural profesional.
- Conector RVT/RFA.
- Nuevas redes MEP completas.
- CDE productivo.
- Seguimiento real de obra.

## 5. Transición desde Home.tsx

Se aprueba la recomendación de **envolver `Home.tsx` y migrar progresivamente**.

No se debe reescribir `Home.tsx` de golpe.

La transición debe conservar inicialmente:

- Generación de propuestas.
- Guardado local.
- Comparación de versiones.
- Exportación IFC.
- S10 local.
- Expediente técnico local.
- Pruebas 1A, 1B y 1C.

El shell debe incorporar estos flujos mediante adaptadores y módulos, hasta que cada módulo pueda independizarse sin duplicar el dominio.

## 6. Regla sobre Revit

Revit se considera un **destino de interoperabilidad**, no el patrón de completitud de ARKI.

ARKI puede tener más información y más capacidades que una exportación concreta a Revit. La exportación debe conservar la información adicional mediante:

- Parámetros compartidos.
- Propiedades IFC.
- Tablas.
- JSON.
- CSV.
- Anexos documentales.
- Reporte de cobertura y pérdida.

No se debe afirmar "compatible con Revit" sin archivo, conector o prueba reproducible.

## 7. Regla sobre la sección técnica amplia

La lista de disciplinas, familias y sistemas de la adenda queda clasificada como:

```text
FUTURE REFERENCE + INVENTARIO CORPORATIVO
```

El Bloque B debe convertirla en una matriz con estas columnas:

```text
familia o sistema
especialidad
tipología aplicable
estado actual
prioridad
nivel geométrico
nivel de información
reglas de cantidad
reglas de costo
reglas 4D
reglas de mantenimiento
IFC
Revit
responsable de validación
prueba requerida
```

Una familia no se considerará implementada porque aparezca en el inventario. Debe tener contrato, código, integración, prueba y estado explícito.

## 8. Instrucción para DeepSeek

Procede con el **Bloque A** siguiendo estas decisiones.

Entrega tres artefactos completos:

```text
ADR de transición Home.tsx → BIM Workspace Shell
Mapa de cuatro accesos y perfiles
Matriz de módulos por rol y estado
```

No escribas código de UI todavía.

No avances al Bloque B hasta que el Bloque A sea revisado y aprobado.

No declares implementada ninguna capacidad que no tenga código, integración y evidencia.
