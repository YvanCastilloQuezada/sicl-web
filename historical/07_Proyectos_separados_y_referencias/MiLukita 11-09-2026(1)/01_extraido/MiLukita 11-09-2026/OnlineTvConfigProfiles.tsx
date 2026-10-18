import { useEffect, useState } from "react";
import { Check, Copy, FolderOpen, Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ONLINE_TV_DIFFICULTIES, ONLINE_TV_DIFFICULTY_LABELS, ONLINE_TV_GAME_DEFINITIONS, ONLINE_TV_GAME_IDS, type OnlineTvDifficulty, type OnlineTvGameId } from "../../../shared/onlineTvGames";

type Profile = { id: string; name: string; gameId: OnlineTvGameId; difficulty: OnlineTvDifficulty; createdAt: string };
const STORAGE_KEY = "milukita-online-tv-config-profiles-v1";

function readProfiles(): Profile[] {
  try { const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown; return Array.isArray(parsed) ? parsed.filter((item): item is Profile => Boolean(item && typeof item === "object" && "id" in item && "name" in item && "gameId" in item && "difficulty" in item)) : []; } catch { return []; }
}

function encodeProfile(profile: Profile) { return btoa(encodeURIComponent(JSON.stringify(profile))); }
function decodeProfile(code: string): Profile | null { try { const parsed = JSON.parse(decodeURIComponent(atob(code.trim()))) as Profile; return parsed?.gameId && parsed?.difficulty && ONLINE_TV_GAME_IDS.includes(parsed.gameId) && ONLINE_TV_DIFFICULTIES.includes(parsed.difficulty) ? parsed : null; } catch { return null; } }

export default function OnlineTvConfigProfiles({ gameId, difficulty, onLoad }: { gameId: OnlineTvGameId; difficulty: OnlineTvDifficulty; onLoad: (gameId: OnlineTvGameId, difficulty: OnlineTvDifficulty) => void }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [importCode, setImportCode] = useState("");
  const [sharedCode, setSharedCode] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    setProfiles(readProfiles());
    const code = new URLSearchParams(window.location.search).get("profile");
    const imported = code ? decodeProfile(code) : null;
    if (imported) { onLoad(imported.gameId, imported.difficulty); setMessage("Perfil del enlace cargado. Revisa el nivel antes de iniciar."); }
  }, [onLoad]);
  const persist = (next: Profile[]) => { setProfiles(next); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const save = () => { const cleanName = name.trim().slice(0, 40); if (!cleanName) return; const profile: Profile = { id: `profile-${Date.now()}`, name: cleanName, gameId, difficulty, createdAt: new Date().toISOString() }; persist([profile, ...profiles.filter((item) => item.name.toLowerCase() !== cleanName.toLowerCase())].slice(0, 12)); setName(""); setMessage("Perfil guardado en este dispositivo."); };
  const remove = (id: string) => { persist(profiles.filter((item) => item.id !== id)); setMessage("Perfil eliminado."); };
  const share = async (profile: Profile) => { const code = encodeProfile(profile); setSharedCode(code); const link = `${window.location.origin}${window.location.pathname}?profile=${encodeURIComponent(code)}`; try { await navigator.clipboard?.writeText(link); setMessage("Enlace copiado. También puedes compartir el código."); } catch { setMessage("Código generado. Cópialo para compartirlo."); } };
  const importProfile = () => { const imported = decodeProfile(importCode); if (!imported) { setMessage("Código inválido o incompatible."); return; } onLoad(imported.gameId, imported.difficulty); setMessage("Perfil cargado. Revisa el nivel antes de iniciar."); };
  return <div className="mt-5 border border-cyan-200/15 bg-cyan-200/5 p-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-cyan-200"><FolderOpen className="h-3.5 w-3.5" /> Perfiles de configuración</div><p className="mt-2 text-xs leading-5 text-slate-400">Guarda combinaciones de juego y nivel en este dispositivo. Los perfiles compartidos no contienen credenciales ni resultados; la sesión final valida los parámetros en el servidor.</p><div className="mt-3 flex gap-2"><Input value={name} onChange={(event) => setName(event.target.value.slice(0, 40))} onKeyDown={(event) => { if (event.key === "Enter") save(); }} placeholder="Nombre del perfil" className="h-9 border-white/15 bg-black/20 text-xs text-white placeholder:text-slate-500" /><Button type="button" size="sm" onClick={save} disabled={!name.trim()} className="h-9 shrink-0 bg-cyan-200 text-[#10251e] hover:bg-cyan-100"><Save className="mr-1.5 h-3.5 w-3.5" />Guardar</Button></div>{profiles.length ? <div className="mt-3 space-y-2">{profiles.map((profile) => <div key={profile.id} className="flex items-center justify-between gap-2 border border-white/10 bg-black/15 p-2"><button type="button" onClick={() => onLoad(profile.gameId, profile.difficulty)} className="min-w-0 flex-1 text-left"><span className="flex items-center gap-1.5 truncate text-xs font-bold text-white"><Check className="h-3 w-3 text-emerald-200" />{profile.name}</span><span className="mt-1 block truncate text-[11px] text-slate-500">{ONLINE_TV_GAME_DEFINITIONS[profile.gameId].name} · {ONLINE_TV_DIFFICULTY_LABELS[profile.difficulty]}</span></button><div className="flex shrink-0"><Button type="button" size="icon" variant="ghost" onClick={() => void share(profile)} className="h-7 w-7 text-cyan-200 hover:bg-cyan-200/10" aria-label={`Compartir perfil ${profile.name}`}><Copy className="h-3.5 w-3.5" /></Button><Button type="button" size="icon" variant="ghost" onClick={() => remove(profile.id)} className="h-7 w-7 text-slate-500 hover:bg-rose-200/10 hover:text-rose-100" aria-label={`Eliminar perfil ${profile.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>)}</div> : <p className="mt-3 text-[11px] text-slate-500">Aún no hay perfiles guardados.</p>}<div className="mt-4 border-t border-white/10 pt-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Cargar desde código</p><div className="mt-2 flex gap-2"><Input value={importCode} onChange={(event) => setImportCode(event.target.value)} placeholder="Pega el código compartido" className="h-8 border-white/15 bg-black/20 text-[11px] text-white placeholder:text-slate-500" /><Button type="button" size="sm" variant="outline" onClick={importProfile} disabled={!importCode.trim()} className="h-8 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Upload className="mr-1.5 h-3.5 w-3.5" />Cargar</Button></div>{sharedCode ? <p className="mt-2 break-all text-[10px] leading-4 text-cyan-200/80">Código generado: {sharedCode}</p> : null}</div>{message ? <p className="mt-3 text-xs text-emerald-200" role="status">{message}</p> : null}</div>;
}
