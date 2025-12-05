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

    telefono: String,
    direccion: String,

    lat: { type: Number, required: true },
    lng: { type: Number, required: true },

    imagen: String,
    calificacion: { type: Number, default: 0 },
    reseñas: { type: Number, default: 0 },

    verificado: { type: Boolean, default: false },
    destacado: { type: Boolean, default: false },

    horas: { type: hoursSchema, default: {} },

    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🔥 estos 4 campos faltaban
    url: String,
    fotos: { type: [String], default: [] },
    servicios: { type: [String], default: [] },
    tagsEspeciales: { type: [String], default: [] },

reclamos: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 👈 NUEVO
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
