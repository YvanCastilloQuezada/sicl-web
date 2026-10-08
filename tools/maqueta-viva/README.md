# ARKI MAQUETA VIVA — ejecución local y evidencia

## Inicio cotidiano (un solo acceso directo)

Ejecutar `ARKI-MAQUETA-VIVA.cmd` desde el repositorio. Abre la maqueta local; no necesita un servidor público. Las fichas y ubicaciones son borradores del navegador. **No constituyen integración de código ni estado canónico**.

## Ensamblaje

1. Elegir F1–F10 en la barra derecha.
2. Seleccionar una idea o componente histórico desde la izquierda o los botones amarillos.
3. Arrastrar la pieza a la mesa azul o elegir destino y `Ubicar pieza`.
4. Completar la ficha: repositorio, ruta, SHA exacto, prueba declarada y dependencias.
5. Exportar el borrador `arki-maqueta-borrador.json` para respaldo.

La indicación `LISTA PARA SOLICITAR AUDITORÍA` solo indica que hay referencias declaradas y dependencias ubicadas. **No indica que los tests se ejecutaron ni que el componente está integrado.**

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
