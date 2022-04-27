import { usuarioModel } from "./../../src/models/usuarioModel";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import { validarTokenJWT } from "../../src/middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";

const usuarioEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg>
) => {
  try {
    const { userId } = req?.query;
    const usuario = await usuarioModel.findById(userId);
    usuario.senha = null;
    return res.status(200).json(usuario);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ error: "Não foi possível obter dados do usuário" });
  }
};

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));
