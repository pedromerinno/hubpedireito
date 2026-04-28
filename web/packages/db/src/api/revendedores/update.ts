import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabaseAdmin } from "../../server";
import type { Revendedor } from "../../types";

interface UpdatePayload {
  id: number;
  data: Partial<Omit<Revendedor, "id" | "created_at">>;
}

export function createUpdateRevendedorHandler() {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Método não permitido" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return res.status(500).json({ error: "Configuração do Supabase ausente" });
    }

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

    const payload = req.body as UpdatePayload;
    if (!payload?.id || !payload?.data) {
      return res.status(400).json({ error: "ID e dados são obrigatórios" });
    }

    const { error } = await supabase
      .from("revendedores")
      .update({
        ...payload.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id);

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ error: "Erro ao atualizar revendedor" });
    }

    return res.status(200).json({ success: true });
  };
}

export default createUpdateRevendedorHandler();
