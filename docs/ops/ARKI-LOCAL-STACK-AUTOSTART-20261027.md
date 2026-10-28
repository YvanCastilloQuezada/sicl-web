# ARKI — Stack local y arranque automático

**Fecha:** 2026-10-27
**Servidor:** Arki-001
**Estado:** Vigente

## Arquitectura

Todo el stack ARKI corre **localmente** en el servidor, sin dependencias externas (Railway abandonado por decisión del PO).

## Servicios systemd

| Servicio | Puerto | Función | Enabled |
|----------|--------|---------|---------|
| `sicl-core.service` | 8000 | Core API (FastAPI + SQLite) | Si |
| `sicl-web.service` | 3001 | Frontend SICL (React + Vite) | Si |
| `arki-arbol-vivo.service` | 8768 | Árbol Vivo histórico AV-023 | Si |
| `arki-all.service` | — | Arranque maestro (boot) | Si |

## Arranque automático

El servicio `arki-all.service` arranca al bootear y ejecuta `~/ARKI/bin/arki-all-start.sh`, que:

1. Arranca `sicl-core.service` y espera a que `http://127.0.0.1:8000/health` dé 200.
2. Arranca `arki-arbol-vivo.service` y espera a que `http://127.0.0.1:8768/` dé 200.
3. Arranca `sicl-web.service` y espera a que `http://127.0.0.1:3001/api/core/health` dé 200.
4. Verifica los 3 endpoints y escribe el resultado en `~/ARKI/continuity/startup.log`.

## Comandos de operación

    # Arrancar todo manualmente
    systemctl --user start arki-all.service

    # Detener todo
    systemctl --user stop sicl-web arki-arbol-vivo sicl-core

    # Reiniciar todo
    systemctl --user restart arki-all.service

    # Ver estado
    systemctl --user status sicl-core sicl-web arki-arbol-vivo arki-all --no-pager

    # Ver logs del arranque
    cat ~/ARKI/continuity/startup.log
    journalctl --user -u arki-all -n 50 --no-pager

    # Verificar endpoints
    curl -s -o /dev/null -w "Core: %{http_code}\n" http://127.0.0.1:8000/health
    curl -s -o /dev/null -w "Arbol: %{http_code}\n" http://127.0.0.1:8768/
    curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://127.0.0.1:3001/api/core/health

## URLs de acceso

| Servicio | Local | LAN | Tailscale |
|----------|-------|-----|-----------|
| Frontend | http://127.0.0.1:3001 | http://10.0.1.2:3001 | http://100.125.95.8:3001 |
| Core API | http://127.0.0.1:8000/health | http://10.0.1.2:8000/health | http://100.125.95.8:8000/health |
| Árbol Vivo | http://127.0.0.1:8768 | http://10.0.1.2:8768 | http://100.125.95.8:8768 |

## Recuperación después de un apagón

**No requiere intervención manual.** Al reiniciar el servidor:

1. `systemd` arranca `default.target` (con `loginctl enable-linger arki`).
2. `default.target` arranca `arki-all.service`.
3. `arki-all.service` ejecuta el script maestro y arranca los 3 servicios en orden.
4. En ~30-60 segundos, los 3 endpoints están disponibles.

Verificar con:

    systemctl --user status arki-all.service --no-pager
    cat ~/ARKI/continuity/startup.log

## Linger

El usuario `arki` tiene `linger` habilitado (`sudo loginctl enable-linger arki`), lo que permite que los servicios `--user` arranquen al bootear el servidor, sin necesidad de login SSH.

Verificar:

    loginctl show-user arki | grep Linger
    # Linger=yes

## Firewall

Puertos abiertos en ufw:
- 8000/tcp (Core)
- 3001/tcp (Frontend)
- 8768/tcp (Árbol Vivo)

Verificar:

    sudo ufw status | grep -E "8000|3001|8768"

## Variables de entorno

El frontend lee `.env.local`:

    SICL_CORE_URL=http://127.0.0.1:8000
    SICL_CORE_SERVICE_TOKEN=<token>

El token también está en el servicio systemd del Core (`Environment="SICL_CORE_SERVICE_TOKEN=..."`).

## Nota sobre el log del script

El `startup.log` puede mostrar `HTTP 000` en la verificación final si el `curl` se ejecuta antes de que los servicios estén listos. Esto es un falso negativo del script. Los servicios SI responden 200 (verificar con `curl` manual).

## Referencias

- `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md` — integración systemd original.
- `docs/arki-planning/DECISIONS.md` — decisión de abandonar Railway.
- `~/ARKI/bin/arki-all-start.sh` — script maestro de arranque.
