export interface Origem {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPath?: string;
}

const STORAGE_KEY = "pd_origem";

function readStorage(): Origem | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Origem) : null;
  } catch {
    return null;
  }
}

function writeStorage(origem: Origem) {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(origem));
  } catch {
    // sessionStorage indisponível, ignora silenciosamente
  }
}

/**
 * Captura uma vez por sessão: UTMs da URL atual + referrer + landing path.
 * Persistido em sessionStorage pra sobreviver navegação entre páginas internas.
 */
export function captureOrigem(): Origem {
  if (typeof window === "undefined") return {};
  const cached = readStorage();
  if (cached) return cached;

  const params = new URLSearchParams(window.location.search);
  const origem: Origem = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    referrer: document.referrer || undefined,
    landingPath: window.location.pathname || undefined,
  };

  writeStorage(origem);
  return origem;
}

export function getOrigem(): Origem {
  return readStorage() ?? captureOrigem();
}
