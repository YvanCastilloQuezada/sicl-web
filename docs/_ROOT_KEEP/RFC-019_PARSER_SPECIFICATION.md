# RFC-019 — Especificación técnica del parser de alias localizados

**Estado:** DRAFT — complemento técnico de RFC-019
**Alcance:** Corrección lingüística de alias en francés y alemán; parser localizado para ocho idiomas
**Catálogo:** 67 comandos canónicos
**Idiomas:** `es`, `en`, `pt`, `it`, `fr`, `de`, `ru`, `zh`
**Regla de ejecución:** el Core recibe la forma canónica SICL
**Dependencia:** RFC-019 — Localized SICL Command Aliases
**Fecha:** 16 de septiembre de 2026

> Esta especificación no habilita por sí sola la ejecución de alias. Define la implementación que deberá revisarse y aprobarse antes de activar estados `ACTIVE`.

---

## 1. Objetivo

La matriz actual demuestra la viabilidad de alias localizados, pero contiene formas híbridas en francés y alemán. Ejemplos como `/MÉMOIRE EXTRACT`, `/GEDÄCHTNIS APPLY` y `/REGULATION ÉTAT` mezclan palabras locales con tokens ingleses sin una regla terminológica explícita.

Esta especificación resuelve el problema en dos capas:

1. **Capa lingüística:** cada locale tendrá términos revisados y consistentes. Un alias será completamente idiomático o conservará un término técnico únicamente cuando ese término esté declarado como préstamo técnico oficial.
2. **Capa sintáctica:** el parser resolverá alias de forma determinista, conservará los argumentos técnicos y bloqueará las ocho clases de riesgo identificadas en la auditoría de la matriz.

El resultado esperado es una interfaz localizada sin una segunda semántica del lenguaje. Todos los alias válidos deben producir exactamente un comando canónico.

---

## 2. Decisiones de diseño

### 2.1 El alias no es una traducción parcial accidental

Cada alias debe declararse como una secuencia completa de tokens. No se permitirá construirlo concatenando traducciones independientes durante la ejecución. Esto evita combinaciones como:

```text
/MÉMOIRE EXTRACT
/GEDÄCHTNIS APPLY
/REGULATION ÉTAT
```

cuando el registro aprobado exige una forma completamente localizada.

### 2.2 Los términos técnicos deben tener una política explícita

Un término puede permanecer en inglés solo si está marcado en el registro como `technical_borrowing`. La ausencia de traducción no se interpretará como una decisión técnica implícita.

Por ejemplo, `PARETO` puede conservarse como término internacional, mientras que `EXTRACT`, `APPLY` y `REVOKE` no deben permanecer en inglés dentro de un alias francés o alemán sin una justificación registrada.

### 2.3 El Core permanece canónico

El parser localizado vive en el frontend durante la primera fase. El Core continúa aceptando y auditando la forma canónica actual. El parser no añade endpoints ni cambia el dispatcher.

### 2.4 La forma localizada debe ser reversible

Cada alias activo debe tener una resolución única hacia un comando canónico. La operación inversa puede mostrar el alias preferido del locale, pero no debe intentar traducir argumentos de texto libre.

---

## 3. Correcciones lingüísticas propuestas

Las siguientes formas son propuestas técnicas para revisión por hablantes nativos. No deben marcarse como `ACTIVE` hasta completar la revisión lingüística.

### 3.1 Francés

| Canónico | Forma actual | Propuesta idiomática | Nota |
|---|---|---|---|
| `/PROJECT CREATE` | `/PROJET CRÉER` | `/PROJET CRÉER` | Forma verbal comprensible; confirmar convención de infinitivo. |
| `/PROJECT OPEN` | `/PROJET OUVRIR` | `/PROJET OUVRIR` | Mantener infinitivo para consistencia. |
| `/PROJECT SET SCOPE` | `/PROJET DÉFINIR PÉRIMÈTRE` | `/PROJET DÉFINIR LE PÉRIMÈTRE` | Añadir artículo en la forma visible. |
| `/PROJECT IMPORT OBJECTIVE` | `/PROJET IMPORTER OBJECTIF` | `/PROJET IMPORTER L’OBJECTIF` | El artículo mejora la naturalidad. |
| `/STAGE SET` | `/ÉTAPE DÉFINIR` | `/ÉTAPE DÉFINIR` | Aceptable; revisar si `PHASE` es más apropiado para el dominio. |
| `/CONSTRAINT SET` | `/CONTRAINTE DÉFINIR` | `/CONTRAINTE DÉFINIR` | Mantener infinitivo operativo. |
| `/ROLE ADD` | `/RÔLE AJOUTER` | `/RÔLE AJOUTER` | Aceptable para una gramática de comandos. |
| `/POSITION ADD` | `/POSITION AJOUTER` | `/POSITION AJOUTER` | Aceptable; revisar si `PRISE DE POSITION` es demasiado largo. |
| `/HUMAN REVIEW` | `/HUMAIN REVUE` | `/RÉVISION HUMAINE` | Usar una expresión nominal idiomática; registrar el orden canónico del alias. |
| `/SITE INTELLIGENCE` | `/SITE INTELLIGENCE` | `/INTELLIGENCE DU SITE` | Evita conservar dos tokens ingleses. |
| `/AGENT RUN` | `/AGENT EXÉCUTER` | `/AGENT EXÉCUTER` | Aceptable en una gramática de infinitivos. |
| `/GENERATE DESIGN` | `/GÉNÉRER CONCEPTION` | `/GÉNÉRER UNE CONCEPTION` | Añadir artículo para lenguaje natural. |
| `/MEMORY EXTRACT` | `/MÉMOIRE EXTRACT` | `/MÉMOIRE EXTRAIRE` | El verbo debe estar en francés. |
| `/MEMORY REVOKE` | `/MÉMOIRE REVOKE` | `/MÉMOIRE RÉVOQUER` | El verbo debe estar en francés. |
| `/MEMORY APPLY` | `/MÉMOIRE APPLY` | `/MÉMOIRE APPLIQUER` | El verbo debe estar en francés. |
| `/MEMORY TYPES` | `/MÉMOIRE TYPES` | `/TYPES DE MÉMOIRE` | Forma nominal más idiomática. |
| `/MULTIOBJECTIVE` | `/MULTIOBJECTIF` | `/MULTIOBJECTIF` | Mantener como término técnico localizado. |
| `/REGULATION ADD` | `/REGULATION AJOUTER` | `/RÉGLEMENTATION AJOUTER` | Traducir el sustantivo de dominio. |
| `/REGULATION LIST` | `/REGULATION LISTER` | `/RÉGLEMENTATION LISTER` | Mantener consistencia con `RÉGLEMENTATION`. |
| `/REGULATION SHOW` | `/REGULATION AFFICHER` | `/RÉGLEMENTATION AFFICHER` | Traducir el sustantivo de dominio. |
| `/REGULATION STATUS` | `/REGULATION ÉTAT` | `/ÉTAT DE LA RÉGLEMENTATION` | El alias completo evita mezcla y ambigüedad. |
| `/INTERPRET ADD` | `/INTERPRET AJOUTER` | `/INTERPRÉTATION AJOUTER` | Usar sustantivo de entidad. |
| `/INTERPRET REVIEW` | `/INTERPRET REVUE` | `/RÉVISER L’INTERPRÉTATION` | Forma verbal completa. |
| `/STATUS` | `/ÉTAT` | `/ÉTAT` | Válido como comando global; el parser debe exigir la secuencia completa. |
| `/EXIT` | `/EXIT` | `/QUITTER` | Traducir el comando de salida; conservar `/EXIT` como alias canónico visible. |

Para `PARETO`, `SNAPSHOT` y `TRADEOFF_MATRIX`, la decisión debe registrarse por separado. No se deben traducir parcialmente como `/CAPTURE FREEZE` o `/PARETO COMPROMIS` sin revisión terminológica.

### 3.2 Alemán

| Canónico | Forma actual | Propuesta idiomática | Nota |
|---|---|---|---|
| `/PROJECT CREATE` | `/PROJEKT ERSTELLEN` | `/PROJEKT ERSTELLEN` | Natural y consistente con infinitivo. |
| `/PROJECT OPEN` | `/PROJEKT ÖFFNEN` | `/PROJEKT ÖFFNEN` | Natural. |
| `/PROJECT SET SCOPE` | `/PROJEKT SETZEN GELTUNGSBEREICH` | `/PROJEKT GELTUNGSBEREICH FESTLEGEN` | Sustituye la construcción poco natural. |
| `/PROJECT IMPORT OBJECTIVE` | `/PROJEKT IMPORTIEREN ZIEL` | `/PROJEKT ZIEL IMPORTIEREN` | Orden más claro para una gramática de comandos. |
| `/STAGE SET` | `/PHASE SETZEN` | `/PHASE FESTLEGEN` | `festlegen` es más idiomático que `setzen` en este contexto. |
| `/OBJECTIVE SET` | `/ZIEL SETZEN` | `/ZIEL FESTLEGEN` | Forma natural para “definir objetivo”. |
| `/CONSTRAINT SET` | `/EINSCHRÄNKUNG SETZEN` | `/EINSCHRÄNKUNG FESTLEGEN` | Forma natural para “definir restricción”. |
| `/ROLE ADD` | `/ROLLE HINZUFÜGEN` | `/ROLLE HINZUFÜGEN` | Natural. |
| `/POSITION ADD` | `/POSITION HINZUFÜGEN` | `/POSITION HINZUFÜGEN` | Natural para agregar una posición. |
| `/HUMAN REVIEW` | `/MENSCHLICH PRÜFUNG` | `/MENSCHLICHE PRÜFUNG` | Concordancia adjetival correcta. |
| `/SITE INTELLIGENCE` | `/STANDORT INTELLIGENZ` | `/STANDORTANALYSE` | Forma compuesta idiomática y precisa. |
| `/AGENT RUN` | `/AGENT AUSFÜHREN` | `/AGENT AUSFÜHREN` | Natural. |
| `/GENERATE DESIGN` | `/GENERIEREN ENTWURF` | `/ENTWURF GENERIEREN` | Orden más natural para el alemán. |
| `/MEMORY EXTRACT` | `/GEDÄCHTNIS EXTRACT` | `/GEDÄCHTNIS EXTRAHIEREN` | El verbo debe estar en alemán. |
| `/MEMORY REVOKE` | `/GEDÄCHTNIS REVOKE` | `/GEDÄCHTNIS WIDERRUFEN` | El verbo debe estar en alemán. |
| `/MEMORY APPLY` | `/GEDÄCHTNIS APPLY` | `/GEDÄCHTNIS ANWENDEN` | El verbo debe estar en alemán. |
| `/MEMORY TYPES` | `/GEDÄCHTNIS TYPES` | `/GEDÄCHTNISARTEN` | Sustantivo compuesto idiomático. |
| `/MULTIOBJECTIVE` | `/MEHRZIEL` | `/MEHRZIEL` | Puede ser válido; confirmar si `Mehrzieloptimierung` es más claro. |
| `/REGULATION ADD` | `/REGULATION HINZUFÜGEN` | `/VORSCHRIFT HINZUFÜGEN` | `Vorschrift` es una opción de dominio; revisar frente a `Regelung`. |
| `/REGULATION LIST` | `/REGULATION AUFLISTEN` | `/VORSCHRIFTEN AUFLISTEN` | Concordancia plural con la operación de listado. |
| `/REGULATION SHOW` | `/REGULATION ANZEIGEN` | `/VORSCHRIFT ANZEIGEN` | Mantener singular para una entidad individual. |
| `/REGULATION STATUS` | `/REGULATION STATUS` | `/STATUS DER VORSCHRIFT` | Evita dejar el comando completamente en inglés. |
| `/INTERPRET ADD` | `/INTERPRET HINZUFÜGEN` | `/INTERPRETATION HINZUFÜGEN` | Usar sustantivo de entidad. |
| `/INTERPRET REVIEW` | `/INTERPRET PRÜFUNG` | `/INTERPRETATION PRÜFEN` | Verbo completo y orden natural. |
| `/STATUS` | `/STATUS` | `/STATUS` | Préstamo técnico aceptado en alemán; registrar `technical_borrowing`. |
| `/EXIT` | `/EXIT` | `/BEENDEN` | Alias idiomático; conservar `/EXIT` como forma canónica alternativa. |

En alemán, los sustantivos técnicos como `Status` pueden conservarse si la revisión lingüística los declara préstamos aceptados. Eso es distinto de dejar verbos ingleses como `EXTRACT`, `REVOKE` o `APPLY` sin justificar.

---

## 4. Registro lingüístico obligatorio

Cada alias debe incluir metadatos de revisión. La tabla de traducciones no es suficiente para activar una entrada.

```json
{
  "locale": "fr",
  "alias": "/MÉMOIRE EXTRAIRE",
  "canonical": "/MEMORY EXTRACT",
  "status": "PROPOSED",
  "review": {
    "native_reviewer": null,
    "reviewed_at": null,
    "naturalness": "UNREVIEWED",
    "domain_terminology": "UNREVIEWED",
    "notes": "Pending native-language review"
  },
  "technical_borrowings": [],
  "normalization": {
    "unicode": "NFC",
    "case": "INSENSITIVE",
    "diacritics": "PRESERVE"
  }
}
```

Los valores mínimos de revisión son:

- `UNREVIEWED`: no aprobado lingüísticamente;
- `REVIEWED`: revisión lingüística completada;
- `DOMAIN_REVIEWED`: terminología de dominio confirmada;
- `ACTIVE`: habilitado para normalización y ejecución;
- `DEPRECATED`: aún reconocido con advertencia;
- `REJECTED`: no puede utilizarse.

Un alias francés o alemán no podrá pasar directamente de `PROPOSED` a `ACTIVE`.

---

## 5. Gramática del parser

### 5.1 Estructura de entrada

```ebnf
input          = command_prefix, ws, command_name, { ws, argument }, [ ws ];
command_prefix = "/";
command_name  = alias_token, { ws, alias_token };
argument      = quoted | unquoted | json | timestamp | url;
quoted        = '"', { any_char - '"' }, '"';
unquoted      = { safe_char };
json          = '{', valid_json, '}';
timestamp     = iso8601_timestamp;
url           = valid_url;
ws             = one_or_more_space;
```

La gramática anterior es conceptual. La implementación debe utilizar el parser ya existente cuando sea posible y añadir una fase previa de resolución del nombre del comando. No se debe duplicar la lógica de validación de argumentos del Core.

### 5.2 Separación comando-argumentos

El parser debe intentar primero las frases de alias más largas. Si un alias registrado contiene cuatro tokens, no debe resolverse como un alias de dos tokens seguido de dos argumentos.

Ejemplo:

```text
/PROJET DÉFINIR LE PÉRIMÈTRE urbain annuel
```

Debe resolverse como:

```text
alias = /PROJET DÉFINIR LE PÉRIMÈTRE
args  = urbain, annuel
```

La longitud máxima de alias debe estar registrada en el índice. No se debe inferir la longitud a partir de traducción libre.

---

## 6. Algoritmo determinista

```text
parseLocalizedCommand(input, locale, registry, canonicalCatalog):
  1. Rechazar entrada vacía.
  2. Rechazar entrada que no empiece por `/`.
  3. Aplicar Unicode NFC.
  4. Rechazar caracteres de control y separadores no permitidos.
  5. Normalizar espacios solo en la región candidata al nombre del comando.
  6. Obtener candidatos de un índice por locale y primer token.
  7. Intentar coincidencias exactas desde la frase más larga hasta la más corta.
  8. Filtrar candidatos cuyo estado no sea `ACTIVE` o `DEPRECATED` permitido.
  9. Si no existe candidato, intentar la forma canónica.
 10. Si existen varios destinos para la misma entrada normalizada, devolver `AMBIGUOUS_ALIAS`.
 11. Separar argumentos según la entrada del registro.
 12. Validar la forma canónica contra el catálogo.
 13. Validar el número mínimo de argumentos localmente.
 14. Preservar argumentos según su política de tipo.
 15. Generar la forma canónica exacta.
 16. Devolver el resultado y no ejecutar HTTP.
```

La ejecución HTTP debe ser una etapa separada:

```text
parsed = parseLocalizedCommand(input, locale, registry, catalog)
if parsed.status != OK:
    showLocalizedError(parsed.code)
else:
    showPreview(parsed.displayCommand, parsed.canonicalCommand)
    if userConfirmsSyntax:
        executeCanonical(parsed.canonicalCommand)
```

La confirmación anterior solo confirma la transformación sintáctica. No sustituye una revisión humana de dominio.

---

## 7. Prevención de los ocho riesgos de colisión

### 7.1 Colisiones por traducción futura

**Control:** cada alias se registra con destino único, versión, estado y pruebas. CI rechaza duplicados normalizados antes de permitir `ACTIVE`.

**Prueba:** agregar dos alias iguales con destinos distintos debe hacer fallar la validación del registro.

### 7.2 Colisiones por prefijos

**Control:** el parser utiliza coincidencia de frase completa y máxima coincidencia. Un prefijo parcial solo produce sugerencias; nunca produce una ejecución.

**Prueba:** `/PROYECTO` debe mostrar sugerencias, pero debe producir `INCOMPLETE_COMMAND` si se pulsa Enter.

### 7.3 Colisiones entre términos técnicos y traducidos

**Control:** cada token se marca como `localized`, `canonical` o `technical_borrowing`. Un alias mixto no puede activarse si la mezcla no está justificada por el registro.

**Prueba:** `/MÉMOIRE EXTRACT` debe ser rechazado si el registro activo exige `/MÉMOIRE EXTRAIRE`.

### 7.4 Colisiones por acentos y normalización

**Control:** NFC obligatorio, diacríticos preservados y comparación configurada por locale. No se eliminan acentos automáticamente.

**Prueba:** `/PROJET CRÉER` puede ser válido; `/PROJET CREER` debe ser rechazado o registrado por separado, nunca asumido como equivalente.

### 7.5 Colisiones por variantes morfológicas

**Control:** infinitivo, imperativo y sustantivo son alias distintos. Solo una forma preferida se marca `ACTIVE`; las demás requieren revisión y registro explícito.

**Prueba:** una variante no registrada no debe resolverse por stemming o traducción automática.

### 7.6 Colisiones con argumentos

**Control:** el índice de alias usa la coincidencia más larga y una separación estructural de argumentos. Los valores de usuario no pueden extender retroactivamente el nombre del comando.

**Prueba:** el texto `Casa` en `/PROYET CRÉER Casa` debe quedar como argumento, no como parte del comando.

### 7.7 Colisiones entre locales

**Control:** el locale forma parte obligatoria de la clave de resolución y del registro de historial. Al pegar un comando creado en otro locale, la interfaz debe identificarlo como canónico o pedir confirmación.

**Prueba:** un alias alemán no debe resolverse usando automáticamente el registro francés.

### 7.8 Colisiones semánticas constitucionales

**Control:** el parser solo normaliza nombres. No traduce ni relaja precondiciones de `HumanReview`, `Decision`, `Recommendation`, `Fact` o `Assumption`. La respuesta de autoridad proviene del Core.

**Prueba:** un alias localizado para `/DECISION RECORD` debe producir el mismo rechazo que la forma canónica si falta revisión, actor o autoridad.

---

## 8. Índices y estructuras de implementación

Se recomienda construir dos índices inmutables al cargar el registro:

```ts
type AliasEntry = {
  locale: string;
  alias: string;
  normalizedAlias: string;
  canonical: string;
  status: "PROPOSED" | "REVIEWED" | "DOMAIN_REVIEWED" | "ACTIVE" | "DEPRECATED" | "REJECTED";
  technicalBorrowings: string[];
  argumentPolicy: "CANONICAL_VALUES" | "ENUM_TRANSLATIONS";
  preferred: boolean;
};

type AliasIndex = Map<string, Map<string, AliasEntry[]>>;
```

La clave externa es el locale. La clave interna puede ser el primer token normalizado o una longitud de frase. La lista conserva todos los candidatos para detectar colisiones; no se debe sobrescribir una entrada duplicada durante la construcción del índice.

La validación del índice debe comprobar:

- que cada `canonical` existe en el catálogo;
- que cada alias empieza por `/`;
- que cada alias tiene al menos un token;
- que no hay dos destinos para la misma clave normalizada;
- que los aliases `ACTIVE` tienen revisión adecuada;
- que el registro declara su versión;
- que el locale está soportado;
- que los argumentos no están incluidos accidentalmente en el alias.

---

## 9. Contrato de salida del parser

> **Compatibilidad compacta:** la interfaz actual puede recibir códigos compactos `XXX-XXX` sin slash. Esos códigos se resuelven mediante el catálogo compacto y se normalizan al comando legacy antes de invocar este parser de aliases. La regla `COMMAND_MUST_START_WITH_SLASH` se conserva únicamente para entradas que se declaran como aliases localizados legacy, no para la forma compacta preferida.

```ts
type ParseResult =
  | {
      status: "OK";
      locale: string;
      displayCommand: string;
      canonicalCommand: string;
      aliasUsed: boolean;
      aliasStatus: "ACTIVE" | "DEPRECATED" | "CANONICAL";
      catalogVersion: string;
      warnings: string[];
    }
  | {
      status: "ERROR";
      code:
        | "EMPTY_COMMAND"
        | "COMMAND_MUST_START_WITH_SLASH"
        | "INCOMPLETE_COMMAND"
        | "COMMAND_NOT_FOUND"
        | "ALIAS_NOT_ACTIVE"
        | "AMBIGUOUS_ALIAS"
        | "CATALOG_MISMATCH"
        | "INVALID_ARGUMENT_FORMAT"
        | "INVALID_JSON_ARGUMENT"
        | "UNSUPPORTED_LOCALE"
        | "CANONICALIZATION_FAILED";
      locale: string;
      candidates: string[];
      messageKey: string;
    };
```

El parser no debe devolver `canonicalCommand` en un resultado de error, salvo que la salida indique explícitamente que la forma canónica fue comprobada y la ejecución está bloqueada por un argumento.

---

## 10. Estados de ejecución

| Estado | Acción de interfaz | Ejecución |
|---|---|---|
| Alias `ACTIVE` | Mostrar vista previa normal | Permitida tras validación del Core. |
| Alias `DEPRECATED` | Mostrar advertencia y reemplazo | Permitida durante el período de gracia. |
| Alias `PROPOSED` | Mostrar como no habilitado | Bloqueada. |
| Alias `REJECTED` | No sugerir o mostrar explicación | Bloqueada. |
| Alias ambiguo | Mostrar candidatos | Bloqueada. |
| Prefijo incompleto | Mostrar sugerencias | Bloqueada. |
| Forma canónica | Mostrar forma canónica | Permitida bajo las reglas actuales. |

---

## 11. Pruebas mínimas de aceptación

### 11.1 Cobertura de idiomas

Cada locale debe probar al menos:

- `/PROJECT CREATE` en forma canónica;
- el alias localizado de `/PROJECT CREATE`;
- `/STATUS`;
- `/HISTORY`;
- un comando con cuatro tokens;
- un comando con argumento JSON;
- un comando con timestamp;
- un comando con requisito de autoridad.

### 11.2 Cobertura francesa

Debe verificarse que:

```text
/PROJET DÉFINIR LE PÉRIMÈTRE
/MÉMOIRE EXTRAIRE
/MÉMOIRE RÉVOQUER
/MÉMOIRE APPLIQUER
/TYPES DE MÉMOIRE
/ÉTAT DE LA RÉGLEMENTATION
/QUITTER
```

resuelven a sus comandos canónicos cuando el registro está en estado `ACTIVE`.

### 11.3 Cobertura alemana

Debe verificarse que:

```text
/PROJEKT GELTUNGSBEREICH FESTLEGEN
/ZIEL FESTLEGEN
/EINSCHRÄNKUNG FESTLEGEN
/GEDÄCHTNIS EXTRAHIEREN
/GEDÄCHTNIS WIDERRUFEN
/GEDÄCHTNIS ANWENDEN
/GEDÄCHTNISARTEN
/STATUS DER VORSCHRIFT
/BEENDEN
```

resuelven a sus comandos canónicos cuando el registro está en estado `ACTIVE`.

### 11.4 Casos negativos

- alias con una palabra inglesa no registrada;
- alias con acento eliminado;
- alias con locale incorrecto;
- alias con prefijo incompleto;
- alias duplicado;
- alias que apunta a un comando inexistente;
- comando de decisión sin requisitos constitucionales;
- JSON malformado;
- caracteres de control;
- entrada que supera el límite de longitud.

---

## 12. Compatibilidad y migración

La activación inicial debe ser opt-in en el Command Bar mediante una preferencia local:

```text
Modo de comandos: Canónico | Localizado
```

El modo canónico debe permanecer disponible en todo momento. El cambio de idioma de la interfaz no debe activar alias ejecutables automáticamente hasta que el registro correspondiente esté aprobado y cargado.

El historial antiguo contiene cadenas canónicas. Debe seguir funcionando después de activar alias. Las entradas antiguas no necesitan retraducción; la interfaz puede mostrar la forma canónica y, si existe, el alias preferido del locale actual como información secundaria.

---

## 13. Revisión lingüística requerida

La revisión francesa y alemana debe realizarse por separado. Cada revisión debe cubrir:

1. naturalidad del verbo;
2. orden de palabras;
3. género y concordancia;
4. terminología arquitectónica y normativa;
5. uso aceptable de préstamos técnicos;
6. consistencia entre comandos relacionados;
7. claridad para usuarios profesionales;
8. posibilidad de colisión con palabras de argumentos;
9. traducción de mensajes de error;
10. decisión final por cada alias.

El resultado debe incorporarse al registro, no únicamente a un comentario informal de la matriz.

---

## 14. Criterios de no activación

La implementación debe detenerse y mantener el alias en `PROPOSED` cuando ocurra cualquiera de estas condiciones:

- el revisor lingüístico no puede confirmar la forma;
- el alias mezcla idiomas sin una marca de préstamo técnico;
- el alias tiene dos destinos posibles;
- el comando canónico no existe en el catálogo;
- la separación entre comando y argumentos no es determinista;
- se requiere traducir JSON o texto libre para que funcione;
- la normalización elimina información lingüística relevante;
- la activación podría alterar una invariante de autoridad.

---

## 15. Plan de implementación

### Paso 1 — Corrección de la matriz

Sustituir las formas híbridas por las propuestas revisadas y añadir columnas de estado, revisor y notas. No activar aún.

### Paso 2 — Registro versionado

Crear un archivo de alias separado del catálogo canónico. El catálogo de comandos y el registro de alias no deben mezclarse en un único objeto sin versionado.

### Paso 3 — Validador CI

Implementar un script que compruebe las ocho clases de colisión, genere un informe y termine con código distinto de cero cuando encuentre un error.

### Paso 4 — Parser puro

Implementar `parseLocalizedCommand` sin efectos secundarios. Añadir pruebas unitarias para los ocho controles.

### Paso 5 — Integración en Command Bar

Añadir sugerencias localizadas y vista previa canónica. Mantener modo canónico como ruta segura.

### Paso 6 — Revisión de Product Owner

Presentar matriz corregida, informe de colisiones, resultados de pruebas y decisiones terminológicas antes de cambiar estados a `ACTIVE`.

---

## 16. Decisiones pendientes

- Confirmar las propuestas francesas con un revisor francófono.
- Confirmar las propuestas alemanas con un revisor germanófono.
- Decidir si `PARETO`, `SNAPSHOT`, `SCALE` y `TRADEOFF_MATRIX` son préstamos técnicos oficiales.
- Definir si `/STATUS` en alemán conserva `STATUS` como préstamo aceptado.
- Elegir entre `VORSCHRIFT`, `REGELUNG` y `VERORDNUNG` para `REGULATION`.
- Elegir entre `SITE INTELLIGENCE` y `INTELLIGENCE DU SITE` en francés.
- Aprobar la política de diacríticos.
- Aprobar el período de gracia para alias deprecados.
- Aprobar la activación opt-in del modo localizado.

---

## 17. Estado de la especificación

**Estado:** DRAFT.
**Revisión lingüística francesa:** pendiente.
**Revisión lingüística alemana:** pendiente.
**Validación automática de colisiones:** especificada, no integrada aún.
**Ejecución de alias localizados:** no habilitada.
**Cambios en el Core:** ninguno autorizado por esta especificación.

---

## Referencias

[1]: ./RFC-019_LOCALIZED_SICL_COMMAND_ALIASES.md "RFC-019 — Localized SICL Command Aliases"

[2]: ./COMMANDS_TRANSLATIONS_MATRIX.md "Matriz de comandos SICL y traducciones"

[3]: ./COMMAND_BAR.md "Command Bar — SICL"

[4]: ../client/src/content/commands-catalog.json "Catálogo canónico de comandos"

[5]: ../client/src/components/CommandBar.tsx "Implementación actual del Command Bar"

[6]: ../client/src/i18n/index.ts "Locales soportados por el frontend"

---

**Fin de la especificación técnica.**
