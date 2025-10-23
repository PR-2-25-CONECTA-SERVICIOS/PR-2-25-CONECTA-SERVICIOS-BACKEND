import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  servicioPrincipal: { type: String, required: true },
  categoria: { type: String, required: true },
  telefono: { type: String },
  experiencia: { type: String },
  verificado: { type: Boolean, default: false },
  activo: { type: Boolean, default: true },
  calificacion: { type: Number, default: 0 },
  reseñas: { type: Number, default: 0 },
  trabajosCompletados: { type: Number, default: 0 },
  tiempoRespuesta: { type: String, default: "15 min promedio" },
  avatar: { type: String },
  serviciosOfrecidos: [String], // ej: ["Reparación de grifos", "Destape de tuberías"]
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);
