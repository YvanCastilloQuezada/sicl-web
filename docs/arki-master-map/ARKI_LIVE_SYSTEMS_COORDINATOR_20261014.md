# ARKI — Integración ejecutable inicial de Mapa Vivo + Árbol Vivo + Árbol Gemelo Digital

Fecha: 2026-10-14. Rama: `test/arki-autonomy-offline-ci-20261014`.

## Implementado

`tools/maqueta-viva/arki-live-systems-coordinator.cjs` **reutiliza**, sin duplicar motores:
- `arki-arbol-vivo-auto.cjs` para inventario F1–F10 y precedencias;
- `arki-map-adn-bridge.cjs` para estado del Mapa Maestro y observaciones ADN-MC;
- `arki-relational-learning.cjs` y `arki-relational-evidence.cjs` para relaciones candidatas trazables;
- `arki-twin-three-alternatives.cjs` solo para presentación de métricas, no como simulador.

Produce un snapshot reproducible con recibo SHA-256, referencias al mapa, ramas del árbol, relaciones y expedientes de tres alternativas cuando el llamador suministra resultados. No escribe estado canónico, no autoriza implementación y no presenta ensayos hipotéticos como hechos.

### Ejecución local Node 22

```bash
node --test tools/maqueta-viva/arki-live-systems-coordinator.test.cjs
node tools/maqueta-viva/arki-live-systems-coordinator.cjs > /tmp/arki-live-systems-snapshot.json
node tools/maqueta-viva/Run-ARKI-Offline-CI.cjs
```

La última orden requiere Git limpio y ejecuta 23 archivos de pruebas. **No se ha ejecutado aún en ARKI-02**.

## Limitaciones explícitas

- No es un sincronizador persistente ni un proceso de vigilancia: la composición se ejecuta bajo demanda.
- No consume aún las dependencias dinámicas `reviews[id]` de la UI; usa el registro histórico. La reconciliación debe ser explícita antes de liberar precedencias.
- No hay conexión de simulación AGK real ni selección visual del propietario.
- El verificador de alternativas todavía confía en una declaración de identidad del verificador, no en un recibo criptográficamente autenticado; la decisión queda bloqueada.
- El Mapa Maestro JSON puede estar desactualizado; las afirmaciones no son medidas verificadas.
- Las fases FROZEN y ACE88 continúan protegidas.

## Siguiente paso técnico

Conectar el estado persistido de la UI al coordinador con un adaptador versionado, verificar coherencia de identificadores y dependencias; conectar el gemelo a ensayos aislados reales, tres alternativas por idea y métricas autenticadas; entregar la bandeja de decisión del PO y promover exclusivamente tras autorización específica.
