import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import ArkiFirstContact from "./components/ArkiFirstContact";
import ArkiContextGate from "./components/ArkiContextGate";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import OfflineSyncManager from "./components/OfflineSyncManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import DashboardLayout from "./components/DashboardLayout";
const Home = lazy(() => import("./pages/Home"));
const EvidencePage = lazy(() => import("./pages/EvidencePage"));
const EvaluationsPage = lazy(() => import("./pages/EvaluationsPage"));
const ComparisonsPage = lazy(() => import("./pages/ComparisonsPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const HelpArticlePage = lazy(() => import("./pages/HelpArticlePage"));
import CommandBar from "./components/CommandBar";
const MultiobjectivePage = lazy(() => import("./pages/MultiobjectivePage"));
const ArkiBookPage = lazy(() => import("./pages/ArkiBookPage"));
const SpatialViewerPage = lazy(() => import("./pages/SpatialViewerPage"));
const SpatialComparisonPage = lazy(() => import("./pages/SpatialComparisonPage"));
const SourceLibraryPage = lazy(() => import("./pages/SourceLibraryPage"));
const ArkiControlCenterPage = lazy(() => import("./pages/ArkiControlCenterPage"));
const ParametricFilesPage = lazy(() => import("./pages/ParametricFilesPage"));
const ArkiOperationsPage = lazy(() => import("./pages/ArkiOperationsPage"));
const ArkiParametricRuntimePage = lazy(() => import("./pages/ArkiParametricRuntimePage"));
const FieldModePage = lazy(() => import("./pages/FieldModePage"));
const SecurityEventsPage = lazy(() => import("./pages/SecurityEventsPage"));
const ArkiResearchReviewPage = lazy(() => import("./pages/ArkiResearchReviewPage"));
const ArkiBimViewerPage = lazy(() => import("./pages/ArkiBimViewerPage"));
const ArkiHostConnectionsPage = lazy(() => import("./pages/ArkiHostConnectionsPage"));
const ArkiSelfCarePage = lazy(() => import("./pages/ArkiSelfCarePage"));
const ArkiDeviceInteroperabilityPage = lazy(() => import("./pages/ArkiDeviceInteroperabilityPage"));
const LucaControlCenterPage = lazy(() => import("./pages/LucaControlCenterPage"));
const FederatedHandoffInboxPage = lazy(() => import("./pages/FederatedHandoffInboxPage"));
const ArkiTvPage = lazy(() => import("./pages/ArkiTvPage"));
const ArLuOrchestratorPage = lazy(() => import("./pages/ArLuOrchestratorPage"));
const ArkiMarketplacePage = lazy(() => import("./pages/ArkiMarketplacePage"));
const ArkiGeneratorPage = lazy(() => import("./pages/ArkiGeneratorPage"));
const ArkiFamilyStudioPage = lazy(() => import("./pages/ArkiFamilyStudioPage"));
const ArkiSuperArchitectViewerPage = lazy(() => import("./pages/ArkiSuperArchitectViewerPage"));
const ArkiDesignFunnelPage = lazy(() => import("./pages/ArkiDesignFunnelPage"));

function PageLoadingFallback() {
  return <div role="status" aria-label="Cargando módulo" className="min-h-screen animate-pulse bg-background p-8"><span className="sr-only">Cargando módulo</span><div className="mx-auto max-w-5xl space-y-5"><div className="h-8 w-2/5 rounded bg-muted" /><div className="h-4 w-3/5 rounded bg-muted" /><div className="h-48 rounded border border-border bg-card" /></div></div>;
}

function AuditRoute() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.location.hash !== "#audit") {
      window.history.replaceState(null, "", "/audit#audit");
    }
    setReady(true);
  }, []);

  return ready ? <Home /> : null;
}

function HashWorkspaceRoute() {
  const [hash, setHash] = useState(() => window.location.hash.replace(/^#/, ""));
  useEffect(() => { const sync = () => setHash(window.location.hash.replace(/^#/, "")); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync); }, []);
  if (hash === "evidence") return <EvidencePage />;
  if (hash === "evaluations") return <EvaluationsPage />;
  if (hash === "comparisons") return <ComparisonsPage />;
  return <Home />;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageLoadingFallback />}>
    <Switch>
      <Route path={"/"}>{() => <HashWorkspaceRoute />}</Route>
      <Route path={"/arki"}>{() => <HashWorkspaceRoute />}</Route>
      <Route path={"/evidence"} component={EvidencePage} />
      <Route path={"/evaluations"} component={EvaluationsPage} />
      <Route path={"/comparisons"} component={ComparisonsPage} />
      <Route path={"/multiobjective"}>{() => <DashboardLayout><MultiobjectivePage /></DashboardLayout>}</Route>
      <Route path={"/arki-book"}>{() => <DashboardLayout><ArkiBookPage /></DashboardLayout>}</Route>
      <Route path={"/spatial"}>{() => <DashboardLayout><SpatialViewerPage /></DashboardLayout>}</Route>
      <Route path={"/spatial-comparison"} component={SpatialComparisonPage} />
      <Route path={"/sources"} component={SourceLibraryPage} />
      <Route path={"/control-center"}>{() => <DashboardLayout showSidebar={false} compactHeader hideBrand><ArkiControlCenterPage /></DashboardLayout>}</Route>
      <Route path={"/parametric-files"}>{() => <DashboardLayout><ParametricFilesPage /></DashboardLayout>}</Route>
      <Route path={"/arki-operations"}>{() => <DashboardLayout><ArkiOperationsPage /></DashboardLayout>}</Route>
      <Route path={"/arki-parametric-runtime"}>{() => <ArkiParametricRuntimePage />}</Route>
      <Route path={"/arki-generator"}>{() => <ArkiGeneratorPage />}</Route>
      <Route path={"/arki-family-studio"}>{() => <ArkiFamilyStudioPage />}</Route>
      <Route path={"/arki-super-architect"}>{() => <ArkiSuperArchitectViewerPage />}</Route>
      <Route path={"/arki-design-funnel"}>{() => <ArkiDesignFunnelPage />}</Route>
      <Route path={"/arki-bim-visor"}>{() => <ArkiBimViewerPage />}</Route>
      <Route path={"/arki-host-connections"}>{() => <ArkiHostConnectionsPage />}</Route>
      <Route path={"/arki-device-bridge"}>{() => <DashboardLayout><ArkiDeviceInteroperabilityPage /></DashboardLayout>}</Route>
      <Route path={"/luka-control-center"}>{() => <DashboardLayout showSidebar={false} compactHeader hideBrand><LucaControlCenterPage /></DashboardLayout>}</Route>
      <Route path={"/federated-handoffs"}>{() => <DashboardLayout showSidebar={false} compactHeader hideBrand><FederatedHandoffInboxPage /></DashboardLayout>}</Route>
      <Route path={"/arki-tv"}>{() => <ArkiTvPage />}</Route>
      <Route path={"/ar-lu-orchestrator"}>{() => <DashboardLayout showSidebar={false} compactHeader hideBrand><ArLuOrchestratorPage /></DashboardLayout>}</Route>
      <Route path={"/arki-marketplace"}>{() => <ArkiMarketplacePage />}</Route>
      <Route path={"/arki-self-care"}>{() => <ArkiSelfCarePage />}</Route>
      <Route path={"/field"} component={FieldModePage} />
      <Route path={"/security-events"}>{() => <DashboardLayout><SecurityEventsPage /></DashboardLayout>}</Route>
      <Route path={"/arki-research-review"} component={ArkiResearchReviewPage} />
      <Route path={"/audit"}>{() => <AuditRoute />}</Route>
      <Route path={"/help"}>{() => <DashboardLayout><HelpPage /></DashboardLayout>}</Route>
      <Route path={"/help/user"}>{() => <DashboardLayout><HelpArticlePage manualId="user" /></DashboardLayout>}</Route>
      <Route path={"/help/operations"}>{() => <DashboardLayout><HelpArticlePage manualId="operations" /></DashboardLayout>}</Route>
      <Route path={"/help/commands"}>{() => <DashboardLayout><HelpArticlePage manualId="commands" /></DashboardLayout>}</Route>
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
            <ArkiFirstContact />
            <ArkiContextGate />
            <PwaInstallPrompt />
            <OfflineSyncManager />
            <Suspense fallback={null}><CommandBar /></Suspense>
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
