import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para registrar usuario
router.post("/register", registerUser);

export default router;
