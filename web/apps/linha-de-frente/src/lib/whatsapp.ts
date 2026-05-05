const FALLBACK = "https://chat.whatsapp.com/";

export const whatsappInviteUrl =
  import.meta.env.VITE_WHATSAPP_INVITE_URL || FALLBACK;

// Abre o convite do WhatsApp em nova aba e mantém o usuário na LP.
// O parâmetro `redirectTo` foi mantido só pra não quebrar call sites antigos.
export function joinWhatsAppGroup(_redirectTo?: string) {
  window.open(whatsappInviteUrl, "_blank", "noopener,noreferrer");
}
