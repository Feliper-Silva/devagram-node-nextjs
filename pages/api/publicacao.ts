import type { NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";

import nc from "next-connect";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../src/middlewares/validarTokenJWT";

import {
  upload,
  uploadImagemCosmic
} from "../../src/services/uploadImagemCosmic";
import { publicacaoModel } from "../../src/models/publicacaoModel";
import { usuarioModel } from "../../src/models/usuarioModel";
import { imageOptimizer } from "next/dist/server/image-optimizer";

const handler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<RespostasPadraoMsg>) => {
    try {
      const { userId } = req.query;
      const usuario = await usuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado!" });
      }

      if (!req || !req.body) {
        return res
          .status(400)
          .json({ error: "Parâmetros de entrada não informados!" });
      }
      const { description } = req?.body;

      if (!description || description.length < 1) {
        return res.status(400).json({ error: "Descrição não e válida" });
      }
      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ error: "A imagem é obrigatória!" });
      }

      const image = await uploadImagemCosmic(req);
      const publicacao = {
        idUsuario: usuario.id,
        description,
        foto: image.media.url,
        data: new Date()
      };

      usuario.publicacoes++;
      await usuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);

      await publicacaoModel.create(publicacao);

      return res.status(200).json({ msg: "Publicação criada com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao cadastrar publicação!" });
    }
  });

export const config = {
  api: {
    bodyParser: false
  }
};
export default validarTokenJWT(conectarMongoDB(handler));
