import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import localRoutes from "./routes/locales.routes.js";
import providerRoutes from "./routes/providers.routes.js";
import historyRoutes from "./routes/history.routes.js";
import userRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ==================== 🔹 MIDDLEWARES ====================
app.use(cors());
app.use(express.json());

// ==================== 🔹 RUTAS ====================
app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviceRoutes);
app.use("/api/locales", localRoutes);
app.use("/api/proveedores", providerRoutes);
app.use("/api/historial", historyRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/admin", adminRoutes);

// ==================== 🔹 CONEXIÓN A MONGO ====================
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado correctamente a MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
}
connectDB();

// ==================== 🔹 RUTA DE PRUEBA ====================
app.get("/", (_req, res) => {
  res.send("🚀 API Conecta Servicios Backend funcionando correctamente con MongoDB Atlas");
});

// ==================== 🔹 HEALTHCHECK ====================
app.get("/health", (_req, res) => {
  const state =
    ["desconectado", "conectando", "conectado", "desconectando"][
      mongoose.connection.readyState
    ] || "desconocido";
  res.json({ db: state });
});

// ==================== 🔹 CIERRE LIMPIO ====================
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 Conexión a MongoDB cerrada");
  process.exit(0);
});
