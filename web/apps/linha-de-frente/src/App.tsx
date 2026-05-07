import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import FaqSuporte from "./pages/FaqSuporte";
import NotFound from "./pages/NotFound";
import { LeadModalProvider } from "@/lib/leadModal";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { trackPageView } from "@/lib/metaPixel";

const queryClient = new QueryClient();

// Dispara Meta Pixel PageView a cada mudança de rota (SPA).
// O PageView do load inicial já vem do snippet em index.html, então o
// primeiro effect é pulado pra não duplicar. Cobre só as transições
// subsequentes (/ → /faq, etc) que o React Router faz client-side.
function RouteTracker() {
  const location = useLocation();
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackPageView();
  }, [location.pathname, location.search]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteTracker />
        <LeadModalProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/faq" element={<FaqSuporte />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <LeadCaptureModal />
        </LeadModalProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
