# ARKI — Mapa de cuatro accesos y perfiles

## Gateway común

```text
ARKI Gateway
├── Visitante
├── Usuario / Proyecto
├── Especialista / Coordinación
└── Corporativo / Costos / Interferencias
```

Son perfiles dentro de un mismo workspace; no son cuatro aplicaciones separadas.

| Acceso | Perfil visual | Propósito | Módulos iniciales | Restricción UI-1 |
|---|---|---|---|---|
| 1 | Visitante | Consulta pública y demostraciones | Inicio, biblioteca pública | Sin proyectos privados ni costos contractuales |
| 2 | Usuario / Proyecto | Crear propuestas y revisar proyectos | Proyectos, Generador, Modelo BIM, Planta, Corte, 3D, Expediente | Sin administración ni costos contractuales |
| 3 | Especialista / Coordinación | Revisar por disciplina y coordinar | Modelo BIM, disciplinas, metrados, 4D, Clashes, Expediente, O&M | Requiere revisión; no equivale a firma legal |
| 4 | Corporativo | Gobierno, costos e interferencias | Todos los módulos, PriceBook, S10, APU, Clashes, CDE y auditoría | Perfil de máximo alcance en prototipo local |

## Perfiles especialistas previstos

Arquitectura; estructuras y cálculo estructural; geotecnia; materiales y acabados; costos y metrados; programación y avance; coordinación BIM; sanitarias; eléctricas; HVAC; gases medicinales; telecomunicaciones; CCTV; contra incendio; transporte vertical; seguridad y accesibilidad; construcción; operación y mantenimiento.

## Estado de autenticación

La implementación actual utiliza `localStorage` únicamente para demostrar navegación y visibilidad de módulos. La interfaz muestra explícitamente:

> PROTOTIPO LOCAL — NO ES AUTENTICACIÓN DE PRODUCCIÓN

Autenticación real, organizaciones, sesiones, permisos persistentes y auditoría requieren backend y quedan fuera de UI-1.

## Evidencia de código

- Tipo `ArkiAccess`: `visitor | user | specialist | corporate`.
- `ACCESS_CARDS`: cuatro tarjetas del gateway.
- `isAccessAllowed`: control de visibilidad inicial.
- Botón de salida: elimina el perfil local y vuelve al gateway.
