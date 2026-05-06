import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface LeadModalCtx {
  isOpen: boolean;
  open: (source?: string) => void;
  close: () => void;
  source: string;
}

const Ctx = createContext<LeadModalCtx | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [source, setSource] = useState("cta-default");

  const open = useCallback((s: string = "cta-default") => {
    setSource(s);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close, source }),
    [isOpen, open, close, source],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLeadModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeadModal precisa estar dentro de LeadModalProvider");
  return ctx;
}
