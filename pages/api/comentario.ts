import { usuarioModel } from "./../../src/models/usuarioModel";
import { validarTokenJWT } from "./../../src/middlewares/validarTokenJWT";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";
import { publicacaoModel } from "../../src/models/publicacaoModel";

const comentarioEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req.query;
      const usuarioLogado = await usuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      const publicacao = await publicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ error: "Publicação não encontrada" });
      }
      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        return res.status(400).json({ error: "Comentário não e válido!" });
      }
      const comentario = {
        usuarioId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        comentario: req.body.comentario
      };

      publicacao.comentarios.push(comentario);
      await publicacaoModel.findByIdAndUpdate(
        { _id: publicacao._id },
        publicacao
      );
      return res.status(200).json({ msg: "Comentario adicionado com sucesso" });
    }
    return res.status(500).json({ error: "Método informado não e válido!" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "Ocorreu algum erro ao adicionar o comentário" });
  }
};

export default validarTokenJWT(conectarMongoDB(comentarioEndpoint));
