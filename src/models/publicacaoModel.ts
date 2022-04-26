import mongoose, { Schema } from "mongoose";

const publicacaoSchema = new Schema({
  idUsuario: { type: String, required: true },
  description: { type: String, required: true },
  foto: { type: String, required: true },
  data: { type: String, required: true },
  comentarios: { type: Array, required: true, default: [] },
  likes: { type: Array, required: true, default: [] }
});

export const publicacaoModel =
  mongoose.models.publicacao || mongoose.model("publicacao", publicacaoSchema);
