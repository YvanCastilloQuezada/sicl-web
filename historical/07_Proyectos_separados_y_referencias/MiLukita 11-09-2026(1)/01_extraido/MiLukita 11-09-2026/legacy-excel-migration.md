# Migración controlada del libro Ruleta Perú

El archivo XLSM histórico se utiliza únicamente como referencia de reglas operativas y de estructuras de prueba. La plataforma web no ejecuta macros, controles ActiveX, vínculos externos, rutas locales ni fórmulas de hoja.

| Componente histórico | Tratamiento en el piloto web |
|---|---|
| Reglas de Ruleta, Jackpot, Bingo y Lotería | Se normalizan como versiones publicables en `game_rulesets`. |
| Boletos de ejemplo y resultados de prueba | Se sustituyen por boletos ficticios generados por el backend. |
| Cálculos de premios | Se implementan en el motor de liquidación del servidor y se registran en `wallet_transactions`. |
| Macros, formularios VBA y ActiveX | Se excluyen por completo. |
| Rutas locales y vínculos externos | Se excluyen por completo. |
| Datos personales, teléfonos, DNI y registros de jugadores del libro | No se migran ni se usan como datos de prueba. |

El primer uso de la acción **Preparar rondas y reglas** crea las reglas iniciales `v1.0.0`, las rondas demostrativas, las misiones y las promociones del piloto. Las revisiones posteriores se publican con una versión nueva y nunca modifican expedientes ni rondas históricas.
