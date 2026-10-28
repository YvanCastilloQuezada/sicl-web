# RFC-019 — Localized SICL Command Aliases

**Estado:** DRAFT — PENDING PRODUCT OWNER APPROVAL
**Tipo:** RFC de lenguaje, interfaz y compatibilidad
**Alcance:** Alias localizados para los comandos SICL en el frontend
**Baseline:** ARKI / SICL 2.2
**Catálogo de referencia:** 67 comandos
**Idiomas iniciales:** español, inglés, portugués, italiano, francés, alemán, ruso y chino
**Fecha:** 16 de septiembre de 2026
**Autor de la propuesta:** Manus AI
**Decisión requerida:** Aprobar, modificar o rechazar la política de alias localizados antes de implementar cambios de ejecución.

> Este documento propone una capa de alias para la interfaz. No modifica por sí solo el contrato del Core, la sintaxis canónica de SICL ni la autoridad humana requerida para registrar decisiones.

---

## 1. Resumen ejecutivo

RFC-019 propone que el Command Bar permita a cada usuario trabajar con comandos visibles en el idioma seleccionado en ARKI. El usuario puede descubrir y escribir un código compacto como `PRO-CRE` o un alias localizado heredado como `/PROYECTO CREAR`, mientras que el frontend normaliza ambos al nombre legacy interno `/PROJECT CREATE` antes de enviarlo al Core.

La propuesta adopta un **modelo híbrido**. La experiencia de usuario utiliza códigos compactos, pero el protocolo ejecutado permanece compatible con la forma legacy formal. El Core seguirá recibiendo comandos SICL en su forma formal actual, con el mismo endpoint, los mismos argumentos técnicos y las mismas invariantes constitucionales. La traducción será una capacidad de presentación y normalización, no una segunda gramática independiente del Core.

Esta separación permite mejorar la accesibilidad lingüística sin crear una bifurcación del contrato. También conserva una representación única para logs, auditoría, pruebas, documentación técnica, integraciones externas y análisis posterior.

La implementación se propone en fases. La primera fase registra alias de comandos y normaliza únicamente el nombre del comando. La segunda fase puede localizar valores enumerados y mensajes de ayuda. La tercera fase podrá extender la localización a argumentos estructurados, siempre que exista una regla explícita para cada tipo de dato.

---

## 2. Motivación

El selector de idioma actual traduce la navegación, los formularios, los mensajes y la ayuda del frontend. Sin embargo, los nombres de los comandos permanecen en inglés técnico. Esta decisión protege la compatibilidad, pero introduce una discontinuidad en la experiencia: una persona que trabaja en español puede leer “Proyecto” en la interfaz y tener que escribir `PRO-CRE` en la barra de comandos.

El catálogo actual contiene 67 comandos y una matriz provisional de alias para ocho idiomas. La matriz demuestra que existe una correspondencia inicial entre la forma canónica y una forma localizada. También muestra que no todos los términos deben traducirse. Identificadores como `PARETO`, `SNAPSHOT`, `TRADEOFF_MATRIX`, estados técnicos, valores JSON, fechas, unidades y nombres de métodos requieren reglas específicas.

Sin una política formal, la traducción directa puede producir varios problemas:

- el alias localizado puede enviarse accidentalmente al Core y ser rechazado;
- dos palabras distintas pueden resolver al mismo comando;
- una palabra localizada puede colisionar con un identificador de proyecto;
- el historial puede dejar de ser reproducible;
- los logs podrían mostrar una forma distinta de la que realmente se ejecutó;
- una traducción puede alterar el significado constitucional de una entidad;
- los comandos documentados podrían dejar de coincidir con el dispatcher real.

RFC-019 define una frontera técnica para evitar estos problemas.

---

## 3. Objetivos

RFC-019 tiene los siguientes objetivos:

1. Permitir alias de comandos en los ocho idiomas ya soportados por la interfaz.
2. Mantener una forma canónica única para la ejecución contra el Core.
3. Hacer visible al usuario la normalización realizada antes de ejecutar.
4. Preservar la reproducibilidad del historial y de la auditoría.
5. Evitar colisiones, ambigüedades y traducciones silenciosas.
6. Mantener compatibilidad con comandos canónicos existentes.
7. Permitir que el catálogo de alias se valide automáticamente contra los 67 comandos canónicos.
8. Separar los alias de interfaz de la traducción de argumentos y valores de dominio.
9. Mantener intacta la distinción entre Recommendation, HumanReview y Decision.
10. Permitir una ampliación posterior sin modificar el Core en la primera fase.

---

## 4. No objetivos

RFC-019 no autoriza lo siguiente:

- cambiar los nombres canónicos del dispatcher;
- cambiar los endpoints `/v1/...`;
- aceptar alias localizados directamente en el Core durante la primera fase;
- traducir identificadores de proyecto, entidades o actores de forma automática;
- traducir JSON arbitrario;
- traducir fechas o unidades sin un parser específico;
- traducir estados técnicos sin un catálogo aprobado;
- crear autoridad implícita para decisiones;
- convertir una Recommendation en una Decision;
- eliminar el comando canónico de la interfaz;
- alterar el registro append-only de eventos;
- sustituir revisión humana por traducción automática;
- introducir una nueva entidad de dominio en SICL 2.2.

---

## 5. Terminología

### 5.1 Comando canónico

El comando canónico es la forma registrada por el dispatcher del Core y expuesta actualmente por el catálogo de 67 comandos. Por ejemplo:

```text
PRO-CRE
```

Esta forma es la única que se enviará al Core durante la primera implementación.

### 5.2 Alias localizado

Un alias localizado es una forma alternativa asociada a un comando canónico para facilitar la escritura y el descubrimiento en una interfaz concreta. Por ejemplo:

```text
/PROYECTO CREAR
```

es un alias propuesto para:

```text
PRO-CRE
```

Un alias no crea una nueva operación semántica.

### 5.3 Localización

La localización es la adaptación de textos, comandos visibles, ayudas y mensajes a un idioma. No implica que todo valor técnico deba traducirse.

### 5.4 Normalización

La normalización es la transformación determinista de una entrada localizada en una representación canónica. Debe producir el mismo resultado para la misma entrada, configuración regional y versión del catálogo.

### 5.5 Ambigüedad

Existe ambigüedad cuando una entrada puede corresponder a más de un comando canónico o cuando una traducción no permite determinar el límite entre el nombre del comando y sus argumentos.

### 5.6 Registro de alias

El registro de alias es la fuente versionada que relaciona idioma, alias, comando canónico, estado y metadatos de validación.

---

## 6. Principios constitucionales

### 6.1 Una única semántica canónica

Un alias localizado solamente cambia la forma de entrada. No cambia la semántica del comando. Cada alias válido debe resolver a exactamente un comando canónico.

### 6.2 Normalización visible

El usuario debe poder ver qué comando canónico se ejecutará. La interfaz no debe reemplazar silenciosamente la entrada visible por otra forma antes de la confirmación.

### 6.3 El Core conserva autoridad de validación

El frontend puede detectar errores de forma temprana, pero el Core mantiene la validación final de sintaxis, permisos, estado del proyecto, actor, autoridad y precondiciones.

### 6.4 No se traduce la autoridad

Los alias no cambian quién puede ejecutar una operación. En particular, `DEC-REC` continúa exigiendo los requisitos de `HumanReview`, actor y autoridad definidos por el Core.

### 6.5 Fact no es Assumption

La localización no puede fusionar, renombrar semánticamente ni intercambiar `Fact` y `Assumption`. Los alias deben conservar la distinción epistemológica existente.

### 6.6 Recommendation no es Decision

Los alias de `/RECOMMENDATION` o de comandos relacionados no pueden crear una interfaz que sugiera autoridad de decisión. Las etiquetas localizadas deben conservar esta separación.

### 6.7 Reproducibilidad

Un evento, historial o auditoría debe poder reconstruirse usando el comando canónico, el locale, la versión del catálogo y la entrada mostrada al usuario.

### 6.8 Cierre seguro

Si el alias no es reconocido, es ambiguo o no puede normalizarse con seguridad, la interfaz no debe ejecutar la solicitud.

---

## 7. Estado de la matriz actual

La matriz `docs/COMMANDS_TRANSLATIONS_MATRIX.md` contiene 67 filas y ocho columnas lingüísticas además de la forma canónica. Debe considerarse una **propuesta de alias**, no una autorización automática para ejecutar todas las formas.

La matriz actual incluye traducciones completas para los nombres de comando conocidos y conserva determinados términos técnicos sin traducir cuando no existe todavía una política de dominio. Esta combinación es intencional. Por ejemplo, `PARETO`, `TRADEOFF_MATRIX`, `SNAPSHOT`, `SCALE` y algunos comandos de memoria pueden requerir una decisión terminológica antes de entrar en el registro ejecutable.

Antes de activar alias en producción, la matriz deberá pasar por:

1. revisión lingüística por idioma;
2. comprobación contra el catálogo real del Core;
3. comprobación de unicidad por locale;
4. revisión de términos técnicos;
5. pruebas de normalización;
6. aprobación del Product Owner;
7. tag o versión del catálogo.

---

## 8. Catálogo y fuente de verdad

La fuente primaria de comandos sigue siendo el dispatcher del Core y su salida de ayuda. En el frontend, `client/src/content/commands-catalog.json` es una copia operativa del catálogo para sugerencias y validación temprana.

El registro de alias deberá derivarse del catálogo canónico. No se deben añadir alias para comandos que no existan en la versión de Core declarada por el frontend.

Cada generación del catálogo debe registrar:

- versión del contrato;
- commit o tag del Core;
- fecha de generación;
- número total de comandos;
- hash del catálogo canónico;
- hash del registro de alias;
- locales incluidos;
- alias rechazados y razón del rechazo.

Si el Core pasa de 67 comandos a otra cantidad, el frontend debe fallar la validación de consistencia en CI hasta que se regenere el catálogo o se confirme que el cambio no afecta a los alias.

---

## 9. Modelo de datos propuesto

El registro puede representarse como JSON versionado. La forma exacta podrá cambiar durante la implementación, pero debe conservar estos campos:

```json
{
  "catalog_version": "2.2.0",
  "core_contract_version": "1.0",
  "locale": "es",
  "entries": [
    {
      "alias": "/PROYECTO CREAR",
      "canonical": "PRO-CRE",
      "status": "PROPOSED",
      "source": "COMMANDS_TRANSLATIONS_MATRIX",
      "reviewed": false,
      "argument_policy": "CANONICAL_VALUES",
      "display_label": "Crear proyecto"
    }
  ]
}
```

Los estados mínimos del registro son:

| Estado | Significado |
|---|---|
| `PROPOSED` | Alias redactado, todavía no habilitado para ejecución. |
| `REVIEWED` | Alias revisado lingüística y técnicamente. |
| `ACTIVE` | Alias habilitado para sugerencias y normalización. |
| `DEPRECATED` | Alias todavía reconocido, pero no recomendado para nuevas entradas. |
| `REJECTED` | Alias no permitido por ambigüedad, calidad o incompatibilidad. |
| `OBSOLETE` | Alias retirado y no reconocido. |

Un alias sin estado `ACTIVE` no puede convertirse automáticamente en una solicitud ejecutable.

---

## 10. Reglas de alias

### 10.1 Correspondencia uno a uno

Cada alias activo debe resolver a un único comando canónico dentro de un locale. Un comando canónico puede tener varios alias, pero un alias no puede tener varios destinos.

### 10.2 Distinción por idioma

Los alias se resuelven usando el idioma activo. El frontend puede permitir una búsqueda secundaria en inglés para facilitar migración, pero esa búsqueda debe mostrar que se está utilizando una forma fuera del idioma seleccionado.

### 10.3 Mayúsculas y minúsculas

La comparación de nombres de comando será insensible a mayúsculas y minúsculas después de aplicar normalización Unicode. La forma enviada al Core conservará la forma canónica definida por el catálogo.

### 10.4 Acentos

Los alias pueden contener diacríticos cuando sean naturales en el idioma. El sistema no debe eliminar acentos de manera indiscriminada, porque dos palabras distintas podrían colisionar. Si se admite una forma sin diacríticos, debe registrarse como alias adicional y validarse por separado.

### 10.5 Espacios

Los espacios consecutivos entre tokens del nombre del comando se normalizarán a un único espacio. Los espacios dentro de un argumento textual no deben modificarse sin una regla específica.

### 10.6 Puntuación

No se deben aceptar signos de puntuación alternativos en el nombre del comando salvo que estén registrados explícitamente. El prefijo `/` permanece obligatorio en la interfaz y en la forma canónica.

### 10.7 Unicode

La normalización debe aplicar una forma Unicode definida, preferentemente NFC, antes de resolver alias. No se deben mezclar caracteres visualmente similares de distintos alfabetos.

### 10.8 Colisiones

Si dos alias activos de un mismo locale son iguales después de la normalización, ambos deben marcarse como `REJECTED` hasta resolver la colisión. No se permite una selección arbitraria basada en el orden del archivo.

---

## 11. Política de argumentos

La primera fase debe traducir únicamente el nombre estructural del comando. Los argumentos se clasifican así:

| Tipo de argumento | Política inicial |
|---|---|
| Identificador de proyecto | No traducir. |
| Identificador de entidad | No traducir. |
| Nombre proporcionado por usuario | No traducir. |
| URL | No traducir. |
| JSON | No traducir y validar como JSON. |
| Fecha y timestamp | No traducir; aceptar formatos definidos por contrato. |
| Unidad | No traducir en la primera fase. |
| Método de generación | No traducir salvo catálogo explícito. |
| Estado técnico | No traducir en la primera fase. |
| Valor enumerado | Puede localizarse en una fase posterior mediante tabla bidireccional. |
| Texto libre | No traducir; conservar exactamente la entrada del usuario. |

Por ejemplo, el alias localizado puede cambiar el nombre del comando, pero no debe cambiar automáticamente `P-001`, `2026-09-16T04:00:00Z`, `{"width":10}` o `m2`.

### 11.1 Valores enumerados

La localización de valores como `MAXIMIZE`, `MINIMIZE`, `DRAFT`, `ACTIVE` y `CLOSED` queda fuera de la primera fase. Si se habilita después, cada valor deberá tener:

- valor canónico;
- alias por locale;
- comparación exacta y normalizada;
- mensaje de error localizado;
- prueba de ida y vuelta;
- rechazo de valores ambiguos.

### 11.2 Texto libre

El normalizador no puede decidir dónde termina un texto libre. El parser debe respetar la gramática canónica del comando y no puede inferir argumentos a partir de una traducción aproximada.

---

## 12. Algoritmo de normalización

La función propuesta es conceptualmente:

```text
normalize(input, locale, alias_registry, canonical_catalog)
  1. comprobar que input no esté vacío;
  2. comprobar que comience con `/`;
  3. aplicar normalización Unicode definida;
  4. normalizar espacios del nombre del comando;
  5. localizar coincidencias exactas de alias activo para locale;
  6. si hay cero coincidencias, probar la forma canónica;
  7. si hay más de una coincidencia, devolver AMBIGUOUS_ALIAS;
  8. separar nombre del comando y argumentos;
  9. validar el número mínimo de argumentos;
 10. preservar argumentos según argument_policy;
 11. generar canonical_command;
 12. devolver display_command, canonical_command y metadatos.
```

La salida no debe ser únicamente una cadena. Se propone una estructura interna como la siguiente:

```json
{
  "display_command": "/PROYECTO CREAR P-001 Vivienda",
  "canonical_command": "PRO-CRE P-001 Vivienda",
  "locale": "es",
  "alias_used": true,
  "catalog_version": "2.2.0",
  "normalization_status": "OK",
  "warnings": []
}
```

La función debe ser pura y testeable. No debe ejecutar solicitudes HTTP ni modificar historial por sí misma.

---

## 13. Comportamiento del Command Bar

Cuando el usuario abre la barra, las sugerencias deben mostrar primero los alias del idioma activo. El comando canónico puede aparecer como información secundaria o mediante una vista previa.

Antes de ejecutar, la interfaz debe mostrar una confirmación no ambigua. Por ejemplo:

```text
Entrada:   /PROYECTO CREAR P-001 Vivienda
Se enviará: PRO-CRE P-001 Vivienda
Idioma:    Español
```

La confirmación no debe convertirse en una segunda aprobación de autoridad de dominio. Es únicamente una confirmación de transformación sintáctica. Las operaciones de alto impacto continúan sujetas a las reglas del Core y a los flujos de revisión correspondientes.

El usuario debe poder cancelar la ejecución si la normalización no coincide con su intención. Si el comando ya requiere una revisión humana, esta vista previa no sustituye dicha revisión.

---

## 14. Historial y auditoría

El historial local debe almacenar, como mínimo:

```json
{
  "display_command": "/PROYECTO CREAR P-001 Vivienda",
  "canonical_command": "PRO-CRE P-001 Vivienda",
  "locale": "es",
  "catalog_version": "2.2.0",
  "timestamp": "2026-09-16T00:00:00.000Z",
  "status": "EXECUTED"
}
```

El request enviado al Core debe contener la forma canónica. Si el contrato existente no permite añadir metadatos, el frontend conservará los metadatos localmente y no alterará el payload durante la primera fase.

Si el Core incorpora metadatos de interfaz en una futura versión, estos deberán ser informativos y no podrán modificar la semántica del comando. Como mínimo, podrían incluir `display_command`, `locale` y `catalog_version`.

La auditoría debe identificar claramente:

- qué escribió o seleccionó el usuario;
- qué locale estaba activo;
- qué alias se resolvió;
- qué comando canónico se envió;
- qué versión del catálogo se utilizó;
- quién fue el actor de ejecución;
- qué respuesta produjo el Core.

---

## 15. Compatibilidad con el Core HTTP

La primera implementación no requiere nuevos endpoints. El frontend seguirá usando:

```text
POST /v1/projects/{project_id}/commands
```

La única diferencia es que el cliente normalizará el nombre del comando antes de invocar el método existente. El Core no debe recibir alias localizados durante esta fase.

Si en el futuro se desea que otros clientes utilicen alias localizados, deberá abrirse una extensión separada del contrato HTTP. Esa extensión tendría que definir dónde se declara el locale, cómo se reporta el comando normalizado y cómo se versiona el registro compartido.

No se recomienda aceptar un campo `locale` sin aceptar también una versión del catálogo. Un locale por sí solo no garantiza qué alias estaba activo en el momento de ejecución.

---

## 16. Errores normalizados

La capa de normalización debe producir errores estables y localizables:

| Código | Significado |
|---|---|
| `COMMAND_MUST_START_WITH_SLASH` | La entrada no comienza con `/`. |
| `COMMAND_NOT_FOUND` | No existe comando canónico ni alias activo. |
| `ALIAS_NOT_ACTIVE` | El alias existe, pero no está habilitado. |
| `AMBIGUOUS_ALIAS` | La entrada coincide con más de un destino. |
| `CATALOG_MISMATCH` | El alias apunta a una versión de Core incompatible. |
| `MISSING_REQUIRED_ARGUMENT` | Falta un argumento obligatorio. |
| `INVALID_ARGUMENT_FORMAT` | Un argumento no cumple su formato. |
| `INVALID_JSON_ARGUMENT` | Un argumento JSON no puede analizarse. |
| `UNSUPPORTED_LOCALE` | El locale no está soportado. |
| `CANONICALIZATION_FAILED` | No fue posible producir una forma canónica segura. |

Los mensajes deben traducirse, pero los códigos deben permanecer estables para pruebas, soporte y telemetría.

---

## 17. Seguridad y abuso

Los alias localizados no deben ampliar permisos. El servidor debe seguir validando el actor y la autorización real.

El normalizador debe tratar la entrada como datos. No debe evaluar código, interpolar comandos del sistema ni ejecutar JSON como script.

La normalización debe rechazar caracteres de control, separadores inesperados y formas Unicode sospechosas. También debe limitar la longitud de la entrada antes de procesarla.

Las traducciones no deben permitir que palabras como “aprobar”, “decidir” o “autorizar” creen una ruta distinta de la operación canónica. La semántica de autoridad reside en el Core y en sus invariantes, no en la traducción.

---

## 18. Versionado

El registro de alias tendrá su propia versión `MAJOR.MINOR.PATCH`, independiente pero relacionada con la versión del Core Contract.

- **MAJOR:** eliminación de alias activos, cambio de destino, cambio incompatible de normalización o reorganización que pueda alterar comandos ejecutados.
- **MINOR:** nuevos alias compatibles, nuevos locales o nuevos metadatos opcionales.
- **PATCH:** correcciones ortográficas, documentación o mensajes que no cambien la resolución.

Un alias no puede cambiar de destino en una versión `PATCH`. Si la traducción inicialmente elegida es incorrecta, el alias original debe marcarse como `DEPRECATED` o `REJECTED` y el reemplazo debe registrarse como una nueva entrada.

La política de deprecación debe ofrecer un período de gracia. Durante ese período, la interfaz puede seguir reconociendo el alias, mostrar una advertencia y recomendar el reemplazo. La fecha de retirada debe quedar registrada.

---

## 19. Ciclo de vida de un alias

El ciclo recomendado es:

1. **Proposed:** se añade a la matriz para revisión.
2. **Reviewed:** un revisor confirma significado, idioma y correspondencia.
3. **Active:** se habilita en el Command Bar.
4. **Deprecated:** se mantiene temporalmente con advertencia.
5. **Obsolete:** deja de aceptarse.

La activación requiere comprobar que el alias no colisiona con otro alias del mismo locale, con la forma canónica o con una palabra reservada del parser.

---

## 20. Pruebas obligatorias

La implementación debe incluir pruebas unitarias, de integración y de interfaz.

### 20.1 Pruebas del registro

- Cada uno de los 67 comandos tiene una forma canónica válida.
- Cada alias activo apunta a un único comando.
- No existen duplicados después de normalización Unicode.
- Todos los locales declarados están dentro de `supportedLngs`.
- Ningún alias apunta a un comando ausente del catálogo.

### 20.2 Pruebas de normalización

- `/PROYECTO CREAR` produce `PRO-CRE` con locale `es`.
- `/PROJETO CRIAR` produce `PRO-CRE` con locale `pt`.
- `/PROJET CRÉER` produce `PRO-CRE` con locale `fr`.
- La forma canónica sigue funcionando en todos los locales.
- Un alias desconocido no ejecuta una solicitud.
- Una colisión produce `AMBIGUOUS_ALIAS`.
- Los identificadores y textos libres permanecen intactos.
- El JSON inválido produce `INVALID_JSON_ARGUMENT`.

### 20.3 Pruebas de regresión

- El endpoint continúa siendo `/v1/projects/{id}/commands`.
- La forma canónica enviada al Core no contiene el alias localizado.
- El historial registra entrada y salida.
- `HumanReview` y `Decision` conservan sus requisitos actuales.
- No aparece fallback local silencioso.

### 20.4 Pruebas de interfaz

- Las sugerencias cambian al cambiar el idioma.
- La vista previa muestra entrada y forma canónica.
- El botón de ejecución permanece bloqueado ante ambigüedad.
- Los mensajes de error están localizados.
- El historial puede volver a mostrar el comando visible.

---

## 21. Ejemplos por idioma

El siguiente conjunto ilustra la primera operación del catálogo. La forma de la derecha es la única que se envía al Core.

| Idioma | Entrada visible | Forma canónica enviada |
|---|---|---|
| Español | `/PROYECTO CREAR P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| English | `PRO-CRE P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| Português | `/PROJETO CRIAR P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| Italiano | `/PROGETTO CREARE P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| Français | `/PROJET CRÉER P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| Deutsch | `/PROJEKT ERSTELLEN P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| Русский | `/ПРОЕКТ СОЗДАТЬ P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |
| 中文 | `/项目 创建 P-001 Vivienda` | `PRO-CRE P-001 Vivienda` |

Los argumentos `P-001` y `Vivienda` no se traducen automáticamente porque el primero es un identificador y el segundo es un nombre proporcionado por el usuario.

---

## 22. Ejemplo de decisión humana

La localización no cambia el flujo constitucional. Una entrada localizada como:

```text
/DECISIÓN REGISTRAR alternativa-a actor-01 2026-09-16T04:00:00Z ...
```

debe normalizarse a la forma canónica correspondiente, pero el Core debe seguir comprobando que existe `HumanReview`, que el actor está autorizado y que la autoridad requerida está presente.

La interfaz no debe presentar “Decisión registrada” antes de recibir una respuesta positiva del Core. Tampoco debe interpretar una traducción como evidencia de autorización.

---

## 23. Fases de implementación

### Fase 0 — Propuesta y revisión

Se revisa la matriz actual, se corrigen traducciones, se definen términos técnicos y se aprueba este RFC. No cambia el comportamiento de producción.

### Fase 1 — Alias de nombres de comando en frontend

Se añade un registro versionado al frontend. El Command Bar acepta alias activos, los normaliza y envía la forma canónica. El Core no cambia.

### Fase 2 — Valores enumerados controlados

Se añade un registro separado para estados y operaciones como `MAXIMIZE`, `MINIMIZE`, `DRAFT`, `ACTIVE` y `CLOSED`. Cada valor debe tener reglas de ida y vuelta.

### Fase 3 — Metadatos de auditoría

Se evalúa incluir locale, versión del catálogo y alias utilizado en el payload o en un evento de interfaz. Esta fase requiere revisar el contrato HTTP y la política de eventos.

### Fase 4 — Otros clientes

Se estudia si CLI, documentación, SDKs o integraciones externas deben utilizar alias. No se debe asumir que una capacidad del frontend debe trasladarse automáticamente a esos clientes.

---

## 24. Criterios de aceptación

RFC-019 puede considerarse implementado cuando:

1. Los 67 comandos canónicos están vinculados a un registro validado.
2. Los ocho locales tienen una política explícita de alias.
3. Las colisiones están detectadas y bloqueadas.
4. El Command Bar muestra alias del idioma activo.
5. La normalización produce una forma canónica determinista.
6. El Core recibe únicamente la forma canónica en la primera fase.
7. El historial conserva entrada, salida, locale y versión del catálogo.
8. Los errores de normalización están localizados y tienen códigos estables.
9. Las pruebas de regresión de autoridad humana pasan.
10. La documentación y la matriz se actualizan junto con el registro.
11. La implementación no crea endpoints nuevos ni entidades nuevas sin RFC adicional.
12. El Product Owner aprueba el registro de alias activo.

---

## 25. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Traducción lingüísticamente incorrecta | Revisión por idioma y estado `REVIEWED` antes de activar. |
| Colisión entre alias | Validación determinista por locale y rechazo automático. |
| Desincronización con Core | Hash y versión del catálogo; CI bloqueante. |
| Pérdida de reproducibilidad | Guardar comando visible, canónico, locale y versión. |
| Traducción de identificadores | Política inicial `CANONICAL_VALUES` y preservación literal. |
| Falsa autoridad | El Core mantiene actor, revisión y autoridad. |
| Alias obsoleto | Ciclo de vida y período de deprecación. |
| Diferencias Unicode | Normalización NFC y rechazo de caracteres sospechosos. |
| Ambigüedad en texto libre | No traducir ni inferir texto libre automáticamente. |
| Sobrecarga de soporte | Códigos estables y vista previa de normalización. |

---

## 26. Decisiones pendientes del Product Owner

El Product Owner debe decidir:

1. Si se aprueba el modelo híbrido.
2. Si se habilitan alias solo en el frontend o también en futuros clientes.
3. Si la primera versión acepta únicamente nombres de comando o también valores enumerados.
4. Qué términos técnicos de la matriz deben permanecer en inglés.
5. Quién realiza la revisión lingüística de cada idioma.
6. Cuál será la versión inicial del registro de alias.
7. Si la auditoría del Core debe recibir metadatos de locale en una futura versión.
8. Cuál será el período de gracia para alias deprecados.
9. Si el catálogo de alias se distribuye con el frontend o se obtiene desde el Core.
10. Si los alias deben estar habilitados por defecto o mediante preferencia explícita del usuario.

---

## 27. Estado de la propuesta

**RFC-019 permanece en DRAFT.** La matriz de traducciones está disponible como material de diseño. No se autoriza todavía la ejecución de alias localizados contra el Core.

Hasta que el RFC sea aprobado, el Command Bar debe conservar el comportamiento actual: sugerir y ejecutar comandos canónicos SICL, mientras el selector de idioma traduce la interfaz y los mensajes.

---

## 28. Firma del baseline

```text
Sistema: ARKI
Lenguaje formal: SICL
RFC: RFC-019 — Localized SICL Command Aliases
Estado: DRAFT — PENDING PRODUCT OWNER APPROVAL
Catálogo de referencia: 67 comandos
Idiomas: es, en, pt, it, fr, de, ru, zh
Regla principal: alias localizado en interfaz; comando canónico en Core
Autor: Manus AI
Product Owner: Usuario / arquitecto
```

---

## Referencias

[1]: ./COMMANDS_TRANSLATIONS_MATRIX.md "Matriz de comandos SICL y traducciones"

[2]: ./COMMAND_BAR.md "Command Bar — SICL"

[3]: ./SICL_CORE_CONTRACT_v1.0.md "SICL Core Contract v1.0"

[4]: ./RFC-017_CORE_CONTRACT_VERSIONING.md "RFC-017 — Core Contract Versioning Policy"

[5]: ./RFC-018_RFC_PROCESS.md "RFC-018 — RFC Process"

[6]: ../client/src/content/commands-catalog.json "Catálogo de comandos del frontend"

[7]: ../client/src/components/CommandBar.tsx "Implementación actual del Command Bar"

[8]: ../client/src/i18n/index.ts "Configuración de idiomas soportados"

---

**Fin de RFC-019.**
