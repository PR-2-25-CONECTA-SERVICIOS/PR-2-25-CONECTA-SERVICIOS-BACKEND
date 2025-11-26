import { Router } from "express";
import {
  getAllServices,
  searchServices,
  getHighlightedServices,
  getServiceById,
  createServiceRequest,
  deleteService,
  toggleAvailability,
  addReview,
  createService,
  updateService,
  getServiceRequests,
  updateRequestStatus,
  assignAppointment,
  reviewServiceRequest,
} from "../controllers/services.controller.js";

const router = Router();

/* ---------------------------------------------
   ⚠️ ORDEN CORRECTO (Rutas específicas primero)
-----------------------------------------------*/

// ⭐ Calificar una solicitud
router.post("/solicitudes/:solicitudId/review", reviewServiceRequest);

// ⭐ Asignar cita
router.patch("/solicitudes/:solicitudId/appointment", assignAppointment);

// ⭐ Solicitudes por servicio
router.get("/:id/solicitudes", getServiceRequests);

// ⭐ Cambiar estado
router.patch("/:id/solicitudes/:solicitudId", updateRequestStatus);

// ⭐ Crear solicitud
router.post("/:id/solicitud", createServiceRequest);

// ⭐ Agregar reseña manual al servicio
router.post("/:id/reviews", addReview);

// ------------------------------
// LISTAR / BUSCAR / DESTACADOS
// ------------------------------
router.get("/", getAllServices);
router.get("/buscar", searchServices);
router.get("/destacados", getHighlightedServices);

// -------------------------------------
// ⚠️ ESTA VA AL FINAL SIEMPRE
// -------------------------------------
router.get("/:id", getServiceById);

// CRUD
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

// Toggle disponibilidad
router.patch("/:id/toggle", toggleAvailability);

export default router;
