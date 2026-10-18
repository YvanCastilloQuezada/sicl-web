# Avatar Orchestrator

El Avatar Orchestrator es una capa de presentación basada en guiones deterministas. Puede representar `IDLE`, `WELCOME`, `INTRO`, `COUNTDOWN`, `EXCITED`, `SUSPENSE`, `DRAWING`, `RESULT`, `CELEBRATION`, `CONTINGENCY` y `GOODBYE` en una futura implementación visual.

En el piloto actual solo existe `shared/avatarScripts.ts`, que genera frases seguras en español peruano. No hay Avatar 3D, rig, animación facial, streaming de voz ni TTS. El guion consume hechos del manifest y no puede decidir resultados, números, premios, reglas ni horarios.

La incorporación de IA o TTS requiere proveedor, secretos, moderación, política de idioma y revisión humana. Cualquier fallo debe usar contenido estático seguro y no detener el Game Core.
