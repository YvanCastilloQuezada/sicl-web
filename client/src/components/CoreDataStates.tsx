import { AlertTriangle, CheckCircle2, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

type CoreUnavailableProps = { onRetry: () => void; onEnableMock: () => void; error?: string };

export function CoreLoadingSkeleton() {
  return (
    <Card aria-label="Cargando datos del Core" className="mt-6 border-[#d4d8d0] bg-[#fbfaf6] shadow-none">
      <CardHeader className="space-y-3"><Skeleton className="h-5 w-56" /><Skeleton className="h-4 w-96 max-w-full" /></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-32" /><Skeleton className="h-28 w-full md:col-span-3" /></CardContent>
    </Card>
  );
}

export function CoreUnavailable({ onRetry, onEnableMock, error }: CoreUnavailableProps) {
  const { t } = useTranslation();
  const displayError = error?.includes("SICL Core API returned 503") ? `${t("core.core_unconfigured")} (HTTP 503)` : error;
  return (
    <Card role="alert" className="mt-6 overflow-hidden border-[#d07b4a] bg-gradient-to-br from-[#fffaf3] to-[#f7e8dc] shadow-none">
      <CardHeader><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d07b4a] text-white"><WifiOff className="h-5 w-5" /></span><div><CardTitle className="font-serif text-2xl text-[#63351f]">{t("core.core_unconfigured")}</CardTitle><p className="mt-1 text-sm text-[#7b5845]">{t("core.core_not_connected")}</p></div></div></CardHeader>
      <CardContent className="space-y-4 text-sm text-[#63351f]"><p>{displayError || t("core.core_contact")}</p><ol className="grid gap-2 rounded-md border border-[#e7c3aa] bg-white/60 p-4 text-[#7b5845]"><li>1. {t("core.core_deploy")}</li><li>2. {t("core.core_configure")}</li><li>3. {t("core.core_retry_steps")}</li></ol><div className="flex flex-wrap gap-3"><Button type="button" onClick={onRetry} className="bg-[#385348] text-white hover:bg-[#294038]"><RefreshCw className="mr-2 h-4 w-4" /> {t("core.retry_connection")}</Button><Button type="button" variant="outline" onClick={onEnableMock} className="border-[#385348] bg-white text-[#385348] hover:bg-[#eef1eb]"><CheckCircle2 className="mr-2 h-4 w-4" /> {t("core.try_mock")}</Button></div></CardContent>
    </Card>
  );
}

export function CoreError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useTranslation();
  return <Card role="alert" className="mt-6 border-[#d07b4a] bg-[#fffaf3] shadow-none"><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 text-[#a95e35]" /><p className="text-sm text-[#63351f]">{message}</p></div><Button type="button" variant="outline" onClick={onRetry} className="border-[#a95e35] text-[#7b3f25]"><RefreshCw className="mr-2 h-4 w-4" /> {t("core.retry")}</Button></CardContent></Card>;
}
