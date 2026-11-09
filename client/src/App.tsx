import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import ArkiFirstContact from "./components/ArkiFirstContact";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import OfflineSyncManager from "./components/OfflineSyncManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import DashboardLayout from "./components/DashboardLayout";

// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const ArkiCockpitPage = lazy(() => import("./pages/ArkiCockpitPage"));
const EvidencePage = lazy(() => import("./pages/EvidencePage"));
const EvaluationsPage = lazy(() => import("./pages/EvaluationsPage"));
const ComparisonsPage = lazy(() => import("./pages/ComparisonsPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const HelpArticlePage = lazy(() => import("./pages/HelpArticlePage"));
const CommandBar = lazy(() => import("./components/CommandBar"));
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
const ArkiAiLabPage = lazy(() => import("./pages/ArkiAiLabPage"));
const ArkiBimViewerPage = lazy(() => import("./pages/ArkiBimViewerPage"));
const ArkiDesignFunnelPage = lazy(() => import("./pages/ArkiDesignFunnelPage"));
const ArkiFamilyStudioPage = lazy(() => import("./pages/ArkiFamilyStudioPage"));
const ArkiGeneratorPage = lazy(() => import("./pages/ArkiGeneratorPage"));
const ArkiIdeasPage = lazy(() => import("./pages/ArkiIdeasPage"));
const ArkiLivingTreePage = lazy(() => import("./pages/ArkiLivingTreePage"));
const ArkiMarketplacePage = lazy(() => import("./pages/ArkiMarketplacePage"));
const ArkiResearchReviewPage = lazy(() => import("./pages/ArkiResearchReviewPage"));
const ArkiSelfCarePage = lazy(() => import("./pages/ArkiSelfCarePage"));
const ArkiSuperarchitectCommandCenterPage = lazy(() => import("./pages/ArkiSuperarchitectCommandCenterPage"));
const ArkiSuperArchitectViewerPage = lazy(() => import("./pages/ArkiSuperArchitectViewerPage"));
const ArkiSuperDossierPage = lazy(() => import("./pages/ArkiSuperDossierPage"));
const ArkiSuperpowersPage = lazy(() => import("./pages/ArkiSuperpowersPage"));
const ArkiTvPage = lazy(() => import("./pages/ArkiTvPage"));
const ArLuOrchestratorPage = lazy(() => import("./pages/ArLuOrchestratorPage"));
const FederatedHandoffInboxPage = lazy(() => import("./pages/FederatedHandoffInboxPage"));
const LucaControlCenterPage = lazy(() => import("./pages/LucaControlCenterPage"));
const ArkiDeviceInteroperabilityPage = lazy(() => import("./pages/ArkiDeviceInteroperabilityPage"));
const ArkiHostConnectionsPage = lazy(() => import("./pages/ArkiHostConnectionsPage"));
const ArkiPublicProcurementHubPage = lazy(() => import("./pages/ArkiPublicProcurementHubPage"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <OfflineSyncManager />
            <PwaInstallPrompt />
            <ArkiFirstContact />
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando ARKI...</div>}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/arki" component={Home} />
                <Route path="/arki-cockpit" component={ArkiCockpitPage} />
                <Route path="/evidence" component={EvidencePage} />
                <Route path="/evaluations" component={EvaluationsPage} />
                <Route path="/comparisons" component={ComparisonsPage} />
                <Route path="/help" component={HelpPage} />
                <Route path="/help/:slug" component={HelpArticlePage} />
                <Route path="/multiobjective" component={MultiobjectivePage} />
                <Route path="/arki-book" component={ArkiBookPage} />
                <Route path="/spatial" component={SpatialViewerPage} />
                <Route path="/spatial-comparison" component={SpatialComparisonPage} />
                <Route path="/sources" component={SourceLibraryPage} />
                <Route path="/control-center" component={ArkiControlCenterPage} />
                <Route path="/parametric-files" component={ParametricFilesPage} />
                <Route path="/arki-operations" component={ArkiOperationsPage} />
                <Route path="/arki-parametric-runtime" component={ArkiParametricRuntimePage} />
                <Route path="/field" component={FieldModePage} />
                <Route path="/security-events" component={SecurityEventsPage} />
                <Route path="/arki-ai-lab" component={ArkiAiLabPage} />
                <Route path="/arki-bim-visor" component={ArkiBimViewerPage} />
                <Route path="/arki-design-funnel" component={ArkiDesignFunnelPage} />
                <Route path="/arki-family-studio" component={ArkiFamilyStudioPage} />
                <Route path="/arki-generator" component={ArkiGeneratorPage} />
                <Route path="/arki-ideas" component={ArkiIdeasPage} />
                <Route path="/arki-arbol-vivo" component={ArkiLivingTreePage} />
                <Route path="/arki-marketplace" component={ArkiMarketplacePage} />
                <Route path="/arki-research-review" component={ArkiResearchReviewPage} />
                <Route path="/arki-self-care" component={ArkiSelfCarePage} />
                <Route path="/arki-command-center" component={ArkiSuperarchitectCommandCenterPage} />
                <Route path="/arki-super-architect" component={ArkiSuperArchitectViewerPage} />
                <Route path="/arki-super-dossier" component={ArkiSuperDossierPage} />
                <Route path="/arki-superpowers" component={ArkiSuperpowersPage} />
                <Route path="/arki-tv" component={ArkiTvPage} />
                <Route path="/ar-lu-orchestrator" component={ArLuOrchestratorPage} />
                <Route path="/federated-handoffs" component={FederatedHandoffInboxPage} />
                <Route path="/luka-control-center" component={LucaControlCenterPage} />
                <Route path="/arki-device-bridge" component={ArkiDeviceInteroperabilityPage} />
                <Route path="/arki-host-connections" component={ArkiHostConnectionsPage} />
                <Route path="/public-procurement" component={ArkiPublicProcurementHubPage} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
