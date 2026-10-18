# ARKI Autoensamblaje v0.2 — prototipo local, sin escritura canónica

Este paquete es independiente de GitHub y no modifica los repositorios ARKI.

## Objetivo
Organizar las piezas del Árbol Vivo **desde una meta explícita**. Cada actividad tiene antecedentes (predecessors), sucesores derivados, fase, duración estimada y estado de evidencia. El planificador calcula orden topológico, ruta crítica, holgura y disponibilidad real. **Una actividad no está lista si algún antecedente no está VERIFIED.** La fase por sí sola no reemplaza una dependencia explícita.

Las duraciones del ejemplo son **ficticias** para demostrar el algoritmo; no son cronograma real de ARKI. Las fases del ejemplo son ilustrativas y no redefinen las diez fases canónicas.

## Uso en Windows / PowerShell
Requiere Node.js 22 y TypeScript (`tsc`) disponible o `npm install --save-dev typescript @types/node` (requiere internet). Ejecutar dentro de esta carpeta:

```powershell
npm run test
npm run roadmap
npm run inspect
npm run demo
```

Editar `examples/roadmap.json` para probar otras metas, dependencias, estados y duraciones. `targetActivities` determina qué cadena importa para la meta. Una actividad no relacionada no altera la ruta crítica.

## Contratos y límites
- Planificación determinista y solo lectura.
- Detecta ciclos, actividades inexistentes, fases inválidas y metas incompletas.
- `VERIFIED` es un dato de entrada aportado por el operador, **no verificación automática**.
- Tres opciones de ensamblaje siguen disponibles mediante `npm run demo`.
- No integra todavía el registro real del Árbol Vivo, ni ejecuta AGK/IFC, ni aprueba cambios, ni realiza aprendizaje autónomo real.
- Gemelo experimental: solo simulación lógica en v0.2.
- No crear motores ni autoridades paralelas.
- Referencia documental: `docs/arki-master-map/ARKI_MASTER_MAP_LIVE.md`, sección 7 (capability record), sección 13 (ruta de diez fases, conexiones, gates y fuente estructurada); `docs/arki-post-513-inventory/ARKI_CAPABILITY_COMPOSITION_GRAPH.md`.
- Regla del Product Owner: ensamblar hacia una meta con antecedentes, sucesores y ruta crítica; solo el humano valida decisiones.

## Mañana
1. Ejecutar `npm run test` y guardar la salida.
2. Ejecutar `npm run roadmap` y verificar la cadena crítica.
3. Reemplazar el ejemplo por el mapa real y revisar fases, dependencias y evidencia.
4. Solo después conectar al Árbol Vivo existente.

## Guardian v0.3 — observador autónomo local (Python 3.10+, biblioteca estándar)
Se incorpora `guardian/arki_guardian.py` para vigilancia local por ciclos, persistencia SQLite, bandeja de tres alternativas y aprobación humana. El observador no modifica Core, geometría, código ni repositorios; tampoco ejecuta una opción aprobada. El aprendizaje autónomo profundo, integración real con Delta 6.2, notificaciones push, investigación continua en internet y pruebas de geometría son fases pendientes.

Desde la carpeta del paquete:
```powershell
python -m unittest discover -s guardian/tests -v
python guardian/arki_guardian.py once
python guardian/arki_guardian.py inbox
python guardian/arki_guardian.py status
python guardian/arki_guardian.py watch --interval 3600
```
El modo `watch` funciona **solo mientras la computadora y el proceso estén encendidos**. Para recibir avisos hay que consultar `inbox`; no se ha configurado mensajería externa. La aprobación de una opción es solo documental y exige gate de ejecución separado:
```powershell
python guardian/arki_guardian.py approve --proposal G-IDENTIFICADOR --option C --actor PROPIETARIO
```
`research --url https://www.buildingsmart.org/` realiza una consulta manual de metadatos a un dominio permitido, sin rastreo autónomo, sin ejecución remota y sin inferir conocimiento de contenidos no analizados. La conexión real a internet requiere disponibilidad de red. El objetivo editable está en `guardian/goal.json`; el registro de ejemplo en `examples/capabilities.json`. No se declaran verificadas capacidades por aparecer en el registro.
