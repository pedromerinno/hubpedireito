import { useEffect } from "react";
import { FormShell } from "@/components/forms/FormShell";
import { CasamentoForm } from "@/components/forms/CasamentoForm";
import { captureOrigem } from "@/lib/origem";
import { getPorta } from "@/lib/portas";

const Casamento = () => {
  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Casamento";
  }, []);

  const porta = getPorta("casamento");

  return (
    <FormShell
      porta={porta}
      manifesto="A porta do casamento é a que entra no dia mais importante de uma vida. Pé Direito vai com a galera nos pés, seja como presente pros padrinhos, seja como conforto pra dançar até o sol nascer. A gente caminha junto no que importa."
    >
      <CasamentoForm />
    </FormShell>
  );
};

export default Casamento;
