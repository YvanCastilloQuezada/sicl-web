# A★ — ARKI Context Gate

## Propósito

A★ es la puerta visual de entrada y continuidad de ARKI. Es una adaptación conceptual independiente de cualquier símbolo de MiLukita; no copia su identidad. Se muestra como un botón persistente en las superficies iniciales compatibles de ARKI y abre un QR contextual.

## Tipos de QR

| Tipo | Acción | No hace |
|---|---|---|
| `EXPERIENCE_QR` | Abre una experiencia concreta de ARKI, como la entrada general o el visor de campo | No vincula dispositivos ni concede permisos |
| `CONTROL_QR` | Prepara un pairing controlado para dispositivos | No autentica por sí solo, no confirma decisiones y no abre el Core |

La separación `Experience QR ≠ Control QR` es obligatoria.

## Seguridad

Cada QR lleva un `contextId`, una ruta, el tipo de QR, la expiración y `coreAccess=NONE`. No contiene contraseñas, tokens, cookies ni secretos. El TTL estándar es de diez minutos, con un máximo de sesenta. El servidor debe validar ownership, expiración y revocación antes de aceptar un pairing. La cámara denegada, el enlace expirado o la reconexión fallida deben producir degradación segura, no autorización implícita.

## Estado actual

La generación local de QR es real y escaneable. El contrato, TTL, clasificación y separación de permisos están implementados y probados. La revocación server-side, el pairing WebRTC físico, la validación en Android/iPhone y la reconexión requieren un host real y pruebas de dispositivos.

A★ no modifica Project State, no publica contenido y no puede hacer `DECISION_COMMIT` ni `PUBLISH`.
