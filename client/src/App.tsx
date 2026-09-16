import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import EvidencePage from "./pages/EvidencePage";
import EvaluationsPage from "./pages/EvaluationsPage";
import ComparisonsPage from "./pages/ComparisonsPage";
import HelpPage from "./pages/HelpPage";
import HelpArticlePage from "./pages/HelpArticlePage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/evidence"} component={EvidencePage} />
      <Route path={"/evaluations"} component={EvaluationsPage} />
      <Route path={"/comparisons"} component={ComparisonsPage} />
      <Route path={"/help"}>{() => <DashboardLayout><HelpPage /></DashboardLayout>}</Route>
      <Route path={"/help/user"}>{() => <DashboardLayout><HelpArticlePage manualId="user" /></DashboardLayout>}</Route>
      <Route path={"/help/operations"}>{() => <DashboardLayout><HelpArticlePage manualId="operations" /></DashboardLayout>}</Route>
      <Route path={"/help/commands"}>{() => <DashboardLayout><HelpArticlePage manualId="commands" /></DashboardLayout>}</Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        defaultTheme="system"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
