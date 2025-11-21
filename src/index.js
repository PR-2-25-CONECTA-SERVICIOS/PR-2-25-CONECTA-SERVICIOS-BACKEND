import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// RUTAS
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import localRoutes from "./routes/locales.routes.js";
import providerRoutes from "./routes/providers.routes.js";
import historyRoutes from "./routes/history.routes.js";
import userRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/categories.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviceRoutes);
app.use("/api/locales", localRoutes);
app.use("/api/proveedores", providerRoutes);
app.use("/api/historial", historyRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categorias", categoryRoutes); 

// CONEXIÓN
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado");

    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  } catch (err) {
    console.error("Error al conectar Mongo:", err);
    process.exit(1);
  }
}
connectDB();
