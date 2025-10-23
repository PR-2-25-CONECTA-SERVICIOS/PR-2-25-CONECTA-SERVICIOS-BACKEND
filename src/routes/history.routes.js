import express from "express";
import { getUserHistory, rateService, repeatService } from "../controllers/history.controller.js";

const router = express.Router();

// Obtener historial del usuario
router.get("/:userId", getUserHistory);

// Calificar un servicio
router.post("/rate/:requestId", rateService);

// Repetir un servicio (crear nueva solicitud)
router.post("/repeat/:requestId", repeatService);

export default router;
