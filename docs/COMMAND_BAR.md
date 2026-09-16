# Command Bar — SICL

## Propósito

La Command Bar ofrece una interfaz de teclado para usuarios avanzados de SiMS-DeI. Permite ejecutar comandos SICL contra el Core remoto sin abandonar la vista actual, manteniendo la distinción entre la interfaz de operación y la autoridad del dominio: la barra solo envía comandos; no toma decisiones por el usuario.

## Apertura y cierre

La barra está disponible en todas las páginas del frontend. Puede abrirse con `Ctrl+K` en Windows/Linux, `Cmd+K` en macOS o mediante el botón flotante `SICL`. `Esc` la cierra sin ejecutar el contenido actual.

## Flujo de ejecución

Primero se introduce el ID del proyecto. Después se escribe el comando SICL. La barra valida que el comando comience con `/`, que exista en el catálogo del dispatcher y que sus argumentos obligatorios estén presentes. Si la validación local pasa, se realiza un `POST /v1/projects/{project_id}/commands` con el comando y el actor `frontend-user`.

Los resultados exitosos se muestran en verde. Los errores se muestran en rojo con el mensaje producido por el cliente REST. La barra no convierte errores en éxitos ni activa fallback local silencioso.

## Autocompletado

Al escribir `/` se muestran los comandos disponibles. La tecla `Tab` acepta la sugerencia seleccionada y las flechas permiten recorrerlas. Para comandos que admiten contexto, la barra puede recibir objetivos, alternativas y actores del proyecto. Cuando no hay contexto disponible, se conserva el marcador de argumento en lugar de inventar valores.

`Enter` ejecuta el comando. `ArrowUp` recupera comandos previos y `ArrowDown` permite recorrer las sugerencias. El historial se almacena en `localStorage` con la clave `sims-dei-command-history` y se limita a los últimos 100 comandos, eliminando duplicados consecutivos.

## Catálogo

El archivo `client/src/content/commands-catalog.json` contiene los **67 comandos expuestos por `/HELP` en el dispatcher del Core**. La salida de `/HELP` es la fuente de verdad; `docs/COMMANDS_REFERENCE.md` se usa para completar sintaxis y ejemplos cuando existe una ficha coincidente. No deben añadirse comandos únicamente porque aparezcan en documentación histórica.

Para regenerar el catálogo tras una modificación del Core:

```bash
cd /path/to/sicl-core
PYTHONPATH=.:src python3 /path/to/build_command_catalog.py
```

En un flujo de mantenimiento del repositorio, el script debe ejecutarse desde una checkout actualizada del Core y el resultado debe revisarse con `git diff --check`, typecheck, tests y build del frontend. Si el número de comandos del dispatcher cambia, debe actualizarse este documento y agregarse una prueba de regresión.

## Internacionalización

El namespace `command_bar` está disponible en español, inglés, portugués, italiano, francés, alemán, ruso y chino. Los comandos SICL permanecen en su sintaxis formal —por ejemplo, `/PROJECT CREATE`— porque son lenguaje de protocolo y no deben traducirse; las etiquetas, mensajes, ayudas y estados de la interfaz sí se traducen.

## Límites

La barra no modifica el Core, no altera formularios existentes de Fase A y no sustituye la revisión humana requerida por las invariantes constitucionales. Un comando como `/DECISION RECORD` sigue sujeto a los requisitos de actor, autoridad y revisión definidos por el Core.
