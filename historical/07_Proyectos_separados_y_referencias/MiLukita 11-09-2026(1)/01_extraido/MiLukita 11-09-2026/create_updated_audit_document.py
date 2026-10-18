from __future__ import annotations

import base64
import hashlib
from pathlib import Path

PROJECT_ROOT = Path('/home/ubuntu/ruleta-peru-online')
DELIVERABLES = Path('/home/ubuntu/financial_deliverables')
OUTPUT = DELIVERABLES / 'auditoria_actualizada_multi_juegos_peru_2026-08-24.txt'

EXCLUDED_DIRS = {'.git', 'node_modules', '.manus', '.manus-logs', 'dist', 'build', '__pycache__'}
TEXT_EXTENSIONS = {
    '.css', '.csv', '.html', '.js', '.json', '.md', '.mjs', '.py', '.sh', '.sql',
    '.toml', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml', '.lock', '.gitignore',
    '.prettierignore', '.prettierrc', '.npmrc', '.eslintrc', '.env.example',
}

EXECUTIVE_AUDIT = """# AUDITORÍA ACTUALIZADA — MULTI JUEGOS PERÚ
# Fecha de corte: 24 de agosto de 2026
# Documento único para revisión técnica, funcional y de hoja de ruta.

====================================================================================================
SECCIÓN 1 — RESUMEN EJECUTIVO
====================================================================================================

Estado general: PILOTO GRATUITO FUNCIONAL Y VERIFICABLE.

El producto implementa Ruleta, Jackpot, Bingo, Lotería, Trío 13, MultiMarket curado y un módulo de
impacto social, exclusivamente con créditos virtuales. No procesa dinero real, depósitos, retiros ni
contratos transferibles. Los resultados de servidor se apoyan en evidencia criptográfica, reglas
versionadas y comprobantes públicos.

La revisión más reciente añadió: límites HTTP, cabeceras de seguridad, identificadores de solicitud,
rutas de salud de aplicación/base de datos, preferencias persistentes de accesibilidad, procedimientos
de incidente, borrador de privacidad, plan UAT y pruebas de regresión. La validación de corte aprobó
`pnpm check` y 18 pruebas Vitest.

====================================================================================================
SECCIÓN 2 — IMPLEMENTADO Y VERIFICADO
====================================================================================================

| Área | Estado | Evidencia principal |
|---|---|---|
| Modalidades del piloto | Implementado | Ruleta, Jackpot, Bingo, Lotería, Trío 13 y MultiMarket virtual curado. |
| Equidad y trazabilidad | Implementado | HMAC-SHA-256, rechazo uniforme, hashes previos, semillas reveladas y cadena de auditoría. |
| Billetera y premios | Implementado | Créditos y movimientos exclusivamente virtuales; sin retiros. |
| Operación | Implementado | Rondas, reglas, promociones, cierre, resolución/anulación de mercados y auditoría. |
| Seguridad HTTP | Implementado | Helmet, límites por ventana, id de solicitud, `/health` y `/health/db`. |
| Accesibilidad | Implementado | Escala 100/125/150 %, alto contraste, reducir movimiento, escritorio y móvil. |
| Documentación operativa | Implementado | Incidentes, privacidad borrador, UAT, decisiones responsables y parámetros. |
| Calidad | Implementado | Chequeo TypeScript y 18 pruebas automatizadas aprobadas al corte. |
| Finanzas e impacto | Documentado | Modelo editable, escenarios, aporte institucional y gobernanza territorial condicionados. |

====================================================================================================
SECCIÓN 3 — PENDIENTE ANTES DE AMPLIAR EL PILOTO
====================================================================================================

| Prioridad | Pendiente | Condición de cierre | Horizonte tentativo |
|---|---|---|---|
| Alta | UAT moderado con personas adultas | Dos rondas, hallazgos priorizados y repetición de tareas críticas. | Próximas 1–2 semanas de trabajo. |
| Alta | Revisión legal de privacidad y términos | Identificar entidad responsable, bases legales, canales y proveedores reales. | Antes de abrir registro público. |
| Alta | Pruebas end-to-end e integración aislada | Cubrir ingreso, reserva, cierre, premio y verificación contra base de prueba. | Semanas 2–4. |
| Media | CSP estricta de producción | Inventario de scripts, fuentes e imágenes autorizados; prueba sin romper Vite/activos. | Antes de publicación pública. |
| Media | Pruebas de carga y observabilidad | Escenarios realistas, alertas y métricas; decidir caché/colas por evidencia. | Tras medir tráfico del piloto. |
| Media | Revisión independiente de RNG y reglas | Informe de tercero sobre evidencia, redondeos y liquidación virtual. | Antes de cualquier ampliación de audiencia. |

Las fechas son estimaciones de planificación, no compromisos de lanzamiento. Cada hito depende de que
las pruebas, el UAT y las revisiones de cumplimiento sean satisfactorias.

====================================================================================================
SECCIÓN 4 — DECISIONES POSPUESTAS O BLOQUEADAS
====================================================================================================

No se activarán dinero real, Yape, depósitos, retiros, conversión de créditos, descuentos obligatorios
de premios ni aportes sociales declarados como ejecutados. Tampoco se habilitarán mercados políticos,
legislativos, financieros, cripto, de salud o eventos sensibles; creación automática por usuarios;
intercambio P2P; torneos competitivos; chat en vivo; mercados flash; bonos por frecuencia; referidos
con multiplicadores; o comodines que cambien pagos. Estas medidas exigen evaluación adicional por
riesgo regulatorio, de abuso o de uso excesivo.

Para una futura operación real se requiere entidad operadora definida, asesoría jurídica peruana,
autorizaciones/certificaciones aplicables, control de edad, seguridad reforzada, términos aprobados,
contabilidad y un mecanismo verificable de impacto social. La regla propuesta de impacto es institucional
y calculada sobre utilidad neta elegible; nunca se descuenta automáticamente de premios.

====================================================================================================
SECCIÓN 5 — CRONOGRAMA TENTATIVO Y PUERTAS DE DECISIÓN
====================================================================================================

| Fase | Alcance | Resultado esperado | Puerta para avanzar |
|---|---|---|---|
| 0 — Completada | Producto virtual, equidad, MultiMarket curado, seguridad y accesibilidad base. | Checkpoint `acea1071`; 18 pruebas aprobadas. | Auditoría interna y revisión de este documento. |
| 1 — 1–2 semanas | UAT, revisión de incidentes simulados, corrección de hallazgos críticos. | Lista de fallos resuelta y aprendizaje documentado. | Comprensión del piloto y límites responsables demostrada. |
| 2 — 2–4 semanas | E2E, integración DB aislada, CSP, métricas técnicas mínimas. | Flujos críticos reproducibles y endurecimiento de publicación. | No defectos críticos; revisión de privacidad completada. |
| 3 — Después de Fase 2 | Piloto controlado de audiencia, sin dinero real. | Evidencia de uso, accesibilidad e incidentes reales. | Revisión de cumplimiento y riesgo antes de ampliar. |
| 4 — Sin fecha comprometida | Evaluación de operación regulada. | Decisión informada de continuar, pausar o rediseñar. | Certificación, estructura legal, controles y aprobación profesional. |

====================================================================================================
SECCIÓN 6 — CÓMO AUDITAR ESTE ARCHIVO
====================================================================================================

Cada archivo que sigue está separado por una cabecera `ARCHIVO`, ruta, tipo, tamaño y SHA-256.
Los archivos textuales se muestran directamente. El modelo XLSX u otros binarios se representan en
Base64 para que el documento siga siendo único y completo. No se incluyen dependencias instaladas,
historial Git, registros temporales, secretos/configuración de entorno ni el XLSM legado, que se mantiene
separado por contener macros y potenciales datos personales.

"""


def file_hash(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def is_excluded(path: Path) -> bool:
    relative_parts = path.relative_to(PROJECT_ROOT).parts
    if any(part in EXCLUDED_DIRS for part in relative_parts):
        return True
    name = path.name
    return name == '.env' or name.startswith('.env.')


def is_text(path: Path, payload: bytes) -> bool:
    if path.suffix.lower() in TEXT_EXTENSIONS or path.name in TEXT_EXTENSIONS:
        return True
    try:
        payload.decode('utf-8')
        return True
    except UnicodeDecodeError:
        return False


def source_entries() -> list[tuple[str, Path]]:
    entries: list[tuple[str, Path]] = []
    for path in sorted(PROJECT_ROOT.rglob('*')):
        if path.is_file() and not is_excluded(path):
            entries.append((f'proyecto/{path.relative_to(PROJECT_ROOT).as_posix()}', path))

    external = [
        ('entregables/modelo_tentativo_multi_juegos_peru.xlsx', DELIVERABLES / 'modelo_tentativo_multi_juegos_peru.xlsx'),
        ('entregables/presentacion_ejecutiva_multi_juegos_peru.md', DELIVERABLES / 'presentacion_ejecutiva_multi_juegos_peru.md'),
        ('analisis/regulatory_findings.md', Path('/home/ubuntu/regulatory_findings.md')),
        ('analisis/calcular_probabilidades_piloto.py', Path('/home/ubuntu/calcular_probabilidades_piloto.py')),
        ('analisis/calcular_cartas_y_mercados.py', Path('/home/ubuntu/calcular_cartas_y_mercados.py')),
        ('analisis/create_multi_juegos_financial_model.py', Path('/home/ubuntu/create_multi_juegos_financial_model.py')),
        ('analisis/validate_multi_juegos_financial_model.py', Path('/home/ubuntu/validate_multi_juegos_financial_model.py')),
        ('analisis/create_audit_package.sh', Path('/home/ubuntu/create_audit_package.sh')),
        ('analisis/create_single_audit_file.py', Path('/home/ubuntu/create_single_audit_file.py')),
        ('analisis/create_updated_audit_document.py', Path('/home/ubuntu/create_updated_audit_document.py')),
    ]
    entries.extend((label, path) for label, path in external if path.exists() and path.is_file())

    for presentation_source in sorted(DELIVERABLES.glob('multi-juegos-ejecutivo-*')):
        if presentation_source.is_dir():
            for path in sorted(presentation_source.rglob('*')):
                if path.is_file():
                    entries.append((f'entregables/fuente_presentacion/{path.relative_to(presentation_source).as_posix()}', path))
    return entries


def write_entry(handle, label: str, path: Path) -> None:
    payload = path.read_bytes()
    kind = 'TEXTO_UTF8' if is_text(path, payload) else 'BINARIO_BASE64'
    handle.write('\n' + '=' * 100 + '\n')
    handle.write(f'ARCHIVO: {label}\nTIPO: {kind}\nTAMANIO_BYTES: {len(payload)}\nSHA256: {file_hash(payload)}\n')
    handle.write('=' * 100 + '\n')
    if kind == 'TEXTO_UTF8':
        handle.write(payload.decode('utf-8', errors='replace'))
        if not payload.endswith(b'\n'):
            handle.write('\n')
    else:
        handle.write(base64.b64encode(payload).decode('ascii') + '\n')


def main() -> None:
    unique: dict[str, Path] = {}
    for label, path in source_entries():
        unique.setdefault(label, path)

    with OUTPUT.open('w', encoding='utf-8', newline='\n') as handle:
        handle.write(EXECUTIVE_AUDIT)
        handle.write(f'ARCHIVOS CONSOLIDADOS: {len(unique)}\n')
        for label, path in unique.items():
            write_entry(handle, label, path)
        handle.write('\n' + '=' * 100 + '\nFIN DE AUDITORÍA ACTUALIZADA\n' + '=' * 100 + '\n')

    payload = OUTPUT.read_bytes()
    print(OUTPUT)
    print(f'Archivos incorporados: {len(unique)}')
    print(f'SHA256 del documento: {file_hash(payload)}')


if __name__ == '__main__':
    main()
