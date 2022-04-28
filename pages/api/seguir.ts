import { politicaCORS } from "./../../src/middlewares/politicaCORS";
import { seguidorModel } from "./../../src/models/seguidorModel";
import { usuarioModel } from "../../src/models/usuarioModel";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../src/middlewares/validarTokenJWT";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";

const seguirEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req?.query;

      const usuarioLogado = await usuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ error: "Usuário logado nao encontrado" });
      }

      const usuarioASerSeguido = await usuarioModel.findById(id);
      if (!usuarioASerSeguido) {
        return res
          .status(400)
          .json({ error: "Usuário a ser seguido nao encontrado" });
      }

      const euJaSigoEsseUsuario = await seguidorModel.find({
        usuarioId: usuarioLogado._id,
        usuarioSeguidoId: usuarioASerSeguido._id
      });
      if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
        euJaSigoEsseUsuario.forEach(
          async (e: any) =>
            await seguidorModel.findByIdAndDelete({ _id: e._id })
        );

        usuarioLogado.seguindo--;
        await usuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        );
        usuarioASerSeguido.seguidores--;
        await usuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido
        );

        return res
          .status(200)
          .json({ msg: "Deixou de seguir o usuário com sucesso" });
      } else {
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioSeguidoId: usuarioASerSeguido._id
        };
        await seguidorModel.create(seguidor);

        usuarioLogado.seguindo++;
        await usuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        );

        usuarioASerSeguido.seguidores++;
        await usuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido
        );

        return res.status(200).json({ msg: "Usuário seguido com sucesso!" });
      }
    }

    return res.status(405).json({ error: "Método informado nao existe" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Ocorreu um erro na hora de seguir" });
  }
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(seguirEndpoint)));
