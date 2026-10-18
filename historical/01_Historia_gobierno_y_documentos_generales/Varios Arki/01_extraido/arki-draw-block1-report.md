# ARKI-DRAW — Bloque 1

## Estado

```text
STATUS=PASS
BASELINE=0e13bfcc2414a3d9ffb73328b44bcb4115d925b7
BRANCH=feat/arkidraw-block1
COMMIT=4d932c2c2f884aa47982d6eca6358455beb1a314
REMOTE_HEAD=4d932c2c2f884aa47982d6eca6358455beb1a314
MAIN_REMOTE=4de9ca1b25fed8b60dce8ead4923a76fef0ee8eb
```

## Implementado

- Primitivas geométricas congeladas: `Point`, `Line`, `Polyline`, `Rect`, `Text`, `Hatch`, `Dimension`.
- Pesos ISO 128 representados por `LineWeight`.
- Patrones de achurado arquitectónico.
- Escalas deterministas 1:10 a 1:1000.
- Papeles ISO 216 A0–A4, orientación y márgenes.
- Cajetín tipado peruano con especialidad y validación de fecha.
- Compatibilidad conservada con el title block histórico de RFC-030.
- `Sheet` y `Viewport` inmutables.
- Export SVG standalone y export de lámina completa.
- Escape XML de textos.
- Formateo numérico fijo a tres decimales.
- Export byte-a-byte determinista para el mismo input.

## Archivos del commit

```text
src/sicl/drawing/__init__.py
src/sicl/drawing/paper.py
src/sicl/drawing/primitives.py
src/sicl/drawing/scale.py
src/sicl/drawing/sheet.py
src/sicl/drawing/svg_export.py
src/sicl/drawing/title_block.py
tests/test_drawing.py
```

## Verificación

```text
Bloque 1 focal: 15 passed
RFC-030 drawing/content: 42 passed
Regresión global: 580 passed, 2 warnings
compileall: PASS
git diff --check: PASS
TRACKED_SIDE_EFFECTS=0
EXTERNAL_PROVIDER_CALLS=0
```

Warnings existentes fuera del Bloque 1:

1. Deprecation warning de Starlette/httpx.
2. Warning de cleanup interno de IFCOpenShell en `test_ifc_invalid_rejected`.

## Freeze y alcance

```text
H-001: untouched
H-002: untouched
H-003: untouched
H-004: untouched
H-005: untouched
main: untouched
F2 branch: untouched
Bloque 2: no iniciado
```

El Bloque 2 queda detenido hasta nueva autorización y revisión del Bloque 1 runtime.
