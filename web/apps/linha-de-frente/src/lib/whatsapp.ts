// Link único de entrada nos grupos (roteado via Zenhub).
// Todos os CTAs/ícones de "WhatsApp" da LP redirecionam pra cá.
const FALLBACK = "https://www.zenhub.pro/join/pedireito";

export const whatsappInviteUrl =
  import.meta.env.VITE_WHATSAPP_INVITE_URL || FALLBACK;

// Abre o link em nova aba e mantém o usuário na LP.
export function joinWhatsAppGroup() {
  window.open(whatsappInviteUrl, "_blank", "noopener,noreferrer");
}
