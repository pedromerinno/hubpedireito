import { useEffect } from "react";
import { FormShell } from "@/components/forms/FormShell";
import { FranquiaForm } from "@/components/forms/FranquiaForm";
import { captureOrigem } from "@/lib/origem";
import { getPorta } from "@/lib/portas";

const Franquia = () => {
  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Franquia";
  }, []);

  const porta = getPorta("franquia");

  return (
    <FormShell
      porta={porta}
      manifesto="A franquia Pé Direito é a porta de quem quer ser o rosto da marca na sua cidade. Operação física, time, vitrine. Responsabilidade de carregar o nome no chão."
    >
      <FranquiaForm />
    </FormShell>
  );
};

export default Franquia;
