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
} from "../controllers/locales.controller.js";

const router = express.Router();

router.get("/", getAllLocales); // GET todos
router.get("/search", searchLocales); // GET búsqueda
router.get("/destacados", getFeaturedLocales); // GET destacados
router.post("/", createLocal); // POST crear
router.get("/:id", getLocalById); // GET detalle
router.post("/:id/reclamar", claimLocal); // POST reclamo
router.patch("/:id", updateLocal); // PATCH actualizar
router.delete("/:id", deleteLocal); // DELETE eliminar
router.get("/reclamos/todos", getAllClaims);
router.patch("/:localId/reclamos/:claimId", updateClaimStatus);

export default router;
