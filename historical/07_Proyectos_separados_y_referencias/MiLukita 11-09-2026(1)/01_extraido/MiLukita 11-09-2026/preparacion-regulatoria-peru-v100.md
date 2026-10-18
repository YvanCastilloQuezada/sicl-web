# Preparación regulatoria por diseño — Perú v1.0.0

> **Nota de alcance.** Este documento es un análisis técnico de preparación y no asesoría legal. Antes de depender de él, solicitar, operar o publicitar actividades reguladas, debe revisarlo un abogado peruano especializado y, cuando corresponda, la autoridad competente.

## Decisión recomendada

Sí, es recomendable diseñar desde el día uno los límites de autorización, certificación técnica, control de cambios, juego responsable, pagos, identidad, prevención LA/FT y controles territoriales. Hacerlo temprano reduce retrabajo, pero **no convierte al piloto en una plataforma autorizada**. El proyecto actual sigue siendo un piloto gratuito: no acepta pagos, no permite retiros, no convierte créditos, no captura documentos, no utiliza geolocalización precisa ni declara homologación.

MINCETUR identifica a la DGJCMT como la autoridad que formula, supervisa y fiscaliza el marco aplicable a juegos y apuestas a distancia; su portal remite a la Ley N.º 31557, su modificación por Ley N.º 31806 y el D.S. N.º 005-2023-MINCETUR.[1] La autorización/homologación de una plataforma tecnológica exige certificación técnica de laboratorio autorizado y una descripción de arquitectura, seguridad, auditoría y observancia de estándares técnicos.[2] La autorización de explotación es un procedimiento distinto con requisitos societarios, de proveedores, gestión de cambios y listado de modalidades, entre otros.[3]

| Dominio | Estado en el piloto | Decisión de diseño | Condición antes de activarlo |
|---|---|---|---|
| Autorización y homologación | Desactivado | Separar reglas, versiones, auditoría y proveedores por módulos | Autorización aplicable y certificación/homologación que corresponda |
| KYC y mayoría de edad | Desactivado; sin documentos ni biometría | Aislar cualquier futuro proveedor detrás de una interfaz de cumplimiento | Base legal, política de privacidad, proveedor evaluado y revisión especializada |
| AML/SPLAFT | Desactivado; no existen fondos reales | Modelar eventos de cumplimiento sin ejecutar reportes ni screening | Programa aprobado, roles, procedimientos y obligaciones confirmadas |
| Pagos | Desactivado; créditos sin valor monetario | Mantener billetera virtual separada de cualquier futura conciliación | Autorización, contratos, seguridad, fraude y pruebas de conciliación |
| Geolocalización | Desactivado; sin ubicación precisa | Definir una capa territorial independiente de la lógica de juego | Base legal, aviso de privacidad y reglas por jurisdicción confirmadas |
| Juego responsable | Parcialmente presente | Conservar límites de sesión, pausas y mensajes no adictivos | Políticas de exclusión, monitoreo y atención validadas para operación regulada |
| Auditoría y cambios | Presente para piloto | Versionar reglas, RTP, semillas, comprobantes y cambios | Alcance de certificación y retención acordado con auditor/certificador |

## Implementación actual y límites explícitos

El archivo `shared/regulatoryReadiness.ts` registra los ocho dominios como `design-only` con `enabled: false`. El guard `REGULATORY_READINESS_PILOT_GUARD` fija que el piloto es solo virtual y que pagos, recolección de identidad, geolocalización precisa y declaraciones de cumplimiento están desactivados. Esta decisión impide que una mejora de interfaz se interprete como autorización, KYC, AML, pagos o control territorial real.

La recomendación práctica es mantener este enfoque de **arquitectura preparada, activación bloqueada**. Cada activación futura debe pasar por una decisión formal, revisión legal/técnica, aprobación de privacidad, contrato de proveedores, pruebas, certificación/homologación que corresponda y un control de cambios auditable. No se debe habilitar una pasarela, capturar documentos, usar biometría, aplicar geolocalización o aceptar depósitos únicamente cambiando una bandera del frontend.

## Referencias

[1] [MINCETUR — Juegos online y apuestas deportivas](https://apuestasdeportivas.mincetur.gob.pe/)

[2] [gob.pe / MINCETUR — Autorización y registro (homologación) de plataformas tecnológicas](https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia)

[3] [gob.pe / MINCETUR — Autorización o renovación de explotación de plataformas tecnológicas](https://www.gob.pe/94255-autorizacion-y-o-renovacion-de-explotacion-de-plataformas-tecnologicas-de-juegos-a-distancia-y-apuestas-deportivas-a-distancia)
