import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostasPadraoMsg } from "../types/respostaPadraoMsg";
import NextCors from "nextjs-cors";

export const politicaCORS =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        methods: ["GET", "PUT", "POST"],
        origin: "*",
        optionsSuccessStatus: 200
      });
      return handler(req, res);
    } catch (error) {
      console.log("Erro ao tratar politica de CORS", error);
      return res.status(500).json({ error: "Erro ao tratar politica de CORS" });
    }
  };
