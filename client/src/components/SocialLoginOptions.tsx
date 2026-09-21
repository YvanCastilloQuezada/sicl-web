import { Apple, Chrome, LogIn, ShieldCheck } from "lucide-react";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";

type Provider = { id: "google" | "microsoft" | "apple"; label: string; icon: typeof Chrome; envKey: string };
const providers: Provider[] = [
  { id: "google", label: "Google", icon: Chrome, envKey: "VITE_SOCIAL_GOOGLE_AUTH_URL" },
  { id: "microsoft", label: "Microsoft", icon: LogIn, envKey: "VITE_SOCIAL_MICROSOFT_AUTH_URL" },
  { id: "apple", label: "Apple", icon: Apple, envKey: "VITE_SOCIAL_APPLE_AUTH_URL" },
];

export default function SocialLoginOptions() {
  const configured = (key: string) => typeof import.meta.env[key] === "string" && import.meta.env[key].length > 0;
  const openProvider = (provider: Provider) => {
    const base = import.meta.env[provider.envKey] as string | undefined;
    if (!base) return;
    const url = new URL(base);
    url.searchParams.set("redirect_uri", `${window.location.origin}/api/oauth/callback`);
    url.searchParams.set("return_to", window.location.pathname);
    window.location.assign(url.toString());
  };
  return <section className="space-y-3 rounded-xl border border-[#294765] bg-[#0d223d] p-4" aria-label="Opciones de acceso"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><p className="text-xs font-medium text-[#edf4ff]">Acceso seguro a ARKI</p></div><p className="text-[11px] leading-5 text-[#9eb6ce]">Usa el acceso ARKI existente o un proveedor social cuando esté configurado por el administrador. No se guardan credenciales en ARKI.</p><Button type="button" onClick={() => startLogin()} className="w-full bg-[#f0a35b] text-black hover:bg-[#f6c995]"><LogIn className="mr-2 h-4 w-4" />Continuar con ARKI / Manus</Button><div className="grid gap-2 sm:grid-cols-3">{providers.map((provider) => { const Icon = provider.icon; const ready = configured(provider.envKey); return <Button key={provider.id} type="button" variant="outline" disabled={!ready} onClick={() => openProvider(provider)} title={ready ? `Continuar con ${provider.label}` : `${provider.label}: proveedor pendiente de configuración`} className="border-[#557da5] text-xs text-[#d7e5f4] disabled:cursor-not-allowed disabled:opacity-50"><Icon className="mr-2 h-4 w-4" />{provider.label}{!ready && <span className="ml-1 text-[10px]">(pend.)</span>}</Button>; })}</div></section>;
}
