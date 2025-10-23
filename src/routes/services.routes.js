import express from "express";
import {
  getAllServices,
  searchServices,
  getHighlightedServices,
  getServiceById,
  createServiceRequest,
} from "../controllers/services.controller.js";

const router = express.Router();

// Catálogo general
router.get("/", getAllServices);
router.get("/search", searchServices);
router.get("/destacados", getHighlightedServices);

// Detalle de servicio
router.get("/:id", getServiceById);

// Enviar solicitud
router.post("/:id/solicitud", createServiceRequest);

export default router;
