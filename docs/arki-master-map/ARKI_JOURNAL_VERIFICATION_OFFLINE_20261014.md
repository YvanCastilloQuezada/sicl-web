# ARKI — Verificación de memoria offline

Estado: IMPLEMENTED_NOT_EXECUTED. Rama: `test/arki-autonomy-offline-ci-20261014`.

Se añadió `tools/maqueta-viva/Verify-ARKI-Journal.cjs`, un verificador de solo lectura que acepta un archivo JSON de historial y opcionalmente un hash SHA-256 externo esperado para el último evento. Se apoya en `arki-autonomy-memory.cjs`, sin duplicar su validador.

Pruebas adversariales en `test-Verify-ARKI-Journal.cjs`: archivo válido, hash esperado distinto, payload alterado, JSON inválido, esquema desconocido, enlace simbólico y tamaño excesivo.

Comando desde la raíz del repositorio (Node.js 22):

```bash
node --test tools/maqueta-viva/test-Verify-ARKI-Journal.cjs
node tools/maqueta-viva/Verify-ARKI-Journal.cjs /ruta/segura/historial.json HASH_SHA256_ESPERADO
```

No se ha ejecutado la prueba en ARKI-02. `authenticity=NOT_ESTABLISHED` incluso cuando la cadena interna es válida: un atacante puede reescribir todos los eventos y recalcular sus hashes si no hay un ancla independiente confiable. No hay promoción canónica, ni integración ACE88, ni prueba de persistencia real tras reinicio.

El intento de incorporar esta suite al runner agregado fue bloqueado por controles de seguridad de la herramienta; la suite se puede ejecutar directamente y **no debe contarse entre las 13 pruebas del runner** hasta que se actualice y verifique su lista.
