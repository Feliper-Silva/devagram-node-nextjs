import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import md5 from "md5";
import { usuarioModel } from "../../src/models/usuarioModel";

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg>
) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;
    const usuarioEncontrados = await usuarioModel.find({
      email: login,
      senha: md5(senha)
    });

    if (usuarioEncontrados && usuarioEncontrados.length > 0) {
      const usuarioEncontrado = usuarioEncontrados[0];
      return res.status(200).json({
        msg: `Usuário: ${usuarioEncontrado.nome}, autenticado com sucesso !`
      });
    } else {
      return res.status(400).json({ error: "Usuário ou senha não encontrado" });
    }
  }
  return res.status(405).json({ error: "Método informado não e válido" });
};

export default conectarMongoDB(endpointLogin);
