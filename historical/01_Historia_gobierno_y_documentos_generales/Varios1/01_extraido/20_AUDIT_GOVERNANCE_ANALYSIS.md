# 20 — Auditoría y gobernanza

## Registrado

Territorial Trust registra creación/edición de WorldObjects, claims, sources, evidence, assets, revisiones, publicación, offline queue, sincronización, conflictos y resolución. Snapshots y hashes conservan versiones históricas. Los informes Field Gate registran pasos, severidad, dispositivo, observaciones y sincronización.

## No se debe asumir registrado

Cada hover, navegación, descarga, prompt de cámara, error de proveedor externo o decisión visual no necesariamente genera audit event. La telemetría de producto no equivale a auditoría epistemológica territorial.

## Gobernanza

Mapper captura; Eye revisa; Human Authority publica. Agentes observan/alertan/proponen/proyectan. MJP CORE conserva autoridad sobre sus dominios. La UI no puede convertir un estado `VERIFIED` en `PUBLISHED` sin procedimiento server-side.

## Riesgos

La cadena hash es fuerte solo si todos los writes relevantes pasan por el servicio, los payloads se canonicalizan y el acceso directo a DB está controlado. La certificación final requiere revisar logs, migraciones, credenciales, backups y permisos en el entorno publicado.
