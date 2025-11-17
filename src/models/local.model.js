import mongoose from "mongoose";

// Subdocumento para los horarios
const hoursSchema = new mongoose.Schema(
  {
    mon: { open: String, close: String },
    tue: { open: String, close: String },
    wed: { open: String, close: String },
    thu: { open: String, close: String },
    fri: { open: String, close: String },
    sat: { open: String, close: String },
    sun: { open: String, close: String },
  },
  { _id: false }
);

// Esquema principal del local
const localSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },

    telefono: { type: String },
    direccion: { type: String },

    lat: { type: Number, required: true },     // ✅ añadido
    lng: { type: Number, required: true },     // ✅ añadido

    imagen: { type: String },
    calificacion: { type: Number, default: 0 },
    reseñas: { type: Number, default: 0 },
    distancia: { type: String },

    verificado: { type: Boolean, default: false },
    destacado: { type: Boolean, default: false },

    horas: { type: hoursSchema, required: false, default: {} },

    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    reclamos: [
      {
        nombrePropietario: String,
        correo: String,
        telefono: String,
        mensaje: String,
        documentos: [String],
        estado: { type: String, default: "pendiente" },
        fecha: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Local", localSchema);
