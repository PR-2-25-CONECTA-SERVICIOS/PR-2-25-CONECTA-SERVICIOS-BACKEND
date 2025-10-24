import express from "express";
import {
  getAllServices,
  searchServices,
  getHighlightedServices,
  getServiceById,
  createServiceRequest,
  deleteService,
  toggleAvailability,
  addReview,
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

//ELIMINAR SERVICIO
router.delete("/:id", deleteService);

// Cambiar disponibilidad del servicio
router.patch("/:id/toggle", toggleAvailability);

// AGREGAR RESEÑA Y CALIFICAION
router.post("/:id/review", addReview);

export default router;
