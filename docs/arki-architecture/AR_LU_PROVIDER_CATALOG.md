# Proveedores AR-LU: catálogo inicial

## Recomendación

Para una primera prueba de voz, el candidato recomendado es **Deepgram** por su API de transcripción en tiempo real y soporte de vocabulario especializado. Para transportar audio y video entre dispositivos, **LiveKit** es el candidato administrado más directo; **coturn** es la alternativa autogestionada para Ubuntu. Para distribución de ARKI-TV y LUKA-TV, **Cloudflare Stream** es un candidato sandbox adecuado porque recibe RTMPS/SRT y entrega HLS/DASH con bitrate adaptativo.

| Necesidad | Proveedores candidatos | Uso previsto | Estado en Manus |
|---|---|---|---|
| Transcripción | Deepgram, Google Cloud Speech-to-Text, Azure AI Speech | Convertir voz en texto y alimentar a LUCA/ARKI | Contrato y panel preparados; credenciales no conectadas |
| WebRTC y pairing | LiveKit, Cloudflare Calls, coturn | Salas, audio/video, STUN/TURN y pairing QR | Adaptador preparado; prueba física pendiente |
| Distribución | Cloudflare Stream, Mux, Livepeer | Emisión, grabación, HLS/DASH y distribución | Contrato preparado; sandbox pendiente |

Las credenciales deben permanecer server-side. Ningún proveedor debe recibir secretos desde el navegador. La activación productiva requiere prueba de permisos, privacidad, reconexión, control de acceso, límites de costos y revisión humana.

## Flujo para el servidor Ubuntu

Primero se configura el proveedor en sandbox con una cuenta separada. Después se prueba una sesión de voz, un pairing entre dos dispositivos y una emisión privada. Se registran latencia, reconexiones, errores, consumo y trazas. Sólo después de aprobar la evidencia se cambia el estado del adaptador a `REAL_CONNECTED`.

## Fuentes

[1]: https://deepgram.com/product/speech-to-text "Deepgram Speech-to-Text"
[2]: https://developers.deepgram.com/docs/build-voice-agent-with-livekit-and-deepgram "Deepgram and LiveKit voice agent"
[3]: https://developers.cloudflare.com/stream/stream-live/ "Cloudflare Stream live video"
[4]: https://livekit.io/ "LiveKit real-time infrastructure"
[5]: https://cloud.google.com/speech-to-text "Google Cloud Speech-to-Text"
[6]: https://azure.microsoft.com/products/ai-services/ai-speech "Azure AI Speech"
[7]: https://github.com/coturn/coturn "coturn TURN server"
[8]: https://www.mux.com/video "Mux Video"
[9]: https://livepeer.org/ "Livepeer"
