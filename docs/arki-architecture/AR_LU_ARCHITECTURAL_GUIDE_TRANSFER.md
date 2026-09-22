# AR-LU — guía turística arquitectónica y transferencia local

LUCA puede ofrecer guías basadas en arquitectura, historia del arte, cultura, cerámica, mobiliario, urbanismo, diseño de ciudades, paisaje y patrimonio. ARKI aporta el conocimiento arquitectónico y contextual, mientras LUCA lo presenta al visitante.

Una guía aprobada puede prepararse para transferencia local por Wi‑Fi o mediante un QR de handoff. En la web, “por Wi‑Fi” significa un canal de aplicación entre dispositivos autorizados en la misma red o un enlace WebRTC/HTTPS; no significa que el navegador pueda enviar datos arbitrarios a cualquier equipo.

El paquete incluye ciudad, provenance, referencia de archivo, SHA-256, derechos, receptor y expiración corta. No contiene credenciales y declara `coreAccess = NONE`. Se bloquea si falta aprobación, los derechos son desconocidos, el receptor no admite el canal o el checksum no coincide. La implementación está preparada y probada contractualmente; falta probar el envío físico con un servidor y dispositivos reales.
