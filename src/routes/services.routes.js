import { Router } from "express";
import {
  // EXISTENTES EN TU CÓDIGO
  getAllServices,
  searchServices,
  getHighlightedServices,
  getServiceById,
  createServiceRequest,
  deleteService,
  toggleAvailability,
  addReview,
  // NUEVOS (ABAJITO TE DEJO LA IMPLEMENTACIÓN)
  createService,
  updateService
} from "../controllers/services.controller.js";
import {
  getServiceRequests,
  updateRequestStatus,
  assignAppointment,
  reviewServiceRequest,
} from "../controllers/services.controller.js";

const router = Router();

// LISTAR / BUSCAR / DESTACADOS / DETALLE
router.get("/", getAllServices);                    // GET  /api/servicios
router.get("/buscar", searchServices);              // GET  /api/servicios/buscar?q=&categoria=
router.get("/destacados", getHighlightedServices);  // GET  /api/servicios/destacados
router.get("/:id", getServiceById);                 // GET  /api/servicios/:id

router.get("/:id/solicitudes", getServiceRequests);

// Cambiar estado
router.patch("/:id/solicitudes/:solicitudId", updateRequestStatus);

// Asignar cita (fecha y hora)
router.patch("/solicitudes/:solicitudId/appointment", assignAppointment);

// Calificar servicio tras finalizar
router.post("/solicitudes/:solicitudId/review", reviewServiceRequest);
// CRUD
router.post("/", createService);                    // POST   /api/servicios
router.patch("/:id", updateService);                // PATCH  /api/servicios/:id
router.delete("/:id", deleteService);               // DELETE /api/servicios/:id

// ACCIONES
router.patch("/:id/toggle", toggleAvailability);    // PATCH  /api/servicios/:id/toggle
router.post("/:id/reviews", addReview);             // POST   /api/servicios/:id/reviews
  router.post("/:id/solicitud", createServiceRequest);// POST   /api/servicios/:id/solicitud

export default router;
