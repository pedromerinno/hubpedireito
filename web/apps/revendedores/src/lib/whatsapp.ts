const FALLBACK = "https://chat.whatsapp.com/";

export const whatsappInviteUrl =
  import.meta.env.VITE_WHATSAPP_INVITE_URL || FALLBACK;
