import type { LucideIcon } from "lucide-react";
import { Store, Briefcase, ShoppingBag, Coins, Handshake } from "lucide-react";

export type PortaId =
  | "franquia"
  | "representante"
  | "revendedor"
  | "investidor"
  | "patrocinador";

export interface PortaTheme {
  /** bg do card (paleta da marca) */
  bg: string;
  /** texto principal do card */
  fg: string;
  /** acento (borda hover, badge) */
  accent: string;
  /** fundo do ícone */
  iconBg: string;
  /** cor do ícone */
  iconFg: string;
}

export interface Porta {
  id: PortaId;
  /** Nome curto (Anton-style, lowercase no display) */
  nome: string;
  /** Frase de definição (1 linha, máx ~80 chars) */
  definicao: string;
  /** Para quem é (subline) */
  paraQuem: string;
  /** Rota da página individual */
  rota: string;
  /** Ícone Lucide (uso restrito ao hub/forms web, não vale no carrossel) */
  icone: LucideIcon;
  /** Tema visual do card */
  tema: PortaTheme;
  /** CTA dentro do card */
  cta: string;
  /** Vídeo de fundo do hero da página single (em /public/videos/) */
  videoUrl?: string;
}

export const PORTAS: Porta[] = [
  {
    id: "franquia",
    nome: "franquia",
    definicao: "Você abre uma casa da Pé Direito na sua cidade.",
    paraQuem: "Empresários com capital e visão de operação física.",
    rota: "/franquia",
    icone: Store,
    cta: "Quero entrar por aqui",
    videoUrl: "/videos/drone-mar-brasil.mp4",
    // p-azul: azul bg + amarelo fg (combo de alto impacto)
    tema: {
      bg: "#005CE1",
      fg: "#FEBF00",
      accent: "#F9F1D1",
      iconBg: "#FEBF00",
      iconFg: "#005CE1",
    },
  },
  {
    id: "representante",
    nome: "representante",
    definicao: "Você leva a Pé Direito pro varejo brasileiro.",
    paraQuem: "Representantes comerciais B2B com carteira ativa de lojas.",
    rota: "/representante",
    icone: Briefcase,
    cta: "Quero entrar por aqui",
    videoUrl: "/videos/barco-gratidao.mp4",
    tema: {
      bg: "#2B9402",
      fg: "#FEBF00",
      accent: "#F9F1D1",
      iconBg: "#FEBF00",
      iconFg: "#2B9402",
    },
  },
  {
    id: "revendedor",
    nome: "revendedor",
    definicao: "Você vende pra quem está perto de você.",
    paraQuem: "Microempreendedores, lojistas pequenos, vendedores sociais.",
    rota: "/revendedor",
    icone: ShoppingBag,
    cta: "Quero entrar por aqui",
    videoUrl: "/videos/arara-tropical.mp4",
    tema: {
      bg: "#FEBF00",
      fg: "#2B9402",
      accent: "#005CE1",
      iconBg: "#2B9402",
      iconFg: "#FEBF00",
    },
  },
  {
    id: "investidor",
    nome: "investidor",
    definicao: "Você acredita na tese e aporta capital.",
    paraQuem: "Investidores qualificados (anjo, PE, family office).",
    rota: "/investidor",
    icone: Coins,
    cta: "Quero entrar por aqui",
    videoUrl: "/videos/drone-mar-brasil.mp4",
    // bg branco + fg azul, vibe institucional pra essa porta
    tema: {
      bg: "#FFFFFF",
      fg: "#005CE1",
      accent: "#2B9402",
      iconBg: "#005CE1",
      iconFg: "#FFFFFF",
    },
  },
  {
    id: "patrocinador",
    nome: "patrocinador",
    definicao: "Sua marca caminha junto da nossa.",
    paraQuem: "Empresas com sinergia estratégica e orçamento de patrocínio.",
    rota: "/patrocinador",
    icone: Handshake,
    cta: "Quero entrar por aqui",
    videoUrl: "/videos/barco-gratidao.mp4",
    // bg branco + fg verde, vibe institucional (parceria corporativa)
    tema: {
      bg: "#FFFFFF",
      fg: "#2B9402",
      accent: "#FEBF00",
      iconBg: "#2B9402",
      iconFg: "#FFFFFF",
    },
  },
];

export function getPorta(id: PortaId): Porta {
  const porta = PORTAS.find((p) => p.id === id);
  if (!porta) throw new Error(`Porta não encontrada: ${id}`);
  return porta;
}
