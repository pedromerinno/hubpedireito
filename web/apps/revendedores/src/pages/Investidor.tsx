import { useEffect } from "react";
import { FormShell } from "@/components/forms/FormShell";
import { InvestidorForm } from "@/components/forms/InvestidorForm";
import { captureOrigem } from "@/lib/origem";
import { getPorta } from "@/lib/portas";

const Investidor = () => {
  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Investidor";
  }, []);

  const porta = getPorta("investidor");

  return (
    <FormShell
      porta={porta}
      manifesto="A porta do investidor é a tese antes da rua. É pra quem acredita no que a Pé Direito é capaz de construir nos próximos 10 anos, e aporta capital pra acelerar a caminhada."
    >
      <InvestidorForm />
    </FormShell>
  );
};

export default Investidor;
