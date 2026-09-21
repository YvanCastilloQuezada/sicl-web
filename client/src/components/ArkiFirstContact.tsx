import { ArrowLeft, ArrowRight, BookOpen, Camera, Check, Home, MapPin, MessageCircle, Move3d, Share2, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import SocialLoginOptions from "./SocialLoginOptions";
import { trpc } from "@/lib/trpc";
import { enqueueOffline } from "@/lib/offlineQueue";

const FIRST_CONTACT_KEY = "arki-first-contact-completed-v2";
type Experience = "OWNER" | "PROFESSIONAL" | "PARAMETRIC" | "SCHOOL" | "DEMO";
type AssistantState = "INTRO" | "LISTENING" | "GUIDING" | "WORKING" | "CONTEXTUAL" | "MINIMIZED" | "SLEEP";
type Discovery = { intent: string; location: string; site: string; dimensions: string; occupants: string; budget: string };
const initialDiscovery: Discovery = { intent: "", location: "", site: "", dimensions: "", occupants: "", budget: "" };

function classifyMessage(message: string): "ARCHITECTURAL" | "OUT_OF_DOMAIN" | "UNKNOWN" {
  const normalized = message.trim().toLowerCase();
  if (!normalized) return "UNKNOWN";
  const contextTerms = ["casa", "edificio", "terreno", "plano", "arquitect", "constru", "diseño", "espacio", "obra", "parametric", "proyecto", "normativa", "presupuesto", "urban", "fútbol", "practicar"].some((term) => normalized.includes(term));
  const clearlyExternal = ["apuesta", "chisme", "receta", "criptomoneda", "política partidaria", "quién ganó el partido"].some((term) => normalized.includes(term));
  if (clearlyExternal && !contextTerms) return "OUT_OF_DOMAIN";
  if (contextTerms) return "ARCHITECTURAL";
  return "UNKNOWN";
}

const questions: Array<{ key: keyof Discovery; title: string; why: string; placeholder: string }> = [
  { key: "intent", title: "¿Qué quieres construir o desarrollar?", why: "Me ayuda a identificar la intención del proyecto, sin convertirla todavía en un requisito técnico.", placeholder: "Casa, restaurante, colegio, remodelación..." },
  { key: "location", title: "¿Dónde quieres hacerlo?", why: "La ubicación puede cambiar clima, normativa, orientación y disponibilidad de información.", placeholder: "Ciudad, país o NO LO SÉ" },
  { key: "site", title: "¿Ya tienes terreno?", why: "Así distinguimos un proyecto con sitio conocido de una búsqueda o hipótesis inicial.", placeholder: "Sí, no, estoy buscando o NO LO SÉ" },
  { key: "dimensions", title: "¿Sabes aproximadamente cuánto mide?", why: "Una medida declarada por ti queda como USER_PROVIDED y UNVERIFIED hasta contar con evidencia.", placeholder: "10 × 20 m o NO LO SÉ" },
  { key: "occupants", title: "¿Quiénes utilizarán el proyecto?", why: "Ayuda a orientar el programa arquitectónico sin inventar cantidades ni necesidades.", placeholder: "Familia, clientes, estudiantes o NO LO SÉ" },
];

export default function ArkiFirstContact() {
  const [location, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<AssistantState>("INTRO");
  const [experience, setExperience] = useState<Experience | null>(null);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [ownerStep, setOwnerStep] = useState(0);
  const [discovery, setDiscovery] = useState<Discovery>(initialDiscovery);
  const [professionalProfile, setProfessionalProfile] = useState("");
  const [editingSummary, setEditingSummary] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const createProject = trpc.projects.create.useMutation();
  const saveInitialIntake = trpc.projects.saveInitialIntake.useMutation();
  const isEntry = location === "/" || location === "/arki";

  useEffect(() => {
    if (!isEntry) return;
    try { setVisible(localStorage.getItem(FIRST_CONTACT_KEY) !== "true"); } catch { setVisible(true); }
  }, [isEntry]);

  const greeting = useMemo(() => {
    if (state === "SLEEP") return "ARKI está en pausa. Puedes reactivarme cuando quieras.";
    if (experience === "PARAMETRIC") return "Perfecto. Puedes explorar una hipótesis geométrica sin crear todavía un proyecto completo.";
    if (experience === "SCHOOL") return "Te llevaré a la Escuela ARKI para aprender paso a paso.";
    if (experience === "PROFESSIONAL") return "Trabajemos con la profundidad técnica que necesites.";
    if (experience === "OWNER" && ownerStep > 0) return "Comencemos poco a poco; no necesitas conocer vocabulario profesional.";
    return "Hola. Soy ARKI, tu asistente de arquitectura.";
  }, [experience, ownerStep, state]);

  if (!visible || !isEntry) return null;
  const close = () => { try { localStorage.setItem(FIRST_CONTACT_KEY, "true"); } catch { /* best effort */ } setVisible(false); };
  const navigate = (path: string) => { close(); setLocation(path); };
  const shareAccess = async () => {
    const accessUrl = "https://siclcc-cxipx7sy.manus.space/arki";
    try {
      if (navigator.share) {
        await navigator.share({ title: "ARKI Web App", text: "Abre ARKI desde este enlace", url: accessUrl });
        setShareStatus("Enlace compartido");
      } else {
        await navigator.clipboard.writeText(accessUrl);
        setShareStatus("Enlace copiado");
      }
    } catch {
      setShareStatus("No se pudo compartir; copia el enlace visible");
    }
  };
  const choose = (next: Experience) => {
    setExperience(next); setState("GUIDING");
    if (next === "PARAMETRIC") navigate("/arki-parametric-runtime");
    else if (next === "SCHOOL") navigate("/arki-book");
    else if (next === "PROFESSIONAL") setProfessionalProfile("");
    else if (next === "DEMO") close();
    else { setOwnerStep(1); setDiscovery(initialDiscovery); }
  };
  const submitMessage = () => {
    const classification = classifyMessage(message);
    if (classification === "OUT_OF_DOMAIN") { setState("GUIDING"); setAttempts((value) => value + 1); return; }
    if (classification === "UNKNOWN") { setState(attempts >= 1 ? "SLEEP" : "GUIDING"); setAttempts((value) => value + 1); return; }
    setExperience("OWNER"); setState("GUIDING"); setOwnerStep(1); setDiscovery((current) => ({ ...current, intent: message }));
  };
  const answerDiscovery = (value: string) => {
    const question = questions[ownerStep - 1];
    if (!question) return;
    setDiscovery((current) => ({ ...current, [question.key]: value }));
    setOwnerStep((step) => step + 1);
  };
  const startWorkspace = async () => {
    if (!discovery.intent.trim() || createProject.isPending || saveInitialIntake.isPending) return;
    const project = { name: discovery.intent.slice(0, 120), location: discovery.location || undefined, spatialScale: "PROJECT" as const, temporalHorizon: "PRESENT" as const };
    const intake = { intent: discovery.intent, location: discovery.location || "UNKNOWN", site: discovery.site || "UNKNOWN", dimensions: discovery.dimensions || "UNKNOWN", occupants: discovery.occupants || "UNKNOWN", budget: discovery.budget || "UNKNOWN" };
    if (!navigator.onLine) {
      await enqueueOffline({ operation: "projects.createWithInitialIntake", payload: { project, intake } });
      setState("WORKING");
      close();
      setLocation("/");
      return;
    }
    try {
      const created = await createProject.mutateAsync(project);
      await saveInitialIntake.mutateAsync({ projectId: created.projectId, expectedVersion: created.version, ...intake });
      close(); setLocation("/");
    } catch { setState("GUIDING"); }
  };
  const renderSummary = () => <div className="space-y-4"><div className="rounded-xl border border-[#557da5] bg-[#081a30] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.16em] text-[#f0a35b]">Esto es lo que entiendo</p><p className="mt-1 text-sm text-[#b8cbe0]">Este resumen es provisional y editable.</p></div><Button variant="outline" size="sm" onClick={() => setEditingSummary((value) => !value)} className="border-[#557da5] text-[#d7e5f4]">{editingSummary ? "Terminar edición" : "Corregir"}</Button></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{(["intent", "location", "site", "dimensions", "occupants"] as const).map((key) => <div key={key} className="rounded-lg border border-[#294765] bg-[#0d223d] p-3"><span className="block text-[10px] uppercase tracking-[0.12em] text-[#7893af]">{key}</span>{editingSummary ? <Input value={discovery[key]} onChange={(event) => setDiscovery((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 border-[#557da5] bg-[#071a30] text-xs text-[#edf4ff]" /> : <span className="mt-1 block text-sm text-[#edf4ff]">{discovery[key] || "UNKNOWN"}</span>}</div>)}</div><p className="mt-3 text-[11px] leading-5 text-[#9eb6ce]">Provenance: USER_PROVIDED · Estado: UNVERIFIED. Presupuesto, orientación, topografía y regulación permanecen UNKNOWN hasta contar con información.</p></div><div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setOwnerStep(1)} className="border-[#557da5] text-[#d7e5f4]">Revisar preguntas</Button><Button onClick={startWorkspace} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]"><Check className="mr-2 h-4 w-4" />Continuar al workspace</Button></div></div>;

  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#03101dcc] p-3 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="arki-first-contact-title"><div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[#557da5] bg-[#071a30] text-[#edf4ff] shadow-2xl"><div className="flex items-start justify-between border-b border-[#294765] p-5 sm:p-7"><div className="flex gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#f0a35b]/50 bg-[#102947] text-[#f0a35b]"><Sparkles className="h-7 w-7" /></div><div><p className="text-[10px] uppercase tracking-[0.24em] text-[#f0a35b]">ARKI Web App</p><h1 id="arki-first-contact-title" className="mt-1 font-serif text-2xl sm:text-3xl">{greeting}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#b8cbe0]">Estoy aquí para ayudarte a desarrollar una casa, un edificio o trabajar sobre un proyecto.</p></div></div><button type="button" onClick={close} aria-label="Cerrar First Contact" className="rounded-lg p-2 text-[#9eb6ce] hover:bg-[#102947] hover:text-white"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-5 sm:p-7"><div className="mb-5 grid gap-4 rounded-xl border border-[#557da5] bg-[#0d223d] p-4 sm:grid-cols-[auto_1fr] sm:items-center"><img src="/arki-access-qr-permanent.png" alt="Código QR permanente para abrir la página de acceso de ARKI" className="h-36 w-36 rounded-lg bg-white p-2" /><div><p className="text-xs uppercase tracking-[0.16em] text-[#f0a35b]">Acceso rápido</p><h2 className="mt-1 text-lg font-semibold">Abrir ARKI desde otro dispositivo</h2><p className="mt-2 text-sm leading-5 text-[#b8cbe0]">Escanea este código con tu celular o tablet para abrir la página de acceso de ARKI.</p><div className="mt-3 flex flex-wrap items-center gap-2"><a href="https://siclcc-cxipx7sy.manus.space/arki" target="_blank" rel="noreferrer" className="text-xs font-mono text-[#f6c995] underline underline-offset-4">siclcc-cxipx7sy.manus.space/arki</a><Button type="button" size="sm" onClick={shareAccess} className="h-8 bg-[#f0a35b] px-2 text-xs text-black hover:bg-[#f6c995]"><Share2 className="mr-1 h-3.5 w-3.5" />Compartir</Button></div>{shareStatus && <p role="status" className="mt-2 text-[10px] text-[#f6c995]">{shareStatus}</p>}<p className="mt-2 text-[10px] text-[#7893af]">QR del dominio publicado · el enlace es compartible desde otros dispositivos.</p></div></div>
    {state === "SLEEP" ? <div className="space-y-4 py-6 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#557da5] text-[#f0a35b]">◉</div><h2 className="font-serif text-2xl">ARKI está en pausa</h2><p className="mx-auto max-w-md text-sm leading-6 text-[#b8cbe0]">No haré llamadas de modelo mientras estoy dormido. Puedes reactivarme cuando quieras.</p><Button onClick={() => { setState("INTRO"); setAttempts(0); setMessage(""); }} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]">Reactivar ARKI</Button></div> : experience === "OWNER" && ownerStep > questions.length ? renderSummary() : experience === "OWNER" && ownerStep > 0 ? <div className="space-y-4"><div className="flex items-center justify-between"><button type="button" onClick={() => setOwnerStep((step) => Math.max(1, step - 1))} className="flex items-center gap-1 text-xs text-[#b8cbe0] hover:text-white"><ArrowLeft className="h-4 w-4" />Atrás</button><span className="text-xs text-[#7893af]">Pregunta {ownerStep} de {questions.length}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#102947]"><div className="h-full rounded-full bg-[#f0a35b] transition-all" style={{ width: `${(ownerStep / questions.length) * 100}%` }} /></div><div className="rounded-xl border border-[#294765] bg-[#0d223d] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#f0a35b]">Descubrimiento progresivo</p><h2 className="mt-2 font-serif text-2xl">{questions[ownerStep - 1].title}</h2><p className="mt-2 text-sm leading-6 text-[#b8cbe0]">{questions[ownerStep - 1].why}</p><Input autoFocus value={discovery[questions[ownerStep - 1].key]} onChange={(event) => setDiscovery((current) => ({ ...current, [questions[ownerStep - 1].key]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") answerDiscovery((event.target as HTMLInputElement).value || "UNKNOWN"); }} placeholder={questions[ownerStep - 1].placeholder} className="mt-5 border-[#557da5] bg-[#081a30] text-[#edf4ff] placeholder:text-[#7893af]" /><div className="mt-4 flex flex-wrap justify-between gap-2"><Button variant="outline" onClick={() => answerDiscovery("UNKNOWN")} className="border-[#557da5] text-[#d7e5f4]">NO LO SÉ</Button><Button onClick={() => answerDiscovery(discovery[questions[ownerStep - 1].key] || "UNKNOWN")} className="bg-[#f0a35b] text-black hover:bg-[#f6c995]">Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div></div> : experience === "PROFESSIONAL" ? <div className="space-y-4"><p className="text-sm font-medium text-[#f6c995]">¿Con qué perfil estás trabajando?</p><div className="flex flex-wrap gap-2">{["Arquitectura", "Urbanismo", "Ingeniería", "Diseño", "Construcción", "Otro"].map((profile) => <button key={profile} type="button" onClick={() => setProfessionalProfile(profile)} className={professionalProfile === profile ? "rounded-full border border-[#f0a35b] bg-[#49351f] px-3 py-2 text-xs text-[#f6c995]" : "rounded-full border border-[#557da5] px-3 py-2 text-xs text-[#b8cbe0]"}>{profile}</button>)}</div>{professionalProfile && <div className="grid gap-2 sm:grid-cols-2"><Button variant="outline" onClick={startWorkspace} className="justify-start gap-2 border-[#557da5] text-[#d7e5f4]"><Home className="h-4 w-4" />Nuevo proyecto / abrir workspace</Button><Button variant="outline" onClick={() => navigate("/arki-parametric-runtime")} className="justify-start gap-2 border-[#557da5] text-[#d7e5f4]"><Move3d className="h-4 w-4" />Importar .ark / Parametric</Button><Button variant="outline" onClick={() => navigate("/field")} className="justify-start gap-2 border-[#557da5] text-[#d7e5f4]"><MapPin className="h-4 w-4" />Estoy en el terreno</Button><Button variant="outline" onClick={() => navigate("/control-center")} className="justify-start gap-2 border-[#557da5] text-[#d7e5f4]"><ShieldCheck className="h-4 w-4" />Project State y gobernanza</Button></div>}</div> : <><p className="text-sm font-medium text-[#f6c995]">¿Qué quieres hacer?</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Button variant="outline" className="h-auto justify-start gap-3 border-[#557da5] bg-[#0d223d] px-4 py-4 text-left text-[#edf4ff] hover:border-[#f0a35b] hover:bg-[#102947]" onClick={() => choose("OWNER")}><Home className="h-5 w-5 text-[#f0a35b]" /><span><strong className="block">Quiero construir</strong><small className="text-[#9eb6ce]">Casa, edificio o terreno</small></span></Button><Button variant="outline" className="h-auto justify-start gap-3 border-[#557da5] bg-[#0d223d] px-4 py-4 text-left text-[#edf4ff] hover:border-[#f0a35b] hover:bg-[#102947]" onClick={() => choose("PROFESSIONAL")}><ShieldCheck className="h-5 w-5 text-[#f0a35b]" /><span><strong className="block">Soy profesional</strong><small className="text-[#9eb6ce]">Profundidad técnica</small></span></Button><Button variant="outline" className="h-auto justify-start gap-3 border-[#557da5] bg-[#0d223d] px-4 py-4 text-left text-[#edf4ff] hover:border-[#f0a35b] hover:bg-[#102947]" onClick={() => choose("PARAMETRIC")}><Move3d className="h-5 w-5 text-[#f0a35b]" /><span><strong className="block">Probar ARKI Parametric</strong><small className="text-[#9eb6ce]">Sandbox geométrico</small></span></Button><Button variant="outline" className="h-auto justify-start gap-3 border-[#557da5] bg-[#0d223d] px-4 py-4 text-left text-[#edf4ff] hover:border-[#f0a35b] hover:bg-[#102947]" onClick={() => choose("SCHOOL")}><BookOpen className="h-5 w-5 text-[#f0a35b]" /><span><strong className="block">Quiero aprender</strong><small className="text-[#9eb6ce]">Escuela y Libro Vivo</small></span></Button><Button variant="outline" className="h-auto justify-start gap-3 border-[#557da5] bg-[#0d223d] px-4 py-4 text-left text-[#edf4ff] hover:border-[#f0a35b] hover:bg-[#102947]" onClick={() => choose("DEMO")}><MessageCircle className="h-5 w-5 text-[#f0a35b]" /><span><strong className="block">Probar ARKI</strong><small className="text-[#9eb6ce]">Explorar sin compromiso</small></span></Button></div><div className="rounded-xl border border-[#294765] bg-[#0d223d] p-4"><label htmlFor="arki-first-contact-message" className="mb-2 block text-xs font-medium text-[#b8cbe0]">Cuéntamelo con tus propias palabras...</label><div className="flex flex-col gap-2 sm:flex-row"><Textarea id="arki-first-contact-message" value={message} onChange={(event) => { setMessage(event.target.value); setState("LISTENING"); }} placeholder="Por ejemplo: quiero diseñar una casa en un terreno de 10 × 20 m" className="min-h-20 border-[#557da5] bg-[#081a30] text-[#edf4ff] placeholder:text-[#7893af]" /><Button onClick={submitMessage} className="bg-[#f0a35b] text-black hover:bg-[#f6c995] sm:self-end"><ArrowRight className="mr-2 h-4 w-4" />Continuar</Button></div>{state === "GUIDING" && attempts > 0 && <p className="mt-2 text-xs text-[#f6c995]">ARKI trabaja sobre arquitectura, construcción y proyectos. Si aún no sabes el dato, puedes decir <strong>NO LO SÉ</strong>; lo conservaré como UNKNOWN.</p>}</div><p className="text-center text-[11px] text-[#7893af]">Puedes empezar sin crear un proyecto. ARKI pedirá identidad solamente cuando quieras guardar, compartir o continuar después.</p></>}
  <SocialLoginOptions /></div></div></div>;
}
