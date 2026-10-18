import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ArkiGateway, { type ArkiAccess } from "./components/ArkiGateway";
import ArkiWorkspaceShell from "./components/ArkiWorkspaceShell";
import Home from "./pages/Home";
import { ProjectContextProvider, useProjectContext } from "./contexts/ProjectContext";
import BimModule from "./modules/BimModule";
import DossierModule from "./modules/DossierModule";
import AutopilotCommandCenter from "./pages/AutopilotCommandCenter";

const ACCESS_STORAGE_KEY = "arki-ui-access-profile-v1";

function AppContent() {
  const isAutopilot = window.location.pathname === "/autopilot";
  const [access, setAccess] = useState<ArkiAccess | null>(() => {
    const saved = localStorage.getItem(ACCESS_STORAGE_KEY);
    return saved === "visitor" || saved === "user" || saved === "specialist" || saved === "corporate" ? saved : null;
  });

  const enter = (next: ArkiAccess) => { localStorage.setItem(ACCESS_STORAGE_KEY, next); setAccess(next); };
  const exit = () => { localStorage.removeItem(ACCESS_STORAGE_KEY); setAccess(null); };

  if (isAutopilot) return <AutopilotCommandCenter />;
  if (!access) return <ArkiGateway onEnter={enter} />;
  return <ProjectContextProvider><ArkiWorkspaceShell access={access} onExit={exit}><Home /></ArkiWorkspaceShell></ProjectContextProvider>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster position="bottom-right" theme="dark" /><AppContent /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
