# Expediente preliminar de RNG, plataforma y revisión legal

**Fecha de corte:** 26 de agosto de 2026  
**Estado:** preparación técnica; no es opinión legal ni certificación

## 1. Alcance técnico existente

El proyecto utiliza generación pseudoaleatoria de software y conserva evidencia de reglas, semillas, hashes, algoritmo, resultado y versión de reglas. La arquitectura separa la autoridad del servidor de la representación del cliente. Existen pruebas automatizadas de reglas, liquidación, verificación y simulación.

## 2. Paquete que debe revisar un laboratorio independiente

| Entregable | Estado |
|---|---|
| Descripción de arquitectura | Disponible en documentación del proyecto |
| Código/versionado del RNG | Parcial; requiere paquete controlado para laboratorio |
| Gestión de semillas | Implementada para verificación del piloto; revisión independiente pendiente |
| Estadística de resultados | Simulaciones disponibles; informe independiente pendiente |
| Reglas y tablas de premios | Versionadas; revisión legal/técnica pendiente |
| Trazabilidad de resultados | Implementada en piloto virtual |
| Seguridad de plataforma | Controles básicos implementados; pentest pendiente |
| Recuperación y continuidad | Simulada parcialmente; prueba operativa pendiente |
| Auditoría de acciones realtime | Tabla anti-replay implementada; pruebas distribuidas pendientes |

## 3. Referencia regulatoria preliminar

La información oficial consultada indica que MINCETUR cuenta con procedimientos para la autorización y registro (homologación) de plataformas tecnológicas y programas de juego. El trámite de plataforma solicita, entre otros elementos, una certificación técnica que describa arquitectura, seguridad, auditoría y observancia de estándares técnicos. El trámite de programas de juego solicita identificar cada programa y declarar su porcentaje teórico de retorno mínimo y máximo al público.

La Ley 31557 define los juegos a distancia como juegos de azar desarrollados mediante medios electrónicos, informáticos o interactivos y transmitidos por redes como televisión o internet. También establece objetivos de integridad, transparencia, juego responsable, protección de menores y prevención de lavado de activos. La aplicación concreta al piloto depende de sus características legales reales, especialmente si existe apuesta, premio económico, valor monetario o explotación comercial.

## 4. Decisión de producto para el piloto

El piloto permanece en créditos virtuales sin dinero real, retiros ni convertibilidad. Esta decisión reduce el alcance operativo actual, pero no debe interpretarse como una conclusión legal automática. Antes de abrir una operación comercial o monetizada se requiere asesoría legal peruana y una determinación formal del régimen aplicable.

## 5. Requisitos previos a cualquier monetización

Se deben completar revisión legal de cada modalidad, clasificación de juegos, autorización societaria, KYC/AML/SPLAFT cuando corresponda, controles de edad y exclusión, geolocalización, privacidad, términos, procedimiento de reclamos, certificación del RNG, certificación de plataforma, homologación de programas y validación de pagos. Ninguno de estos requisitos queda satisfecho únicamente por existir código en el repositorio.

## Referencias

[1]: https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia "MINCETUR — Homologación de plataformas tecnológicas"

[2]: https://www.gob.pe/94276-autorizacion-y-registro-homologacion-y-o-modificacion-de-programas-de-juego "MINCETUR — Homologación de programas de juego"

[3]: https://busquedas.elperuano.pe/dispositivo/NL/2095517-1 "El Peruano — Ley N.º 31557"
