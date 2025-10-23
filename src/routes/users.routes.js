import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addUserService,
  deleteUserService,
  completeLocalRegistration,
  logoutUser,
} from "../controllers/users.controller.js";

const router = express.Router();

/* ===============================
   RUTAS DE USUARIOS
================================= */

// 🔹 Perfil del usuario
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

// 🔹 Servicios asociados al usuario
router.post("/:id/servicios", addUserService);
router.delete("/:id/servicios/:serviceId", deleteUserService);

// 🔹 Completar registro del local
router.put("/locales/:localId/completar", completeLocalRegistration);

// 🔹 Cerrar sesión
router.post("/logout", logoutUser);

export default router;
