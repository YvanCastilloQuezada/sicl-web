import React from "react";

type CoreTableSkeletonProps = {
  columns: number;
  rows?: number;
};

export default function CoreTableSkeleton({ columns, rows = 4 }: CoreTableSkeletonProps) {
  return (
    <div role="status" aria-label="Cargando datos del Core" className="animate-pulse space-y-3 p-4">
      <span className="sr-only">Cargando datos del Core</span>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((__, column) => (
            <div key={column} className="h-4 rounded bg-muted" aria-hidden="true" />
          ))}
        </div>
      ))}
    </div>
  );
}
