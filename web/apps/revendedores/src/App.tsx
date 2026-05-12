import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Revendedor from "./pages/Revendedor";
import Franquia from "./pages/Franquia";
import Representante from "./pages/Representante";
import Investidor from "./pages/Investidor";
import Patrocinador from "./pages/Patrocinador";
import FaqSuporte from "./pages/FaqSuporte";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/revendedor" element={<Revendedor />} />
          <Route path="/franquia" element={<Franquia />} />
          <Route path="/representante" element={<Representante />} />
          <Route path="/investidor" element={<Investidor />} />
          <Route path="/patrocinador" element={<Patrocinador />} />
          <Route path="/faq" element={<FaqSuporte />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
