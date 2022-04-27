import { publicacaoModel } from "./../../src/models/publicacaoModel";
import { usuarioModel } from "./../../src/models/usuarioModel";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import { validarTokenJWT } from "../../src/middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";

const feedEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg | any>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuario = await usuarioModel.findById(req?.query?.id);
        if (!usuario) {
          return res.status(400).json({ error: "Usuario nao encontrado" });
        }
        const publicacoes = await publicacaoModel
          .find({
            idUsuario: usuario._id
          })
          .sort({ data: -1 });
        return res.status(200).json(publicacoes);
      }
    }
    return res.status(405).json({ error: "Método informado inválido" });
  } catch (e) {
    console.log(e);
  }
  return res.status(400).json({ error: "Não foi possível obter o feed!" });
};

export default validarTokenJWT(conectarMongoDB(feedEndpoint));
