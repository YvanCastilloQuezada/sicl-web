# Catálogo adicional y horarios virtuales v1.0.0

**Estado:** preparado en el piloto gratuito. Todas las modalidades usan créditos virtuales, no admiten dinero real, pagos, retiros, transferencias ni valor económico.

## Organización por prioridad

| Prioridad | Modalidad | Estado de implementación | Mecánica resumida | RTP teórico |
|---|---|---:|---|---:|
| 1 | Sueldo de por vida | Implementado | 4 números de 30; el premio mayor se representa mediante 24 cuotas mensuales virtuales. | 84,8896 % |
| 2 | Raspa Digital | Implementado | Una casilla de 20; resultado verificable tras un cierre breve. | 85,0000 % |
| 3 | Pick 3 | Implementado | Tres dígitos, con repetición y coincidencia por posición. | 85,1000 % |
| 3 | Pick 4 | Implementado | Cuatro dígitos, con repetición y coincidencia por posición. | 84,8200 % |
| 4 | Loto Diario | Implementado | Cuatro números de 20 y una ronda diaria virtual. | 85,2012 % |
| 5 | Loto Express | Implementado | Tres números de 10 y rondas rápidas virtuales. | 85,0000 % |
| 6 | Bingo | Ya implementado | Flash, Keno y 75 conservan reglas y RTP publicados. | Según modalidad |

> **Importante:** el nombre “Sueldo de por vida” es solo una etiqueta de experiencia. Las 24 cuotas son créditos virtuales del piloto; no constituyen salario, renta, pensión, promesa de pago ni derecho exigible fuera de la aplicación.

## Tablas de premio virtual

| Modalidad | Condición | Premio total en créditos virtuales |
|---|---|---:|
| Sueldo de por vida | 4/4 | 21 600, representados como 24 cuotas de 900 |
| Sueldo de por vida | 3/4 | 16, liquidación única virtual |
| Raspa Digital | Casilla ganadora | 17 |
| Pick 3 | 3 posiciones | 500 |
| Pick 3 | 2 posiciones | 13 |
| Pick 4 | 4 posiciones | 4 000 |
| Pick 4 | 3 posiciones | 57 |
| Pick 4 | 2 posiciones | 5 |
| Loto Diario | 4/4, 3/4, 2/4 | 2 000, 22, 1 |
| Loto Express | 3/3, 2/3 | 60, 2 |

Todos los importes son enteros. La liquidación conserva la política común del piloto: valores brutos inferiores a 0,4 se anulan y valores desde 0,4 se redondean al entero superior. Las nuevas tablas ya son enteras, por lo que no dependen de un redondeo para publicar su premio.

## Frecuencias preparadas

| Modalidad | Cadencia propuesta | Expresión | Estado operativo |
|---|---|---|---|
| Sueldo de por vida | Semanal | `0 0 0 * * 1` | Preparada, desactivada |
| Raspa Digital | Cada minuto | `0 * * * * *` | Preparada, desactivada |
| Pick 3 | Cada 30 minutos | `0 0,30 * * * *` | Preparada, desactivada |
| Pick 4 | Cada dos horas | `0 0 */2 * * *` | Preparada, desactivada |
| Loto Diario | Diario | `0 0 0 * * *` | Preparada, desactivada |
| Loto Express | Cada 30 minutos | `0 0,30 * * * *` | Preparada, desactivada |

Las horas se expresan en UTC. La interfaz informa que el cierre está programado, pero **ninguna tarea automática se crea ni se ejecuta en el entorno actual**. Antes de crear tareas se requiere guardar esta versión, publicar el portal y habilitar cada modalidad desde el control administrativo. El ciclo identifica su propia tarea, no confía en datos del cuerpo de la solicitud, cierra rondas vencidas de forma repetible, abre la siguiente ronda y conserva un evento de auditoría.

## Alcance del simulador local

El apartado **Aprender** incorpora las seis modalidades. Sus resultados se generan solamente en el navegador para practicar la selección, la lectura de reglas y el cálculo de premios. No consulta rondas, no crea boletos, no modifica créditos, no agenda cuotas y no genera comprobantes oficiales.

## Correcciones al material revisado

El material recibido identifica correctamente que Bingo ya está disponible. Sin embargo, su descripción de loterías con bolas de consuelo no coincide con el catálogo activo del piloto: las loterías activas se mantienen como Lotería 19, 29, 39 MJP, 49 y 59, sin restaurar variantes eliminadas. En lugar de cambiar reglas históricas, **Loto Diario** y **Loto Express** se añadieron como modalidades independientes, con tablas y cadencias propias.

## Controles y límites

La expansión no activa pagos, Yape, retiros, suscripciones de pago, boletos automáticos, KYC real, AML real, geolocalización real, homologación ni autorización regulatoria. Los controles de juego responsable del perfil siguen siendo simulaciones locales. La activación de cualquier operación con dinero real requerirá una decisión independiente de dirección, revisión legal y una arquitectura de cumplimiento separada.
