const FALLBACK = "https://chat.whatsapp.com/";

export const whatsappInviteUrl =
  import.meta.env.VITE_WHATSAPP_INVITE_URL || FALLBACK;

export function joinWhatsAppGroup(redirectTo = "/boas-vindas") {
  window.open(whatsappInviteUrl, "_blank", "noopener,noreferrer");
  setTimeout(() => {
    window.location.assign(redirectTo);
  }, 200);
}
