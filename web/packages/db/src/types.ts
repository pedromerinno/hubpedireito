export type RevendedorStatus = "pendente" | "aprovado" | "rejeitado";

export interface Revendedor {
  id: number;
  nome_completo: string;
  empresa_loja: string | null;
  cnpj: string | null;
  cidade_estado: string;
  telefone_whatsapp: string;
  email: string | null;
  site: string | null;
  instagram_redes: string | null;
  tempo_mercado: string | null;
  entende_proposito: string | null;
  vende_calcados_vestuario: string | null;
  forma_venda: string | null;
  o_que_chamou_atencao: string | null;
  segue_padroes_marca: string | null;
  pares_por_mes: string | null;
  pares_por_mes_num: number | null;
  status: RevendedorStatus;
  created_at: string;
  updated_at: string | null;
}

export interface RevendedorFormPayload {
  nomeCompleto: string;
  empresaLoja?: string;
  cnpj?: string;
  cidadeEstado: string;
  telefoneWhatsapp: string;
  email?: string;
  site?: string;
  instagramRedes?: string;
  tempoMercado?: string;
  entendeProposito?: string;
  vendeCalcadosVestuario?: string;
  formaVenda?: string;
  oQueChamouAtencao?: string;
  seguePadroesMarca?: string;
  paresPorMes?: string;
}
