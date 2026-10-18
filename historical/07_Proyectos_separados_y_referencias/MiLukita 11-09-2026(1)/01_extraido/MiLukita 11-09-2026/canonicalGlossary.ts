export type CanonicalGlossaryEntry = {
  term: string;
  meaning: string;
  use: string;
};

export const CANONICAL_GLOSSARY: readonly CanonicalGlossaryEntry[] = [
  { term: "MiLukita", meaning: "La marca y el ecosistema matriz que reúne las experiencias digitales.", use: "Nombre institucional y de producto." },
  { term: "El Mundo de MiLukita", meaning: "El universo público y territorial donde viven las experiencias de MiLukita.", use: "Entrada, narrativa, territorio y contenidos públicos." },
  { term: "LUKA", meaning: "La presencia inteligente, guía y personaje que acompaña la experiencia.", use: "Diálogo, orientación y acciones contextuales." },
  { term: "LUKA OS", meaning: "La capa técnica que coordina las experiencias, permisos y estados.", use: "Orquestación e interacción; no gobierna el núcleo protegido." },
  { term: "LUKA AR", meaning: "La experiencia de realidad aumentada para explorar el territorio con LUKA.", use: "Visor, puntos de interés y guía contextual." },
  { term: "LUKA TV", meaning: "La experiencia de televisión para navegar y presentar contenido.", use: "TV Runtime, navegación LRUD y vinculación por QR." },
  { term: "Controller Lab", meaning: "El espacio de pruebas y configuración para experiencias de control.", use: "Backstage; no es una puerta de acceso al núcleo." },
  { term: "L★ / Lukita Star Trail", meaning: "El motivo visual de estrella utilizado en interfaces, puntero y rastro.", use: "Identidad visual contextual; no implica registro legal." },
] as const;
