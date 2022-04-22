import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;

    if (login === "admin@admin.com" && senha === "Admin@123") {
      res.status(200).json({ msg: "Usuário autenticado com sucesso !" });
    } else {
      return res.status(400).json({ error: "Usuário ou senha não encontrado" });
    }
  }
  return res.status(405).json({ error: "Método informado não e válido" });
};
