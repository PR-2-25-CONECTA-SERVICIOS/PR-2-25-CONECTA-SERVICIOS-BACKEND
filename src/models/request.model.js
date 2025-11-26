import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  servicio: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  descripcion: { type: String }, // ejemplo: “reparación de tubería”
  precio: { type: String },
  categoria: { type: String },
  estado: {
    type: String,
    enum: ["pendiente", "aceptado", "finalizado", "cancelado"],
    default: "pendiente",
  },
  calificacion: { type: Number },
  reseña: { type: String },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaCita: { type: String },
  horaCita: { type: String },
  imagen: { type: String },
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
