import express from "express";
import {
  getAllLocales,
  searchLocales,
  getFeaturedLocales,
  createLocal,
  getLocalById,
  claimLocal,
} from "../controllers/locales.controller.js";

const router = express.Router();

// 📍 Listar todos los locales
router.get("/", getAllLocales);

// 🔍 Buscar locales por nombre o categoría
router.get("/search", searchLocales);

// 🌟 Locales destacados
router.get("/destacados", getFeaturedLocales);

// 🏢 Crear nuevo local
router.post("/", createLocal);

// 🔎 Obtener detalles de un local específico
router.get("/:id", getLocalById);

// 🧾 Enviar reclamo de negocio
router.post("/:id/reclamar", claimLocal);

export default router;
