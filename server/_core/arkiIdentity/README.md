
## Deuda técnica

Estado tras cierre F1b + F1c + F2.5 + OIDC (2026-11-08):

### Legacy marcado `@deprecated`

Los siguientes archivos tienen cabecera `@deprecated` y **NO se eliminan**
hasta completar la reconciliación sicl-web ↔ sicl-core ↔ arki-acs:

- `server/_core/arkiMo08LocalAuth.ts` — reemplazado por `arkiIdentity/auth.ts`
- `server/_core/arkiLocalSqlSessions.ts` — reemplazado por `arkiIdentity/storage.ts`
- `server/_core/arkiMo22Bridge.ts` — storage de objetos legacy, dormido
- `drizzle.config.ts` — `dialect: "mysql"` residual, no usar en runtime
- `drizzle/schema.ts` — `mysqlTable`/`mysqlEnum`, fuente de tipos (no driver)

### Por qué no se eliminan ahora

Hay código avanzado en `sicl-core` y `arki-acs` que podría referenciar
estos módulos o sus dependencias (`mysql2`). Eliminarlos antes de
auditar los 3 repos puede romper flujos cruzados.

**Fase de reconciliación pendiente:**
1. Auditar `sicl-core` y `arki-acs` en busca de referencias cruzadas.
2. Verificar que ningún workflow activo dependa de los módulos legacy.
3. Eliminar en commits atómicos: MO08, MO22, arkiLocalSqlSessions, mysql2, drizzle.config.ts.
4. Migrar `drizzle/schema.ts` a `sqliteTable` si se sigue usando como tipos.

### Deuda menor

- **Refresh token**: no implementado. JWT HS256 dura 7 días, token opaco 24h. Rotación manual (logout/login).
- **OIDC logout**: `POST /api/identity/oidc/logout` limpia cookie ARKI, no cierra sesión Gitea. Si se necesita logout total, redirigir a `{ARKI_OIDC_GITEA_URL}/user/logout`.
- **`scripts/identity-smoke-user.ts`**: imprime password por defecto. Añadir `--print-password` (fase futura).
