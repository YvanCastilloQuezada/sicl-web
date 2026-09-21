# ARKI — IFC4, validación round-trip y autocuidado gobernado

## Estado implementado

ARKI incorpora un parser seguro para archivos IFC4/IFC4X3 en formato STEP. El parser calcula checksum, valida el esquema, identifica entidades IFC y normaliza productos BIM como proyecto, sitio, edificio, niveles, espacios, muros, losas, columnas, vigas, puertas, ventanas, equipamiento y proxies. El archivo se trata como datos: no se ejecuta código contenido en él.

La validación round-trip compara un conjunto normalizado de elementos antes y después del intercambio, con identificador, tipo semántico, caja geométrica y tolerancia configurable. Puede devolver `PASS` o `FAIL`, e informa faltantes, elementos inesperados, cambios semánticos y deriva geométrica. Un parser IFC4 sin geometría decodificada no puede declarar un `PASS` geométrico; queda explícitamente en `geometryDecoded=false` y requiere un adaptador geométrico autorizado.

## Hosts Revit y Dynamo

Se añadió la página de configuración de hosts Revit/Dynamo y el contrato de conexión. La interfaz valida HTTPS, rechaza localhost, dominios `.local` y rangos privados, comprueba capacidades mínimas y prepara una solicitud identificada. Los tokens no se guardan en el navegador: deben configurarse exclusivamente como secretos del servidor. La existencia de un host no implica que el modelo sea correcto ni que una exportación esté aprobada.

Capacidades mínimas para Revit: `revit-export`, `shared-coordinates` y `parameter-map`. Capacidades mínimas para Dynamo: `dynamo-run` y `revit-transaction-guard`. La ejecución real permanece bloqueada hasta que exista el host autorizado, la configuración server-side, el registro de auditoría y la aprobación humana explícita.

## Autocuidado, auto-reparación y auto-mejora

El superpoder se implementa como **PROPOSE_ONLY** por defecto. ARKI puede detectar anomalías, aislar una operación, preservar evidencia, degradar de forma segura y preparar una propuesta de reparación o mejora. No puede modificar el conocimiento canónico, cambiar permisos, rotar accesos, ejecutar código arbitrario, publicar cambios, borrar evidencia ni autoaprobar una reparación.

Toda mejora o reparación debe presentar previamente una lista legible de cambios, archivos afectados, riesgo, pruebas, reversibilidad y resultado esperado. Sólo la aprobación explícita del dueño humano permite avanzar a `OWNER_APPROVED_CHANGE`. Ante incertidumbre, integridad de auditoría inválida o conflicto de versión, el sistema falla cerrado y conserva el estado canónico.

## Lo que todavía no se afirma

No se afirma compatibilidad nativa completa con RVT ni ejecución real de Dynamo hasta conectar un host autorizado. Tampoco se afirma que el parser cubra BRep, CSG, mallas, materiales, restricciones paramétricas o todos los productos IFC sin un adaptador geométrico especializado. La validación actual es una base verificable de contrato, semántica y round-trip normalizado, no una certificación profesional ni una aprobación de expediente.
