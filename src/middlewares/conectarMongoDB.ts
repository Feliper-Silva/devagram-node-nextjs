import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import type { RespostasPadraoMsg } from "../types/respostaPadraoMsg";

export const conectarMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMsg>) => {
    //verificar s eo banco está conectado, se estiver seguir para o endpoint

    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    // já que não esta conectado vamos conectar
    // obter a variavel de ambiente preenchida do env
    const { DB_CONEXAO_STRING } = process.env;

    // se o env estiver vazia aborta o uso do sistema e avisa o programador
    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ error: "ENV  de configuração de banco, não informado" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Banco de dados Conectado")
    );
    mongoose.connection.on("error", error =>
      console.log("Ocorreu erro ao conectar no banco de dados")
    );
    await mongoose.connect(DB_CONEXAO_STRING);

    //Agora posso seguir para o endpoint, pois estou conectado
    //no banco
    return handler(req, res);
  };
