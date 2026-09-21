import { lazy, Suspense } from "react";

const UPAO001SpatialViewer = lazy(() => import("@/components/UPAO001SpatialViewer"));

export default function SpatialViewerPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<div role="status" className="rounded border border-border bg-card p-8 text-card-foreground">Loading 3D viewer…</div>}>
          <UPAO001SpatialViewer />
        </Suspense>
      </div>
    </main>
  );
}
