import { usuarioModel } from "./../../src/models/usuarioModel";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import { validarTokenJWT } from "../../src/middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";
import nc from "next-connect";
import {
  upload,
  uploadImagemCosmic
} from "../../src/services/uploadImagemCosmic";

const handler = nc()
  .use(upload.single("file"))
  .put(async (req: any, res: NextApiResponse<RespostasPadraoMsg>) => {
    try {
      const { userId } = req?.query;
      const usuario = await usuarioModel.findById(userId);

      if (!usuario) {
        return res.status(400).json({ error: "Usuário nao encontrado" });
      }

      const { nome } = req?.body;
      if (nome && nome.length > 2) {
        usuario.nome = nome;
      }

      const { file } = req;
      if (file && file.originalname) {
        const image = await uploadImagemCosmic(req);
        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url;
        }
      }

      await usuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);

      return res.status(200).json({ msg: "Usuário alterado com sucesso" });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ error: "Nao foi possível atualizar usuario:" + e });
    }
  })
  .get(
    async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMsg>) => {
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
    }
  );

export const config = {
  api: {
    bodyParser: false
  }
};

export default validarTokenJWT(conectarMongoDB(handler));
