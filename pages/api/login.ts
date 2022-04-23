import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import type { loginResposta } from "../../src/types/loginResposta";
import md5 from "md5";
import { usuarioModel } from "../../src/models/usuarioModel";
import jwt from "jsonwebtoken";

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg | loginResposta>
) => {
  const { MINHA_CHAVE_JWT } = process.env;

  if (!MINHA_CHAVE_JWT) {
    return res.status(500).json({ error: "ENV JWT não informado!" });
  }
  if (req.method === "POST") {
    const { login, senha } = req.body;
    const usuarioEncontrados = await usuarioModel.find({
      email: login,
      senha: md5(senha)
    });

    if (usuarioEncontrados && usuarioEncontrados.length > 0) {
      const usuarioEncontrado = usuarioEncontrados[0];

      const token = jwt.sign({ _id: usuarioEncontrado._id }, MINHA_CHAVE_JWT);

      return res.status(200).json({
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        token
      });
    } else {
      return res.status(400).json({ error: "Usuário ou senha não encontrado" });
    }
  }
  return res.status(405).json({ error: "Método informado não e válido" });
};

export default conectarMongoDB(endpointLogin);
