import { usuarioModel } from "./../../src/models/usuarioModel";
import { publicacaoModel } from "./../../src/models/publicacaoModel";
import { conectarMongoDB } from "./../../src/middlewares/conectarMongoDB";
import { validarTokenJWT } from "./../../src/middlewares/validarTokenJWT";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";

const likeEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const { id } = req?.query;
      const publicacao = await publicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ error: "Publicação nao encontrada" });
      }

      const { userId } = req?.query;
      const usuario = await usuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ error: "Usuário nao encontrada" });
      }

      const indexDoUsuarioNoLike = publicacao.likes.findIndex(
        (e: any) => e.toString() === usuario._id.toString()
      );

      if (indexDoUsuarioNoLike != -1) {
        publicacao.likes.splice(indexDoUsuarioNoLike, 1);
        await publicacaoModel.findByIdAndUpdate(
          { _id: publicacao._id },
          publicacao
        );
        return res
          .status(200)
          .json({ msg: "Publicação descurtida com sucesso" });
      } else {
        publicacao.likes.push(usuario._id);
        await publicacaoModel.findByIdAndUpdate(
          { _id: publicacao._id },
          publicacao
        );
        return res.status(200).json({ msg: "Publicação curtida com sucesso" });
      }
    }

    return res.status(405).json({ error: "Método informado nao e valido" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "Ocorreu erro ao curtir/descurtir uma publicação" });
  }
};

export default validarTokenJWT(conectarMongoDB(likeEndpoint));
