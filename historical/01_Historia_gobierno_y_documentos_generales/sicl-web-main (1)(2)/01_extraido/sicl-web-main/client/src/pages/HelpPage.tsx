import { ArrowRight, Download, ExternalLink, FileText, ListChecks, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { MANUALS } from "@/config/manuals";
import catalog from "@/content/commands-catalog.json";
import { Input } from "@/components/ui/input";

export default function HelpPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("sims-dei-help-search-history") || "[]"); } catch { return []; } });
  const recordSearch = (value: string) => { const clean = value.trim(); if (!clean) return; const next = [clean, ...recent.filter((item) => item !== clean)].slice(0, 6); setRecent(next); localStorage.setItem("sims-dei-help-search-history", JSON.stringify(next)); };
  const highlight = (text: string) => { const value = query.trim(); if (!value) return text; const parts = text.split(new RegExp(`(${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig")); return parts.map((part, index) => part.toLowerCase() === value.toLowerCase() ? <mark key={index} className="bg-[#f2c300] px-0.5 text-black">{part}</mark> : part); };
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return (catalog as { name: string; syntax: string; category: string }[]).filter((item) => `${item.name} ${item.syntax} ${item.category}`.toLowerCase().includes(value)).slice(0, 8);
  }, [query]);
  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return (catalog as { name: string }[]).slice(0, 5);
    return (catalog as { name: string; category: string }[]).filter((item) => item.name.toLowerCase().startsWith(value) || item.category.toLowerCase().startsWith(value)).slice(0, 5);
  }, [query]);
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="mb-8 border-b border-[#d7d8cf] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]">ARKI</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">{t("help.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718078]">{t("help.subtitle")}</p>
      </div>
      <section className="mb-8 border border-[#385348] bg-[#eef1eb] p-5" aria-labelledby="task-help-title">
        <div className="flex items-start gap-3">
          <ListChecks className="mt-1 h-5 w-5 text-[#d07b4a]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h2 id="task-help-title" className="font-serif text-2xl text-[#385348]">{t("help.tasks.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-[#52645a]">{t("help.tasks.subtitle")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(["first_project", "preference", "recommendation", "human_review", "decision", "command"] as const).map((task) => (
                <Link key={task} href={task === "command" ? "/arki-operations" : "/"} className="group border border-[#cbd2c9] bg-[#fbfaf6] p-4 transition-colors hover:border-[#d07b4a] hover:bg-white">
                  <span className="text-sm font-semibold text-[#385348]">{t(`help.tasks.${task}.title`)}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#718078]">{t(`help.tasks.${task}.description`)}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#a94524]">{t("help.tasks.open")} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mb-8 border border-[#d4d8d0] bg-[#fbfaf6] p-5" aria-labelledby="help-search-title">
        <div className="flex items-center gap-2"><Search className="h-4 w-4 text-[#d07b4a]" /><h2 id="help-search-title" className="font-serif text-2xl text-[#385348]">{t("help.search.title")}</h2></div>
        <p className="mt-2 text-sm text-[#718078]">{t("help.search.description")}</p>
        <div className="relative mt-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718078]" /><Input aria-label={t("help.search.label")} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") recordSearch(query); }} placeholder={t("help.search.placeholder")} className="border-2 border-[#8bc34a] bg-[#b8e26a] pl-9 text-[#1d2925] placeholder:text-[#52645a]" /></div>
        {suggestions.length > 0 && <div className="mt-2 flex flex-wrap gap-2" aria-label={t("help.search.suggestions")}>{suggestions.map((item) => <button key={item.name} type="button" onClick={() => setQuery(item.name)} className="rounded border border-[#cbd2c9] bg-[#eef1eb] px-2 py-1 font-mono text-[11px] text-[#385348] transition-colors hover:border-[#d07b4a] hover:bg-[#fbe5d6]">{item.name}</button>)}</div>}
        {recent.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2 text-xs"><span className="font-semibold text-[#52645a]">{t("help.search.recent")}</span>{recent.map((item) => <button key={item} type="button" onClick={() => setQuery(item)} className="rounded bg-[#eef1eb] px-2 py-1 font-mono text-[#385348] hover:bg-[#fbe5d6]">{item}</button>)}</div>}
        {query && <div className="mt-3 space-y-2">{results.length ? results.map((item) => <Link key={item.name} href="/help/commands" className="block border-l-4 border-[#d07b4a] bg-[#fffaf5] p-3 transition-colors hover:bg-[#fbe5d6]"><p className="font-mono text-sm font-semibold text-[#385348]">{highlight(item.name)}</p><p className="mt-1 text-xs text-[#718078]">{highlight(item.syntax)}</p></Link>) : <p className="text-sm text-[#718078]">{t("help.search.empty")}</p>}</div>}
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {MANUALS.map((manual) => (
          <article key={manual.id} className="flex flex-col border border-[#d4d8d0] bg-[#fbfaf6] p-5">
            <FileText className="h-6 w-6 text-[#d07b4a]" aria-hidden="true" />
            <h2 className="mt-5 text-lg font-semibold">{t(`help.${manual.id}.title`)}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#718078]">{t(`help.${manual.id}.description`)}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <Link href={manual.path} className="bg-[#385348] px-3 py-2 font-medium text-white hover:bg-[#294038]">{t("help.action.view")}</Link>
              <a href={manual.pdfUrl} download className="inline-flex items-center gap-1 border border-[#b9c4bd] px-3 py-2 font-medium text-[#385348] hover:bg-[#e9ede5]"><Download className="h-3.5 w-3.5" aria-hidden="true" />{t("help.action.pdf")}</a>
              <a href={manual.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 border border-[#b9c4bd] px-3 py-2 font-medium text-[#385348] hover:bg-[#e9ede5]"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />{t("help.action.github")}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
