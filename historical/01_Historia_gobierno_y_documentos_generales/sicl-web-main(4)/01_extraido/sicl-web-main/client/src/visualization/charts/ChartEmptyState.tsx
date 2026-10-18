import React from "react";

type Props = { message?: string };

export default function ChartEmptyState({ message = "Sin datos para visualizar" }: Props) {
  return <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#b9c4bd] bg-[#f7f7f1] p-6 text-sm text-[#718078]">{message}</div>;
}
