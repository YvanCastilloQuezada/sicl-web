# ARKI — Autoensamblaje del Árbol Vivo · Entrega local 0.1

**No modifica GitHub, Core, AGK, D-2 ni estados FROZEN.** Prototipo independiente para integrar posteriormente en `sicl-web` tras comparar con el árbol existente.

## Funciona ahora
- Registro de capacidades con 10 fases, autoridad, dependencias, contratos y evidencia.
- Validación de entradas, detección de dependencias faltantes y ciclos.
- Planificador **determinista** de tres alternativas por capacidad: DIRECT, ADAPTER y LAB.
- Ensayo **dry-run** de bloqueos; no ejecuta motores ni edita geometría.
- Registro estructurado de decisión humana; gate de ejecución intencionalmente **cerrado**.
- Tests unitarios sin dependencias de npm externas (Node 22 y TypeScript global instalado).

## Mañana: ejecutar en Windows PowerShell
1. Descomprimir `arki-autoensamblaje.zip` en una carpeta de trabajo.
2. Instalar Node.js 22 y TypeScript si faltan (`npm install -g typescript`).
3. `cd arki-autoensamblaje`
4. `npm run test`
5. `npm run demo`
6. `npm run inspect`
7. `node dist/src/cli.js plan examples/capabilities.json IFC_WALL`

El JSON de `examples` contiene **ejemplos sintéticos con UNKNOWN**: no demuestra capacidades reales ni asignaciones canónicas a fases. Para el inventario real, extraer contratos de los repositorios y sustituirlo por evidencia verificable.

## Integración segura propuesta
1. Comparar este evaluador con el Árbol Vivo, Árbol Gemelo Digital, Capability Fabric y SelfCare existentes. Reutilizar contratos, no duplicarlos.
2. Mapear las **10 fases oficiales**; el campo `phase` actual es solo dato declarado por registro.
3. Añadir adaptador de lectura del inventario y motor de experimentos real aislado; no dar permisos de escritura canónica al descubridor.
4. Conectar la aprobación humana con la cola existente `server/arkiSelfCareProposals.ts` y autenticación efectiva.
5. Habilitar ejecución únicamente tras CI, pruebas adversariales, rollback, revisión humana y evidencia por SHA.
6. Incorporar resultados de aprendizaje por Delta 6.2. No auto-promocionar conocimiento.

## Límites explícitos
No hay agente continuo, descubrimiento automático de GitHub, LLM autónomo, ejecución de cambios, conexión al Gemelo Vivo real, simulación 3D, exportación IFC ni pruebas E2E del sistema existente. Es una base determinista **propuesta y comprobable**, no el autoensamblaje final.
