import { Link } from "react-router-dom";
import { Instagram, MessageCircle } from "lucide-react";
import pedireitoLogo from "@/assets/pedireito-logo.svg";
import { whatsappInviteUrl } from "@/lib/whatsapp";

interface SiteFooterProps {
  /**
   * Linha curta de tagline abaixo do logo na coluna da marca.
   * Default: "A marca do povo brasileiro." (posicionamento da marca).
   */
  tagline?: string;
}

const headingCls =
  "font-semibold text-[#FEBF00] text-xs uppercase tracking-[0.18em] mb-5";

const linkCls =
  "text-[#F9F1D1] text-sm hover:text-[#FEBF00] transition-colors";

const socialCls = "text-[#FEBF00] hover:text-white transition-colors";

// Lucide não tem ícone oficial de TikTok. SVG inline minimalista pra manter
// a marca da rede. Mantém currentColor pra herdar o tom do link.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.62a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.84Z" />
    </svg>
  );
}

export function SiteFooter({
  tagline = "A marca do povo brasileiro.",
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B6200]" aria-label="Rodapé do site">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">
          {/* COL 1 · Marca */}
          <div>
            <Link to="/" aria-label="Pé Direito · home" className="inline-block">
              <img
                src={pedireitoLogo}
                alt="Pé Direito"
                className="h-8 sm:h-10 w-auto"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(442%) hue-rotate(355deg) brightness(101%) contrast(94%)",
                }}
              />
            </Link>
            {tagline && (
              <p className="text-[#FEBF00]/85 text-sm leading-relaxed mt-4 max-w-xs">
                {tagline}
              </p>
            )}
          </div>

          {/* COL 2 · Navegação */}
          <nav aria-label="Navegação do rodapé">
            <h2 className={headingCls}>Navegação</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={linkCls}>
                  Hub
                </Link>
              </li>
              <li>
                <Link to="/franquia" className={linkCls}>
                  Franquia
                </Link>
              </li>
              <li>
                <Link to="/representante" className={linkCls}>
                  Representante
                </Link>
              </li>
              <li>
                <Link to="/revendedor" className={linkCls}>
                  Revendedor
                </Link>
              </li>
              <li>
                <Link to="/investidor" className={linkCls}>
                  Investidor
                </Link>
              </li>
              <li>
                <Link to="/patrocinador" className={linkCls}>
                  Patrocinador
                </Link>
              </li>
              <li>
                <Link to="/casamento" className={linkCls}>
                  Casamento
                </Link>
              </li>
            </ul>
          </nav>

          {/* COL 3 · Suporte & Legal */}
          <nav aria-label="Suporte e links legais">
            <h2 className={headingCls}>Suporte</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className={linkCls}>
                  FAQ
                </Link>
              </li>
              <li>
                <a href="/faq#suporte" className={linkCls}>
                  Fale com a gente
                </a>
              </li>
              <li>
                <Link to="/termos" className={linkCls}>
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className={linkCls}>
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </nav>

          {/* COL 4 · Conecta */}
          <div>
            <h2 className={headingCls}>Conecta com a gente</h2>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/usepedireito__"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do Pé Direito"
                className={socialCls}
              >
                <Instagram className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
              <a
                href="https://www.tiktok.com/@usepedireito"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok do Pé Direito"
                className={socialCls}
              >
                <TikTokIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
              <a
                href={whatsappInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Grupo de WhatsApp do Pé Direito"
                className={socialCls}
              >
                <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-[#FEBF00]/15 my-10 sm:my-12" />

        {/* Linha de fechamento */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-[#F9F1D1]/70 text-xs">
            © {year} Pé Direito. Todos os direitos reservados.
          </p>
          <p className="text-[#F9F1D1]/70 text-xs uppercase tracking-[0.18em]">
            Período Fundador
          </p>
        </div>
      </div>
    </footer>
  );
}
