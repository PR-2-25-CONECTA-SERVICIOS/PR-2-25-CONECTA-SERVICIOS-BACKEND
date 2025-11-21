import express from "express";
import {
  getAllLocales,
  searchLocales,
  getFeaturedLocales,
  createLocal,
  getLocalById,
  claimLocal,
  updateLocal,
  deleteLocal,
  getAllClaims,
  updateClaimStatus,
  completarLocal   // ⬅️ FALTA ESTA IMPORTACIÓN
} from "../controllers/locales.controller.js";


const router = express.Router();

router.get("/", getAllLocales);
router.get("/search", searchLocales);
router.get("/destacados", getFeaturedLocales);
router.post("/", createLocal);

// 🔥 RUTA COMPLETAR — DEBE IR ANTES DE CUALQUIER ":id"
router.patch("/:id/completar", completarLocal);

router.get("/reclamos/todos", getAllClaims);
router.patch("/:localId/reclamos/:claimId", updateClaimStatus);

// 🔥 ESTAS DEBEN IR ABAJO SIEMPRE
router.get("/:id", getLocalById);
router.post("/:id/reclamar", claimLocal);
router.patch("/:id", updateLocal);
router.delete("/:id", deleteLocal);

export default router;
