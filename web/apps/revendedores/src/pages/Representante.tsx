import { useEffect } from "react";
import { FormShell } from "@/components/forms/FormShell";
import { RepresentanteForm } from "@/components/forms/RepresentanteForm";
import { captureOrigem } from "@/lib/origem";
import { getPorta } from "@/lib/portas";

const Representante = () => {
  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Representante comercial";
  }, []);

  const porta = getPorta("representante");

  return (
    <FormShell
      porta={porta}
      manifesto="A porta do representante é a que abre o varejo brasileiro pra Pé Direito. Quem entra por aqui leva a marca pras lojas que vão receber, vender e devolver pra fila. Sandália por sandália."
    >
      <RepresentanteForm />
    </FormShell>
  );
};

export default Representante;
