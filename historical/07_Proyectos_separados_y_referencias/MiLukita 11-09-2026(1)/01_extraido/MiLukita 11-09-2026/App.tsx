import { Toaster } from "@/components/ui/sonner";
import { Suspense, createElement, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";

const GamePage = lazy(() => import("@/pages/GamePage"));
const ImpactoPage = lazy(() => import("@/pages/ImpactoPage"));
const MultiMarketPage = lazy(() => import("@/pages/MultiMarketPage"));
const TransparenciaPage = lazy(() => import("@/pages/TransparenciaPage"));
const Operations = lazy(() => import("@/pages/Operations"));
const Profile = lazy(() => import("@/pages/Profile"));
const Verify = lazy(() => import("@/pages/Verify"));
const Wallet = lazy(() => import("@/pages/Wallet"));
const RtpDashboardPage = lazy(() => import("@/pages/RtpDashboardPage"));
const LearnPage = lazy(() => import("@/pages/LearnPage"));
const BatchHistoryPage = lazy(() => import("@/pages/BatchHistoryPage"));
const SimplifiedGamesPage = lazy(() => import("@/pages/SimplifiedGamesPage"));
const BroadcastPage = lazy(() => import("@/pages/BroadcastPage"));
const SystemStatusPage = lazy(() => import("@/pages/SystemStatusPage"));
const BroadcastOverlayPage = lazy(() => import("@/pages/BroadcastPage").then((module) => ({ default: module.BroadcastOverlayPage })));
const ControlRoom = lazy(() => import("@/pages/ControlRoom"));
const AuditSummaryPage = lazy(() => import("@/pages/AuditSummaryPage"));
const CommercialPage = lazy(() => import("@/pages/CommercialPage"));
const Lukita3DStudioPage = lazy(() => import("@/pages/Lukita3DStudioPage"));
const ConstitutionalOrgChartPage = lazy(() => import("@/pages/ConstitutionalOrgChartPage"));
const QrGeneratorPage = lazy(() => import("@/pages/QrGeneratorPage"));
const OnlineTvGamesPage = lazy(() => import("@/pages/OnlineTvGamesPage"));
const TouchRemotePage = lazy(() => import("@/pages/TouchRemotePage"));
const LukitaARStagePage = lazy(() => import("@/pages/LukitaARStagePage"));
const LukaContextQrPage = lazy(() => import("@/pages/LukaContextQrPage"));
const LukaUniversalEntry = lazy(() => import("@/components/LukaUniversalEntry"));
const TerritorialTrustPage = lazy(() => import("@/pages/TerritorialTrustPage"));
const TerritorialFieldEntryPage = lazy(() => import("@/pages/TerritorialFieldEntryPage"));
const TerritorialAdminRoute = lazy(() => import("@/pages/TerritorialTrustPage").then(module => ({ default: () => createElement(module.default, { surface: "admin" }) })));
import ErrorBoundary from "./components/ErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductAnalyticsBeacon from "./components/ProductAnalyticsBeacon";
import MobileShell from "./components/MobileShell";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<div className="grid min-h-[40vh] place-items-center bg-[#06120e] px-6 text-sm text-slate-300">Cargando experiencia MiLukita…</div>}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/bingos-simplificados"} component={() => <SimplifiedGamesPage mode="bingo" />} />
      <Route path={"/ruletas-simplificadas"} component={() => <SimplifiedGamesPage mode="ruleta" />} />
      <Route path={"/juegos/:game"} component={GamePage} />
      <Route path={"/multimarket"} component={MultiMarketPage} />
      <Route path={"/impacto"} component={ImpactoPage} />
      <Route path={"/transparencia"} component={TransparenciaPage} />
      <Route path={"/rtp"} component={RtpDashboardPage} />
      <Route path={"/aprender"} component={LearnPage} />
      <Route path={"/lotes"} component={BatchHistoryPage} />
      <Route path={"/billetera"} component={Wallet} />
      <Route path={"/verificar"} component={Verify} />
      <Route path={"/operacion"} component={Operations} />
      <Route path={"/control-room"} component={ControlRoom} />
      <Route path={"/auditoria-resumen"} component={AuditSummaryPage} />
      <Route path={"/comercial"} component={CommercialPage} />
      <Route path={"/lukita-3d"} component={Lukita3DStudioPage} />
      <Route path={"/organigrama-constitucional"} component={ConstitutionalOrgChartPage} />
      <Route path={"/qr-circular-lukita"} component={QrGeneratorPage} />
      <Route path={"/generador-qr"} component={QrGeneratorPage} />
      <Route path={"/qr-studio"} component={QrGeneratorPage} />
      <Route path={"/portal"} component={Home} />
      <Route path={"/tv"} component={BroadcastPage} />
      <Route path={"/estado-sistema"} component={SystemStatusPage} />
      <Route path={"/tv-en-linea"} component={OnlineTvGamesPage} />
      <Route path={"/touch-remote"} component={TouchRemotePage} />
      <Route path={"/lukita-ar-stage"} component={LukitaARStagePage} />
      <Route path={"/luka-context-qr"} component={LukaContextQrPage} />
      <Route path={"/luka-entry"} component={LukaUniversalEntry} />
      <Route path={"/mapper-the-eye"} component={TerritorialAdminRoute} />
      <Route path={"/mapper"} component={TerritorialFieldEntryPage} />
      <Route path={"/the-eye"} component={TerritorialFieldEntryPage} />
      <Route path={"/overlay/:roundId"} component={BroadcastOverlayPage} />
      <Route path={"/perfil"} component={Profile} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <ProductAnalyticsBeacon />
            <MobileShell><Router /></MobileShell>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
