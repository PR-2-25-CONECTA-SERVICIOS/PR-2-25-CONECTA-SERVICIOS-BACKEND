import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
