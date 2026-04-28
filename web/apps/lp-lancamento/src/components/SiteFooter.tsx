import { Link } from "react-router-dom";
import { Instagram, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { whatsappInviteUrl } from "@/lib/whatsapp";

interface SiteFooterProps {
  /**
   * Quando true, exibe o aviso "Horário de Brasília. Sem prorrogação." na linha
   * de fechamento. Use em páginas de pré-lançamento (Index, BoasVindas).
   * Default: false.
   */
  showLaunchDisclaimer?: boolean;
  /**
   * Linha curta de tagline abaixo do logo na coluna da marca.
   * Default: "A marca do povo brasileiro." — posicionamento da marca,
   * não categoria de produto (a marca não é "o chinelo brasileiro").
   */
  tagline?: string;
}

const headingCls =
  "font-narrow font-semibold text-amarelo text-xs uppercase mb-5";

const linkCls =
  "font-narrow text-cream text-sm hover:text-amarelo transition-colors";

const socialCls =
  "text-amarelo hover:text-white transition-colors";

// Lucide não tem ícone oficial de TikTok — SVG inline minimalista pra manter
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
  showLaunchDisclaimer = false,
  tagline = "A marca do povo brasileiro.",
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-verde-escuro" aria-label="Rodapé do site">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">
          {/* COL 1 — Marca */}
          <div>
            <Link to="/" aria-label="Pé Direito · home" className="inline-block">
              <BrandLogo className="h-8 sm:h-10 brightness-0 invert opacity-100" />
            </Link>
            {tagline && (
              <p className="font-narrow text-amarelo/85 text-sm leading-relaxed mt-4 max-w-xs">
                {tagline}
              </p>
            )}
          </div>

          {/* COL 2 — Navegação */}
          <nav aria-label="Navegação do rodapé">
            <h2 className={headingCls}>Navegação</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={linkCls}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/faq" className={linkCls}>
                  FAQ
                </Link>
              </li>
              <li>
                <a href="/faq#suporte" className={linkCls}>
                  Suporte
                </a>
              </li>
              <li>
                <a href="/#inscricao" className={linkCls}>
                  Lançamento
                </a>
              </li>
            </ul>
          </nav>

          {/* COL 3 — Legal */}
          <nav aria-label="Links legais">
            <h2 className={headingCls}>Legal</h2>
            <ul className="space-y-3">
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

          {/* COL 4 — Conecta */}
          <div>
            <h2 className={headingCls}>Conecta com a gente</h2>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/pedireito"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do Pé Direito"
                className={socialCls}
              >
                <Instagram className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
              <a
                href="https://tiktok.com/@pedireito"
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
        <hr className="border-t border-amarelo/15 my-10 sm:my-12" />

        {/* Linha de fechamento */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="font-narrow text-cream/70 text-xs">
            © {year} Pé Direito. Todos os direitos reservados.
          </p>
          {showLaunchDisclaimer && (
            <p className="font-narrow text-cream/70 text-xs">
              Horário de Brasília. Sem prorrogação.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
