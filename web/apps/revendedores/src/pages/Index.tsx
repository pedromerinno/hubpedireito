import { useEffect, useRef } from "react";
import { HubHero } from "@/components/hub/HubHero";
import { PeriodoFundadorBanner } from "@/components/hub/PeriodoFundadorBanner";
import { PortasGrid } from "@/components/hub/PortasGrid";
import { QuizPortas } from "@/components/hub/QuizPortas";
import { SiteFooter } from "@/components/SiteFooter";
import { captureOrigem } from "@/lib/origem";

const Index = () => {
  const portasRef = useRef<HTMLElement>(null);

  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Caminhe com a gente";
  }, []);

  function scrollToPortas() {
    portasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HubHero onSeePortas={scrollToPortas} />
      <PeriodoFundadorBanner />
      <PortasGrid ref={portasRef} id="portas" />
      <QuizPortas />
      <SiteFooter />
    </div>
  );
};

export default Index;
