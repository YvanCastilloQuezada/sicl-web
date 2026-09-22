import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import LanguageSelector from "@/components/LanguageSelector";
import { useIsMobile } from "@/hooks/useMobile";
import { Activity, BookOpen, Boxes, FileText, GitBranch, LayoutDashboard, LogOut, MapPin, Network, PanelLeft, Puzzle, Scale, ShieldAlert, ShieldCheck, Sparkles, Target, Waypoints, Workflow } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import AppHeader from "@/components/AppHeader";
import { TEMPORARY_DIRECT_ACCESS } from "@/_core/auth-access";

const menuItems = [
  { icon: LayoutDashboard, label: "nav.project", path: "/" },
  { icon: Waypoints, label: "nav.context", path: "/#context" },
  { icon: Target, label: "nav.objectives", path: "/#problem" },
  { icon: GitBranch, label: "nav.alternatives", path: "/#alternatives" },
  { icon: FileText, label: "nav.evidence", path: "/evidence" },
  { icon: Activity, label: "nav.evaluations", path: "/evaluations" },
  { icon: Scale, label: "nav.comparisons", path: "/comparisons" },
  { icon: Scale, label: "nav.council", path: "/#council" },
  { icon: ShieldCheck, label: "nav.decision", path: "/#audit" },
  { icon: BookOpen, label: "ARKI · Libro Vivo", path: "/arki-book" },
  { icon: Boxes, label: "ARKI · Parametric Files", path: "/parametric-files" },
  { icon: Puzzle, label: "ARKI · Escuela Operativa", path: "/arki-operations" },
  { icon: Workflow, label: "ARKI · Parametric Runtime", path: "/arki-parametric-runtime" },
  { icon: Sparkles, label: "ARKI · Generador Paramétrico", path: "/arki-generator" },
  { icon: MapPin, label: "ARKI · Field Mode", path: "/field" },
  { icon: Network, label: "ARKI · Control Center", path: "/control-center" },
  { icon: ShieldAlert, label: "ARKI · Security Events", path: "/security-events" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
  showSidebar = true,
  compactHeader = false,
  hideBrand = false,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
  compactHeader?: boolean;
  hideBrand?: boolean;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user && !TEMPORARY_DIRECT_ACCESS) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              {t("gate.sign_in_continue")}
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {t("gate.auth_required")}
            </p>
          </div>
          <Button
            onClick={() => startLogin()}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            {t("gate.sign_in")}
          </Button>
          <a href="/spatial?mode=3d" className="text-sm font-medium text-primary underline-offset-4 hover:underline">Ver el proyecto espacial</a>
        </div>
      </div>
    );
  }

    return (
      <div className="arki-shell min-h-screen">
      {TEMPORARY_DIRECT_ACCESS && <div role="status" className="border-b border-[#f0a35b]/30 bg-[#f0a35b]/10 px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-[#f6c995]">MODO DE ACCESO DIRECTO TEMPORAL · autenticación real conservada en el backend</div>}
      <AppHeader compact={compactHeader} hideBrand={hideBrand} />
      <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth} showSidebar={showSidebar}>
        {children}
      </DashboardLayoutContent>
      </SidebarProvider>
      </div>
    );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
  showSidebar: boolean;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
  showSidebar,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      {showSidebar && <div className="relative" ref={sidebarRef}>
          <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center bg-[#0d1d2c]">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label={t("gate.toggle_navigation")}
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold tracking-tight truncate">
                    {t("gate.navigation")}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="px-2 pt-2 group-data-[collapsible=icon]:hidden">
              <LanguageSelector />
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={t(item.label)}
                    className={`h-10 rounded-[5px] transition-all font-normal ${isActive ? "bg-[#d4ff3a] text-[#07121e] hover:bg-[#e3ff72] data-[active=true]:bg-[#d4ff3a] data-[active=true]:text-[#07121e]" : "text-[#b9cbd6] hover:bg-[#102538] hover:text-white"}`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                      />
                      <span>{t(item.label)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("gate.sign_out")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>}

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem ? t(activeMenuItem.label) : t("nav.project")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </>
  );
}
