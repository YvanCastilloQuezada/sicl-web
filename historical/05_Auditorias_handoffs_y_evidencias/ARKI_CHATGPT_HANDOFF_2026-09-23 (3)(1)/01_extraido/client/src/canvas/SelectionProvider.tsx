import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { emptySelection, multipleSelection, singleSelection, type BimSelection, type BimSelectionItem } from "@shared/arkiBimSelection";

type SelectionContextValue = { selection: BimSelection; select: (item: BimSelectionItem, additive?: boolean) => void; clear: () => void };
const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BimSelection>(() => emptySelection());
  const clear = useCallback(() => setSelection(emptySelection()), []);
  const select = useCallback((item: BimSelectionItem, additive = false) => {
    setSelection((current) => {
      if (!additive) return singleSelection(item);
      const exists = current.items.some((candidate) => candidate.elementId === item.elementId);
      const next = exists ? current.items.filter((candidate) => candidate.elementId !== item.elementId) : [...current.items, item];
      return multipleSelection(next);
    });
  }, []);
  const value = useMemo(() => ({ selection, select, clear }), [selection, select, clear]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useBimSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useBimSelection must be used inside SelectionProvider");
  return context;
}
