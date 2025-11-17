import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String },

  rol: {
    type: String,
    enum: ["usuario", "negocio", "admin"],
    default: "usuario",
  },

  // Datos del perfil
  avatar: { type: String },
  verificado: { type: Boolean, default: false },
  calificacion: { type: Number, default: 0 },
  reseñas: { type: Number, default: 0 },

  // Relaciones
  servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  locales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Local" }],

}, { timestamps: true });

export default mongoose.model("User", userSchema);
