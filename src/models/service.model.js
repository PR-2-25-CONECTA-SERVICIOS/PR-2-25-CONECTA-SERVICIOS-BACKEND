import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  usuario: String,
  comentario: String,
  calificacion: Number,
  fecha: { type: Date, default: Date.now },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: String, required: true },
  direccion: { type: String },
  telefono: { type: String },
  disponible: { type: Boolean, default: true },
  calificacion: { type: Number, default: 0 },
  opiniones: { type: Number, default: 0 },
  imagen: { type: String },
  galeria: [String],
  especialidades: [String],
  horas: { type: String },
  propietario: {
    nombre: String,
    foto: String,
    experiencia: String,
    verificado: Boolean,
  },
  reseñas: [reviewSchema],
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
