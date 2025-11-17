import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addUserService,
  updateUserService,
  deleteUserService,
  completeLocalRegistration,
  logoutUser,
  getUserRequests,
} from "../controllers/users.controller.js";

const router = express.Router();

// 📜 Historial del usuario
router.get("/:id/solicitudes", getUserRequests);

// 📘 Perfil
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

// ⚙️ Servicios del usuario
router.post("/:id/servicios", addUserService);
router.put("/:id/servicios/:serviceId", updateUserService);
router.delete("/:id/servicios/:serviceId", deleteUserService);

// 🏪 Locales
router.put("/locales/:localId/completar", completeLocalRegistration);

// 🚪 Logout
router.post("/logout", logoutUser);

export default router;
