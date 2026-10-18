# ADR-UI-001 — Transición de Home.tsx al ARKI BIM Workspace Shell

**Estado:** Aprobado para UI-1  
**Fecha:** 22 de septiembre de 2026  
**Decisión:** Envolver `Home.tsx` y migrar progresivamente, sin reescritura masiva.

## Contexto

`Home.tsx` contiene el flujo funcional existente de generación de familias, guardado local, comparación, exportaciones, modelo constructivo, costos, 4D, interferencias y expediente. Sustituirlo de golpe introduciría duplicación, regresiones y divergencia entre la interfaz y el dominio.

## Decisión

Se agregan dos capas de UI:

```text
App
├── ArkiGateway
│   └── selección de perfil local
└── ArkiWorkspaceShell
    └── Home.tsx existente como módulo Generador
```

`ArkiGateway.tsx` controla las cuatro entradas visuales y la persistencia local del perfil. `ArkiWorkspaceShell.tsx` agrega navegación, pestañas, Info Box, barra de estado y atajos. `Home.tsx` permanece como fuente del flujo de dominio ya probado.

## Compatibilidad

Se conservan:

- generación de propuestas;
- guardado y comparación local;
- exportaciones existentes;
- modelo constructivo semántico;
- PriceBook, APU, 4D, CDE local y expediente;
- pruebas 1A, 1B y 1C.

## No decidido por este ADR

Este ADR no implementa autenticación real, backend corporativo, cálculo estructural profesional, conector RVT/RFA, BCF productivo, MEP completo ni seguimiento real de obra.

## Consecuencias

La UI-1 puede verificarse sin romper el motor actual. La migración posterior debe extraer módulos desde `Home.tsx` mediante adaptadores, manteniendo una sola fuente de verdad de dominio. Una capacidad solo se promueve cuando tiene código, integración, comportamiento y evidencia.

## Evidencia asociada

- `client/src/components/ArkiGateway.tsx`
- `client/src/components/ArkiWorkspaceShell.tsx`
- `client/src/App.tsx`
- `client/src/pages/Home.tsx`
- `ARKI_BLOQUE_C_WIREFLOWS_PRUEBAS.md`
- `terminal_full_output/2026-09-22_23-53-01_562451_1132.txt`
