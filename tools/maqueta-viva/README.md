# ARKI MAQUETA VIVA — ejecución local y evidencia

## Inicio cotidiano (un solo acceso directo)

Ejecutar `ARKI-MAQUETA-VIVA.cmd` desde el repositorio. Abre la maqueta local; no necesita un servidor público. Las fichas y ubicaciones son borradores del navegador. **No constituyen integración de código ni estado canónico**.

## Uso actual — fases, vertebral, bandeja y propuestas

1. Abrir el acceso directo local. **F1–F10 están en la barra superior**, con colores de identidad distintos; **la bandeja de piezas está a la derecha** y la mesa azul ocupa el centro.
2. Seleccionar una fase. Se abre por defecto **Columna vertebral y espinas**, con cuatro hitos estructurales **propuestos**. La vista `Mesa libre` conserva las tarjetas móviles.
3. Elegir una idea de la bandeja derecha y pulsar `Ubicar` o arrastrarla a la mesa. Una pieza ubicada desaparece de la bandeja; `X` la devuelve. Ubicar una pieza no equivale a integrarla.
4. Vincular una espina a un hito explícitamente; las sugerencias textuales requieren decisión humana. `Referencia propuesta` y `Alternativa A` son escenarios locales, **no el roadmap oficial**.
5. Para declarar una dependencia entre dos piezas: `Conectar piezas`, seleccionar origen (pieza que depende) y destino (pieza necesaria); la línea punteada es **propuesta local no verificada**.
6. Abrir `Ideas ARKI` o `Volver a decisiones` para consultar diagnósticos recalculados desde la instantánea local. `Aprobar evaluación` **no autoriza** ejecutar cambios ni hacer merge.
7. La **Evolución 05 / ARKI Autocorrectivo** prepara un caso con impacto y autorización local `AUTORIZO`. El ejecutor GitHub V0 exige PR de alcance limitado, SHA exacto, autorización del propietario, revisión independiente Qwen y CI. **No ejecuta reparaciones por sí mismo**.
8. Exportar `arki-maqueta-borrador.json` para conservar fichas, escenarios y decisiones. La maqueta funciona offline y **no detecta por sí sola ramas remotas**: actualizar la copia local y relanzar para refrescar el corte fuente.

**Evolución 03 / Gemelo Digital:** panel de preparación y trazabilidad del proyecto, **no gemelo físico-operacional certificado**. Ver `docs/arki-master-map/ARKI_DIGITAL_TWIN_REAL_DATA_GATE_2026-10-08.md`. **S10:** la ingestión estructurada existe, pero el backup SQL Server real requiere caracterización/restore aislado y conciliación antes de declarar un baseline real aceptado.

## Verificación GitHub de solo lectura (opcional)

Con Node 22 o posterior y conexión a Internet, desde la raíz del repositorio:

```powershell
Set-Location "C:\ARKI\repos\sicl-web"
node tools/maqueta-viva/verify-github-evidence.cjs "$HOME\Downloads\arki-maqueta-borrador.json" "$HOME\Downloads\arki-maqueta-evidencia.json"
```

Si el repositorio es privado, puede ser necesario un `GH_TOKEN` o `GITHUB_TOKEN` con permisos **de lectura** para contenido y Actions. No pegues el token en el chat.

La herramienta consulta GitHub sin modificarlo: confirma que el commit exacto existe, que el archivo está presente en ese commit y si hay alguna ejecución de Actions exitosa asociada a ese mismo SHA. **Una ejecución exitosa cualquiera no acredita la prueba declarada**. Respuestas 403, 404 o errores de red quedan como `UNKNOWN`, nunca como PASS.

En la maqueta, pulsar `Cargar observación GitHub` e importar el JSON producido. El navegador comprueba coincidencia de pieza/repositorio/archivo/SHA con la ficha local y presenta el resultado como **reporte importado no atestado**, no como evidencia canónica. Las observaciones no se guardan permanentemente y se descartan al modificar la ficha o importar otro borrador.

## Pruebas

```powershell
node tools/maqueta-viva/test-maqueta-viva.cjs
node tools/maqueta-viva/test-github-evidence.cjs
```

GitHub Actions también ejecuta ambas suites en `.github/workflows/maqueta-viva-smoke.yml`. Los tests de GitHub usan una API simulada, no comprueban la cuenta real. La ejecución visual en Windows debe verificarse aparte.

## Límites y reglas

- **CLAIM ≠ IMPLEMENTED ≠ EXECUTED ≠ VERIFIED ≠ FROZEN.**
- Ningún reporte importado, por sí mismo, modifica `ARKI_MASTER_MAP_STATE.json`, Core, D-2, AGK o el estado de integración.
- No se ejecutan comandos de prueba declarados en fichas; son solo texto.
- No se eliminan piezas ni deudas por moverlas. FROZEN sigue siendo de solo lectura.
- No se asegura persistencia `localStorage` en todos los navegadores con `file://`; usar Exportar JSON como respaldo.
