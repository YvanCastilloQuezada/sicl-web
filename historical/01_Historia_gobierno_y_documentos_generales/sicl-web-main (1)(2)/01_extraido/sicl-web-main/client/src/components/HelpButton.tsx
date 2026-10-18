import { HelpCircle, ExternalLink, FileText, Download } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { MANUALS } from "@/config/manuals";

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("help.button")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 border border-[#b9c4bd] bg-[#fbfaf6] px-3 py-2 text-xs font-semibold text-[#385348] transition-colors hover:bg-[#e9ede5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#385348]"
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t("help.button")}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] border border-[#cbd2c9] bg-[#fbfaf6] p-3 text-[#1d2925] shadow-xl">
          <div className="mb-2 border-b border-[#e2e4dd] pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#60766b]">{t("help.title")}</div>
          <div className="space-y-2">
            {MANUALS.map((manual) => (
              <div key={manual.id} className="border border-[#e2e4dd] p-3">
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#d07b4a]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{t(`help.${manual.id}.title`)}</p>
                    <p className="mt-1 text-xs leading-5 text-[#718078]">{t(`help.${manual.id}.description`)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button type="button" onClick={() => { navigate(manual.path); setOpen(false); }} className="border border-[#385348] bg-[#385348] px-2.5 py-1.5 font-medium text-white hover:bg-[#294038]">{t("help.action.view")}</button>
                  <a href={manual.pdfUrl} download className="inline-flex items-center gap-1 border border-[#b9c4bd] px-2.5 py-1.5 font-medium text-[#385348] hover:bg-[#e9ede5]"><Download className="h-3.5 w-3.5" aria-hidden="true" />{t("help.action.pdf")}</a>
                  <a href={manual.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 border border-[#b9c4bd] px-2.5 py-1.5 font-medium text-[#385348] hover:bg-[#e9ede5]"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />{t("help.action.github")}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
