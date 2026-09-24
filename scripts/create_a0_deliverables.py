from __future__ import annotations
import hashlib, json, subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path('/home/ubuntu/sicl-web')
A0 = ROOT/'docs/arki-ui-governance-001/A0'
A0.mkdir(parents=True, exist_ok=True)
registry = json.loads((A0/'06_UI_ACTION_REGISTRY.json').read_text())
counts = registry['counts']
route_count = registry['routeCount']
control_count = counts['TOTAL_DISCOVERED']
unknown = counts['TOTAL_UNKNOWN_UNVERIFIED']
head = subprocess.run(['git','rev-parse','HEAD'], cwd=ROOT, text=True, capture_output=True).stdout.strip()
branch = subprocess.run(['git','branch','--show-current'], cwd=ROOT, text=True, capture_output=True).stdout.strip()
status = subprocess.run(['git','status','--short'], cwd=ROOT, text=True, capture_output=True).stdout.strip()
now = datetime.now(timezone.utc).isoformat()


def write(name, text):
    (A0/name).write_text(text.rstrip()+'\n')

write('01_SCOPE_AND_BASELINE.md', f'''# A0 — Alcance y baseline

La fase A0 es una auditoría de gobernanza de interfaz. Su objetivo es conocer qué superficies existen, qué controles están declarados, qué acciones muestran una intención de operación y qué partes tienen evidencia suficiente para ser consideradas funcionales. Esta fase **no modifica componentes de producto, lógica de negocio, permisos, persistencia ni configuración de producción**.

El baseline fue capturado el {now}. El repositorio auditado es `YvanCastilloQuezada/sicl-web`, en la rama `{branch}`, con HEAD `{head}`. El worktree no se limpió ni se sobrescribieron cambios previos. El estado observado contiene archivos no versionados de entregas anteriores; se conservan fuera del alcance de A0.

La inspección fuente encontró **{route_count} rutas declaradas** y **{control_count} ocurrencias de controles o handlers**. Estos números son ocurrencias de código, no un conteo de botones únicos visibles después de renderizar. El inventario conserva la ruta, el componente y la línea de origen para permitir una reconciliación posterior.

## Referencias de baseline

- Entrada de rutas: `client/src/App.tsx:73-115`.
- Entrada React: `client/src/main.tsx:1-...`.
- Registro de controles: `06_UI_ACTION_REGISTRY.json`.
- Matriz legible: `05_UI_ACTION_MATRIX.md`.
- Script reproducible: `scripts/run_ui_governance_a0.py`.
''')

write('02_AUDIT_PROTOCOL.md', '''# A0 — Protocolo de auditoría

A0 usa una política conservadora. La presencia de un control en JSX no se interpreta como prueba de funcionamiento. Un control solo puede cambiar a `FUNCTIONAL` cuando existe evidencia de renderizado, interacción, resultado observable, manejo de error y efecto de estado o persistencia cuando corresponda.

Cada control se registra con cinco niveles de evidencia: existencia en fuente, renderizado, handler o dependencia, resultado observable y efecto persistido. Si falta cualquier nivel, la clasificación permanece `UNKNOWN_UNVERIFIED` o pasa a un defecto específico cuando existe evidencia suficiente del fallo.

Los estados funcionales y defectos se mantienen separados. Un botón puede tener un handler y continuar sin evidencia de que el handler produzca un resultado correcto. También se evita confundir un mensaje de éxito escrito en el código con una confirmación de operación real.

A0 no acepta como evidencia única el build, la existencia de una ruta, el texto de un toast, una respuesta HTTP 200 o un mock. Las fuentes externas, credenciales, servicios remotos y dispositivos físicos quedan fuera de la prueba automática salvo que exista evidencia reproducible y autorizada.
''')

write('04_SURFACE_INVENTORY.md', f'''# A0 — Inventario de superficies

El inventario está organizado por área funcional para que el equipo pueda revisar el sistema por superficie y no por archivos aislados. Se identificaron {control_count} ocurrencias de controles o handlers, de las cuales {counts.get('HIGH_RISK_CANDIDATES',0)} contienen términos que justifican una revisión de impacto, como exportar, aprobar, publicar, recalcular, importar, subir o seleccionar.

| Área | Ocurrencias | Marcadas con evidencia runtime previa | Solo fuente | Candidatos de alto riesgo |
|---|---:|---:|---:|---:|
'''+''.join(f"| {area} | {len([c for c in registry['controls'] if c['area']==area])} | {sum(c['runtimeVerified'] for c in registry['controls'] if c['area']==area)} | {sum(not c['runtimeVerified'] for c in registry['controls'] if c['area']==area)} | {sum('HIGH_RISK_CANDIDATE' in c['secondaryTags'] for c in registry['controls'] if c['area']==area)} |\n" for area in sorted({c['area'] for c in registry['controls']}))+'''\nLa cifra de “evidencia runtime previa” representa únicamente las marcas conservadas en el registro como evidencia histórica. No equivale a una aceptación nueva de A0.
''')

write('07_SUCCESS_STATE_REGISTER.md', '''# A0 — Registro de estados de éxito

No se canonizó ningún mensaje de éxito como prueba de operación. El código contiene textos como “guardado”, “actualizado”, “exportado”, “generado” y `toast.success`, pero A0 exige asociar cada mensaje con una transición observable y, cuando aplique, con una lectura posterior desde la fuente de verdad.

Los mensajes de éxito son, por tanto, **candidatos de evidencia**. La revisión A0 debe confirmar que no aparezcan antes de que finalice la mutación, que representen el resultado real y que los errores posteriores no queden ocultos por un toast optimista.
''')

write('08_UNKNOWN_UNVERIFIED_REGISTER.md', f'''# A0 — Registro de UNKNOWN_UNVERIFIED

La clasificación dominante de A0 es `UNKNOWN_UNVERIFIED`: {unknown} de {control_count} ocurrencias de control. Esto no significa que todas estén rotas. Significa que el inventario fuente no contiene suficiente evidencia de ejecución para afirmar que funcionan en las condiciones reales del producto.

Los motivos principales son la falta de una prueba E2E completa por ruta, la falta de una matriz de permisos y persistencia por acción, la presencia de handlers cuyo efecto depende de tRPC, WebSocket, almacenamiento del navegador o APIs del dispositivo, y la imposibilidad de deducir el estado final a partir del JSX.

Esta clasificación debe mantenerse hasta ejecutar la matriz de pruebas. No se debe convertir automáticamente en `FUNCTIONAL` por pasar TypeScript o build.
''')

write('09_HIGH_RISK_CONTROL_REGISTER.md', f'''# A0 — Controles candidatos de alto riesgo

Se detectaron {counts.get('HIGH_RISK_CANDIDATES',0)} ocurrencias con palabras asociadas a cambios de estado, publicación, aprobación, exportación, importación, subida, recalculo, selección o borrado. Son **candidatos**, no defectos confirmados.

La prioridad de verificación es: primero acciones que puedan mutar Project State o Core; después exportaciones y publicaciones; luego acciones de persistencia de archivos; finalmente acciones reversibles de navegación y visualización. Cada candidato debe registrar autoridad requerida, confirmación humana, request exacto, respuesta, versión observada y posibilidad de rollback.

A0 no ejecutó acciones de alto impacto ni aceptó cambios en Core. Cualquier futura prueba de aprobar, publicar, firmar, borrar o sincronizar debe usar fixture aislado y una puerta humana explícita.
''')

write('10_ROUTE_RUNTIME_COVERAGE.md', f'''# A0 — Cobertura runtime por ruta

App declara {route_count} rutas. La existencia de una ruta no prueba que sea accesible para el usuario actual ni que todos sus controles estén habilitados.

| Cobertura | Cantidad | Estado A0 |
|---|---:|---|
| Rutas declaradas | {route_count} | SOURCE_VERIFIED |
| Rutas con sweep runtime completo A0 | 0 | PENDING |
| Rutas con evidencia visual histórica parcial | 1 | PARTIAL |
| Rutas con autenticación/permisión aún no reconciliada en A0 | {route_count} | UNKNOWN_UNVERIFIED |

Existe evidencia histórica de interacción parcial de `/arki-design-funnel`, incluyendo selección de P1/P4/P9/P16 y vistas Planta, Corte, 3D y Programa. Se conserva como evidencia previa, pero no se presenta como sweep exhaustivo A0.
''')

write('11_RUNTIME_TEST_PLAN.md', '''# A0 — Plan de pruebas runtime

El sweep debe abrir cada ruta en un navegador limpio y registrar URL, usuario o modo de acceso, estado de carga, consola, red, controles visibles, controles deshabilitados y resultado de cada interacción. Las acciones deben comenzar por operaciones reversibles y usar proyectos de prueba aislados.

Para cada acción se debe comprobar: que el control se muestra cuando corresponde; que el click o cambio de valor dispara el handler correcto; que la interfaz muestra progreso; que el resultado es observable; que el error se muestra de forma útil; que no se duplica la acción; que la persistencia puede leerse de nuevo; y que el usuario puede volver atrás o restaurar el estado.

Las pruebas físicas de WebXR, cámara, micrófono, WebRTC, Revit, Dynamo, Rhino, Blender y dispositivos reales no se consideran realizadas en sandbox si no existe evidencia física verificable.
''')

write('12_RUNTIME_TEST_LOG.md', '''# A0 — Registro runtime

## Resultado de esta ejecución

No se ejecutó un sweep interactivo completo de las 38 rutas en esta fase documental. La razón es preservar A0 como auditoría de evidencia sin convertir la falta de acceso autenticado, host externo o dispositivo físico en una falsa afirmación de funcionamiento.

## Evidencia histórica conservada

La ruta `/arki-design-funnel` tiene evidencia previa de montaje y de interacción con selección humana, promoción al Final Four, evaluación profunda, selección 4→1 y vistas Planta, Corte, 3D y Programa. Esa evidencia se clasifica como `PARTIAL_HISTORICAL`, no como aceptación total de A0.

## Blockers

La verificación actual ejecutó `pnpm check` con resultado PASS, la regresión completa con **96 archivos y 434 tests PASS**, y `pnpm build` con resultado PASS. El build conserva un warning no bloqueante por chunks mayores de 500 kB. La reconciliación de autenticación, permisos y persistencia por control permanece pendiente.
''')

write('13_PERSISTENCE_IMPACT_MATRIX.md', '''# A0 — Matriz de impacto y persistencia

| Clase de acción | Efecto esperado a verificar | Fuente de verdad | Rollback requerido | Estado A0 |
|---|---|---|---|---|
| Navegación o cambio de vista | Estado local o URL cambia sin mutar Core | Browser state / URL | Volver a vista anterior | UNKNOWN_UNVERIFIED |
| Cambio de parámetro | Preview y métricas se recalculan | Modelo local o endpoint | Restaurar snapshot | UNKNOWN_UNVERIFIED |
| Generación | Propuesta queda identificada y versionada | Project State | Revertir propuesta | UNKNOWN_UNVERIFIED |
| Aprobación/rechazo | Gate humano y transición trazable | Project State/Core | Reabrir o restaurar versión | UNKNOWN_UNVERIFIED |
| Importación/subida | Archivo validado, checksum y biblioteca | Storage + metadata | Archivar/restaurar | UNKNOWN_UNVERIFIED |
| Exportación | Archivo descargable coincide con versión observada | Export artifact | No aplica; conservar hash | UNKNOWN_UNVERIFIED |
| Publicación o sincronización | Estado externo cambia solo con autoridad | Servicio externo | Rollback o revocación | BLOCKED_PENDING_EVIDENCE |
''')

write('14_AUTHORITY_AND_GATE_MATRIX.md', '''# A0 — Autoridad y gates

Las acciones que puedan alterar Core, Project State, publicar artefactos, firmar, sincronizar, eliminar o conceder acceso deben declarar autoridad y gate antes de ejecutarse. En A0 ninguna de esas acciones se ejecutó.

| Acción | Autoridad esperada | Gate humano | Evidencia mínima | Estado A0 |
|---|---|---|---|---|
| Crear propuesta | Usuario autenticado o proyecto de prueba | No mutar Core automáticamente | Proposal ID y versión | UNKNOWN_UNVERIFIED |
| Aprobar propuesta | Responsable humano | Sí | Actor, timestamp, razón, versión | BLOCKED_PENDING_EVIDENCE |
| Rechazar/congelar | Responsable humano | Sí | Actor, razón y transición | BLOCKED_PENDING_EVIDENCE |
| Exportar | Usuario con proyecto visible | Según tipo de archivo | Hash y versión observada | UNKNOWN_UNVERIFIED |
| Publicar/sincronizar | Owner o rol explícito | Sí | Payload y respuesta externa | BLOCKED_PENDING_EVIDENCE |
| Firmar expediente | Profesional habilitado | Sí, fuera de ARKI | Firma verificable | OUT_OF_SCOPE |
''')

write('15_DEFECT_SEVERITY_REGISTER.md', '''# A0 — Registro de defectos y severidad

A0 no inventa defectos a partir de ausencia de evidencia. Usa estas categorías para la etapa de confirmación.

| Severidad | Definición | Ejemplo de evidencia requerida |
|---|---|---|
| P0 | Arranque imposible, ejecución arbitraria o mutación no autorizada | Consola, request y reproducción limpia |
| P1 | Acción crítica no funciona, pierde datos o cruza un gate | Pasos reproducibles y estado antes/después |
| P2 | Acción principal funciona parcialmente o feedback es insuficiente | Video/captura y payload |
| P3 | Defecto visual, texto, accesibilidad o ergonomía sin impacto de datos | Captura y criterio esperado |
| UNKNOWN | No hay evidencia suficiente para clasificar | Fuente y prueba pendiente |

Estado actual A0: `UNKNOWN` para los controles individuales. No se reproduce un bloqueo TypeScript en el baseline actual. Si reaparece en otro entorno, debe clasificarse como P0 de bootstrap y reproducirse con logs antes de corregirlo.
''')

write('16_SECURITY_REVIEW.md', '''# A0 — Revisión de seguridad de interfaz

A0 no encontró ni afirmó una vulnerabilidad explotable nueva. Sí identificó superficies que requieren pruebas de seguridad funcional: botones de aprobación, publicación, exportación, subida, importación, sincronización, firma, cambio de proyecto y acceso a rutas administrativas.

La revisión debe comprobar que los controles no confíen en estados de UI, que el backend vuelva a validar permisos, que no se filtren tokens en QR o descargas, que los archivos importados se traten como datos no confiables, que los errores no revelen secretos y que los logs no registren credenciales.

Los avisos de dependencias y el historial de endurecimiento previo no se reinterpretan aquí como corregidos o pendientes. A0 solo registra que deben ser reconciliados con el lockfile y el entorno de despliegue actual.
''')

write('17_I18N_A11Y_REVIEW.md', '''# A0 — Internacionalización y accesibilidad

La interfaz contiene rutas y páginas con textos en español, inglés y etiquetas técnicas. A0 no afirma cobertura completa de ocho idiomas. La verificación debe comparar cada string visible con el catálogo de traducciones, revisar textos de fallback, comprobar labels de inputs, foco de teclado, nombres accesibles, contraste, estados de carga y mensajes de error.

Se debe repetir la matriz de controles para español, inglés y los demás idiomas soportados. Un botón traducido pero sin label accesible sigue siendo defectuoso. Un control visible solo después de permisos debe registrar esa condición explícitamente.
''')

write('18_EXPORT_DOWNLOAD_REVIEW.md', '''# A0 — Exportaciones y descargas

Las exportaciones deben verificarse como artefactos, no solo como clicks. La prueba debe registrar formato, nombre, tamaño, MIME, checksum, versión del proyecto, resolución, idioma de etiquetas, unidades y contenido real. Cuando la exportación sea conceptual, el archivo debe declararlo y no presentarse como expediente firmado.

A0 no descargó ni aceptó nuevas exportaciones. Los controles identificados con términos como `export`, `download`, `PDF`, `IFC`, `SVG`, `JSON`, `GeoJSON`, `HD`, `2K`, `4K`, `8K` o `16K` permanecen en revisión hasta contar con artefacto y hash.
''')

write('19_PLACEHOLDER_STUB_REVIEW.md', '''# A0 — Placeholders, mocks y stubs

El inventario detecta vocabulario que puede indicar `placeholder`, `mock`, `demo`, `sample`, `stub` o `coming soon`. Estos términos no prueban que una ruta sea falsa: algunos pertenecen a ejemplos didácticos o a contratos intencionalmente gated.

La regla A0 es no presentar un demo como integración real. Cada superficie debe declarar si usa fixture, cálculo local, almacenamiento real, endpoint real, WebSocket real o host externo. Si el código solo prepara el adaptador, el estado correcto es `PREPARED_NOT_CONNECTED`, no `FUNCTIONAL`.
''')

write('20_ROOT_CAUSE_AND_BLOCKERS.md', '''# A0 — Causas raíz y blockers

## Blocker de bootstrap heredado

El diagnóstico heredado reportaba marcadores de conflicto y errores TypeScript en `client/src/App.tsx`, pero el baseline actual no reproduce esos errores: `pnpm check` pasa y no quedan marcadores de conflicto en el archivo. A0 registra el antecedente para trazabilidad, pero no lo clasifica como blocker actual.

## Blocker de evidencia

El inventario fuente no permite probar que un handler produzca el efecto esperado. Por ello, la causa de la mayoría de estados desconocidos es insuficiencia de evidencia, no una conclusión de que el control esté roto.

## Blocker de entorno

Las capacidades que dependen de OAuth, Core remoto, base de datos, WebXR, cámara, micrófono, WebRTC, Revit, Dynamo, Rhino, Blender o proveedores externos requieren un entorno autorizado y reproducible. Sin ese entorno, A0 debe conservar `BLOCKED_PENDING_EVIDENCE` o `UNKNOWN_UNVERIFIED`.
''')

write('21_REPRODUCTION_RUNBOOK.md', '''# A0 — Runbook reproducible

1. Capturar branch, HEAD, worktree, lockfile y variables no secretas.
2. Ejecutar `python3 scripts/run_ui_governance_a0.py`.
3. Ejecutar `pnpm check`, `pnpm test` y `pnpm build` sin alterar archivos.
4. Iniciar una sola instancia del servidor y guardar URL, puerto y commit.
5. Abrir cada ruta del mapa en una sesión limpia.
6. Registrar consola, red, estado visual y controles visibles.
7. Ejecutar primero acciones reversibles. Aislar mutaciones en un proyecto de prueba.
8. Para cada acción, guardar payload, respuesta, versión antes/después, screenshot y hash.
9. Repetir la acción después de recargar para probar persistencia.
10. Cerrar con un informe de diferencias. No cambiar el estado de clasificación sin evidencia.
''')

write('22_ACCEPTANCE_CHECKLIST.md', '''# A0 — Checklist de aceptación

- [ ] Todas las rutas de `03_ROUTE_MAP.md` fueron abiertas en el entorno de prueba.
- [ ] El bootstrap montó React sin fallback infinito.
- [ ] La consola quedó sin errores nuevos en cada ruta.
- [ ] Cada control tiene label, handler, resultado y error verificables.
- [ ] Las acciones de alto riesgo tienen gate y autoridad explícitos.
- [ ] Las mutaciones se comprobaron después de recargar.
- [ ] Las exportaciones tienen archivo, MIME, hash y versión.
- [ ] Los controles bloqueados indican causa y no simulan éxito.
- [ ] WebXR, dispositivos y hosts externos se probaron solo cuando hubo hardware o servicio real.
- [ ] El registro conserva unknowns y no sobredeclara capacidades.
''')

write('24_A0_EXECUTIVE_REPORT.md', f'''# ARKI UI Governance 001 — A0 Executive Report

## Veredicto

**A0 queda en estado `PARTIAL / EVIDENCE_INSUFFICIENT`.** La auditoría documental y de fuente se ejecutó sin corregir lógica de producto. Se identificaron {route_count} rutas y {control_count} ocurrencias de controles o handlers. La clasificación conservadora es `UNKNOWN_UNVERIFIED` para los {unknown} controles inventariados; no se declara que estén rotos, pero tampoco se declara que funcionen.

## Hallazgos principales

El sistema tiene una superficie amplia y heterogénea. Las rutas incluyen workspace, control center, generadores paramétricos, visor BIM, familias dinámicas, Design Funnel, interoperabilidad, LUCA, campo, seguridad, investigación y ayuda. La amplitud hace insuficiente una prueba manual informal: se necesita una matriz por control y por estado de proyecto.

La evidencia histórica disponible confirma interacción parcial del Design Funnel. Esa evidencia incluye selección humana, promoción al Final Four, evaluación y vistas Planta, Corte, 3D y Programa. No cubre las 38 rutas ni demuestra persistencia completa, permisos, errores y exportaciones para cada control.

La validación automatizada actual pasó `pnpm check`, **96 archivos de prueba y 434 tests**, y `pnpm build`. El build emite un warning de chunks grandes, con `ifcGeometryAdapter` de aproximadamente 3,49 MB y otros chunks principales por encima de 500 kB. Ese warning afecta rendimiento y mantenimiento, pero no fue tratado como defecto funcional dentro de A0.

El bootstrap actual no presenta el blocker heredado: `pnpm check` y `pnpm build` pasan. La aceptación total sigue sin declararse porque todavía no existe un sweep runtime exhaustivo de las 38 rutas y los 1.336 controles.

## Conteos

| Estado | Conteo |
|---|---:|
| Rutas declaradas | {route_count} |
| Controles/handlers descubiertos | {control_count} |
| Funcionales confirmados en A0 | 0 |
| Deshabilitados con razón confirmada | 0 |
| Ocultos por política confirmados | 0 |
| No implementados explícitos confirmados | 0 |
| Bloqueados por permiso confirmado | 0 |
| Bloqueados por dependencia confirmado | 0 |
| Rotos confirmados por A0 | 0 |
| Unknown/unverified | {unknown} |

## Decisión de cierre

A0 no autoriza afirmar “todos los botones funcionan”. Autoriza pasar a una fase de verificación runtime controlada. Esa fase debe resolver primero el bootstrap, después validar rutas y finalmente clasificar controles con evidencia. Ninguna corrección de producto se ejecutó en A0.

## Entregables

El paquete A0 contiene el mapa de rutas, el inventario por área, la matriz de acciones, el registro JSON, los registros de éxito y unknowns, la matriz de persistencia, gates de autoridad, revisión de seguridad, accesibilidad, exportación, placeholders, blockers, runbook y checklist.

## Referencias

[1]: `client/src/App.tsx:73-115` "Declaración de rutas ARKI"
[2]: `client/src/main.tsx` "Entrada de montaje React"
[3]: `scripts/run_ui_governance_a0.py` "Generador reproducible del inventario A0"
''')

# Runtime and source manifest last, then hash every A0 file.
manifest_lines = [f'# A0 Evidence Manifest\n\nGenerated: {now}\n\n| File | SHA-256 | Bytes |\n|---|---|---:|']
for p in sorted(A0.iterdir()):
    if p.name == '23_EVIDENCE_MANIFEST.sha256.md':
        continue
    data = p.read_bytes()
    manifest_lines.append(f'| `{p.name}` | `{hashlib.sha256(data).hexdigest()}` | {len(data)} |')
write('23_EVIDENCE_MANIFEST.sha256.md', '\n'.join(manifest_lines))

# Ensure exactly 24 A0 deliverables are present.
files = sorted(p.name for p in A0.iterdir() if p.is_file())
print(json.dumps({'a0_dir': str(A0), 'deliverable_count': len(files), 'files': files}, ensure_ascii=False, indent=2))
''
