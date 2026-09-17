import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundaryInner extends Component<Props & { labels: { unexpected: string; reload: string } }, State> {
  constructor(props: Props & { labels: { unexpected: string; reload: string } }) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div className="flex min-h-screen items-center justify-center bg-background p-8"><div className="flex w-full max-w-2xl flex-col items-center p-8"><AlertTriangle size={48} className="mb-6 flex-shrink-0 text-destructive" /><h2 className="mb-4 text-xl">{this.props.labels.unexpected}</h2><div className="mb-6 w-full overflow-auto rounded bg-muted p-4"><pre className="whitespace-break-spaces text-sm text-muted-foreground">{this.state.error?.stack}</pre></div><button onClick={() => window.location.reload()} className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2", "bg-primary text-primary-foreground", "hover:opacity-90")}><RotateCcw size={16} />{this.props.labels.reload}</button></div></div>;
    return this.props.children;
  }
}

export default function ErrorBoundary({ children }: Props) {
  const { t } = useTranslation();
  return <ErrorBoundaryInner labels={{ unexpected: t("gate.unexpected_error"), reload: t("gate.reload_page") }}>{children}</ErrorBoundaryInner>;
}
