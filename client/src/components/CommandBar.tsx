import React, { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { BookOpen, CheckCircle2, ChevronDown, Command, Download, History, Info, Loader2, Search, Settings2, Terminal, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import catalog from "@/content/commands-catalog.json";
import aliasRegistry from "@/content/command-aliases.json";
import i18n from "@/i18n";
import { apiErrorMessage, siclClient } from "@/api/sicl-client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GUIDED_MODE_KEY, type ExperienceMode } from "@/components/GuidedShell";

type LocalizedAlias = {
  locale: string;
  alias: string;
  canonical: string;
  status: "PROPOSED" | "REVIEWED" | "ACTIVE" | "DEPRECATED" | "REJECTED";
  preferred: boolean;
  review_status: string;
  reviewer: string | null;
};

type AliasRegistry = {
  entries: LocalizedAlias[];
  supported_locales: string[];
  review_metadata?: {
    mode?: string;
    approved_for_production_execution?: boolean;
  };
};

type CatalogCommand = {
  name: string;
  category: string;
  syntax: string;
  arguments: { name: string; required: boolean; type: string; values?: string[] }[];
  example: string;
  errors: string[];
};

export type CommandContext = {
  objectives?: string[];
  alternatives?: string[];
  actors?: string[];
  projectId?: string;
};

export const COMMAND_HISTORY_KEY = "sims-dei-command-history";
export const COMMAND_LANGUAGE_KEY = "sims-dei-command-language";
const MAX_HISTORY = 100;
const LANGUAGE_OPTIONS = [
  ["es", "Español"], ["en", "English"], ["pt", "Português"], ["it", "Italiano"],
  ["fr", "Français"], ["de", "Deutsch"], ["ru", "Русский"], ["zh", "中文"],
] as const;
const commands = catalog as CatalogCommand[];
const aliases = aliasRegistry as AliasRegistry;
function readPreferredLocale(): string | null {
  try {
    const value = localStorage.getItem(COMMAND_LANGUAGE_KEY);
    return value && aliases.supported_locales.includes(value) ? value : null;
  } catch { return null; }
}

function activeLocale(): string {
  const locale = readPreferredLocale() ?? i18n.language?.split("-")[0] ?? "en";
  return aliases.supported_locales.includes(locale) ? locale : "en";
}

function localizedAliases(locale: string): LocalizedAlias[] {
  return aliases.entries.filter((entry) => entry.locale === locale && entry.status !== "REJECTED");
}

function commandDescription(command: CatalogCommand): string {
  const descriptions: Record<string, string> = {
    "/PROJECT CREATE": "Crea un espacio de trabajo con alcance espacial y temporal explícito.",
    "/PROJECT OPEN": "Abre un proyecto existente por su identificador.",
    "/OBJECTIVE SET": "Registra un objetivo y su dirección de optimización.",
    "/HUMAN REVIEW": "Registra la revisión explícita de una persona autorizada.",
    "/DECISION RECORD": "Registra una decisión humana con actor y autoridad.",
  };
  return descriptions[command.name] ?? `Ejecuta la operación SICL ${command.category} sin convertir una recomendación en decisión.`;
}

function commandExample(command: CatalogCommand): string {
  const values: Record<string, string> = {
    project_id: "DEMO-001", name: '"Proyecto demo"', spatial_scope: "PROJECT", temporal_scope: "PRESENT",
    key: "ENERGY_SAVINGS", "MAXIMIZE|MINIMIZE": "MAXIMIZE", value: "80", actor: "architect",
    timestamp_utc: "2026-01-01T12:00:00Z", review: '"Revisión explícita"', reason: '"Criterios verificados"',
    authority: "PROJECT_OWNER", statement: '"Aprobar alternativa"', objective_id: "ENERGY_SAVINGS",
    alternative_id: "ALT-001", alternative: "ALT-001", source_id: "SRC-001", evidence_id: "EVD-001",
  };
  const required = command.arguments.filter((arg) => arg.required).map((arg) => values[arg.name] ?? arg.values?.[0] ?? `DEMO-${arg.name.toUpperCase()}`);
  return `${command.name}${required.length ? ` ${required.join(" ")}` : ""}`;
}

export function normalizeLocalizedCommand(input: string, locale = activeLocale()): { canonical: string; aliasUsed: boolean; aliasStatus: string } | null {
  const value = input.trim();
  const upper = value.toUpperCase();
  const localeAliases = localizedAliases(locale);
  const match = localeAliases
    .filter((entry) => upper === entry.alias.toUpperCase() || upper.startsWith(`${entry.alias.toUpperCase()} `))
    .sort((a, b) => b.alias.length - a.alias.length)[0];
  if (match) {
    if (match.status !== "ACTIVE") return { canonical: match.canonical + value.slice(match.alias.length), aliasUsed: true, aliasStatus: match.status };
    return { canonical: match.canonical + value.slice(match.alias.length), aliasUsed: true, aliasStatus: match.status };
  }
  const canonical = commands.find((item) => upper === item.name || upper.startsWith(`${item.name} `));
  return canonical ? { canonical: value, aliasUsed: false, aliasStatus: "CANONICAL" } : null;
}

function readHistory(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(COMMAND_HISTORY_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeHistory(items: string[]) {
  localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
}

export function commandSuggestions(input: string, context: CommandContext = {}, locale = activeLocale()): string[] {
  const value = input.trim();
  const visibleAliases = localizedAliases(locale);
  if (!value) return [...visibleAliases.slice(0, 8).map((item) => item.alias), ...commands.slice(0, 4).map((item) => item.name)];
  const upper = value.toUpperCase();
  if (value.startsWith("/") && !value.includes(" ")) {
    const localized = visibleAliases.filter((item) => item.alias.toUpperCase().startsWith(upper)).map((item) => item.alias);
    const canonical = commands.filter((item) => item.name.startsWith(upper)).map((item) => item.name);
    return [...localized, ...canonical].slice(0, 12);
  }
  const tokens = value.split(/\s+/);
  const localized = visibleAliases.find((item) => item.alias.toUpperCase() === tokens.slice(0, item.alias.split(" ").length).join(" ").toUpperCase());
  if (localized) {
    const command = commands.find((item) => item.name === localized.canonical);
    if (!command) return [];
    const argIndex = tokens.length - localized.alias.split(" ").length;
    const arg = command.arguments[argIndex];
    if (arg?.values) return arg.values;
    if (arg) return [`<${arg.name}>`];
    return [];
  }
  const command = commands.find((item) => item.name === tokens.slice(0, item.name.split(" ").length).join(" ").toUpperCase());
  if (!command) return commands.filter((item) => item.name.startsWith(upper)).map((item) => item.name).slice(0, 12);
  const argIndex = tokens.length - command.name.split(" ").length;
  const arg = command.arguments[argIndex];
  if (command.name === "/OBJECTIVE SET" && argIndex === 0) return context.objectives ?? [];
  if ((command.name === "/ALTERNATIVE SET" || command.name === "/ALTERNATIVE CREATE") && argIndex === 0) return context.alternatives ?? [];
  if (command.name === "/ACTOR SHOW" && argIndex === 0) return context.actors ?? [];
  if (arg?.values) return arg.values;
  if (arg) return [`<${arg.name}>`];
  return [];
}

export function validateCommand(input: string): string | null {
  const value = input.trim();
  if (!value.startsWith("/")) return "COMMAND_MUST_START_WITH_SLASH";
  const upper = value.toUpperCase();
  const command = commands.find((item) => upper === item.name || upper.startsWith(`${item.name} `));
  if (!command) return "COMMAND_NOT_FOUND";
  const args = value.split(/\s+/).slice(command.name.split(" ").length);
  const required = command.arguments.filter((arg) => arg.required).length;
  if (args.length < required) return "MISSING_REQUIRED_ARGUMENT";
  return null;
}

export default function CommandBar({ context = {}, onExecuted }: { context?: CommandContext; onExecuted?: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [projectId, setProjectId] = useState(() => context.projectId ?? localStorage.getItem("sims-dei-project-id") ?? "");
  const [history, setHistory] = useState<string[]>(readHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<{ type: "success" | "error" | "loading"; message: string } | null>(null);
  const [pendingCanonical, setPendingCanonical] = useState<string | null>(null);
  const [aliasSearch, setAliasSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferredLocale, setPreferredLocale] = useState(() => readPreferredLocale() ?? activeLocale());
  const [languageSaved, setLanguageSaved] = useState(false);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>(() => localStorage.getItem(GUIDED_MODE_KEY) === "expert" ? "expert" : "guided");
  const inputRef = useRef<HTMLInputElement>(null);
  const aliasSearchRef = useRef<HTMLInputElement>(null);

  const locale = activeLocale();

  useEffect(() => {
    const preferred = readPreferredLocale();
    if (preferred) void i18n.changeLanguage(preferred);
  }, []);

  const aliasResults = useMemo(() => {
    const query = aliasSearch.trim().toLocaleLowerCase();
    return localizedAliases(locale).filter((entry) => !query || entry.alias.toLocaleLowerCase().includes(query) || entry.canonical.toLocaleLowerCase().includes(query));
  }, [aliasSearch, locale]);

  const suggestions = useMemo(() => {
    const typed = commandSuggestions(input, context, locale);
    if (!input.trim()) return history.slice(0, 8);
    return typed.filter((item) => item.toLowerCase().includes(input.trim().toLowerCase()) || item.startsWith("<"));
  }, [context, history, input, locale]);

  const educationalCommand = useMemo(() => {
    const normalized = normalizeLocalizedCommand(input, locale);
    const canonicalName = normalized?.canonical.split(/\s+/).slice(0, 3).join(" ") ?? input.trim().toUpperCase();
    return commands.find((item) => canonicalName === item.name || canonicalName.startsWith(`${item.name} `)) ?? commands.find((item) => item.name === suggestions[0]);
  }, [input, locale, suggestions]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        setOpen(true);
        setAliasSearch("");
        window.setTimeout(() => aliasSearchRef.current?.focus(), 0);
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        setStatus(null);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        setStatus(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => setSelected(0), [input]);

  const close = () => {
    setOpen(false);
    setInput("");
    setHistoryIndex(-1);
    setStatus(null);
    setPendingCanonical(null);
    setAliasSearch("");
    setSettingsOpen(false);
  };

  const exportAliasesCsv = () => {
    const header = ["locale", "alias", "canonical", "status"];
    const rows = localizedAliases(locale).map((entry) => [entry.locale, entry.alias, entry.canonical, entry.status]);
    const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `sicl-aliases-${locale}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const savePreferredLanguage = () => {
    localStorage.setItem(COMMAND_LANGUAGE_KEY, preferredLocale);
    void i18n.changeLanguage(preferredLocale);
    setLanguageSaved(true);
    window.setTimeout(() => setLanguageSaved(false), 1800);
  };

  const saveExperienceMode = (mode: ExperienceMode) => {
    setExperienceMode(mode);
    localStorage.setItem(GUIDED_MODE_KEY, mode);
  };

  const executeCanonicalQuick = async () => {
    if (!pendingCanonical || !projectId.trim()) {
      setStatus({ type: "error", message: t("command_bar.project_required") });
      return;
    }
    setStatus({ type: "loading", message: t("command_bar.executing") });
    try {
      await siclClient.executeCanonicalCommand(projectId.trim(), pendingCanonical);
      setStatus({ type: "success", message: t("command_bar.executed") });
      setPendingCanonical(null);
      onExecuted?.();
    } catch (error) {
      setStatus({ type: "error", message: t("command_bar.failed", { message: apiErrorMessage(error) }) });
    }
  };

  const execute = async () => {
    const command = input.trim();
    const normalized = normalizeLocalizedCommand(command, locale);
    const validation = normalized ? validateCommand(normalized.canonical) : validateCommand(command);
    if (normalized?.aliasUsed && normalized.aliasStatus !== "ACTIVE") {
      setPendingCanonical(normalized.canonical);
      setStatus({ type: "error", message: t("command_bar.alias_pending_review") });
      return;
    }
    if (validation) {
      setStatus({ type: "error", message: t("command_bar.invalid_syntax", { error: validation }) });
      return;
    }
    if (!projectId.trim()) {
      setStatus({ type: "error", message: t("command_bar.project_required") });
      return;
    }
    localStorage.setItem("sims-dei-project-id", projectId.trim());
    const nextHistory = [command, ...history.filter((item) => item !== command)].slice(0, MAX_HISTORY);
    setHistory(nextHistory);
    writeHistory(nextHistory);
    setStatus({ type: "loading", message: t("command_bar.executing") });
    try {
      await siclClient.executeCanonicalCommand(projectId.trim(), normalized?.canonical ?? command);
      setStatus({ type: "success", message: t("command_bar.executed") });
      onExecuted?.();
    } catch (error) {
      setStatus({ type: "error", message: t("command_bar.failed", { message: apiErrorMessage(error) }) });
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (suggestions.length) setSelected((value) => Math.min(value + 1, suggestions.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!input.trim() && history.length) {
        const next = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(next);
        setInput(history[next]);
      } else if (suggestions.length) setSelected((value) => Math.max(value - 1, 0));
      return;
    }
    if (event.key === "Tab" && suggestions[selected]) {
      event.preventDefault();
      const value = suggestions[selected];
      setInput(value.startsWith("/") ? value : `${input.trim()} ${value}`.trim());
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      void execute();
    }
  };

  return <>
    {!open && <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#f2c300] px-4 py-3 text-sm font-semibold text-[#1d2925] shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#d4a017] hover:text-[#fbfaf6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8bc34a]" aria-label={t("command_bar.open_button")}><Command className="h-4 w-4" /> <span className="hidden sm:inline">SICL</span><kbd className="hidden rounded bg-white/15 px-1.5 py-0.5 text-[10px] sm:inline">⌘K</kbd></button>}
    {open && <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-4xl px-3 pb-3 sm:px-6" role="dialog" aria-label={t("command_bar.title")}>
      <div className="overflow-hidden rounded-lg border-2 border-[#f2c300] bg-[#fbfaf6] shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 border-b border-[#d7d8cf] px-4 py-3"><Terminal className="h-5 w-5 text-[#e67e22]" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#385348]">{t("command_bar.title")}</p><p className="text-xs text-[#718078]">{t("command_bar.hint")} · {t("command_bar.alias_search_shortcut")} (Ctrl/Cmd+Shift+L)</p></div><Button type="button" variant="ghost" size="icon" onClick={() => setSettingsOpen((value) => !value)} aria-label={t("command_bar.settings")}><Settings2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={close} aria-label={t("command_bar.close")}><XCircle className="h-4 w-4" /></Button></div>
        <div className="grid gap-2 border-b border-[#e2e4de] p-3 sm:grid-cols-[13rem_1fr]"><Input aria-label={t("command_bar.project_id")} value={projectId} onChange={(event) => setProjectId(event.target.value)} placeholder={t("command_bar.project_id_placeholder")} className="border-2 border-[#8bc34a] bg-[#b8e26a] text-xs text-[#1d2925] placeholder:text-[#52645a] focus-visible:border-[3px] focus-visible:border-[#8bc34a]" /><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718078]" /><Input ref={inputRef} autoFocus aria-label={t("command_bar.input")} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder={t("command_bar.placeholder")} className="border-2 border-[#8bc34a] bg-[#b8e26a] pl-9 font-mono text-sm text-[#1d2925] placeholder:text-[#52645a] focus-visible:border-[3px] focus-visible:border-[#8bc34a]" /></div><div className="relative sm:col-span-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718078]" /><Input ref={aliasSearchRef} aria-label={t("command_bar.search_aliases")} value={aliasSearch} onChange={(event) => setAliasSearch(event.target.value)} placeholder={t("command_bar.search_aliases")} className="border border-[#d7d8cf] bg-[#fbfaf6] pl-9 text-xs text-[#1d2925]" /></div><Button type="button" variant="outline" size="sm" onClick={exportAliasesCsv} aria-label={t("command_bar.export_aliases_csv")} className="h-9 border-[#385348] text-xs text-[#385348]"><Download className="mr-1 h-3.5 w-3.5" />{t("command_bar.export_aliases_csv")}</Button></div>
        {settingsOpen && <div className="border-b border-[#e2e4de] bg-[#f3f5ef] p-3"><div className="flex flex-wrap items-center gap-2"><label htmlFor="command-language" className="text-xs font-semibold text-[#385348]">{t("command_bar.language_preference")}</label><select id="command-language" aria-label={t("command_bar.language_preference")} value={preferredLocale} onChange={(event) => setPreferredLocale(event.target.value)} className="rounded border border-[#8bc34a] bg-[#fbfaf6] px-2 py-1 text-xs text-[#1d2925]">{LANGUAGE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Button type="button" size="sm" onClick={savePreferredLanguage} className="h-7 bg-[#385348] px-2 text-xs text-[#fbfaf6]">{t("command_bar.save_language")}</Button>{languageSaved && <span className="text-xs text-[#385348]">{t("command_bar.language_saved")}</span>}<span className="ml-3 text-xs font-semibold text-[#385348]">{t("command_bar.experience_mode")}</span><select aria-label={t("command_bar.experience_mode")} value={experienceMode} onChange={(event) => saveExperienceMode(event.target.value as ExperienceMode)} className="rounded border border-[#8bc34a] bg-[#fbfaf6] px-2 py-1 text-xs text-[#1d2925]"><option value="guided">{t("command_bar.beginner_mode")}</option><option value="expert">{t("command_bar.expert_mode")}</option></select></div></div>}
        {aliasSearch && <div className="max-h-36 overflow-y-auto border-b border-[#e2e4de] bg-[#fbfaf6] p-2">{aliasResults.slice(0, 24).map((entry) => <div key={`${entry.locale}-${entry.alias}`} title={entry.canonical} className="flex items-center justify-between rounded px-3 py-1.5 font-mono text-xs text-[#1d2925] hover:bg-[#e9ede5]"><span title={entry.canonical}>{entry.alias}</span><span className="text-[10px] text-[#718078]">{entry.canonical}</span></div>)}</div>}
        {suggestions.length > 0 && <div className="max-h-48 overflow-y-auto border-b border-[#e2e4de] p-2">{suggestions.map((suggestion, index) => { const aliasEntry = aliases.entries.find((entry) => entry.locale === locale && entry.alias === suggestion); const isActive = aliasEntry?.status === "ACTIVE"; const isProposed = aliasEntry?.status === "PROPOSED"; return <button type="button" key={`${suggestion}-${index}`} onClick={() => setInput(suggestion.startsWith("/") ? suggestion : `${input.trim()} ${suggestion}`.trim())} className={cn("flex w-full items-center justify-between rounded px-3 py-2 text-left font-mono text-xs", index === selected ? "bg-[#f2c300] font-bold text-[#1d2925]" : "text-[#1d2925] hover:bg-[#e9ede5] hover:text-[#385348]")}><span title={aliases.entries.find((entry) => entry.locale === locale && entry.alias === suggestion)?.canonical}>{suggestion}</span><span className="flex items-center gap-2 text-[10px] uppercase tracking-wide">{isActive && <span className="rounded bg-[#385348] px-1.5 py-0.5 text-[#fbfaf6]">{t("command_bar.alias_active")}</span>}{isProposed && <span className="rounded border border-[#d07b4a] bg-[#fbe5d6] px-1.5 py-0.5 text-[#a94524]">{t("command_bar.alias_proposed")}</span>}{index === selected && <span>Tab</span>}</span></button>; })}</div>}
        {educationalCommand && <div className="border-b border-[#e2e4de] bg-[#fffaf5] p-3"><div className="flex items-start gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#d07b4a]" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-[#385348]">{educationalCommand.name}</p><p className="mt-1 text-xs leading-5 text-[#718078]">{commandDescription(educationalCommand)}</p><p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#718078]">{t("command_bar.arguments")}</p><div className="mt-1 flex flex-wrap gap-1">{educationalCommand.arguments.length ? educationalCommand.arguments.map((arg) => <span key={arg.name} className={cn("rounded px-1.5 py-0.5 font-mono text-[10px]", arg.required ? "bg-[#fbe5d6] text-[#a94524]" : "bg-[#e9ede5] text-[#52645a]")}>{arg.name}{arg.required ? " · required" : " · optional"}</span>) : <span className="text-xs text-[#718078]">{t("command_bar.no_arguments")}</span>}</div><p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#718078]">{t("command_bar.example")}</p><button type="button" onClick={() => setInput(commandExample(educationalCommand))} className="mt-1 flex items-center gap-1 text-left font-mono text-xs text-[#385348] underline decoration-[#d07b4a] underline-offset-2"><Info className="h-3 w-3" />{commandExample(educationalCommand)}</button></div></div></div>}
        {input.trim() && !suggestions.length && <p className="border-b border-[#e2e4de] px-4 py-3 text-xs text-[#718078]">{t("command_bar.no_results")}</p>}
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs"><span className="flex items-center gap-2 text-[#718078]"><History className="h-3.5 w-3.5" /> {history.length ? t("command_bar.history_count", { count: history.length }) : t("command_bar.history_empty")}</span>{status && <span className={cn("flex items-center gap-2", status.type === "error" ? "border-l-[3px] border-[#d07b4a] bg-[#fbe5d6] px-2 font-medium text-[#a94524]" : status.type === "success" ? "border-l-[3px] border-[#385348] bg-[#dce6dc] px-2 text-[#385348]" : "bg-[#e9ede5] px-2 text-[#52645a]")}>{status.type === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : status.type === "success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}{status.message}{pendingCanonical && <Button type="button" size="sm" variant="outline" className="h-6 border-[#385348] bg-[#fbfaf6] px-2 text-[10px] text-[#385348]" onClick={() => void executeCanonicalQuick()}>{t("command_bar.use_canonical")}</Button>}</span>}</div>
      </div>
    </div>}
  </>;
}
