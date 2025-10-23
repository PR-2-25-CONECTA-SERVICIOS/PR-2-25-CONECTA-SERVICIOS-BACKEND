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
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/paginas-amarillas";

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviceRoutes);
app.use("/api/locales", localRoutes);
app.use("/api/proveedores", providerRoutes);
app.use("/api/historial", historyRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/admin", adminRoutes);

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API Páginas Amarillas Backend funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
