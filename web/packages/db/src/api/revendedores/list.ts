import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../../server";

export interface ListRevendedoresOptions {
  /** Permite requisições sem Authorization (use apenas para endpoints internos). Default: false. */
  allowAnonymous?: boolean;
}

export function createListRevendedoresHandler(options: ListRevendedoresOptions = {}) {
  const { allowAnonymous = false } = options;

  return async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Método não permitido" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return res.status(500).json({ error: "Configuração do Supabase ausente" });
    }

    if (!allowAnonymous) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
      }
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
      }
    }

    const { status, search, page = "1", pageSize = "10" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSizeNum = parseInt(pageSize as string, 10) || 10;
    const from = (pageNum - 1) * pageSizeNum;
    const to = from + pageSizeNum - 1;

    let query = supabase.from("revendedores").select("*", { count: "exact" });

    if (status && status !== "todos") {
      query = query.eq("status", status);
    }
    if (search) {
      query = query.or(
        `nome_completo.ilike.%${search}%,empresa_loja.ilike.%${search}%,cidade_estado.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query
      .order("pares_por_mes_num", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ error: "Erro ao buscar revendedores" });
    }

    return res.status(200).json({
      data: data || [],
      count: count || 0,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil((count || 0) / pageSizeNum),
    });
  };
}

export default createListRevendedoresHandler();
