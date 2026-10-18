# Game Mathematics Registry

Cada modalidad publicable debe tener un expediente con juego, versión, ruleset, probabilidades, tabla de premios, RTP teórico, RTP simulado, RTP empírico, política de redondeo, aprobación y auditoría.

## Regla de publicación

Si falta cualquier componente o existe discrepancia entre fórmula, tabla y simulación, el estado es `BLOCKED — MATHEMATICS REVIEW`. No se corrigen silenciosamente las matemáticas ni se presenta un RTP estimado como observado.

## Estado del piloto

El proyecto ya conserva configuraciones, reglas publicadas, simuladores y dashboards de RTP para modalidades virtuales. La auditoría independiente del RNG, las tablas y la homologación no está completada. Por ello, `PRODUCTION_READY` permanece sin asignar.

## Evidencia mínima

La aprobación debe incluir una revisión de fórmula, probabilidades, tabla, simulación reproducible, desviación observada, política de redondeo y firma de revisión. Las modalidades con reglas incompletas deben quedar fuera del Scheduler publicable.
