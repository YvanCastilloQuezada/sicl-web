import { ArrowRight, Download, ExternalLink, FileText, ListChecks } from "lucide-react";
import React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { MANUALS } from "@/config/manuals";

export default function HelpPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="mb-8 border-b border-[#d7d8cf] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]">SiMS-DeI</p>
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
                <Link key={task} href={task === "command" ? "/help/commands" : "/"} className="group border border-[#cbd2c9] bg-[#fbfaf6] p-4 transition-colors hover:border-[#d07b4a] hover:bg-white">
                  <span className="text-sm font-semibold text-[#385348]">{t(`help.tasks.${task}.title`)}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#718078]">{t(`help.tasks.${task}.description`)}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#a94524]">{t("help.tasks.open")} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
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
