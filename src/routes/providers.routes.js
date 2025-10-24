import express from "express";
import {
  getAllProviders,
  createProvider,
  getProviderProfile,
  updateProviderProfile,
  toggleProviderStatus,
  getProviderRequests,
  updateRequestStatus,
  getProviderStats,
  deleteProvider
} from "../controllers/providers.controller.js";

const router = express.Router();

// CRUD base
router.get("/", getAllProviders);
router.post("/", createProvider);
router.get("/:id", getProviderProfile);
router.put("/:id", updateProviderProfile);
router.delete("/:id", deleteProvider);

// Estado y estadísticas
router.patch("/:id/toggle", toggleProviderStatus);
router.get("/:id/estadisticas", getProviderStats);

// Solicitudes
router.get("/:id/solicitudes", getProviderRequests);
router.patch("/solicitudes/:requestId", updateRequestStatus);

export default router;
