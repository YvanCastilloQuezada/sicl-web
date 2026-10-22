# ARKI — Descubrimiento autónomo de relaciones (2026-10-14)

Estado: `SOURCE_SCANNER_IMPLEMENTED / TESTS_NOT_EXECUTED / CANONICAL_PROMOTION_BLOCKED`.

## Qué hace

- `arki-relational-discovery.cjs` lee el commit HEAD y archivos Markdown/TXT rastreados por Git en `docs/` y `tools/maqueta-viva/`, con límites de archivos y tamaño.
- Detecta declaraciones explícitas: `ARKI_RELATION: I-01 REQUIRES I-02`, `INFORMS` o `FEEDBACK`. Los identificadores deben existir en el registro.
- `arki-relational-learning.cjs` propone aristas; `arki-relational-evidence.cjs` verifica que la cita exista en el blob del commit exacto.
- Detecta ciclos de REQUIRES; no convierte INFORMS ni FEEDBACK en bloqueos.
- No deduce relaciones implícitas, no verifica verdad semántica de una afirmación ni promueve al registro canónico.

## Ejecutar en Ubuntu / Node 22

```bash
node --test tools/maqueta-viva/arki-relational-learning.test.cjs tools/maqueta-viva/arki-relational-evidence.test.cjs tools/maqueta-viva/arki-relational-discovery.test.cjs
node tools/maqueta-viva/arki-relational-discovery.cjs
```

Un resultado de cero declaraciones puede ser correcto: significa que no se encontraron relaciones con sintaxis explícita, **no** que ARKI carezca de dependencias.

## Limitaciones y siguiente integración

1. El inventario histórico contiene 51 elementos sin `dependencies` declaradas.
2. Falta extracción semántica más amplia de contratos y pruebas, con verificación humana y adversarial.
3. Falta unir las relaciones aprobadas a la UI del Árbol Vivo y al modelo de competencias; no alterar FROZEN.
4. El aprendizaje para automejora requiere resultados de experimentos reales, medición y Delta 6.2; la presencia de una relación no prueba una competencia.
5. La autorización general del propietario para avanzar en investigación y código **no sustituye** una prueba criptográfica ACE88 para promociones D-2 específicas.
