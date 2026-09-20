import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, FileLock, Filter, Layers3, ListTree, Moon, Search, Sparkles, Sun, Type, Users, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

type BookProfile = "JUNIOR" | "SENIOR" | "MASTER" | "CRAZY";
type Audience = "STUDENTS" | "EDUCATORS" | "RESEARCHERS";
type Access = "PUBLIC" | "INTERNAL_ONLY";
type VolumeId = "I" | "II" | "III";
type ReadingTheme = "night" | "paper";
type TextScale = "compact" | "standard" | "large";

type Chapter = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  access: Access;
  audiences: Audience[];
  levels: BookProfile[];
  topics: string[];
  status: "PUBLISHED" | "LIVING" | "IN_REVIEW";
};

type Volume = {
  id: VolumeId;
  label: string;
  title: string;
  purpose: string;
  audience: string;
  editorialNote: string;
  accent: string;
  chapters: Chapter[];
};

const profileNotes: Record<BookProfile, { label: string; description: string; lens: string }> = {
  JUNIOR: { label: "JUNIOR", description: "Aprender a observar, medir y ordenar antes de formalizar.", lens: "Fundamentos, vocabulario y ejercicios guiados." },
  SENIOR: { label: "SENIOR", description: "Coordinar relaciones, decisiones y consecuencias de diseño.", lens: "Criterio funcional, comparación y estrategia." },
  MASTER: { label: "MASTER", description: "Integrar escalas, sistemas, contexto y juicio arquitectónico.", lens: "Síntesis, trade-offs y lectura crítica." },
  CRAZY: { label: "CRAZY", description: "Explorar posibilidades radicales sin abandonar las restricciones duras.", lens: "Hipótesis formales, transformación y límites." },
};

export const BOOK_VOLUMES: Volume[] = [
  {
    id: "I",
    label: "VOLUMEN I",
    title: "Fundamentos de Arquitectura",
    purpose: "Formar una comprensión espacial y funcional antes de pedir una solución arquitectónica.",
    audience: "Estudiantes y personas que se inician en arquitectura.",
    editorialNote: "Lenguaje directo, ejercicios progresivos y observación del espacio construido.",
    accent: "#7bc6d5",
    chapters: [
      { id: "I-01", number: "01", title: "El ser humano y la medida del espacio", subtitle: "Cuerpo, movimiento, alcance y percepción", summary: "El espacio se estudia desde las acciones de las personas, sus dimensiones y sus recorridos. La medida no es un número aislado: se verifica contra el uso.", access: "PUBLIC", audiences: ["STUDENTS"], levels: ["JUNIOR", "SENIOR"], topics: ["antropometría", "ergonomía", "movimiento"], status: "PUBLISHED" },
      { id: "I-02", number: "02", title: "Actividad antes que ambiente", subtitle: "Lo que ocurre dentro de un espacio", summary: "Dormir, cocinar, reunirse, trabajar y esperar son actividades. Los ambientes se comprenden como soportes de esas acciones, no como una lista de nombres.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS"], levels: ["JUNIOR", "SENIOR", "MASTER"], topics: ["actividad", "programa", "uso"], status: "PUBLISHED" },
      { id: "I-03", number: "03", title: "Relaciones y secuencias espaciales", subtitle: "Adyacencia, transición, privacidad y recorrido", summary: "Una vivienda, una escuela o un hospital funcionan mediante relaciones. El capítulo enseña a leer qué debe estar próximo, separado, controlado o conectado.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS"], levels: ["JUNIOR", "SENIOR", "MASTER"], topics: ["adyacencia", "circulación", "privacidad"], status: "PUBLISHED" },
      { id: "I-04", number: "04", title: "Luz, aire, umbral y límite", subtitle: "El espacio como envolvente habitable", summary: "Muros, aberturas, patios y transiciones construyen condiciones de habitabilidad. La forma se estudia en relación con la luz, la ventilación, la escala y la experiencia.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS"], levels: ["JUNIOR", "SENIOR", "MASTER"], topics: ["envolvente", "luz", "ventilación"], status: "LIVING" },
      { id: "I-05", number: "05", title: "Composición y orden espacial", subtitle: "Agrupar, alinear, centralizar, conectar", summary: "Las organizaciones lineal, central, radial, agrupada, reticular y de patio se presentan como posibilidades de orden, no como recetas formales.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS"], levels: ["JUNIOR", "SENIOR", "MASTER", "CRAZY"], topics: ["orden", "composición", "patio"], status: "LIVING" },
      { id: "I-06", number: "06", title: "Leer una casa que funciona", subtitle: "Caso progresivo de programa, zonificación y circulación", summary: "Un caso residencial acompaña al lector desde el programa hasta una planta legible, con acceso, pasadizos, escalera, patios, mobiliario y relaciones de uso.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS"], levels: ["JUNIOR", "SENIOR"], topics: ["vivienda", "zonificación", "caso"], status: "LIVING" },
      { id: "I-07", number: "07", title: "De la observación a la propuesta", subtitle: "Dibujar, explicar y revisar", summary: "El estudiante aprende a producir una hipótesis espacial y a explicar sus decisiones sin presentarlas como una solución única o definitiva.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS"], levels: ["JUNIOR", "SENIOR", "CRAZY"], topics: ["representación", "crítica", "hipótesis"], status: "IN_REVIEW" },
    ],
  },
  {
    id: "II",
    label: "VOLUMEN II",
    title: "Enseñar Arquitectura",
    purpose: "Convertir la práctica de diseño en una secuencia pedagógica clara, evaluable y transferible.",
    audience: "Estudiantes avanzados, docentes, tutores y talleres de proyecto.",
    editorialNote: "El docente guía la pregunta, la práctica y la revisión; no reemplaza el juicio del estudiante.",
    accent: "#e7b66b",
    chapters: [
      { id: "II-01", number: "01", title: "Cómo enseñar a mirar", subtitle: "Observación, registro y pregunta arquitectónica", summary: "El aprendizaje comienza cuando el estudiante puede describir lo que observa, distinguir dato de interpretación y formular una pregunta espacial concreta.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS"], levels: ["JUNIOR", "SENIOR"], topics: ["observación", "docencia", "pregunta"], status: "PUBLISHED" },
      { id: "II-02", number: "02", title: "Programa, actividades y relaciones", subtitle: "Antes de dibujar una planta", summary: "La lección propone ejercicios para pasar de una lista de ambientes a un modelo de actividades, actores, flujos y relaciones funcionales.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS"], levels: ["JUNIOR", "SENIOR", "MASTER"], topics: ["programa", "flujo", "ejercicio"], status: "PUBLISHED" },
      { id: "II-03", number: "03", title: "Del parti a la decisión espacial", subtitle: "Intención, alternativa y consecuencia", summary: "El parti se enseña como una intención organizadora que debe producir consecuencias observables en planta, sección, recorrido, luz y uso.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS"], levels: ["SENIOR", "MASTER", "CRAZY"], topics: ["parti", "intención", "decisión"], status: "LIVING" },
      { id: "II-04", number: "04", title: "Crítica de proyecto", subtitle: "Describir antes de juzgar", summary: "Una crítica útil separa observación, interpretación, criterio, consecuencia y pregunta siguiente. La calificación no sustituye la explicación.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS"], levels: ["SENIOR", "MASTER"], topics: ["crítica", "evaluación", "feedback"], status: "LIVING" },
      { id: "II-05", number: "05", title: "Talleres por perfiles de diseño", subtitle: "JUNIOR, SENIOR, MASTER y CRAZY", summary: "Los perfiles cambian la profundidad, amplitud y tolerancia a la novedad de la exploración. No cambian las restricciones duras ni la autoridad humana.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS"], levels: ["JUNIOR", "SENIOR", "MASTER", "CRAZY"], topics: ["perfiles", "taller", "exploración"], status: "LIVING" },
      { id: "II-06", number: "06", title: "Transferir sin copiar", subtitle: "Aprender de un caso y cambiar de contexto", summary: "El estudiante prueba qué principio puede viajar a otra situación, qué debe adaptarse y cuándo debe rechazarse la analogía.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS", "RESEARCHERS"], levels: ["SENIOR", "MASTER"], topics: ["transferencia", "adaptación", "contexto"], status: "IN_REVIEW" },
      { id: "II-07", number: "07", title: "Evaluación integrada del proyecto", subtitle: "Función, experiencia, materialidad y forma", summary: "La evaluación final vuelve a recorrer el proyecto desde el funcionamiento hasta la expresión, sin permitir que la estética oculte déficits funcionales.", access: "PUBLIC", audiences: ["EDUCATORS", "STUDENTS"], levels: ["MASTER", "CRAZY"], topics: ["síntesis", "criterio", "taller"], status: "IN_REVIEW" },
    ],
  },
  {
    id: "III",
    label: "VOLUMEN III",
    title: "ARKI: caso de inteligencia arquitectónica",
    purpose: "Documentar cómo se construye, prueba y limita un sistema de apoyo al diseño arquitectónico.",
    audience: "Estudiantes, docentes e investigadores interesados en arquitectura computacional y práctica crítica.",
    editorialNote: "El Volumen III narra el caso y sus implicaciones; los contratos, matrices y código permanecen en documentación interna.",
    accent: "#c68bf2",
    chapters: [
      { id: "III-01", number: "01", title: "De generador espacial a sistema de diseño", subtitle: "El problema que ARKI intenta resolver", summary: "Presenta la evolución desde planos básicos hacia intención, funcionamiento, geometría, representación y revisión humana.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS", "RESEARCHERS"], levels: ["JUNIOR", "SENIOR", "MASTER"], topics: ["ARKI", "sistema", "diseño"], status: "PUBLISHED" },
      { id: "III-02", number: "02", title: "Una arquitectura, varias representaciones", subtitle: "Modelo canónico, planta, sección y 3D", summary: "Explica por qué las representaciones deben derivar de una misma arquitectura y qué límites existen entre una masa conceptual y un modelo constructivo.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS", "RESEARCHERS"], levels: ["SENIOR", "MASTER"], topics: ["modelo", "3D", "representación"], status: "PUBLISHED" },
      { id: "III-03", number: "03", title: "Tipología como conocimiento funcional", subtitle: "La casa, el restaurante, el colegio y el hospital", summary: "Muestra cómo ARKI organiza actividades, flujos, relaciones y restricciones por tipología sin reducir una edificación a una plantilla fija.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS", "RESEARCHERS"], levels: ["SENIOR", "MASTER"], topics: ["tipología", "función", "transferencia"], status: "LIVING" },
      { id: "III-04", number: "04", title: "Cómo se prueba una capacidad", subtitle: "De la implementación a la evidencia", summary: "Explica, a nivel de caso, por qué una capacidad implementada no equivale automáticamente a una capacidad demostrada o a conocimiento aprendido.", access: "PUBLIC", audiences: ["EDUCATORS", "RESEARCHERS"], levels: ["MASTER", "CRAZY"], topics: ["evidencia", "validación", "investigación"], status: "LIVING" },
      { id: "III-05", number: "05", title: "Humanidad, autoridad y límites", subtitle: "El arquitecto humano decide", summary: "ARKI puede proponer, comparar y explicar. La decisión de diseño, el juicio profesional y la responsabilidad permanecen en la persona autorizada.", access: "PUBLIC", audiences: ["STUDENTS", "EDUCATORS", "RESEARCHERS"], levels: ["JUNIOR", "SENIOR", "MASTER", "CRAZY"], topics: ["autoridad", "responsabilidad", "límites"], status: "PUBLISHED" },
      { id: "III-06", number: "06", title: "Arquitectura viva y conocimiento en evolución", subtitle: "Qué cambia cuando llegan nuevas investigaciones", summary: "El Libro Vivo conserva versiones, registra nuevas evidencias y distingue entre actualización curricular, hipótesis, conocimiento y revisión humana.", access: "PUBLIC", audiences: ["EDUCATORS", "RESEARCHERS"], levels: ["MASTER", "CRAZY"], topics: ["libro vivo", "conocimiento", "evolución"], status: "LIVING" },
      { id: "III-INT-01", number: "I-01", title: "Contratos, gates y matrices de ANEXO I", subtitle: "Especificación operativa interna", summary: "Registro interno de reproducibilidad experimental. No forma parte de la lectura pública.", access: "INTERNAL_ONLY", audiences: ["RESEARCHERS"], levels: ["MASTER", "CRAZY"], topics: ["ANEXO I", "gates", "provenance"], status: "IN_REVIEW" },
      { id: "III-INT-02", number: "I-02", title: "P9.4, P10 y M1: protocolos internos", subtitle: "Evidencia, transferencia y adquisición de corpus", summary: "Documentación operativa reservada para mantenimiento, auditoría y evolución del sistema.", access: "INTERNAL_ONLY", audiences: ["RESEARCHERS"], levels: ["MASTER", "CRAZY"], topics: ["P9.4", "P10", "M1"], status: "IN_REVIEW" },
    ],
  },
];

const audienceLabels: Record<Audience, string> = { STUDENTS: "Estudiantes", EDUCATORS: "Docentes", RESEARCHERS: "Investigadores" };
const statusLabels = { PUBLISHED: "Publicado", LIVING: "En actualización", IN_REVIEW: "En revisión" } as const;

export default function ArkiBookPage() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<BookProfile>("SENIOR");
  const [audience, setAudience] = useState<Audience | "ALL">("ALL");
  const [access, setAccess] = useState<Access>("PUBLIC");
  const [volume, setVolume] = useState<VolumeId | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [openChapter, setOpenChapter] = useState<string | null>("III-01");
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() => (typeof window !== "undefined" && window.localStorage.getItem("arki-book-theme") === "paper" ? "paper" : "night"));
  const [textScale, setTextScale] = useState<TextScale>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("arki-book-text-scale") : null;
    return stored === "compact" || stored === "large" ? stored : "standard";
  });

  useEffect(() => { window.localStorage.setItem("arki-book-theme", readingTheme); }, [readingTheme]);
  useEffect(() => { window.localStorage.setItem("arki-book-text-scale", textScale); }, [textScale]);

  const filteredVolumes = useMemo(() => BOOK_VOLUMES.map((item) => ({ ...item, chapters: item.chapters.filter((chapter) => {
    const haystack = `${chapter.title} ${chapter.subtitle} ${chapter.summary} ${chapter.topics.join(" ")}`.toLowerCase();
    return (volume === "ALL" || item.id === volume) && chapter.access === access && chapter.levels.includes(profile) && (audience === "ALL" || chapter.audiences.includes(audience)) && (!query.trim() || haystack.includes(query.toLowerCase().trim()));
  }) })).filter((item) => item.chapters.length > 0), [access, audience, profile, query, volume]);

  const visibleCount = filteredVolumes.reduce((total, item) => total + item.chapters.length, 0);
  const publicTotal = BOOK_VOLUMES.flatMap((item) => item.chapters).filter((chapter) => chapter.access === "PUBLIC").length;
  const internalTotal = BOOK_VOLUMES.flatMap((item) => item.chapters).filter((chapter) => chapter.access === "INTERNAL_ONLY").length;
  const textScaleClass = textScale === "compact" ? "text-[0.94rem]" : textScale === "large" ? "text-[1.08rem]" : "text-base";
  const jumpToChapter = (volumeId: VolumeId, chapter: Chapter) => {
    setAccess(chapter.access);
    setVolume(volumeId);
    setProfile(chapter.levels[0]);
    setAudience("ALL");
    setQuery("");
    setOpenChapter(chapter.id);
    window.setTimeout(() => document.getElementById(`book-chapter-${chapter.id}`)?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 0);
  };

  return <div className={cn("arki-book-page min-h-[calc(100vh-4rem)] overflow-hidden bg-[#071426] text-[#edf4ff]", readingTheme === "paper" && "arki-book-paper", textScaleClass)}>
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(123,198,213,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(123,198,213,.08) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "linear-gradient(to bottom, black, transparent 78%)" }} />
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-10 md:py-12">
        <header className="grid gap-8 border-b border-[#294765] pb-9 xl:grid-cols-[1.4fr_.6fr] xl:items-end">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7bc6d5]"><BookOpen className="h-4 w-4" /> ARKI · LIBRO VIVO <span className="text-[#58738e]">/</span> edición navegable</div>
            <h1 className="max-w-4xl font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-[#f7fbff] md:text-6xl">Arquitectura como conocimiento, práctica y juicio.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#b8cbe0]">Una trilogía que enseña arquitectura, explica cómo se aprende y documenta el caso ARKI. El contenido público se separa de los contratos internos del sistema.</p>
            <div className="mt-7 flex flex-wrap gap-2"><Badge className="border border-[#35617c] bg-[#102943] text-[#9fdbe6] hover:bg-[#102943]">LIBRO VIVO</Badge><Badge className="border border-[#55698b] bg-transparent text-[#d4deed] hover:bg-transparent">3 volúmenes</Badge><Badge className="border border-[#55698b] bg-transparent text-[#d4deed] hover:bg-transparent">{publicTotal} capítulos públicos</Badge><Badge className="border border-[#875f8d] bg-transparent text-[#e4c7ee] hover:bg-transparent">{internalTotal} internos</Badge></div>
          </div>
          <div className="border-l border-[#315270] pl-5 xl:justify-self-end xl:max-w-sm"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e7b66b]">Principio editorial</p><p className="mt-3 font-serif text-2xl leading-tight text-[#f7fbff]">Cada libro tiene una función y un lector. No todo conocimiento interno debe convertirse en capítulo público.</p><p className="mt-4 text-sm leading-6 text-[#9db3cc]">Las actualizaciones conservan su estado: publicado, vivo, en revisión o interno.</p></div>
        </header>

        <section className="mt-8 grid gap-4 rounded-sm border border-[#294765] bg-[#0b1d35]/70 p-4 transition-colors duration-300 lg:grid-cols-[1fr_auto] lg:items-end" aria-label="Controles de lectura">
          <div><label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7893af]" htmlFor="book-search">Buscar en el libro</label><div className="relative max-w-2xl"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7893af]" /><Input id="book-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por capítulo, tema o concepto" className="border-[#2d4d6c] bg-[#0d223d] pl-10 text-[#edf4ff] placeholder:text-[#7893af] focus-visible:ring-[#7bc6d5]" />{query && <button aria-label="Limpiar búsqueda" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7893af] hover:text-white"><X className="h-4 w-4" /></button>}</div></div>
          <div className="flex flex-wrap items-center gap-2"><Button onClick={() => setAccess("PUBLIC")} variant="outline" className={cn("border-[#2d4d6c] bg-transparent text-xs", access === "PUBLIC" && "border-[#7bc6d5] bg-[#12324b] text-[#b9eef3]")}><BookOpen className="mr-2 h-4 w-4" /> Lectura pública</Button><Button onClick={() => setAccess("INTERNAL_ONLY")} variant="outline" className={cn("border-[#2d4d6c] bg-transparent text-xs", access === "INTERNAL_ONLY" && "border-[#c68bf2] bg-[#2a1c3b] text-[#e6caff]")}><FileLock className="mr-2 h-4 w-4" /> Interno ARKI</Button><span className="mx-1 hidden h-6 w-px bg-[#294765] sm:block" /><Button variant="outline" size="sm" aria-label="Reducir tamaño del texto" title="Reducir texto" onClick={() => setTextScale(textScale === "large" ? "standard" : "compact")} className="border-[#2d4d6c] bg-transparent text-xs"><ZoomOut className="h-4 w-4" /></Button><span className="flex items-center gap-1 text-xs text-[#9db3cc]" aria-label={`Tamaño de texto: ${textScale}`}><Type className="h-4 w-4" /> Texto</span><Button variant="outline" size="sm" aria-label="Aumentar tamaño del texto" title="Aumentar texto" onClick={() => setTextScale(textScale === "compact" ? "standard" : "large")} className="border-[#2d4d6c] bg-transparent text-xs"><ZoomIn className="h-4 w-4" /></Button><Button variant="outline" size="sm" aria-label={readingTheme === "night" ? "Cambiar a tema papel" : "Cambiar a tema nocturno"} title={readingTheme === "night" ? "Tema papel" : "Tema nocturno"} onClick={() => setReadingTheme(readingTheme === "night" ? "paper" : "night")} className="border-[#2d4d6c] bg-transparent text-xs">{readingTheme === "night" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button></div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[260px_1fr]">
          <aside className="space-y-5">
            <div className="rounded-sm border border-[#294765] bg-[#0b1d35]/90 p-4"><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7893af]"><Sparkles className="h-4 w-4 text-[#e7b66b]" /> Perfil de lectura</div><div className="space-y-2">{(Object.keys(profileNotes) as BookProfile[]).map((item) => <button key={item} onClick={() => setProfile(item)} className={cn("w-full border-l-2 px-3 py-2 text-left transition-colors", profile === item ? "border-[#e7b66b] bg-[#142f4e] text-[#f7fbff]" : "border-transparent text-[#9db3cc] hover:bg-[#102943] hover:text-white")}><span className="block text-xs font-semibold tracking-[0.14em]">{item}</span><span className="mt-1 block text-xs leading-5">{profileNotes[item].description}</span></button>)}</div></div>
            <div className="rounded-sm border border-[#294765] bg-[#0b1d35]/90 p-4"><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7893af]"><Users className="h-4 w-4 text-[#7bc6d5]" /> Lector</div><div className="space-y-2">{(["ALL", "STUDENTS", "EDUCATORS", "RESEARCHERS"] as const).map((item) => <button key={item} onClick={() => setAudience(item)} className={cn("block w-full px-2 py-1.5 text-left text-sm", audience === item ? "text-[#b9eef3]" : "text-[#9db3cc] hover:text-white")}>{item === "ALL" ? "Todos los lectores" : audienceLabels[item]}</button>)}</div></div>
            <div className="rounded-sm border border-[#294765] bg-[#0b1d35]/90 p-4"><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7893af]"><Filter className="h-4 w-4 text-[#c68bf2]" /> Volumen</div><div className="space-y-2">{(["ALL", "I", "II", "III"] as const).map((item) => <button key={item} onClick={() => setVolume(item)} className={cn("block w-full px-2 py-1.5 text-left text-sm", volume === item ? "text-[#e6caff]" : "text-[#9db3cc] hover:text-white")}>{item === "ALL" ? "Los tres volúmenes" : `Volumen ${item}`}</button>)}</div></div>
            <div className="rounded-sm border border-[#294765] bg-[#0b1d35]/90 p-4"><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7893af]"><ListTree className="h-4 w-4 text-[#7bc6d5]" /> Índice interactivo</div><div className="space-y-4">{BOOK_VOLUMES.map((item) => <div key={item.id}><button type="button" onClick={() => setVolume(item.id)} className="text-left text-xs font-semibold tracking-[0.12em] text-[#b9eef3] hover:text-white">{item.label}</button><div className="mt-2 space-y-1 border-l border-[#315270] pl-3">{item.chapters.map((chapter) => <button type="button" key={chapter.id} onClick={() => jumpToChapter(item.id, chapter)} className="block w-full truncate text-left text-xs leading-5 text-[#9db3cc] transition-colors hover:text-white" title={chapter.title}>{chapter.number} · {chapter.title}</button>)}</div></div>)}</div></div>
          </aside>

          <main className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7893af]">Ruta de lectura · {profile}</p><h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#f7fbff]">{profileNotes[profile].lens}</h2></div><p className="text-sm text-[#9db3cc]">{visibleCount} capítulos visibles</p></div>
            <div className="space-y-5">{filteredVolumes.map((item) => <section key={item.id} className="overflow-hidden rounded-sm border border-[#294765] bg-[#0b1d35]/80 transition-all duration-300"><div className="border-b border-[#294765] p-5 md:p-7" style={{ borderTop: `3px solid ${item.accent}` }}><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[11px] font-semibold tracking-[0.2em]" style={{ color: item.accent }}>{item.label}</p><h3 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#f7fbff]">{item.title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-[#b8cbe0]">{item.purpose}</p></div><div className="max-w-xs text-right text-xs leading-5 text-[#91a9c3]"><p className="font-semibold text-[#d4deed]">Para: {item.audience}</p><p className="mt-2">{item.editorialNote}</p></div></div></div><div className="divide-y divide-[#294765]">{item.chapters.map((chapter) => <article id={`book-chapter-${chapter.id}`} key={chapter.id} className="scroll-mt-6 p-5 transition-colors duration-300 md:p-6"><button onClick={() => setOpenChapter(openChapter === chapter.id ? null : chapter.id)} className="flex w-full items-start gap-4 text-left"><span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-[#3c5f7d] font-mono text-xs text-[#7bc6d5]">{chapter.number}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong className="font-serif text-xl text-[#f7fbff]">{chapter.title}</strong><Badge variant="outline" className={cn("text-[10px]", chapter.status === "PUBLISHED" ? "border-[#4e8b7e] text-[#a5dec7]" : chapter.status === "LIVING" ? "border-[#ae8153] text-[#e7b66b]" : "border-[#687fa2] text-[#b9cbea]")}>{statusLabels[chapter.status]}</Badge></span><span className="mt-1 block text-sm text-[#8fa9c3]">{chapter.subtitle}</span></span><span className="mt-1 shrink-0 text-[#7893af]">{openChapter === chapter.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}</span></button>{openChapter === chapter.id && <div className="ml-[52px] mt-4 max-w-4xl border-l border-[#42627e] pl-4"><p className="text-sm leading-7 text-[#c0d1e3]">{chapter.summary}</p><div className="mt-4 flex flex-wrap gap-2">{chapter.topics.map((topic) => <span key={topic} className="rounded-full border border-[#315270] px-2.5 py-1 text-[11px] text-[#9fc6d5]">{topic}</span>)}<span className="rounded-full border border-[#315270] px-2.5 py-1 text-[11px] text-[#9db3cc]">{chapter.audiences.map((item) => audienceLabels[item]).join(" · ")}</span></div></div>}</article>)}</div></section>)}{filteredVolumes.length === 0 && <div className="rounded-sm border border-dashed border-[#486783] bg-[#0b1d35] p-10 text-center"><Layers3 className="mx-auto h-8 w-8 text-[#7893af]" /><h3 className="mt-4 font-serif text-2xl text-[#f7fbff]">No hay capítulos con estos filtros</h3><p className="mt-2 text-sm text-[#9db3cc]">Prueba otro perfil, lector, volumen o búsqueda.</p><Button onClick={() => { setQuery(""); setAudience("ALL"); setVolume("ALL"); setAccess("PUBLIC"); }} variant="outline" className="mt-5 border-[#41617e] bg-transparent text-[#d4deed]">Restablecer filtros</Button></div>}</div>
          </main>
        </section>
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#294765] pt-5 text-xs text-[#7893af]"><span>ARKI · Libro Vivo · Contenido en evolución</span><span>La autoridad humana permanece final · <button onClick={() => setLocation("/")} className="text-[#9fdbe6] hover:underline">Volver al Command Center</button></span></footer>
      </div>
    </div>
  </div>;
}
