import express from "express";
import {
  getAllClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
} from "../controllers/admin.controller.js";

const router = express.Router();

// 📋 Obtener todos los reclamos
router.get("/reclamos", getAllClaims);

// 🔍 Ver detalle de un reclamo
router.get("/reclamos/:localId/:claimId", getClaimById);

// ✅ Aprobar reclamo
router.patch("/reclamos/:localId/:claimId/aprobar", approveClaim);

// ❌ Rechazar reclamo
router.patch("/reclamos/:localId/:claimId/rechazar", rejectClaim);

export default router;
