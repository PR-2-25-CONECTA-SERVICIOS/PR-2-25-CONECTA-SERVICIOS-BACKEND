import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/* ===============================
   🔹 REGISTRO DE USUARIO
================================= */
export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, password, telefono } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      correo,
      password: hashedPassword,
      telefono: telefono || null,
    });

    await newUser.save();

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: newUser._id,
        nombre: newUser.nombre,
        correo: newUser.correo,
      },
    });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

/* ===============================
   🔹 LOGIN DE USUARIO
================================= */
export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // (Más adelante aquí podrías generar un JWT si lo necesitas)
    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: user._id,
                _id: user._id,   // 👈 ESTA LÍNEA ARREGLA TODO

        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
