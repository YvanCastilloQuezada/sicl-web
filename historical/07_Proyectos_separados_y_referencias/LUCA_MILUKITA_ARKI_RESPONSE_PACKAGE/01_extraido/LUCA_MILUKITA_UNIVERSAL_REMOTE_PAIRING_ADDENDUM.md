# LUCA / MiLukita — Universal Remote & Pairing Technology Addendum

**Estado:** `ARCHITECTURAL REFERENCE / NOT IMPLEMENTED / NOT DEMONSTRATED IN REPOSITORY`

## 1. Alcance y regla de evidencia

El documento 120 pide auditar si existen capacidades de control remoto, teclado o trackpad. Este anexo no demuestra que esas capacidades estén implementadas. Describe la tecnología necesaria para evaluarlas o diseñarlas posteriormente. La clasificación actual es **PROPOSED / UNKNOWN** hasta encontrar código, pruebas y evidencia de runtime.

Un control remoto universal no es una sola tecnología. Es una combinación de **radio o medio físico**, **protocolo de control**, **catálogo de dispositivos**, **método de aprendizaje o descubrimiento**, **pairing/bonding**, **autorización** y **mapeo de comandos**.

## 2. Tecnologías de transporte y control

| Tecnología | Cómo funciona | Ventaja | Límite | Pairing típico |
|---|---|---|---|---|
| **Infrarrojo (IR)** | Emite pulsos modulados, normalmente en línea de vista. El mando transmite códigos de función del equipo. | Barato, universal para TV, aire acondicionado, audio y proyectores antiguos. | No atraviesa paredes; no identifica por sí mismo al dispositivo; normalmente es unidireccional. | Ninguno, código manual, base de códigos o aprendizaje. |
| **IR blaster por Wi-Fi** | Un gateway recibe comandos IP y los convierte en señales IR. | El teléfono o backend puede controlar equipos tradicionales. | El gateway debe conocer posición, códigos, frecuencia y ángulo; no es control nativo del aparato. | Wi-Fi al gateway; no necesariamente al equipo IR. |
| **RF propietario sub-GHz** | Radio de 315/433/868/915 MHz u otra banda, según región y fabricante. | Puede atravesar obstáculos y paredes. | Cada fabricante puede usar protocolo, frecuencia, rolling code o cifrado diferente. | Registro, aprendizaje o procedimiento propietario. |
| **RF propietario 2.4 GHz** | Radio directa con protocolo cerrado, frecuente en mandos de streaming, hubs o periféricos. | Baja latencia y bidireccionalidad posible. | No es automáticamente Bluetooth ni Wi-Fi. | Botón de pairing, código, proximidad o registro en hub. |
| **Bluetooth Classic** | Enlace de corto alcance con perfiles, descubrimiento y bonding. | Adecuado para teclado, trackpad, audio y mandos con tráfico continuo. | Consume más energía que BLE; requiere perfil compatible. | Passkey, confirmación, Just Works u OOB según capacidades. |
| **Bluetooth Low Energy (BLE)** | El dispositivo anuncia servicios y características GATT; el controlador escribe comandos o recibe eventos. | Bajo consumo, buena opción para mando portátil y sensores. | El servicio GATT debe estar definido; pairing no equivale a autorización de aplicación. | LE Secure Connections: Just Works, numeric comparison, passkey u OOB. |
| **Wi-Fi/IP local** | El mando y el equipo se comunican mediante TCP/UDP/HTTP/WebSocket/MQTT u otro protocolo local. | Alto ancho de banda, control desde red local, integración con apps. | Configuración de red, descubrimiento, credenciales y superficie de ataque. | SoftAP, WPS, QR, contraseña, token o cuenta. |
| **Cloud control** | La app envía la orden a un servicio remoto, que la entrega al dispositivo o hub. | Control fuera de casa y multiusuario. | Dependencia de Internet, cuenta, proveedor y disponibilidad. | Cuenta, código de dispositivo, token, OAuth/OIDC o certificado. |
| **HDMI-CEC** | Canal de control dentro de HDMI para equipos compatibles. No es un pairing inalámbrico. | Permite que TV, receptor y reproductor compartan funciones básicas. | Limitado por compatibilidad, topología HDMI y comportamiento de fabricantes. | Sin pairing convencional; descubrimiento y direccionamiento del bus. |
| **USB HID** | Teclado, ratón, trackpad o mando conectado por cable o receptor USB. | Estable y simple para ordenador. | Requiere conexión física o dongle; no es universal para electrodomésticos. | Sin pairing o pairing del dongle. |
| **NFC** | Campo de proximidad para identificar o iniciar una operación. | Muy fácil para “tocar para configurar”. | No suele ser el canal permanente de control. | Tap-to-pair o entrega de credencial. |
| **UWB** | Radio de corto alcance con estimación precisa de distancia/dirección. | Proximidad y orientación robustas. | Coste, disponibilidad y complejidad; normalmente complementario. | Asociación inicial por BLE/NFC/QR; UWB puede servir para ranging. |

## 3. Qué hace realmente un universal remote

Una arquitectura seria debe separar estas funciones:

1. **Transport adapter:** IR, BLE, Wi-Fi, RF, CEC, USB o Matter.
2. **Device identity:** fabricante, modelo, tipo, dirección, serial o identificador lógico.
3. **Command vocabulary:** `POWER`, `VOLUME_UP`, `SOURCE`, `TEMP_SET`, `PLAY`, `PAN`, `ZOOM`, etc.
4. **Protocol encoding:** conversión del comando abstracto al código IR, característica GATT, mensaje IP o frame RF.
5. **Capability discovery:** qué comandos soporta realmente el equipo.
6. **State observation:** respuesta o estado observado; no debe inventarse si el canal es unidireccional.
7. **Pairing/bonding:** creación de relación técnica segura.
8. **Authorization:** quién puede controlar qué equipo.
9. **Binding:** asociación persistente entre usuario, mando, hub y dispositivo.
10. **Audit:** quién envió el comando, cuándo, a qué equipo y con qué resultado.

**Pairing no es autorización.** Pairing crea o negocia una relación de comunicación; autorización decide si el usuario puede ejecutar una acción concreta.

## 4. Tipos de pairing / onboarding

### 4.1 IR sin pairing

El mando no se autentica con el televisor. Se selecciona un código de fabricante/modelo, se prueba una función o se aprende el patrón desde el mando original. La principal debilidad es que un emisor cercano puede transmitir comandos; no existe identidad criptográfica del receptor.

### 4.2 Code-based setup

El usuario introduce un código de marca/modelo o la aplicación prueba una secuencia controlada. Es fácil de implementar, pero demuestra compatibilidad funcional, no propiedad del equipo. Debe registrarse como `configured_by_code`, no como dispositivo criptográficamente emparejado.

### 4.3 IR learning

El mando original transmite una orden; el universal captura frecuencia portadora, tiempos, repetición y patrón. Debe conservarse el origen y limitarse el aprendizaje a comandos declarativos. No se debe ejecutar código recibido ni presentar el patrón aprendido como firmware confiable.

### 4.4 RF enrollment

Un hub o dispositivo entra en modo de registro; el usuario pulsa un botón físico o introduce un código. Algunos mandos usan rolling codes o claves propietarias. Sin documentación del fabricante, ARKI debe clasificar el protocolo como `UNKNOWN`, no asumir que cualquier RF puede copiarse.

### 4.5 Bluetooth Classic pairing/bonding

El dispositivo se descubre, se negocia el método de autenticación y se almacenan claves para reconexión. Android distingue pairing, bonding, conexión y transferencia de datos. El perfil importa: un teclado/trackpad puede usar HID, mientras un mando propio puede usar un protocolo propietario.

### 4.6 BLE pairing y GATT binding

El móvil descubre un periférico BLE, negocia seguridad y accede a servicios/características. El pairing puede existir sin que la aplicación tenga autorización semántica. ARKI/LUCA necesitaría un contrato de servicios: comandos permitidos, rangos, confirmaciones, timeouts y estado.

### 4.7 BLE Secure Connections association models

Bluetooth LE Secure Connections utiliza ECDH para derivar claves y contempla:

- **Just Works:** mínima interacción; no ofrece la misma protección contra MITM que la confirmación visible.
- **Numeric Comparison:** ambos dispositivos muestran un número y el usuario confirma que coincide.
- **Passkey Entry:** el usuario introduce un PIN/código.
- **Out of Band (OOB):** la credencial viaja por otro canal, por ejemplo NFC, QR o un código previamente compartido.

Para un control con pantalla y botones, **Numeric Comparison** o **Passkey Entry** son preferibles a Just Works cuando el riesgo de control no autorizado es relevante.

### 4.8 Wi-Fi SoftAP onboarding

El dispositivo crea temporalmente una red Wi-Fi. El teléfono se conecta, entrega las credenciales de la red doméstica y el equipo cambia a modo operativo. Debe existir timeout, credenciales protegidas, rollback y una indicación clara de éxito.

### 4.9 Wi-Fi local discovery

Después de entrar en la red, el mando puede descubrir equipos por mDNS/DNS-SD, SSDP/UPnP, protocolos del fabricante o una dirección configurada. Descubrir un equipo no debe significar automáticamente que el usuario está autorizado a controlarlo.

### 4.10 QR o código manual

El QR puede transportar identidad, dirección, discriminator, passcode o configuración. El código manual es una alternativa para cámaras que no pueden escanear. Debe usarse expiración, protección contra replay y validación de contexto.

### 4.11 Matter commissioning

Matter separa el **commissioning** de la operación posterior. El dispositivo puede usar QR/manual code, BLE para discovery y entrega inicial, PASE para el canal seguro, attestation y certificados operativos, y luego CASE para las comunicaciones operativas. Esto es más que “pairing Bluetooth”: es incorporación a una fabric con identidad y credenciales operativas.

### 4.12 NFC tap-to-pair

NFC puede entregar una credencial OOB, abrir una URL de onboarding o iniciar commissioning. Normalmente no es el canal de control continuo; reduce el error humano durante la configuración.

### 4.13 Account/cloud pairing

El equipo se vincula a una cuenta mediante código, QR, token o registro de dispositivo. La autorización debe incluir roles, revocación, sesiones, auditoría y separación entre propietario, administrador, invitado y automatización.

### 4.14 Certificate/device identity pairing

En entornos profesionales, el dispositivo puede presentar certificado y clave privada. El servidor valida la cadena de confianza antes de aceptar comandos. Es apropiado para hubs, edificios, cámaras, racks o equipos de infraestructura, no necesariamente para un televisor doméstico.

## 5. Arquitectura recomendada para LUCA, si algún día se implementa

```text
USER / MOBILE APP
        │
        ▼
IDENTITY + AUTHORIZATION
        │
        ▼
PAIRING / COMMISSIONING SERVICE
        │
        ├── BLE / Classic Bluetooth
        ├── Wi-Fi / IP
        ├── Matter / Thread
        ├── IR gateway
        ├── RF gateway
        ├── HDMI-CEC bridge
        └── USB HID bridge
        │
        ▼
DEVICE CAPABILITY REGISTRY
        │
        ▼
DECLARATIVE COMMAND MODEL
        │
        ▼
ADAPTER EXECUTION WORKER
        │
        ▼
AUDIT + OBSERVED STATE + HUMAN REVIEW
```

La interfaz debe distinguir al menos `DISCOVERED`, `PAIRING`, `BONDED`, `AUTHORIZED`, `CONNECTED`, `COMMAND_SENT`, `ACKNOWLEDGED`, `STATE_OBSERVED`, `TIMEOUT`, `REVOKED` y `UNKNOWN`.

## 6. Riesgos que deben evitarse

- Confundir “encontrado” con “emparejado”.
- Confundir “emparejado” con “autorizado”.
- Confundir “comando enviado” con “comando ejecutado”.
- Confundir un canal IR unidireccional con estado real del dispositivo.
- Guardar PIN, claves o tokens en texto plano.
- Permitir pairing silencioso desde cualquier dispositivo cercano.
- Permitir que un QR no expirado se reutilice indefinidamente.
- Ejecutar callbacks o código recibido como si fueran comandos.
- Dar al control remoto acceso al estado canónico de ARKI/LUCA.
- Convertir un control de presentación o teclado en control de seguridad física sin autorización adicional.

## 7. Clasificación para el Informe 1

| Capacidad | Clasificación actual |
|---|---|
| Universal remote en MiLukita | `NOT_DEMONSTRATED` |
| Keyboard/trackpad control en MiLukita | `NOT_DEMONSTRATED` |
| IR gateway | `PROPOSED / UNKNOWN` |
| Bluetooth pairing | `PROPOSED / UNKNOWN` |
| Wi-Fi/IP control | `PROPOSED / UNKNOWN` |
| Matter commissioning | `PROPOSED / UNKNOWN` |
| Multi-device command registry | `PROPOSED / UNKNOWN` |
| Remote-control audit trail | `PROPOSED / UNKNOWN` |

## Fuentes técnicas

[Bluetooth LE Secure Connections][1], [Android Bluetooth architecture][2], [Matter commissioning][3], [HDMI official specifications][4].

[1]: https://www.bluetooth.com/blog/bluetooth-pairing-part-4/  
[2]: https://developer.android.com/develop/connectivity/bluetooth  
[3]: https://docs.silabs.com/matter/latest/matter-overview-guides/matter-commissioning  
[4]: https://www.hdmi.org/spec/hdmi2_1
