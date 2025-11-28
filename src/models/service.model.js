import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 👈 CAMBIO REAL
  comentario: String,
  calificacion: Number,
  fecha: { type: Date, default: Date.now },
});

const serviceSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  descripcion: String,
  precio: String,
  direccion: String,
  telefono: String,
  disponible: Boolean,
  calificacion: Number,
  opiniones: Number,
  imagen: String,
  galeria: [String],
  especialidades: [String],
  horas: String,

  propietarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // ✔ SOLO ESTE

  reseñas: [reviewSchema],
});



export default mongoose.model("Service", serviceSchema);
