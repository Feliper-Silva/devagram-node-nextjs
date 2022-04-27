import { usuarioModel } from "./../../src/models/usuarioModel";
import { conectarMongoDB } from "./../../src/middlewares/conectarMongoDB";
import { validarTokenJWT } from "./../../src/middlewares/validarTokenJWT";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";

const pesquisaEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg | any[]>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuarioEncontrado = await usuarioModel.findById(req?.query?.id);
        if (!usuarioEncontrado) {
          return res.status(400).json({ error: "Usuário não encontrado!" });
        }
        usuarioEncontrado.senha = null;
        return res.status(200).json(usuarioEncontrado);
      } else {
        const { filtro } = req.query;
        if (!filtro || filtro.length < 2) {
          return res
            .status(400)
            .json({ error: "Por favor informar pelo menos 2 caracteres" });
        }
        const usuariosEncontrados = await usuarioModel.find({
          $or: [
            { nome: { $regex: filtro, $options: "i" } },
            { email: { $regex: filtro, $options: "i" } }
          ]
        });
        usuariosEncontrados.forEach(userFound => {
          userFound.senha = null;
        });
        return res.status(200).json(usuariosEncontrados);
      }
    }
    return res.status(405).json({ error: "Método informado não é válido!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Não foi possível buscar usuário" });
  }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
