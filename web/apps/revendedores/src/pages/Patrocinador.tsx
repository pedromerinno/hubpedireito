import { useEffect } from "react";
import { FormShell } from "@/components/forms/FormShell";
import { PatrocinadorForm } from "@/components/forms/PatrocinadorForm";
import { captureOrigem } from "@/lib/origem";
import { getPorta } from "@/lib/portas";

const Patrocinador = () => {
  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Patrocinador";
  }, []);

  const porta = getPorta("patrocinador");

  return (
    <FormShell
      porta={porta}
      manifesto="A porta do patrocinador é onde marcas com sinergia caminham junto da Pé Direito. Em campanhas, conteúdo, eventos e ativações que somam. Não só assinam."
    >
      <PatrocinadorForm />
    </FormShell>
  );
};

export default Patrocinador;
