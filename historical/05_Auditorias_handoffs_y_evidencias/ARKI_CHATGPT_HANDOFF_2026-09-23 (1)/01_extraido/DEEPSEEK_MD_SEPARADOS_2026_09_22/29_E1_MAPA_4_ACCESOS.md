# E1.1 — Mapa de cuatro accesos

Archi utiliza cuatro accesos con permisos progresivos. El acceso no cambia la existencia del modelo; controla qué puede consultar, editar, aprobar y exportar cada perfil.

| Acceso | Propósito | Puede hacer | No puede hacer sin autorización |
|---|---|---|---|
| Visitante | Explorar el producto | Ver demostraciones, documentación pública y capacidades de muestra | Acceder a proyectos privados, editar, exportar datos sensibles o aprobar |
| Usuario / Proyecto | Diseñar y revisar su proyecto | Crear propuestas, generar familias, consultar modelo, planta, corte, metrados, presupuesto referencial y expediente de trabajo | Aprobar cálculo profesional, firmar, publicar o administrar políticas corporativas |
| Especialista / Coordinación | Revisar por disciplina | Consultar y revisar arquitectura, estructuras, MEP, costos, planificación, incidencias y trazabilidad | Firmar disciplinas ajenas, cambiar gobierno corporativo o publicar sin gate |
| Corporativo | Gobernar la organización | Administrar catálogos, estándares, roles, costos, proyectos, revisiones, O-M, publicaciones y políticas | Sustituir la firma profesional requerida por la normativa |

Cada acceso debe conservar trazabilidad, mostrar estados de bloqueo y aplicar el principio de mínimo privilegio. El estado `BLOCKED` debe ser visible y no debe transformarse en un error silencioso.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
