import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMsg } from "../../src/types/respostaPadraoMsg";
import type { CadastroRequisicao } from "../../src/types/cadastroRequisicao";
import { usuarioModel } from "../../src/models/usuarioModel";
import { conectarMongoDB } from "../../src/middlewares/conectarMongoDB";

import md5 from "md5";

const endpointCadastro = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMsg>
) => {
  if (req.method === "POST") {
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
    //válidação
    const usuarioComMesmoEmail = await usuarioModel.find({
      email: usuario.email
    });
    if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
      return res
        .status(400)
        .json({ error: "Já existe uma conta com email informado!" });
    }

    //salvar no banco de dados
    const usuarioASerSalvo = {
      nome: usuario.nome,
      email: usuario.email,
      senha: md5(usuario.senha)
    };
    await usuarioModel.create(usuarioASerSalvo);
    return res.status(200).json({ msg: " usuário criado com sucesso!" });
  }
  return res.status(405).json({ error: "Método informado não e válido" });
};

export default conectarMongoDB(endpointCadastro);
