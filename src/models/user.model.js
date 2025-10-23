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

  // 🔹 Datos del perfil:
  avatar: { type: String }, // foto del usuario o logo del negocio
  verificado: { type: Boolean, default: false },
  calificacion: { type: Number, default: 0 },
  reseñas: { type: Number, default: 0 },

  // 🔹 Relaciones con otros modelos:
  servicios: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service" } // servicios que ofrece
  ],
  locales: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Local" } // locales que registró
  ],

}, { timestamps: true });

export default mongoose.model("User", userSchema);
