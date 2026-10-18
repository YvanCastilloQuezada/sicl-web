# MiLukita Character Experience System

## Dictamen

Se implementó una primera capa gobernada de Character OS sobre Entertainment OS. Lukita permanece como anfitriona principal; Ruli, Mascota y Personaje temático existen únicamente como `SPEC/MOCK` o propuestas, no como assets 3D finales. El personaje no es un agente: el personaje define identidad, visual, voz y animación; el Director propone decisiones de presentación; la política autoriza o rechaza.

## Jerarquía

`MJP CORE → Event Engine → Experience OS → Lukita Director → Character/Casting System → Presentation OS → TV/Web/Mobile`.

Ninguna capa de Character OS puede modificar RNG, RTP, reglas, resultados, wallet, créditos, ledger, liquidación, Event Store autoritativo, MjpTvManifest ni permisos de agentes.

## Implementado

`shared/characterOs.ts` contiene Character Registry tipado, perfiles, estados, transiciones permitidas, canales, compatibilidad, límites de exposición, modo silencioso, fallback y política de aparición. `CharacterExperiencePanel.tsx` permite revisar a Lukita, ver el registro, cambiar intensidad, probar transiciones y simular Kill/Restore de presentación sin tocar el núcleo. El panel está integrado en Control Room.

## Estados y política

Los estados no saltan arbitrariamente. `RESULT` y `EMERGENCY` activan presentación silenciosa: solo contenido aprobado, tarjeta estática o host gráfico. Si falla el modelo 3D, la ruta prevista es 3D → 2D → tarjeta → texto/gráfico. Si falla Character OS, el evento continúa.

## Evidencia y límites

La validación local cubre transiciones, aparición por canal, fallback, silencio, aislamiento y permisos. No certifica assets 3D productivos, voz, TTS, lip-sync, hardware, staging, multiinstancia ni operación 24/7 real. La aprobación estética definitiva de Lukita continúa bajo control del propietario.
