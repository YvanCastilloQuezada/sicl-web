# Experience Engine

El Experience Engine traduce un evento autoritativo en fases narrativas y modos de pantalla. `createExperience` selecciona una plantilla por juego, define fases, interacción virtual, modo TV, modo móvil, política de contingencia y siguiente evento.

Las transiciones de experiencia son distintas de las transiciones oficiales de ronda. Una experiencia puede entrar en contingencia, pero nunca puede alterar el resultado o saltar las reglas del Event Engine. La experiencia es `virtualOnly: true`.

Plantillas vigentes: `LOTTERY_STANDARD`, `LOTTERY_JACKPOT`, `BINGO_STANDARD`, `ROULETTE_STANDARD`, `TRIO_STANDARD` y `SPECIAL_EVENT`. Cada una es un contrato de presentación; las probabilidades y premios provienen exclusivamente del Game Core y del ruleset publicado.

## Pruebas

`shared/experienceEngine.test.ts` verifica creación, subordinación al Event Engine y plantillas. La prueba E2E completa de programa/bloque/evento requiere persistencia de esas entidades y permanece pendiente.
