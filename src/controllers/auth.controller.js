import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// REGISTRO DE USUARIO
export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, password, telefono } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
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
    console.error("Error en el registro:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
