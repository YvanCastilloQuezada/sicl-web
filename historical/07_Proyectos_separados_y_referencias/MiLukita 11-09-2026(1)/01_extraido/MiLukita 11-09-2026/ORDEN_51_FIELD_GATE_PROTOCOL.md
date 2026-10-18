# MiLukita · Protocolo de inicio Field Gate 001

**Estado de esta edición:** preparado para piloto controlado. **No es certificación de producción.** Ya existe un dominio público HTTPS de Manus; los QRs definitivos de este paquete apuntan a ese dominio, pero todavía requieren escaneo físico y validación de Field Gate 001.

## Accesos de preview

| Superficie | URL | Uso |
|---|---|---|
| Portal | https://ruletaperu-dnzxnqyn.manus.space/portal | Entrada mínima del mundo LUKA |
| Mapper | https://ruletaperu-dnzxnqyn.manus.space/mapper | Captura territorial |
| The Eye | https://ruletaperu-dnzxnqyn.manus.space/the-eye | Revisión y verificación |
| LUKA AR | https://ruletaperu-dnzxnqyn.manus.space/lukita-ar-stage?entry=qr | Prueba AR/3D desde QR |

## Secuencia de inicio

1. Utilizar dos teléfonos reales, uno para captura y otro para revisión. Confirmar batería suficiente, navegador actualizado, conexión móvil y consentimiento para GPS/cámara/micrófono.
2. Abrir el Portal y comprobar que únicamente presenta L★, Entrar al mundo y Ver TV. No usar Ver TV como integración productiva: TV permanece fuera del alcance técnico.
3. Abrir Mapper, ejecutar el diagnóstico de GPS, cámara y micrófono, guardar el resultado TXT y registrar si cada permiso está concedido, denegado o bloqueado por el navegador.
4. Capturar cinco puntos territoriales. Para cada punto guardar coordenadas, precisión, descripción, categoría, evidencia fotográfica, hora UTC y observaciones. Si no hay conectividad, mantener el estado local y no borrar la cola.
5. Enviar los puntos a The Eye. Revisar evidencia, fuentes y claims. Ninguna publicación debe ocurrir sin decisión explícita de Human Authority.
6. Probar el QR LUKA AR en un teléfono compatible. Registrar soporte WebXR, fallback 3D, latencia percibida y resultado de cámara. Un fallback 3D no equivale a AR certificada.
7. Exportar métricas y evidencias, comprobar sus hashes SHA-256 y conservar el expediente. No incorporar tokens, contraseñas ni datos privados en QRs.
8. Detener el piloto si hay coordenadas incorrectas, evidencia ilegible, pérdida de cola offline, conflicto no resuelto, permiso bloqueado sin recuperación o intento de publicar sin autoridad humana.

## Criterio de salida del piloto

El piloto puede considerarse **completado para revisión** solo cuando existan cinco capturas, diagnóstico de permisos, evidencia asociada, revisión de The Eye, decisión humana registrada, exportación y hash. La salida no autoriza todavía producción, dominio definitivo, integración TV ni modificación de MJP CORE.

## Límites confirmados

MJP CORE permanece intacto. RNG, Wallet, Rules, ledger, settlement, resultados y autoridad de juego no reciben datos territoriales ni comandos de AR. Cast/DLNA no está integrado. La publicación pública, DNS, dominio oficial, certificados de producción y escaneo físico desde internet quedan fuera de esta preparación y requieren acción posterior en la interfaz de gestión.
