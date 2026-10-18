from __future__ import annotations

import base64
import hashlib
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path('/home/ubuntu/ruleta-peru-online')
DELIVERABLES = Path('/home/ubuntu/financial_deliverables')
OUTPUT = DELIVERABLES / 'auditoria_consolidada_multi_juegos_peru_2026-08-24.txt'

EXCLUDED_DIRS = {'.git', 'node_modules', '.manus', '.manus-logs', 'dist', 'build', '__pycache__'}
TEXT_EXTENSIONS = {
    '.css', '.csv', '.html', '.js', '.json', '.md', '.mjs', '.py', '.sh', '.sql',
    '.toml', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml', '.lock', '.gitignore',
    '.prettierignore', '.prettierrc', '.npmrc', '.eslintrc', '.env.example',
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def is_excluded(path: Path) -> bool:
    relative_parts = path.relative_to(PROJECT_ROOT).parts
    if any(part in EXCLUDED_DIRS for part in relative_parts):
        return True
    name = path.name
    return name == '.env' or name.startswith('.env.')


def is_text_file(path: Path, data: bytes) -> bool:
    if path.suffix.lower() in TEXT_EXTENSIONS or path.name in TEXT_EXTENSIONS:
        return True
    try:
        data.decode('utf-8')
        return True
    except UnicodeDecodeError:
        return False


def project_entries() -> list[tuple[str, Path]]:
    entries: list[tuple[str, Path]] = []
    for path in sorted(PROJECT_ROOT.rglob('*')):
        if not path.is_file() or is_excluded(path):
            continue
        entries.append((f'proyecto/{path.relative_to(PROJECT_ROOT).as_posix()}', path))
    return entries


def external_entries() -> list[tuple[str, Path]]:
    selected: list[tuple[str, Path]] = [
        ('entregables/modelo_tentativo_multi_juegos_peru.xlsx', DELIVERABLES / 'modelo_tentativo_multi_juegos_peru.xlsx'),
        ('entregables/presentacion_ejecutiva_multi_juegos_peru.md', DELIVERABLES / 'presentacion_ejecutiva_multi_juegos_peru.md'),
        ('analisis/regulatory_findings.md', Path('/home/ubuntu/regulatory_findings.md')),
        ('analisis/calcular_probabilidades_piloto.py', Path('/home/ubuntu/calcular_probabilidades_piloto.py')),
        ('analisis/calcular_cartas_y_mercados.py', Path('/home/ubuntu/calcular_cartas_y_mercados.py')),
        ('analisis/create_multi_juegos_financial_model.py', Path('/home/ubuntu/create_multi_juegos_financial_model.py')),
        ('analisis/validate_multi_juegos_financial_model.py', Path('/home/ubuntu/validate_multi_juegos_financial_model.py')),
        ('analisis/create_audit_package.sh', Path('/home/ubuntu/create_audit_package.sh')),
        ('analisis/create_single_audit_file.py', Path('/home/ubuntu/create_single_audit_file.py')),
    ]
    for presentation_source in sorted(DELIVERABLES.glob('multi-juegos-ejecutivo-*')):
        if presentation_source.is_dir():
            for path in sorted(presentation_source.rglob('*')):
                if path.is_file():
                    selected.append((f'entregables/fuente_presentacion/{path.relative_to(presentation_source).as_posix()}', path))
    return [(label, path) for label, path in selected if path.exists() and path.is_file()]


def write_separator(handle, label: str, payload: bytes, kind: str) -> None:
    handle.write('\n' + '=' * 100 + '\n')
    handle.write(f'ARCHIVO: {label}\n')
    handle.write(f'TIPO: {kind}\n')
    handle.write(f'TAMANIO_BYTES: {len(payload)}\n')
    handle.write(f'SHA256: {sha256(payload)}\n')
    handle.write('=' * 100 + '\n')


def main() -> None:
    entries = project_entries() + external_entries()
    seen: set[str] = set()
    unique_entries = []
    for label, path in entries:
        if label not in seen:
            unique_entries.append((label, path))
            seen.add(label)

    with OUTPUT.open('w', encoding='utf-8', newline='\n') as handle:
        handle.write('# AUDITORIA CONSOLIDADA — MULTI JUEGOS PERU\n')
        handle.write('# Fecha de generación: 2026-08-24\n')
        handle.write('# Formato: cada archivo está separado por ruta, tipo, tamaño y SHA-256.\n')
        handle.write('# Texto: contenido UTF-8 legible. Binario: codificación Base64 para preservación.\n')
        handle.write('# Exclusiones de seguridad: dependencias instaladas, historial Git, registros temporales y archivos de entorno.\n')
        handle.write('# No se incluye el XLSM legado por contener macros y potenciales datos personales; se mantiene como insumo original separado.\n')
        handle.write(f'# Archivos consolidados: {len(unique_entries)}\n')

        for label, path in unique_entries:
            payload = path.read_bytes()
            if is_text_file(path, payload):
                write_separator(handle, label, payload, 'TEXTO_UTF8')
                handle.write(payload.decode('utf-8', errors='replace'))
                if not payload.endswith(b'\n'):
                    handle.write('\n')
            else:
                write_separator(handle, label, payload, 'BINARIO_BASE64')
                handle.write(base64.b64encode(payload).decode('ascii'))
                handle.write('\n')

        handle.write('\n' + '=' * 100 + '\n')
        handle.write('FIN DE AUDITORIA CONSOLIDADA\n')
        handle.write('=' * 100 + '\n')

    print(OUTPUT)
    print(f'Archivos incorporados: {len(unique_entries)}')
    print(f'SHA256 del consolidado: {sha256(OUTPUT.read_bytes())}')


if __name__ == '__main__':
    main()
