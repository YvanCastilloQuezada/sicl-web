#!/usr/bin/env python3
"""
ARKI Stack Verification Script
Verifica que todos los motores del stack World-Class estén instalados y funcionales.
"""

import sys
import importlib
import subprocess
import shutil
from pathlib import Path

CHECKS = []

def check(name, category, test_func):
    """Registra y ejecuta una verificación."""
    try:
        result, detail = test_func()
        status = "✅ OK" if result else "❌ FAIL"
    except Exception as e:
        result = False
        detail = f"Excepción: {str(e)[:80]}"
        status = "❌ ERROR"
    
    CHECKS.append({
        "name": name,
        "category": category,
        "status": status,
        "detail": detail,
        "passed": result
    })
    print(f"  {status}  {name:30s} {detail}")

# =====================================================================
# NIVEL 1: LADYBUG + HONEYBEE (CRÍTICO)
# =====================================================================
print("\n🔷 NIVEL 1: LADYBUG + HONEYBEE (CRÍTICO)")

def test_ladybug_core():
    m = importlib.import_module("ladybug")
    return True, f"v{getattr(m, '__version__', '?')}"
check("ladybug-core", "L1", test_ladybug_core)

def test_ladybug_geometry():
    m = importlib.import_module("ladybug_geometry")
    return True, f"v{getattr(m, '__version__', '?')}"
check("ladybug-geometry", "L1", test_ladybug_geometry)

def test_ladybug_radiance():
    m = importlib.import_module("ladybug_radiance")
    return True, f"v{getattr(m, '__version__', '?')}"
check("ladybug-radiance", "L1", test_ladybug_radiance)

def test_ladybug_comfort():
    m = importlib.import_module("ladybug_comfort")
    return True, f"v{getattr(m, '__version__', '?')}"
check("ladybug-comfort", "L1", test_ladybug_comfort)

def test_honeybee_core():
    m = importlib.import_module("honeybee")
    return True, f"v{getattr(m, '__version__', '?')}"
check("honeybee-core", "L1", test_honeybee_core)

def test_honeybee_energy():
    m = importlib.import_module("honeybee_energy")
    return True, f"v{getattr(m, '__version__', '?')}"
check("honeybee-energy", "L1", test_honeybee_energy)

def test_honeybee_radiance():
    m = importlib.import_module("honeybee_radiance")
    return True, f"v{getattr(m, '__version__', '?')}"
check("honeybee-radiance", "L1", test_honeybee_radiance)

def test_dragonfly_core():
    m = importlib.import_module("dragonfly")
    return True, f"v{getattr(m, '__version__', '?')}"
check("dragonfly-core", "L1", test_dragonfly_core)

# =====================================================================
# NIVEL 2: SOSTENIBILIDAD Y BIM
# =====================================================================
print("\n🔷 NIVEL 2: SOSTENIBILIDAD Y BIM")

def test_brightway():
    m = importlib.import_module("brightway2")
    return True, f"v{getattr(m, '__version__', '?')}"
check("brightway2", "L2", test_brightway)

def test_ifcopenshell():
    m = importlib.import_module("ifcopenshell")
    return True, f"v{getattr(m, '__version__', '?')}"
check("IfcOpenShell", "L2", test_ifcopenshell)

# =====================================================================
# NIVEL 3: INGENIERÍA Y RESILIENCIA
# =====================================================================
print("\n🔷 NIVEL 3: INGENIERÍA Y RESILIENCIA")

def test_pynite():
    try:
        m = importlib.import_module("Pynite")
    except ImportError:
        m = importlib.import_module("pynite")
    return True, f"v{getattr(m, '__version__', '?')}"
check("pynite", "L3", test_pynite)

def test_openseespy():
    m = importlib.import_module("openseespy.opensees")
    return True, "OK"
check("openseespy", "L3", test_openseespy)

def test_osmnx():
    m = importlib.import_module("osmnx")
    return True, f"v{getattr(m, '__version__', '?')}"
check("osmnx", "L3", test_osmnx)

def test_geopandas():
    m = importlib.import_module("geopandas")
    return True, f"v{getattr(m, '__version__', '?')}"
check("geopandas", "L3", test_geopandas)

def test_rasterio():
    m = importlib.import_module("rasterio")
    return True, f"v{getattr(m, '__version__', '?')}"
check("rasterio", "L3", test_rasterio)

def test_gdal():
    from osgeo import gdal
    return True, f"v{gdal.__version__}"
check("gdal-python", "L3", test_gdal)

def test_pyproj():
    m = importlib.import_module("pyproj")
    return True, f"v{getattr(m, '__version__', '?')}"
check("pyproj", "L3", test_pyproj)

def test_shapely():
    m = importlib.import_module("shapely")
    return True, f"v{getattr(m, '__version__', '?')}"
check("shapely", "L3", test_shapely)

# =====================================================================
# NIVEL 4: GENERATIVO Y OPTIMIZACIÓN
# =====================================================================
print("\n🔷 NIVEL 4: GENERATIVO Y OPTIMIZACIÓN")

def test_pygad():
    m = importlib.import_module("pygad")
    return True, f"v{getattr(m, '__version__', '?')}"
check("pygad", "L4", test_pygad)

def test_deap():
    m = importlib.import_module("deap")
    return True, f"v{getattr(m, '__version__', '?')}"
check("deap", "L4", test_deap)

def test_trimesh():
    m = importlib.import_module("trimesh")
    return True, f"v{getattr(m, '__version__', '?')}"
check("trimesh", "L4", test_trimesh)

def test_eppy():
    m = importlib.import_module("eppy")
    return True, f"v{getattr(m, '__version__', '?')}"
check("eppy", "L4", test_eppy)

# =====================================================================
# BINARIOS DEL SISTEMA
# =====================================================================
print("\n🔷 BINARIOS DEL SISTEMA")

def test_energyplus():
    path = shutil.which("energyplus")
    if path:
        result = subprocess.run([path, "--version"], capture_output=True, text=True, timeout=5)
        version = result.stdout.strip().split("\n")[0] if result.stdout else "?"
        return True, version
    return False, "No encontrado en PATH"
check("EnergyPlus", "BIN", test_energyplus)

def test_radiance():
    path = shutil.which("rpict")
    if path:
        return True, f"Binario en: {path}"
    return False, "No encontrado en PATH"
check("Radiance (rpict)", "BIN", test_radiance)

def test_radiance_gendaylit():
    path = shutil.which("gendaylit")
    if path:
        return True, f"Binario en: {path}"
    return False, "No encontrado en PATH"
check("Radiance (gendaylit)", "BIN", test_radiance_gendaylit)

# =====================================================================
# REPORTE FINAL
# =====================================================================
print("\n" + "="*70)
print("REPORTE FINAL DEL STACK ARKI-GIA")
print("="*70)

total = len(CHECKS)
passed = sum(1 for c in CHECKS if c["passed"])
failed = total - passed

print(f"\nTotal verificaciones: {total}")
print(f"Aprobadas: {passed} ✅")
print(f"Fallidas: {failed} ❌")
print(f"Porcentaje de éxito: {(passed/total*100):.1f}%")

if failed > 0:
    print("\n❌ FALLAS DETECTADAS:")
    for c in CHECKS:
        if not c["passed"]:
            print(f"   - {c['name']:30s} [{c['category']}]: {c['detail']}")

print("\n" + "="*70)

# Salir con código de estado apropiado
sys.exit(0 if failed == 0 else 1)
