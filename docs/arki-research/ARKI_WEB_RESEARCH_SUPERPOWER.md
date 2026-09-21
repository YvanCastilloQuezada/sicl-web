# ARKI — Superpoder de investigación web y enriquecimiento controlado

## Estado actual

ARKI dispone ahora de un contrato de investigación web defensivo. Puede inspeccionar fuentes públicas permitidas, registrar metadatos, conservar la URL y el hash de captura, preparar una abstracción breve, extraer vocabulario candidato y generar una fila de revisión para el libro Excel de staging.

La investigación no promueve conocimiento a `FACT`, no escribe directamente en el Core canónico, no reproduce texto protegido y no acepta URLs HTTP, hosts privados ni crawling ilimitado. Todo candidato conserva provenance y permanece sujeto a revisión humana. El ciclo diario está limitado a 30 fuentes y se ejecuta en modo `ask_user`, de manera que la tarea requiere autorización humana del propietario en cada ejecución.

## Fuentes iniciales permitidas

La allowlist inicial contempla publicaciones de arquitectura, premios y organizaciones profesionales, universidades, páginas oficiales de arquitectos y fuentes regulatorias públicas. Entre las familias previstas están ArchDaily, Dezeen, World Architecture, Pritzker Prize, instituciones profesionales, universidades y dominios gubernamentales públicos. La allowlist debe crecer por revisión, no mediante cualquier URL que aparezca en una página.

El premio Pritzker se trata como fuente de contexto y vocabulario arquitectónico, no como una autoridad que convierta automáticamente una afirmación en verdad. Una página de un arquitecto puede aportar terminología, obras y relaciones, pero cada afirmación conserva su estado epistemológico.

## Flujo único

`UNKNOWN → DISCOVER → FETCH_METADATA → ABSTRACT → EXTRACT_TERMS → STAGE_EXCEL → HUMAN_REVIEW → OPTIONAL_CORE_PROMOTION`

El paso `OPTIONAL_CORE_PROMOTION` está separado del resto. La investigación puede llenar la cola de revisión sin tocar el conocimiento canónico. La promoción posterior requiere una decisión humana explícita y evidencia suficiente.

## Excel de staging

El libro `ARKI_WEB_RESEARCH_STAGING.xlsx` contiene cuatro hojas: `00_README`, `01_REVIEW_QUEUE`, `02_VOCABULARY_CANDIDATES` y `03_CHANGE_LOG`. El libro está diseñado para crecer por adición y no borra el historial.

Los registros de la cola incluyen fuente, autor o institución, título, URL, tipo, tema, abstracción, términos, derechos, estado, hash y notas de provenance. Las candidaturas de vocabulario registran término, definición candidata, contexto y fuente. Ninguna fila del libro representa por sí misma un hecho canónico.

## Seguridad y límites

La inspección usa HTTPS y una allowlist de dominios. Se bloquean localhost, direcciones IP directas y hosts privados para reducir SSRF. El contenido HTML no se almacena como texto fuente; sólo se leen metadatos acotados y se guarda un hash de captura. Los resultados se limitan a diez páginas por ciclo en el contrato inicial.

El sistema conserva `UNKNOWN` cuando no puede establecer una afirmación con provenance suficiente. No debe rellenar huecos con imaginación, ni convertir una biografía, un premio, una imagen o una página comercial en regla general de diseño.

## Activación periódica: opciones

| Opción | Resultado | Ventaja | Riesgo o costo |
|---|---|---|---|
| Revisión manual bajo demanda | ARKI investiga cuando el usuario lo ordena y prepara Excel | Máximo control y mínimo costo recurrente | No hay actualización automática |
| Ciclo semanal acotado | Revisa hasta diez fuentes de una lista aprobada y deja candidatos en Excel | Mantiene el libro vivo sin canonización automática | Consume ejecución periódica y exige responsable de revisión |
| Ciclo programado con panel | Permite cambiar fuentes, temas, frecuencia, límites y revisar candidatos desde la interfaz | Mejor operación a largo plazo | Requiere UI, almacenamiento durable, observabilidad y definición clara de permisos |

La programación actual está activa como tarea diaria a las 03:00 en la zona horaria America/Lima, con límite de 30 fuentes y modo `ask_user`. La ejecución debe detenerse si no se puede verificar la autoridad humana del propietario. La aprobación o rechazo de candidatos sólo está disponible en la sesión administrativa del propietario.

## Próximo paso recomendado

La primera ejecución debe ser un lote pequeño de diez fuentes: una selección de premios y arquitectos, dos publicaciones de arquitectura, dos universidades, dos fuentes normativas y tres fuentes relacionadas con la tipología que ARKI esté estudiando. El resultado debe pasar por el Excel de staging y una revisión humana antes de considerar cualquier promoción.
