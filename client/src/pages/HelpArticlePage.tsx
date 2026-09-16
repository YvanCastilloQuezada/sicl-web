import { Download, ArrowLeft } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { MANUALS, type ManualId, manualById } from "@/config/manuals";
import userManual from "@/content/manuals/USER_MANUAL.md?raw";
import operationsManual from "@/content/manuals/OPERATIONS_MANUAL.md?raw";
import commandsReference from "@/content/manuals/COMMANDS_REFERENCE.md?raw";

const content: Record<ManualId, string> = { user: userManual, operations: operationsManual, commands: commandsReference };

export default function HelpArticlePage({ manualId }: { manualId: ManualId }) {
  const { t } = useTranslation();
  const manual = manualById(manualId);
  return (
    <article className="mx-auto w-full max-w-[1120px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#d7d8cf] pb-5">
        <Link href="/help" className="inline-flex items-center gap-2 text-sm font-medium text-[#385348] hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t("help.back")}</Link>
        <a href={manual.pdfUrl} download className="inline-flex items-center gap-2 border border-[#b9c4bd] px-3 py-2 text-xs font-semibold text-[#385348] hover:bg-[#e9ede5]"><Download className="h-4 w-4" aria-hidden="true" />{t("help.action.pdf")}</a>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,800px)_220px]">
        <div className="min-w-0 text-base leading-[1.6] text-[#283731] [&_a]:text-[#385348] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#d07b4a] [&_blockquote]:pl-4 [&_code]:rounded [&_code]:border [&_code]:border-[#d4d8d0] [&_code]:bg-[#f1f3ee] [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-5 [&_h1]:font-serif [&_h1]:text-4xl [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-[#d7d8cf] [&_h2]:pb-2 [&_h2]:font-serif [&_h2]:text-2xl [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-semibold [&_h3]:text-xl [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-[#d4d8d0] [&_pre]:bg-[#f1f3ee] [&_pre]:p-4 [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#d4d8d0] [&_td]:p-2 [&_th]:border [&_th]:border-[#d4d8d0] [&_th]:bg-[#e9ede5] [&_th]:p-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6]">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}>{content[manualId]}</ReactMarkdown>
        </div>
        <aside className="hidden self-start border-l border-[#d7d8cf] pl-5 lg:block lg:sticky lg:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#60766b]">{manual.title}</p>
          <p className="mt-3 text-xs leading-5 text-[#718078]">{t("help.tocHint")}</p>
          <div className="mt-4 space-y-2 text-xs text-[#385348]">
            {MANUALS.map((item) => <Link key={item.id} href={item.path} className={`block hover:underline ${item.id === manualId ? "font-bold" : ""}`}>{t(`help.${item.id}.title`)}</Link>)}
          </div>
        </aside>
      </div>
    </article>
  );
}
