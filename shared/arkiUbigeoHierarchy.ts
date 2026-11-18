/**
 * ARKI Ubigeo Hierarchy — Estructura Jerárquica para Selects en Cascada
 * Generado automáticamente por MO-ASOLEAMIENTO-HYBRID-V2
 */
import { type UbigeoLocation } from "./arkiUbigeoMap";
import { UBIGEO_MAP } from "./arkiUbigeoMap";

export type UbigeoHierarchy = Record<string, Record<string, string[]>>;

export const UBIGEO_HIERARCHY: UbigeoHierarchy = {
  "Arequipa": {
    "Arequipa": [
      "Arequipa",
      "Alto Selva Alegre",
      "Cayma",
      "Cerro Colorado",
      "Characato",
      "Chiguata",
      "Jacobo Hunter",
      "La Joya",
      "Mariano Melgar",
      "Miraflores",
      "Mollebaya",
      "Paucarpata",
      "Pocsi",
      "Polobaya",
      "Quequeña",
      "Sabandia",
      "Sachaca",
      "San Juan De Siguas",
      "San Juan De Tarucani",
      "Santa Isabel De Siguas",
      "Santa Rita De Siguas",
      "Socabaya",
      "Tiabaya",
      "Uchumayo",
      "Vitor",
      "Yanahuara",
      "Yarabamba",
      "Yura",
      "Jose Luis Bustamante Y Rivero"
    ]
  },
  "Cusco": {
    "Cusco": [
      "Cusco",
      "Ccorca",
      "Poroy",
      "San Jeronimo",
      "San Sebastian",
      "Santiago",
      "Saylla",
      "Wanchaq"
    ]
  },
  "La Libertad": {
    "Trujillo": [
      "Trujillo",
      "El Porvenir",
      "Florencia De Mora",
      "Huanchaco",
      "La Esperanza",
      "Laredo",
      "Moche",
      "Poroto",
      "Salaverry",
      "Simbal",
      "Victor Larco Herrera"
    ]
  },
  "Lambayeque": {
    "Chiclayo": [
      "Chiclayo",
      "Chongoyape",
      "Eten",
      "Eten Puerto",
      "Jose Leonardo Ortiz",
      "La Victoria",
      "Lagunas",
      "Monsefu",
      "Nueva Arica",
      "Oyotun",
      "Picsi",
      "Pimentel",
      "Reque",
      "Santa Rosa",
      "Saña",
      "Cayalti",
      "Patapo",
      "Pomalca",
      "Pucala",
      "Tuman"
    ]
  },
  "Lima": {
    "Lima": [
      "Lima",
      "Ancon",
      "Ate",
      "Barranco",
      "Breña",
      "Carabayllo",
      "Chaclacayo",
      "Chorrillos",
      "Cieneguilla",
      "Comas",
      "El Agustino",
      "Independencia",
      "Jesus Maria",
      "La Molina",
      "La Victoria",
      "Lince",
      "Los Olivos",
      "Lurigancho",
      "Lurin",
      "Magdalena Del Mar",
      "Pueblo Libre",
      "Miraflores",
      "Pachacamac",
      "Pucusana",
      "Puente Piedra",
      "Punta Hermosa",
      "Punta Negra",
      "Rimac",
      "San Bartolo",
      "San Borja",
      "San Isidro",
      "San Juan De Lurigancho",
      "San Juan De Miraflores",
      "San Luis",
      "San Martin De Porres",
      "San Miguel",
      "Santa Anita",
      "Santa Maria Del Mar",
      "Santa Rosa",
      "Santiago De Surco",
      "Surquillo",
      "Villa El Salvador",
      "Villa Maria Del Triunfo",
      "Santa Maria De Huachipa"
    ]
  },
  "Loreto": {
    "Maynas": [
      "Iquitos",
      "Alto Nanay",
      "Fernando Lores",
      "Indiana",
      "Las Amazonas",
      "Mazan",
      "Napo",
      "Punchana",
      "Putumayo",
      "Torres Causana",
      "Belen",
      "San Juan Bautista",
      "Teniente Manuel Clavero",
      "Maynas"
    ]
  },
  "Piura": {
    "Piura": [
      "Piura",
      "Castilla",
      "Catacaos",
      "Cura Mori",
      "El Tallan",
      "La Arena",
      "La Union",
      "Las Lomas",
      "Tambo Grande",
      "Veintiseis De Octubre"
    ]
  },
  "Puno": {
    "Puno": [
      "Puno",
      "Acora",
      "Amantani",
      "Atuncolla",
      "Capachica",
      "Chucuito",
      "Coata",
      "Huata",
      "Mañazo",
      "Paucarcolla",
      "Pichacani",
      "Plateria",
      "San Antonio",
      "Tiquillaca",
      "Vilque"
    ]
  },
  "Tacna": {
    "Tacna": [
      "Tacna",
      "Alto De La Alianza",
      "Calana",
      "Ciudad Nueva",
      "Inclan",
      "Pachia",
      "Palca",
      "Pocollay",
      "Sama",
      "Coronel Gregorio Albarracin Lanchipa",
      "La Yarada Los Palos"
    ]
  },
  "Junín": {
    "Huancayo": [
      "Huancayo"
    ]
  }
};

export function getProvinces(department: string): string[] {
  return Object.keys(UBIGEO_HIERARCHY[department] || {}).sort();
}

export function getDistricts(department: string, province: string): string[] {
  return (UBIGEO_HIERARCHY[department]?.[province] || []).sort();
}

export function findLocation(department: string, province: string, district: string): UbigeoLocation | undefined {
  // Buscar coincidencia exacta
  for (const label in UBIGEO_MAP) {
    const loc = UBIGEO_MAP[label];
    if (loc.department === department && loc.province === province && loc.district === district) {
      return loc;
    }
  }
  // Fallback: retornar la primera localidad de la provincia (capital)
  const dists = getDistricts(department, province);
  if (dists.length > 0) {
    return findLocation(department, province, dists[0]);
  }
  return undefined;
}
