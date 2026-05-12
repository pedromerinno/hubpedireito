import { useEffect } from "react";
import { FormShell } from "@/components/forms/FormShell";
import { RevendedorForm } from "@/components/forms/RevendedorForm";
import { captureOrigem } from "@/lib/origem";
import { getPorta } from "@/lib/portas";

const Revendedor = () => {
  useEffect(() => {
    captureOrigem();
    document.title = "Pé Direito | Revendedor";
  }, []);

  const porta = getPorta("revendedor");

  return (
    <FormShell
      porta={porta}
      manifesto="A porta do revendedor é a mais larga e a mais próxima. É pra quem vende pra quem está perto: bairro, igreja, comunidade, redes. O começo de quase todo dono de negócio brasileiro."
    >
      <RevendedorForm />
    </FormShell>
  );
};

export default Revendedor;
