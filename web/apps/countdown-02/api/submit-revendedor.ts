import { createSubmitRevendedorHandler } from "@pedireito/db/api/submit-revendedor";

export default createSubmitRevendedorHandler({
  requireEmail: true,
  requireSite: true,
  requireInstagram: true,
});
