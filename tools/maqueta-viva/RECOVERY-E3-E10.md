# ARKI Árbol Vivo — Recuperación experimental E3–E10

**Ámbito:** rama `docs/av-ui-001-preparation-20261010`. **No es una modificación del Core canónico.**

## Estado de evidencia

- E3–E10, integración E8/E9 y validación previa de importaciones: **PASS local reportado por PowerShell 7.6.6** en `43150330f2f2afc7223781972d0a7c855de94829`.
- Endurecimiento posterior de recuperación (reinicio en dos procesos Edge, persistencia E5–E9, lectura de vuelta de `localStorage`, límites de tamaño y cronología): **IMPLEMENTED / AWAITING EXECUTION**.
- No se ha demostrado recuperación ante eliminación del perfil, corrupción del disco, fallos de alimentación ni restauración entre equipos.
- Las observaciones E6 permanecen **UNVERIFIED**, las decisiones E7/E9 permanecen **PROVISIONAL_ONLY** y la verificación documental sigue **UNKNOWN**.
- El panel E10 no autoriza `FROZEN` ni promoción canónica.

## Garantías implementadas

1. `importTwinWorkspace` valida los registros E5/E6/E7/E9 y realiza prevalidación de fases e historial antes de modificar el estado local.
2. La importación rechaza historiales con versiones fuera de orden o repetidas, y cadenas de revisión divergentes.
3. Las importaciones de texto superiores a 2.000.000 de unidades de código JS se rechazan. **Esto no equivale a un límite exacto en bytes UTF-8.**
4. `saveTwinBrowser` exige lectura idéntica de `localStorage` tras la escritura antes de informar éxito. No demuestra durabilidad física ante fallo de energía.
5. `loadTwinBrowser` rechaza contenido ausente, inaccesible, excesivo, malformado o inválido sin promover registros.
6. El nuevo paso de prueba de Edge usa dos procesos consecutivos con el mismo perfil y origen `file://`; guarda una fase, snapshot, rama, evidencia, decisión y revisión y comprueba su recuperación y enlaces.

## Ejecución

En PowerShell 7, desde el worktree aislado `C:\ARKI\repos\sicl-web-arbol-vivo`:

```powershell
pwsh -NoProfile -File ".\tools\maqueta-viva\Test-ARKI-GemeloArbol.ps1"
```

El script falla ante errores, guarda el informe en `%LOCALAPPDATA%\ARKI\ArbolVivo\Tests` y no debe ejecutarse sobre el worktree canónico. **El resultado PASS debe proceder de una ejecución real, no del código o de esta documentación.**

## Límites conocidos

- `localStorage` depende del perfil y políticas de Edge; no es almacenamiento transaccional ni una base de datos.
- El prototipo es una representación documental y sintética; no demuestra cálculos geométricos, simulación arquitectónica, autenticidad de fuentes ni equivalencia con el AGK.
- La bandera `canonicalMutation:false` y el aislamiento del worktree son barreras de este experimento, no una auditoría integral de todo el producto.
- La recuperación posterior al reinicio se prueba con cierre normal del proceso; no cubre fallos abruptos ni sincronización entre dispositivos.

**Regla:** CLAIM ≠ IMPLEMENTED ≠ EXECUTED ≠ VERIFIED ≠ FROZEN.
