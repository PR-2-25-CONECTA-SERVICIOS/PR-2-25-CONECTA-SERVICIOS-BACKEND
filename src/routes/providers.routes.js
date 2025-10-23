import express from "express";
import {
  getProviderProfile,
  updateProviderProfile,
  toggleProviderStatus,
  getProviderRequests,
  updateRequestStatus,
} from "../controllers/providers.controller.js";

const router = express.Router();

// Perfil y estado
router.get("/:id", getProviderProfile);
router.put("/:id", updateProviderProfile);
router.patch("/:id/toggle", toggleProviderStatus);

// Solicitudes de clientes
router.get("/:id/solicitudes", getProviderRequests);
router.patch("/solicitudes/:requestId", updateRequestStatus);

export default router;
