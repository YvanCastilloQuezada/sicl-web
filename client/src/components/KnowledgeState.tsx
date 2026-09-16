import { cn } from "@/lib/utils";
export default function KnowledgeState({ state }: { state: string }) {
  const value = state.toUpperCase();
  const tone = value === "OBSERVED" ? "bg-green-100 text-green-800" : value === "CONFLICTING" ? "bg-red-100 text-red-800" : value === "INSUFFICIENT" ? "bg-yellow-100 text-yellow-900" : "bg-gray-100 text-gray-700";
  return <span className={cn("inline-block px-2 py-1 text-xs font-medium", tone)}>{value}</span>;
}
