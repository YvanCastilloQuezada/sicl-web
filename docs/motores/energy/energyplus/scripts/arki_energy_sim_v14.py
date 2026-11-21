#!/usr/bin/env python3
"""
ARKI-GIA — Simulación Energética con EnergyPlus (V14 - Exitosa)
Fecha: 2026-11-20
Hito: Primera simulación anual exitosa con extracción de datos reales.

Este script:
1. Crea un modelo Honeybee de una caja 5x5x3m con ventana 40% sur
2. Asigna programa de oficina (office_program)
3. Genera IDF con model_to_idf()
4. Inyecta objetos obligatorios: Building, GlobalGeometryRules, Timestep, RunPeriod
5. Inyecta Output:Variable para extraer temperatura y energía
6. Ejecuta EnergyPlus vía subprocess
7. Lee y muestra el CSV de resultados

Requisitos:
- honeybee-energy instalado
- EnergyPlus en PATH o /usr/local/bin/energyplus
- EPW de Lima en server/gia/energy/weather/lima_pe.epw
"""

import os
import shutil
import subprocess
from pathlib import Path
from honeybee.model import Model
from honeybee.room import Room
from honeybee_energy.simulation.parameter import SimulationParameter
from honeybee_energy.writer import model_to_idf

def crear_modelo():
    """Crea modelo de caja con ventana sur."""
    room = Room.from_box('Sala_Prueba', 5, 5, 3)
    south_face = room[3]
    south_face.apertures_by_ratio(0.4, 0.01)
    
    try:
        from honeybee_energy.lib.programtypes import office_program
        room.properties.energy.program_type = office_program
    except ImportError:
        print("⚠️ Usando programa genérico.")
    
    return Model('Modelo_Prueba_ARKI', [room])

def reparar_idf(idf_content):
    """Inyecta objetos obligatorios si faltan."""
    required_objects = {
        "Building,": "Building, ARKI Building, 0, Suburbs, 0.04, 0.004, FullExterior, 25, 6;\n",
        "GlobalGeometryRules,": "GlobalGeometryRules, UpperLeftCorner, CounterClockwise, Relative;\n",
        "Timestep,": "Timestep, 6;\n",
        "RunPeriod,": "RunPeriod, ANIO_COMPLETO, 1, 1, 2026, 12, 31, 2026, Tuesday, Yes, Yes, No, Yes, Yes;\n",
    }
    
    for obj_name, obj_content in required_objects.items():
        if obj_name not in idf_content:
            idf_content += obj_content
    
    # Variables de salida
    if "Output:Variable," not in idf_content:
        idf_content += """
Output:Variable, *, Zone Mean Air Temperature, Hourly;
Output:Variable, *, Site Outdoor Air Drybulb Temperature, Hourly;
Output:Variable, *, Zone Electric Equipment Electric Energy, Hourly;
Output:Variable, *, Zone Lights Electric Energy, Hourly;
"""
    
    return idf_content

def ejecutar_simulacion(idf_path, epw_path, output_dir):
    """Ejecuta EnergyPlus y retorna código de salida."""
    ep_exe = shutil.which('energyplus') or '/usr/local/bin/energyplus'
    command = [ep_exe, "-w", epw_path, str(idf_path)]
    
    result = subprocess.run(command, cwd=str(output_dir), capture_output=True, text=True)
    return result.returncode

def leer_resultados(output_dir):
    """Lee el CSV y extrae KPIs básicos."""
    csv_files = list(output_dir.glob("eplusout.csv"))
    if not csv_files:
        return None
    
    with open(csv_files[0], 'r') as f:
        lines = f.readlines()
    
    if len(lines) < 2:
        return None
    
    header = lines[0].strip().split(',')
    first_data = lines[1].strip().split(',')
    
    return {
        'total_filas': len(lines) - 1,
        'columnas': header,
        'primer_dato': first_data
    }

if __name__ == '__main__':
    print("🔷 ARKI-GIA Simulación Energética V14")
    print("=" * 50)
    
    model = crear_modelo()
    print(f"✅ Modelo creado: {model.display_name}")
    
    idf_content = model_to_idf(model)
    idf_content = reparar_idf(idf_content)
    
    output_dir = Path.home() / "ARKI" / "sim_results" / "energy_test"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    idf_path = output_dir / "model.idf"
    with open(idf_path, 'w') as f:
        f.write(idf_content)
    
    epw_path = Path("/home/arki/ARKI/canonical/sicl-web/server/gia/energy/weather/lima_pe.epw")
    
    print("🚀 Ejecutando EnergyPlus...")
    returncode = ejecutar_simulacion(idf_path, epw_path, output_dir)
    
    if returncode == 0:
        print("✅ Simulación exitosa")
        resultados = leer_resultados(output_dir)
        if resultados:
            print(f"📊 Filas: {resultados['total_filas']}")
            print(f"📋 Columnas: {len(resultados['columnas'])}")
    else:
        print(f"❌ Error: código {returncode}")
