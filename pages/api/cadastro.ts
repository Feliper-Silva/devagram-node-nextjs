import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import type { CadastroRequisicao } from "../../src/types/cadastroRequisicao";
import { usuarioModel } from "../../src/models/usuarioModel";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";

import md5 from "md5";

import {
  upload,
  uploadImagemCosmic
} from "../../src/services/uploadImagemCosmic";
import nc from "next-connect";
import { politicaCORS } from "../../src/middlewares/politicaCORS";

const handler = nc()
  .use(upload.single("file"))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMsg>) => {
      try {
        const usuario = req.body as CadastroRequisicao;

        if (!usuario.nome || usuario.nome.length < 2) {
          return res.status(400).json({ error: "Nome inválido" });
        }
        if (
          !usuario.email ||
          usuario.email.length < 5 ||
          !usuario.email.includes("@") ||
          !usuario.email.includes(".")
        ) {
          return res.status(400).json({ error: "Email inválido" });
        }
        if (!usuario.senha || usuario.senha.length < 4) {
          return res.status(400).json({ error: "senha inválida" });
        }
        //validação
        const usuarioComMesmoEmail = await usuarioModel.find({
          email: usuario.email
        });
        if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
          return res
            .status(400)
            .json({ error: "Já existe uma conta com email informado!" });
        }

        //enviar a imagem do multer para o cosmic

        const image = await uploadImagemCosmic(req);

        //salvar no banco de dados
        const usuarioASerSalvo = {
          nome: usuario.nome,
          email: usuario.email,
          senha: md5(usuario.senha),
          avatar: image?.media?.url
        };
        await usuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({ msg: " usuário criado com sucesso!" });
      } catch (e: any) {
        return res.status(400).json({ error: e.toString() });
      }
    }
  );

export const config = {
  api: {
    bodyParser: false
  }
};

export default politicaCORS(conectarMongoDB(handler));
