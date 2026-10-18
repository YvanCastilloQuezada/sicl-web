# MiLukita Character State Machine

Estados soportados: `IDLE`, `INTRO`, `PRESENTING`, `INTERACTING`, `WAITING`, `CELEBRATING`, `TRANSITION`, `RESULT`, `FAREWELL`, `HIDDEN` y `EMERGENCY`.

Las transiciones están definidas en `shared/characterOs.ts`. Cada cambio debe registrar estado anterior, nuevo estado, evento, personaje, timestamp y razón. `RESULT` y `EMERGENCY` son modos silenciosos. Un salto inválido se rechaza y se conserva el estado anterior.
