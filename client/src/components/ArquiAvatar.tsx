import React from "react";

type Props = { size?: "sm" | "md"; state?: "ready" | "attention" | "unknown" | "complete"; className?: string };

const stateColors = {
  ready: "bg-emerald-500",
  attention: "bg-amber-400",
  unknown: "bg-slate-400",
  complete: "bg-sky-400",
} as const;

export default function ArquiAvatar({ size = "md", state = "ready", className = "" }: Props) {
  const dimension = size === "sm" ? "h-10 w-10" : "h-14 w-14";
  return <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-[#f4f1ea] ${dimension} ${className}`} aria-label="ARQUI" data-testid="arqui-avatar">
    <span className="absolute left-[18%] right-[18%] top-[10%] h-[36%] rounded-[55%_55%_42%_42%] border-2 border-[#d9dde0] bg-white shadow-sm" aria-hidden="true" />
    <span className="absolute left-[14%] right-[14%] top-[35%] h-[31%] rounded-[42%] bg-[#252b31] shadow-inner" aria-hidden="true"><span className="absolute left-[24%] top-[31%] h-[22%] w-[18%] rounded-full bg-[#f9d24a]" /><span className="absolute right-[24%] top-[31%] h-[22%] w-[18%] rounded-full bg-[#f9d24a]" /></span>
    <span className="absolute bottom-[8%] left-[26%] right-[26%] h-[29%] rounded-[42%_42%_30%_30%] bg-[#f2c300]" aria-hidden="true" />
    <span className="absolute bottom-[20%] left-1/2 h-[11%] w-[22%] -translate-x-1/2 rounded-sm border border-[#6b5610]" aria-hidden="true" />
    <span className={`absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#f4f1ea] ${stateColors[state]}`} aria-hidden="true" />
  </span>;
}

export { stateColors };
