import { Link } from "react-router-dom";
import { useCountdown } from "@/hooks/useCountdown";
import { CountdownTimer } from "@/components/CountdownTimer";
import { PreparationChecklist } from "@/components/PreparationChecklist";
import { UrgencySection } from "@/components/UrgencySection";
import { Button } from "@/components/ui/button";
import pedireitoLogo from "@/assets/pedireito-logo.svg";

const Index = () => {
  const { timeLeft, isExpired } = useCountdown();

  const handleCtaClick = () => {
    if (isExpired) {
      window.location.href = "https://www.usepedireito.com.br";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary py-8 px-6 sm:px-8">
        <div className="max-w-[600px] mx-auto text-center">
          <img 
            src={pedireitoLogo} 
            alt="Pé Direito" 
            className="h-8 sm:h-9 mx-auto brightness-0 invert"
          />
          <p className="text-xs sm:text-sm text-primary-foreground/70 mt-3 tracking-wide">
            Ditado Popular. Identidade Brasileira. Liberdade de Escolha.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-muted">
        <div className="max-w-[672px] mx-auto px-6 sm:px-8 py-14 sm:py-16 space-y-8">
          {/* Countdown Section */}
          <section className="bg-[#2B9402] rounded-xl p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-2">
              O Carrinho Abre em Breve
            </h2>
            <p className="text-sm sm:text-base text-primary-foreground/80 mb-6">
              10.000 unidades. 50.000 pessoas na fila. Não perca o horário.
            </p>
            
            <CountdownTimer timeLeft={timeLeft} />
          </section>

          {/* CTA Button */}
          <section className="text-center space-y-3">
            <Button
              onClick={handleCtaClick}
              disabled={!isExpired}
              className={`w-full max-w-md py-6 text-base font-semibold transition-all ${
                isExpired
                  ? "bg-success hover:bg-success/90 text-success-foreground"
                  : "bg-muted-foreground/30 text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isExpired
                ? "CARRINHO ABERTO - CLIQUE AQUI"
                : "Carrinho Abre Segunda às 9h"}
            </Button>
            <p className="text-xs text-muted-foreground">
              {isExpired
                ? "Corra! As unidades são limitadas."
                : "Este botão ficará ativo no horário de abertura"}
            </p>
          </section>

          {/* Preparation Checklist */}
          <PreparationChecklist />

          {/* Urgency Section */}
          <UrgencySection />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-10 px-6 sm:py-12 sm:px-8 border-t border-border">
        <div className="max-w-[600px] mx-auto text-center space-y-4">
          <div className="flex justify-center gap-6 text-sm">
            <Link
              to="/"
              className="text-success/80 hover:text-success font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/faq"
              className="text-success/80 hover:text-success font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/faq#suporte"
              className="text-success/80 hover:text-success font-medium transition-colors"
            >
              Suporte
            </Link>
          </div>
          <p className="text-xs text-success/70">
            Horário de Brasília. Sem prorrogação.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
