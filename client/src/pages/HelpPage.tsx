import { Download, ExternalLink, FileText } from "lucide-react";
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
