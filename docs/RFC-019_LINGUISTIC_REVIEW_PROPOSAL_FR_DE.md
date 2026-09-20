# RFC-019 — Propuesta formal de revisión lingüística para francés y alemán

**Estado:** PROPOSED — PENDING REVIEWER ASSIGNMENT
**Alcance:** Alias de los seis comandos esenciales de la Fase 1A
**Idiomas:** Français (`fr`) y Deutsch (`de`)
**Catálogo inicial:** `/PROJECT CREATE`, `/PROJECT OPEN`, `/PROJECT SHOW`, `/PROJECT LIST`, `/STATUS`, `/HISTORY`
**Fecha:** 16 de septiembre de 2026
**Dependencia:** RFC-019 — Localized SICL Command Aliases

> Esta propuesta solicita una revisión humana especializada. No marca ningún alias como `ACTIVE` y no autoriza su ejecución contra el Core.

---

## 1. Propósito

La matriz de alias debe ser completamente idiomática antes de que el Command Bar pueda ofrecer comandos localizados. La revisión inicial se concentra en francés y alemán porque la auditoría detectó formas híbridas, decisiones terminológicas no justificadas y posibles variantes de orden sintáctico.

La revisión no consiste solamente en corregir ortografía. Debe confirmar que cada alias:

- es natural para un usuario profesional del idioma;
- conserva el significado operativo del comando canónico;
- utiliza una convención gramatical coherente con los demás comandos;
- no mezcla idiomas sin una decisión explícita;
- no crea ambigüedad con argumentos o comandos vecinos;
- puede convertirse de manera determinista a la forma canónica.

---

## 2. Alcance de la primera revisión

La primera revisión cubre 12 alias, seis por idioma.

| Canónico | Français propuesto | Deutsch propuesto |
|---|---|---|
| `/PROJECT CREATE` | `/PROJET CRÉER` | `/PROJEKT ERSTELLEN` |
| `/PROJECT OPEN` | `/PROJET OUVRIR` | `/PROJEKT ÖFFNEN` |
| `/PROJECT SHOW` | `/PROJET AFFICHER` | `/PROJEKT ANZEIGEN` |
| `/PROJECT LIST` | `/PROJET LISTER` | `/PROJEKT AUFLISTEN` |
| `/STATUS` | `/ÉTAT` | `/STATUS` |
| `/HISTORY` | `/HISTORIQUE` | `/VERLAUF` |

Todos permanecen en estado `PROPOSED` hasta la firma de la revisión.

---

## 3. Preguntas que debe resolver la revisión

### 3.1 Francés

El revisor debe confirmar:

1. Si la convención de infinitivos (`CRÉER`, `OUVRIR`, `AFFICHER`) es natural para una interfaz de comandos.
2. Si `/PROJET LISTER` es preferible a una forma nominal como `/LISTE DES PROJETS`.
3. Si `/ÉTAT` es suficientemente claro como comando global o puede confundirse con un estado de entidad.
4. Si `/HISTORIQUE` describe correctamente el historial operativo del proyecto.
5. Si los acentos deben ser obligatorios, opcionales o duplicados como alias independientes.
6. Si el registro debe usar `PROJET` como entidad o una expresión más específica en el contexto arquitectónico.

### 3.2 Alemán

El revisor debe confirmar:

1. Si `/PROJEKT ERSTELLEN`, `/PROJEKT ÖFFNEN` y `/PROJEKT ANZEIGEN` mantienen una convención coherente.
2. Si `/PROJEKT AUFLISTEN` es natural o debe utilizar una forma nominal.
3. Si `STATUS` se acepta como préstamo técnico en alemán o debe traducirse como `/ZUSTAND`.
4. Si `/VERLAUF` es el término correcto para el historial de comandos y eventos.
5. Si las mayúsculas de los sustantivos siguen la convención del idioma y del parser.
6. Si deben preferirse compuestos alemanes para futuras entidades como `Standortanalyse` y `Vorschrift`.

---

## 4. Reglas lingüísticas comunes

La revisión debe aplicar estas reglas a ambos idiomas:

1. **Una forma preferida por comando y locale.** Las variantes se registran como alias secundarios solo si tienen valor real.
2. **No mezclar idiomas.** Un término inglés solo puede permanecer si está registrado como préstamo técnico aceptado.
3. **No traducir identificadores.** Los argumentos como `P-001`, `actor-01` y nombres de usuario permanecen intactos.
4. **No alterar la aridad.** La traducción del nombre no puede añadir ni eliminar argumentos.
5. **No inferir gramática desde traducción automática.** La revisión debe evaluar el uso profesional real.
6. **Preservar la intención de dominio.** `PROJECT`, `STATUS` y `HISTORY` deben conservar su significado operativo, no solo su traducción literal.
7. **Considerar la escritura real del usuario.** Los diacríticos, caracteres Unicode y espacios deben tener una política explícita.
8. **Rechazar ambigüedad.** Una forma dudosa se mantiene en `PROPOSED`.

---

## 5. Perfil y responsabilidades del revisor

Se requiere un revisor principal por idioma. El revisor debe ser competente en el idioma objetivo y capaz de leer documentación técnica en inglés.

La revisión francófona debe estar a cargo de una persona con dominio nativo o profesional equivalente del francés y experiencia suficiente para evaluar vocabulario de software o arquitectura.

La revisión germanófona debe estar a cargo de una persona con dominio nativo o profesional equivalente del alemán y experiencia suficiente para evaluar vocabulario de software o arquitectura.

El revisor no necesita modificar el código. Debe entregar decisiones por alias, comentarios de naturalidad y una recomendación final de estado.

---

## 6. Formulario de revisión por alias

Cada alias debe evaluarse con esta ficha:

```text
Locale:
Comando canónico:
Alias propuesto:
Alias alternativo, si existe:
Naturalidad: ACCEPT / REVISE / REJECT
Terminología de dominio: ACCEPT / REVISE / REJECT
Gramática y orden: ACCEPT / REVISE / REJECT
Diacríticos y Unicode: ACCEPT / REVISE / REJECT
Riesgo de colisión: NONE / REVIEW / BLOCK
Recomendación: ACTIVE-CANDIDATE / PROPOSED / REJECTED
Comentario:
Revisor:
Fecha:
```

Una respuesta `REVISE`, `REJECT` o `BLOCK` impide activar el alias.

---

## 7. Revisión propuesta para francés

| Canónico | Alias inicial | Punto de revisión |
|---|---|---|
| `/PROJECT CREATE` | `/PROJET CRÉER` | Confirmar infinitivo y elección de `PROJET`. |
| `/PROJECT OPEN` | `/PROJET OUVRIR` | Confirmar que el infinitivo es la convención preferida. |
| `/PROJECT SHOW` | `/PROJET AFFICHER` | Comparar con una alternativa nominal o imperativa. |
| `/PROJECT LIST` | `/PROJET LISTER` | Confirmar naturalidad para listar proyectos. |
| `/STATUS` | `/ÉTAT` | Revisar ambigüedad con estados especializados. |
| `/HISTORY` | `/HISTORIQUE` | Confirmar si se refiere a historial de eventos o comandos. |

El revisor debe además confirmar que futuras formas corregidas como `/INTELLIGENCE DU SITE`, `/TYPES DE MÉMOIRE` y `/ÉTAT DE LA RÉGLEMENTATION` siguen la misma convención de comando.

---

## 8. Revisión propuesta para alemán

| Canónico | Alias inicial | Punto de revisión |
|---|---|---|
| `/PROJECT CREATE` | `/PROJEKT ERSTELLEN` | Confirmar infinitivo y registro profesional. |
| `/PROJECT OPEN` | `/PROJEKT ÖFFNEN` | Confirmar verbo y orden de tokens. |
| `/PROJECT SHOW` | `/PROJEKT ANZEIGEN` | Confirmar que `anzeigen` expresa mostrar el detalle. |
| `/PROJECT LIST` | `/PROJEKT AUFLISTEN` | Confirmar naturalidad o preferencia por forma nominal. |
| `/STATUS` | `/STATUS` | Decidir si `Status` es préstamo técnico aceptado. |
| `/HISTORY` | `/VERLAUF` | Confirmar si `Verlauf` cubre historial de comandos/eventos. |

El revisor debe prestar especial atención a futuras formas como `/PROJEKT GELTUNGSBEREICH FESTLEGEN`, `/GEDÄCHTNISARTEN` y `/STATUS DER VORSCHRIFT`.

---

## 9. Criterios de aprobación lingüística

Un alias puede pasar a `REVIEWED` solo si:

- la forma es idiomática;
- la gramática es aceptable;
- el término de dominio es claro;
- el orden de palabras está confirmado;
- la forma no mezcla idiomas sin justificación;
- la forma no crea una colisión conocida;
- se define la política de diacríticos;
- el revisor identifica su nombre o código;
- existe fecha de revisión;
- los comentarios quedan guardados en el registro.

Un alias puede convertirse en candidato para `ACTIVE` solo después de superar además la validación técnica del registro y la aprobación del Product Owner.

---

## 10. Estados resultantes

| Resultado de revisión | Estado del alias |
|---|---|
| Aceptado sin cambios | `REVIEWED` |
| Aceptado con corrección | `REVIEWED` después de actualizar el alias |
| Requiere decisión de término técnico | `PROPOSED` |
| Ambiguo o poco natural | `REJECTED` o `PROPOSED` con reemplazo |
| No revisado | `UNREVIEWED` / `PROPOSED` |
| Aprobado técnicamente y por Product Owner | `ACTIVE` |

La revisión lingüística por sí sola nunca cambia un alias a `ACTIVE`.

---

## 11. Entregables requeridos

Cada idioma debe entregar:

1. tabla revisada de los seis alias esenciales;
2. formulario completo por alias;
3. lista de términos técnicos aceptados como préstamos;
4. lista de alias rechazados y sus sustitutos;
5. política de acentos y Unicode;
6. decisión sobre variantes morfológicas;
7. firma del revisor;
8. fecha de revisión;
9. recomendación de estado por alias.

Los entregables deben incorporarse al registro `client/src/content/command-aliases.json` y no quedar solamente en un documento narrativo.

---

## 12. Secuencia de aprobación

1. Asignar revisor francófono y germanófono.
2. Entregar la matriz y esta propuesta.
3. Recibir formularios por alias.
4. Corregir el registro de alias.
5. Ejecutar `scripts/validate_command_aliases.py`.
6. Revisar colisiones y términos mixtos.
7. Obtener aprobación del Product Owner.
8. Mantener los alias como `PROPOSED` hasta que también exista la implementación del parser.
9. Solo entonces considerar `ACTIVE` en una fase posterior.

---

## 13. Estado actual

| Elemento | Estado |
|---|---|
| Registro base | Creado en Fase 1A |
| Comandos esenciales | 6 por idioma |
| Idiomas incluidos | 8 |
| Alias totales | 48 |
| Alias activos | 0 |
| Revisión francesa | Pendiente |
| Revisión alemana | Pendiente |
| Validación técnica | Implementada en Python |
| Integración en Command Bar | No iniciada |
| Cambios en Core | Ninguno |

---

## 14. Decisión solicitada

Se solicita al Product Owner:

1. aprobar la apertura de la revisión lingüística francesa y alemana;
2. designar un revisor por idioma;
3. confirmar que la revisión se limita inicialmente a seis comandos esenciales;
4. confirmar que todos los alias permanecen `PROPOSED` hasta completar el parser y la aprobación técnica;
5. confirmar que el Core no se modificará durante la Fase 1A.

---

## Referencias

[1]: ./RFC-019_LOCALIZED_SICL_COMMAND_ALIASES.md "RFC-019 — Localized SICL Command Aliases"

[2]: ./RFC-019_PARSER_SPECIFICATION.md "RFC-019 — Especificación técnica del parser de alias localizados"

[3]: ./COMMANDS_TRANSLATIONS_MATRIX.md "Matriz de comandos SICL y traducciones"

[4]: ../client/src/content/command-aliases.json "Registro base de alias de comandos"

[5]: ../scripts/validate_command_aliases.py "Validador de colisiones del registro de alias"

---

**Fin de la propuesta de revisión lingüística.**
